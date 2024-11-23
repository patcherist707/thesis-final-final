import { realtime, firestore, firebaseAdmin } from "../firebaseConfig.js";

export const setTempHumidDataListener = (io, uid) => {
  const dataRef = realtime.ref(`/${uid}/tempHumid`);
    dataRef.on('value', async(snapshot) => {
    const tempHumidData = snapshot.val();
    if (tempHumidData){
      // const { temperature, humidity } = tempHumidData;

      // if(temperature !== 20 && ![40, 60, 80].includes(humidity)){
      //   const data = {
      //     temperature: temperature,
      //     humidity: humidity,
      //     data: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      //   }

      //   try {
      //     await firestore
      //       .collection('temp-humid-threshold')
      //       .doc(uid)
      //       .collection('data')
      //       .add(data);

      //     console.log('Data saved to Firestore!');
      //   } catch (error) {
      //     console.error('Error saving data to Firestore: ', error);
      //   }
      // }
      
      io.emit('updateTempHumidData', tempHumidData);
    };

    
    
  })
}

export const fetchTempHumidEvery5Minute = async() => {
  try {
    const snapshot = await realtime.ref('/' ).once('value');
    const allUsersData = snapshot.val();
    const date = new Date().toISOString().split('T')[0];
    
    for(const userId in allUsersData){
      const userData = allUsersData[userId];
      
      if(userData && userData.tempHumid){
        const {temperature, humidity} = userData.tempHumid;
        const username = userData.username;

        await firestore
          .collection('temperature_humidity_data')
          .doc(userId)
          .collection('Date')
          .doc(date)
          .collection('readings')
          .add({
            temperature,
            humidity,
            username,
            timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          })
      
      }
    }
    console.log("Data is sent to firestore");

  } catch (error) {
    console.log(error);
  }
  
}