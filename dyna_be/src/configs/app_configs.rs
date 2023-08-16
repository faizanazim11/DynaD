use dotenv::dotenv;
use once_cell::sync::Lazy;
use std::env;

#[derive(Debug)]
pub struct AppConfig {
    pub base_paths: Vec<String>,
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
        AppConfig {
            base_paths: base_paths_vec,
        }
    }
}

pub static APP_CONFIG: Lazy<AppConfig> = Lazy::new(|| AppConfig::new());

pub fn get_base_paths() -> Vec<String> {
    APP_CONFIG.base_paths.clone()
}
