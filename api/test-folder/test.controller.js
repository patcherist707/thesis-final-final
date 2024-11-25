import {firestore} from "../firebaseConfig.js"
import { data, notificationTest, tempHumidData2024, tempHumidData2025 } from "./test.data.js";

export const testDatabase = async(req, res) => {
  try {
    await firestore.collection('userTest').doc().set(
      {
        name: "ruhayna Adje",
        email: "ruhaynaadje08@gmail.com",
        age: 30,
      });
      res.json({
        message: "Data written successfully"
      })
  } catch (error) {
    res
    .status(500)
    .json({
      message: error.message
    });
  }
}

export const test = async(req, res) => {
  const token = req.cookies.access_token;
  console.log(token);
  res
  .json({
    message: "This is a test code"
  });
}

export const philippineTimeCheck = async() => {

  const currentUTC = new Date();
  const philippinesTime = new Date(currentUTC.getUTCFullYear(), currentUTC.getUTCMonth(), currentUTC.getUTCDate(), currentUTC.getUTCHours(), currentUTC.getUTCMinutes(), currentUTC.getUTCSeconds(), currentUTC.getUTCMilliseconds());
  philippinesTime.setHours(philippinesTime.getHours() + 8);
  console.log(philippinesTime.toLocaleString());


}

export const monthlyInventoryTest = () => {
  
  const uid = "sFTZuNVYzzx8eWgknLTg";
  const monthlyInventory = {};
  for(let date in data){
    const month = date.substring(0, 7);
    

    if(!monthlyInventory[month]){
      monthlyInventory[month] = 0;
    }

    monthlyInventory[month] += data[date];
  }
  console.log(monthlyInventory);
  const dataSets = Object.keys(monthlyInventory).map(key =>({[key]: monthlyInventory[key]}));
  console.log(dataSets);

  dataSets.forEach(obj => {
    const monthYear = Object.keys(obj)[0];
    const totalInFlow = obj[monthYear];
    const year = monthYear.substring(0, 4);
    const month = monthYear.substring(5,7);

    firestore
    .collection('monthlyInflowTest')
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
}

export const tempHumidReadingTest = async() => {
  for(const obj of tempHumidData2024){
    try {
      await firestore
        .collection('temperature_humidity_data_test')
        .doc("sFTZuNVYzzx8eWgknLTg")
        .collection('Date')
        .doc("2024-11-24")
        .collection("readings")
        .add({
          temperature: obj.temperature,
          humidity: obj.humidity,
          timestamp: obj.timestamp
        })
    } catch (error) {
      console.error(`Error adding reading for ${obj.date}:`, error);
    }
  }

  for(const obj of tempHumidData2025){
    try {
      await firestore
        .collection('temperature_humidity_data_test')
        .doc("sFTZuNVYzzx8eWgknLTg")
        .collection('Date')
        .doc("2024-11-25")
        .collection("readings")
        .add({
          temperature: obj.temperature,
          humidity: obj.humidity,
          timestamp: obj.timestamp
        })
    } catch (error) {
      console.error(`Error adding reading for ${obj.date}:`, error);
    }
  }
}

export const realtimeNotificationTest = () => {
  try {
    const batch = firestore.batch();
    const uid = "FTl6X3pqqSx7sUpgBd6u";

    notificationTest.forEach((notification) => {
      const docRef = 
      firestore
      .collection('notifications')
      .doc(uid)
      .collection('messages')
      .add({
        messages: notification.message,
        userId : uid,
        timestamp: notification.timestamp,
        isRead: notification.read,
      })
    })
    console.log("Dummy notifications added successfully!");
  } catch (error) {
    console.error("Error adding dummy notifications: ", error);
  }
}