import React, { useState } from 'react';
import { message } from 'antd';
import { Box, Button, Card, CardContent, CircularProgress, IconButton, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { UploadCloud, XCircle } from 'lucide-react';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from '../../theme';
import Header from '../../components/Header';

const UploadDocs = () => {
   const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const [documents, setDocuments] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState("Upload Documents/Files");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

            const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); 

    // Handle tab change
    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
      if (newValue === "View Uploaded Documents/File") {
        fetchDocuments();  // Fetch documents when switching to this tab
      }
    };

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  // Clear selected file
  const handleClearFile = () => {
    setFile(null);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-pds", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "File uploaded successfully!");

        setFile(null); // Reset file input field after successful upload
        setCurrentTab("View Uploaded Documents/File"); // 👈 Redirect to the view tab
        fetchDocuments(); // 👈 Refresh the uploaded docs list
      } else {
        const result = await response.json();
        alert(`Upload failed: ${result.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload File. Please try again.");
    } finally {
      setUploading(false);
    }
  };

    // Fetch uploaded documents from the API
    const fetchDocuments = async () => {
        setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/documents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          const files = data.files || []; // 👈 extract only the files
          const documentsWithUrl = files.map((doc: any) => ({
            ...doc,
            fileUrl: `http://127.0.0.1:8000${doc.file_path}`,
          }));
          setDocuments(documentsWithUrl);
        } else {
          console.error("Failed to fetch documents");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
      setLoading(false);
    }
  };
    
    

    const handleDelete = async (id: number | string) => {
      const confirmation = window.confirm('Are you sure you want to delete this document?');
      if (!confirmation) return;
    
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/files/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
        if (response.ok) {
          const result = await response.json();
          message.success(result.message);
          // Remove the deleted document from the UI by filtering it out from the state
          setDocuments((prevDocs) => prevDocs.filter(doc => doc.id !== id));
        } else {
          const result = await response.json();
          message.error(`Failed to delete file: ${result.message || 'Something went wrong'}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        message.error('Failed to delete file. Please try again.');
      }
    };
    

  // Columns for the uploaded documents table
  const columns = [
    {
      field: 'original_name',
      headerName: 'Document Name',
      flex: 1,
       minWidth: 180, 
    },
    {
      field: 'uploaded_at',
      headerName: 'Uploaded On',
      flex: 1,
       minWidth: 180, 
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
       minWidth: 180, 
      renderCell: (params: any) => (
        <Box display="flex" gap={1} mt={1}>
         <Button
           sx={{ 
              textTransform: "none",
              color: colors.grey[900],
              fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }
            }}
          startIcon={<VisibilityIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
          onClick={() => window.open(params.row.file_path, '_blank')}
        >
          View
        </Button>

          <Button
            sx={{
              textTransform: "none",
              fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
              backgroundColor: "primary", 
              "&:hover": { backgroundColor: "primary" },
            }}
            startIcon={<DeleteIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Upload Documents" subtitle="Manage Documents and Files" />
      </Box>

      <Tabs
        value={currentTab}
        textColor="inherit"
        onChange={handleTabChange}
        sx={{
          mt: '20px',
          fontWeight: 'bold',
          fontFamily: "Poppins",
          background: `${colors.grey[900]}`,
          boxShadow: "1",
           borderRadius: "5px",
          '& .MuiTab-root': { color: '#000', fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" }, },
          '& .Mui-selected': { color: 'black', fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" }, },
          '& .MuiTabs-indicator': { backgroundColor: 'black', height: '3px', borderRadius: '10px' },
        }}
      >
        <Tab value="Upload Documents/Files" label="Upload Documents/Files" />
        <Tab value="View Uploaded Documents/File" label="View Uploaded Documents" />
        {/* <Tab value="View Uploaded Scanned Images" label="Scanned Images/Files" /> */}
      </Tabs>

      {currentTab === "Upload Documents/Files" && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Card sx={{ width: { xs: 300, sm: 350, md: 400 }, padding: 2, boxShadow: 6 }}>
            <CardContent>
              <Typography 
                  variant="h5" 
                  textAlign="center"
                  fontFamily="Poppins"
                  gutterBottom 
                  mb={3}
                  sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" } }}
                >
                UPLOAD FILE
              </Typography>

              <Box
                sx={{
                  border: "2px dashed #90caf9",
                  borderRadius: 2,
                  padding: 3,
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <UploadCloud size={40} color="#1e88e5" />
                <Typography variant="body1" color="primary" sx={{ fontWeight: 400, fontFamily: "Poppins" }}>
                  Click to select a file
                </Typography>
                <input
                  type="file"
                  id="fileInput"
                  hidden
                  onChange={handleFileChange}
                  accept=".csv, .xlsx, .xls, .pdf, .docx"  // Added .pdf for PDF file support
                />
              </Box>

              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}

              {file && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#e3f2fd",
                    padding: 1.5,
                    borderRadius: 2,
                    mt: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="black"  sx={{ fontFamily: "Poppins" }}>{file.name}</Typography>
                    <Typography variant="caption" color="black" sx={{ fontFamily: "Poppins" }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                  <IconButton onClick={handleClearFile} color="error">
                    <XCircle size={20} />
                  </IconButton>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                sx={{ 
                  mt: 3, 
                  height: 45, 
                  fontWeight: 500,
                  background: `${colors.primary[400]}`,
                  color: "black",
                 "&:hover": { background: `${colors.grey[900]}`, },
                 fontSize: { xs: ".5rem", sm: ".7rem", md: ".9rem" },
                  fontFamily: "Poppins"
                 }}
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload File"}
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {currentTab === "View Uploaded Documents/File" && (
       <Box
               m="20px 0 0 0"
               height="70vh"
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
                   // backgroundColor: colors.primary[400],
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
            rows={documents}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
     
          />
        </Box>
      )}

      {currentTab === "View Uploaded Scanned Images" && (
        <Box mt={3}>
          <p style={{ fontStyle: 'italic', color: '#888' }}>
            No scanned images uploaded yet.
          </p>
        </Box>
      )}
    </Box>
  );
};

export default UploadDocs;
