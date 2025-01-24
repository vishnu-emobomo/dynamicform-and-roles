import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  TablePagination,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Include resizable styles

const initialPassengers = [
  {
    id: 1,
    name: "Clara Smith",
    email: "tranthuy.nut@example.com",
    phone: "(319) 555-0115",
    carrier: "ATLANTA JET Airlines",
    flight: "#5028",
    date: "09/18/23",
    time: "06:30",
    gate: "18F",
    terminal: "RDU",
    status: "active",
  },
  {
    id: 2,
    name: "Floyd Miles",
    email: "vuathuhong7@example.com",
    phone: "(205) 555-0125",
    carrier: "PEGASUS Airlines",
    flight: "#5028",
    date: "09/18/23",
    time: "04:45",
    gate: "1D",
    terminal: "SFO",
    status: "inactive",
  },
];

const initialColumns = [
  { id: "name", label: "PASSENGER NAME", width: 150 },
  { id: "email", label: "EMAIL", width: 150 },
  { id: "phone", label: "PHONE", width: 120 },
  { id: "carrier", label: "CARRIER", width: 150 },
  { id: "flight", label: "FLIGHT", width: 80 },
  { id: "date", label: "DATE", width: 100 },
  { id: "time", label: "TIME", width: 70 },
  { id: "gate", label: "GATE", width: 60 },
  { id: "terminal", label: "TERMINAL", width: 100 },
  { id: "status", label: "STATUS", width: 100 },
  { id: "actions", label: "ACTIONS", width: 80 }, // Added for delete action
];

export default function PassengerManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [passengers, setPassengers] = useState(initialPassengers);
  const [columns, setColumns] = useState(initialColumns);
  const [editing, setEditing] = useState({ rowId: null, field: "" });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleStatus = (rowId) => {
    const updatedPassengers = passengers.map((row) =>
      row.id === rowId
        ? { ...row, status: row.status === "active" ? "inactive" : "active" }
        : row
    );
    setPassengers(updatedPassengers);
  };

  const handleInputChange = (value, rowId, field) => {
    const updatedPassengers = passengers.map((row) =>
      row.id === rowId ? { ...row, [field]: value } : row
    );
    setPassengers(updatedPassengers);
  };

  const onColumnResize = (newSize, columnId) => {
    const updatedColumns = columns.map((col) =>
      col.id === columnId ? { ...col, width: newSize.width } : col
    );
    setColumns(updatedColumns);
  };

  const handleAddRow = () => {
    const newRow = {
      id: passengers.length + 1, // Auto-increment the ID for simplicity
      name: "",
      email: "",
      phone: "",
      carrier: "",
      flight: "",
      date: "",
      time: "",
      gate: "",
      terminal: "",
      status: "inactive", // Default status for a new row
    };
    setPassengers([...passengers, newRow]);
    setEditing({ rowId: newRow.id, field: "all" }); // All cells editable in new row
  };

  const handleDeleteRow = (rowId) => {
    const updatedPassengers = passengers.filter((row) => row.id !== rowId);
    setPassengers(updatedPassengers);
  };

  const handleDoubleClick = (rowId, field) => {
    setEditing({ rowId, field });
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6" component="div">
          Passenger Management
        </Typography>
        <IconButton color="primary" onClick={handleAddRow}>
          <Add /> {/* Plus button to add new rows */}
        </IconButton>
      </Toolbar>

      <TableContainer>
        <Table
          stickyHeader
          aria-label="passenger table"
          sx={{ border: "1px solid #ddd" }}
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox sx={{ color: "#1976d2" }} />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ width: column.width, border: "1px solid #ddd" }}
                >
                  {column.id !== "actions" ? (
                    <ResizableBox
                      width={column.width}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      minConstraints={[100, 20]}
                      maxConstraints={[400, 20]}
                      onResizeStop={(e, data) =>
                        onColumnResize(data, column.id)
                      }
                    >
                      {column.label}
                    </ResizableBox>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {passengers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((passenger) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={passenger.id}
                  sx={{
                    backgroundColor:
                      editing.rowId === passenger.id ? "#f0f8ff" : "white",
                    transition: "background-color 0.3s",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox sx={{ color: "#1976d2" }} />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ border: "1px solid #ddd" }}
                    >
                      {editing.rowId === passenger.id &&
                      (editing.field === column.id ||
                        editing.field === "all") ? (
                        <Grid
                          container
                          spacing={1}
                          sx={{ borderBottom: "1px dashed #ccc", padding: 0 }}
                        >
                          <Grid item xs={12}>
                            <TextField
                              variant="standard"
                              placeholder={`Enter ${column.label}`}
                              value={passenger[column.id]}
                              onBlur={(e) => {
                                handleInputChange(
                                  e.target.value,
                                  passenger.id,
                                  column.id
                                );
                                setEditing({ rowId: null, field: "" });
                              }}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  passenger.id,
                                  column.id
                                )
                              }
                              fullWidth
                              autoFocus={editing.field === column.id}
                            />
                          </Grid>
                        </Grid>
                      ) : column.id === "status" ? (
                        <Button
                          onClick={() => toggleStatus(passenger.id)}
                          sx={{
                            backgroundColor:
                              passenger.status === "active" ? "green" : "red",
                            color: "#fff",
                            borderRadius: "5px",
                            padding: "4px 8px",
                            "&:hover": {
                              backgroundColor:
                                passenger.status === "active"
                                  ? "#2e7d32"
                                  : "#d32f2f",
                            },
                          }}
                          variant="contained"
                        >
                          {passenger.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </Button>
                      ) : column.id === "actions" ? (
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteRow(passenger.id)}
                        >
                          <Delete />
                        </IconButton>
                      ) : (
                        <div
                          onDoubleClick={() =>
                            handleDoubleClick(passenger.id, column.id)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {passenger[column.id]}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={passengers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}