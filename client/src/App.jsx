import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import "./index.css";

function App() {
    return (
        <>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn />
                </div>
            </SignedOut>

            <SignedIn>
                <Dashboard />
            </SignedIn>
        </>
    );
}

export default App;