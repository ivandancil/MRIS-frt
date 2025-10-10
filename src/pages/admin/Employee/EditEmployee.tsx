import { useState, useEffect, ChangeEvent } from "react";
import { TextField, Button, Box, CircularProgress, Grid,  MenuItem, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

interface EditEmployeeProps {
  employeeId: number | null;
  onEmployeeUpdated: () => void;
  onClose: () => void;
}

function EditEmployee({ employeeId, onEmployeeUpdated, onClose }: EditEmployeeProps) {
       const theme = useTheme();
              const colors = tokens(theme.palette.mode);

    // Styles: Placeholder turns white on hover!
          const inputStyles = {
         
              "& .MuiInputLabel-root": {
                color: "black !important",
                  fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
                  fontFamily: "Poppins",
                // Adjust label position for smaller height on xs screens
                [theme.breakpoints.down('sm')]: {
                  transform: 'translate(14px, 8px) scale(1) !important', // Default position on xs
                  '&.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -9px) scale(0.75) !important', // Shrunk position on xs
                  },
                },
              },
              "& .MuiOutlinedInput-root fieldset": { borderColor: "black !important", borderWidth: 1 },
              "& .MuiInputBase-input": {
                color: "black",
                  fontSize: { xs: ".7rem", sm: ".9rem", md: "1.1rem" },
                   fontFamily: "Poppins",
                // Reduce padding/height only on extra-small screens
                [theme.breakpoints.down('sm')]: {
                  paddingTop: '8px', // Smaller top padding for xs
                  paddingBottom: '8px', // Smaller bottom padding for xs
                  // If you use start/end adornments, adjust their padding too
                  '&.MuiInputBase-inputAdornedStart': {
                    paddingLeft: '8px',
                  },
                  '&.MuiInputBase-inputAdornedEnd': {
                    paddingRight: '8px',
                  },
                },
                // Default padding/height for sm and up (Material-UI default)
                [theme.breakpoints.up('sm')]: {
                  paddingTop: '16.5px', // Standard Material-UI padding-top
                  paddingBottom: '16.5px', // Standard Material-UI padding-bottom
                  height: 'auto', // Ensure height is flexible
                }
              },
            }

                      // NEW: Reusable style for MenuItems
  const menuItemTextStyles = {
    fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
    fontFamily: "Poppins", // Assuming Poppins for MenuItem text too
  };

  const [employeeData, setEmployeeData] = useState({
    employeeID: "",
    jobPosition: "",
    lastname: "",
    firstname: "",
    middlename: "",
    sex: "",
    dateOfBirth: "",
    civilStatus: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId) {
      console.warn("No employeeId provided, skipping fetch.");
      return;
    }

    // Edit Function
    async function fetchEmployee() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        console.log(`Fetching employee with ID: ${employeeId}`);

        const response = await fetch(`http://127.0.0.1:8000/api/employees/${employeeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch employee. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Check if API response contains the expected data
        const employee = data.data || data; // Adjust based on actual response structure

        if (!employee) {
          throw new Error("Invalid employee data received.");
        }

        setEmployeeData({
          employeeID: employee.employeeID || "",
          jobPosition: employee.jobPosition || "",
          lastname: employee.lastname || "",
          firstname: employee.firstname || "",
          middlename: employee.middlename || "",
          sex: employee.sex || "",
          dateOfBirth: employee.dateOfBirth || "",
          civilStatus: employee.civilStatus || "",
          phoneNumber: employee.phoneNumber || "",
          email: employee.email || "",
          address: employee.address || "",
        });

        console.log("Employee data set:", employee);
      } catch (err: any) {
        console.error("Error fetching employee:", err.message);
        setError(err.message || "Error loading employee data.");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [employeeId]); // Dependency on `employeeId` ensures re-fetching when ID changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      [event.target.name as string]: event.target.value as string,
    }));
  };
  
  

  //Update Function

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      console.log("Updating employee:", employeeData);

      const response = await fetch(`http://127.0.0.1:8000/api/employees/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeID: employeeData.employeeID,
          jobPosition: employeeData.jobPosition,
          lastname: employeeData.lastname,
          firstname: employeeData.firstname,
          middlename: employeeData.middlename,
          sex: employeeData.sex,
          dateOfBirth: employeeData.dateOfBirth,
          civilStatus: employeeData.civilStatus,
          phoneNumber: employeeData.phoneNumber,
          email: employeeData.email,
          address: employeeData.address,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update employee. Status: ${response.status}`);
      }

      alert("Employee updated successfully.");
      onEmployeeUpdated();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
       <Grid container spacing={2} marginTop={1}>
      {/* Employee ID (Disabled) */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Employee ID"
          name="employeeID"
          
          value={employeeData.employeeID}
          fullWidth
          required
          sx={inputStyles}
        />
      </Grid>

        {/* Job Position (Dropdown) */}
        <Grid item xs={12} md={6} sx={inputStyles}>
        <TextField
          select
          label="Job Position"
          name="jobPosition"
          value={employeeData.jobPosition}
          onChange={handleSelectChange}
          fullWidth
          variant="outlined"
        >
              <MenuItem value="Teacher" sx={menuItemTextStyles}>Teacher</MenuItem>
              <MenuItem value="Teacher I" sx={menuItemTextStyles}>Teacher I</MenuItem>
              <MenuItem value="Teacher II" sx={menuItemTextStyles}>Teacher II</MenuItem>
              <MenuItem value="Supervisor" sx={menuItemTextStyles}>Supervisor</MenuItem>
        </TextField>
      </Grid>

      {/* Name Fields */}
      <Grid item xs={12} md={4}>
        <TextField
          label="Last Name"
          name="lastname"
          value={employeeData.lastname}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="off"
          sx={inputStyles}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="First Name"
          name="firstname"
          value={employeeData.firstname}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="off"
          sx={inputStyles}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Middle Name"
          name="middlename"
          value={employeeData.middlename}
          onChange={handleChange}
          fullWidth
          autoComplete="off"
          sx={inputStyles}
        />
      </Grid>
      {/* Sex (Dropdown) */}
      <Grid item xs={12} md={6} sx={inputStyles}>
        <TextField
          select
          label="Sex"
          name="sex" // ✅ Add name attribute
          value={employeeData.sex}
          onChange={handleSelectChange}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="Male" sx={menuItemTextStyles}>Male</MenuItem>
          <MenuItem value="Female" sx={menuItemTextStyles}>Female</MenuItem>
        </TextField>
      </Grid>

      
      {/* Date of Birth */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={employeeData.dateOfBirth}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="off"
          InputLabelProps={{ shrink: true }}
          sx={inputStyles}
        />
      </Grid>

      {/* Civil Status (Dropdown) */}
      <Grid item xs={12} md={6} sx={inputStyles}>
      <TextField
    select
    label="Civil Status"
    name="civilStatus"
    value={employeeData.civilStatus}
    onChange={handleSelectChange}
    fullWidth
    variant="outlined"
   
  >
    <MenuItem value="Single" sx={menuItemTextStyles}>Single</MenuItem>
    <MenuItem value="Married" sx={menuItemTextStyles}>Married</MenuItem>
    <MenuItem value="Divorced" sx={menuItemTextStyles}>Divorced</MenuItem>
    <MenuItem value="Widowed" sx={menuItemTextStyles}>Widowed</MenuItem>
  </TextField>
      </Grid>

      {/* Phone Number */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={employeeData.phoneNumber}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="off"
          sx={inputStyles}
        />
      </Grid>

      {/* Email (Disabled) */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Email"
          name="email"
          type="email"
         
          value={employeeData.email}
          fullWidth
          required
          sx={inputStyles}
        />
      </Grid>

      {/* Address */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Address"
          name="address"
          value={employeeData.address}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="off"
          sx={inputStyles}
        />
      </Grid>
    </Grid>

          <Box display="flex" justifyContent="space-between" mt={2}>
             <Button  
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={loading}  
                sx={{
                  fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" }, 
                  fontFamily: "Poppins",  background: `${colors.primary[400]}`, 
                  color: "black",   
                  "&:hover": 
                    { background: `${colors.grey[900]}`, }, 
                  }}
                >
              {loading ? "Saving..." : "Update Employee"}
            </Button>
          </Box>
        </>
      )}
    </form>
  );
}


export default EditEmployee;
