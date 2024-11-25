// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import { io } from 'socket.io-client';

// const columns = [
//   { id: 'uid', label: 'ID', minWidth: 100 },
//   { id: 'status', label: 'Status', minWidth: 100 },
//   { id: 'deviceId', label: 'Device', minWidth: 100 },
// ];

// export default function DataTable() {
//   const [data, setData] = React.useState({});

//   React.useEffect(() => {
//     const socket = io('http://localhost:3000');
//     socket.on('rfidDataTagUpdate', (newData) => {
//       setData(newData);
//     });
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(15);
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const rows = Object.values(data);
//   console.log(data);
//   return (
//     <div className='max-w-screen-lg mx-auto'>
//       <Paper sx={{ backgroundColor: 'ButtonFace', overflow: 'hidden' }} elevation={5}>
//         <TableContainer sx={{ backgroundColor: 'ButtonFace', width: '100%', maxWidth: '600px', overflow: 'hidden' }} elevation={5}>
//           <Table stickyHeader aria-label="sticky table" sx={{
//             '& .MuiTableCell-root': { 
//               fontSize: '14px',  
//             }
//           }}>
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     align={column.align}
//                     style={{ minWidth: column.minWidth }}
//                     sx={{ backgroundColor: 'darkgrey' }}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             {data? (
//               <TableBody>
//               {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
//                 return (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.uid}>
//                     {columns.map((column) => {
//                       const value = row[column.id];
//                       if (column.id === 'status') {
//                         return (
//                           <TableCell 
//                             key={column.id} 
//                             align={column.align}
//                           >
//                             {
//                               value === 'active' 
//                               ? (<><span className="h-2.5 w-2.5  bg-green-500 inline-block rounded-full mr-2"></span>{value}</>) 
//                               : (<><span className="h-2.5 w-2.5  bg-red-500 inline-block rounded-full mr-2"></span>{value}</>)
//                             }
//                           </TableCell>
//                         );
//                       } else {
//                         return (
//                           <TableCell key={column.id} align={column.align}>
//                             {value}
//                           </TableCell>
//                         );
//                       }
//                     })}
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//             ):('No availabe data')}
            
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[15, 20]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </div>
//   );
// }

import React from "react";
import { Table, Button, Modal, TextInput, Alert, Pagination } from 'flowbite-react';
import { io } from 'socket.io-client';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useSelector } from "react-redux";

export default function DataTable() {
  const {currentUser} = useSelector((state) => state.user);
  const [showModal, setShowModal] = React.useState(false);
  const [data, setData] = React.useState({});
  const [dataNew, setDataNew] = React.useState({});
  const [getPassword, setGetPassword] = React.useState({});
  const [arrayData, setArrayData] = React.useState([]);
  const [registeredTag,setRegisteredTag] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [tagToDelete, setTagToDelete] = React.useState({});
  const [success, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteTagMessage, setDeleteTagMessage] = React.useState('');
  const [deleteTagMessageTime, setDeleteTagMessageTime] = React.useState('');
  const [deleteTagMessageDate, setDeleteTagMessageDate] = React.useState('');
  const [deletedUid, setDeletedUid] = React.useState('');
  const [currentTime, setCurrentTime] = React.useState(new Date());

  const itemsPerPage = 10;
  const totalPages = Math.ceil(arrayData.length / itemsPerPage);

  const onPageChange = (page) => setCurrentPage(page);

  React.useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('tagInfoObjUpdate', (newData) => {
      setData(newData);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId); // Clean up the interval on component unmount
  }, []);

  React.useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('registeredTagUpdate', (newData) => {
      setDataNew(newData);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const mergedData = { ...data };

    for (let key in data) {
      if (dataNew.hasOwnProperty(key)) {
        mergedData[key].status = dataNew[key].status;
      }
    }

    setRegisteredTag(mergedData);
    setArrayData(Object.values(mergedData));
  }, [data, dataNew]);

  const getTagFunction = (tag) => {
    setTagToDelete({uid: tag});
    setErrorMessage(null);
    setSuccessMessage(null);
    setSuccess(false);
  }

  const handleChange = (e) => {
    setGetPassword({ password: e.target.value, email: currentUser.email });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!getPassword.password) {
      setErrorMessage('Password is required');
    }

    try {
      setSuccess(false);  
      const res = await fetch('/api/auth/confirmation', {
        method: 'POST',
        headers: {'Content-type' : 'application/json'},
        body: JSON.stringify(getPassword),
      });

      const data = await res.json();
      
      if (data.success === false) {
        setErrorMessage(data.message);
        setSuccessMessage(null);
      }

      if (res.ok) {
        setSuccessMessage(null);
        setErrorMessage(null);
        setSuccess(true);
        setDeleteTagMessage(`You Deleted the tag with uid of ${tagToDelete.uid}`);
        setDeleteTagMessageTime(currentTime.toLocaleTimeString());
        setDeleteTagMessageDate(currentTime.toLocaleDateString());
        setDeletedUid(tagToDelete.uid);
        

      }
      
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDelete = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!tagToDelete.uid) {
      return setErrorMessage('No data available');
    }
    
    try {
      const res = await fetch(`/api/data/tagInfoDelete`, {
        method: 'POST',
        headers: {'Content-type' : 'application/json'},
        body: JSON.stringify(tagToDelete),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message);
        setSuccessMessage(null);
      } else {
        setSuccessMessage(data.message);
        setErrorMessage(null);
        sendMessage(deleteTagMessage, deleteTagMessageDate, deleteTagMessageTime, deletedUid);
        
      }
      
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    }
  }

  const sendMessage = async (deleteTagMessage, deleteTagMessageDate, deleteTagMessageTime, deletedUid) => {
    const messageForm = {
      uid: deletedUid,
      message: deleteTagMessage,
      time: deleteTagMessageTime,
      date: deleteTagMessageDate,
      isRead: false,
    };

    if(!messageForm){
      console.log('Message form is empty')
    }

    try {
      const res = await fetch('/api/notif/message', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(messageForm),
      })

      const data = await res.json();
      console.log(data);

    } catch (error) {
      console.log(error);
    }
  }

  const paginatedData = arrayData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  //console.log(dataNew);

  return (
    <div className="mx-auto md:p-3 pt-10">
      <div className='overflow-x-scroll md:mx-auto shadow-md'>
        <Table hoverable className="w-auto">
          <Table.Head>
            <Table.HeadCell>UID</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Date of Registration</Table.HeadCell>
            <Table.HeadCell>Date of Loading</Table.HeadCell>
            <Table.HeadCell>Date of Unloading</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Array.isArray(paginatedData) && paginatedData.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.uid}</Table.Cell>
                <Table.Cell>
                  {item.status === 'active' ? (
                    <><span className="h-2.5 w-2.5 bg-green-500 inline-block rounded-full mr-2"></span>{item.status}</>
                  ) : (
                    <><span className="h-2.5 w-2.5 bg-red-500 inline-block rounded-full mr-2"></span>{item.status}</>
                  )}
                </Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell className="text-center">{item.dateOfLoading}</Table.Cell>
                <Table.Cell className="text-center">{item.dateOfUnLoading}</Table.Cell>
                <Table.Cell className="flex justify-center">
                  <Button 
                    disabled={item.status === 'active' } 
                    color={'none'} 
                    onClick={() => {
                      setShowModal(true);
                      getTagFunction(item.uid);
                    }}
                  >
                    <RiDeleteBin6Fill color="red"/>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}/>
        </div>
        
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'sm'}>
        <Modal.Header />
        <Modal.Body>
          <div className='flex flex-col gap-2 w-full'>
            <div className="flex justify-center">
              <span>
                <RiDeleteBin6Fill size={'70px'} className=""/>
              </span>
            </div>
            <h1 className='text-base text-center'>Enter your password to delete tag with an id of {tagToDelete.uid}</h1>
            <div>
              <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
                <TextInput placeholder='Password' type='password' onChange={handleChange} id='value' />
                <Button size={'sm'} type='submit'>Submit</Button>
              </form>
            </div>
            
            {success && (
              <Button size={'sm'} onClick={handleDelete} color={'failure'}>Delete</Button>
            )}
            {successMessage && (
              <Alert color={'success'}>
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert color={'failure'}>
                {errorMessage}
              </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}