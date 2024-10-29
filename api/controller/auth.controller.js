import {firestore} from "../firebaseConfig.js";
import bcryptjs from "bcryptjs";
import admin from "firebase-admin";
import {errorHandler} from "../utility/error.js";

export const signup = async(req, res, next) => {
  const {username, email, password} = req.body;
  // console.log({
  //   username,
  //   email,
  //   password
  // });
  if(
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ){
    next(errorHandler(400, "All fields are required"));
  };

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const existingUsername = await firestore.collection('users').where('username', '==', username).get();
    if(!existingUsername.empty){
      next(errorHandler(409, "Username already exist!"));
    }

    const existingEmail = await firestore.collection('users').where('email', '==', email).get();
    if(!existingEmail.empty){
      next(errorHandler(403, "Email already exist!"));
    }

    const userDataRef = firestore.collection('users').doc();
    const newUserData = {
      username,
      email,
      hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userDataRef.set(newUserData);
    const newUserId = userDataRef.id;
    res
    .status(200)
    .json({message: "User created successfully"});

     
  } catch (error) {
    next(error);

  }
}