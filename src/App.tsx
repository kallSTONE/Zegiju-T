import { useEffect, useMemo, useState, type FormEvent } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import CurriculumForm from "./components/CurriculumForm";
import CurriculumView from "./components/CurriculumView";
import Chatbot from "./components/Chatbot";
import { Curriculum } from "./types";
import { getStoredAccessEmail, setStoredAccessEmail } from "./lib/demoStorage";
import { GraduationCap, Sparkles, ArrowRight, Mail, Layers3, ShieldCheckIcon, FileBadge2, BookOpenCheck, Globe, PhoneCall } from "lucide-react";
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
      <div className="min-h-screen bg-[#07111f] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(65,105,225,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(12,184,166,0.16),_transparent_24%),linear-gradient(180deg,_#09111f_0%,_#0b1324_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-8">
          <header className="sticky top-0 z-20 mt-4 rounded-2xl border border-white/10 bg-[#081120]/85 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a href="#home" className="flex items-center gap-2 text-white">
                <GraduationCap className="h-5 w-5 text-cyan-300" />
                <span className="text-lg font-black tracking-tight">Zegiju.T</span>
              </a>
              <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 sm:justify-end">
                {[
                  { href: "#home", label: "Home" },
                  { href: "#features", label: "Features" },
                  { href: "#how-it-helps", label: "How It Helps" },
                  { href: "#for-educators", label: "For Educators" },
                  { href: "#access", label: "Access" },
                  { href: "#contact", label: "Contact" },
                ].map((item) => (
                  <a key={item.href} href={item.href} className="rounded-full border border-white/10 px-3 py-1.5 transition-colors hover:border-cyan-300/60 hover:text-white">
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </header>

          <main id="home" className="pt-10">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  Online education, redesigned with AI
                </div>

                <h1 className="font-display text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Build stronger online programs
                  <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-200 bg-clip-text text-transparent">
                    from planning to delivery.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  Zegiju.T helps schools, trainers, and independent educators create modern digital curricula with clear outcomes, practical modules, and export-ready learning assets.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                  {["Faster course creation", "Consistent learning quality", "Built for online-first classrooms"].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#access" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition-transform hover:-translate-y-0.5">
                    Enter workspace
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#how-it-helps" className="inline-flex items-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                    Explore how it works
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
                <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">Why online education teams choose Zegiju.T</p>
                  <div className="mt-5 space-y-4">
                    {[
                      "Turn ideas into structured courses quickly",
                      "Keep outcomes and assessments aligned",
                      "Share a polished curriculum with your team",
                    ].map((item, idx) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-bold text-cyan-200">0{idx + 1}</span>
                        <p className="text-sm leading-6 text-slate-200">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            <section id="features" className="pt-20">
              <h2 className="text-3xl font-black text-white sm:text-4xl">Core Features</h2>
              <p className="mt-3 max-w-3xl text-slate-300">
                Everything is focused on helping online educators design, review, and launch curriculum faster without sacrificing quality.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <item.icon className="h-6 w-6 text-cyan-300" />
                    <p className="mt-5 text-sm uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="how-it-helps" className="pt-20">
              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
                  <BookOpenCheck className="h-7 w-7 text-cyan-300" />
                  <h3 className="mt-4 text-2xl font-black text-white">For curriculum teams</h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    Build consistent modules across multiple courses, reduce planning time, and maintain clear standards for outcomes and evaluations.
                  </p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
                  <Globe className="h-7 w-7 text-emerald-300" />
                  <h3 className="mt-4 text-2xl font-black text-white">For online delivery</h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    Prepare content that works for remote cohorts, self-paced learners, and blended formats while staying learner-focused.
                  </p>
                </article>
              </div>
            </section>

            <section id="for-educators" className="pt-20">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-emerald-500/10 p-8">
                <h2 className="text-3xl font-black text-white sm:text-4xl">Designed For Modern Educators</h2>
                <p className="mt-4 max-w-3xl text-slate-200 leading-7">
                  Whether you run a school, bootcamp, training center, or independent academy, Zegiju.T helps you move from rough ideas to full course structure with less admin overhead.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Audience clarity</p>
                    <p className="mt-2 text-2xl font-black text-white">Beginner to pro</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Format flexibility</p>
                    <p className="mt-2 text-2xl font-black text-white">Live + async</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Output quality</p>
                    <p className="mt-2 text-2xl font-black text-white">Professional docs</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="access" className="pt-20">
              <h2 className="text-3xl font-black text-white sm:text-4xl">Enter The Workspace</h2>
              <p className="mt-3 max-w-3xl text-slate-300">
                Use your email to unlock the curriculum studio preview.
              </p>
              <form onSubmit={handleGateSubmit} className="mt-8 max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
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
                    No password required. This unlocks the current platform preview.
                  </p>
                )}
              </form>
            </section>

            <section id="contact" className="pt-20">
              <h2 className="text-3xl font-black text-white sm:text-4xl">Contact</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a href="mailto:hello@zegiju.t" className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200 transition-colors hover:border-cyan-300/60">
                  <Mail className="h-5 w-5 text-cyan-300" />
                  <p className="mt-3 font-semibold text-white">Email</p>
                  <p className="mt-1 text-sm">hello@zegiju.t</p>
                </a>
                <a href="tel:+12025550111" className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200 transition-colors hover:border-cyan-300/60">
                  <PhoneCall className="h-5 w-5 text-emerald-300" />
                  <p className="mt-3 font-semibold text-white">Phone</p>
                  <p className="mt-1 text-sm">+1 (202) 555-0111</p>
                </a>
                <a href="https://earn-neway.vercel.app" target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200 transition-colors hover:border-cyan-300/60">
                  <Globe className="h-5 w-5 text-cyan-300" />
                  <p className="mt-3 font-semibold text-white">Parent Company (Edu)</p>
                  <p className="mt-1 text-sm">earn-neway.vercel.app</p>
                </a>
              </div>
            </section>
          </main>

          <footer className="mt-20 rounded-3xl border border-white/10 bg-[#081120]/90 p-8 text-slate-300">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-xl font-black text-white">Zegiju.T</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  AI curriculum studio for high-quality online education programs.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Sections</p>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  {[
                    { href: "#home", label: "Home" },
                    { href: "#features", label: "Features" },
                    { href: "#how-it-helps", label: "How It Helps" },
                    { href: "#for-educators", label: "For Educators" },
                    { href: "#access", label: "Access" },
                    { href: "#contact", label: "Contact" },
                  ].map((item) => (
                    <a key={item.href} href={item.href} className="hover:text-white">
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Links</p>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <a href="https://earn-neway.vercel.app" target="_blank" rel="noreferrer" className="hover:text-white">Parent Company (Edu)</a>
                  <a href="mailto:hello@zegiju.t" className="hover:text-white">hello@zegiju.t</a>
                  <a href="tel:+12025550111" className="hover:text-white">+1 (202) 555-0111</a>
                </div>
              </div>
            </div>
            <p className="mt-8 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.2em] text-slate-500">
              Zegiju.T \u00b7 Built for modern online education teams
            </p>
          </footer>
        </div>
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
