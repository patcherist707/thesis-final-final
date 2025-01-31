import { realtime, firestore, firebaseAdmin } from "../firebaseConfig.js";



export const setTempHumidDataListener = (io, uid) => {
  const dataRef = realtime.ref(`/DHT22/${uid}`);
    dataRef.on('value', async(snapshot) => {
    const tempHumidData = snapshot.val();
    if (tempHumidData){
      io.to(uid).emit('updateTempHumidData', tempHumidData);
    };
  })
}

export const fetchTempHumidEvery10Minute = async() => {
  try {
    const snapshot = await realtime.ref('/DHT22' ).once('value');
    const allUsersData = snapshot.val();
   
    const currentUTC = new Date();
    const philippinesTime = new Date(currentUTC.getUTCFullYear(), currentUTC.getUTCMonth(), currentUTC.getUTCDate(), currentUTC.getUTCHours(), currentUTC.getUTCMinutes(), currentUTC.getUTCSeconds(), currentUTC.getUTCMilliseconds());
    philippinesTime.setHours(philippinesTime.getHours() + 8);
   
    const year = philippinesTime.getFullYear();
    const month = String(philippinesTime.getMonth() + 1).padStart(2, '0');
    const day = String(philippinesTime.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    console.log(allUsersData)
    for(const userId in allUsersData){
      const userData = allUsersData[userId];
      if(userData){
        const {temperature, humidity} = userData;
        await firestore
          .collection('temperature_humidity_data')
          .doc(userId)
          .collection('Date')
          .doc(formattedDate)
          .collection('readings')
          .add({
            temperature,
            humidity,
            timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          })

        console.log("Data is sent to firestore");
      
      }else{
        console.log("No data available in this account")
      }
    }
  } catch (error) {
    console.log('Failed to send data to firestore collection temperature_humidity_data');
  }
}