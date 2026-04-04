import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2, MessageSquareText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createChatSession, hasGeminiKey } from "../lib/gemini";
import Markdown from "react-markdown";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = createChatSession(
        "You are an expert curriculum designer and educational consultant. Your goal is to help online educators refine their course structures, learning outcomes, and syllabi. Be professional, specific, and focus on measurable learning outcomes using Bloom's Taxonomy. If the user asks for a curriculum, guide them through the process of defining their audience, goals, and duration."
      );
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      setMessages((prev) => [...prev, { role: "model", text: result.text || "" }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100/80 bg-white/70 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950">Zegiju.T AI Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                {hasGeminiKey ? "Live AI" : "Preview mode"}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="rounded-xl p-3 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-950"
          title="Clear Chat"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 space-y-8 overflow-y-auto bg-[linear-gradient(180deg,_rgba(248,250,252,0.95),_rgba(241,245,249,0.75))] p-6 sm:p-8"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col items-center justify-center space-y-6 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-700">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-950">How can I help you today?</h3>
                <p className="mx-auto mt-2 max-w-sm text-lg font-medium text-slate-500">
                  Ask me to refine outcomes, suggest module titles, or polish your syllabus into something launch-ready.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500">
                {[
                  "Improve learning outcomes",
                  "Rewrite module titles",
                  "Draft assessment prompts",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex max-w-[90%] gap-4",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className="flex-shrink-0 mt-1">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl",
                  msg.role === "user" ? "bg-slate-950 text-white" : "bg-cyan-500/10 text-cyan-700"
                )}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
              </div>
              <div className={cn(
                "rounded-3xl px-6 py-5 text-base font-medium leading-relaxed shadow-sm sm:text-[1.02rem]",
                msg.role === "user" 
                  ? "rounded-tr-none bg-slate-950 text-white" 
                  : "prose prose-slate max-w-none rounded-tl-none border border-slate-200 bg-white text-slate-800"
              )}>
                {msg.role === "model" ? (
                  <Markdown>{msg.text}</Markdown>
                ) : (
                  msg.text
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto flex gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700 mt-1">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex gap-1.5 rounded-3xl rounded-tl-none border border-slate-200 bg-white p-5 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-700 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-700 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-700" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-slate-100/80 bg-white/80 p-6 sm:p-8">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-5 pl-6 pr-20 text-base font-medium outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 sm:text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={cn(
              "absolute right-3 rounded-xl p-4 transition-all shadow-lg",
              !input.trim() || loading
                ? "bg-slate-100 text-slate-300"
                : "bg-slate-950 text-white hover:-translate-y-0.5 shadow-slate-950/15"
            )}
          >
            <Send className="w-6 h-6 text-cyan-300" />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          <MessageSquareText className="h-4 w-4 text-cyan-700" />
          {hasGeminiKey ? "Live AI responses enabled" : "Preview responses enabled until Gemini is connected"}
        </div>
      </form>
    </div>
  );
}
