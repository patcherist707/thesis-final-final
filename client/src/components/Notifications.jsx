import { useState, useEffect } from "react";
import { firestoreClient  } from '../firebase.js';
import { collection, onSnapshot, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Button, Alert } from "flowbite-react";
import { useSelector } from 'react-redux';
import MarkAsRead from "./subdashComp/MarkAsRead.jsx";


export default function Notifications() {
  const [notification, setNotification] = useState();
  const [notificationDate, setNotificationDate] = useState();
  const { currentUser } = useSelector((state) => state.user);

  const uid = currentUser._id;
  useEffect(() => {
    const messagesRef = collection(firestoreClient, "notifications", uid, "messages");
    const q = query(
      messagesRef, 
      where("isRead", "==", false), // Adjust condition as needed
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const message = messages.map((msg) => ({
        message: msg.messages,
        id: msg.id,
        timestamp: msg.timestamp.toDate().toLocaleString(),
        isRead: msg.isRead,
      }))
      const timestamp = messages.map((msg) => msg.timestamp.toDate().toLocaleString());

      setNotification(message);
      setNotificationDate(timestamp);
      
      
    });

    return () => unsubscribe();

  }, [uid]); 
  
  const handleMarkAsRead = (uid, notificationId) => {
    MarkAsRead(uid, notificationId);
  };

  return (
    <div className="flex flex-col w-full items-center max-h-screen overflow-y-auto pb-28">
      {notification?.length > 0 ? ( 
        notification.map((item) => (
          <div key={item.id} className="w-full">
            <Alert className="mb-2 w-full h-36 relative" color={'failure'}>
              <div className="flex flex-col gap-3">
                <Button 
                  className="absolute top-2 right-2"
                  size="xs" 
                  color="red"
                  onClick={() => handleMarkAsRead(uid, item.id)}
                >
                  Close
                </Button>
                <p className="flex justify-between">
                  {item.timestamp}
                </p>
                <p className="flex-1">{item.message}</p>
              </div>
            </Alert>
          </div>
        ))
      ) : (
        <Alert color="warning">No notifications available.</Alert>
      )}
    </div>
  );
}
