import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'; 
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import Header from "../../components/Header";
import { tokens } from "../../theme";

interface Document {
  id: number;
  name: string;
  type: string;
  uploadedBy: string;
  date: string;
  category: string;
}

function DocumentManagement() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentTab, setCurrentTab] = useState("Common");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [scanTargetDocId, setScanTargetDocId] = useState<number | null>(null);


  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

   const handleDownload = (name: string) => {
    alert(`Downloading "${name}"... (placeholder functionality)`);
  };

  // const deleteDocument = (id: number) => {
  //   setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
  // };

  // const handleUploadClick = () => {
  //   fileInputRef.current?.click();
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

      const newDocuments: Document[] = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: file.type.split("/")[1]?.toUpperCase() || "FILE",
        uploadedBy: "Current User",
        date: new Date().toISOString().split("T")[0],
        category: currentTab,
      }));

      setDocuments((prevDocs) => [...prevDocs, ...newDocuments]);
      event.target.value = "";
  };

  const handleScanChange = async (
    event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const formData = new FormData();
        formData.append("document", file);
        formData.append("category", currentTab);
        if (scanTargetDocId) {
          formData.append("linked_doc_id", scanTargetDocId.toString());
    }


    // Fetch API to upload the scanned document
    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-document", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Scan uploaded successfully!");
        fetchDocuments();
      } else {
        alert("Failed to upload scanned document.");
      }
        } catch (error) {
          console.error("Scan error:", error);
          alert("Error occurred during scan upload.");
        }

        event.target.value = "";
      };

  // Fetch uploaded documents from API on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/documents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

         // --- CRITICAL FIX FOR "data.map is not a function" ---
      let documentsToProcess: any[] = [];

      // Check if the API returns an object with a 'files' array (common backend pattern)
      if (data && Array.isArray(data.files)) {
        documentsToProcess = data.files;
      }
      // Check if the API returns an array directly (also common)
      else if (Array.isArray(data)) {
        documentsToProcess = data;
      }
      // Handle cases where the data might be a single object but not an array (less common for lists)
      else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          console.warn("API returned a single object instead of an array. Wrapping in an array for processing.");
          documentsToProcess = [data];
      }
      // If none of the above, it's an unexpected format
      else {
        console.error("API response for documents is not a recognized array format or is empty:", data);
        throw new TypeError("Unexpected data format from server. Expected an array of documents or an object containing a 'files' array.");
      }

         const mappedData: Document[] = documentsToProcess.map((doc: any) => ({
          id: doc.id,
          name: doc.original_name,
          type: doc.type?.toUpperCase() || "FILE",
          uploadedBy: doc.uploaded_by || "Admin",
          date: doc.uploaded_at?.split("T")[0] || "",
          category: doc.category || "Common",
        }));

        setDocuments(mappedData);
      } else {
        console.error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Document Name", flex: 2, minWidth: 160, },
    { field: "type", headerName: "Type", flex: 1, minWidth: 120, },
    { field: "uploadedBy", headerName: "Uploaded By", flex: 1, minWidth: 160, },
    { field: "date", headerName: "Upload Date", flex: 1, minWidth: 160, },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      minWidth: 280,
      renderCell: (params) => (
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

          <Button
            variant="outlined"
             sx={{
                      color: colors.grey[900],
                      fontSize: { xs: ".5rem", sm: ".6rem", md: ".7rem" }
                  }}
                  
            startIcon={<DocumentScannerIcon sx={{ color: 'primary' }} />}
            onClick={() => {
              setScanTargetDocId(params.row.id);
              cameraInputRef.current?.click(); 
            }}
                      >
            Scan Document
          </Button>
        </Box>
      ),
    },
  ];

  const filteredDocuments = documents.filter(
    (doc) => doc.category === currentTab
  );

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Document Management"
          subtitle="Organize and Access Your Files Efficiently"
        />
      
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          style={{ display: "none" }}
          onChange={handleScanChange}
        />
      </Box>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
          sx={{
            mt: "20px",
            fontWeight: "bold",
            background: `${colors.grey[900]}`,
            boxShadow: "1",
            borderRadius: "5px",
            fontFamily: "Poppins",
             '& .MuiTab-root': { color: '#000',  fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" }, },
            '& .Mui-selected': { color: 'black', fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" }, },
            '& .MuiTabs-indicator': { backgroundColor: '#1976d2', height: '3px', borderRadius: '10px' },
             
            }}
      >
        <Tab value="Common" label="Uploaded Files by HR" />

      </Tabs>
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
            fontFamily: "Poppins",
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
             fontFamily: "Poppins",
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
          rows={filteredDocuments}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
        
        />
      </Box>
    </Box>
  );
}

export default DocumentManagement;
