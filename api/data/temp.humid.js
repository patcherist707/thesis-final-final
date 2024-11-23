import { realtime, firestore, firebaseAdmin } from "../firebaseConfig.js";

export const setTempHumidDataListener = (io, uid) => {
  const dataRef = realtime.ref(`/${uid}/tempHumid`);
    dataRef.on('value', async(snapshot) => {
    const tempHumidData = snapshot.val();
    if (tempHumidData){
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