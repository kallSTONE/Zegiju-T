import { Curriculum, Lesson } from "../types";
import Markdown from "react-markdown";
import { BookOpen, CheckCircle2, ListChecks, FileText, ChevronRight, Sparkles, Video, HelpCircle, Download, Layers3, Target, Clock3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { generateModuleGuides } from "../lib/gemini";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { cn } from "../lib/utils";
import { upsertStoredDemoCurriculum } from "../lib/demoStorage";

interface CurriculumViewProps {
  curriculum: Curriculum;
}

export default function CurriculumView({ curriculum }: CurriculumViewProps) {
  const [currentCurriculum, setCurrentCurriculum] = useState(curriculum);
  const [loadingModules, setLoadingModules] = useState<Record<number, boolean>>({});
  const [expandedGuides, setExpandedGuides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCurrentCurriculum(curriculum);
  }, [curriculum]);

  const handleGenerateGuides = async (moduleIdx: number) => {
    if (!currentCurriculum.id) return;
    
    setLoadingModules(prev => ({ ...prev, [moduleIdx]: true }));
    try {
      const module = currentCurriculum.modules[moduleIdx];
      const result = await generateModuleGuides(module.title, module.lessons);
      
      // Update the local curriculum object
      const updatedModules = [...currentCurriculum.modules];
      updatedModules[moduleIdx] = {
        ...module,
        lessons: module.lessons.map(lesson => {
          const guide = result.lessons.find((l: any) => l.title === lesson.title);
          const updatedLesson: Lesson = { ...lesson };
          
          if (guide?.videoGuide) updatedLesson.videoGuide = guide.videoGuide;
          if (guide?.quizGuide) updatedLesson.quizGuide = guide.quizGuide;
          
          return updatedLesson;
        })
      };

      const updatedCurriculum = {
        ...currentCurriculum,
        modules: updatedModules,
      };

      setCurrentCurriculum(updatedCurriculum);

      if (currentCurriculum.id.startsWith("demo-")) {
        upsertStoredDemoCurriculum(updatedCurriculum);
      } else {
        // Save to Firestore
        const docRef = doc(db, "curricula", currentCurriculum.id);
        await updateDoc(docRef, { modules: updatedModules });
      }
    } catch (error) {
      console.error("Error generating guides:", error);
    } finally {
      setLoadingModules(prev => ({ ...prev, [moduleIdx]: false }));
    }
  };

  const toggleGuide = (lessonTitle: string) => {
    setExpandedGuides(prev => ({ ...prev, [lessonTitle]: !prev[lessonTitle] }));
  };

  const handleExport = () => {
    const content = `
# ${currentCurriculum.topic}
**Audience:** ${currentCurriculum.audience}
**Duration:** ${currentCurriculum.duration}
**Goals:** ${currentCurriculum.goals}

## Learning Outcomes
${currentCurriculum.learningOutcomes.map((o, i) => `${i + 1}. [${o.level}] ${o.outcome}`).join("\n")}

## Course Modules
${currentCurriculum.modules.map((m, i) => `
### Module ${i + 1}: ${m.title}
${m.lessons.map(l => `
#### ${l.title} (${l.duration})
${l.description}
${l.videoGuide ? `\n**Video Guide:**\n${l.videoGuide}` : ""}
${l.quizGuide ? `\n**Quiz Guide:**\n${l.quizGuide}` : ""}
`).join("\n")}
${m.assignment ? `\n**Module Assignment:** ${m.assignment}` : ""}
`).join("\n")}

## Syllabus Summary
${currentCurriculum.syllabus}
    `.trim();

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentCurriculum.topic.replace(/\s+/g, "_")}_Curriculum.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl"
      >
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-800">
                {currentCurriculum.duration}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-slate-600">
                {currentCurriculum.audience}
              </span>
              <span className="rounded-full border border-emerald-500/10 bg-emerald-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">
                {currentCurriculum.modules.length} modules
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {currentCurriculum.topic}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {currentCurriculum.goals}
            </p>
          </div>

          <div className="border-t border-slate-200/70 bg-slate-950 p-8 text-white lg:border-l lg:border-t-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">Course snapshot</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Target className="h-5 w-5 text-cyan-300" />
                <p className="mt-4 text-sm text-slate-400">Outcomes</p>
                <p className="mt-1 text-2xl font-black">{currentCurriculum.learningOutcomes.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Layers3 className="h-5 w-5 text-emerald-300" />
                <p className="mt-4 text-sm text-slate-400">Modules</p>
                <p className="mt-1 text-2xl font-black">{currentCurriculum.modules.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 col-span-2">
                <Clock3 className="h-5 w-5 text-sky-300" />
                <p className="mt-4 text-sm text-slate-400">Duration</p>
                <p className="mt-1 text-2xl font-black">{currentCurriculum.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Learning Outcomes */}
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-10">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-black text-slate-950">
              <CheckCircle2 className="w-6 h-6 text-cyan-700" />
              Learning Outcomes
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {currentCurriculum.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all group hover:border-cyan-500/20 hover:bg-cyan-500/5">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black text-cyan-700 shadow-sm transition-all group-hover:bg-slate-950 group-hover:text-white">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">
                      {outcome.level}
                    </span>
                    <p className="text-lg font-semibold leading-snug text-slate-700">{outcome.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Modules */}
          <section className="space-y-8">
            <h2 className="flex items-center gap-3 px-2 text-2xl font-black text-slate-950">
              <BookOpen className="w-6 h-6 text-cyan-700" />
              Course Modules
            </h2>
            {currentCurriculum.modules.map((module, mIdx) => (
              <motion.div 
                key={mIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mIdx * 0.1 }}
                className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 p-6 sm:p-8">
                  <h3 className="flex items-center gap-4 text-xl font-black text-slate-950 sm:text-2xl">
                    <span className="text-cyan-700">0{mIdx + 1}</span>
                    {module.title}
                  </h3>
                  <button
                    disabled={loadingModules[mIdx]}
                    onClick={() => handleGenerateGuides(mIdx)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] transition-all shadow-lg",
                      loadingModules[mIdx] 
                        ? "cursor-not-allowed bg-slate-200 text-slate-400" 
                        : "bg-slate-950 text-white shadow-slate-950/15 hover:-translate-y-0.5"
                    )}
                  >
                    {loadingModules[mIdx] ? (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                    )}
                    {loadingModules[mIdx] ? "Generating..." : "Generate Detail Guides"}
                  </button>
                </div>
                <div className="space-y-8 p-6 sm:p-8 lg:p-10">
                  {module.lessons.map((lesson, lIdx) => (
                    <div key={lIdx} className="space-y-8">
                      <div 
                        onClick={() => (lesson.videoGuide || lesson.quizGuide) && toggleGuide(lesson.title)}
                        className={cn(
                          "flex items-start gap-6 rounded-2xl border border-transparent p-6 transition-all",
                          (lesson.videoGuide || lesson.quizGuide) ? "cursor-pointer hover:border-slate-200 hover:bg-slate-50" : ""
                        )}
                      >
                        <div className="mt-2">
                          <ChevronRight className={cn("w-6 h-6 text-slate-300 transition-transform", expandedGuides[lesson.title] ? "rotate-90" : "")} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xl font-black text-slate-950">{lesson.title}</h4>
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                              {lesson.duration}
                            </span>
                          </div>
                          <p className="text-lg font-medium leading-relaxed text-slate-600">{lesson.description}</p>
                          {(lesson.videoGuide || lesson.quizGuide) && !expandedGuides[lesson.title] && (
                            <div className="flex gap-4 mt-6">
                              {lesson.videoGuide && <span className="flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-800"><Video className="w-4 h-4" /> Video Guide Ready</span>}
                              {lesson.quizGuide && <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700"><HelpCircle className="w-4 h-4" /> Quiz Ready</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedGuides[lesson.title] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="relative overflow-hidden px-6 pb-6"
                          >
                            <button 
                              onClick={() => toggleGuide(lesson.title)}
                              className="absolute right-6 top-0 p-2 text-slate-400 transition-colors hover:text-cyan-700"
                              title="Hide Details"
                            >
                              <ChevronRight className="w-5 h-5 rotate-270" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                              {lesson.videoGuide && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                  <h5 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">
                                    <Video className="w-4 h-4" />
                                    Video Content Guide
                                  </h5>
                                  <div className="prose prose-sm prose-slate max-w-none font-medium prose-p:text-slate-600 prose-headings:text-slate-950 prose-li:text-slate-600">
                                    <Markdown>{lesson.videoGuide}</Markdown>
                                  </div>
                                </div>
                              )}
                              {lesson.quizGuide && (
                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
                                  <h5 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                                    <HelpCircle className="w-4 h-4" />
                                    Quiz & Assessment
                                  </h5>
                                  <div className="prose prose-sm prose-emerald max-w-none font-medium prose-p:text-emerald-900 prose-headings:text-emerald-900 prose-li:text-emerald-900">
                                    <Markdown>{lesson.quizGuide}</Markdown>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="mt-8 flex justify-center">
                              <button 
                                onClick={() => toggleGuide(lesson.title)}
                                className="flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-2.5 text-xs font-black uppercase tracking-[0.22em] text-slate-600 transition-all hover:bg-slate-200"
                              >
                                <ChevronRight className="w-4 h-4 rotate-270" />
                                Hide Details
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  {module.assignment && (
                    <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-6">
                      <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-800">
                        <ListChecks className="w-4 h-4" />
                        Module Assignment
                      </h4>
                      <p className="font-semibold leading-relaxed text-slate-700">{module.assignment}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-10">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-black text-slate-950">
              <FileText className="w-8 h-8 text-cyan-700" />
              Syllabus Summary
            </h2>
            <div className="prose prose-sm max-w-none font-medium leading-relaxed prose-p:text-slate-600 prose-headings:text-slate-950 prose-strong:text-cyan-700">
              <Markdown>{currentCurriculum.syllabus}</Markdown>
            </div>
          </section>

          <div className="group relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-10">
            <div className="relative z-10">
              <h3 className="mb-3 text-2xl font-black tracking-tight">Ready to deploy?</h3>
              <p className="mb-8 text-sm font-medium leading-relaxed text-slate-300">Export this curriculum to Markdown or share it with your educational institution.</p>
              <button 
                onClick={handleExport}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-white py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:-translate-y-0.5"
              >
                <Download className="w-6 h-6" />
                Export Curriculum (.md)
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl transition-transform duration-700 group-hover:scale-150" />
          </div>
        </div>
      </div>
    </div>
  );
}
