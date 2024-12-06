import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css"; // Import FirebaseUI styles

const SignInComponent: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  useEffect(() => {
    // FirebaseUI configuration
    const uiConfig = {
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/", // Redirect URL after successful Google sign-in
      callbacks: {
        signInSuccessWithAuthResult: () => false,
      },
    };

    // Initialize FirebaseUI Auth
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", uiConfig);

    return () => ui.reset(); // Clean up FirebaseUI on component unmount
  }, []);

  // Handle email sign-up and sign-in
  const handleEmailAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Signed up successfully");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Signed in successfully");
      }
    } catch (error) {
      console.error(`Error with ${isSignUp ? "sign up" : "sign in"}:`, error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="auth-container">
      {user ? (
        <>
          <p>Welcome, {user.displayName || user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <div className="auth-box">
          <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleEmailAuth}>
            {isSignUp ? "Sign Up with Email" : "Sign In with Email"}
          </button>

          <div id="firebaseui-auth-container"></div> {/* Google Sign-In Button renders here */}

          <p className="toggle-auth">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignInComponent;
