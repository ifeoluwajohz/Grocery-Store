import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebaseConfig"; // Ensure this is set up correctly
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const SignInComponent: React.FC = () => {
  const { user, loading, signOut, signInWithGoogle, registerWithEmail, signInWithEmail } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  useEffect(() => {
    const containerId = "firebaseui-auth-container";

    const initFirebaseUI = () => {
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
    };

    if (!user) {
      initFirebaseUI();
    }

    return () => {
      const ui = firebaseui.auth.AuthUI.getInstance();
      if (ui) {
        ui.delete();
      }
    };
  }, [user]);

  const handleEmailAuth = async () => {
    try {
      if (isSignUp) {
        await registerWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert(error.message || "Authentication failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {user ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {user.displayName || user.email}</h2>
            <p className="mt-2 text-gray-600">How is your day going?</p>
            <button
              onClick={signOut}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h1>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleEmailAuth}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
              <button
                onClick={signInWithGoogle}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition mt-4"
              >
                Continue with Google
              </button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <span
                    onClick={() => setIsSignUp((prev) => !prev)}
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    {isSignUp ? " Sign In" : " Sign Up"}
                  </span>
                </p>
              </div>
              <div id="firebaseui-auth-container" className="mt-6"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInComponent;
