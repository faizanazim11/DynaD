"use client";

import NavBar from "app/navbar";
import ListView from "app/listview";
import { Box } from "@mui/material";
import FilesService from "@/services/files_service";
import { useState, useEffect } from "react";
import FolderCrumbs from "./foldercrumbs";

export default function Page() {
  const default_directory = {
    name: "Home",
    path: "",
    size: "",
    modified: "",
    created: "",
    accessed: "",
    read_only: "",
    file_type: "Home",
  };
  const [files, setFiles]: [any[], any] = useState([]);
  const [directories, setDirectories]: [any[], any] = useState([]);
  const [currentDirectory, setCurrentDirectory]: [any, any] =
    useState(default_directory);

  useEffect(() => {
    const files_service = new FilesService();
    files_service.get_listing().then((res: any[]) => {
      setFiles(res);
    });
  }, []);

  return (
    <Box>
      <NavBar />
      <FolderCrumbs
        directories={directories}
        setDirectories={setDirectories}
        currentDirectory={currentDirectory}
        setCurrentDirectory={setCurrentDirectory}
        setFiles={setFiles}
      />
      <ListView
        files={files}
        setFiles={setFiles}
        setCurrentDirectory={setCurrentDirectory}
        setDirectories={setDirectories}
        directories={directories}
        currentDirectory={currentDirectory}
      />
    </Box>
  );
}
