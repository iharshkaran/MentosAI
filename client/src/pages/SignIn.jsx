import { SignIn } from "@clerk/clerk-react";
import { Hexagon, ShieldAlert } from "lucide-react";

const SignInPage = () => {
    return (
        <div className="min-h-screen bg-[#F4F3EF] text-zinc-900 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
            
            {/* Background Grid Texture */}
            <div 
                className="absolute inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #d4d4d8 1px, transparent 1px),
                        linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)
                    `,
                    backgroundSize: '2.5rem 2.5rem',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)'
                }}
            />

            {/* Top Branding Header */}
            <div className="relative z-10 flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center shadow-md">
                    <Hexagon className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-zinc-900">
                    MentosAI
                </span>
            </div>

            {/* Sign-In Component with Path Routing */}
            <div className="relative z-10 w-full max-w-md flex justify-center">
                <SignIn 
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    forceRedirectUrl="/dashboard"
                    appearance={{
                        variables: {
                            colorPrimary: '#18181b',
                            colorBackground: '#ffffff',
                            colorText: '#18181b',
                            colorInputBackground: '#fafafa',
                            colorInputText: '#18181b',
                            borderRadius: '1rem',
                            fontFamily: 'inherit',
                        },
                        elements: {
                            card: "bg-white/90 border border-zinc-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-2xl rounded-[2.5rem] p-4 md:p-6 w-full",
                            headerTitle: "text-zinc-900 font-serif font-medium text-2xl tracking-tight text-center",
                            headerSubtitle: "text-zinc-500 text-xs text-center mt-1",
                            socialButtonsBlockButton: "border border-zinc-200 hover:bg-zinc-50/80 transition-all rounded-xl py-2.5 font-medium text-zinc-700 shadow-sm",
                            socialButtonsBlockButtonText: "font-medium text-sm",
                            dividerLine: "bg-zinc-200",
                            dividerText: "text-zinc-400 text-xs uppercase tracking-wider font-semibold",
                            formFieldLabel: "text-zinc-700 font-medium text-xs uppercase tracking-wider",
                            formFieldInput: "rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 bg-zinc-50/50 py-3 text-sm transition-all",
                            formButtonPrimary: "bg-zinc-900 hover:bg-zinc-800 text-white transition-all rounded-xl py-3.5 shadow-lg shadow-zinc-900/10 font-medium text-sm mt-2",
                            footerActionLink: "text-zinc-900 font-semibold hover:underline",
                            footer: "hidden",
                        }
                    }}
                />
            </div>

            <div className="relative z-10 mt-6 text-center text-xs text-zinc-400 font-medium">
                Secured with enterprise-grade authentication • SIH 2026
            </div>
        </div>
    );
};

export default SignInPage;