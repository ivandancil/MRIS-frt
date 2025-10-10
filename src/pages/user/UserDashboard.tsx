import { Box, Grid, Paper, Typography } from "@mui/material";
import Header from "../../components/Header";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useEffect, useState } from "react";
import { blue, grey } from "@mui/material/colors";
import AssignmentIcon from "@mui/icons-material/Assignment";

// Define Employee Type
interface Employee {
  id: number;
  jobPosition: string;
  lastname: string;
  firstname: string;
}


function UserDashboard() {

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [_, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch employee data from the API
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/employee", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch employee data");
        return response.json();
      })
      .then((data) => {
        setEmployee(data.employee);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Dashboard"
          subtitle={`Welcome, ${employee?.firstname || ""} ${employee?.lastname || ""}`}
        />
      </Box>

      {/* Top Summary Cards */}
      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12} sm={6} md={3} >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: grey[100],
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AccountCircleIcon 
              sx={{ 
                fontSize: { xs: 36, sm: 38, md: 40 },  
                color: blue[700] 
              }} 
            />
            <Box>
              <Typography 
                variant="h5"
                sx={{ 
                   fontSize: { xs: ".8rem", sm: ".9rem", md: "1.1rem" },
                   fontFamily: "Poppins"
                }}>
                  {employee?.firstname} {employee?.lastname}
              </Typography>
              <Typography 
                variant="body2"
                 sx={{ 
                   fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
                   fontFamily: "Poppins"
                }}
                >
                  {employee?.jobPosition}</Typography>
            </Box>
          </Paper>
        </Grid>

       
        {/* Pending Tasks */}
        <Grid item xs={12} sm={6} md={3} >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: grey[100],
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
              <AssignmentIcon 
                sx={{ 
                  fontSize: { xs: 36, sm: 38, md: 40 }, 
                color: "orange" 
              }}
            />
              <Box>
              <Typography 
                variant="h5"
                sx={{ 
                   fontSize: { xs: ".8rem", sm: ".9rem", md: "1.1rem" },
                   fontFamily: "Poppins"
                }}
              >
                Pending Tasks
            </Typography>
              <Typography 
                variant="body2"
                 sx={{ 
                   fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
                   fontFamily: "Poppins"
                }}
              >
                4 Tasks
              </Typography>
            </Box>
          </Paper>
        </Grid>

          <Grid item xs={12} sm={6} md={3} >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: grey[100],
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NotificationsActiveIcon 
              sx={{ 
                   fontSize: { xs: 36, sm: 38, md: 40 },  
                  color: "red" 
                }}
              />
            <Box>
              <Typography 
                variant="h5"
                sx={{ 
                   fontSize: { xs: ".8rem", sm: ".9rem", md: "1.1rem" },
                   fontFamily: "Poppins"
                }}
              >
                2 Notifications
              </Typography>
              <Typography 
               variant="body2"
                 sx={{ 
                   fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
                   fontFamily: "Poppins"
                }}
              >
                Recent Updates
              </Typography>
            </Box>
          </Paper>
        </Grid>

          <Grid item xs={12} sm={6} md={3} >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: grey[100],
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NotificationsActiveIcon 
              sx={{ 
                    fontSize: { xs: 36, sm: 38, md: 40 }, 
                  color: "red" 
                }}
              />
            <Box>
              <Typography 
                variant="h5"
                sx={{ 
                   fontSize: { xs: ".8rem", sm: ".9rem", md: "1.1rem" },
                   fontFamily: "Poppins"
                }}
              >
                2 Notifications
              </Typography>
              <Typography 
               variant="body2"
                 sx={{ 
                   fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
                   fontFamily: "Poppins"
                }}
              >
                Recent Updates
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      
    </Box>
  );
}

export default UserDashboard;
