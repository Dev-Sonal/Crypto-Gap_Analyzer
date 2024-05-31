import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function CustomTable({ data }) {
  return (
    <div style={{ padding:'3px'}}>
    <TableContainer component={Paper} style={{ maxWidth: '1300px', overflow:"auto",maxHeight:"310px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>ACTIONS</b></TableCell>
            <TableCell><b>TICKER1</b></TableCell>
            <TableCell><b>TICKER2</b></TableCell>
            <TableCell><b>TICKER3</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'inherit' , paddingTop: '8px' , paddingBottom: '8px'}}>
              <TableCell>{row.action}</TableCell>
              <TableCell>{row.ticker1}</TableCell>
              <TableCell>{row.ticker2}</TableCell>
              <TableCell>{row.ticker3}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}
