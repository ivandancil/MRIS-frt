import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";

interface RequestItem {
  item_name: string;
  date: string;
  quantity: number;
  unit: string;
  unit_price: string;
  amount: string;
  supplier:string;
  description: string;
}

interface ViewRequestProps {
  open: boolean;
  onClose: () => void;
  controlNumber: string;
  items: RequestItem[];
}

const useCardTypographyStyles = () => ({
  label: { fontWeight: "bold", fontFamily: "Poppins", fontSize: { xs: ".9rem", sm: "1rem", md: "1.1rem" } },
  value: { fontFamily: "Poppins", fontSize: { xs: ".9rem", sm: "1rem", md: "1.1rem" } },
  sectionTitle: { fontWeight: "bold", mb: 2, fontFamily: "Poppins", fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" } },
});

function ViewRequest({ open, onClose, controlNumber, items }: ViewRequestProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { label, value, sectionTitle } = useCardTypographyStyles();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          background: colors.primary[400],
          color: colors.grey[100],
          fontWeight: "bold",
          fontFamily: "Poppins",
          fontSize: { xs: ".9rem", sm: "1rem", md: "1.2rem" },
          textAlign: "center",
        }}
      >
        Requested Items - Control #: {controlNumber}
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "60vh", overflowY: "auto" }}>
        {items.length === 0 ? (
          <Typography>No items found.</Typography>
        ) : (
          items.map((item, index) => (
            <Card
              key={index}
              sx={{ mb: 2, boxShadow: 3, borderRadius: 2, p: 1 }}
            >
              <CardContent>
                <Typography variant="h5" sx={sectionTitle}>Item {index + 1}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                    <Typography sx={label}>Item Name:</Typography>
                    <Typography sx={value}>{item.item_name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label}>Date:</Typography>
                    <Typography sx={value}>{item.date}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Typography sx={label}>Quantity:</Typography>
                    <Typography sx={value}>{item.quantity}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Typography sx={label}>Unit:</Typography>
                    <Typography sx={value}>{item.unit}</Typography>
                  </Grid>
                   <Grid item xs={6} sm={6}>
                    <Typography sx={label}>Unit Price:</Typography>
                    <Typography sx={value}>{item.unit_price}</Typography>
                  </Grid>
                    <Grid item xs={6} sm={6}>
                    <Typography sx={label}>Amount:</Typography>
                    <Typography sx={value}>{item.amount}</Typography>
                  </Grid>
                    <Grid item xs={6} sm={6}>
                    <Typography sx={label}>Supplier:</Typography>
                    <Typography sx={value}>{item.supplier}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={label}>Description:</Typography>
                    <Typography sx={value}>
                      {item.description || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ fontFamily: "Poppins" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewRequest;
