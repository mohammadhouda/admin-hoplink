import { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { ref, get, set } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import Spinner from "../Spinner";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Enable persistent authentication
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          if (currentUser) {
            const userRef = ref(database, "users/" + currentUser.uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              setRole(snapshot.val().role);
            }
          } else {
            setRole(null);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Auth persistence error:", error);
        setLoading(false);
      });
  }, []);

  const signUp = async (email, password, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      await set(ref(database, "users/" + userId), { email, role });
      setRole(role);
      console.log("User registered as:", role);
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      const snapshot = await get(ref(database, "users/" + userId));

      if (snapshot.exists()) {
        setRole(snapshot.val().role);
        console.log(`Logged in as: ${snapshot.val().role}`);
        return snapshot.val().role;
      } else {
        console.error("User role not found");
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, login, signUp, logout, loading }}
    >
      {!loading ? children : <Spinner />}
    </AuthContext.Provider>
  );
}
