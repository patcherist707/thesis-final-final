import {firestore} from "../firebaseConfig.js";
import bcryptjs from "bcryptjs";
import admin from "firebase-admin";
import {errorHandler} from "../utility/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
      password: hashedPassword,
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

export const signin  = async(req, res, next) => {
  const {email, password} = req.body;
  // console.log({
  //   email,
  //   password
  // });
  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }
  
  try {
    const userEmailSnapshot = await firestore.collection('users').where('email', '==', email).get();
    
    if(userEmailSnapshot.empty){
    return next(errorHandler(404, "User not found"));
    }

    const userDoc = userEmailSnapshot.docs[0];
    const validUser = userDoc.data();
    // console.log(validUser);
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    // console.log(validPassword);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    // console.log(process.env.SECRET_PASS);
    // console.log(userDoc.id)
    const token = jwt.sign({ id: userDoc.id }, process.env.SECRET_PASS);
    // console.log(token);

    const createdAt = validUser.createdAt ? validUser.createdAt.toDate().toLocaleString() : null;
    const updatedAt = validUser.updatedAt ? validUser.updatedAt.toDate().toLocaleString() : null;


    const { password: pass, ...userData } = validUser;
    userData.createdAt = createdAt; 
    userData.updatedAt = updatedAt;
    userData._id = userDoc.id;
    // console.log(userData);
    
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(userData);
  
  } catch (error) {
    next(error);
  }

  
}