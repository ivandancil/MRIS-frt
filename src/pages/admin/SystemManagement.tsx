import { Box, Typography, useTheme, Tabs, Tab, Tooltip, Grid, useMediaQuery } from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useSearch } from "../../components/SearchContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import moment from "moment";


interface RowData {
  id: number;
  name: string;
  email: string;
  access: "admin" | "user";
}


interface UserLogData {
  id: number;
  name: string;
  action: string;
  timestamp: string;
  user?: {
    name: string;
  };
}

const SystemManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [_, setError] = useState("");
  const { searchTerm } = useSearch();
  const [users, setUsers] = useState<RowData[]>([]);
  const [userLogs, setUserLogs] = useState<UserLogData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);
 
      const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); 

  const [userPagination, setUserPagination] = useState({ page: 0, pageSize: 10 });
  const [userLogPagination, setUserLogPagination] = useState({ page: 0, pageSize: 10 });

  //Fetching User data from the API
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      const usersArray = Array.isArray(data) ? data : data.data || [];
      const formattedUsers = usersArray.map((user: any) => ({
        ...user,
        access:
          user.access?.toLowerCase() === "admin"
            ? "admin"
            : "user",
      }));
      
      setUsers(formattedUsers);
    } catch (err: any) {
      setError(err.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  //Fetching logs from the API
  const fetchUserLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/user-logs", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user logs.");
      const data = await response.json();
      setUserLogs(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load user logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabValue === 0) fetchUsers();
    if (tabValue === 1) fetchUserLogs();
  }, [tabValue]);


    // Filtering logic based on searchTerm
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredUserLogs = userLogs.filter((log) =>
      log.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  

  const columns = [
    { field: "id", headerName: "ID", width: isSmallScreen ? 80 : 90,},
    { field: "name", headerName: "Name", flex: 1,  minWidth: 120,  },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180,  },
    { field: "access", headerName: "Access Level", flex: 1, minWidth: 150, 
      renderCell: ({ row }: { row: RowData }) => (
        <Box
          width="30%"
          m="20 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          mt={1.5}
        >
          <Tooltip
             title={row.access === "admin" ? "Administrator" : "Regular User"}
          >
             <Box 
              display="flex" 
              alignItems="center"
              
            >
                {row.access === "admin" && <AdminPanelSettingsOutlinedIcon  sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit',  }} />}
                {row.access === "user" && <LockOpenOutlinedIcon  sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
                <Typography 
                  color={colors.grey[900]} 
                  sx={{ 
                    ml: "5px",
                    display: isSmallScreen ? 'flex' : 'block',
                    fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
                    fontFamily: "Poppins",
                    fontWeight: "bold"
                  }}
                >
                  {row.access === "admin" ? "Admin" : "User"} 
                </Typography>
              </Box>
          </Tooltip>
        </Box>
      ),
    },
  ];
  
 const userLogColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: isSmallScreen ? 80 : 90, },
  { field: "name", headerName: "Name", flex: 1, minWidth: 120, },
  { field: "action", headerName: "Action", flex: 1, minWidth: 120, },
  { field: 'timestamp', headerName: 'Timestamp', flex: 1, minWidth: 160, valueFormatter: ({ value }: any) => moment(value).format('MMMM Do YYYY, h:mm:ss a') },
 
];

  
  return (
    <Box m="20px">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Header title="System Management" subtitle="Manage Users & View System Logs" />
          </Grid>
      </Grid>
      <Tabs 
        value={tabValue}
        textColor="inherit"
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{
          mt: '20px',
          fontWeight: 'bold',
          fontFamily: "Poppins",
          background: `${colors.grey[900]}`,
           boxShadow: "1",
           borderRadius: "5px",
          '& .MuiTab-root': { color: '#000', fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" }, },
          '& .Mui-selected': { color: 'black', fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" }, },
          '& .MuiTabs-indicator': {  backgroundColor: 'black', height: '3px', borderRadius: '10px' },
        }}
      >
        <Tab label="Registered Users" />
        <Tab label="User Logs" />
      </Tabs>

      {tabValue === 0 && (
        <Box
        m="20px 0 0 0"
        height="69vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            boxShadow: "2",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none"
          },
          "& .MuiDataGrid-columnHeader": {
           
            color: colors.primary[100],
            borderBottom: "none",
            fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" },
            fontFamily: "Poppins"
          },
          "& .MuiDataGrid-virtualScroller": {
              color: colors.grey[900],
            fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
            fontFamily: "Poppins",
            
            
          },
          "& .MuiDataGrid-footerContainer": {
            background: `${colors.primary[400]}`,
            borderTop: "none",
            fontSize: { xs: ".2rem", sm: ".7rem", md: ".9rem" },
            fontFamily: "Poppins"
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
              
          },
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
              '@media (max-width: 900px)': {
                  '&.MuiDataGrid-columnHeader--hide, &.MuiDataGrid-cell--hide': {
                      display: 'none !important',
                  },
              },
          },
        }}
      >
       
            <DataGrid
              loading={loading}
              rows={filteredUsers}
              columns={columns}
              paginationModel={userPagination}
              onPaginationModelChange={setUserPagination}
              pageSizeOptions={[5, 10, 25]}
             
              
            />
        
        </Box>
      )}

      {tabValue === 1 && (
        <Box
        m="20px 0 0 0"
        height="69vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            boxShadow: "2"
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none"
          },
          "& .MuiDataGrid-columnHeader": {
            color: colors.primary[100],
            borderBottom: "none",
            fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" },
            fontFamily: "Poppins"
          },
          "& .MuiDataGrid-virtualScroller": {
            color: colors.grey[900],
            fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
            fontFamily: "Poppins",
           
          },
          "& .MuiDataGrid-footerContainer": {
            background: `${colors.primary[400]}`,
            borderTop: "none",
            fontSize: { xs: ".2rem", sm: ".7rem", md: ".9rem" },
            fontFamily: "Poppins"
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
              '@media (max-width: 900px)': {
                  '&.MuiDataGrid-columnHeader--hide, &.MuiDataGrid-cell--hide': {
                      display: 'none !important',
                  },
              },
          },
        }}
      >
        
            <DataGrid
              loading={loading}
              rows={filteredUserLogs}
              columns={userLogColumns}
              paginationModel={userLogPagination}
              onPaginationModelChange={setUserLogPagination}
              pageSizeOptions={[5, 10, 25]}
              
            />
         
        </Box>
      )}
    </Box>
  );
};


export default SystemManagement;



