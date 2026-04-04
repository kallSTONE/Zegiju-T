import { useState, useEffect } from "react";
import { auth, logOut } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { LogOut, GraduationCap, LayoutDashboard, PlusCircle, History, MessageSquare, Sparkles, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accessEmail: string;
}

export default function Layout({ children, activeTab, setActiveTab, accessEmail }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "generate", label: "New Curriculum", icon: PlusCircle },
    { id: "history", label: "History", icon: History },
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.14),_transparent_24%),linear-gradient(180deg,_#eef3f8_0%,_#f7fafc_100%)] text-slate-900">
      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-80 flex-shrink-0 transition-all duration-300 z-20 bg-slate-950/95 text-white border-r border-white/10 backdrop-blur-2xl",
        isMenuOpen ? "h-screen fixed inset-0" : "h-auto md:h-screen sticky top-0"
      )}>
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950 shadow-lg shadow-cyan-950/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Zegiju.T</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">Curriculum Studio</p>
            </div>
          </div>
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <div className="px-6 pt-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-slate-950/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Workspace status</p>
                <p className="mt-1 text-sm font-semibold text-white">Private beta preview</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-slate-300">
              <Mail className="h-4 w-4 text-cyan-300" />
              <span className="truncate">{accessEmail}</span>
            </div>
          </div>
        </div>

        <nav className="px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-semibold transition-all group",
                activeTab === item.id 
                  ? "bg-white/10 text-white shadow-lg shadow-black/20 border border-white/10" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", activeTab === item.id ? "text-cyan-300" : "group-hover:text-cyan-300")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 border-t border-white/10 bg-slate-950/60">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-10 h-10 rounded-xl border border-white/10 shadow-inner bg-slate-800" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">{user.displayName || "Connected user"}</span>
                  <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                </div>
              </div>
              <button 
                onClick={logOut}
                className="w-full flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 p-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Demo mode active
              </div>
              <p className="mt-2 leading-6 text-slate-400">
                Connect Firebase later to enable live sign-in, saved curricula, and team access.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/55 border-b border-white/60 hidden md:flex items-center justify-between px-10 sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
            <span className="text-slate-900">Zegiju.T</span>
            <span className="text-slate-300">/</span>
            <span className="capitalize text-slate-600">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.24em] shadow-lg shadow-slate-950/10">
              Professional preview
            </div>
          </div>
        </header>
        <div className="p-5 md:p-10 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
