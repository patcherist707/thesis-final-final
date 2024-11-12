import {realtime} from "../firebaseConfig.js";

export const setUpRfidDataTagListener  = (io, uid) => {
  const dataRef = realtime.ref(`/${uid}/registeredTag`);
  const parsedData = (dateStr) => {
    if(!dateStr) {
      return new Date(0);
    }
      
  }


}
