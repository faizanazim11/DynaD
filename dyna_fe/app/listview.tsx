"use client";

import FilesService from "@/services/files_service";
import { Box, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SvgIcon from "@mui/material/SvgIcon";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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
}: {
  files: Array<any>;
  setFiles: any;
}) {
  const update_files = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const files_service = new FilesService();
    files_service
      .get_listing(
        e.currentTarget
          ? (e.currentTarget as HTMLButtonElement).getAttribute(
              "data-path-value"
            ) ?? ""
          : ""
      )
      .then((res: any[]) => {
        setFiles(res);
      });
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
      isRowFolder && (
      <Link
        component="button"
        underline="hover"
        color="primary"
        data-path-value={pathValue}
        onClick={update_files}
      >
        {linkContent}
      </Link>
    ) || <>{linkContent}</>
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
      field: "read_only",
      headerName: "Read Only",
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
