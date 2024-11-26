import { doc, updateDoc } from "firebase/firestore";
import { firestoreClient } from "../firebase";

const MarkAsRead = async (userId, notificationId) => {
  try {
    // Reference the specific notification document
    const notificationDocRef = doc(
      firestoreClient,
      "notifications",
      userId,
      "messages",
      notificationId
    );

    // Update the "isRead" field to true
    await updateDoc(notificationDocRef, { isRead: true });

    console.log(`Notification ${notificationId} marked as read.`);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

export default MarkAsRead;