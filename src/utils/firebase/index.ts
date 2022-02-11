import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "./firebase.json";

if (admin.apps.length == 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

const firestore = admin.firestore();

export { firestore };
