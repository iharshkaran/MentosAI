import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import "./index.css";

function App() {
    return (
        <Routes>
            {/* Public Auth Routes */}
            <Route
                path="/sign-in/*"
                element={
                    <SignedOut>
                        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
                        </div>
                    </SignedOut>
                }
            />

            <Route
                path="/sign-up/*"
                element={
                    <SignedOut>
                        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                            <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
                        </div>
                    </SignedOut>
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
                            <Navigate to="/sign-in" replace />
                        </SignedOut>
                    </>
                }
            />
        </Routes>
    );
}

export default App;