import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

interface AttendanceRecord {
  id: number;
  name: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

interface LeaveRequest {
  id: number;
  name: string;
  department: string;
  leaveType: string;
  from: string;
  to: string;
  status: string;
}

interface TableComponentProps {
  type: "attendance" | "leave";
}

const TableComponent = ({ type }: TableComponentProps) => {
  const attendanceData: AttendanceRecord[] = [
    { id: 1, name: "John Doe", department: "IT", checkIn: "08:30 AM", checkOut: "05:00 PM", status: "Present" },
    { id: 2, name: "Jane Smith", department: "HR", checkIn: "09:00 AM", checkOut: "04:30 PM", status: "Present" },
    { id: 3, name: "Mike Johnson", department: "Finance", checkIn: "--", checkOut: "--", status: "Absent" },
  ];

  const leaveData: LeaveRequest[] = [
    { id: 1, name: "Alice Brown", department: "Marketing", leaveType: "Sick Leave", from: "2025-03-01", to: "2025-03-03", status: "Pending" },
    { id: 2, name: "Bob Williams", department: "Sales", leaveType: "Vacation", from: "2025-03-05", to: "2025-03-10", status: "Pending" },
  ];

  const data = type === "attendance" ? attendanceData : leaveData;

  // Type guard function to check if row is AttendanceRecord
  const isAttendanceRecord = (row: AttendanceRecord | LeaveRequest): row is AttendanceRecord => {
    return "checkIn" in row;
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            {type === "attendance" ? (
              <>
                <TableCell>Check-In</TableCell>
                <TableCell>Check-Out</TableCell>
                <TableCell>Status</TableCell>
              </>
            ) : (
              <>
                <TableCell>Leave Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.department}</TableCell>
              {isAttendanceRecord(row) ? (
                // If row is AttendanceRecord, show attendance fields
                <>
                  <TableCell>{row.checkIn}</TableCell>
                  <TableCell>{row.checkOut}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </>
              ) : (
                // If row is LeaveRequest, show leave fields
                <>
                  <TableCell>{row.leaveType}</TableCell>
                  <TableCell>{row.from}</TableCell>
                  <TableCell>{row.to}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>
                      Approve
                    </Button>
                    <Button variant="contained" color="error" size="small">
                      Reject
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
