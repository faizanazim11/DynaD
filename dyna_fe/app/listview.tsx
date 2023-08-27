"use client";

import FilesService from "@/services/files_service";
import { Box, IconButton, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SvgIcon from "@mui/material/SvgIcon";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import React from "react";

export const MOBILE_COLUMNS = {
  name: true,
  size: true,
  modified: false,
  created: false,
  accessed: false,
  read_only: false,
};
export const ALL_COLUMNS = {
  name: true,
  size: true,
  modified: true,
  created: true,
  accessed: true,
  read_only: true,
};

export default function ListView({
  files,
  setFiles,
  directories,
  setDirectories,
  currentDirectory,
  setCurrentDirectory,
}: {
  files: Array<any>;
  setFiles: any;
  directories: Array<any>;
  setDirectories: any;
  currentDirectory: any;
  setCurrentDirectory: any;
}) {
  const update_files = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const files_service = new FilesService();
    const currentTarget = e.currentTarget as HTMLButtonElement;
    files_service
      .get_listing(currentTarget.getAttribute("data-path-value") ?? "")
      .then((res: any[]) => {
        setFiles(res);
        const currentRow: any =
          JSON.parse(currentTarget.getAttribute("data-custom-row") ?? "") ?? {};
        directories.push(currentDirectory);
        setDirectories(directories);
        setCurrentDirectory(currentRow ?? {});
      });
  };

  const download_file = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const files_service = new FilesService();
    const currentTarget = e.currentTarget as HTMLButtonElement;
    let file_path = currentTarget.getAttribute("data-path-value") ?? "";
    let file_name = currentTarget.getAttribute("data-file-name") ?? "";
    files_service.download_file(file_path, file_name);
  };


  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const [columnVisible, setColumnVisible] = React.useState(ALL_COLUMNS);
  React.useEffect(() => {
    const newColumns = matches ? ALL_COLUMNS : MOBILE_COLUMNS;
    setColumnVisible(newColumns);
  }, [matches]);

  const isFolder = (row: any) => {
    return row.file_type === "Folder" || row.file_type === "RootFolder";
  };
  const isFile = (row: any) => {
    return row.file_type === "File";
  };

  const next_page = ({ row }: Partial<GridRowParams>) => {
    const isRowFolder = isFolder(row);
    const pathValue = isRowFolder ? row.path : "";
    const linkContent = isRowFolder ? (
      <>
        {row.file_type === "RootFolder" ? (
          <SvgIcon
            color="inherit"
            fontSize="small"
            sx={{ marginBottom: "-4px", marginRight: "4px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
            >
              <path d="M680-330q20 0 35-14.5t15-35.5q0-20-15-35t-35-15q-21 0-35.5 15T630-380q0 21 14.5 35.5T680-330ZM80-570l142-172q8-9 19-13.5t23-4.5h431q12 0 23 4.5t19 13.5l143 172H80Zm60 370q-26 0-43-17t-17-43v-250h800v250q0 26-17.5 43T820-200H140Z" />
            </svg>
          </SvgIcon>
        ) : (
          <FolderIcon
            fontSize="small"
            sx={{ marginBottom: "-4px", marginRight: "4px" }}
          />
        )}
        {row.name}
      </>
    ) : (
      <Typography fontSize="inherit" color="secondary">
        <InsertDriveFileIcon
          fontSize="small"
          sx={{ marginBottom: "-4px", marginRight: "4px" }}
        />
        {row.name}
      </Typography>
    );
    return (
      (isRowFolder && (
        <Link
          component="button"
          underline="hover"
          color="primary"
          data-path-value={pathValue}
          data-custom-row={JSON.stringify(row)}
          onClick={update_files}
        >
          {linkContent}
        </Link>
      )) || <>{linkContent}</>
    );
  };

  const table_actions = ({ row }: Partial<GridRowParams>) => {
    const file = isFile(row);
    const pathValue = file ? row.path : "";
    const fileName = file ? "" : row.name;
    return (
      file &&
      <IconButton aria-label="download" color="primary" data-path-value={pathValue} data-file-name={fileName} onClick={download_file}><DownloadForOfflineIcon/></IconButton>
    );
  };
  

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "File Name",
      renderCell: next_page,
      flex: 1,
    },
    { field: "size", headerName: "File Size", width: 100, flex: 1 },
    {
      field: "modified",
      headerName: "Last Modified At",
      flex: 1,
    },
    { field: "created", headerName: "Created At", width: 200, flex: 1 },
    {
      field: "accessed",
      headerName: "Last Accessed At",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: table_actions,
      flex: 1,
    },
  ];

  return (
    <Box>
      <DataGrid
        density="compact"
        rows={files}
        columns={columns}
        getRowId={(row) => row.name}
        columnVisibilityModel={columnVisible}
      />
    </Box>
  );
}
