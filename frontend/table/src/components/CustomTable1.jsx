import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function CustomTable1({ data }) {
  return (
    <div style={{ padding:'3px'}}>
      <TableContainer component={Paper} style={{ maxWidth: '1300px' ,overflow:"auto",maxHeight:"310px"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>BASE</b></TableCell>
              <TableCell><b>INTERMEDIATE</b></TableCell>
              <TableCell><b>TICKER</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map((row, index) => (
              <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'inherit', paddingTop: '8px', paddingBottom: '8px' }}>
                <TableCell>{row.base}</TableCell>
                <TableCell>{row.intermediate}</TableCell>
                <TableCell>{row.ticker}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
