import { useState, type FormEvent } from "react";
import { GraduationCap, Target, Users, Clock, Sparkles, Send, WandSparkles, Lightbulb, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { generateCurriculum } from "../lib/gemini";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { cn } from "../lib/utils";
import { Curriculum } from "../types";
import { upsertStoredDemoCurriculum } from "../lib/demoStorage";

interface CurriculumFormProps {
  onSuccess: (curriculum: Curriculum) => void;
}

export default function CurriculumForm({ onSuccess }: CurriculumFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    audience: "",
    duration: "",
    goals: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const generated = await generateCurriculum(formData);
      const curriculum: Curriculum = {
        ...generated,
        ...formData,
        userId: auth.currentUser?.uid || "demo",
        createdAt: Date.now(),
      };

      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, "curricula"), curriculum);
        onSuccess({ ...curriculum, id: docRef.id });
      } else {
        const localCurriculum = { ...curriculum, id: `demo-${Date.now()}` };
        upsertStoredDemoCurriculum(localCurriculum);
        onSuccess(localCurriculum);
      }
    } catch (error) {
      console.error("Error generating curriculum:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl"
    >
      <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="border-b border-slate-200/70 bg-slate-950 px-8 py-10 text-white lg:border-b-0 lg:border-r">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
            <WandSparkles className="h-4 w-4" />
            Curriculum builder
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-white">
            Shape a professional course in minutes.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Enter a topic, audience, duration, and goal. The system creates a clean draft you can refine immediately.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Lightbulb, title: "Outcome-first", desc: "Every draft starts with measurable learning objectives." },
              { icon: ShieldCheck, title: "Professional tone", desc: "The layout stays polished and institution-friendly." },
              { icon: Sparkles, title: "Demo ready", desc: "Works now, even before Gemini or Firebase are connected." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-800">
              AI Draft
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Editable structure
            </span>
          </div>

          <div className="border-b border-slate-100 pb-8">
            <h2 className="flex items-center gap-4 text-3xl font-black tracking-tight text-slate-950">
              <Sparkles className="w-9 h-9 text-cyan-700" />
              Create new curriculum
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Build a clean, launch-ready outline with a stronger visual hierarchy and better learning design.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                  <GraduationCap className="w-4 h-4 text-cyan-700" />
                  Course Topic
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Advanced React Patterns"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                  <Users className="w-4 h-4 text-cyan-700" />
                  Target Audience
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior frontend engineers"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                  <Clock className="w-4 h-4 text-cyan-700" />
                  Course Duration
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 8 weeks · 2 hours/week"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                  <Target className="w-4 h-4 text-cyan-700" />
                  Learning Goals
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Master state management and performance"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className={cn(
                "w-full rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-3 shadow-xl",
                loading
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "bg-slate-950 text-white hover:-translate-y-0.5 shadow-slate-950/15"
              )}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                  Generating draft...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-cyan-300" />
                  Generate curriculum
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
