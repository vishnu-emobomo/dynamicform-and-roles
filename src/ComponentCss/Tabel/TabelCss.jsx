import React from 'react';
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import {
    TableCell,
    TableRow,
  } from "@mui/material";

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

export  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: tableColor,
      color: theme.palette.common.white,
      padding: "10px",
      verticalAlign: "top",
      fontFamily: "GeneralSans-Medium",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: "10px !important",
      fontFamily: "GeneralSans-Medium"
    },
  }));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#f3f3f3",
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
