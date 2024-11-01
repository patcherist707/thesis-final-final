import { realtime, firestore, firebaseAdmin } from "../firebaseConfig.js";

export const setTempHumidDataListener = (io, uid) => {
  const dataRef = realtime.ref(`/${uid}/tempHumid`);
    dataRef.on('value', (snapshot) => {
    const tempHumidData = snapshot.val();

    if (tempHumidData){
      io.emit('updateTempHumidData', tempHumidData);
    };
    
  })
}

export const logTempHumidData = async() => {
  try {
    const snapshot = await realtime.ref('/' ).once('value');
    const allUsersData = snapshot.val();
    
    for(const userId in allUsersData){
      const userData = allUsersData[userId];
      
      if(userData && userData.tempHumid){
        const {temperature, humidity} = userData.tempHumid;
        const username = userData.username;

        await firestore.collection('logTempHumidData')
          .doc(userId)
          .collection('log')
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