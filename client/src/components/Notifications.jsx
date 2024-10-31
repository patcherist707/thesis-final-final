import * as React from 'react';
// import io from "socket.io-client";
import { 
  List, 
  ListItem, 
  Divider, 
  ListItemButton,
  Checkbox, 
  Paper
} from '@mui/material';
import { Pagination, Modal, Button } from "flowbite-react";

const SOCKET_SERVER_URL = "http://localhost:4000";

export default function Notifications() {
  const [messages, setMessages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [checked, setChecked] = React.useState([]);
  const [selectedMessage, setSelectedMessage] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [showModal, setShodowModal] = React.useState(false);

  // React.useEffect(() => {
  //   const socket = io(SOCKET_SERVER_URL);

  //   socket.on("messages", (data) => {
  //     if (data.success) {
  //       setMessages(data.messages);
  //     } else {
  //       console.error("Error:", data.message);
  //     }
  //   });

  //   socket.emit("fetchAllMessages");

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const onPageChange = (page) => setCurrentPage(page);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  messages.sort((a, b) => {
    return new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time);
  });

  const formatDateTime = (date, time) => {
    const messageDate = new Date(date + " " + time);
    const now = new Date();
    const diffInMs = now - messageDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };
  const paginatedData = messages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCheckBox = (value) => () => {
    if(value === 'all'){
      if(checked.length === messages.length){
        setChecked([]);
      }else{
        setChecked(messages.map((_, index) => index));
      }
    }else{
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if(currentIndex === -1){
        newChecked.push(value)
      }else{
        newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);
    }
    console.log(checked)
  }

  const handleDeleteMessage = async() => {
    const messagesToDelete = checked.map(index => messages[index]);

    try {
      const res = await fetch('/api/notif/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(messagesToDelete),
      });
      
      if (res.ok) {
        const newMessages = messages.filter((item, index) => !checked.includes(index));
        setMessages(newMessages);
        setChecked([]);
        console.log('Deleted messages:', messagesToDelete);
      } else {
        console.error('Failed to delete messages.');
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  }

  const handleMessageOpen = async (item, index) => {
    setShodowModal(true);
    setSelectedMessage(item.message);
    setSelectedDate(item.date);
    setSelectedTime(item.time);
    
    const updatedMessages = messages.map((msg, i) => {
      if (i === index) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
    setMessages(updatedMessages);

    const messageForm = {
      uid: item.uid,
      message: item.message,
      time: item.time,
      date: item.date,
      isRead: true,
    };

    if (!messageForm) {
      return console.log('Message form is empty');
    }

    try {
      const res = await fetch('/api/notif/message', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(messageForm),
      })

      const data = await res.json();
      

    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageClose = () => {
    setShodowModal(false);
  }
 
  return (
    <div className="overflow-x-scroll w-full p-4">
      {
        messages.length === 0 ? (<p className='text-center'>No message found</p>) : (
        <Paper>
          <List className=" flex flex-col overflow-y-scroll max-h-screen overflow-hidden text-ellipsis white-space: nowrap">
            <ListItem
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleCheckBox('all')}
                  checked={checked.length === messages.length && messages.length > 0}
                  indeterminate={checked.length > 0 && checked.length < messages.length}
                />
              }
              className='flex justify-between gap-10 sm:gap-5'
            >
              <ListItemButton>
                {checked.length > 0 && (
                  <div className="flex justify-end">
                    <Button 
                      variant="contained" className='bg-slate-500'
                      onClick={handleDeleteMessage}>
                      Delete Selected
                    </Button>
                  </div>
                  
                )}
              </ListItemButton>

            </ListItem>
            {
              Array.isArray(paginatedData) && paginatedData.map((item, index) => {
                const labelId = `checkbox-list-secondary-label-${index}`;
                const isChecked = checked.indexOf(index) !== -1; 
                return (
                <>
                  <ListItem 
                    className={`flex justify-between gap-16 sm:gap-28 ${isChecked ? 'bg-blue-200' : 'bg-gray-100'} ${item.isRead ? '' : 'font-semibold'} `}
                    key={index}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleCheckBox(index)}
                        checked={isChecked}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    }
                  >
                    <ListItemButton onClick={() => handleMessageOpen(item, index)}>
                      <div className="flex-1 overflow-hidden text-ellipsis white-space: nowrap">
                        <span>
                          {item.message}
                        </span>
                      </div>
                      <div className="w-30">
                        <span>
                          {formatDateTime(item.date,item.time)}
                        </span>
                      </div>
                    </ListItemButton>
                  </ListItem>
                  <Divider/>
                </>
              )})
            }
          </List>
          <div className="flex overflow-x-auto justify-center pb-4">
            <Pagination
              currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}
            />
          </div>
        </Paper>
      )}
      <Modal
        show={showModal}
        onClose={handleMessageClose}
        popup
        size={'3xl'}
      >
        <Modal.Header/>
        <Modal.Body>
          
          <Paper>
            <div className='flex flex-col gap-5 p-10 m-10'>
              <span>
                {selectedTime}
              </span>
              <span>
                {selectedDate}
              </span>
              <span>
                {selectedMessage}
              </span>
            </div>
          </Paper>
            
          
        </Modal.Body>

      </Modal>
    </div>
  );
}
