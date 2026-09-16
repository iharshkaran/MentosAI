import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Hexagon, ArrowRight } from "lucide-react";

const Navbar = () => {
    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center"
        >
            <nav className="w-full max-w-5xl flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full">
                
                {/* Logo Area */}
                <div className="flex items-center gap-2.5 pl-2">
                    <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                        <Hexagon className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-zinc-900">
                        MentosAI
                    </span>
                </div>

                {/* Center Links (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-1 bg-zinc-100/50 rounded-full px-2 py-1">
                    {["Solutions", "Use Cases", "Security", "Pricing"].map((item, i) => (
                        <a 
                            key={i}
                            href={`#${item.toLowerCase()}`}
                            className="px-4 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-white rounded-full transition-all duration-300"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Auth & CTA */}
                <div className="flex items-center gap-3 pr-1">
                    <Link 
                        to="/sign-in" 
                        className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-zinc-900 px-3 transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link 
                        to="/dashboard" 
                        className="group flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        Get Started
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

            </nav>
        </motion.div>
    );
};

export default Navbar;