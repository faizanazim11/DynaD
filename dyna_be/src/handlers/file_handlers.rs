use crate::configs::app_configs::get_base_paths;
use crate::schemas::file_schemas::{
    File, FileMetadata, FileTypes, FilesListRequest, GetFileRequest,
};
use axum::body::StreamBody;
use axum::extract::Query;
use axum::http::{header, StatusCode};
use axum::response::AppendHeaders;
use axum::{response::IntoResponse, Json};
use chrono::{DateTime, Utc};
use chrono_tz::{Tz, UTC};
use std::fs;
use std::path::Path;
use std::time::SystemTime;
use tokio_util::io::ReaderStream;

fn convert_to_human_readable(system_time: SystemTime, timezone: String) -> String {
    let timezone: Tz = timezone.parse().unwrap_or(UTC);
    let datetime: DateTime<Utc> = system_time.into();
    let datetime: DateTime<Tz> = datetime.with_timezone(&timezone);
    datetime.format("%Y-%m-%d %H:%M:%S").to_string()
}

fn safe_time_unwraper(
    system_time: Result<SystemTime, std::io::Error>,
    timezone: String,
) -> Option<String> {
    match system_time {
        Ok(time) => Some(convert_to_human_readable(time, timezone.clone())),
        Err(_) => None,
    }
}

fn get_metadata_contents(
    metadata: Option<fs::Metadata>,
    file_type: FileTypes,
    timezone: String,
) -> FileMetadata {
    match metadata {
        Some(meta) => FileMetadata {
            size: match file_type {
                FileTypes::File => Some(String::from(format!(
                    "{:.2} MB",
                    ((meta.len() as f64) / 1024.0 / 1024.0)
                ))),
                _ => None,
            },
            modified: safe_time_unwraper(meta.modified(), timezone.clone()),
            created: safe_time_unwraper(meta.created(), timezone.clone()),
            accessed: safe_time_unwraper(meta.accessed(), timezone.clone()),
            read_only: Some(meta.permissions().readonly()),
        },
        None => FileMetadata {
            size: None,
            modified: None,
            created: None,
            accessed: None,
            read_only: None,
        },
    }
}

fn create_file(
    name: String,
    path: String,
    file_type: FileTypes,
    metadata: Option<fs::Metadata>,
    timezone: String,
) -> File {
    let metadata_contents = get_metadata_contents(metadata, file_type.clone(), timezone.clone());
    File {
        name,
        path,
        file_type,
        size: metadata_contents.size,
        modified: metadata_contents.modified,
        created: metadata_contents.created,
        accessed: metadata_contents.accessed,
        read_only: metadata_contents.read_only,
    }
}

fn get_files(path: String, files: &mut Vec<File>, timezone: String) -> &Vec<File> {
    files.clear();
    let paths = fs::read_dir(path).unwrap();
    for path in paths {
        let path = path.unwrap().path();
        let is_dir = path.is_dir();
        let path_metadata = fs::metadata(path.as_path()).ok();
        files.push(create_file(
            path.file_name().unwrap().to_str().unwrap().to_string(),
            path.to_str().unwrap().to_string(),
            match is_dir {
                true => FileTypes::Folder,
                false => FileTypes::File,
            },
            path_metadata,
            timezone.clone(),
        ));
    }
    files
}

pub async fn get_roots(list_request: Option<Query<FilesListRequest>>) -> impl IntoResponse {
    let base_paths = get_base_paths();
    let file_request = list_request.unwrap_or_else(|| {
        Query(FilesListRequest {
            path: Some(String::from("")),
            tz: Some(String::from("UTC")),
        })
    });
    let file_path = match file_request.0.path.clone() {
        Some(path) => path,
        None => String::from(""),
    };
    let timezone = match file_request.0.tz.clone() {
        Some(tz) => tz,
        None => String::from("UTC"),
    };
    println!("file_path: {}", file_path);
    println!("timezone: {}", timezone);
    let mut files: Vec<File> = Vec::new();
    for path in base_paths {
        let path = Path::new(&path);
        let path_metadata = fs::metadata(path).ok();
        let path_string = path.to_str().unwrap().to_string();
        println!("path_string: {}", path_string);
        if file_path.starts_with(&path_string) {
            println!("path: {}", path_string);
            files = get_files(file_path, &mut files, timezone).to_vec();
            break;
        }
        files.push(create_file(
            path.file_name().unwrap().to_str().unwrap().to_string(),
            path_string,
            FileTypes::RootFolder,
            path_metadata,
            timezone.clone(),
        ));
    }
    return Json(files);
}

fn validate_path(path: String) -> bool {
    let base_paths = get_base_paths();
    for base_path in base_paths {
        let base_path = Path::new(&base_path);
        let base_path = base_path.to_str().unwrap().to_string();
        if path.starts_with(&base_path) {
            return true;
        }
    }
    false
}

pub async fn get_file(
    file_request: Option<Query<GetFileRequest>>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let file_request = file_request.unwrap_or_else(|| {
        Query(GetFileRequest {
            path: String::from(""),
        })
    });
    let file_path = file_request.0.path.clone();
    let file_path = Path::new(&file_path);
    if !validate_path(file_path.to_str().unwrap().to_string()) {
        return Err((
            StatusCode::FORBIDDEN,
            format!("Invalid path: {}", file_path.to_str().unwrap().to_string()),
        ));
    }
    let file_metadata = match fs::metadata(file_path).ok() {
        Some(metadata) => metadata,
        None => {
            return Err((
                StatusCode::NOT_FOUND,
                format!(
                    "File not found: {}",
                    file_path.to_str().unwrap().to_string()
                ),
            ))
        }
    };
    let file = match tokio::fs::File::open(file_path).await {
        Ok(file) => file,
        Err(err) => return Err((StatusCode::NOT_FOUND, format!("File not found: {}", err))),
    };
    let stream = ReaderStream::new(file);
    let body = StreamBody::new(stream);
    let file_size = file_metadata.len().to_string();
    let attatchment = format!(
        "attachment; filename={}",
        file_path.file_name().unwrap().to_str().unwrap().to_string()
    );
    let headers = AppendHeaders([
        (header::CONTENT_TYPE, "application/octet-stream"),
        (header::CONTENT_DISPOSITION, attatchment.as_str()),
        (header::CONTENT_LENGTH, file_size.as_str()),
        (header::CACHE_CONTROL, "no-cache"),
        (header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"),
    ]);
    Ok((headers, body).into_response())
}
