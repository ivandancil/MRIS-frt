import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  DialogActions,
  Button,
  useTheme, // Import useTheme
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { tokens } from "../../../theme";

// Define an interface for the employee data structure
interface Employee {
  id: number;
  employeeID: string;
  jobPosition: string;
  lastname: string;
  firstname: string;
  middlename: string;
  sex: string;
  dateOfBirth: string;
  civilStatus: string;
  name: string; // This seems redundant if firstname/middlename/lastname exist, consider removing
  age: number;
  phoneNumber: string;
  email: string;
  address: string;
}

// Define an interface for the dialog props
interface ViewEmployeeDialogProps {
  open: boolean;
  documents: { documentName: string; documentUrl?: string }[];
  onClose: () => void;
  employee: Employee | null;
}

// --- Reusable Styles / Components (consider moving to separate files for larger projects) ---

// Custom hook for common typography styles in cards
const useCardTypographyStyles = () => {

  
  return {
    // Style for the bold text (labels) within cards
    label: {
      fontWeight: "bold",
      fontFamily: "Poppins",
      fontSize: { xs: ".75rem", sm: ".85rem", md: "1rem" }, // Slightly adjusted for better readability on xs
      // You can add margin-bottom here if needed for spacing between label and value
      mb: { xs: 0.5, sm: 0 }, // Adjust margin for smaller screens
    },
    // Style for the value text within cards
    value: {
      fontFamily: "Poppins",
      fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" }, // Slightly adjusted for better readability on xs
      color: "text.secondary", // Use theme's textSecondary for values
    },
    // Style for the main card section titles
    sectionTitle: {
      fontWeight: "bold",
      fontFamily: "Poppins",
      mb: 2,
      fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" }, // Make section titles more responsive
    }
  };
};

// --- ViewEmployee Component ---
function ViewEmployee({ open, onClose, employee, documents }: ViewEmployeeDialogProps) {
  if (!employee) return null;

  const theme = useTheme(); // Ensure theme is available for breakpoints
  const colors = tokens(theme.palette.mode);
  const { label, value, sectionTitle } = useCardTypographyStyles(); // Use the custom hook for styles

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      // Make the dialog full screen on extra small devices
      // and adjust padding for DialogContent
      sx={{
        '& .MuiDialog-paper': {
          [theme.breakpoints.down('sm')]: {
            margin: 0, // Remove margin on small screens
            maxHeight: '95%', // Allow dialog to take full height
            borderRadius: 2, // Remove border radius for full-screen effect
          },
        },
        '& .MuiDialogContent-root': {
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(1), // Reduce padding for content on small screens
            },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `${colors.primary[400]}`,
          height: { xs: 40, sm: 50, md: 60 },
          color: `${colors.grey[100]} `,
          fontWeight: "bold",
          fontFamily: "Poppins",
          fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" }, // Adjusted font sizes
          textAlign: "center",
          p: { xs: 1.5, sm: 2 }, // Add responsive padding to title
        }}
      >
        Employee Profile
      </DialogTitle>

      <DialogContent dividers>
        <Box p={{ xs: 1, sm: 2, md: 3 }}> {/* Responsive padding for the main Box */}
          {/* Profile Section */}
          <Box
            display="flex"
            alignItems="center"
            mb={3}
            gap={{ xs: 1, sm: 2, md: 3 }} // Responsive gap
            flexDirection={{ xs: "column", sm: "row" }} // Stack vertically on xs, row on sm+
            textAlign={{ xs: "center", sm: "left" }} // Center text on xs
          >
            <Box
              sx={{
                width: { xs: 80, sm: 100, md: 120 }, // Responsive width
                height: { xs: 80, sm: 100, md: 120 }, // Responsive height
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "#B0BEC5",
                mb: { xs: 1, sm: 0 }, // Add margin-bottom on xs when stacked
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: "#fff" }} /> {/* Responsive icon size */}
            </Box>
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                fontFamily="Poppins"
                sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.8rem" } }}
              >
                {employee.firstname} {employee.middlename} {employee.lastname}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h5"
                fontFamily="Poppins"
                sx={{ fontSize: { xs: ".8rem", sm: "1rem", md: "1.3rem" } }}
              >
                {employee.jobPosition}
              </Typography>
            </Box>
          </Box>

          {/* Personal Info */}
          <Card sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={sectionTitle}>
                PERSONAL INFORMATION :
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}> {/* Responsive spacing */}
                <Grid item xs={12} sm={6}> {/* Full width on xs, half on sm+ */}
                  <Typography sx={label}>Employee ID:</Typography>
                  <Typography sx={value}>{employee.employeeID || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Sex:</Typography>
                  <Typography sx={value}>{employee.sex || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Date of Birth:</Typography>
                  <Typography sx={value}>{employee.dateOfBirth || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Age:</Typography>
                  <Typography sx={value}>{employee.age || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Civil Status:</Typography>
                  <Typography sx={value}>{employee.civilStatus || "N/A"}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={sectionTitle}>
                CONTACT INFORMATION :
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Email:</Typography>
                  <Typography sx={value}>{employee.email || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Phone Number:</Typography>
                  <Typography sx={value}>{employee.phoneNumber || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12}> {/* Full width for address */}
                  <Typography sx={label}>Address:</Typography>
                  <Typography sx={value}>{employee.address || "N/A"}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={sectionTitle}>
                DOCUMENTS :
              </Typography>
              {documents.length > 0 ? (
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  {documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}> {/* Adjust column sizes */}
                      <Card sx={{ p: { xs: 1, sm: 2 }, boxShadow: 1 }}> {/* Smaller padding on xs */}
                        <Typography fontWeight="bold" sx={{ fontSize: { xs: ".75rem", sm: ".85rem", md: "1rem" }, fontFamily: "Poppins" }}>
                          {doc.documentName}
                        </Typography>
                        <Box mt={1}>
                          <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => doc.documentUrl && window.open(doc.documentUrl, "_blank")}
                            sx={{ fontSize: { xs: ".7rem", sm: ".8rem", md: ".9rem" } }} // Responsive button text
                            disabled={!doc.documentUrl} // Disable button if no URL
                          >
                            View
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={value}>No documents available</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 1, sm: 2 } }}> {/* Responsive padding for actions */}
        <Button 
          onClick={onClose} 
          variant="contained" 
          color="primary" 
          autoFocus 
            sx={{ 
              fontSize: { xs: ".6rem", sm: ".8rem", md: ".9rem" },
              fontFamily: "Poppins",
              }}
            >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewEmployee;