pub mod configs;
pub mod handlers;
pub mod routes;
pub mod schemas;
use std::net::SocketAddr;

use tower_http::cors::Any;

use crate::routes::file_routes::files_routes;

#[tokio::main]
async fn main() {
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("=====>Listening on {addr}\n");
    let origins = [
        "http://localhost:3000"
            .parse::<axum::http::HeaderValue>()
            .unwrap(),
        "http://192.168.0.113:3000"
            .parse::<axum::http::HeaderValue>()
            .unwrap(),
    ];
    axum::Server::bind(&addr)
        .serve(
            files_routes()
            .layer(
                tower_http::cors::CorsLayer::new()
                .allow_origin(origins)
                .allow_methods([axum::http::Method::GET, axum::http::Method::OPTIONS, axum::http::Method::CONNECT])
                .allow_headers(Any),
            )
            .layer(tower_http::trace::TraceLayer::new_for_http())
                .into_make_service(),
        )
        .await
        .unwrap();
}
