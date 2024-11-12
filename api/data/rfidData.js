import {realtime} from "../firebaseConfig.js";

export const setUpRfidDataTagListener  = (io, uid) => {
  const dataRef = realtime.ref(`/${uid}/UIDInformation`);
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const [day, month, year, hour, minute, second] = dateStr.split(/[\/\s:]/);
    return new Date(year, month - 1, day, hour, minute, second);
  }

  dataRef.on('value', (snapshot) => {
    const rfidDataTag = snapshot.val();
    if(rfidDataTag){
      let rfidDataTagEntries = [];
      for(const key in rfidDataTag) {
        if (rfidDataTag.hasOwnProperty(key)){
          rfidDataTagEntries.push(rfidDataTag[key]);
        }
      }
      rfidDataTagEntries.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      const deviceIds = rfidDataTagEntries.map(item => item.deviceId);
      io.emit('rfidDataTagUpdate', rfidDataTagEntries);
      
    }
  })


}
