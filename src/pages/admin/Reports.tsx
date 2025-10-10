import { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import { tokens } from "../../theme";
import Header from "../../components/Header";


const Reports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); 

  // Mock report data based on your suggestions
  const [reports] = useState([
    {
      id: 1,
      name: "Employee Summary Report",
      date: "2024-03-01",
      type: "HR Analytics",
      description: "Summary of employees including department, designation, and status.",
    },
    {
      id: 2,
      name: "Attendance & Activity Logs",
      date: "2024-02-28",
      type: "Employee Monitoring",
      description: "Records of employee logins, logouts, and attendance.",
    },
    {
      id: 3,
      name: "Document Status Report",
      date: "2024-02-25",
      type: "Document Management",
      description: "Employees with missing documents or status of uploaded documents.",
    },
    {
      id: 4,
      name: "Employee Tenure Report",
      date: "2024-02-25",
      type: "HR Analytics",
      description: "Employees nearing retirement or completing probation.",
    },
    {
      id: 5,
      name: "Filtered Employee Lists",
      date: "2024-02-20",
      type: "Data Export",
      description: "Exportable employee list filtered by role, department, or status.",
    },
    {
      id: 6,
      name: "ID Extract / OCR Data Reports",
      date: "2024-02-15",
      type: "OCR",
      description: "Logs of OCR extractions and accuracy of data extraction.",
    },
    {
      id: 7,
      name: "Custom Report Generator",
      date: "2024-01-30",
      type: "Advanced",
      description: "Generate custom reports with specific filters and export formats.",
    },
  ]);

  const handleDownload = (name: string) => {
    alert(`Downloading "${name}"... (placeholder functionality)`);
  };

  // const exportToPDF = () => {
  //   alert("Exporting all reports to PDF... (placeholder)");
  // };

  // const exportToCSV = () => {
  //   alert("Exporting all reports to CSV... (placeholder)");
  // };

  const columns = [
    { field: "name", headerName: "Report Name", flex: 2,  minWidth: 160, },
    { field: "date", headerName: "Date Generated", flex: 1,  minWidth: 120, },
    { field: "type", headerName: "Report Type", flex: 1,  minWidth: 150, },
   
    {
      field: "action",
      headerName: "Action",
      flex: 1.5,
      minWidth: 120,
      renderCell: (params: any) => (
           <Box display="flex" gap={1} mt={1}>
        <Button
             variant="outlined"
                  sx={{
                      color: colors.grey[900],
                      fontSize: { xs: ".5rem", sm: ".6rem", md: ".7rem" }
                  }}
                  startIcon={<DownloadIcon sx={{ color: 'primary' }} />} // You can use any color name or hex code
                  onClick={() => handleDownload(params.row.file_name)}
                >
            Download
          </Button>
      </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Reports" subtitle="View and Download Reports" />
        <Box display="flex" gap={2} mt={3}>
          {/* <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={exportToPDF}
            sx={{
              backgroundColor: "black",
              color: "#fff",
              "&:hover": { backgroundColor: colors.blueAccent[500] },
              textTransform: "none",
              fontSize: "13px",
              fontWeight: "bold",
              px: 3,
              py: 1.5,
              minWidth: "180px",
            }}
          >
            Export All to PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<TableViewIcon />}
            onClick={exportToCSV}
            sx={{
              backgroundColor: "black",
              color: "#fff",
              "&:hover": { backgroundColor: colors.blueAccent[500] },
              textTransform: "none",
              fontSize: "13px",
              fontWeight: "bold",
              px: 3,
              py: 1.5,
              minWidth: "180px",
            }}
          >
            Export All to CSV
          </Button> */}
        </Box>
      </Box>

             <Box
                     m="20px 0 0 0"
                     height="78vh"
                     sx={{
                       "& .MuiDataGrid-root": {
                         border: "none",
                         boxShadow: "2",
                       },
                       "& .MuiDataGrid-cell": {
                         borderBottom: "none"
                       },
                       "& .MuiDataGrid-columnHeader": {
                         background: `${colors.primary[400]}`,
                          color: colors.primary[100],
                         borderBottom: "none",
                         fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" },
                         fontFamily: "Poppins"
                       },
                       "& .MuiDataGrid-virtualScroller": {
                         
                          color: colors.grey[900],
                         fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
                         fontFamily: "Poppins"
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
                        "& .MuiSvgIcon-root": {
                         color: colors.grey[100],
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
      
        {reports.length > 0 ? (
          <DataGrid
            rows={reports}
            columns={columns}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
       
          />
        ) : (
          <Typography textAlign="center" p={2}>
            No reports available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Reports;
