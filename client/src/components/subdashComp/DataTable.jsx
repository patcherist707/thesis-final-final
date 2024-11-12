import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { io } from 'socket.io-client';

const columns = [
  { id: 'uid', label: 'ID', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'deviceId', label: 'Device', minWidth: 100 },
];

export default function DataTable() {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('rfidDataTagUpdate', (newData) => {
      setData(newData);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = Object.values(data);
  console.log(data);
  return (
    <div className='max-w-screen-lg mx-auto'>
      <Paper sx={{ backgroundColor: 'ButtonFace', overflow: 'hidden' }} elevation={5}>
        <TableContainer sx={{ backgroundColor: 'ButtonFace', width: '100%', maxWidth: '600px', overflow: 'hidden' }} elevation={5}>
          <Table stickyHeader aria-label="sticky table" sx={{
            '& .MuiTableCell-root': { 
              fontSize: '14px',  
            }
          }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ backgroundColor: 'darkgrey' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {data? (
              <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.uid}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id === 'status') {
                        return (
                          <TableCell 
                            key={column.id} 
                            align={column.align}
                          >
                            {
                              value === 'active' 
                              ? (<><span className="h-2.5 w-2.5  bg-green-500 inline-block rounded-full mr-2"></span>{value}</>) 
                              : (<><span className="h-2.5 w-2.5  bg-red-500 inline-block rounded-full mr-2"></span>{value}</>)
                            }
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
            ):('No availabe data')}
            
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[15, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
