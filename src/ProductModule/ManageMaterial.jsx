import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import {
  Box,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserId } from "../utlis/tokenUtils";
import TocIcon from "@mui/icons-material/Toc";
import apiClient from "../utlis/apiClient";
import Pagination from "../utlis/Pagination";
// import "../TableCss/TableStyle.css"
import PropTypes from 'prop-types';
// import { StyledTableCell, StyledTableRow } from "../ComponentCss/Tabel/TabelCss";
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Layout from "../VendorManagement/Vendor Layout/Layout";
import "../ComponentCss/Tabel/CollapseableTable.css";
import { SampleData } from "./SampleData"

const  data = sessionStorage.getItem('customLogoData')
let tableColor = "#CC5500"; // Default color in case data is missing or invalid

if(data){
  try{
    const parseData = JSON.parse(data);

     tableColor = parseData.dynamicStyles?.tableColor;
    console.log(tableColor);
  } catch{
    console.log("error from the data");
  }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: tableColor,
    color: theme.palette.common.white,
    padding: "10px",
    verticalAlign: "top",
    height: "5px",
    fontFamily: "GeneralSans-Medium",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

    // padding: "10px !important",
    fontFamily: "GeneralSans-Medium"
  },
}));

const StyledTableCells = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#ffa85a",
    color: theme.palette.common.white,
    padding: "10px",
    verticalAlign: "top",
    height: "5px",
    fontFamily: "GeneralSans-Medium",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

    // padding: "10px !important",
    fontFamily: "GeneralSans-Medium"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f3f3f3",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {row.name}
        </StyledTableCell>
        <StyledTableCell align="right">{row.Drawings}</StyledTableCell>
        <StyledTableCell align="right">{row.Quantity}</StyledTableCell>
        <StyledTableCell align="right">{row.Rate}</StyledTableCell>
        <StyledTableCell align="right">{row.Status}</StyledTableCell>
      </StyledTableRow>

        {/* the sub table data  */}
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCells>Date</StyledTableCells>
                    <StyledTableCells>DA</StyledTableCells>
                    <StyledTableCells align="right">Quantity</StyledTableCells>
                    {/* <StyledTableCells align="right">Total price ($)</StyledTableCells> */}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <StyledTableRow key={historyRow.date}>
                      <StyledTableCell component="th" scope="row">
                        {historyRow.date}
                      </StyledTableCell>
                      <StyledTableCell>{historyRow.DA}</StyledTableCell>
                  <StyledTableCell align="right">{historyRow.Quantity}</StyledTableCell>
                      {/* <StyledTableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </StyledTableCell> */}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};




function ManageMaterial() {

  return (

    <Layout>
        <TableContainer component={Paper} className="table">
          <Table aria-label="collapsible table">
            <TableHead>
              <StyledTableRow >
                <StyledTableCell />
                <StyledTableCell>Item Description</StyledTableCell>
                <StyledTableCell align="right">Drawings</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">Rate</StyledTableCell>
                <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {SampleData.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </Layout>
  );
}



export default ManageMaterial;