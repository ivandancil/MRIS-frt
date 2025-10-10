import { Box, useMediaQuery, useTheme } from "@mui/material"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { useEffect, useState } from "react"
import BackgroundImage from "../assets/enhance.png"; 


const UserLayout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";
   const NAVBAR_HEIGHT = 0;

    // Access the theme and media query hook
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // Check if screen is desktop or larger
  
    // State for sidebar collapse, initialized based on screen size
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(!isDesktop); // Auto-collapse if not desktop
  
    // Effect to update isSidebarCollapsed when screen size changes
    useEffect(() => {
      // If it's desktop, set to false (expanded) unless user manually collapses later
      // If it's not desktop (mobile/tablet), set to true (collapsed)
      setIsSidebarCollapsed(!isDesktop);
    }, [isDesktop]); // Re-run this effect whenever isDesktop changes
  
    const toggleSidebar = () => {
      setIsSidebarCollapsed((prev) => !prev);
    };
  

  return (
     <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw', // Ensure it covers the full viewport width
        position: 'relative', // Necessary for positioning the absolute background overlay
        overflow: 'hidden', // Hides any overflow if the background image scales beyond boundaries
        bgcolor: "black"
      }}
    >
  <Box
        component="img"
        src={ BackgroundImage }
        alt="DepEd Logo Background"
        sx={{
          position: "absolute",
          top: `${NAVBAR_HEIGHT}px`,
          left: 0,
          width: "100%",
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          objectFit: "fill",
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

    <Box
        display="flex" // Enables flexbox for arranging sidebar and main content
        flexDirection="row" // Arranges children (Sidebar and main content) in a row
        height="100%" // Takes full height of the parent (which is 100vh)
        width="100%" // Takes full width to correctly layer on top of the background
        sx={{ zIndex: 0 }} // Ensures this content layer is above the background (-1 zIndex)
      >
        {!hideLayout && (
              <Sidebar
                role="user"
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
              />
            )}
    
    <Box flexGrow={1} sx={{ minHeight: "100vh", overflowY: "auto" }}>
        {!hideLayout && (
          <Topbar
            toggleSidebar={toggleSidebar}
          />
        )}
    
        <Box> 
          <Outlet />
        </Box>
   
    </Box>
  </Box>
  </Box>
  )
}

export default UserLayout