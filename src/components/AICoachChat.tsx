import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  performedSkill?: string;
}

interface AICoachChatProps {
  onExecuteSkill: (name: string, args: any) => string | null;
  activeFlareExists: boolean;
  activeFlareJoint?: string;
}

export default function AICoachChat({
  onExecuteSkill,
  activeFlareExists,
  activeFlareJoint
}: AICoachChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Microphone state
  const [isListening, setIsListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setApiError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        if (event.error !== 'no-speech') {
          setApiError(`Mic recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Seed welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Hello! I am **Gemi Coach**, your Gout Companion and AI Care Coach. 🔬

I can digest medical papers *(PubMed)* and cross-reference clinical guidelines *(Mayo Clinic)* to provide information and recommendations. I cannot modify your app data or perform actions — I only display read-only guidance from research, expert, and cooking-best-practices skills.

You can ask me questions like:
* "Summarize recent PubMed findings on dietary triggers for gout"
* "Explain best-practice cooking tips to lower purine content"
* "Provide expert guidance on handling organ meats in a gout-friendly diet"

How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // Handle Speech Recognition Trigger
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setApiError("HTML5 Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Submit Text/Voice command to API
  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();

    const textToSubmit = customText || inputText;
    if (!textToSubmit.trim() || isAnalyzing) return;

    setInputText('');
    setApiError(null);

    // Stop speech recognition if listening
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: textToSubmit,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAnalyzing(true);

    try {
      // Build history for conversational memory (limit to last 6 turns to keep it lean and fast)
      const mappedHistory = messages
        .filter((m) => m.role === 'user' || m.role === 'model')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSubmit,
          history: mappedHistory,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      const botText = data.text || '';
      const toolCalls = data.toolCalls || [];

      let skillConfirmationMessage: string | null = null;
      // Execute skill calls if returned by Gemini
      if (toolCalls && toolCalls.length > 0) {
        for (const call of toolCalls) {
          const outcome = onExecuteSkill(call.name, call.args);
          if (outcome) {
            skillConfirmationMessage = outcome;
          }
        }
      }

      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'model',
        text: botText || (skillConfirmationMessage ? `Right away: I've run that action.` : "I'm on it!"),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        performedSkill: skillConfirmationMessage || undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setApiError(err.message || 'Connection lost. Please make sure server is running and API keys are verified.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    handleSubmit(undefined, preset);
  };

  const PRESETS = [
    { label: '💧 Drink 250ml', text: 'I just drank a glass of 250ml water' },
    { label: '📈 Log UA Level', text: 'My uric acid test today was 5.6 mg/dL. Fasting draw.' },
    { label: '😴 Log 8h Good Sleep', text: 'Log 8 hours of Good sleep quality, no restless joints, meditation completed.' },
    { label: '🏃‍♂️ Walk 35 mins', text: 'Log Walking for 35 minutes, joint strain was 2, in remission phase.' },
    { label: '🚫 Joint Flare Toe', text: 'I have intense flare up pain in my Left Big Toe, pain level is 8, triggered by seafood' },
    { label: '🥛 Check Probiotics', text: 'Analyze traditional low-fat yogurt with Lactobacillus bulgaricus and Streptococcus thermophilus starters' },
    { label: '🍋 Watch Unsweetened Lemon', text: 'Add Unsweetened Lemon Juice under Beverage category, frequency is Daily' },
    { label: '💫 Flare Cleared', text: 'My joint is healed! Please resolve my active flare' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px] font-sans" id="ai_voice_coach_panel">
      
      {/* Header Banner */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10 relative">
            <Sparkles size={18} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 leading-tight">
              Gemi Coach
              <span className="bg-indigo-150 text-indigo-700 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border border-indigo-200">
                READ-ONLY CHATBOT
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Empathetic Clinical Rheumatology Guide & App Skills Integration</p>
          </div>
        </div>
      </div>

      {/* Main Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/20" id="chat_scroll_area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm shadow-slate-100/30'
              }`}
            >
              {/* Parse nested bold and bullets inside simple text since we do not have full react-markdown here */}
              <div className="whitespace-pre-wrap select-text selection:bg-indigo-250">
                {msg.text.split('\n').map((line, idx) => {
                  let formatted = line;
                  // Handle simple bold **text**
                  const boldRegex = /\*\*([^*]+)\*\*/g;
                  let match;
                  const parts: React.ReactNode[] = [];
                  let lastIndex = 0;

                  while ((match = boldRegex.exec(line)) !== null) {
                    if (match.index > lastIndex) {
                      parts.push(line.substring(lastIndex, match.index));
                    }
                    parts.push(<strong key={match.index} className="font-bold text-slate-900 text-[12px]">{match[1]}</strong>);
                    lastIndex = boldRegex.lastIndex;
                  }
                  if (lastIndex < line.length) {
                    parts.push(line.substring(lastIndex));
                  }

                  // Fallback to text if no bold matches
                  const content = parts.length > 0 ? parts : line;

                  return (
                    <div key={idx} className={line.startsWith('*') ? 'pl-4 py-0.5' : 'py-0.5'}>
                      {line.startsWith('*') ? (
                        <span className="flex items-start">
                          <span className="mr-1.5 text-indigo-500">•</span>
                          <span>{line.substring(1).trim()}</span>
                        </span>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* If skill was executed, show a glorious confirmation card underneath */}
            {msg.performedSkill && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3 w-full text-[11px] text-emerald-800 flex items-start gap-2.5 shadow-sm"
              >
                <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[9px] text-emerald-600 block mb-0.5">
                    Gout Care Skill Executed ✓
                  </span>
                  <p className="font-medium text-emerald-700 leading-snug">{msg.performedSkill}</p>
                </div>
              </motion.div>
            )}

            <span className="text-[10px] text-slate-400 mt-1 px-1 font-semibold">{msg.timestamp}</span>
          </div>
        ))}

        {/* Loading/Thinking State */}
        {isAnalyzing && (
          <div className="flex flex-col items-start max-w-[85%] mr-auto">
            <div className="bg-white text-slate-800 border border-slate-150 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <Loader className="text-indigo-600 animate-spin" size={16} />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700">Gemi Coach is analyzing metabolics...</p>
                <p className="text-[10px] text-slate-400">Cross-referencing PubMed clearance studies</p>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Preset Recommendation Chips */}
      <div className="bg-slate-50 border-t border-slate-150/60 p-3 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
        {PRESETS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetClick(chip.text)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm cursor-pointer transition select-none shrink-0"
          >
            <Sparkles size={11} className="text-indigo-400" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Mic / Form controls */}
      <div className="p-4 border-t border-slate-150 bg-white">
        <form onSubmit={(e) => handleSubmit(e)} className="flex items-center gap-2">
          {/* Voice to text Mic trigger */}
          <button
            type="button"
            onClick={toggleListening}
            className={`h-11 w-11 rounded-xl flex items-center justify-center border text-white transition duration-150 relative cursor-pointer select-none shrink-0 shadow-md ${
              isListening
                ? 'bg-rose-500 border-rose-400 hover:bg-rose-600 animate-pulse ring-4 ring-rose-100'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title={isListening ? "Listening... click to send" : "Speak with Gemini Voice Recognition"}
            id="mic_trigger_btn"
          >
            {isListening ? <Mic size={18} className="animate-bounce" /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening carefully... speak now" : "Instruct Gemi Coach to log or ask diet questions..."}
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs font-semibold rounded-xl px-4 h-11 outline-none transition"
            id="chat_text_input"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isAnalyzing}
            className="h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
            id="chat_send_btn"
          >
            <Send size={16} />
          </button>
        </form>

        {apiError && (
          <div className="mt-3 text-[11px] leading-relaxed font-semibold text-rose-600 bg-rose-50 border border-rose-150 rounded-xl p-2.5 flex items-start gap-2 animate-in fade-in zoom-in-95 duration-150">
            <span className="font-bold">⚠️ Warning:</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* Scientific disclaimer badge */}
        <p className="text-[9px] text-slate-400 mt-3 text-center leading-relaxed">
          Gemi Coach parses peer-reviewed studies *(PubMed, PubMed 2024)* to log guidelines, not replacement values for direct rheumatologist consulting.
        </p>
      </div>

    </div>
  );
}
