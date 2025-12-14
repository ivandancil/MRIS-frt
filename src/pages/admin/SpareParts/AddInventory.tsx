  import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Grid,
  useTheme,
  MenuItem,
  Autocomplete
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { tokens } from "../../../theme";

interface AddInventoryProps {
  onInventoryAdded: () => void;
  onClose: () => void;
}



function AddInventory({ onInventoryAdded, onClose }: AddInventoryProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

 const inputStyles = {
    "& .MuiInputLabel-root": {
      color: "black !important",
      fontSize: { xs: ".7rem", sm: ".8rem", md: ".8rem" },
      fontFamily: "Poppins",
      [theme.breakpoints.down("sm")]: {
        transform: "translate(14px, 8px) scale(1) !important",
        "&.MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75) !important",
        },
      },
    },
    "& .MuiOutlinedInput-root fieldset": { borderColor: "black !important" },
    "& .MuiInputBase-input": {
      color: "black",
      fontSize: { xs: ".7rem", sm: ".9rem", md: ".8rem" },
      fontFamily: "Poppins",
    },
  };

           // NEW: Reusable style for MenuItems
  const menuItemTextStyles = {
    fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
    fontFamily: "Poppins", // Assuming Poppins for MenuItem text too
  };

  // State for form fields
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [model, setModel] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [supplier, setSupplier] = useState("");
  const [lastPurchased, setLastPurchased] = useState("");
  const [itemOptions, setItemOptions] = useState<any[]>([]);
const [isExistingItem, setIsExistingItem] = useState(false);
const [supplierOptions, setSupplierOptions] = useState<string[]>([]);


  // State for errors and loading
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- Auto-fill existing item ---
const fetchItemByName = async (name: string) => {
  if (!name) {
    setItemOptions([]);
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://127.0.0.1:8000/api/items/search?name=${encodeURIComponent(name)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      setItemOptions([]);
      return;
    }

    const data = await res.json();

    // Backend now returns an array → set directly
    if (Array.isArray(data)) {
      setItemOptions(data);
    } else {
      setItemOptions([]); // avoid errors
    }
  } catch (error) {
    console.log("Search error:", error);
    setItemOptions([]);
  } 
};

// Generate a unique item code for new items
const generateItemCode = () => {
  const timestamp = Date.now(); // milliseconds
  return `ITM-${timestamp.toString().slice(-6)}`; // last 6 digits
};


useEffect(() => {
  // Filter items matching the current item name
  const matchedItems = itemOptions.filter(
    (item) =>
      typeof item !== "string" &&
      item.item_name.toLowerCase() === itemName.toLowerCase()
  );

  // Extract unique models and suppliers
  const suppliers = matchedItems.map(item => item.supplier).filter(Boolean) as string[];
  setSupplierOptions([...new Set(suppliers)]);

  // Check exact match (name + model + supplier)
  const exactMatch = matchedItems.find(item =>
    (model ? item.model?.toLowerCase() === model.toLowerCase() : true) &&
    (supplier ? item.supplier?.toLowerCase() === supplier.toLowerCase() : true)
  );

  if (exactMatch) {
    setItemCode(exactMatch.item_code);
    setCategory(exactMatch.category);
    setUnit(exactMatch.unit);
    setLastPurchased(exactMatch.last_purchased || "");
    setIsExistingItem(true);
  } else {
    setIsExistingItem(false);
    setItemCode(generateItemCode());
  }
}, [itemName, model, supplier, itemOptions]);



// Auto-fill if typed name matches an existing item
useEffect(() => {
  const timer = setTimeout(() => { fetchItemByName(itemName); }, 300);

  const matchedItem = itemOptions.find(
    (item) =>
      typeof item !== "string" &&
      item.item_name.toLowerCase() === itemName.toLowerCase() &&
      (model ? item.model?.toLowerCase() === model.toLowerCase() : true)
  );

  if (matchedItem) {
    setItemCode(matchedItem.item_code);
    setCategory(matchedItem.category);
    setUnit(matchedItem.unit);
    setModel(matchedItem.model || "");
    setLastPurchased(matchedItem.last_purchased || "");
  }

  return () => clearTimeout(timer);
}, [itemName, model, itemOptions]);


useEffect(() => {
  if (!itemName) {
    setItemCode("");
    setCategory("");
    setUnit("");
    setUnitCost("");
    setSupplier("");
    setModel("");
    setLastPurchased("");
    setIsExistingItem(false); // reset existing flag
  }
}, [itemName]);


  const handleAddInventory = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setGeneralError("");
      setFieldErrors({});
      setLoading(true);

      // Client-side required field validation
      const newFieldErrors: Record<string, string> = {};
      if (!itemCode) newFieldErrors.item_code = "Item Code is required";
      if (!itemName) newFieldErrors.item_name = "Item Name is required";
      if (!category) newFieldErrors.category = "Category is required";
      if (!qty) newFieldErrors.qty = "Quantity is required";
      if (!unit) newFieldErrors.unit = "Unit is required";
      if (!unitCost) newFieldErrors.unit_cost = "Unit Cost is required";

      if (Object.keys(newFieldErrors).length > 0) {
        setFieldErrors(newFieldErrors);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:8000/api/inventories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            item_code: itemCode,
            item_name: itemName,
            category,
            model: model || null,
            qty: Number(qty),
            unit,
            unit_cost: Number(unitCost),
            supplier: supplier || null,
            last_purchased: lastPurchased || null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle Laravel validation errors
          if (data.errors) {
            const apiFieldErrors: Record<string, string> = {};
            Object.entries(data.errors).forEach(([field, messages]) => {
              apiFieldErrors[field] = Array.isArray(messages) ? messages[0] : (messages as string);
            });
            setFieldErrors(apiFieldErrors);
          } else {
            setGeneralError(data.message || "Failed to add item");
          }
          setLoading(false);
          return;
        }

        // Success
        setSuccess(true);
        onInventoryAdded();
        onClose();

        // Clear form
        setItemCode("");
        setItemName("");
        setCategory("");
        setModel("");
        setQty("");
        setUnit("");
        setUnitCost("");
        setSupplier("");
        setLastPurchased("");
      } catch (error) {
        setGeneralError(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [
      itemCode,
      itemName,
      category,
      model,
      qty,
      unit,
      unitCost,
      supplier,
      lastPurchased,
      onInventoryAdded,
      onClose,
    ]
  );

return (
  <form onSubmit={handleAddInventory}>
    <Box
      p={2}
      mt={1}
      border="1px solid #ccc"
      borderRadius="8px"
    >
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Inventory Item Details
      </Typography>

      <Grid container spacing={2}>
        {/* Item Code */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Item Code"
            fullWidth
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            autoComplete="off"
            error={!!fieldErrors.item_code}
            helperText={fieldErrors.item_code}
            sx={inputStyles}
            InputProps={{ readOnly: !isExistingItem }}
          />
        </Grid>

        {/* Item Name */}
        <Grid item xs={12} md={12}>
          <Autocomplete
            freeSolo
            options={itemOptions}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.item_name
            }
            onInputChange={(_, value) => setItemName(value)}
            onChange={(_, value) => {
              if (value && typeof value !== "string") {
                setItemName(value.item_name);
                setItemCode(value.item_code);
                setCategory(value.category);
                setUnit(value.unit);
                setModel(value.model || "");
                setLastPurchased(value.last_purchased || "");
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item Name"
                fullWidth
                autoComplete="off"
                sx={inputStyles}
                error={!!fieldErrors.item_name}
                helperText={fieldErrors.item_name}
              />
            )}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12} md={6} sx={inputStyles}>
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            error={!!fieldErrors.category}
            helperText={fieldErrors.category}
          >
            <MenuItem value="Mechanical" sx={menuItemTextStyles}>Mechanical</MenuItem>
            <MenuItem value="Electrical" sx={menuItemTextStyles}>Electrical</MenuItem>
            <MenuItem value="Welding" sx={menuItemTextStyles}>Welding</MenuItem>
            <MenuItem value="Shop Used" sx={menuItemTextStyles}>Shop Used</MenuItem>
          </TextField>
        </Grid>

        {/* Model */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Model"
            fullWidth
            value={model}
            onChange={(e) => setModel(e.target.value)}
            autoComplete="off"
            error={!!fieldErrors.model}
            helperText={fieldErrors.model}
            sx={inputStyles}
          />
        </Grid>

        {/* Qty */}
        <Grid item xs={12} md={4}>
          <TextField
            label="Qty"
            type="number"
            fullWidth
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            autoComplete="off"
            error={!!fieldErrors.qty}
            helperText={fieldErrors.qty}
            sx={inputStyles}
          />
        </Grid>

        {/* Unit */}
        <Grid item xs={12} md={4} sx={inputStyles}>
          <TextField
            select
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            fullWidth
            error={!!fieldErrors.unit}
            helperText={fieldErrors.unit}
          >
            <MenuItem value="PCS" sx={menuItemTextStyles}>PCS</MenuItem>
            <MenuItem value="BOX" sx={menuItemTextStyles}>BOX</MenuItem>
            <MenuItem value="SET" sx={menuItemTextStyles}>SET</MenuItem>
            <MenuItem value="ROLL" sx={menuItemTextStyles}>ROLL</MenuItem>
          </TextField>
        </Grid>

        {/* Unit Cost */}
        <Grid item xs={12} md={4}>
          <TextField
            label="Unit Cost"
            type="number"
            fullWidth
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            autoComplete="off"
            error={!!fieldErrors.unit_cost}
            helperText={fieldErrors.unit_cost}
            sx={inputStyles}
          />
        </Grid>

        {/* Supplier */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            freeSolo
            options={supplierOptions}
            value={supplier}
            onInputChange={(_, value) => setSupplier(value)}
            onChange={(_, value) => setSupplier(value || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier"
                fullWidth
                autoComplete="off"
                sx={inputStyles}
                error={!!fieldErrors.supplier}
                helperText={fieldErrors.supplier}
              />
            )}
          />
        </Grid>


        {/* Last Purchased */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Last Purchased"
            type="date"
            fullWidth
            value={lastPurchased}
            onChange={(e) => setLastPurchased(e.target.value)}
            InputLabelProps={{ shrink: true }}
            error={!!fieldErrors.last_purchased}
            helperText={fieldErrors.last_purchased}
            sx={inputStyles}
          />
        </Grid>
      </Grid>
    </Box>

    {/* Error */}
    {generalError && (
      <Typography color="error" mt={1}>
        {generalError}
      </Typography>
    )}
    

    {/* Actions */}
    <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
       <Button variant="outlined" onClick={onClose}>
          Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Item"}
      </Button>
    </Box>

    {/* Success Snackbar */}
    <Snackbar
      open={success}
      autoHideDuration={3000}
      onClose={() => setSuccess(false)}
    >
      <Alert
        onClose={() => setSuccess(false)}
        severity="success"
        sx={{ width: "100%" }}
      >
        Item added successfully!
      </Alert>
    </Snackbar>
  </form>
);

}

export default AddInventory;
