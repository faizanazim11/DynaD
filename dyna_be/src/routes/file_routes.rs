use crate::handlers::file_handlers::{get_file, get_roots};

use axum::{routing::get, Router};

pub fn files_routes() -> Router {
    let files_router = Router::new()
        .route("/list", get(get_roots))
        .route("/download", get(get_file));
    Router::new().nest("/files", files_router)
}
