import { useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const checkAdmin = async (uid: string) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() && userDoc.data()?.isAdmin === true;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set cookies
      document.cookie = "auth=true; path=/";
      await checkAdmin(userCredential.user.uid).then((isAdmin) => {
        if (isAdmin) document.cookie = "isAdmin=true;path=/";
      });
      console.log(this);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Add user document with role in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        isAdmin: false, // Set default role; adjust as needed
      });

      // Set cookies
      document.cookie = "auth=true; path=/";
      await checkAdmin(userCredential.user.uid).then((isAdmin) => {
        if (isAdmin) document.cookie = "isAdmin=true;path=/";
      });

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth); // Reset isAdmin on logout
    } catch (error) {
      throw error;
    }
  };

  return { user, loading, signIn, signUp, logOut };
};
