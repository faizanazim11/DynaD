'use client';

import NavBar from "app/navbar";
import ListView from "app/listview";
import { Box } from "@mui/material";
import FilesService from "@/services/files_service";
import { useState, useEffect } from "react";

export default function Page() {

  const [files, setFiles]: [any[], any] = useState([]);
  
  useEffect(() => {
    const files_service = new FilesService();
    files_service.get_listing().then((res: any[]) => {
      setFiles(res);
    });

  }, []);

  console.log("Files are: ", files);

  // INFO: This code is to figure out if the device is a mobile device or not.
  // const headersList = headers();
  // const userAgent = headersList.get('user-agent');
  // const isMobile = RegExp(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i).exec(userAgent!);
  // return (isMobile ? <MobileNavBar/> : <DesktopNavBar/> )

  return (
    <Box>
      <NavBar/>
      <ListView files={files} setFiles={setFiles}/>
    </Box>
  )

}
