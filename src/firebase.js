import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRG_sM-hjD9cx8HyyqOnSNbpWStNXvIJ0",
  authDomain: "uniconnect-rnsit.firebaseapp.com",
  projectId: "uniconnect-rnsit",
  storageBucket: "uniconnect-rnsit.firebasestorage.app",
  messagingSenderId: "222652811598",
  appId: "1:222652811598:web:503258825e05325850f61f"
};

const app = initializeApp(firebaseConfig);

export default app;
import { getAuth } from "firebase/auth";

export const auth = getAuth(app);