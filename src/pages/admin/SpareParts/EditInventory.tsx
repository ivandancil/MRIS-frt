import { useState, useEffect, ChangeEvent } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";

interface EditInventoryProps {
  inventoryId: number | null;
  onInventoryUpdated: () => void;
  onClose: () => void;
}

function EditInventory({ inventoryId, onInventoryUpdated, onClose }: EditInventoryProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Styling for inputs
  const inputStyles = {
    "& .MuiInputLabel-root": {
      color: "black !important",
      fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
      fontFamily: "Poppins",
    },
    "& .MuiOutlinedInput-root fieldset": {
      borderColor: "black !important",
      borderWidth: 1,
    },
    "& .MuiInputBase-input": {
      color: "black",
      fontSize: { xs: ".7rem", sm: ".9rem", md: "1.1rem" },
      fontFamily: "Poppins",
    },
  };

  // Menu Item styling
  const menuItemTextStyles = {
    fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
    fontFamily: "Poppins",
  };

  // Local state for inventory data
  const [inventoryData, setInventoryData] = useState({
    itemCode: "",
    itemName: "",
    category: "",
    model: "",
    qty: "",
    unit: "",
    unit_cost: "",
    supplier: "",
    lastPurchased: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing inventory data
  useEffect(() => {
    if (!inventoryId) {
      console.warn("No inventoryId provided, skipping fetch.");
      return;
    }

    async function fetchInventory() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/inventories/${inventoryId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch inventory. Status: ${response.status}`);
        }

        const data = await response.json();
        const inventory = data.data || data;

        setInventoryData({
          itemCode: inventory.item_code || "",
          itemName: inventory.item_name || "",
          category: inventory.category || "",
          model: inventory.model || "",
          qty: inventory.qty || "",
          unit: inventory.unit || "",
          unit_cost: inventory.unit_cost || "",
          supplier: inventory.supplier || "",
          lastPurchased: inventory.last_purchased || "",
        });
      } catch (err: any) {
        console.error("Error fetching inventory:", err.message);
        setError(err.message || "Error loading inventory data.");
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, [inventoryId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInventoryData({ ...inventoryData, [e.target.name]: e.target.value });
  };

  // Update inventory
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/inventories/${inventoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inventoryData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update inventory. Status: ${response.status}`);
      }

      alert("Inventory updated successfully.");
      onInventoryUpdated();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update inventory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Item Code"
                name="itemCode"
                value={inventoryData.itemCode}
                onChange={handleChange}
                fullWidth
                required
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Item Name"
                name="itemName"
                value={inventoryData.itemName}
                onChange={handleChange}
                fullWidth
                required
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Category"
                name="category"
                value={inventoryData.category}
                onChange={handleChange}
                fullWidth
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Model"
                name="model"
                value={inventoryData.model}
                onChange={handleChange}
                fullWidth
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Quantity"
                name="qty"
                value={inventoryData.qty}
                onChange={handleChange}
                fullWidth
                required
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Unit"
                name="unit"
                value={inventoryData.unit}
                onChange={handleChange}
                fullWidth
                required
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Unit Cost"
                name="unitCost"
                value={inventoryData.unit_cost}
                onChange={handleChange}
                fullWidth
                required
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Supplier"
                name="supplier"
                value={inventoryData.supplier}
                onChange={handleChange}
                fullWidth
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Last Purchased"
                name="lastPurchased"
                type="date"
                value={inventoryData.lastPurchased}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={inputStyles}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
                fontFamily: "Poppins",
                background: `${colors.primary[400]}`,
                color: "black",
                "&:hover": { background: `${colors.grey[900]}` },
              }}
            >
              {loading ? "Saving..." : "Update Inventory"}
            </Button>
          </Box>
        </>
      )}
    </form>
  );
}

export default EditInventory;
