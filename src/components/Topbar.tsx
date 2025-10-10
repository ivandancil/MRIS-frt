import { Box, IconButton, InputBase, Menu, MenuItem, Divider, Badge, useTheme, useMediaQuery } from "@mui/material";
import { useState, useEffect, MouseEvent, useContext } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "./NotificationContext";
import { useSearch } from "./SearchContext";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

interface TopbarProps {
  toggleSidebar: () => void; // Prop to toggle the sidebar's collapsed state
}

const Topbar = ({ toggleSidebar }: TopbarProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { notifications } = useNotificationContext();
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const { searchTerm, setSearchTerm } = useSearch();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const isAboveMediumScreens = useMediaQuery(theme.breakpoints.up("md"));
  const colorMode = useContext(ColorModeContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const role = localStorage.getItem("role");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setName(parsedUser.name || "");
      }
      if (role) {
        setUserRole(role);
      }
    }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorElProfile(null);
  };

  const handleNotificationsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  const handleClearAllNotifications = () => {
    localStorage.removeItem("notifications");
    handleNotificationsClose();
  };

  const handleProfileNavigate = () => {
    navigate("/user/employee_profile");
    handleProfileClose();
  };

  const userNotifications = notifications.filter((notification) => notification.role === userRole);

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.warn("No token found, redirecting to login.");
        clearSessionAndRedirect();
        return;
      }
  
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log("Logout successful");
      } else {
        console.warn("Logout failed, proceeding with local cleanup.");
      }
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
    } finally {
      clearSessionAndRedirect();
    }
  };
  
  const clearSessionAndRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    sessionStorage.clear();
  
    setUserRole(null);
    setName("");
  
    navigate("/login");
  };
  

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      p={2} 
      alignItems="center"
    >
      <Box
        sx={{
          display: "flex", 
          alignItems: "center"
        }}
      >
         {/* Hamburger Icon - now always visible */}
        <IconButton onClick={toggleSidebar} sx={{ mr: 1, color: colors.grey[900]}}> {/* Add right margin */}
          <MenuOutlinedIcon />
        </IconButton>

    <Box
      sx={{ 
          display: "flex",
            backgroundColor: colors.primary[400],
            borderRadius: "3px",
            
       }}
      >

       <InputBase
        sx={{ ml: 2, flex: 1, fontFamily: "Poppins",  }}
        placeholder="Search..."
        value={searchTerm} 
        onChange={handleInputChange} 
      />

      <IconButton type="button" sx={{ p: 1 }} onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
    </Box>
  </Box>

       <Box
          sx={{ 
            display: "flex", 
            alignItems: "center"
            
           }}
        >
      
        {/* PersonOutlinedIcon - Visible only on small screens */}
        {!isAboveMediumScreens && (
          <IconButton onClick={() => setOpenMobileMenu(!openMobileMenu)} sx={{color: colors.grey[900]}}>
            <PersonOutlinedIcon  /> {/* Always show PersonOutlinedIcon */}
          </IconButton>
        )}

       {/* Regular Icons Container - using a div instead of Box */}
       <Box
          sx={{
             display: (isAboveMediumScreens || openMobileMenu) ? "flex" : "none",
            flexDirection: isAboveMediumScreens ? "row" : "column",
            // Desktop styles
            ...(isAboveMediumScreens && {
                position: 'static',
                gap: theme.spacing(1), // Use theme.spacing for gap consistency
            }),
            // Mobile menu open styles
            ...(!isAboveMediumScreens && openMobileMenu && {
                position: 'absolute',
                top: '70px', // Adjust as per your actual topbar height
                right: '16px',
                padding: theme.spacing(2),
                borderRadius: '8px',
                boxShadow: theme.shadows[3],
                backgroundColor: colors.grey[200],
                zIndex: 50,
                gap: theme.spacing(1), // Use theme.spacing for gap consistency
            }),
          }}>

      {/* Icons */}
   
         <IconButton onClick={colorMode.toggleColorMode} sx={{ color: colors.grey[900]}}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon  sx={{ fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" } }} />
            ) : (
              <LightModeOutlinedIcon  sx={{ fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" } }} />
            )}
          </IconButton>
        {/* Notifications */}
        <IconButton onClick={handleNotificationsClick} >
          <Badge color="error" badgeContent={userNotifications.length}>
            <NotificationsOutlinedIcon sx={{ fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" }, color: colors.grey[900], }}  />
          </Badge>
        </IconButton>

        <IconButton>  
          <SettingsOutlinedIcon sx={{ fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" }, color: colors.grey[900] }} />
        </IconButton>

        <IconButton onClick={handleProfileClick}>
          <PersonOutlinedIcon sx={{ fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" }, color: colors.grey[900] }} />
        </IconButton>

        {/* Notifications Menu */}
        <Menu anchorEl={anchorElNotifications} open={Boolean(anchorElNotifications)} onClose={handleNotificationsClose}>
          {userNotifications.length > 0 ? (
            userNotifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleNotificationsClose}>
                {notification.message}
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={handleNotificationsClose} sx={{ fontFamily: "Poppins" }}>No new notifications</MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleClearAllNotifications} sx={{ fontFamily: "Poppins" }} >Clear All</MenuItem>
        </Menu>

        {/* Profile Menu */}
        <Menu anchorEl={anchorElProfile} open={Boolean(anchorElProfile)} onClose={handleProfileClose}>
          <MenuItem onClick={handleProfileNavigate} sx={{ fontFamily: "Poppins" }}>
            <strong>{name}</strong>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileClose} sx={{ fontFamily: "Poppins" }}>Settings</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ fontFamily: "Poppins" }}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
 </Box>
  );
};

export default Topbar;
