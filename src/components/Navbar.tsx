import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DepedLogo from "../assets/depedLogo.png"

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const clearSessionAndRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("photo");
    sessionStorage.clear();
    setIsLoggedIn(false);
    setRole("");
    setPhoto("");
    navigate("/login");
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return clearSessionAndRedirect();

      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      clearSessionAndRedirect();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "Account");
      setRole(userRole || "");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user info");
          return res.json();
        })
        .then((data) => {
          setIsLoggedIn(true);
          setUserName(data.name);
          localStorage.setItem("name", data.name);
          localStorage.setItem("role", data.role);
        })
        .catch((err) => {
          console.error(err.message);
          setIsLoggedIn(false);
        });
    }
  }, []);

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
         <Typography
           variant="h6" 
           fontWeight="bold" 
              sx={{ 
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.1rem" },
                fontFamily: "Poppins"
              }}
            >
          {userName || "ERMS-DepedTac"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
        <NavLink to="/" style={{ textDecoration: "none",  }}>
          <Button fullWidth sx={{ justifyContent: "flex-start",  fontFamily: "Poppins" }}>
            Home
          </Button>
        </NavLink>

        {isLoggedIn ? (
          <>
            <Button
              fullWidth
              sx={{ justifyContent: "flex-start",  fontFamily: "Poppins" }}
              onClick={() => navigate(role === "admin" ? "/admin" : "/user")}
            >
              Dashboard
            </Button>
            <Button fullWidth sx={{ justifyContent: "flex-start",  fontFamily: "Poppins" }} onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={{ textDecoration: "none" }}>
              <Button fullWidth sx={{ justifyContent: "flex-start",  fontFamily: "Poppins" }}>
                Login
              </Button>
            </NavLink>
            <NavLink to="/register" style={{ textDecoration: "none" }}>
              <Button fullWidth sx={{ justifyContent: "flex-start",  fontFamily: "Poppins" }}>
                Register
              </Button>
            </NavLink>
              {/* <NavLink to="/admin" style={{ textDecoration: "none" }}>
              <Button fullWidth sx={{ justifyContent: "flex-start",  fontFamily: "Poppins" }}>
                Admin
              </Button>
            </NavLink>
              <NavLink to="/user" style={{ textDecoration: "none" }}>
              <Button fullWidth sx={{ justifyContent: "flex-start",  fontFamily: "Poppins" }}>
                User
              </Button>
            </NavLink> */}
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "white",
          boxShadow: "none",
          height: { xs: "60px", sm: "70px", md: "80px" },
          justifyContent: "center",
        }}
      >
        <Toolbar 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            minHeight: "90px" 
            }}
          >
          {/* Logo and title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              
            }} 
          >
          <Box 
              component="img" 
              src={ DepedLogo }
              alt="DepEd Logo" 
                sx={{ 
                  height:  { 
                    xs: "40px", 
                    sm: "50px", 
                    md: "60px" 
                  } 
                }} 
              />
          
          </Box>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
            <NavLink to="/" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <Button
                  sx={{
                    mx: 1,
                    color: isActive ? "black" : "grey",
                    fontSize: "1.1rem",
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    borderBottom: isActive ? "2px solid black" : "none",
                    "&:hover": {
                      bgcolor: "#f0f0f0",
                      color: "",
                    },
                  }}
                >
                  Home
                </Button>
              )}
            </NavLink>
            

            {isLoggedIn ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 2, mr: 3 }}>
                    <Avatar src={photo || "/image/default-avatar.png"} sx={{ width: 45, height: 45 }} />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: 1 }}>
                  <MenuItem>
                    <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: "Poppins" }}>
                      {userName}
                    </Typography>
                  </MenuItem>
                  <MenuItem sx={{ my: 1, px: 3, fontFamily: "Poppins" }} onClick={() => navigate(role === "admin" ? "/admin" : "/user")}>
                    Dashboard
                  </MenuItem>
                  <MenuItem sx={{ my: 1, px: 3, fontFamily: "Poppins" }} onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              ["Login", "Register"].map((text) => (
                <NavLink key={text} to={`/${text.toLowerCase()}`} style={{ textDecoration: "none" }}>
                  {({ isActive }) => (
                    <Button
                      sx={{
                        mx: 1,
                        color: isActive ? "black" : "grey",
                        fontSize: "1.1rem",
                        fontFamily: "Poppins",
                        fontWeight: 400,
                        // borderBottom: isActive ? "2px solid black" : "none",
                      }}
                    >
                      {text}
                    </Button>
                  )}
                </NavLink>
              ))
            )}
          </Box>

          {/* Mobile hamburger */}
          <Box sx={{ display: { xs: "flex", sm: "none" }, mr: 2 }}>
            <IconButton onClick={handleDrawerToggle} edge="end">
               <MenuIcon sx={{ fontSize:  { xs: "1.5rem", sm: "2rem" }, color: "black"}}/>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
