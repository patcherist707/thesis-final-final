import {firestore} from "../firebaseConfig.js"

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

