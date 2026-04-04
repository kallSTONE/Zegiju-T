import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Curriculum } from "../types";
import { FileText, Calendar, Users, ChevronRight, Sparkles, Layers3, ArrowRight, Compass } from "lucide-react";
import { motion } from "motion/react";
import { getStoredDemoCurricula } from "../lib/demoStorage";

interface DashboardProps {
  onSelect: (curriculum: Curriculum) => void;
  onNew: () => void;
}

export default function Dashboard({ onSelect, onNew }: DashboardProps) {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setCurricula(getStoredDemoCurricula());
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "curricula"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Curriculum));
      setCurricula(data);
      setLoading(false);
    }, (error) => {
      console.error("Dashboard error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-pmo-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-700">
            <Sparkles className="h-4 w-4" />
            Curriculum command center
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Welcome to your AI curriculum workspace.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Draft, refine, and export structured learning experiences from a single polished workspace.
          </p>
        </div>
        <button 
          onClick={onNew}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-5 h-5 text-pmo-gold" />
          Create New
        </button>
      </div>

      {curricula.length === 0 ? (
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">No curricula yet</h3>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                Start with a polished draft. Zegiju.T will shape your topic into learning outcomes, modules, and assessment-ready lesson structures.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
                {[
                  "Bloom-aligned outcomes",
                  "Professional structure",
                  "Demo mode ready",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
              <button 
                onClick={onNew}
                className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">Preview flow</p>
                  <Compass className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { title: "Topic intake", meta: "Audience · duration · goals" },
                    { title: "AI synthesis", meta: "Outcomes · modules · syllabus" },
                    { title: "Refinement", meta: "Guides · export · delivery" },
                  ].map((step, index) => (
                    <div key={step.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/15 text-xs font-bold text-cyan-200">
                        0{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{step.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{step.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {curricula.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelect(item)}
              className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_14px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-slate-950/95 p-3 text-white shadow-lg shadow-slate-950/15">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 transition-transform group-hover:translate-x-1">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-950" />
                </div>
              </div>
              <h3 className="mt-8 text-2xl font-black tracking-tight text-slate-950 transition-colors group-hover:text-sky-700">{item.topic}</h3>
              <p className="mt-4 line-clamp-2 min-h-14 text-base leading-7 text-slate-600">{item.goals}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  <Calendar className="w-4 h-4 text-cyan-700" />
                  {item.duration}
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  <Users className="w-4 h-4 text-cyan-700" />
                  {item.audience}
                </div>
                <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 px-4 py-3 text-xs font-semibold text-cyan-800">
                  <Layers3 className="w-4 h-4" />
                  {item.modules.length} modules · {item.learningOutcomes.length} outcomes
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
