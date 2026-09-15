import { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { motion } from "motion/react";
import {
    PanelLeftClose,
    PanelLeftOpen,
    Plus,
    LayoutDashboard,
    Clock,
    Settings
} from "lucide-react";

const springTransition = {
    type: "spring",
    stiffness: 350,
    damping: 30
};

const SidebarItem = ({ icon, label, expanded, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center px-3 py-2 rounded-xl transition-colors duration-200 group relative ${active
            ? "text-teal-700 bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-white/60"
            : "text-zinc-500 hover:bg-white/60 hover:text-zinc-900 border border-transparent"
            }`}
    >
        <div className={`relative z-10 min-w-[18px] flex justify-center transition-colors duration-300 ${active ? "text-teal-600" : "text-zinc-400 group-hover:text-zinc-700"}`}>
            {icon}
        </div>

        <motion.div
            initial={false}
            animate={{
                width: expanded ? "auto" : 0,
                opacity: expanded ? 1 : 0,
                marginLeft: expanded ? 10 : 0
            }}
            transition={springTransition}
            className="overflow-hidden whitespace-nowrap text-xs font-medium text-left flex-1"
        >
            {label}
        </motion.div>
    </button>
);

const Sidebar = ({ isPinned, setIsPinned, onNewDocument }) => {
    const [isHovered, setIsHovered] = useState(false);
    const sidebarOpen = isPinned || isHovered;

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarOpen ? 220 : 60 }}
            transition={springTransition}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed left-3 top-3 bottom-3 z-50 bg-white/50 backdrop-blur-2xl border border-white/80 rounded-2xl flex flex-col overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 h-14 shrink-0">
                <div className="flex items-center overflow-hidden">
                    <div className="min-w-[28px] w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                        M
                    </div>

                    <motion.span
                        initial={false}
                        animate={{
                            width: sidebarOpen ? "auto" : 0,
                            opacity: sidebarOpen ? 1 : 0,
                            marginLeft: sidebarOpen ? 8 : 0
                        }}
                        transition={springTransition}
                        className="font-display font-bold text-zinc-900 text-sm tracking-tight whitespace-nowrap overflow-hidden"
                    >
                        MentosAI
                    </motion.span>
                </div>

                {sidebarOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={springTransition}
                        onClick={() => setIsPinned(!isPinned)}
                        className="text-zinc-400 hover:text-zinc-800 p-1 rounded-lg hover:bg-white/80 shadow-sm border border-transparent hover:border-white/60 shrink-0 ml-1"
                    >
                        {isPinned ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
                    </motion.button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto custom-scrollbar">
                <SidebarItem icon={<Plus size={16} />} label="New Generation" expanded={sidebarOpen} active={true} onClick={onNewDocument} />
                <SidebarItem icon={<LayoutDashboard size={16} />} label="Dashboard" expanded={sidebarOpen} />
                <SidebarItem icon={<Clock size={16} />} label="Recent History" expanded={sidebarOpen} />
                <div className="py-2">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent"></div>
                </div>
                <SidebarItem icon={<Settings size={16} />} label="Settings" expanded={sidebarOpen} />
            </nav>

            {/* User Profile */}
            <div className="p-1.5 mx-2 mb-2 shrink-0 rounded-xl bg-white/60 border border-white/60 flex items-center overflow-hidden cursor-pointer hover:bg-white transition-colors shadow-sm relative">
                <div className="min-w-[28px] flex items-center justify-center shrink-0">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-6 h-6 rounded-lg shadow-sm",
                                card: "scale-90 origin-bottom-left shadow-2xl border border-zinc-200/80 rounded-2xl",
                            }
                        }}
                    />
                </div>

                <motion.div
                    initial={false}
                    animate={{
                        width: sidebarOpen ? "auto" : 0,
                        opacity: sidebarOpen ? 1 : 0,
                        marginLeft: sidebarOpen ? 8 : 0
                    }}
                    transition={springTransition}
                    className="flex flex-col whitespace-nowrap overflow-hidden"
                >
                    <span className="text-[11px] font-bold text-zinc-900 leading-tight">My Account</span>
                    <span className="text-[9px] text-zinc-500 font-medium">Manage profile</span>
                </motion.div>
                
            </div>
        </motion.aside>
    );
};

export default Sidebar;