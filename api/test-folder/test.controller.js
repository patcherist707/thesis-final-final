import {firestore} from "../firebaseConfig.js"
import { data } from "./test.data.js";

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
  

  const monthlyInventory = {};
  for(let date in data){
    const month = date.substring(0, 7);

    if(!monthlyInventory[month]){
      monthlyInventory[month] = 0;
    }

    monthlyInventory[month] += data[date];
  }
  console.log(monthlyInventory)
}
