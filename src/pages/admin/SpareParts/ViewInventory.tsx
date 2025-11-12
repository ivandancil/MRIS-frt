import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { tokens } from "../../../theme";

// --- Inventory Interface ---
interface Inventory {
  id: number;
  item_code: string;
  item_name: string;
  category: string;
  model: string;
  qty: number;
  unit: string;
  unit_cost: number;
  supplier: string;
  last_purchased: string;
}

// --- Props Interface ---
interface ViewInventoryProps {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;
}

// --- Reusable Typography Styles ---
const useCardTypographyStyles = () => ({
  label: {
    fontWeight: "bold",
    fontFamily: "Poppins",
    fontSize: { xs: ".75rem", sm: ".85rem", md: "1rem" },
    mb: { xs: 0.5, sm: 0 },
  },
  value: {
    fontFamily: "Poppins",
    fontSize: { xs: ".7rem", sm: ".8rem", md: "1rem" },
    color: "text.secondary",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontFamily: "Poppins",
    mb: 2,
    fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
  },
});

// --- Main Component ---
function ViewInventory({ open, onClose, inventory }: ViewInventoryProps) {
  if (!inventory) return null;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { label, value, sectionTitle } = useCardTypographyStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          [theme.breakpoints.down("sm")]: {
            margin: 0,
            maxHeight: "95%",
            borderRadius: 2,
          },
        },
        "& .MuiDialogContent-root": {
          [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `${colors.primary[400]}`,
          height: { xs: 40, sm: 50, md: 60 },
          color: `${colors.grey[100]}`,
          fontWeight: "bold",
          fontFamily: "Poppins",
          fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
          textAlign: "center",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        Inventory Item Details
      </DialogTitle>

      <DialogContent dividers>
        <Box p={{ xs: 1, sm: 2, md: 3 }}>
          {/* Header Section */}
          <Box
            display="flex"
            alignItems="center"
            mb={3}
            gap={{ xs: 1, sm: 2, md: 3 }}
            flexDirection={{ xs: "column", sm: "row" }}
            textAlign={{ xs: "center", sm: "left" }}
          >
            <Box
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "#B0BEC5",
                mb: { xs: 1, sm: 0 },
              }}
            >
              <Inventory2Icon
                sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: "#fff" }}
              />
            </Box>
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                fontFamily="Poppins"
                sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.8rem" } }}
              >
                {inventory.item_name}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h5"
                fontFamily="Poppins"
                sx={{ fontSize: { xs: ".8rem", sm: "1rem", md: "1.3rem" } }}
              >
                {inventory.category}
              </Typography>
            </Box>
          </Box>

          {/* Inventory Info Section */}
          <Card sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={sectionTitle}>
                ITEM INFORMATION :
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Item Code:</Typography>
                  <Typography sx={value}>{inventory.item_code || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Model:</Typography>
                  <Typography sx={value}>{inventory.model || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Quantity:</Typography>
                  <Typography sx={value}>{inventory.qty ?? "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Unit:</Typography>
                  <Typography sx={value}>{inventory.unit || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Unit Cost:</Typography>
                  <Typography sx={value}>
                    ₱{inventory.unit_cost?.toLocaleString() || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Supplier:</Typography>
                  <Typography sx={value}>{inventory.supplier || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={label}>Last Purchased:</Typography>
                  <Typography sx={value}>{inventory.last_purchased || "N/A"}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          autoFocus
          sx={{
            fontSize: { xs: ".6rem", sm: ".8rem", md: ".9rem" },
            fontFamily: "Poppins",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewInventory;
