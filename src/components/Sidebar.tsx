import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { FaUserCircle, FaTachometerAlt, FaUsers, FaUpload, FaEye, FaCog, FaFolderOpen, FaIdCard } from "react-icons/fa";
import { tokens } from "../theme";
import DepedLogo from "../assets/Logo3.png"

interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (title: string) => void;
  style?: React.CSSProperties;
}

interface SidebarProps {
  role: "admin" | "user" ;
   isCollapsed: boolean;
  toggleSidebar: () => void;
}

// Reusable Item component
function Item({ title, to, icon, selected, setSelected }: ItemProps) {
  return (
      <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={<span style={{ color: selected === title ? "#1976d2" : "#757575" }}>{icon}</span>} // Add color styling
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
}

function Sidebar({ role, isCollapsed, toggleSidebar }: SidebarProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");

        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data.");

        const data = await response.json();
        setName(data.name);
      } catch (err: any) {
        console.error(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);
  

  return (
    <Box
      sx={{
        height: "100vh",
        "& .pro-sidebar-inner": { background: `${colors.primary[400]} !important`, boxShadow: "5" },
        
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },

        // "& .pro-inner-item:hover": { color: "black !important" },
        "& .pro-item-content .MuiTypography-root": {
          fontSize: { xs: ".6rem", sm: ".8rem", md: "1rem" },
          fontFamily: "Poppins",
          color: colors.grey[100],
        },
        "& .pro-menu-item.active": {
          color: `${theme.palette.primary.dark} !important`,
          fontWeight: "bold",
          backgroundColor: "#d0d0d0 !important",
        },
           // --- IMPORTANT: Conditional styles for the root Box of the Sidebar ---
        ...(isDesktop
          ? {
              // Desktop styles: Sidebar remains in the normal document flow
              position: 'relative', // Part of the flex layout in App.js
              // Width for desktop is controlled by react-pro-sidebar's 'collapsed' prop directly
              // based on its own width/collapsedWidth props.
             // Default desktop width when not collapsed
              // If you have a separate desktop collapse button, its state would dictate isCollapsed
          }
          : {
              // Mobile styles: Sidebar acts as an overlay (fixed position)
              position: 'fixed', // Makes it an overlay, out of document flow
              top: 0,
              left: 0,
              // Dynamically set width based on the `isCollapsed` prop from App.js
              // When isCollapsed is true (initial mobile state, or after toggle to close), width is 0.
              // When isCollapsed is false (after toggle to open), width is 250px.
              width: isCollapsed ? '0px' : '300px',
              zIndex: 110, // Higher than Topbar's zIndex (100) to ensure it appears on top
              transition: 'width 0.3s ease-in-out', // Smooth open/close animation
              boxShadow: theme.shadows[5], // Add a shadow for visual depth
              // Hide overflow to prevent scrollbars when sidebar is collapsed
              overflowX: 'hidden',
          }),

      }}
    >
      <ProSidebar 
        collapsed={isCollapsed}
        width="300px"
        collapsedWidth={isDesktop ? "80px" : "0px"}
      >
        <Menu >
          <MenuItem
            onClick={toggleSidebar}
              style={{
              margin: "2px 0 15px 0",
              color: colors.grey[100],
            }}
            icon={
              isCollapsed ? (
                <div 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center" 
                  }}
                >
                  <img  src={ DepedLogo } alt="Logo" style={{ width: 30, height: 30, marginTop: "20px" }} />
                  <span style={{ fontSize: "12px", marginTop: "2px", color: colors.grey[100] }}>
                    DepEd
                  </span>
                </div>
              ) : undefined
            }
        
          >
              {!isCollapsed && (
              <Box 
                display="flex" 
                justifyContent="space-between"
                alignItems="center" 
              >
              <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  sx={{ fontSize: { xs: ".8rem", sm: "1rem",md: "1.1rem" },fontWeight: "600" }}
                >
                  RM_Motorpol
                </Typography>
              <img
                src={ DepedLogo }
                alt="DepEd Logo"
                style={{
                  width: isCollapsed ? "20px" : "40px", 
                  height: "auto",
                  margin: "none",
                  transition: "width 0.3s ease-in-out",  
                }}
              />
              
            {/* <MenuOutlinedIcon
              style={{
                transition: "transform 0.3s ease-in-out",
                transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                opacity: isCollapsed ? 0 : 1,
                color: "black",
              }}
            /> */}
            </Box>
          )}
            </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
               <Box display="flex" justifyContent="center" alignItems="center">
                 <FaUserCircle size={80} />
              </Box>

            <Box textAlign="center">
                <Typography
                  mt={2} 
                  variant="h2" 
                  color={colors.grey[100]}
                  fontWeight="bold"
                  fontFamily="Poppins"
                  sx={{ fontSize: { xs: ".9rem", sm: "1.2rem", md: "1.4rem" }}}
                >
                    {loading ? "Loading..." : name || "Unknown User"} 
                  </Typography>
                  <Typography 
                    variant="body2" 
                     color={colors.grey[300]}
                     fontFamily="Poppins"
                      sx={{  fontSize: { xs: ".7rem", sm: ".9rem", md: "1rem" } }}
                    >
                    {role === "admin" ? "Admin" : "Employee"}
                  </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "5%"}>
            <Item 
              title="Dashboard" 
              to={`/${role}`} 
              icon={<FaTachometerAlt />} 
              selected={selected} 
              setSelected={setSelected}
               />

            {role === "admin" && (
              <>
                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{  
                      fontSize: { xs: ".6rem", sm: ".7rem", 
                      md: ".9rem" }, 
                      m: "5px 0 5px 20px", fontFamily: "Poppins" 
                  }}
                  >
                    Pages
              </Typography>

          <Item title="System Management" to="/admin/system_management" icon={<FaUsers />} selected={selected} setSelected={setSelected} />
          <Item title="Employee List" to="/admin/employee_management" icon={<FaUsers />} selected={selected} setSelected={setSelected} />
          <Item title="Uploaded Documents" to="/admin/upload_docs" icon={<FaUpload />} selected={selected} setSelected={setSelected} />
          <Item title="Reports" to="/admin/reports" icon={<FaEye />} selected={selected} setSelected={setSelected} />

       
           
        </>
            )}

            {role === "user" && (
              <>
                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{  
                      fontSize: { xs: ".6rem", sm: ".7rem", 
                      md: ".9rem" }, 
                      m: "5px 0 5px 20px", fontFamily: "Poppins" 
                  }}
                  >
                    PAGES
              </Typography>   

          <Item title="My Profile"  to="/user/employee_profile" icon={<FaCog />} selected={selected} setSelected={setSelected} />
          <Item title="Document Management" to="/user/document_management" icon={<FaFolderOpen />} selected={selected} setSelected={setSelected} />
          <Item title="Upload Image" to="/user/upload_pds" icon={<FaEye />} selected={selected} setSelected={setSelected} />
          <Item title="Extract ID" to="/user/extractID" icon={<FaIdCard />} selected={selected} setSelected={setSelected} />

          
              </>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
}

export default Sidebar;
