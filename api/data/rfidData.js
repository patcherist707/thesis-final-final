import {realtime, firestore, firebaseAdmin} from "../firebaseConfig.js";
import { data } from "../test-folder/test.data.js";

export const setUpRfidDataTagListener  = async(io, uid) => {
  const dataRef = realtime.ref(`/${uid}/UIDInformation`);
  const dataRef2 = realtime.ref(`/${uid}/inflow`);
  const dataRef3 = realtime.ref(`/${uid}/outflow`);
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

  dataRef2.on('value', (snapshot) => {
    const inflowData = snapshot.val();
    const monthlyInventory = {};
    const monthlyInventoryTest = {};
    if(inflowData){
      for(let date in inflowData){
        const month = date.substring(0, 7);

        if(!monthlyInventory[month]){
          monthlyInventory[month] = 0;
        }

        monthlyInventory[month] += inflowData[date];
      }

      for(let date in data){
        const month = date.substring(0, 7);

        if(!monthlyInventoryTest[month]){
          monthlyInventoryTest[month] = 0;
        }

        monthlyInventoryTest[month] += data[date];
      }

      const dataSets = Object.keys(monthlyInventory).map(key =>({[key]: monthlyInventory[key]}));
      
      dataSets.forEach(obj => {
        const monthYear = Object.keys(obj)[0];
        const totalInFlow = obj[monthYear];
        const year = monthYear.substring(0, 4);
        const month = monthYear.substring(5,7);

        firestore
        .collection('monthlyInflow')
        .doc(uid)
        .collection(year)
        .doc(month)
        .set({totalInFlow})
        .then(() => {
          console.log(`Data for ${month} successfully written!`);
        })
        .catch(error => {
          console.error(`Error writing data for ${month}: `, error);
        });


      })

        
    }else{
      console.log("There is a problem fetching data from the reference inflow");
    }
    
    
  })

  dataRef3.on('value', (snapshot) => {
    const outflowData = snapshot.val();
    const monthlyInventory = {};
    // const monthlyInventoryTest = {};
    if(outflowData){
      for(let date in outflowData){
        const month = date.substring(0, 7);

        if(!monthlyInventory[month]){
          monthlyInventory[month] = 0;
        }

        monthlyInventory[month] += outflowData[date];
      }

      // for(let date in data){
      //   const month = date.substring(0, 7);

      //   if(!monthlyInventoryTest[month]){
      //     monthlyInventoryTest[month] = 0;
      //   }

      //   monthlyInventoryTest[month] += data[date];
      // }

      const dataSets = Object.keys(monthlyInventory).map(key =>({[key]: monthlyInventory[key]}));

      // const hmm = Object.keys(monthlyInventoryTest).map(key =>({[key]: monthlyInventoryTest[key]}));
      
      dataSets.forEach(obj => {
        const monthYear = Object.keys(obj)[0];
        const totalInFlow = obj[monthYear];
        const year = monthYear.substring(0, 4);
        const month = monthYear.substring(5,7);

        firestore
        .collection('monthlyOutflow')
        .doc(uid)
        .collection(year)
        .doc(month)
        .set({totalInFlow})
        .then(() => {
          console.log(`Data for ${month} successfully written!`);
        })
        .catch(error => {
          console.error(`Error writing data for ${month}: `, error);
        });


      })

        
    }else{
      console.log("There is a problem fetching data from the reference inflow");
    }
    
    
  })
}

export const setUpTagInformationListener = async(io, uid) => {
  try {
    const dataRef1 = realtime.ref(`/${uid}/registrationForm`);
    const dataRef2 = realtime.ref(`/${uid}/UIDInformation`);
    const dataRef3 = realtime.ref(`/${uid}/dateOfLoading`);
    const dataRef4 = realtime.ref(`/${uid}/dateOfUnLoading`);

    async function handleAllData(tagInfoObj, rfidDataObj, dateOfLoadingObj, dateOfUnLoadingObj) {
      const obj1 = tagInfoObj;
      const obj2 = rfidDataObj;
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
        const [tagInfoSnapshot, rfidDataSnapshot, dateOfLoadingSnapshot, dateOfUnLoadingSnapshot] = await Promise.all([
          dataRef1.once('value'),
          dataRef2.once('value'),
          dataRef3.once('value'),
          dataRef4.once('value')
        ]);

        const tagInfoObj = tagInfoSnapshot.val();
        const rfidDataObj = rfidDataSnapshot.val();
        const dateOfLoadingObj = dateOfLoadingSnapshot.val();
        const dateOfUnLoadingObj = dateOfUnLoadingSnapshot.val();
        
        //console.log(tagInfoObj);

        await handleAllData(tagInfoObj, rfidDataObj, dateOfLoadingObj, dateOfUnLoadingObj);
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






