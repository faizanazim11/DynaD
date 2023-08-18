use crate::configs::app_configs::get_base_paths;
use crate::schemas::file_schemas::{File, FileTypes, FilesListRequest};
use axum::extract::Query;
use axum::{response::IntoResponse, Json};
use chrono::{DateTime, Utc};
use chrono_tz::{Tz, UTC};
use std::fs;
use std::path::Path;
use std::time::SystemTime;

fn convert_to_human_readable(system_time: SystemTime, timezone: Option<String>) -> String {
    let timezone: Tz = match timezone {
        Some(tz) => tz.parse().unwrap_or_else(|_| UTC),
        None => UTC,
    };
    let datetime: DateTime<Utc> = system_time.into();
    let datetime: DateTime<Tz> = datetime.with_timezone(&timezone);
    datetime.format("%Y-%m-%d %H:%M:%S").to_string()
}

fn get_files(path: String, files: &mut Vec<File>, timezone: Option<String>) -> &Vec<File> {
    files.clear();
    let paths = fs::read_dir(path).unwrap();
    for path in paths {
        let path = path.unwrap().path();
        let is_dir = path.is_dir();
        let path_metadata = fs::metadata(path.as_path()).ok();
        if is_dir {
            let subfolder = path.file_name().unwrap().to_str().unwrap().to_string();
            match path_metadata {
                Some(metadata) => {
                    let file = File {
                        name: subfolder.clone(),
                        path: path.as_path().to_str().unwrap().to_string(),
                        file_type: FileTypes::Folder,
                        size: None,
                        modified: Some(convert_to_human_readable(
                            metadata.modified().unwrap(),
                            timezone.clone(),
                        )),
                        created: Some(convert_to_human_readable(
                            metadata.created().unwrap(),
                            timezone.clone(),
                        )),
                        accessed: Some(convert_to_human_readable(
                            metadata.accessed().unwrap(),
                            timezone.clone(),
                        )),
                        read_only: Some(metadata.permissions().readonly()),
                    };
                    files.push(file);
                }
                None => {
                    let file = File {
                        name: subfolder.clone(),
                        path: path.as_path().to_str().unwrap().to_string(),
                        file_type: FileTypes::Folder,
                        size: None,
                        modified: None,
                        created: None,
                        accessed: None,
                        read_only: None,
                    };
                    files.push(file);
                }
            }
            continue;
        }
        match path_metadata {
            Some(metadata) => {
                let file: File = File {
                    name: path.file_name().unwrap().to_str().unwrap().to_string(),
                    path: path.as_path().to_str().unwrap().to_string(),
                    file_type: FileTypes::File,
                    size: Some(String::from(format!(
                        "{:.2} MB",
                        ((metadata.len() as f64) / 1024.0 / 1024.0)
                    ))),
                    modified: Some(convert_to_human_readable(
                        metadata.modified().unwrap(),
                        timezone.clone(),
                    )),
                    created: Some(convert_to_human_readable(
                        metadata.created().unwrap(),
                        timezone.clone(),
                    )),
                    accessed: Some(convert_to_human_readable(
                        metadata.accessed().unwrap(),
                        timezone.clone(),
                    )),
                    read_only: Some(metadata.permissions().readonly()),
                };
                files.push(file);
            }
            None => {
                let file: File = File {
                    name: path.file_name().unwrap().to_str().unwrap().to_string(),
                    path: path.as_path().to_str().unwrap().to_string(),
                    file_type: FileTypes::File,
                    size: None,
                    modified: None,
                    created: None,
                    accessed: None,
                    read_only: None,
                };
                files.push(file);
            }
        }
    }
    files
}

pub async fn get_roots(list_request: Option<Query<FilesListRequest>>) -> impl IntoResponse {
    let base_paths = get_base_paths();
    let file_request = list_request.unwrap_or_else(|| {
        Query(FilesListRequest {
            path: String::from(""),
            tz: Some(String::from("UTC")),
        })
    });
    let file_path = file_request.0.path.clone();
    let timezone = file_request.0.tz.clone();
    println!("file_path: {}", file_path);
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
        match path_metadata {
            Some(metadata) => {
                let file: File = File {
                    name: path.file_name().unwrap().to_str().unwrap().to_string(),
                    path: path.to_str().unwrap().to_string(),
                    file_type: FileTypes::RootFolder,
                    size: None,
                    modified: Some(convert_to_human_readable(
                        metadata.modified().unwrap(),
                        timezone.clone(),
                    )),
                    created: Some(convert_to_human_readable(
                        metadata.created().unwrap(),
                        timezone.clone(),
                    )),
                    accessed: Some(convert_to_human_readable(
                        metadata.accessed().unwrap(),
                        timezone.clone(),
                    )),
                    read_only: Some(metadata.permissions().readonly()),
                };
                files.push(file);
            }
            None => {
                let file: File = File {
                    name: path.file_name().unwrap().to_str().unwrap().to_string(),
                    path: path.to_str().unwrap().to_string(),
                    file_type: FileTypes::RootFolder,
                    size: None,
                    modified: None,
                    created: None,
                    accessed: None,
                    read_only: None,
                };
                files.push(file);
            }
        };
    }
    return Json(files);
}
