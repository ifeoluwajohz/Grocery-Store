import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebaseConfig"; // Ensure this is set up correctly
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const SignInComponent: React.FC = () => {
  const { user, loading, signOut, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  useEffect(() => {
    const containerId = "firebaseui-auth-container";
  
    const initFirebaseUI = () => {
      if (document.getElementById(containerId)) {
        const uiConfig = {
          signInOptions: ["google.com", "password"],
          callbacks: {
            signInSuccessWithAuthResult: () => false, // Prevent page reload
          },
        };
  
        let ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
          ui = new firebaseui.auth.AuthUI(auth);
        }
        ui.start(`#${containerId}`, uiConfig);
      }
    };
  
    if (!user) {
      initFirebaseUI();
    }
  
    return () => {
      const ui = firebaseui.auth.AuthUI.getInstance();
      if (ui) {
        ui.delete(); // Prevent using deleted instance
      }
    };
  }, [user]);
  
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="auth-container">
      {user ? (
        <div className="welcome-box">
          <p>Welcome, {user.displayName || user.email}</p>
          <p>How is your day going?</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div className="auth-box">
          <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <button onClick={signInWithGoogle}>SignIn with Google</button>

          <div id="firebaseui-auth-container"></div> 
          {/* Above code should now render FirebaseUI when firebase is initialized */}
        </div>
      )}
    </div>
  );
};

export default SignInComponent;
