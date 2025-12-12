import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import AddRequest from "./AddRequest";
import EditRequest from "./EditRequest";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface RequestRow {
  id: number;
  controlNumber: string;
  itemName: string;
  qty: number;
  unit: string;
  supplier: string;
  remarks: string;
}

const Request = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [rows, setRows] = useState<RequestRow[]>([]);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);
const [editRequestId, setEditRequestId] = useState<number | null>(null);


  const [deleteLoadingIds, setDeleteLoadingIds] = useState<number[]>([]);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const dialogStyle = {
    fontSize: { xs: ".8rem", sm: ".9rem", md: "1rem" },
    fontFamily: "Poppins",
  };

  // =====================================
  // MASTER LIST STATES
  // =====================================
  const [masterListRows, setMasterListRows] = useState<any[]>([]);
  const [openMasterView, setOpenMasterView] = useState(false);
  const [selectedRequestItems, setSelectedRequestItems] = useState<any[]>([]);

  // =====================================
  // FETCH DAILY REQUEST ITEMS
  // =====================================
  const fetchRequests = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/requests");
      const data = await response.json();

      const formattedRows: RequestRow[] = data.flatMap((req: any) =>
        (req.items || []).map((item: any) => ({
          id: item.id,
          controlNumber: req.id.toString(),
          date: item.date ?? "",   
          itemName: item.item_name,
          qty: item.quantity,
          unit: item.unit,
          supplier: item.supplier,
          remarks: item.description ?? "",
        }))
      );

      setRows(formattedRows);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load requests:", error);
      setLoading(false);
    }
  };

  // =====================================
  // FETCH MASTER LIST
  // =====================================
  const fetchMasterList = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/requests");
      const data = await response.json();

      const formatted = data.map((req: any) => ({
        id: req.id,
        requestDate: req.created_at
          ? req.created_at.substring(0, 10)
          : "N/A",
        totalItems: req.items ? req.items.length : 0,
        items: req.items || [],
      }));

      setMasterListRows(formatted);
    } catch (error) {
      console.error("Error fetching master list:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchMasterList();
  }, []);

// DELETE SINGLE DAILY REQUEST ITEM
const deleteItem = async (itemId: number) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  try {
    setDeleteLoadingIds((prev) => [...prev, itemId]);

    const response = await fetch(
      `http://127.0.0.1:8000/api/request-items/${itemId}`,
      { method: "DELETE" }
    );

    if (!response.ok) throw new Error("Failed to delete item");

    fetchRequests(); // refresh Daily Request
    fetchMasterList(); // refresh Master List
  } catch (error) {
    console.error(error);
  } finally {
    setDeleteLoadingIds((prev) => prev.filter((id) => id !== itemId));
  }
};



  // =====================================
  // VIEW ITEM DETAILS (DAILY REQUEST)
  // =====================================
  const handleView = (item: RequestRow) => {
    setSelectedItem(item);
    setOpenViewDialog(true);
  };

  // =====================================
  // DATAGRID STYLES
  // =====================================
  const gridStyles = {
    "& .MuiDataGrid-root": { border: "none", boxShadow: "2" },
    "& .MuiDataGrid-cell": { borderBottom: "none" },
    "& .MuiDataGrid-columnHeader": {
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
    },
  };

  // =====================================
  // RENDER
  // =====================================
  return (
    <Box m="20px">
      <Header title="Daily Spare Request" subtitle="Create Daily Requisitions" />

      {/* TABS */}
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        textColor="inherit"
        sx={{
          mt: "20px",
          fontFamily: "Poppins",
          background: colors.grey[900],
        }}
      >
        <Tab label="Daily Request" />
        <Tab label="Master List (Requisitions)" />
      </Tabs>

      {/* CREATE REQUEST BUTTON */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          sx={{
            background: colors.primary[400],
            color: "black",
            textTransform: "none",
            fontFamily: "Poppins",
          }}
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Create Request
        </Button>
      </Box>

      {/* ==========================================================
          TAB 1: DAILY REQUEST
      =========================================================== */}
      {tabValue === 0 && (
        <Box height="70vh" mt={2} sx={gridStyles}>
          <DataGrid
            rows={rows}
            loading={loading}
            getRowId={(row) => row.id}
            columns={[
               { field: "date", headerName: "Date", flex: 1 },
              { field: "controlNumber", headerName: "Control #", flex: 1 },
              { field: "itemName", headerName: "Item Name", flex: 1 },
              { field: "qty", headerName: "Qty", flex: 0.5 },
              { field: "unit", headerName: "Unit", flex: 1 },
              { field: "supplier", headerName: "Supplier", flex: 1 },
              { field: "remarks", headerName: "Remarks", flex: 1.5 },
              {
                field: "actions",
                headerName: "Actions",
                flex: 1.5,
                renderCell: (params) => (
                <Box display="flex" gap={1} mt={1}>
                    {/* <Button
                       sx={{ textTransform: "none",
                          color: colors.grey[900],
                             fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }
                             }}
                        startIcon={<VisibilityIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
                      onClick={() => handleView(params.row)}
                    >
                      View
                    </Button> */}
                    <Button
                      color="error"
                      sx={{ textTransform: "none" }}
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteItem(params.row.id)}
                      disabled={deleteLoadingIds.includes(params.row.id)}
                    >
                      {deleteLoadingIds.includes(params.row.id)
                        ? "Deleting..."
                        : "Delete"}
                    </Button>

                  </Box>
                ),
              },
            ]}
          />
        </Box>
      )}

      {/* ==========================================================
          TAB 2: MASTER LIST
      =========================================================== */}
      {tabValue === 1 && (
        <Box height="70vh" mt={2} sx={gridStyles}>
          <DataGrid
            rows={masterListRows}
            getRowId={(row) => row.id}
            columns={[
              { field: "id", headerName: "Control #", flex: 1 },
              { field: "requestDate", headerName: "Date", flex: 1 },
              { field: "totalItems", headerName: "Total Items", flex: 1 },
              {
                field: "actions",
                headerName: "Actions",
                flex: 1.5,
                renderCell: (params) => (
                  <Box display="flex" gap={1} mt={1}>
                  <Button
                     sx={{ textTransform: "none",
                          color: colors.grey[900],
                             fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }
                             }}
                startIcon={<VisibilityIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
                    onClick={() => {
                      setSelectedRequestItems(params.row.items);
                      setOpenMasterView(true);
                    }}
                  >
                    View 
                  </Button>
                  <Button
                    sx={{ textTransform: "none",
                          color: colors.grey[900],
                             fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }
                             }}
                        startIcon={<EditIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
                    onClick={() => {
                      setEditRequestId(params.row.id);
                      setOpenEditDialog(true);
                    }}
                  >
                    Edit
                </Button>
                  </Box>
                ),
              },
            ]}
          />
        </Box>
      )}

      {/* ADD REQUEST DIALOG */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={dialogStyle}>Requisition Form</DialogTitle>
        <DialogContent>
          <AddRequest
            onInventoryAdded={() => {
              fetchRequests();
              fetchMasterList();
            }}
            onClose={() => setOpenAddDialog(false)}
          />
        </DialogContent>
       
      </Dialog>

   


      {/* MASTER LIST - VIEW ITEMS */}
      <Dialog
        open={openMasterView}
        onClose={() => setOpenMasterView(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={dialogStyle}>Requested Items</DialogTitle>
        <DialogContent>
          {selectedRequestItems.length === 0 ? (
            <p>No items found.</p>
          ) : (
            selectedRequestItems.map((item: any, index: number) => (
              <Box key={index} sx={{ mb: 2, p: 1, borderBottom: "1px solid #ccc" }}>
                <strong>Item Name:</strong> {item.item_name} <br />
                <strong>Quantity:</strong> {item.quantity} <br />
                <strong>Unit:</strong> {item.unit} <br />
                <strong>Description:</strong> {item.description}
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpenMasterView(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

         <Dialog
  open={openEditDialog}
  onClose={() => setOpenEditDialog(false)}
  fullWidth
  maxWidth="md"
>
  <DialogTitle>Edit Request</DialogTitle>
  <DialogContent>
    {editRequestId && (
      <EditRequest
        requestId={editRequestId}
        onUpdated={() => {
          fetchRequests();
          fetchMasterList();
        }}
        onClose={() => setOpenEditDialog(false)}
      />
    )}
  </DialogContent>
 
</Dialog>
    </Box>
  );
};

export default Request;
