import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import SvgIcon from "@mui/material/SvgIcon";
import HomeIcon from "@mui/icons-material/Home";
import FilesService from "@/services/files_service";
import { useMediaQuery, useTheme } from "@mui/material";

function getFolderIcon(fileType: string) {
  if (fileType === "Folder") {
    return (
      <FolderIcon
        fontSize="small"
        sx={{ marginBottom: "-4px", marginRight: "4px" }}
      />
    );
  }
  if (fileType === "Home") {
    return (
      <HomeIcon
        fontSize="small"
        sx={{ marginBottom: "-4px", marginRight: "4px" }}
      />
    );
  }
  return (
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
  );
}

export default function FolderCrumbs({
  directories,
  setDirectories,
  currentDirectory,
  setCurrentDirectory,
  setFiles,
}: {
  directories: Array<any>;
  setDirectories: any;
  currentDirectory: any;
  setCurrentDirectory: any;
  setFiles: any;
}) {
  const update_files = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const files_service = new FilesService();
    const currentTarget = e.currentTarget as HTMLButtonElement;
    files_service
      .get_listing(currentTarget.getAttribute("data-path-value") ?? "")
      .then((res: any[]) => {
        const currentRowIndex: number = parseInt(
          currentTarget.getAttribute("data-row-index") ?? "0"
        );
        setCurrentDirectory(directories[currentRowIndex] ?? {});
        setDirectories(directories.slice(0, currentRowIndex));
        setFiles(res);
      });
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const noOfElements = matches ? 5 : 2;

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      maxItems={noOfElements}
      sx={{ marginLeft: "4px", margin: "15px" }}
      separator="›"
    >
      {directories.map((directory: any, index: number) => {
        return (
          <Link
            component="button"
            underline="hover"
            color="primary"
            key={directory.name}
            data-path-value={directory.path}
            data-row-index={index}
            onClick={update_files}
            sx={{ marginLeft: "4px" }}
          >
            {getFolderIcon(directory.file_type)}
            {directory.name}
          </Link>
        );
      })}
      <Typography color="text.primary">
        {getFolderIcon(currentDirectory.file_type)}
        {currentDirectory.name}
      </Typography>
    </Breadcrumbs>
  );
}
