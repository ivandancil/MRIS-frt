import { Box, Button, TextField, Grid, IconButton, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface EditRequestProps {
  requestId: number;
  onUpdated: () => void;
  onClose: () => void;
}

interface RequestItem {
  id?: number;
  date: string;
  itemName: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  amount: string;
  supplier: string;
  description: string;
}

const EditRequest = ({ requestId, onUpdated, onClose }: EditRequestProps) => {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------
const fetchRequest = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/requests/${requestId}`);
    const data = await response.json();

    setItems(
      data.items.map((item: any) => ({
        id: item.id,
        date: item.date ?? "",
        itemName: item.item_name ?? "",
        quantity: item.quantity ?? "",
        unit: item.unit ?? "",
        unitPrice: item.unit_price ?? "",
        amount: item.amount ?? "",
        supplier: item.supplier ?? "",
        description: item.description ?? "",
      }))
    );

    setLoading(false);
  } catch (error) {
    console.error("Failed to load request:", error);
    setLoading(false);
  }
};


  useEffect(() => {
    fetchRequest();
  }, []);

  // ------------------------------------------------
  // HANDLE FIELD CHANGE
  // ------------------------------------------------
  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Auto-calculate amount based on quantity * unitPrice
    const quantity = parseFloat(updatedItems[index].quantity) || 0;
    const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
    updatedItems[index].amount = (quantity * unitPrice).toString();

    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems([
      ...items,
      {
        date: "",
        itemName: "",
        quantity: "",
        unit: "",
        unitPrice: "",
        amount: "",
        supplier: "",
        description: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // ------------------------------------------------
  // SAVE CHANGES
  // ------------------------------------------------
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/requests/${requestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        }
      );

      if (!response.ok) throw new Error("Failed to update request");

      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {items.map((item, index) => (
        <Box
          key={index}
          p={2}
          mt={2}
          border="1px solid #ccc"
          borderRadius="8px"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight="bold">Item {index + 1}</Typography>

            {items.length > 1 && (
              <IconButton onClick={() => removeItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                fullWidth
                value={item.date}
                onChange={(e) => handleItemChange(index, "date", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Item Name"
                fullWidth
                value={item.itemName}
                onChange={(e) =>
                  handleItemChange(index, "itemName", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                label="Unit"
                fullWidth
                value={item.unit}
                onChange={(e) =>
                  handleItemChange(index, "unit", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                label="Unit Price"
                type="number"
                fullWidth
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(index, "unitPrice", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                label="Amount"
                fullWidth
                disabled
                value={item.amount}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Supplier"
                fullWidth
                value={item.supplier}
                onChange={(e) =>
                  handleItemChange(index, "supplier", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description / Remarks"
                fullWidth
                multiline
                rows={2}
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        sx={{ mt: 2, textTransform: "none" }}
        onClick={addNewItem}
      >
        Add Another Item
      </Button>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditRequest;
