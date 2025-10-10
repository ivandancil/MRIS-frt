import React, { useState, useEffect } from "react";
import { Avatar, Box, Divider, Grid, IconButton, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

// Define Employee Type
interface Employee {
  id: number;
  employeeID: string;
  jobPosition: string;
  lastname: string;
  firstname: string;
  middlename?: string; 
  sex: string;
  dateOfBirth: string; 
  civilStatus: string;
  phoneNumber: string;
  email: string;
  address: string;
}


function EmployeeProfile() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [_, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

   // Handle Tab Change
   function handleTabChange(_event: React.SyntheticEvent, newValue: number) {
    setTabIndex(newValue);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/employee", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Employee Data:", data); 
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
        <Header title="Employee Profile" subtitle="Detailed Employee Information" />
        {/* <Button
          variant="contained"
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: "#fff",
            "&:hover": { backgroundColor: colors.blueAccent[500] },
          }}
          onClick={handleOpen}
        >
          Edit Profile
        </Button> */}
      </Box>

    <Box display="flex" justifyContent="center" sx={{ width: '100%' }}> {/* Ensure this Box takes full width */}
        <Grid container spacing={3} mt={2} sx={{ width: { xs: '100%', sm: '600px', md: '700px' } }}> {/* Adjust width as needed for smaller screens for better alignment, or remove to let grid determine */}
            {/* The individual Grid items will still take up 12 columns on xs, but on sm and up, they'll
                take 4 and 8 within this *newly right-aligned* Grid container.
                You might need to adjust sm column sizes if you want a smaller total width.
                For example, if you want it to be about half the screen on large, make the container xs=12, sm=6
                and remove the fixed width above.
            */}
            <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
                <Box position="relative">
      <Avatar
                  sx={{ width: 100, height: 100, mx: "auto" }} 
                />
                <IconButton
                  component="label"
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      backgroundColor: "black",
                      color: "white",
                      boxShadow: 2,
                      "&:hover": { backgroundColor: "black" },
                    }}
                >
                <CameraAltIcon />
              </IconButton>
            </Box>
          </Grid>

          
          {/* Profile Details */}
          <Grid item xs={12} sm={8}>
            <Typography
              variant="h5"
              sx={{
               fontWeight: "bold",
               fontSize: { xs: "1.7rem", sm: "1.8rem", md: "2rem" },
               fontFamily: "Poppins",
               color: colors.grey[900]
              }}
            >
              {employee?.firstname} {employee?.lastname}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                  fontSize: { xs: ".8rem", sm: ".9rem", md: "1.1rem" },
                  fontFamily: "Poppins",
                  color: colors.grey[800]
                }}
              >
              Employee ID: <strong>{employee?.employeeID || "N/A"}</strong>
            </Typography>
            <Typography 
              variant="body1" 
                sx={{ 
                   fontSize: { xs: ".8rem", sm: ".9rem", md: "1.1rem" },
                  fontFamily: "Poppins",
                   color: colors.grey[800]
                }}
              >
              Job Position: <strong>{employee?.jobPosition || "Not Assigned"}</strong>
            </Typography>

          </Grid>
        </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tabs for Sections */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="scrollable" // Add this prop
          scrollButtons="auto" // Add this prop
          sx={{ 
            background: `${colors.grey[900]}`,
            boxShadow: "2",
            borderRadius: "5px",
            fontFamily: "Poppins",
            '& .MuiTab-root': { color: '#000',  fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }, },
            '& .Mui-selected': { color: 'black', fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }, },
            '& .MuiTabs-indicator': { backgroundColor: 'black', height: '3px', borderRadius: '10px' },
          }}
          
        
        >
          <Tab label="Personal Details" />
          <Tab label="Contact Information" />
          <Tab label="Documents" />
          <Tab label="Educational Background" />
          <Tab label="Civil Service Eligibility" />
          <Tab label="Work Experience" />
         
        </Tabs>


        {/* Tab Content */}
        <Box mt={2}>
          {tabIndex === 0 && (
             <TableContainer  sx={{ maxHeight: "470px", overflow: "auto", boxShadow: 3 }}>
                <Table stickyHeader>
                    <TableBody>
                      {[
                        ["Employee ID :", employee?.employeeID],
                        ["Job Position :", employee?.jobPosition],
                        ["Last Name :", employee?.lastname],
                        ["First Name :", employee?.firstname],
                        ["Middle Name :", employee?.middlename],
                        ["Sex :", employee?.sex],
                        ["Date of Birth :", employee?.dateOfBirth],
                        ["Civil Status :", employee?.civilStatus],
                        ["Phone Number :", employee?.phoneNumber],
                        ["Email :", employee?.email],
                        ["Address :", employee?.address],
                      
                      ].map(([label, value]) => (
                        <TableRow key={label} sx={{ "&:hover": { backgroundColor: colors.grey[400] } }} >
                          <TableCell 
                            sx={{ 
                              fontFamily: "Poppins" ,
                              fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
                              color: colors.grey[900]
                            }}
                          >
                            {label}
                          </TableCell>
                          <TableCell
                             sx={{ 
                              fontFamily: "Poppins" ,
                              fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
                              color: colors.grey[900]
                            }}
                          >
                            {value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
            </TableContainer>
          )}

        
          {tabIndex === 1 && (
            <TableContainer sx={{ boxShadow: 3 }}>
              <Table>
                <TableBody>
                  <TableRow sx={{ "&:hover": { backgroundColor: colors.grey[400] } }}>
                    <TableCell 
                      sx={{ 
                        fontFamily: "Poppins" ,
                        fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
                         color: colors.grey[900]
                    }}
                  >
                    Contact Name :
                  </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: colors.grey[700] } }}>
                    <TableCell   
                      sx={{ 
                        fontFamily: "Poppins" ,
                        fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
                         color: colors.grey[900]
                    }}
                  >
                    Contact Number :
                  </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
    </Box>
  );
}

export default EmployeeProfile;