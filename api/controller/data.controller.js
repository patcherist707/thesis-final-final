import { errorHandler } from "../utility/error.js";
import {realtime, firestore} from '../firebaseConfig.js';

export const capacity = async(req, res, next) => {
  if(req.user.id !== req.params.userId){
    return next(errorHandler(403, "Unauthorized"));
  }

  const userId = req.params.userId;
  const {maxCapacityValue, countUp} = req.body;

  if (maxCapacityValue == null || countUp == null) {
    return next(errorHandler(403, 'Please enter a value'));
  }

  const capacityPercentage = ((parseFloat(countUp) / parseFloat(maxCapacityValue)) * 100).toFixed(2);

  if(maxCapacityValue <= 0){
    return next(errorHandler(403, 'Enter a valid value that is more that 0'));
  }

  try {
    await firestore.collection('Capacity').doc(`${userId}`).set({maxCapacityValue, countUp, percentage: capacityPercentage});

    res.status(200).json({success: true, message: `The maximum capacity value is ${maxCapacityValue}`});
  } catch (error) {
    next(error.message);
  }

}

