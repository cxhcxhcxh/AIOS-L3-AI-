
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  BarChart, 
  School, 
  UploadCloud, 
  FileText, 
  Download, 
  ChevronDown, 
  MessageSquare, 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Layout, 
  Cpu, 
  Trash2, 
  Eye, 
  Plus, 
  Layers, 
  Zap, 
  Activity, 
  FileCheck, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  MoreHorizontal, 
  Maximize2, 
  TrendingUp, 
  Award, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Edit3, 
  Loader2, 
  GripVertical, 
  Compass, 
  Trello, 
  ShieldCheck, 
  Target, 
  Wand2, 
  Binary, 
  GitBranch, 
  Table as TableIcon, 
  MousePointer2, 
  EyeIcon, 
  Mic2, 
  Search, 
  Move,
  Monitor,
  Maximize,
  Clock,
  Users
} from 'lucide-react';
import { INITIAL_UNIVERSITIES, INITIAL_TIMELINE, INITIAL_TOTAL_BUDGET, ENTERPRISE_PERCENT, GOVERNMENT_PERCENT } from './constants';
import { UniversityData, TimelineNode } from './types';

// --- Utils ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const HighlightText = ({ children }: { children?: React.ReactNode }) => (
  <span className="bg-blue-500/20 text-blue-400 px-1 rounded border border-blue-500/30 font-bold">
    {children}
  </span>
);

// --- Gemini Service Integration ---
const GeminiChatWidget = ({ isOpen, setIsOpen, autoPrompt, universities }: { isOpen: boolean, setIsOpen: (v: boolean) => void, autoPrompt: string, universities: UniversityData[] }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedPromptRef = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateResponse = async (userMsg: string) => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `你是一个专业的项目评审专家，正在协助用户分析'智己AIOS 2025~2026年度校企共创专项方案'。
以下是本次参与评审的四个高校方案当前详细数据：

${universities.map(u => `
=== ${u.name} (${u.abbr}) ===
[核心概念]
${u.concept}
[优势]
${u.pros.join('; ')}
[方案摘要]
${u.summary}
`).join('\n')}

你的回答需要专业、客观，侧重于技术落地与投资价值分析。`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const text = response.text || "抱歉，我暂时无法回答这个问题。";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "API 连接错误或配额超限，请稍后重试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    await generateResponse(userMsg);
  };

  useEffect(() => {
    if (autoPrompt && autoPrompt !== processedPromptRef.current && isOpen) {
      processedPromptRef.current = autoPrompt;
      setMessages(prev => [...prev, { role: 'user', text: autoPrompt }]);
      generateResponse(autoPrompt);
    }
  }, [autoPrompt, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-neutral-900 border border-neutral-700 w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-neutral-800 p-4 border-b border-neutral-700 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" /> 
              Gemini 决策顾问
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-neutral-500 text-sm text-center mt-10 px-4">
                请就方案的投资优先级、技术风险或跨校组合向我提问。
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-200'
                }`}>
                  {m.role === 'model' ? (
                     <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{__html: m.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}} />
                  ) : m.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-neutral-500 text-xs ml-2 animate-pulse flex items-center gap-2"><Sparkles className="w-3 h-3"/> 深度解析中...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-neutral-800 border-t border-neutral-700 flex gap-2">
            <input 
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="询问投资组合建议..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:hidden" />
        <Sparkles className="w-6 h-6 hidden group-hover:block" />
      </button>
    </div>
  );
};

// --- Sub-Components ---

const Navigation = ({ universities }: { universities: UniversityData[] }) => (
  <nav className="fixed top-0 left-0 w-full z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 h-16 flex items-center justify-between px-10 shadow-lg">
    <div className="text-xl font-bold text-white tracking-wider flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('overview')}>
      <span className="w-2 h-6 bg-blue-500 rounded-sm"></span>
      <div className="flex flex-col leading-none">
        <span className="tracking-widest">IM MOTORS</span>
        <span className="text-neutral-500 text-[10px] font-normal tracking-normal mt-0.5">2025~2026 校企共创报告</span>
      </div>
    </div>
    <div className="flex gap-10 text-base font-medium text-neutral-400">
      {['概览', '项目背景', '金融方案', '深度分析', '汇总'].map((item, i) => {
        const id = ['overview', 'background', 'finance', 'schools', 'summary'][i];
        return (
          <button 
            key={id}
            onClick={() => scrollToSection(id)}
            className="hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-500 py-2"
          >
            {item}
          </button>
        )
      })}
    </div>
  </nav>
);

const SchoolSidebar = ({ universities }: { universities: UniversityData[] }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`fixed left-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="bg-neutral-900/90 backdrop-blur-md border-r border-y border-neutral-700 rounded-r-2xl p-4 shadow-2xl relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-8 top-1/2 -translate-y-1/2 bg-neutral-800 border border-l-0 border-neutral-700 p-1.5 rounded-r-lg text-neutral-400 hover:text-white"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-6">
          {universities.map(u => (
            <button 
              key={u.id} 
              onClick={() => scrollToSection(`${u.id}-content`)}
              className="group flex items-center gap-3 relative"
              title={u.name}
            >
              <div className={`w-10 h-10 rounded-lg ${u.themeColor} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                {u.logoLetter}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const SectionContainer = ({ id, children, className = "", isLast = false }: { id: string; children?: React.ReactNode; className?: string; isLast?: boolean }) => (
  <section id={id} className={`snap-section w-full h-screen flex flex-col justify-start px-4 md:px-12 pt-16 pb-4 overflow-hidden ${className}`}>
    <div className="w-full h-full flex flex-col max-w-[1920px] mx-auto relative px-6">
      {children}
      {isLast && (
        <div className="absolute bottom-4 left-0 w-full flex justify-center pointer-events-none">
           <p className="text-neutral-500 font-mono text-[12px] tracking-[0.5em] uppercase font-bold">
              CONFIDENTIAL - INTERNAL USE ONLY 智己软件 陈晓华
           </p>
        </div>
      )}
    </div>
  </section>
);

// --- Asset Image Manager ---
const ImageWall = ({ uni, onUpdate }: { uni: UniversityData, onUpdate: (u: UniversityData) => void }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const newImages = files.map(f => ({ label: f.name, url: URL.createObjectURL(f) }));
      onUpdate({
        ...uni,
        assets: {
          ...uni.assets,
          images: [...uni.assets.images, ...newImages]
        }
      });
    }
  };

  const removeImage = (idx: number) => {
    const newImages = [...uni.assets.images];
    newImages.splice(idx, 1);
    onUpdate({ ...uni, assets: { ...uni.assets, images: newImages } });
  };

  const moveImage = (from: number, to: number) => {
    const newImages = [...uni.assets.images];
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    onUpdate({ ...uni, assets: { ...uni.assets, images: newImages } });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      onUpdate({
        ...uni,
        assets: {
          ...uni.assets,
          pdf: { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)}MB`, url: URL.createObjectURL(file) }
        }
      });
    }
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setScale(1);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-black text-white flex items-center gap-3">
          <Layers className="text-blue-500 w-7 h-7" /> 
          视觉方案墙 <span className="bg-neutral-800 text-[10px] px-2 py-0.5 rounded-full text-neutral-400 ml-2 border border-neutral-700">{uni.abbr}</span>
        </h4>
        <div className="flex gap-4">
          <label className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-black cursor-pointer flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
            <Plus className="w-5 h-5" /> 上传图片
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          <label className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-5 py-2.5 rounded-xl text-sm font-black cursor-pointer flex items-center gap-2 transition-all active:scale-95 border border-neutral-700 shadow-xl">
            <FileText className="w-5 h-5" /> {uni.assets.pdf ? '更新 PDF' : '上传 PDF'}
            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-3 gap-6 pb-6 pr-2">
        {uni.assets.images.map((img, i) => (
          <div 
            key={i} 
            className="group relative aspect-video bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', i.toString())}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = parseInt(e.dataTransfer.getData('text/plain'));
              moveImage(from, i);
            }}
          >
            <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button onClick={() => setPreviewUrl(img.url)} className="p-3 bg-blue-600 rounded-2xl text-white hover:scale-110 transition-transform shadow-xl"><Maximize className="w-5 h-5" /></button>
              <button onClick={() => removeImage(i)} className="p-3 bg-rose-600 rounded-2xl text-white hover:scale-110 transition-transform shadow-xl"><Trash2 className="w-5 h-5" /></button>
              <div className="cursor-move p-3 bg-neutral-700 rounded-2xl text-white hover:scale-110 transition-transform shadow-xl"><GripVertical className="w-5 h-5" /></div>
            </div>
            <div className="absolute bottom-4 left-4 bg-neutral-900/90 backdrop-blur-xl px-3 py-1.5 rounded-xl text-xs text-neutral-200 font-mono border border-white/5">
              #{i+1} {img.label.slice(0, 20)}
            </div>
          </div>
        ))}
        {uni.assets.images.length === 0 && (
          <div className="col-span-3 h-full min-h-[400px] border-2 border-dashed border-neutral-800 rounded-[3rem] flex flex-col items-center justify-center text-neutral-600">
            <UploadCloud className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-xl font-light">暂无视觉资产，点击上方按钮上传</p>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="relative w-full h-full flex items-center justify-center p-20" onClick={closePreview}>
            <div className="absolute top-10 right-10 flex gap-4 z-10" onClick={e => e.stopPropagation()}>
               <button onClick={() => setScale(s => Math.min(s + 0.2, 5))} className="p-4 bg-neutral-800 rounded-2xl text-white hover:bg-neutral-700 transition-colors"><ZoomIn className="w-6 h-6"/></button>
               <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-4 bg-neutral-800 rounded-2xl text-white hover:bg-neutral-700 transition-colors"><ZoomOut className="w-6 h-6"/></button>
               <button onClick={closePreview} className="p-4 bg-rose-600 rounded-2xl text-white hover:bg-rose-500 transition-colors"><X className="w-6 h-6"/></button>
            </div>
            <img 
              src={previewUrl} 
              className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-transform duration-200" 
              style={{ transform: `scale(${scale})` }}
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [universities, setUniversities] = useState<UniversityData[]>(() => {
    const saved = localStorage.getItem('im-motors-universities');
    return saved ? JSON.parse(saved) : INITIAL_UNIVERSITIES;
  });

  const [totalBudget, setTotalBudget] = useState<number>(() => {
    const saved = localStorage.getItem('im-motors-budget');
    return saved ? Number(saved) : INITIAL_TOTAL_BUDGET;
  });

  const [timeline, setTimeline] = useState<TimelineNode[]>(() => {
    const saved = localStorage.getItem('im-motors-timeline');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatAutoPrompt, setChatAutoPrompt] = useState('');

  useEffect(() => {
    localStorage.setItem('im-motors-universities', JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('im-motors-budget', totalBudget.toString());
  }, [totalBudget]);

  const updateUniversity = (newUni: UniversityData) => {
    setUniversities(prev => prev.map(u => u.id === newUni.id ? newUni : u));
  };

  const enterpriseAmount = Math.round(totalBudget * (ENTERPRISE_PERCENT / 100));
  const governmentAmount = totalBudget - enterpriseAmount;

  return (
    <div className="snap-container no-scrollbar bg-[#050505] font-sans selection:bg-blue-500/30 text-neutral-100">
      <Navigation universities={universities} />
      <SchoolSidebar universities={universities} />
      
      {/* 1. Overview */}
      <SectionContainer id="overview" className="bg-gradient-to-br from-neutral-900 via-[#050505] to-[#0a0a0a]">
        <div className="relative z-10 max-w-[1400px] mx-auto text-center flex flex-col items-center justify-center h-full">
          <div className="inline-flex items-center gap-4 px-8 py-3 mb-10 border border-blue-500/30 rounded-full bg-blue-900/10 backdrop-blur-md">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-lg tracking-[0.3em] font-mono uppercase font-black">Internal / 2025~2026 Strategy Analysis</span>
          </div>
          <h1 className="text-[6rem] md:text-[8rem] font-bold tracking-tighter text-white mb-8 leading-none select-none">
            智己<span className="text-neutral-700 mx-10 font-thin">/</span>共创
          </h1>
          <div className="text-3xl md:text-5xl font-light text-neutral-300 mb-20 tracking-tight">
            2025~2026 校企共创方案<span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 mx-6">深度分析报告</span>
          </div>
          
          <div className="grid grid-cols-4 gap-16 w-full max-w-6xl border-t border-neutral-800 pt-16">
            {[
              { label: '入围高校', val: universities.length, unit: '所' },
              { label: '核心指标', val: '12', unit: '项' },
              { label: '预算池', val: (totalBudget / 10000).toFixed(0), unit: '万' },
              { label: '项目周期', val: '18', unit: '月' }
            ].map((stat, i) => (
              <div key={i} className="text-center group scale-125">
                <div className="text-6xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {stat.val}<span className="text-2xl ml-2 text-neutral-600 font-normal">{stat.unit}</span>
                </div>
                <div className="text-sm text-neutral-500 font-black uppercase tracking-[0.3em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* 2. Background */}
      <SectionContainer id="background">
        <div className="h-full flex flex-col justify-center max-h-[90vh]">
          <h2 className="text-5xl font-bold mb-10 text-white flex items-center gap-6">
            <span className="text-blue-500 font-mono text-3xl border-b-4 border-blue-500 pb-2">01.</span>
            项目背景与现有技术基座
          </h2>
          <div className="grid grid-cols-12 gap-8 items-stretch flex-1 overflow-hidden">
             <div className="col-span-5 flex flex-col gap-6">
                <div className="bg-neutral-900/60 p-10 rounded-[2.5rem] border border-neutral-800 flex flex-col shadow-xl group hover:border-rose-500/50 transition-all flex-1">
                  <AlertCircle className="text-rose-500 w-12 h-12 mb-6" />
                  <h3 className="text-3xl font-black text-white mb-4">核心痛点</h3>
                  <p className="text-neutral-400 text-2xl leading-relaxed font-light">
                    L3级自动驾驶中，线控转向失去物理连接，导致“数字路感”缺失，驾驶员面临<HighlightText>强烈的操控心理脱节与信任隔阂</HighlightText>。
                  </p>
                </div>
                <div className="bg-neutral-900/60 p-10 rounded-[2.5rem] border border-neutral-800 flex flex-col shadow-xl group hover:border-emerald-500/50 transition-all flex-1">
                  <ShieldCheck className="text-emerald-500 w-12 h-12 mb-6" />
                  <h3 className="text-3xl font-black text-white mb-4">合规要求</h3>
                  <p className="text-neutral-400 text-2xl leading-relaxed font-light">
                    <HighlightText>需满足国家自然科学基金基础研究深度</HighlightText>，并适配智己量产车型交付规范。
                  </p>
                </div>
             </div>

             <div className="col-span-7 bg-gradient-to-br from-blue-900/20 to-neutral-900/40 p-12 rounded-[4rem] border border-blue-500/30 flex flex-col shadow-2xl relative overflow-hidden group">
                <Cpu className="absolute -right-10 -bottom-10 opacity-10 w-96 h-96 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-6 mb-12">
                   <div className="bg-blue-600 p-5 rounded-3xl">
                      <Binary className="text-white w-12 h-12" />
                   </div>
                   <h3 className="text-5xl font-black text-blue-400 tracking-tight">现有技术基座支撑</h3>
                </div>
                <div className="space-y-12 relative z-10 flex-1">
                   <div className="grid grid-cols-1 gap-10">
                      <div className="flex items-center gap-6 text-white text-3xl font-black">
                         <Zap className="w-8 h-8 text-blue-400" /> 恒星超级增程 <span className="text-neutral-500 font-normal text-xl">（动力架构）</span>
                      </div>
                      <div className="flex items-center gap-6 text-white text-3xl font-black">
                         <Layers className="w-8 h-8 text-blue-400" /> 灵蜥数字底盘 3.0 <span className="text-neutral-500 font-normal text-xl">（线控制动）</span>
                      </div>
                      <div className="flex items-center gap-6 text-white text-3xl font-black">
                         <Monitor className="w-8 h-8 text-blue-400" /> AIOS 座舱系统 <span className="text-neutral-500 font-normal text-xl">（交互中枢）</span>
                      </div>
                   </div>
                   <div className="pt-12 border-t border-neutral-800 mt-6">
                      <h4 className="flex items-center gap-4 text-emerald-400 text-3xl font-black mb-4">
                        <Monitor className="w-10 h-10" /> 基于智舱AIOS屏幕布局研究
                      </h4>
                      <p className="text-neutral-400 text-2xl leading-relaxed font-light">
                        针对智己汽车LS6和LS9的双屏布局进行适配，确保交付物具备较高可落地性。
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </SectionContainer>

      {/* 3. Finance & Timeline */}
      <SectionContainer id="finance">
        <div className="h-full flex flex-col justify-center max-h-[90vh]">
          <div className="flex items-center justify-between mb-10 border-b border-neutral-800 pb-6">
            <h2 className="text-5xl font-bold text-white flex items-center gap-6">
              <span className="text-emerald-500 mr-2 font-mono text-3xl">02.</span>
              金融方案与执行周期
            </h2>
            <div className="text-right flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Total Project Budget (Editable)</span>
                <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 rounded-2xl px-4 py-2 hover:border-emerald-500 transition-all shadow-inner">
                  <Edit3 className="w-4 h-4 text-neutral-500" />
                  <input 
                    type="number" 
                    value={totalBudget} 
                    onChange={e => setTotalBudget(Number(e.target.value))}
                    className="bg-transparent border-none text-emerald-400 font-mono text-3xl font-black outline-none w-48 text-right"
                  />
                  <span className="text-emerald-900 font-bold ml-1">¥</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 flex-1 overflow-hidden">
            <div className="bg-neutral-900/50 rounded-[3rem] p-12 border border-neutral-800 flex flex-col justify-center shadow-2xl h-full">
                 <h3 className="text-3xl font-black text-neutral-300 mb-10 uppercase tracking-widest flex items-center gap-4">
                   <Layers className="w-8 h-8 text-blue-500"/> 资金分摊模型
                 </h3>
                 <div className="flex gap-3 h-24 mb-12">
                    <div className="h-full bg-blue-600 rounded-l-[1.5rem] flex flex-col items-center justify-center shadow-lg shadow-blue-900/20" style={{width: `${ENTERPRISE_PERCENT}%`}}>
                       <span className="text-3xl font-black text-white">{ENTERPRISE_PERCENT.toFixed(2)}%</span>
                       <span className="text-[10px] text-white/70 font-bold">企业自筹资金</span>
                    </div>
                    <div className="h-full bg-emerald-500 rounded-r-[1.5rem] flex flex-col items-center justify-center shadow-lg shadow-emerald-900/20" style={{width: `${GOVERNMENT_PERCENT}%`}}>
                       <span className="text-3xl font-black text-neutral-900">{GOVERNMENT_PERCENT.toFixed(2)}%</span>
                       <span className="text-[10px] text-neutral-900/70 font-bold">政府专项补贴</span>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-8 rounded-[2rem] bg-neutral-950 border border-neutral-800 group transition-all hover:bg-neutral-900">
                        <span className="text-neutral-400 font-black text-xl tracking-wider">智己汽车预算投入</span>
                        <div className="text-blue-400 font-mono text-4xl font-black tracking-tighter">¥{enterpriseAmount.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center justify-between p-8 rounded-[2rem] bg-neutral-950 border border-neutral-800 group transition-all hover:bg-neutral-900">
                        <span className="text-neutral-400 font-black text-xl tracking-wider">自然基金专项配额</span>
                        <div className="text-emerald-400 font-mono text-4xl font-black tracking-tighter">¥{governmentAmount.toLocaleString()}</div>
                    </div>
                 </div>
            </div>

            <div className="bg-neutral-900/50 rounded-[3rem] p-12 border border-neutral-800 flex flex-col shadow-2xl overflow-hidden h-full">
              <h3 className="text-3xl font-black text-neutral-300 uppercase tracking-widest flex items-center gap-5 mb-8">
                <BarChart className="w-8 h-8 text-neutral-500" /> 执行计划
              </h3>
              <div className="relative border-l-4 border-neutral-800 ml-5 space-y-8 pl-12 py-4 flex-1 overflow-y-auto no-scrollbar">
                {timeline.map((node, idx) => (
                  <div key={node.id} className="relative group">
                    <div className={`absolute -left-[66px] top-1 w-6 h-6 rounded-full ${node.color} border-4 border-neutral-900 shadow-xl`}></div>
                    <div className="flex items-center gap-4 mb-1">
                      <span className="text-sm font-mono text-neutral-500 font-black">{node.date}</span>
                      {idx === 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase">
                          <Clock className="w-3 h-3"/> Process Delay (Pending Review)
                        </span>
                      )}
                    </div>
                    <div className="text-3xl text-white font-black mb-2 tracking-tight">{node.title}</div>
                    <div className="text-neutral-400 text-xl leading-relaxed font-light">{node.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* 4. Deep Analysis */}
      <div id="schools">
        {universities.map((uni) => (
          <React.Fragment key={uni.id}>
            <SectionContainer id={`${uni.id}-content`} className="bg-[#050505]">
              <div className="h-full flex flex-row gap-12 pb-10 max-h-[90vh]">
                <div className="w-[32%] flex flex-col h-full py-4 border-r border-neutral-800/80 pr-10">
                  <div className="mb-12">
                    <div className="flex items-center gap-8 mb-10">
                      <div className={`w-24 h-24 rounded-[2rem] ${uni.themeColor} text-white text-6xl font-black flex items-center justify-center shadow-2xl shadow-black/50`}>
                        {uni.logoLetter}
                      </div>
                      <div>
                        <h2 className="text-6xl font-black text-white tracking-tighter leading-none">{uni.name}</h2>
                        <div className="text-neutral-500 font-mono text-sm uppercase tracking-[0.5em] mt-4 flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-blue-500"></span> {uni.abbr} ANALYTICS
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1"></div>

                  <div className="bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-transparent border border-blue-500/30 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                    <Sparkles className="absolute -top-10 -right-10 w-48 h-48 text-blue-500/10" />
                    <h4 className="text-blue-400 font-black mb-6 text-sm uppercase tracking-[0.4em] flex items-center gap-3">
                       <Sparkles className="w-5 h-5" /> AI 综合深度评价
                    </h4>
                    <p className="text-3xl text-neutral-100 leading-[1.4] italic font-light">
                       “{uni.summary}”
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-10 py-4 overflow-hidden">
                   <div className="flex-[1.5] grid grid-cols-2 gap-10 overflow-hidden">
                      {/* Synchronized styling for Concept and Logic */}
                      <div className="bg-neutral-900/40 p-12 rounded-[3.5rem] border border-neutral-800 shadow-xl flex flex-col relative group overflow-hidden border-t-blue-500/50 border-t-4">
                         <div className="flex items-center gap-5 mb-8 text-blue-400">
                            <Layout className="w-9 h-9" />
                            <h4 className="text-3xl font-black text-white uppercase tracking-wider">核心创意概念</h4>
                         </div>
                         <div className="text-neutral-100 text-2xl leading-[1.5] font-bold overflow-y-auto no-scrollbar pr-4">
                           {uni.concept}
                         </div>
                      </div>

                      <div className="bg-neutral-900/40 p-12 rounded-[3.5rem] border border-neutral-800 shadow-xl flex flex-col relative group overflow-hidden border-t-violet-500/50 border-t-4">
                         <div className="flex items-center gap-5 mb-8 text-violet-400">
                            <Compass className="w-9 h-9" />
                            <h4 className="text-3xl font-black text-white uppercase tracking-wider">方案设计逻辑</h4>
                         </div>
                         <div className="text-neutral-100 text-2xl leading-[1.5] font-bold overflow-y-auto no-scrollbar pr-4">
                            {uni.extracts[1]?.replace('设计思路：', '')}
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 grid grid-cols-4 gap-6">
                      <div className="bg-neutral-800/40 border border-neutral-700 rounded-[2.5rem] p-8 flex flex-col shadow-lg">
                         <h5 className="text-blue-400 text-sm font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Trello className="w-6 h-6" /> 实施规划</h5>
                         <ul className="space-y-2 overflow-y-auto no-scrollbar">
                           {uni.extracts[2]?.replace('方案规划：', '').split('。').filter(Boolean).map((p, i) => (
                             <li key={i} className="text-white text-lg font-black leading-tight flex gap-2"><span className="text-blue-500 shrink-0">•</span>{p}</li>
                           ))}
                         </ul>
                      </div>
                      <div className="bg-neutral-800/40 border border-neutral-700 rounded-[2.5rem] p-8 flex flex-col shadow-lg">
                         <h5 className="text-violet-400 text-sm font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Award className="w-6 h-6" /> 团队资质</h5>
                         <ul className="space-y-2 overflow-y-auto no-scrollbar">
                           {uni.extracts[3]?.replace('实施计划：', '').replace('团队资质：', '').split('。').filter(Boolean).map((p, i) => (
                             <li key={i} className="text-white text-lg font-black leading-tight flex gap-2"><span className="text-violet-500 shrink-0">•</span>{p}</li>
                           ))}
                         </ul>
                      </div>
                      <div className="bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/30 p-8 flex flex-col shadow-lg">
                         <h5 className="text-emerald-400 text-sm font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><CheckCircle2 className="w-6 h-6" /> 优势</h5>
                         <ul className="space-y-3 overflow-y-auto no-scrollbar">
                           {uni.pros.map((p, i) => <li key={i} className="text-white text-lg font-black leading-tight flex gap-3"><span className="text-emerald-500 shrink-0">•</span>{p}</li>)}
                         </ul>
                      </div>
                      <div className="bg-rose-500/10 rounded-[2.5rem] border border-rose-500/30 p-8 flex flex-col shadow-lg">
                         <h5 className="text-rose-400 text-sm font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><AlertCircle className="w-6 h-6" /> 劣势</h5>
                         <ul className="space-y-3 overflow-y-auto no-scrollbar">
                           {uni.cons.map((p, i) => <li key={i} className="text-white text-lg font-black leading-tight flex gap-3"><span className="text-rose-500 shrink-0">•</span>{p}</li>)}
                         </ul>
                      </div>
                   </div>
                </div>
              </div>
            </SectionContainer>

            {/* Page 2: Resource Gallery - Optimized for 16:9 compliance */}
            <SectionContainer id={`${uni.id}-resource`} className="bg-[#050505] border-t border-neutral-900">
              <div className="h-full flex flex-col pb-4 max-h-[90vh] overflow-hidden">
                <div className="flex items-center gap-6 mb-4 border-b border-neutral-800 pb-4 shrink-0">
                  <div className={`w-12 h-12 rounded-xl ${uni.themeColor} flex items-center justify-center text-white text-2xl font-black`}>{uni.logoLetter}</div>
                  <h3 className="text-4xl font-black text-white">方案资产与附件库 <span className="text-neutral-600 font-light mx-4">/</span> <span className="text-blue-500">{uni.name}</span></h3>
                  <div className="ml-auto">
                    <span className="px-4 py-2 bg-neutral-800 rounded-xl text-xs font-black text-blue-400 border border-blue-500/20 uppercase tracking-widest">{uni.abbr} EXCLUSIVE</span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
                  <div className="col-span-8 bg-neutral-900/20 rounded-[3rem] border border-neutral-800 p-8 flex flex-col overflow-hidden shadow-inner h-[80vh]">
                    <ImageWall uni={uni} onUpdate={updateUniversity} />
                  </div>
                  
                  <div className="col-span-4 flex flex-col gap-6 overflow-hidden h-[80vh]">
                    <div className="bg-neutral-900 rounded-[2.5rem] p-8 border border-neutral-800 flex flex-col gap-6 shrink-0 shadow-2xl">
                       {uni.assets.pdf ? (
                         <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="p-4 bg-rose-600/10 rounded-2xl text-rose-500"><FileText className="w-8 h-8"/></div>
                              <div className="flex-1 min-w-0">
                                 <p className="font-black text-white text-2xl truncate leading-none mb-1">{uni.assets.pdf.name}</p>
                                 <p className="text-xs text-neutral-500 uppercase font-mono tracking-widest">PDF • {uni.assets.pdf.size}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <a href={uni.assets.pdf.url} target="_blank" className="flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-2xl text-white font-black text-lg transition-all shadow-xl border border-neutral-700"><EyeIcon className="w-5 h-5"/> 预览</a>
                              <a href={uni.assets.pdf.url} download className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black text-lg transition-all shadow-xl"><Download className="w-5 h-5"/> 下载</a>
                            </div>
                         </div>
                       ) : (
                         <label className="border-2 border-dashed border-neutral-800 rounded-[2rem] p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/40 transition-all">
                            <FileText className="w-12 h-12 text-neutral-700 mb-2"/>
                            <p className="text-neutral-500 text-xl font-black">上传方案 PDF</p>
                            <input type="file" className="hidden" accept="application/pdf" onChange={e => {
                              if (e.target.files?.[0]) {
                                const f = e.target.files[0];
                                updateUniversity({...uni, assets: {...uni.assets, pdf: {name: f.name, size: (f.size/1024/1024).toFixed(1)+'MB', url: URL.createObjectURL(f)}}});
                              }
                            }}/>
                         </label>
                       )}
                    </div>

                    {/* Fixed Dimension Matrix - Full visibility within 16:9 */}
                    <div className="flex-1 bg-neutral-900/40 p-8 rounded-[3rem] border border-neutral-800 flex flex-col shadow-xl overflow-hidden relative">
                       <h4 className="text-emerald-400 font-black mb-6 text-xl flex items-center gap-3">
                         <Activity className="w-6 h-6" /> 核心维度解析
                       </h4>
                       <div className="space-y-4 overflow-y-auto no-scrollbar pr-1 pb-2">
                          {uni.pros.map((p, i) => (
                             <div key={i} className="flex gap-4 items-start bg-neutral-950/50 p-4 rounded-[1.5rem] border border-white/5">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-white text-lg font-bold leading-tight">{p}</span>
                             </div>
                          ))}
                          <div className="flex gap-4 items-start bg-neutral-950/50 p-5 rounded-[1.5rem] border border-white/5 border-l-blue-500">
                             <TrendingUp className="w-6 h-6 text-blue-400 mt-0.5 shrink-0" />
                             <span className="text-blue-100 text-lg font-bold leading-tight">{uni.summary}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionContainer>
          </React.Fragment>
        ))}
      </div>

      {/* 5. Summary - Horizontal Benchmarking Matrix - Redesigned based on reference */}
      <SectionContainer id="summary" className="bg-[#0a0a0a]" isLast={false}>
        <div className="w-full flex flex-col h-full gap-8 py-4 overflow-hidden max-h-[90vh]">
          <div className="flex items-center justify-between shrink-0 mb-2">
             <div className="flex items-center gap-6">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase">横向对比矩阵</h2>
                <span className="text-neutral-500 uppercase tracking-[0.4em] text-sm font-mono font-bold mt-2">2025~2026 CO-CREATION STRATEGIC PRIORITY MATRIX</span>
             </div>
             <button onClick={() => { setChatAutoPrompt("针对智己AIOS，从这四个学校中选择3个进行组合，分别给出一份技术型和体验型的最优组合报告。"); setIsChatOpen(true); }} className="flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-black text-xl shadow-3xl transition-all hover:scale-105 shrink-0">
               <Sparkles className="w-6 h-6" /> AI 决策咨询
             </button>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-700 rounded-[2.5rem] overflow-hidden shrink-0 shadow-2xl flex-1 max-h-[85%]">
             <table className="w-full text-left border-collapse h-full table-fixed">
                <thead>
                   <tr className="bg-neutral-800/50 text-neutral-400 text-sm font-black uppercase tracking-[0.2em] border-b border-neutral-700">
                      <th className="p-3 w-[15%] text-center border-r border-neutral-700">评估维度</th>
                      {universities.map(u => (
                        <th key={u.id} className="p-3 border-r border-neutral-700 last:border-r-0 w-[21.25%]">
                           <div className="flex items-center justify-center gap-4">
                              <div className={`w-10 h-10 rounded-xl ${u.themeColor} flex items-center justify-center text-white text-xl font-black shadow-xl`}>{u.logoLetter}</div>
                              <span className="text-white text-2xl font-black tracking-tighter truncate">{u.name}</span>
                           </div>
                        </th>
                      ))}
                   </tr>
                </thead>
                <tbody className="text-base font-bold">
                   <tr className="border-b border-neutral-700 hover:bg-white/5 transition-colors h-[21%]">
                      <td className="p-3 font-black text-neutral-200 text-center border-r border-neutral-700">
                        <div className="flex flex-col items-center gap-1">
                          <Sparkles className="w-7 h-7 text-violet-500" />
                          <span className="text-lg tracking-tighter">AI 综合评价</span>
                        </div>
                      </td>
                      {universities.map(u => (
                        <td key={u.id} className="p-4 border-r border-neutral-700 last:border-r-0 text-white text-xl font-bold leading-relaxed overflow-y-auto align-top">
                          {u.summary}
                        </td>
                      ))}
                   </tr>
                   <tr className="border-b border-neutral-700 hover:bg-white/5 transition-colors h-[21%]">
                      <td className="p-3 font-black text-neutral-200 text-center border-r border-neutral-700">
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                          <span className="text-lg tracking-tighter">方案优势</span>
                        </div>
                      </td>
                      {universities.map(u => (
                        <td key={u.id} className="p-4 border-r border-neutral-700 last:border-r-0 align-top">
                           <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
                             {u.pros.map((p, i) => (
                               <div key={i} className="text-emerald-400 text-xl font-bold leading-tight flex gap-2">
                                 <span className="shrink-0">•</span><span className="text-white">{p}</span>
                               </div>
                             ))}
                           </div>
                        </td>
                      ))}
                   </tr>
                   <tr className="border-b border-neutral-700 hover:bg-white/5 transition-colors h-[21%]">
                      <td className="p-3 font-black text-neutral-200 text-center border-r border-neutral-700">
                        <div className="flex flex-col items-center gap-1">
                          <AlertCircle className="w-7 h-7 text-rose-500" />
                          <span className="text-lg tracking-tighter">方案劣势</span>
                        </div>
                      </td>
                      {universities.map(u => (
                        <td key={u.id} className="p-4 border-r border-neutral-700 last:border-r-0 align-top">
                           <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
                             {u.cons.map((c, i) => (
                               <div key={i} className="text-rose-400 text-xl font-bold leading-tight flex gap-2">
                                 <span className="shrink-0">•</span><span className="text-neutral-400">{c}</span>
                               </div>
                             ))}
                           </div>
                        </td>
                      ))}
                   </tr>
                   <tr className="hover:bg-white/5 transition-colors h-[21%]">
                      <td className="p-3 font-black text-neutral-200 text-center border-r border-neutral-700">
                        <div className="flex flex-col items-center gap-1">
                          <Users className="w-7 h-7 text-blue-500" />
                          <span className="text-lg tracking-tighter">团队资质</span>
                        </div>
                      </td>
                      {universities.map(u => (
                        <td key={u.id} className="p-4 border-r border-neutral-700 last:border-r-0 align-top">
                           <div className="text-white text-xl font-bold leading-relaxed overflow-y-auto no-scrollbar h-full">
                              {u.extracts[3]?.replace('实施计划：', '').replace('团队资质：', '')}
                           </div>
                        </td>
                      ))}
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </SectionContainer>

      {/* 6. Summary - Recommendations */}
      <SectionContainer id="recommendations" className="bg-[#050505]" isLast={true}>
        <div className="w-full flex flex-col h-full gap-10 py-10 overflow-hidden max-h-[90vh]">
          <div className="flex items-center justify-between shrink-0 mb-4">
             <div>
                <h2 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">组合建议</h2>
                <p className="text-neutral-500 uppercase tracking-[0.5em] text-sm font-mono font-black">Strategic Portfolio Recommendations</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-12 flex-1 pb-16">
             <div className="bg-neutral-900/60 rounded-[4rem] border border-neutral-800 p-16 relative overflow-hidden group hover:border-blue-500/50 transition-all flex flex-col shadow-2xl">
                <Target className="absolute -top-10 -right-10 opacity-[0.05] w-80 h-80 text-blue-500" />
                <div className="flex items-center gap-6 mb-10">
                   <div className="px-6 py-2 bg-blue-500/10 text-blue-400 rounded-full font-mono text-sm font-black border border-blue-500/20 uppercase tracking-[0.3em]">STRATEGY A • TECH DEPTH</div>
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter mb-8 leading-tight">底层科研实证型组合</h3>
                <p className="text-neutral-400 text-3xl leading-relaxed font-light flex-1">
                  推荐：<span className="text-white font-black underline decoration-blue-500 underline-offset-8">交大 + 上理工 + 华理</span>。
                  聚焦<HighlightText>底座解耦算法</HighlightText>、<HighlightText>高安全范式</HighlightText>与<HighlightText>生理量化验证</HighlightText>。构建绝对的技术壁垒，适合高阶智驾与国家级课题申报。
                </p>
             </div>

             <div className="bg-neutral-900/60 rounded-[4rem] border border-neutral-800 p-16 relative overflow-hidden group hover:border-violet-500/50 transition-all flex-1 flex flex-col shadow-2xl">
                <Zap className="absolute -top-10 -right-10 opacity-[0.05] w-80 h-80 text-violet-500" />
                <div className="flex items-center gap-6 mb-10">
                   <div className="px-6 py-2 bg-violet-500/10 text-violet-400 rounded-full font-mono text-sm font-black border border-violet-500/20 uppercase tracking-[0.3em]">STRATEGY B • USER EXPERIENCE</div>
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter mb-8 leading-tight">品牌差异感知型组合</h3>
                <p className="text-neutral-400 text-3xl leading-relaxed font-light flex-1">
                  推荐：<span className="text-white font-black underline decoration-violet-500 underline-offset-8">清华 + 交大 + 上理工</span>。
                  融合<HighlightText>情感体验IP</HighlightText>、<HighlightText>触觉信任模型</HighlightText>与<HighlightText>航空管理逻辑</HighlightText>。快速将硬核技术转化为用户可感知的量产卖点，塑造高端心智。
                </p>
             </div>
          </div>
        </div>
      </SectionContainer>

      <GeminiChatWidget 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen} 
        autoPrompt={chatAutoPrompt}
        universities={universities}
      />
    </div>
  );
};

export default App;
