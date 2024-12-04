import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Button} from "flowbite-react";
import { RiErrorWarningFill } from "react-icons/ri";

const AlertModal = ({ isOpen, alerts, onClose, onCloseAll }) => {

  
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  
  return (
      <Box
        sx={{
          bgcolor: "background.paper",
          padding: 4,
          width: "100%",
        }}
      >
        <div className={`mb-2 flex items-center justify-center ${Object.keys(alerts).length > 0 ? 'animate-heartbeat' : ''}`} >

          <RiErrorWarningFill size={50} color="red"/>
        </div>
        <div className="flex justify-between mb-2">
          <Button outline onClick={onClose} >
            Clear
          </Button>
          <Button  outline onClick={onCloseAll} gradientDuoTone="pinkToOrange">
            Clear All
          </Button>

        </div>
    
        <Box
          sx={{
            maxHeight: "80vh", 
            overflowY: "auto",
            marginBottom: 1,  
            paddingRight: 1,
          }}
        >
          {alerts.length > 0 ? (
            <ul >
              {alerts.map((alert, index) => (
                <div>
                  <div className="font-bold">{date}, {time}</div>
                  <Button key={index} className="bg-slate-500 mb-5 rounded-xl p-1" outline gradientDuoTone="purpleToPink" >
                    <Typography variant="body1">{alert}</Typography>
                  </Button>
                </div>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">Fetching alerts...</Typography>
          )}
        </Box>
        
      </Box>
    
  );
};

export default AlertModal;
