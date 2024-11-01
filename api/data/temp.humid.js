import admin from 'firebase-admin';

function setTempHumidDataListener(io, uid){
  const dataRef = admin.database().ref(`/${uid}/tempHumid`);

  dataRef.on('value', (snapshot) => {
    const tempHumidData = snapshot.val();
    console.log(tempHumidData)

    if (tempHumidData){
      io.emit('updateTempHumidData', tempHumidData);
    };
    
  })
}

export default setTempHumidDataListener;