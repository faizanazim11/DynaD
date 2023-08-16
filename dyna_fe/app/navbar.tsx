"use client";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import Image from "next/image";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="tree-view"
            sx={{ mr: 2 }}
          >
            <AccountTreeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Image src="/icon.png" alt="logo" height={30} width={30} />
            DynaD
          </Typography>
          <IconButton size="large" color="primary" aria-label="list-view">
            <ViewListIcon />
          </IconButton>
          <IconButton size="large" color="primary" aria-label="list-view">
            <GridViewIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
