import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Button} from "flowbite-react";
import { RiErrorWarningFill } from "react-icons/ri";

const AlertModal = ({ isOpen, alerts, onClose, onCloseAll }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          padding: 4,
          borderRadius: 1,
          boxShadow: 24,
          width: "650px",
          maxHeight: "80vh", 
        }}
      >
        <div className="mb-5 flex items-center justify-center">

          <RiErrorWarningFill size={50} color="red"/>
        </div>
    
        <Box
          sx={{
            maxHeight: "50vh", 
            overflowY: "auto",
            marginBottom: 1,  
            paddingRight: 1,
          }}
        >
          {alerts.length > 0 ? (
            <ul >
              {alerts.map((alert, index) => (
                <Button key={index} className="bg-slate-500 mb-5 rounded-xl p-1" outline gradientDuoTone="purpleToPink" >
                  <Typography variant="body1">{alert}</Typography>
                </Button>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">Fetching alerts...</Typography>
          )}
        </Box>
        <div className="flex justify-between">
        <Button outline onClick={onClose} >
          Close
        </Button>
        <Button  outline onClick={onCloseAll} gradientDuoTone="pinkToOrange">
          Close All
        </Button>

        </div>
      </Box>
    </Modal>
  );
};

export default AlertModal;
