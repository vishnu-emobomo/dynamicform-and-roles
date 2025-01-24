import React from 'react';
import TablePagination from '@mui/material/TablePagination';

const Pagination = ({ totalItems, onPageDataChange, itemsPerPage = 10 }) => {
  const [page, setPage] = React.useState(0); // Page starts at 0
  const [rowsPerPage, setRowsPerPage] = React.useState(itemsPerPage); // Default to 10

  // Calculate the current page data
  React.useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    onPageDataChange(startIndex, endIndex);
  }, [page, rowsPerPage, totalItems, onPageDataChange]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when page size changes
  };

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 50]} // Options for items per page
      component="div"
      count={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default Pagination;


