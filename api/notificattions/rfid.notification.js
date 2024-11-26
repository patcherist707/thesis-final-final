import {realtime, firestore, firebaseAdmin} from "../firebaseConfig.js";

export const rfidInFlowMessage = async () => {
  try {
    const snapshot = await realtime.ref('/').once('value');
    const allUsersData = snapshot.val();

    for (const userId in allUsersData) {
      const userData = allUsersData[userId];

      if (userData && userData.inflow) {
        const existingNotificationsSnapshot = await firestore
          .collection('notifications')
          .doc(userId)
          .collection('messages')
          .get();
        const existingKeys = new Set(
          existingNotificationsSnapshot.docs.map(doc => doc.data().timestampKey)
        );

        
        await Promise.all(
          Object.entries(userData.inflow).map(async ([key, value]) => {
            try {
              const timestampKey = `${userId}_${key}_${value}_inflow`;
              if (existingKeys.has(timestampKey)) {
                console.log(`Notification for ${key} already exists for user ${userId}. Skipping.`);
                return;
              }

              // Batch writes for efficiency
              await firestore
                .collection('notifications')
                .doc(userId)
                .collection('messages')
                .add({
                  messages: `${value} rice sacks have been loaded on ${key}`,
                  userId,
                  timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                  read: false,
                  date: key,
                  timestampKey,
                });

              console.log(`Notification sent for ${key} to user ${userId}`);
            } catch (error) {
              console.error('Error sending notification to Firestore:', error);
            }
          })
        );
      } else {
        console.log(`No inflow data available for user ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error fetching user data from Realtime Database:', error);
  }
};

export const rfidoutFlowMessage = async () => {
  try {
    const snapshot = await realtime.ref('/').once('value');
    const allUsersData = snapshot.val();

    for (const userId in allUsersData) {
      const userData = allUsersData[userId];

      if (userData && userData.ouflow) {
        const existingNotificationsSnapshot = await firestore
          .collection('notifications')
          .doc(userId)
          .collection('messages')
          .get();
        const existingKeys = new Set(
          existingNotificationsSnapshot.docs.map(doc => doc.data().timestampKey)
        );

        
        await Promise.all(
          Object.entries(userData.outflow).map(async ([key, value]) => {
            try {
              const timestampKey = `${userId}_${key}_${value}_outflow`;
              if (existingKeys.has(timestampKey)) {
                console.log(`Notification for ${key} already exists for user ${userId}. Skipping.`);
                return;
              }

              // Batch writes for efficiency
              await firestore
                .collection('notifications')
                .doc(userId)
                .collection('messages')
                .add({
                  messages: `${value} rice sacks have been unloaded on ${key}`,
                  userId,
                  timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                  read: false,
                  date: key,
                  timestampKey,
                });

              console.log(`Notification sent for ${key} to user ${userId}`);
            } catch (error) {
              console.error('Error sending notification to Firestore:', error);
            }
          })
        );
      } else {
        console.log(`No ouflow data available for user ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error fetching user data from Realtime Database:', error);
  }
};

