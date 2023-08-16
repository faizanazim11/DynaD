use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum FileTypes {
    File,
    Folder,
    RootFolder,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct File {
    pub name: String,
    pub path: String,
    pub file_type: FileTypes,
    pub size: Option<String>,
    pub modified: Option<String>,
    pub created: Option<String>,
    pub accessed: Option<String>,
    pub read_only: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FilesListRequest {
    pub path: String,
    pub tz: Option<String>,
}
