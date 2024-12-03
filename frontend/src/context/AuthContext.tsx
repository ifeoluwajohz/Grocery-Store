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
  fetchUserProfile: () => Promise<void>; // New function to fetch user profile
  signOut: () => Promise<void>;
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
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await getIdToken(userCredential.user);
      await sendAuthRequestToBackend("http://localhost:3600/user/register", idToken);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  // SignIn function
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await getIdToken(userCredential.user);
      await sendAuthRequestToBackend("http://localhost:3600/user/login", idToken);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  // Google SignIn function
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(userCredential.user);
      await sendAuthRequestToBackend("http://localhost:3600/user/login", idToken);

    } catch (e) {
      console.error("Error during Google sign-in:", e.message);
    }
  };

  // Fetch User Profile
  const fetchUserProfile = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) console.log("No ID token available");

      const response = await fetch("http://localhost:3600/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error || "Failed to fetch profile");
      }

      const data = await response.json();
      console.log("User profile:", data);
      return data
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // SignOut function
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, fetchUserProfile, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};



// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "../config/firebaseConfig"; // Firebase configuration
// import {
//   User,
//   onAuthStateChanged,
//   signOut as firebaseSignOut,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   getIdToken,
// } from "firebase/auth";

// // Define types for the context
// interface AuthContextProps {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   signUp: (email: string, password: string) => Promise<void>;
//   signIn: (email: string, password: string) => Promise<void>;
//   signInWithGoogle: () => Promise<void>;
//   fetchUserProfile: () => Promise<void>;
//   signOut: () => Promise<void>;
//   clearError: () => void;
// }

// // Create the AuthContext
// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// // Custom hook for accessing AuthContext
// export const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // AuthProvider component
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleError = (message: string) => {
//     setError(message);
//     console.error(message);
//   };

//   const clearError = () => setError(null);

//   const sendAuthRequestToBackend = async (url: string, idToken: string) => {
//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ idToken }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to authenticate with the backend");
//       }
//     } catch (error) {
//       handleError((error as Error).message);
//       throw error;
//     }
//   };

//   const signUp = async (email: string, password: string) => {
//     try {
//       clearError();
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const idToken = await getIdToken(userCredential.user);
//       await sendAuthRequestToBackend("http://localhost:3600/user/register", idToken);
//     } catch (error) {
//       handleError("Error during signup: " + (error as Error).message);
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       clearError();
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const idToken = await getIdToken(userCredential.user);
//       await sendAuthRequestToBackend("http://localhost:3600/user/login", idToken);
//     } catch (error) {
//       handleError("Error during sign-in: " + (error as Error).message);
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       clearError();
//       const provider = new GoogleAuthProvider();
//       const userCredential = await signInWithPopup(auth, provider);
//       const idToken = await getIdToken(userCredential.user);
//       await sendAuthRequestToBackend("http://localhost:3600/user/login", idToken);
//     } catch (error) {
//       handleError("Error during Google sign-in: " + (error as Error).message);
//     }
//   };

//   const fetchUserProfile = async () => {
//     try {
//       clearError();
//       const idToken = await auth.currentUser?.getIdToken();
//       if (!idToken) throw new Error("No ID token available");

//       const response = await fetch("http://localhost:3600/user/profile", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${idToken}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch profile");
//       }

//       const data = await response.json();
//       console.log("User profile:", data);
//     } catch (error) {
//       handleError("Error fetching profile: " + (error as Error).message);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await firebaseSignOut(auth);
//       setUser(null);
//     } catch (error) {
//       handleError("Error during sign-out: " + (error as Error).message);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         error,
//         signUp,
//         signIn,
//         signInWithGoogle,
//         fetchUserProfile,
//         signOut,
//         clearError,
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };
