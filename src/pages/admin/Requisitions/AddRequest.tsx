import { Box, Button, TextField, Grid, IconButton, Typography, MenuItem } from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface AddRequestProps {
  onInventoryAdded: () => void;
  onClose: () => void;
}

// UPDATED INTERFACE
interface RequestItem {
  date: string;
  itemName: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  amount: string;
  supplier: string;
  description: string;
}

const AddRequest = ({ onInventoryAdded, onClose }: AddRequestProps) => {
  const [items, setItems] = useState<RequestItem[]>([
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

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Auto-calculate amount
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

  const handleSubmit = async () => {
    // Simple validation
    for (const item of items) {
      if (!item.date || !item.itemName || !item.quantity || !item.unit) {
        alert("Please fill in all required fields.");
        return;
      }
    }
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) throw new Error("Failed to submit request");

      onInventoryAdded();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

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

            <Grid item xs={12} md={12}>
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
                select
                label="Unit"
                fullWidth
                value={item.unit}
                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
              >
                  <MenuItem value="PCS" >PCS</MenuItem>
                  <MenuItem value="BOX" >BOX</MenuItem>
                </TextField>
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                label="Unit Price"
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
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(index, "amount", e.target.value)
                }
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
        <Button variant="contained" onClick={handleSubmit}>
          Submit Request
        </Button>
      </Box>
    </Box>
  );
};

export default AddRequest;
