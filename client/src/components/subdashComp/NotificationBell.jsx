import React from "react";
import { FaBell } from 'react-icons/fa';
import { useState, useEffect } from "react";
import Notifications from "../../utils/Notifications";
import { firestoreClient } from "../../firebase";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';

export default function NotificationBell() {
  const [count, setCount] = useState(0); 
  const { currentUser } = useSelector((state) => state.user);
  const uid = currentUser._id;

  const [showNotifications, setShowNotifications] = useState(false);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    

    const messagesRef = collection(firestoreClient, "notifications", uid, "messages");
    const q = query(messagesRef, where("read", "==", false)); 

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => doc.data());
      
      setCount(notifications.length);
    });

    
    return () => unsubscribe();
  }, [uid]); 
  
  return (
    <div className="relative">
      <button onClick={handleBellClick}>
        <FaBell size={35} />
        {count > 0 && (
          <span className="absolute top-1 right-1.5 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {count}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg w-96 p-4">
          <Notifications/>
        </div>
      )}
    </div>
  );
}
