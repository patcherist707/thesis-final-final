import {realtime, firestore} from "../firebaseConfig.js";

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

export const setUpRegisteredTagListener = async(io, uid) => {
  try {
    const dataRef1 = realtime.ref(`/${uid}/registrationForm`);
    const dataRef2 = realtime.ref(`/${uid}/UIDInformation`);
    const dataRef3 = realtime.ref(`/${uid}/dateOfLoading`);
    const dataRef4 = realtime.ref(`/${uid}/dateOfUnLoading`);

    async function handleAllData(regForm, uidInfo, dateOfLoadingObj, dateOfUnLoadingObj) {
      const obj1 = regForm;
      const obj2 = uidInfo;
      const obj3 = dateOfLoadingObj;
      const obj4 = dateOfUnLoadingObj;
      let activeCount = 0;
      let inactiveCount = 0;

      for (const key in obj1) {
        obj1[key].dateOfLoading = obj3 && obj3[key]?.dateOfLoading || 'N/A';
        obj1[key].dateOfUnLoading = obj4 && obj4[key]?.dateOfUnLoading || 'N/A';
        obj1[key].status = obj2 && obj2[key]?.status || obj1[key].status || 'N/A';
        
        if(obj1[key].status === 'active' && obj1[key].dateOfLoading != 'N/A'){
          activeCount++;
        }
  
        if(obj1[key].status === 'Inactive' && obj1[key].dateOfUnLoading != 'N/A'){
          inactiveCount++;
        }
      }
      io.emit('tagInfoObjUpdate', obj1);
      io.emit('countUpNew', activeCount);
      io.emit('countDownNew', inactiveCount);
    }

    const fetchDataAndListen = async () => {
      try {
        const [regFormSnapshot, uidInfoSnapshot, dateOfLoadingSnapshot, dateOfUnLoadingSnapshot] = await Promise.all([
          dataRef1.once('value'),
          dataRef2.once('value'),
          dataRef3.once('value'),
          dataRef4.once('value')
        ]);

        const regFormObj = regFormSnapshot.val();
        const uidInfoObj = uidInfoSnapshot.val();
        const dateOfLoadingObj = dateOfLoadingSnapshot.val();
        const dateOfUnLoadingObj = dateOfUnLoadingSnapshot.val();

        await handleAllData(regFormObj, uidInfoObj, dateOfLoadingObj, dateOfUnLoadingObj);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    await fetchDataAndListen();
    
    dataRef1.on('value', fetchDataAndListen);
    dataRef2.on('value', fetchDataAndListen);
    dataRef3.on('value', fetchDataAndListen);
    dataRef4.on('value', fetchDataAndListen);
    
  } catch (error) {
    console.error('Error in setUpRegisteredTagListener:', error.message);
  }
}

export const setMaxCapacityValueListener = (io, uid) => {
  const docRef = firestore.collection('Capacity').doc(`${uid}`);

  docRef.onSnapshot((doc) => {
    if (doc.exists) {
      const capacityVal = doc.data();
      io.emit('updateCapacityValue', capacityVal);
    } else {
      console.log('No such document!');
    }
  }, (error) => {
    console.error('Error fetching document:', error);
  });
}