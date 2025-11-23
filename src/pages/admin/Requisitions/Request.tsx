import { Box, Button, Tab, Tabs, useTheme } from '@mui/material'
import Header from '../../../components/Header'
import { useState } from 'react';
import { tokens } from '../../../theme';
import AddIcon from "@mui/icons-material/Add";
  

const Request = () => {

    const theme = useTheme();
     const colors = tokens(theme.palette.mode);

     const [tabValue, setTabValue] = useState(0); 

       const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
     <Box m="20px">
      <Header title="Daily Spare Request" subtitle="Create Daily Requesitions" />

        {/* ---------------- TABS ---------------- */}
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              textColor="inherit"
              sx={{
                mt: "20px",
                fontFamily: "Poppins",
                background: colors.grey[900],
                "& .MuiTab-root": { color: "#000" },
                "& .Mui-selected": { color: "black" },
                "& .MuiTabs-indicator": { backgroundColor: "black" },
              }}
            >
                 <Tab label="Daily Request" />
                <Tab label="Master List (Requesitions)" />
             
            </Tabs>

            <Box>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                    variant="contained"
                    sx={{
                        background: colors.primary[400],
                        color: "black",
                        "&:hover": { background: colors.grey[900] },
                        textTransform: "none",
                        fontFamily: "Poppins",
                    }}
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddDialog(true)}
                    >
                    Add Item
                    </Button>
                </Box>
         </Box>

            

      </Box>
  )
}

export default Request