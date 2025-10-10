import { Box, colors, Grid, Paper, Typography } from "@mui/material";
import Header from "../../components/Header";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useEffect, useState } from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";


interface User {
  id: number;
  name: string;
  email: string;
  role?: string; 
}


const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState([]); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchEmployees();
    fetchUsers();
  }, []);

  // ✅ Fetch logged-in user details
  const fetchUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (!response.ok) throw new Error("Failed to fetch users");
  
      const data = await response.json();
      console.log("Users API Response:", data); 
  
      // Extract users correctly
      const usersArray = Array.isArray(data) ? data : data.data || [];
  
      setUsers(usersArray);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  // ✅ Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (!response.ok) throw new Error("Failed to fetch employees");
  
      const data = await response.json();
      console.log("Employees API Response:", data);
  
      // Ensure we extract employees from API response correctly
      const employeesArray = Array.isArray(data) ? data : data.data || [];
  
      setEmployees(employeesArray);
    } catch (err) {
      console.error("Error fetching employees:", (err as Error).message);
    }
  };


  // ✅ Overview Data with fixed structure
  const overviewData = [
    {
      title: loading ? "Loading..." : employees.length.toString(),
      subtitle: "Total Number of Employees",
      icon: <GroupsIcon sx={{ fontSize: { xs: 36, sm: 38, md: 40 }, color: "#3498db" }} />,
    },
    {
      title: loading ? "Loading..." : users.length.toString(),
      subtitle: "Registered System Users",
      icon: <PersonAddAltIcon sx={{ fontSize: { xs: 36, sm: 38, md: 40 }, color: "#2ecc71" }} />,
    },
    {
      title: loading ? "Loading..." : users.length.toString(),
      subtitle: "Uploaded Documents",
      icon: <InsertDriveFileIcon sx={{ fontSize: { xs: 36, sm: 38, md: 40 }, color: "#f39c12" }} />,
    },
    {
      title: loading ? "Loading..." : users.length.toString(),
      subtitle: "Notifications",
      icon: <NotificationsActiveIcon sx={{ fontSize: { xs: 36, sm: 38, md: 40 }, color: "red" }} />,
    },
  ];

  return (
    <Box m="20px">
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Admin Dashboard"
          subtitle={`Welcome, ${loading ? "Loading..." : user?.name || "Unknown User"}`}
        />
      </Box>

      {/* Overview Section */}
      <Grid container spacing={2} mt={0.5}>
        {overviewData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                textAlign: "center",
                backgroundColor: colors.grey[100],
                height: "120px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.icon}
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color={colors.grey[900]}
                 sx={{ 
                   fontSize: { xs: ".8rem", sm: ".9rem", md: "1rem" } }}
                >
                {item.title}
              </Typography>
              <Typography 
                variant="body2" 
                fontFamily="Poppins"
                color={colors.grey[900]}
                 sx={{  fontSize: { xs: ".8rem", sm: ".9rem", md: "1rem" } }}
              >
                {item.subtitle}
              </Typography>
            </Paper>
          </Grid>
          
        ))}
       
      </Grid>
    </Box>
  );
};

export default Dashboard;