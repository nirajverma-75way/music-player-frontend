import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Typography,
  ButtonGroup,
  Button,
  TextField,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TableChartIcon from "@mui/icons-material/TableChart";
import { utils, writeFile } from "xlsx";
import TableSkeleton from "./Skeleton/table-skeleton";

interface Column {
  field: string;
  label: string;
  type?: "text" | "image" | "video" | "audio" | "file";
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  isLoading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, isLoading, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
    setPage(0);
  };

  const filteredData = data.filter((row) =>
    columns.some(({ field }) => row[field]?.toString().toLowerCase().includes(searchQuery))
  );

  const exportToCSV = () => {
    const csvData = data.map((row) =>
      Object.fromEntries(columns.map(({ field }) => [field, row[field] || ""]))
    );
    const worksheet = utils.json_to_sheet(csvData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(workbook, "data.csv");
  };

  const exportToExcel = () => {
    const excelData = data.map((row) =>
      Object.fromEntries(columns.map(({ field }) => [field, row[field] || ""]))
    );
    const worksheet = utils.json_to_sheet(excelData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(workbook, "data.xlsx");
  };

  if (isLoading) return <TableSkeleton column={columns.length} />;

  return (
    <Box sx={{ padding: { sm: 2, md: 3 }, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box display="flex" flexDirection={"row"} gap={1} justifyContent="space-between" alignItems="center">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          sx={{ width: { xs: "100%", sm: "60%", md: "50%", lg: "30%" }, mb: { xs: 1, sm: 0 } }}
          onChange={handleSearchChange}
        />
        <ButtonGroup variant="outlined" size="small" aria-label="button group" sx={{ marginTop: { xs: 1, sm: 0 }, marginLeft: 'auto' }}>
          <Button>
            <Tooltip title="Export CSV">
              <IconButton onClick={exportToCSV}>
                <ListAltIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Button>
          <Button>
            <Tooltip title="Export Excel">
              <IconButton onClick={exportToExcel}>
                <TableChartIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Button>
        </ButtonGroup>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, maxWidth: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{ fontSize: { xs: "0.8rem", sm: "1rem" }, padding: { xs: "8px", sm: "16px" } }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" }, padding: { xs: "8px", sm: "16px" } }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          {filteredData.length > 0 && (
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  {columns.map(({ field, type }) => (
                    <TableCell
                      key={field}
                      sx={{ fontSize: { xs: "0.8rem", sm: "1rem" }, padding: { xs: "8px", sm: "16px" } }}
                    >
                      {type === "image" ? (
                        <img src={row[field]} alt="Preview" width={50} />
                      ) : type === "video" ? (
                        <video src={row[field]} controls width={100} />
                      ) : type === "audio" ? (
                        <audio src={"http://localhost:5000/" + row[field]} controls />
                      ) : type === "file" ? (
                        <Tooltip title="View File">
                          <IconButton href={row[field]} target="_blank">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        row[field]
                      )}
                    </TableCell>
                  ))}
                  <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {onEdit && (
                      <Tooltip title="Edit">
                        <IconButton onClick={() => onEdit(row)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Delete">
                        <IconButton onClick={() => onDelete(row)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {filteredData.length === 0 && (
          <Typography variant="h6" align="center" color="textSecondary" my={2}>
            No data available
          </Typography>
        )}
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sx={{ display: "flex", justifyContent: "space-between", fontSize: { xs: "0.8rem", sm: "1rem" } }}
      />
    </Box>
  );
};

export default DataTable;
