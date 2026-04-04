import { useEffect, useMemo, useState, type FormEvent } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import CurriculumForm from "./components/CurriculumForm";
import CurriculumView from "./components/CurriculumView";
import Chatbot from "./components/Chatbot";
import { Curriculum } from "./types";
import { getStoredAccessEmail, setStoredAccessEmail } from "./lib/demoStorage";
import { GraduationCap, Sparkles, ArrowRight, Mail, Layers3, ShieldCheckIcon, FileBadge2 } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [accessEmail, setAccessEmail] = useState(() => getStoredAccessEmail());
  const [emailInput, setEmailInput] = useState(() => getStoredAccessEmail());
  const [emailError, setEmailError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);

  useEffect(() => {
    setStoredAccessEmail(accessEmail);
  }, [accessEmail]);

  const highlights = useMemo(
    () => [
      { icon: Layers3, label: "Curriculum engine", value: "Outcome-first" },
      { icon: ShieldCheckIcon, label: "Launch-ready structure", value: "Professional" },
      { icon: FileBadge2, label: "Export flow", value: "Markdown" },
    ],
    [],
  );

  const handleGateSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = emailInput.trim();
    const isValid = /^\S+@\S+\.\S+$/.test(trimmed);

    if (!isValid) {
      setEmailError("Enter a valid work email to continue.");
      return;
    }

    setEmailError("");
    setAccessEmail(trimmed);
    setStoredAccessEmail(trimmed);
  };

  if (!accessEmail) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(65,105,225,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(12,184,166,0.16),_transparent_24%),linear-gradient(180deg,_#09111f_0%,_#0b1324_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

        <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Private beta · AI curriculum studio
              </div>

              <h1 className="font-display text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Professional AI curriculum design
                <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-200 bg-clip-text text-transparent">
                  built for educators.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Submit your work email to enter the platform. Zegiju.T turns rough course ideas into polished learning outcomes, modules, and assessment-ready curricula.
              </p>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-300">
                {[
                  "Outcome-first structure",
                  "Clean launch-ready layout",
                  "Fast AI draft generation",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                    {item}
                  </span>
                ))}
              </div>

              <form onSubmit={handleGateSubmit} className="mt-10 max-w-xl rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
                <div className="flex flex-col gap-3 rounded-[1.35rem] border border-white/10 bg-[#08111f]/90 p-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 sm:flex-1">
                    <Mail className="h-5 w-5 text-cyan-300" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(event) => {
                        setEmailInput(event.target.value);
                        setEmailError("");
                      }}
                      placeholder="Work email address"
                      className="w-full bg-transparent text-base font-medium text-white outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition-transform hover:-translate-y-0.5"
                  >
                    Enter workspace
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {emailError ? (
                  <p className="mt-3 px-3 text-sm font-medium text-rose-300">{emailError}</p>
                ) : (
                  <p className="mt-3 px-3 text-sm text-slate-400">
                    No password required. This simply unlocks the workspace preview for now.
                  </p>
                )}
              </form>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <item.icon className="h-6 w-6 text-cyan-300" />
                    <p className="mt-5 text-sm uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.05 }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">Preview workspace</p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Curriculum Studio</h2>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                      Live preview
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      "Define audience, duration, and goals",
                      "Generate learning outcomes and modules",
                      "Refine lessons, guides, and assessments",
                    ].map((step, idx) => (
                      <div key={step} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-bold text-cyan-200">
                          0{idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{step}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-400">A cleaner, more professional flow than a typical AI prototype.</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/15 to-sky-500/10 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Structured output</p>
                      <p className="mt-2 text-2xl font-black text-white">Bloom-aligned</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/15 to-cyan-400/10 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Delivery ready</p>
                      <p className="mt-2 text-2xl font-black text-white">Exportable</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </main>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedCurriculum) {
      return (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedCurriculum(null)}
            className="text-sm font-bold text-pmo-green hover:text-pmo-dark flex items-center gap-2 mb-4 group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <CurriculumView curriculum={selectedCurriculum} />
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
      case "history":
        return <Dashboard onSelect={setSelectedCurriculum} onNew={() => setActiveTab("generate")} />;
      case "generate":
        return <CurriculumForm onSuccess={(c) => {
          setSelectedCurriculum(c);
          setActiveTab("dashboard");
        }} />;
      case "chat":
        return <Chatbot />;
      default:
        return <Dashboard onSelect={setSelectedCurriculum} onNew={() => setActiveTab("generate")} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedCurriculum(null);
      }}
      accessEmail={accessEmail}
    >
      {renderContent()}
    </Layout>
  );
}
