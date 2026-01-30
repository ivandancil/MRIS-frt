import {
  Box,
  Button,
  Dialog,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";

import AddRequest from "./AddRequest";
import EditRequest from "./EditRequest";
import ViewRequest from "./ViewRequest"; // New reusable modal
import { useSearch } from "../../../components/SearchContext";
import ViewDailyRequest from "./ViewDailyRequest";

interface RequestRow {
  id: number;
  controlNumber: string;
  date: string;
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
  const [rows, setRows] = useState<RequestRow[]>([]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editRequestId, setEditRequestId] = useState<number | null>(null);

  const [deleteLoadingIds, setDeleteLoadingIds] = useState<number[]>([]);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [openViewDaily, setOpenViewDaily] = useState(false);
  const [selectedDailyItem, setSelectedDailyItem] = useState<any>(null);


  // MASTER LIST STATES
  const [masterListRows, setMasterListRows] = useState<any[]>([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRequestItems, setSelectedRequestItems] = useState<any[]>([]);
  const [selectedControlNumber, setSelectedControlNumber] = useState<string>("");

  const { searchTerm } = useSearch();

  const dialogStyle = {
    fontSize: { xs: ".8rem", sm: ".9rem", md: "1rem" },
    fontFamily: "Poppins",
  };

  // Fetch Daily Requests
const fetchRequests = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/requests");
    const data = await response.json();

    const formattedRows: RequestRow[] = data.flatMap((req: any) =>
      (req.items || []).map((item: any) => ({
        id: item.id,
        controlNumber: `REQ-${req.id.toString().padStart(2, "0")}`, // same for all items in request
        date: item.date ?? "",
        itemName: item.item_name,
        qty: item.quantity,
        unit: item.unit,
        unitPrice: item.unit_price,
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


// Fetch Master List
const fetchMasterList = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/requests");
    const data = await response.json();

    const formatted = data.map((req: any) => ({
      id: req.id, // internal ID for DataGrid
      controlNumber: `REQ-${req.id.toString().padStart(2, "0")}`, // same as Daily Request
      requestDate: req.created_at ? req.created_at.substring(0, 10) : "N/A",
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



  // Delete Daily Request Item
  const deleteItem = async (itemId: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setDeleteLoadingIds((prev) => [...prev, itemId]);

      const response = await fetch(
        `http://127.0.0.1:8000/api/request-items/${itemId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete item");

      fetchRequests();
      fetchMasterList();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // DataGrid Styles
  const gridStyles = {
    "& .MuiDataGrid-root": { border: "none" },
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

      const normalizedSearch = searchTerm?.toLowerCase() ?? "";

      const filteredRows = rows.filter((row) =>
        [
          row.controlNumber,
          row.itemName,
          row.unit,
          row.supplier,
          row.remarks,
        ].some((field) =>
          field?.toString().toLowerCase().includes(normalizedSearch)
        )
      );

      const filteredMasterListRows = masterListRows.filter((row) =>
  [
          row.id?.toString(),
          row.requestDate,
          row.totalItems?.toString(),
        ].some((field) =>
          field?.toLowerCase().includes(normalizedSearch)
        )
      );



  return (
    <Box m="20px">
      <Header title="Daily Request" subtitle="Create Daily Requisitions" />

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        textColor="inherit"
        sx={{ mt: "20px", fontFamily: "Poppins", background: colors.grey[900] }}
      >
        <Tab label="Daily Request" />
        <Tab label="Master List (Requisitions)" />
      </Tabs>


      {/* TAB 1: Daily Request */}
      {tabValue === 0 && (
        <Box>

          {/* Create Request Button */}

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
          Create Request
        </Button>
      </Box>
        <Box height="70vh" mt={2} sx={gridStyles}>
          <DataGrid
            rows={filteredRows}
            loading={loading}
            getRowId={(row) => row.id}
            columns={[
              { field: "date", headerName: "Date", flex: 1 },
              { field: "controlNumber", headerName: "Control #", flex: .8 },
              { field: "itemName", headerName: "Item Name", flex: 1.7 },
              { field: "supplier", headerName: "Supplier", flex: 1 },
              { field: "remarks", headerName: "Remarks", flex: 1.5 },
              {
                field: "actions",
                headerName: "Actions",
                flex: 1,
                renderCell: (params) => (
                  <Box display="flex" gap={1} mt={1}>
                    {/* View Button */}
              <Button
                sx={{
                  textTransform: "none",
                  color: colors.grey[900],
                  fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
                }}
                startIcon={<VisibilityIcon />}
                onClick={() => {
                  setSelectedDailyItem(params.row);
                  setOpenViewDaily(true);
                }}
              >
                View
              </Button>

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
        </Box>
      )}

      {/* TAB 2: Master List */}
      {tabValue === 1 && (
        <Box height="70vh" mt={2} sx={gridStyles}>
          <DataGrid
            rows={filteredMasterListRows}
            getRowId={(row) => row.id}
            columns={[
              { field: "controlNumber", headerName: "Control #", flex: 1 },
              { field: "requestDate", headerName: "Date", flex: 1 },
              { field: "totalItems", headerName: "Total Items", flex: 1 },
              {
                field: "actions",
                headerName: "Actions",
                flex: 1.5,
                renderCell: (params) => (
                  <Box display="flex" gap={1} mt={1}>
                    <Button
                      sx={{
                        textTransform: "none",
                        color: colors.grey[900],
                        fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
                      }}
                      startIcon={
                        <VisibilityIcon
                          sx={{ fontSize: isSmallScreen ? "1rem" : "inherit" }}
                        />
                      }
                      onClick={() => {
                        setSelectedRequestItems(params.row.items);
                        setSelectedControlNumber(params.row.id.toString());
                        setOpenViewDialog(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      sx={{
                        textTransform: "none",
                        color: colors.grey[900],
                        fontSize: { xs: ".5rem", sm: ".6rem", md: ".8rem" },
                      }}
                      startIcon={
                        <EditIcon
                          sx={{ fontSize: isSmallScreen ? "1rem" : "inherit" }}
                        />
                      }
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

      {/* Add Request Dialog */}
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

      {/* Edit Request Dialog */}
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

      {/* View Request Dialog */}
      <ViewRequest
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        controlNumber={selectedControlNumber}
        items={selectedRequestItems}
      />

      <ViewDailyRequest
      open={openViewDaily}
      onClose={() => setOpenViewDaily(false)}
      item={selectedDailyItem}
    />

      
    </Box>
  );
};

export default Request;
