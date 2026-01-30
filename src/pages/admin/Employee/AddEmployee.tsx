  import { Box, TextField, Button, Typography, Snackbar, Alert, MenuItem, Grid, useTheme} from "@mui/material";
  import { useState, useCallback, useEffect } from "react";
  import { tokens } from "../../../theme";

  interface AddEmployeeProps {
    onEmployeeAdded: () => void;
    onClose: () => void;
  }

  function AddEmployee({ onEmployeeAdded, onClose }: AddEmployeeProps) {
    const theme = useTheme();
          const colors = tokens(theme.palette.mode);

  const inputStyles = {
    "& .MuiInputLabel-root": {
      color: "black !important",
      fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" },
      fontFamily: "Poppins",
      [theme.breakpoints.down("sm")]: {
        transform: "translate(14px, 8px) scale(1) !important",
        "&.MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75) !important",
        },
      },
    },
    "& .MuiOutlinedInput-root fieldset": { borderColor: "black !important" },
    "& .MuiInputBase-input": {
      color: "black",
      fontSize: { xs: ".7rem", sm: ".9rem", md: ".9rem" },
      fontFamily: "Poppins",
    },
  };

            // NEW: Reusable style for MenuItems
    const menuItemTextStyles = {
      fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
      fontFamily: "Poppins", // Assuming Poppins for MenuItem text too
    };

    const [employeeID, setEmployeeID] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [middlename, setMiddlename] = useState("");
    const [sex, setSex] = useState("");
    const [dateOfBirth, setDateofBirth] = useState("");
    const [age, setAge] = useState<number | null>(null);
    const [civilStatus, setCivilStatus] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [jobPosition, setJobPosition] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

      // Fetch auto-generated Employee ID from backend
  useEffect(() => {
    const fetchNextEmployeeID = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/employees/next-id", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployeeID(data.nextID);
      } catch (err) {
        console.error("Failed to fetch Employee ID", err);
      }
    };
    fetchNextEmployeeID();
  }, []);

        // Compute age whenever dateOfBirth changes
      useEffect(() => {
        if (dateOfBirth) {
          const birthDate = new Date(dateOfBirth);
          const today = new Date();
          let computedAge = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            computedAge--;
          }
          setAge(computedAge);
        } else {
          setAge(null);
        }
      }, [dateOfBirth]);

    const handleAddEmployee = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError("");
      setLoading(true);

      if ( !lastname || !firstname || !middlename || !sex || !dateOfBirth || !civilStatus || !jobPosition || !phoneNumber || !address) {
        setError("All fields are required.");
        setLoading(false);  // Ensure loading resets
        return;
      }

      if (!/^(09|\+639)\d{9}$/.test(phoneNumber)) {
        setError("Invalid phone number format. Use 09XXXXXXXXX or +639XXXXXXXXX.");
        setLoading(false);
        return;
      }


      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ employeeID, lastname, firstname, middlename, sex, dateOfBirth, age, civilStatus, phoneNumber, address, jobPosition }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add employee");
        }

        setSuccess(true);
        onEmployeeAdded();
        onClose();

        // Clear form
        setLastname(""); setFirstname(""); setMiddlename("");
        setSex(""); setDateofBirth(""); setCivilStatus(""); setPhoneNumber("");
        setAddress(""); setJobPosition("");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }, [employeeID, lastname, firstname, middlename, sex, dateOfBirth, civilStatus, phoneNumber, address, jobPosition, onEmployeeAdded, onClose]);

    return (
      <form onSubmit={handleAddEmployee}>
        <Grid container spacing={2} marginTop={.8}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Employee ID "
              fullWidth
              value={employeeID}
              InputProps={{ readOnly: true }}
              sx={inputStyles}
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField label="Job Position" fullWidth value={jobPosition} onChange={(e) => setJobPosition(e.target.value)} autoComplete="off" sx={inputStyles} />
          </Grid> */}
          <Grid item xs={12} md={10} sx={inputStyles}>
            <TextField
                select
                label="Job Position"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Encoder" sx={menuItemTextStyles}>Encoder</MenuItem>
                <MenuItem value="Helper-Mechanic" sx={menuItemTextStyles}>Helper-Mechanic</MenuItem>
                <MenuItem value="Mechanic" sx={menuItemTextStyles}>Mechanic</MenuItem>
                <MenuItem value="Welder" sx={menuItemTextStyles}>Welder</MenuItem>
                <MenuItem value="Supervisor/Mechanic" sx={menuItemTextStyles}>Supervisor/Mechanic</MenuItem>
                <MenuItem value="ToolKeeper" sx={menuItemTextStyles}>ToolKeeper</MenuItem>
              </TextField>

          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Last Name" fullWidth value={lastname} onChange={(e) => setLastname(e.target.value)} autoComplete="off" sx={inputStyles} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="First Name" fullWidth value={firstname} onChange={(e) => setFirstname(e.target.value)} autoComplete="off" sx={inputStyles} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Middle Name" fullWidth value={middlename} onChange={(e) => setMiddlename(e.target.value)} autoComplete="off" sx={inputStyles} />
          </Grid>
          <Grid item xs={12} md={8} sx={inputStyles}>
          <TextField
                select
                label="Sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Male"  sx={menuItemTextStyles}>Male</MenuItem>
                <MenuItem value="Female"  sx={menuItemTextStyles}>Female</MenuItem>
              </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
                label="Date of Birth" 
                fullWidth 
                type="date" 
                value={dateOfBirth} 
                onChange={(e) => setDateofBirth(e.target.value)} 
                autoComplete="off" 
                InputLabelProps={{ shrink: true }} 
                sx={inputStyles} 
                />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
                label="Age" 
                fullWidth 
                value={age !== null ? age : ""} 
                InputProps={{ readOnly: true }} 
                sx={inputStyles} 
            />
          </Grid>

          <Grid item xs={12} md={6} sx={inputStyles}>
            <TextField
                select
                label="Civil Status"
                value={civilStatus}
                onChange={(e) => setCivilStatus(e.target.value)}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Single" sx={menuItemTextStyles}>Single</MenuItem>
                <MenuItem value="Married"  sx={menuItemTextStyles}>Married</MenuItem>
              
              </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Phone Number" fullWidth value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} autoComplete="off" sx={inputStyles} />
          </Grid>
        
          <Grid item xs={12} md={10}>
            <TextField label="Address" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="off" sx={inputStyles} />
          </Grid>
        </Grid>

        {error && <Typography color="error" mt={1}>{error}</Typography>}

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
            {loading ? "Adding..." : "Add Employee"}
          </Button>
        </Box>

        {/* Success Snackbar */}
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
            Employee added successfully!
          </Alert>
        </Snackbar>
      </form>
    );
  }


  export default AddEmployee;
