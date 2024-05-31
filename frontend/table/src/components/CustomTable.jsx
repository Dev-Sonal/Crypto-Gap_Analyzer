import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function CustomTable({ data }) {
  return (
    <div style={{ padding:'3px'}}>
    <TableContainer component={Paper} style={{ maxWidth: '1300px', overflow:"auto",maxHeight:"310px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>PROFITLOSS</b></TableCell>
            <TableCell><b>DATE</b></TableCell>
            <TableCell><b>ARBITRAGETYPE</b></TableCell>
            <TableCell><b>SCRIPT</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'inherit' , paddingTop: '8px' , paddingBottom: '8px'}}>
              <TableCell>{row.profitLoss}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.arbitrageType}</TableCell>
              <TableCell>{row.scrip1}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}
