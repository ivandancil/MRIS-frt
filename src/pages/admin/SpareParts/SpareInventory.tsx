import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSearch } from "../../../components/SearchContext";
import { tokens } from "../../../theme";
import AddInventory from "./AddInventory";
import ViewInventory from "./ViewInventory";
import EditInventory from "./EditInventory";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

interface InventoryItem {
  id: number;
  itemCode: string;
  itemName: string;
  category: string;
  model: string;
  qty: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastPurchased: string;
}


// -------------------- DATE FORMATTER --------------------
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
// ---------------------------------------------------------


function SpareInventory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { searchTerm } = useSearch();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [_, setError] = useState("");

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const editDialogRef = useRef<HTMLButtonElement>(null);


  const [deleteLoadingIds, setDeleteLoadingIds] = useState<number[]>([]);
  const [tabValue, setTabValue] = useState(0); // 0: Daily Purchases, 1: Master List

  const dialogStyle = {
    fontSize: { xs: ".8rem", sm: ".9rem", md: "1rem" },
    fontFamily: "Poppins",
  };

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); 

  // --- Fetch Inventory ---
  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/inventories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const inventoryArray = (Array.isArray(data) ? data : data.data || []).map(
        (item: any) => ({
          id: item.id,
          itemCode: item.item_code,
          itemName: item.item_name,
          category: item.category,
          model: item.model,
          qty: item.qty,
          unit: item.unit,
          unitCost: item.unit_cost,
          supplier: item.supplier,
            lastPurchased: formatDate(item.last_purchased), // 🎯 APPLY FORMAT HERE
        })
      );
      setInventory(inventoryArray);
    } catch (err: any) {
      setError(err.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // --- View Item ---
  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenViewDialog(true);
  };

  // --- Delete Item ---
  const deleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeleteLoadingIds((prev) => [...prev, id]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/inventories/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete item.");

      setInventory((prev) => prev.filter((item) => item.id !== id));
      alert("Item deleted successfully.");
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Filtered Inventory
  const filteredInventory = inventory.filter(
    (item) =>
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Master Inventory: aggregate qty by itemCode ---
  const masterInventory = inventory.reduce<InventoryItem[]>((acc, item) => {
    const existing = acc.find((i) => i.itemCode === item.itemCode);
    if (existing) {
      existing.qty += item.qty; // sum quantities
      existing.lastPurchased = item.lastPurchased; // update lastPurchased to most recent
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  return (
    <Box m="20px">
      <Header title="Spare Palo Inventory" subtitle="Manage & Monitor Stocks" />

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
        <Tab label="Daily Purchases" />
        <Tab label="Master List" />
      </Tabs>

      {/* ---------------- TAB PANELS ---------------- */}

      {/* Daily Purchases Tab */}
      {tabValue === 0 && (
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

          <Box height="70vh" mt={2}
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
              rows={filteredInventory}
              columns={[
                { field: "lastPurchased", headerName: "Purchase Date", flex: 1 },
                { field: "itemCode", headerName: "Item Code", flex: 1 },
                { field: "itemName", headerName: "Item Name", flex: 1 },
                // { field: "category", headerName: "Category", flex: 1 },
                { field: "model", headerName: "Model", flex: 1 },
                { field: "qty", headerName: "Qty", flex: 0.5 },
                { field: "unit", headerName: "Unit", flex: 1 },
                { field: "supplier", headerName: "Supplier", flex: 1 },
               {
                field: "actions",
                headerName: "Actions",
                flex: 1.5,
                renderCell: (params) => (
                   <Box display="flex" gap={1} mt={1}>

                    {/* View Button */}
                    <Button
                        sx={{ textTransform: "none",
                          color: colors.grey[900],
                             fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }
                             }}
                        startIcon={<VisibilityIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
                        onClick={() => handleView(params.row)}
                      >
                        View
                    </Button>

                  {/* Edit Button */}
                    <Button
                        sx={{ textTransform: "none",
                          color: colors.grey[900],
                             fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }
                             }}
                        startIcon={<EditIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
                       onClick={() => {
                      setSelectedItemId(params.row.id); // update selectedItemId
                      setOpenEditDialog(true);
                    }}

                        ref={editDialogRef}
                      >
                        Edit
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
                      onClick={() => deleteItem(params.row.id)}
                      disabled={deleteLoadingIds.includes(params.row.id)}
                    >
                     
                      {deleteLoadingIds.includes(params.row.id) ? "Deleting..." : "Delete"}
                    </Button>
                  </Box>
                ),
              }

              ]}
              loading={loading}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 20]}
            />
          </Box>
        </Box>
      )}

      {/* Master List Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" mt={2} mb={2} fontFamily="Poppins">
            Master List
          </Typography>

          <Box height="70vh"
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
              rows={masterInventory.filter(
                (item) =>
                  item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              columns={[
                { field: "itemCode", headerName: "Item Code", flex: 1 },
                { field: "itemName", headerName: "Item Name", flex: 1 },
                { field: "category", headerName: "Category", flex: 1 },
                { field: "model", headerName: "Model", flex: 1 },
                { field: "qty", headerName: "Total Qty", flex: 1 },
                { field: "unit", headerName: "Unit", flex: 1 },
                { field: "supplier", headerName: "Supplier", flex: 1 },
                {
                  field: "lastPurchased",
                  headerName: "Last Purchased",
                  flex: 1,
                },
                {
                  field: "actions",
                  headerName: "Actions",
                  flex: 1,
                  renderCell: (params) => (
                    <Box display="flex" gap={1} mt={1}>
                        {/* View Button */}
                    <Button
                        sx={{ textTransform: "none",
                          color: colors.grey[900],
                             fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" }
                             }}
                        startIcon={<VisibilityIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
                        onClick={() => handleView(params.row)}
                      >
                        View
                    </Button>

                      {/* <Button
                         sx={{
                          textTransform: "none",
                          fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
                          backgroundColor: "primary", 
                          "&:hover": { backgroundColor: "primary" },
                        }}
                          startIcon={<DeleteIcon sx={{ fontSize: isSmallScreen ? '1rem' : 'inherit' }} />}
                        color="error"
                        onClick={() => deleteItem(params.row.id)}
                        disabled={deleteLoadingIds.includes(params.row.id)}
                      >
                        {deleteLoadingIds.includes(params.row.id)
                          ? "Deleting..."
                          : "Delete"}
                      </Button> */}
                    </Box>
                  ),
                },
              ]}
              loading={loading}
              getRowId={(row) => row.itemCode}
              pageSizeOptions={[5, 10, 20]}
            />
          </Box>
        </Box>
      )}

      {/* Add/Edit/View Dialogs */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={dialogStyle}>Add New Inventory Item</DialogTitle>
        <DialogContent>
          <AddInventory
            onInventoryAdded={fetchInventory}
            onClose={() => setOpenAddDialog(false)}
          
          />
        </DialogContent>
     
      </Dialog>

      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <ViewInventory
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          inventory={selectedItem}
        />
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={dialogStyle}>Edit Inventory Item</DialogTitle>
        <DialogContent>
          <EditInventory
            inventoryId={selectedItemId}
            onInventoryUpdated={fetchInventory}
            onClose={() => setOpenEditDialog(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SpareInventory;
