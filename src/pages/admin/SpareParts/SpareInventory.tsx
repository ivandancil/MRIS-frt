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
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSearch } from "../../../components/SearchContext";
import { tokens } from "../../../theme";
import AddInventory from "./AddInventory";
import ViewInventory from "./ViewInventory";
import EditInventory from "./EditInventory";

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

function SpareInventory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { searchTerm } = useSearch();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const editDialogRef = useRef<HTMLButtonElement>(null);
  const addDialogRef = useRef<HTMLButtonElement>(null);

  const dialogStyle = {
    fontSize: { xs: ".8rem", sm: ".9rem", md: "1rem" },
    fontFamily: "Poppins",
  };

  // ✅ Fetch inventory from API
  async function fetchInventory() {
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
      const inventoryArray = Array.isArray(data) ? data : data.data || [];
      setInventory(inventoryArray);
    } catch (err: any) {
      console.error("Error fetching inventory:", err.message);
      setError(err.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  // ✅ Delete an item
  const deleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/inventories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete item.");

      setInventory(inventory.filter((item) => item.id !== id));
      alert("Item deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete item.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✅ View item
  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenViewDialog(true);
  };

  // ✅ Search filter
  const filteredInventory = inventory.filter(
    (item) =>
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Spare Palo Inventory" subtitle="Manage & Monitor Stocks" />
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ m: { xs: "10px", sm: "13px", md: "15px" } }}>
        <Button
          variant="contained"
          sx={{
            background: `${colors.primary[400]}`,
            color: "black",
            "&:hover": { background: `${colors.grey[900]}` },
            textTransform: "none",
            fontSize: { xs: ".5rem", sm: ".7rem", md: ".9rem" },
            fontFamily: "Poppins",
            py: { xs: 0.8, sm: 1, md: 1.3 },
            width: { xs: "9rem", sm: "10rem", md: "12rem" },
          }}
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          ref={addDialogRef}
        >
          Add Item
        </Button>
      </Box>

      {error && (
        <Typography color="error" textAlign="center" mt={2}>
          {error}
        </Typography>
      )}

      {/* ✅ Inventory Table */}
                 <Box
                m="10px 0 0 0"
                height="71vh"
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
          rows={filteredInventory}
          columns={[
            { field: "item_code", headerName: "Item Code", flex: 1 },
            { field: "item_name", headerName: "Item Name", flex: 1 },
            { field: "category", headerName: "Category", flex: 1 },
            { field: "model", headerName: "Model", flex: 1 },
            { field: "qty", headerName: "Qty", flex: 1 },
            { field: "unit", headerName: "Unit", flex: 1 },
            // { field: "unit_cost", headerName: "Unit Cost", flex: 1 },
            { field: "supplier", headerName: "Supplier", flex: 1 },
            // { field: "last_purchased", headerName: "Last Purchased", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              flex: 1.5,
              renderCell: (params) => (
                <Box display="flex" gap={1} mt={1}>
                  <Button
                    sx={{ textTransform: "none", color: colors.grey[900] }}
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleView(params.row)}
                  >
                    View
                  </Button>
                  <Button
                    sx={{ textTransform: "none", color: colors.grey[900] }}
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setSelectedItemId(params.row.id);
                      setOpenEditDialog(true);
                    }}
                    ref={editDialogRef}
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{ textTransform: "none" }}
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteItem(params.row.id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </Button>
                </Box>
              ),
            },
          ]}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 20]}
          paginationModel={{ page: 0, pageSize: 10 }}
        />
      </Box>

      {/* ✅ Add Item Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="md">
        <DialogTitle sx={dialogStyle}>Add New Inventory Item</DialogTitle>
        <DialogContent>
          <AddInventory onInventoryAdded={fetchInventory} onClose={() => setOpenAddDialog(false)} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddDialog(false)}
            variant="contained"
            sx={{ fontFamily: "Poppins" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ View Item Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} fullWidth maxWidth="sm">
        <ViewInventory
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          inventory={selectedItem}
        />
      </Dialog>

        {/* Edit Employee Dialog */}
 <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="md">
  <DialogTitle sx={dialogStyle}>Edit Inventory Item</DialogTitle>
  <DialogContent>
    <EditInventory
      inventoryId={selectedItemId}
      onInventoryUpdated={fetchInventory}
      onClose={() => setOpenEditDialog(false)}
    />
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setOpenEditDialog(false)}
      color="primary"
      variant="contained"
      autoFocus
      sx={{ fontFamily: "Poppins", fontSize: { xs: ".6rem", sm: ".7rem", md: ".8rem" } }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}

export default SpareInventory;
