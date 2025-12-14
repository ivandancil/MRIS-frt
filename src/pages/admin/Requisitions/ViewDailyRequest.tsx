import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Button,
  useTheme,
  Card,
  DialogActions,
} from "@mui/material";
import { tokens } from "../../../theme";

interface DailyRequestItem {
  controlNumber: string;
  date: string;
  itemName: string;
  qty: number;
  unit: string;
  supplier: string;
  remarks: string;
}

interface ViewDailyRequestProps {
  open: boolean;
  onClose: () => void;
  item: DailyRequestItem | null;
}

const useCardTypographyStyles = () => ({
  label: { fontWeight: "bold", fontFamily: "Poppins", fontSize: { xs: ".9rem", sm: "1rem", md: "1.1rem" } },
  value: { fontFamily: "Poppins", fontSize: { xs: ".9rem", sm: "1rem", md: "1.1rem" } },
  sectionTitle: { fontWeight: "bold", mb: 2, fontFamily: "Poppins", fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" } },
});

function ViewDailyRequest({ open, onClose, item }: ViewDailyRequestProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
   const { label, value } = useCardTypographyStyles();

  if (!item) return null;

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
        Daily Request Details
      </DialogTitle>

      <DialogContent dividers>
        <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
          <Grid container spacing={2}>
             <Grid item xs={12} sm={12}>
              <Typography sx={label} fontWeight="bold">Control #</Typography>
              <Typography sx={value}>{item.controlNumber}</Typography>
            </Grid>

           <Grid item xs={6} sm={6}>
              <Typography sx={label} fontWeight="bold">Item Name</Typography>
              <Typography sx={value}>{item.itemName}</Typography>
            </Grid>
           <Grid item xs={6} sm={6}>
              <Typography sx={label} fontWeight="bold">Date</Typography>
              <Typography sx={value}>{item.date}</Typography>
            </Grid>

            <Grid item xs={6} sm={6}>
              <Typography sx={label} fontWeight="bold">Quantity</Typography>
              <Typography sx={value}>{item.qty}</Typography>
            </Grid>

            <Grid item xs={6} sm={6}>
              <Typography sx={label} fontWeight="bold">Unit</Typography>
              <Typography sx={value}>{item.unit}</Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography sx={label} fontWeight="bold">Supplier</Typography>
              <Typography sx={value}>{item.supplier}</Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography sx={label} fontWeight="bold">Remarks</Typography>
              <Typography sx={value}>{item.remarks || "—"}</Typography>
            </Grid>
          </Grid>
        </Card>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ fontFamily: "Poppins" }}
        >
          Close
        </Button>
      </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDailyRequest;
