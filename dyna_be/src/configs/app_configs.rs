use axum::http::HeaderValue;
use dotenv::dotenv;
use once_cell::sync::Lazy;
use std::env;

#[derive(Debug)]
pub struct AppConfig {
    pub base_paths: Vec<String>,
    pub port: u16,
    pub cors_origins: Vec<String>,
}

impl AppConfig {
    pub fn new() -> AppConfig {
        dotenv().ok();
        println!("Loading config");
        let key = "BASE_PATHS";
        match env::var(key) {
            Ok(val) => println!("{key}: {val:?}"),
            Err(e) => println!("couldn't interpret {key}: {e}"),
        }
        let base_paths_str = env::var("BASE_PATHS").unwrap_or("".to_string());
        let base_paths: Vec<&str> = base_paths_str.split(",").collect();
        let base_paths_filtered = base_paths.iter().map(|s| s.trim()).collect::<Vec<&str>>();
        let mut base_paths_vec: Vec<String> = Vec::new();
        for base_path in &base_paths_filtered {
            base_paths_vec.push(String::from(*base_path));
        }
        let port = env::var("PORT").unwrap_or("8080".to_string());
        let port = port.parse::<u16>().unwrap_or(8080);
        let cors_origins_str = env::var("CORS_ORIGINS").unwrap_or("".to_string());
        let cors_origins: Vec<&str> = cors_origins_str.split(",").collect();
        let cors_origins_filtered = cors_origins.iter().map(|s| s.trim()).collect::<Vec<&str>>();
        let mut cors_origins_vec: Vec<String> = Vec::new();
        for cors_origin in &cors_origins_filtered {
            cors_origins_vec.push(String::from(*cors_origin));
        }
        AppConfig {
            base_paths: base_paths_vec,
            port,
            cors_origins: cors_origins_vec,
        }
    }
}

pub static APP_CONFIG: Lazy<AppConfig> = Lazy::new(|| AppConfig::new());

pub fn get_base_paths() -> Vec<String> {
    APP_CONFIG.base_paths.clone()
}

pub fn get_port() -> u16 {
    APP_CONFIG.port
}

pub fn get_cors_origins() -> Vec<HeaderValue> {
    let mut cors_origins: Vec<HeaderValue> = Vec::new();
    for cors_origin in &APP_CONFIG.cors_origins {
        cors_origins.push(
            cors_origin
                .parse::<axum::http::HeaderValue>()
                .unwrap_or(HeaderValue::from_static("")),
        );
    }
    cors_origins
}
