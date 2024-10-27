import { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const useFirestore = (collectionName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const getByField = async (field: string, value: any) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, collectionName),
        where(field, "==", value)
      );
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      return documents;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const getById = async (value: any) => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDoc(doc(db, collectionName, value));
      const documents = querySnapshot.data();
      setLoading(false);
      return documents;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const getAll = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  };

  return { add, update, remove, getByField, getById, getAll, loading, error };
};
