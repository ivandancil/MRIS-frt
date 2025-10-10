import { Box, TextField, Button, Typography, Snackbar, Alert, useTheme } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BackgroundImage from "../../assets/enhance.png"


const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const NAVBAR_HEIGHT = 0;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name || !email || !password) {
        setError("All fields are required.");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }
    
      // ✅ Clear old data
      localStorage.clear();
      sessionStorage.clear();
    
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        console.log("API Error Response:", data);
    
        const lowerMessage = data.message?.toLowerCase();

          if (lowerMessage?.includes("not registered")) {
            setError("This email is not registered in the system.");
          } else if (lowerMessage?.includes("already registered")) {
            setError("This email is already registered. Please login.");
          } else {
            setError(data.message || "Registration failed. Please try again.");
          }
    
        setOpenSnackbar(true);
        return;
      }
    
      console.log("Registration Success:", data);
    
      // ✅ Save token and role after successful registration
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));
    
      const redirectPath = data.user.role === "admin" ? "/admin" : "/user";

      navigate(redirectPath);
    } catch (error) {
      console.error("Registration failed:", error);
      setError("An unexpected error occurred.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }    

  return (
   <Box 
      sx={{
        width:"100%", 
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: "black",
        }}
      >

      <Navbar />
  
        {/* Background Image */}
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

        {/* Form Container */}
        <Box
          sx={{
            height: "calc(100vh - 90px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
             position: "relative", 
            zIndex: 2 
          }}
        >
        <Box
          sx={{
            maxWidth: 430,
            width: { xs: "70%", sm: "80%", md: "90%" } ,
            paddingLeft: 3,
            paddingRight: 3,
            pt: { xs: "4%", sm: "3%", md: "2%" },
            pb: 3,
            boxShadow: 5,
            borderRadius: 3,
            bgcolor: "rgba(255, 250, 250, 0.7)",
            color: theme.palette.text.primary,
            textAlign: "center",
            backdropFilter: "blur(3px)",
            border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        >
         <Typography
          variant="h3"
          textAlign="center"
          mb={2}
          fontWeight="" 
              sx={{ 
                fontSize: { xs: "1rem", sm: "1.3rem", md: "1.7rem" },
                textTransform: "uppercase", 
                letterSpacing: 1, 
                color: "black",
                mt: "1",
                fontFamily: "Poppins",
              }}
            >
          Register
        </Typography>
        <Typography 
            variant="body1" 
            textAlign="center" 
            mb={1}
            sx={{
              fontSize: { xs: ".7rem", sm: ".9rem", md: "1rem" },
              color: "black",
              fontFamily: "Poppins",
            }}
          >
          Fill in your details to create a new account. Make sure your email matches our employee records.
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            variant="outlined"
            label="Full Name"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
             sx={{
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
                        fontSize: { xs: ".7rem", sm: "1rem", md: "1.1rem" },
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
                    }}
          />
          <TextField
            variant="outlined"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            sx={{
                marginTop: { xs: "4px", sm: "6px", md: "9px" },
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
                      fontSize: { xs: ".7rem", sm: "1rem", md: "1.1rem" },
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
                }}
          />
            <TextField
              variant="outlined"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={{
            marginTop: { xs: "4px", sm: "6px", md: "9px" },
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
                  fontSize: { xs: ".7rem", sm: "1rem", md: "1.1rem" },
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
            }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

          <Button
            type="submit"
            variant="contained"
            fullWidth
           sx={{ 
                mt: 1, 
                backgroundColor: "black" ,
                fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
              }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        
        <Typography 
            textAlign="center" 
            mt={1} 
            color="black"
            sx={{
               fontSize: { xs: ".7rem", sm: ".9rem", md: "1rem" },
               fontFamily: "Poppins",
            }}
          >
          Already have an account?{" "}
      <Link 
              to="/login" 
              style={{ 
                color: theme.palette.primary.dark, 
                fontWeight: "bold", 
                textDecoration: "none",
                fontFamily: "Poppins",
              }}
            >
              Login
          </Link>
        </Typography>
      </Box>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  </Box>
  );
};

export default Register;
