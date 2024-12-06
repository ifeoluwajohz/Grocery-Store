import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig"; // Firebase configuration
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  getIdToken 
} from "firebase/auth";

// Define types for the context
interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  registerWithEmail?: (email: string, password: string) => Promise<void>;
  signInWithEmail?: (email: string, password: string) => Promise<void>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook for accessing AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // Fix for loading state
  }

  // Function to send authenticated requests to your backend
  const sendAuthRequestToBackend = async (url: string, idToken: string) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to authenticate with the backend");
      }
      const responseData = await response.json();
      localStorage.setItem("jwt", responseData.token);

      console.log("Backend response:", responseData);
    } catch (error) {
      throw error; // Rethrow to propagate error to caller
    }
  };

  // Signup function
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await getIdToken(userCredential.user);
      await sendAuthRequestToBackend("https://zorra-lxsj.onrender.com/user/register", idToken);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  // SignIn function
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await getIdToken(userCredential.user);
      await sendAuthRequestToBackend("https://zorra-lxsj.onrender.com/user/login", idToken);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  // Google SignIn function
  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(userCredential.user);
      await sendAuthRequestToBackend("https://zorra-lxsj.onrender.com/user/login", idToken);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  // Fetch User Profile
  const fetchUserProfile = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("https://zorra-lxsj.onrender.com/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error || "Failed to fetch profile");
      }

      const data = await response.json();
      console.log("User profile:", data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // SignOut function
  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
    localStorage.removeItem("jwt")
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, fetchUserProfile, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};