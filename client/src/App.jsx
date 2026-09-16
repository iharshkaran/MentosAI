import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import "./index.css";

function App() {
    return (
        <Routes>
            {/* Public Landing Page Route */}
            <Route path="/" element={<Landing />} />

            {/* Sign-In Route: If logged in, redirect to dashboard. If signed out, show custom SignInPage */}
            <Route
                path="/sign-in/*"
                element={
                    <>
                        <SignedIn>
                            <Navigate to="/dashboard" replace />
                        </SignedIn>
                        <SignedOut>
                            <SignInPage />
                        </SignedOut>
                    </>
                }
            />

            {/* Sign-Up Route: If logged in, redirect to dashboard. If signed out, show custom SignUpPage */}
            <Route
                path="/sign-up/*"
                element={
                    <>
                        <SignedIn>
                            <Navigate to="/dashboard" replace />
                        </SignedIn>
                        <SignedOut>
                            <SignUpPage />
                        </SignedOut>
                    </>
                }
            />

            {/* Protected Dashboard Route */}
            <Route
                path="/dashboard"
                element={
                    <>
                        <SignedIn>
                            <Dashboard />
                        </SignedIn>
                        <SignedOut>
                            <Navigate to="/sign-in" replace />
                        </SignedOut>
                    </>
                }
            />

            {/* Default Catch-all Redirect */}
            <Route
                path="*"
                element={
                    <>
                        <SignedIn>
                            <Navigate to="/dashboard" replace />
                        </SignedIn>
                        <SignedOut>
                            <Navigate to="/" replace />
                        </SignedOut>
                    </>
                }
            />
        </Routes>
    );
}

export default App;