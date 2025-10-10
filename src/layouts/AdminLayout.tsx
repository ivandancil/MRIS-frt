import { Box, useMediaQuery, useTheme } from "@mui/material";
import Topbar from "../components/Topbar";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import BackgroundImage from "../assets/enhance.png"; // Ensure this path is correct for your project

const AdminLayout = () => {
  const location = useLocation();
  // Determine if the layout (sidebar and topbar) should be hidden for specific routes
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";
    const NAVBAR_HEIGHT = 0;

  // Access the Material-UI theme and a media query hook for responsive design
  const theme = useTheme();
  // Check if the current screen size is 'md' (medium) or larger, indicating a desktop view
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // State to control the collapse/expand status of the sidebar
  // It's initialized to be collapsed if the screen is not desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(!isDesktop);

  // Effect hook to update the sidebar's collapsed state whenever the screen size changes
  useEffect(() => {
    // If it's a desktop screen, the sidebar should generally be expanded (false for collapsed)
    // If it's a mobile/tablet screen, the sidebar should be collapsed (true for collapsed)
    setIsSidebarCollapsed(!isDesktop);
  }, [isDesktop]); // This effect runs only when 'isDesktop' value changes

  // Function to toggle the sidebar's collapsed state, passed to Topbar and Sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    // Main container for the entire application layout.
    // It's set to fill the viewport height and width, and positioned relatively
    // to allow the absolute positioning of the background overlay.
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
      {/* Background Overlay Box */}
      {/* This Box holds the background image and applies a black opacity layer to it. */}
      {/* It's absolutely positioned to cover the entire parent container. */}
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

      {/* Content Layer */}
      {/* This Box contains the Sidebar, Topbar, and the main content (Outlet). */}
      {/* It's also set to fill the parent, effectively layering on top of the background. */}
      <Box
        display="flex" // Enables flexbox for arranging sidebar and main content
        flexDirection="row" // Arranges children (Sidebar and main content) in a row
        height="100%" // Takes full height of the parent (which is 100vh)
        width="100%" // Takes full width to correctly layer on top of the background
        sx={{ zIndex: 0 }} // Ensures this content layer is above the background (-1 zIndex)
      >
        {/* Sidebar component, conditionally rendered */}
        {!hideLayout && (
          <Sidebar
            role="admin" // Prop indicating the role for sidebar content
            isCollapsed={isSidebarCollapsed} // Current collapse state
            toggleSidebar={toggleSidebar} // Function to toggle collapse state
          />
        )}

        {/* Main content area, takes up remaining space using flexGrow */}
        <Box flexGrow={1} sx={{ minHeight: "100vh", overflowY: "auto" }}>
          {/* Topbar component, conditionally rendered */}
          {!hideLayout && (
            <Topbar
              toggleSidebar={toggleSidebar} // Function to toggle sidebar (e.g., via a hamburger icon)
            />
          )}

          {/* Outlet for nested routes (where actual page content will be rendered) */}
          <Box>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
