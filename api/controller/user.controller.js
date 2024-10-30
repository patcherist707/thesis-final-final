import { errorHandler } from "../utility/error.js";
import { firestore } from "../firebaseConfig.js";
import bcryptjs from "bcryptjs";
import admin from "firebase-admin";

export const updateuser = async(req, res, next) => {
  if(req.user.id !== req.params.userId){
    console.log(req.user.id);
    console.log(req.params.userId);
    return next(errorHandler(403, "You are not allowed to modify this user"));
  }

  // If password is changed
  if(req.body.password){
    if(req.body.password.length < 8){
      return next(errorHandler(400, "Password must be at least 8 characters"));
    }

    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // if username is changed
  if(req.body.username){
    if (req.body.username.length < 8 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 8 and 20 characters')
      );
    }

    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }

  // updating info
  try {
    const userId = req.params.userId;
    const userRef = firestore.collection("users").doc(userId);
    
    const updatedData = {
      ...(req.body.username && { username: req.body.username }),
      ...(req.body.email && { email: req.body.email }),
      ...(req.body.profilePicture && { profilePicture: req.body.profilePicture }),
      ...(req.body.mobileNumber && { mobileNumber: req.body.mobileNumber }),
      ...(req.body.password && { password: req.body.password }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      _id: userId 
    }

    await userRef.update(updatedData);

    const updatedUserSnapshot = await userRef.get();
    if (!updatedUserSnapshot.exists) {
      return next(errorHandler(404, "User not found"));
    }

    const updatedUser = updatedUserSnapshot.data();
    const { password, ...rest } = updatedUser;

    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
}

export const deleteuser = async(req, res, next) => {
  if(req.user.id !== req.params.userId){
    console.log(req.user.id);
    console.log(req.params.userId)
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }

  try {
    const userId = req.params.userId;
    await firestore.collection("users").doc(userId).delete();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};