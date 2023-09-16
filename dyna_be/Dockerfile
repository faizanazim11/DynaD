FROM rust:1.71.1 AS builder
WORKDIR /usr/src/dyna_be
COPY . .
RUN cargo install --path .
FROM debian:bookworm-slim
RUN apt-get update & apt-get install -y extra-runtime-dependencies & rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/dyna_be /usr/local/bin/dyna_be
CMD ["dyna_be"]