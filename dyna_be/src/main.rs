pub mod configs;
pub mod handlers;
pub mod routes;
pub mod schemas;
use configs::app_configs::{get_cors_origins, get_port};
use std::net::SocketAddr;

use tower_http::cors::Any;

use crate::routes::file_routes::files_routes;

#[tokio::main]
async fn main() {
    let addr = SocketAddr::from(([0, 0, 0, 0], get_port()));
    println!("=====>Listening on {addr}\n");
    let origins = get_cors_origins();
    println!("=====>CORS origins: {origins:?}\n");
    axum::Server::bind(&addr)
        .serve(
            files_routes()
                .layer(
                    tower_http::cors::CorsLayer::new()
                        .allow_origin(origins)
                        .allow_methods([
                            axum::http::Method::GET,
                            axum::http::Method::OPTIONS,
                            axum::http::Method::CONNECT,
                        ])
                        .allow_headers(Any),
                )
                .layer(tower_http::trace::TraceLayer::new_for_http())
                .into_make_service(),
        )
        .await
        .unwrap();
}
