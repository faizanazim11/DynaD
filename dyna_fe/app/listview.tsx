"use client";

import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "name", headerName: "File Name", width: 200 },
  { field: "size", headerName: "File Size", width: 100 },
  { field: "modified", headerName: "Last Modified At", width: 200 },
  { field: "created", headerName: "Created At", width: 200 },
  { field: "accessed", headerName: "Last Accessed At", width: 200 },
  { field: "read_only", headerName: "Read Only", width: 200 },
];
export default function ListView({
  files,
  setFiles,
}: {
  files: Array<any>;
  setFiles: any;
}) {
  return (
    <Box>
      <DataGrid rows={files} columns={columns} getRowId={(row) => row.name} />
    </Box>
  );
}
