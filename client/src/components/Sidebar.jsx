import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser, useAuth } from "@clerk/clerk-react";
import {
    Plus,
    LayoutDashboard,
    CheckSquare,
    Calendar,
    Settings,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    LogOut,
    Sparkles,
    Home,
    Layers,
    FileText,
    ExternalLink
} from "lucide-react";
import { getJobs } from "../services/api";

const cn = (...args) => args.flat().filter(Boolean).join(" ");

const getGenerationMeta = (job) => {
    const types = job?.outputTypes || [];
    if (types.includes("threatIntel")) {
        return { title: "Threat Intel Brief", char: "T", color: "#e11d48", bg: "#fff1f2", count: types.length };
    }
    if (types.includes("contractAudit")) {
        return { title: "Contract Security", char: "C", color: "#d97706", bg: "#fffbeb", count: types.length };
    }
    if (types.includes("advisory")) {
        return { title: "Security Advisory", char: "A", color: "#ea580c", bg: "#fff7ed", count: types.length };
    }
    if (types.includes("execSummary")) {
        return { title: "Executive Summary", char: "E", color: "#0ea5e9", bg: "#f0f9ff", count: types.length };
    }
    if (types.includes("presentation")) {
        return { title: "Slide Presentation", char: "P", color: "#8b5cf6", bg: "#f5f3ff", count: types.length };
    }
    if (types.includes("infographic")) {
        return { title: "Visual Infographic", char: "I", color: "#10b981", bg: "#ecfdf5", count: types.length };
    }
    if (types.includes("videoPackage")) {
        return { title: "Video Storyboard", char: "V", color: "#ec4899", bg: "#fdf2f8", count: types.length };
    }
    if (types.includes("linkedin")) {
        return { title: "LinkedIn Post", char: "L", color: "#2563eb", bg: "#eff6ff", count: types.length };
    }
    if (types.includes("twitter")) {
        return { title: "X Thread Campaign", char: "X", color: "#14b8a6", bg: "#f0fdfa", count: types.length };
    }
    return { title: "Transformation", char: "M", color: "#2f8159", bg: "#ebf6ef", count: types.length || 1 };
};

// Section eyebrow (hidden when collapsed) - exact Flowboard style
const SectionLabel = ({ children, collapsed }) =>
    collapsed ? (
        <div className="mx-auto my-2 h-px w-6 bg-[#e9e8f3]" />
    ) : (
        <p className="px-4 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9aae] select-none">
            {children}
        </p>
    );

// Nav row that adapts to collapsed/expanded - exact Flowboard style
const NavItem = ({ to, onClick, icon: Icon, label, collapsed, active, badge }) => {
    const content = (
        <div
            title={collapsed ? label : undefined}
            className={cn(
                "group relative flex h-11 items-center rounded-2xl text-sm font-medium transition-colors duration-200 cursor-pointer select-none",
                collapsed ? "mx-auto w-11 justify-center" : "gap-3 px-3",
                active
                    ? "bg-[#ebf6ef] font-semibold text-[#1d5038]"
                    : "text-[#5d5d6e] hover:bg-[#f1f0f9] hover:text-[#16161d]"
            )}
        >
            {active && !collapsed && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#2f8159]" />
            )}
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
            {!collapsed && badge != null && (
                <span className="rounded-full bg-[#16161d] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
                    {badge}
                </span>
            )}
        </div>
    );

    if (to) {
        return (
            <Link to={to} className="block w-full">
                {content}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className="w-full text-left">
            {content}
        </button>
    );
};

const Sidebar = ({ isPinned, setIsPinned, onNewDocument, onSelectJob, activeJobId, refreshTrigger }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();
    const { user } = useUser();
    const location = useLocation();

    const collapsed = !isPinned;

    useEffect(() => {
        setLoading(true);
        getJobs(getToken)
            .then((data) => setJobs(data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [getToken, refreshTrigger]);

    return (
        <aside
            className={cn(
                "fixed inset-y-3 left-3 z-40 hidden md:flex flex-col overflow-hidden rounded-3xl border border-[#e9e8f3] bg-white shadow-[0_8px_24px_rgba(28,27,64,0.06)] backdrop-blur-xl transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                collapsed ? "w-[72px]" : "w-[252px]"
            )}
        >
            {/* Header - exact Flowboard geometry */}
            <div className="flex h-16 items-center gap-2.5 px-3.5 shrink-0">
                <Link to="/" className="flex items-center gap-2.5 overflow-hidden flex-1 group">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#246646] to-[#2f8159] shadow-[0_8px_20px_rgba(36,102,70,0.25)] text-white">
                        <Sparkles className="h-5 w-5 fill-white text-white" />
                    </div>
                    {!collapsed && (
                        <span className="flex-1 truncate font-display text-[17px] font-bold tracking-tight text-[#16161d]">
                            MentosAI
                        </span>
                    )}
                </Link>

                {!collapsed && (
                    <button
                        onClick={() => setIsPinned(false)}
                        title="Collapse sidebar"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[#9a9aae] transition-colors hover:bg-[#f1f0f9] hover:text-[#16161d]"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
            </div>

            {collapsed && (
                <div className="flex justify-center pb-1">
                    <button
                        onClick={() => setIsPinned(true)}
                        title="Expand sidebar"
                        className="grid h-7 w-7 place-items-center rounded-lg text-[#9a9aae] transition-colors hover:bg-[#f1f0f9] hover:text-[#16161d]"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Menu */}
            <SectionLabel collapsed={collapsed}>Menu</SectionLabel>
            <nav className="space-y-1 px-3 shrink-0">
                <NavItem
                    to="/dashboard"
                    icon={LayoutDashboard}
                    label="Dashboard"
                    collapsed={collapsed}
                    active={location.pathname === "/dashboard"}
                />
                <NavItem
                    onClick={onNewDocument}
                    icon={Plus}
                    label="New Generation"
                    collapsed={collapsed}
                />
                <NavItem
                    to="/"
                    icon={Home}
                    label="Showcase"
                    collapsed={collapsed}
                    active={location.pathname === "/"}
                />
            </nav>

            {/* Generations / Boards Header */}
            <div className={cn("mt-2 flex h-7 items-center shrink-0", collapsed ? "justify-center" : "justify-between px-4")}>
                {!collapsed && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9aae]">
                        Generations
                    </span>
                )}
                <button
                    onClick={onNewDocument}
                    title="New generation"
                    className="rounded-md p-1 text-[#9a9aae] transition-colors hover:bg-[#f1f0f9] hover:text-[#246646]"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Generations List - styled identically to Flowboard boards */}
            <div className="mt-1 flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden px-3 pb-2 custom-scrollbar">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={cn("flex h-10 items-center gap-3", collapsed ? "justify-center" : "px-1")}>
                            <div className="h-7 w-7 shrink-0 rounded-lg bg-[#f1f0f9] animate-pulse" />
                            {!collapsed && <div className="h-3 flex-1 rounded bg-[#f1f0f9] animate-pulse" />}
                        </div>
                    ))
                ) : jobs.length === 0 ? (
                    !collapsed && <p className="px-3 py-2 text-xs text-[#9a9aae]">No generations yet</p>
                ) : (
                    jobs.slice(0, 8).map((job) => {
                        const { title, char, color, count } = getGenerationMeta(job);
                        const isActive = activeJobId === job._id;

                        return (
                            <button
                                key={job._id}
                                onClick={() => onSelectJob?.(job)}
                                title={title}
                                className={cn(
                                    "flex h-10 w-full items-center rounded-2xl text-sm transition-colors duration-200 text-left",
                                    collapsed ? "mx-auto w-10 justify-center" : "gap-3 px-2",
                                    isActive
                                        ? "bg-[#ebf6ef] font-medium text-[#1d5038]"
                                        : "text-[#5d5d6e] hover:bg-[#f1f0f9] hover:text-[#16161d]"
                                )}
                            >
                                <span
                                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg font-display text-[12px] font-bold"
                                    style={{ backgroundColor: `${color}22`, color }}
                                >
                                    {char}
                                </span>
                                {!collapsed && <span className="flex-1 truncate">{title}</span>}
                                {!collapsed && (
                                    <span className="shrink-0 pr-1 text-[10px] font-medium tabular-nums text-[#9a9aae]">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* General */}
            <SectionLabel collapsed={collapsed}>General</SectionLabel>
            <nav className="space-y-1 px-3 shrink-0">
                <NavItem
                    to="/"
                    icon={Settings}
                    label="Settings"
                    collapsed={collapsed}
                />
                <button
                    type="button"
                    onClick={() => window.open("https://github.com", "_blank")}
                    title={collapsed ? "Help & documentation" : undefined}
                    className={cn(
                        "group flex h-11 w-full items-center rounded-2xl text-sm font-medium text-[#5d5d6e] transition-colors duration-200 hover:bg-[#f1f0f9] hover:text-[#16161d]",
                        collapsed ? "mx-auto w-11 justify-center" : "gap-3 px-3"
                    )}
                >
                    <HelpCircle className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="flex-1 truncate text-left">Help & search</span>}
                </button>
            </nav>

            {/* Promo Card (expanded only) - exact Flowboard forest green card */}
            {!collapsed && (
                <div className="px-3 pt-2 shrink-0">
                    <button
                        type="button"
                        onClick={onNewDocument}
                        className="relative w-full overflow-hidden rounded-2xl p-4 text-left text-white bg-gradient-to-br from-[#1d5038] via-[#246646] to-[#2f8159] shadow-[0_10px_28px_rgba(36,102,70,0.32)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-white/15 blur-xl pointer-events-none" />
                        <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur">
                            <Sparkles className="h-4 w-4 text-white" />
                        </span>
                        <p className="relative mt-3 font-display text-sm font-semibold tracking-tight">
                            Generate with AI
                        </p>
                        <p className="relative mt-0.5 text-[11px] leading-relaxed text-white/80">
                            One source converted into 9 formats in seconds.
                        </p>
                    </button>
                </div>
            )}

            {/* User Profile Footer - exact Flowboard styling */}
            <div className="mx-3 mt-3 border-t border-[#e9e8f3] shrink-0" />
            <div className={cn("flex h-16 items-center shrink-0", collapsed ? "justify-center px-2" : "gap-3 px-3.5")}>
                <div className="shrink-0 flex items-center justify-center">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-9 h-9 rounded-xl shadow-xs",
                                card: "scale-95 origin-bottom-left shadow-2xl border border-[#e9e8f3] rounded-2xl",
                            },
                        }}
                    />
                </div>
                {!collapsed && (
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#16161d]">
                            {user?.fullName || user?.firstName || "Alex Rivera"}
                        </p>
                        <p className="truncate text-xs text-[#9a9aae]">
                            {user?.primaryEmailAddress?.emailAddress || "alex@timetoprogram.com"}
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;