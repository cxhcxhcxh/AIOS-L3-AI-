import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
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
  ListTodo,
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
  Award
} from 'lucide-react';
import { UNIVERSITIES, FINANCIAL_DATA } from './constants';
import { UniversityData } from './types';

// --- Utils ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- Gemini Service Integration ---
const GeminiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = "你是一个专业的项目评审专家，正在协助用户分析'智己汽车2025年度校企共创专项方案'。你需要根据已有的四个学校（上海交大、上海理工、华东理工、清华大学）的方案特点进行回答。回答要简洁、专业，适合汇报场景。";
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
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
      setMessages(prev => [...prev, { role: 'model', text: "API 连接错误，请检查配置。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-neutral-900 border border-neutral-700 w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-neutral-800 p-4 border-b border-neutral-700 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" /> 
              Gemini 智囊团
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-neutral-500 text-sm text-center mt-10">
                请问有什么关于这四个高校方案的问题？
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-200'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-neutral-500 text-xs ml-2 animate-pulse">正在思考...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-neutral-800 border-t border-neutral-700 flex gap-2">
            <input 
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="输入问题..."
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
        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};

// --- Components ---

const Navigation = () => (
  <nav className="fixed top-0 left-0 w-full z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 h-16 flex items-center justify-between px-10 shadow-lg">
    <div className="text-xl font-bold text-white tracking-wider flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('overview')}>
      <span className="w-2 h-6 bg-blue-500 rounded-sm"></span>
      <div className="flex flex-col leading-none">
        <span className="tracking-widest">IM MOTORS</span>
        <span className="text-neutral-500 text-[10px] font-normal tracking-normal mt-0.5">2025 校企共创报告</span>
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

const SchoolSidebar = () => {
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
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest writing-mode-vertical rotate-180 hidden">Universities</div>
          {UNIVERSITIES.map(u => (
            <button 
              key={u.id} 
              onClick={() => scrollToSection(`${u.id}-content`)}
              className="group flex items-center gap-3 relative"
              title={u.name}
            >
              <div className={`w-10 h-10 rounded-lg ${u.themeColor} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                {u.logoLetter}
              </div>
              <span className="absolute left-14 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {u.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const SectionContainer = ({ id, children, className = "" }: { id: string, children?: React.ReactNode, className?: string }) => (
  <section id={id} className={`snap-section w-full h-screen flex flex-col justify-start px-4 md:px-12 pt-20 pb-4 overflow-hidden ${className}`}>
    <div className="w-full h-full flex flex-col max-w-[1920px] mx-auto">
      {children}
    </div>
  </section>
);

const UniContentScreen = ({ data }: { data: UniversityData }) => {
  // Parsing extracts to be structural
  const findExtract = (key: string) => data.extracts.find(e => e.startsWith(key))?.split('：')[1] || '';
  
  return (
    <div className="h-full flex flex-col pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-6">
          <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${data.themeColor} text-white text-4xl font-bold shadow-2xl shadow-${data.themeColor.split('-')[1]}-500/30`}>
            {data.logoLetter}
          </div>
          <div>
            <h2 className="text-6xl font-bold text-white tracking-tight leading-none">{data.name}</h2>
            <div className="text-neutral-400 text-lg uppercase tracking-[0.2em] font-medium mt-2">Proposal Analysis Report</div>
          </div>
        </div>
        <div className="text-right">
           <div className={`text-xl font-bold px-6 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300`}>
             Code: {data.id.toUpperCase()}
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-10 min-h-0">
        {/* Left Column: Concept & Strategy */}
        <div className="col-span-8 flex flex-col gap-8">
           {/* Top: Concept */}
           <div className="bg-neutral-800/30 p-10 rounded-3xl border border-neutral-700/50 backdrop-blur-sm">
             <h3 className="text-blue-400 font-bold mb-6 flex items-center gap-3 text-lg uppercase tracking-wider">
                <Layout className="w-6 h-6" /> 核心创意概念
             </h3>
             <p className="text-3xl md:text-4xl text-white font-light leading-snug">
               {data.concept}
             </p>
           </div>

           {/* Middle: Details Grid */}
           <div className="flex-1 grid grid-cols-2 gap-8">
              <div className="bg-neutral-900/60 p-8 rounded-2xl border border-neutral-800 flex flex-col">
                 <h4 className="text-neutral-400 font-bold mb-4 text-sm uppercase flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div> 设计思路
                 </h4>
                 <p className="text-neutral-200 text-xl leading-relaxed flex-1">
                   {findExtract('设计思路') || data.extracts[1]}
                 </p>
              </div>
              <div className="bg-neutral-900/60 p-8 rounded-2xl border border-neutral-800 flex flex-col">
                 <h4 className="text-neutral-400 font-bold mb-4 text-sm uppercase flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500"></div> 方案规划
                 </h4>
                 <p className="text-neutral-200 text-xl leading-relaxed flex-1">
                   {findExtract('方案规划') || data.extracts[2]}
                 </p>
              </div>
           </div>

           {/* Bottom: Team */}
           <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
               <div className="flex items-center gap-6">
                  <div className="bg-neutral-800 p-3 rounded-xl shrink-0"><Cpu className="w-8 h-8 text-neutral-400"/></div>
                  <div>
                    <h4 className="text-neutral-500 font-bold text-sm uppercase mb-1">实施与资质</h4>
                    <p className="text-neutral-200 text-lg font-medium">{findExtract('实施计划') || findExtract('团队资质') || data.extracts[3]}</p>
                  </div>
               </div>
           </div>
        </div>

        {/* Right Column: Pros/Cons (Vertical) */}
        <div className="col-span-4 flex flex-col gap-8">
          <div className="flex-1 bg-gradient-to-br from-neutral-800/20 to-neutral-900/50 p-8 rounded-3xl border border-neutral-700/50 flex flex-col shadow-lg">
            <h4 className="text-emerald-400 font-bold mb-6 text-xl flex items-center gap-3 uppercase">
              <CheckCircle2 className="w-6 h-6" /> 核心优势
            </h4>
            <ul className="space-y-6 flex-1">
              {data.pros.map((p, i) => (
                <li key={i} className="flex gap-4 text-lg text-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 shrink-0"></span>
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-gradient-to-br from-neutral-800/20 to-neutral-900/50 p-8 rounded-3xl border border-neutral-700/50 flex flex-col shadow-lg">
            <h4 className="text-rose-400 font-bold mb-6 text-xl flex items-center gap-3 uppercase">
              <AlertCircle className="w-6 h-6" /> 潜在风险
            </h4>
            <ul className="space-y-6 flex-1">
              {data.cons.map((p, i) => (
                <li key={i} className="flex gap-4 text-lg text-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-2.5 shrink-0"></span>
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImagePreviewModal = ({ src, onClose }: { src: string, onClose: () => void }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    setScale(s => Math.min(Math.max(0.5, s - e.deltaY * 0.001), 4));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-200" onClick={onClose}>
       <div className="absolute top-0 w-full p-4 flex justify-between items-center z-50 bg-black/50 backdrop-blur-sm" onClick={e => e.stopPropagation()}>
          <div className="text-white text-lg font-medium">预览模式 (Preview)</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setScale(s => Math.min(s + 0.5, 4))} className="p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700"><ZoomIn/></button>
            <button onClick={() => setScale(s => Math.max(s - 0.5, 0.5))} className="p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700"><ZoomOut/></button>
            <button onClick={() => { setScale(1); setPosition({x:0,y:0}) }} className="p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700"><RefreshCw className="w-5 h-5"/></button>
            <button onClick={onClose} className="p-2 bg-rose-600 rounded-full text-white hover:bg-rose-500"><X className="w-5 h-5"/></button>
          </div>
       </div>
       <div 
         className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
         onWheel={handleWheel}
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
         onClick={e => e.stopPropagation()}
       >
         <img 
           src={src} 
           alt="Preview" 
           style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transition: isDragging ? 'none' : 'transform 0.1s' }}
           className="max-w-full max-h-full object-contain pointer-events-none select-none" 
         />
       </div>
    </div>
  )
}

const UniResourceScreen = ({ data }: { data: UniversityData }) => {
  // State initialization includes recommended images so they are fully mutable (deletable)
  const [images, setImages] = useState<Array<{url: string, label: string}>>(() => {
    return data.uploadConfig.recommendedImages.map((label, i) => ({
      url: `https://picsum.photos/800/600?random=${data.id}${i}`,
      label: label
    }));
  });
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [hasPdf, setHasPdf] = useState(data.uploadConfig.hasDoc); // Initial state for simulation
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImages(prev => [...prev, { url, label: file.name }]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setHasPdf(true);
    }
  };

  const handlePdfDownload = () => {
    if (pdfFile) {
      // Real download for user uploaded file
      const url = URL.createObjectURL(pdfFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.name;
      a.click();
      URL.revokeObjectURL(url);
    } else if (hasPdf) {
      // Simulated download for initial state (creates a dummy PDF blob)
      const blob = new Blob(["Simulated PDF Content for " + data.name], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.name}_2025_Proposal.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-full flex flex-col relative pb-6">
      {previewImg && <ImagePreviewModal src={previewImg} onClose={() => setPreviewImg(null)} />}

      <div className="flex items-center gap-6 mb-8 border-b border-neutral-800 pb-6">
        <span className={`w-4 h-4 rounded-full ${data.themeColor}`}></span>
        <h3 className="text-4xl font-bold text-white">方案资源库</h3>
        <div className="h-px bg-neutral-800 flex-1 ml-4"></div>
        <div className="text-lg text-neutral-400 font-mono">
          Total Assets: <span className="text-white font-bold">{images.length}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-10 min-h-0">
        {/* Left: Image Wall (Interactive) */}
        <div className="col-span-9 bg-neutral-900 rounded-3xl border border-neutral-800 flex flex-col p-8 relative overflow-hidden">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3 text-lg text-white font-bold">
               <Layout className="w-5 h-5 text-blue-400" /> 视觉方案展示 (Visual Deliverables)
             </div>
             <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-full flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
               <Plus className="w-4 h-4" /> 上传新素材
               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
             </label>
           </div>
           
           {images.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 border-2 border-dashed border-neutral-800 rounded-2xl">
                <UploadCloud className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">暂无视觉素材，请上传</p>
             </div>
           ) : (
             <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-3 gap-6 auto-rows-[280px] pb-4">
                {images.map((img, i) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden bg-neutral-800 border border-neutral-700 transition-all hover:border-blue-500/50">
                     <img 
                        src={img.url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt="Asset"
                      />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                        <button onClick={() => setPreviewImg(img.url)} className="p-3 bg-neutral-900/90 rounded-full text-white hover:bg-blue-600 transition-colors shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300">
                          <Eye className="w-6 h-6" />
                        </button>
                        <button onClick={() => handleDeleteImage(i)} className="p-3 bg-neutral-900/90 rounded-full text-white hover:bg-rose-600 transition-colors shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                          <Trash2 className="w-6 h-6" />
                        </button>
                     </div>
                     <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-sm text-white font-medium truncate pt-10">
                       {img.label}
                     </span>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Right: Resources & Checklist */}
        <div className="col-span-3 flex flex-col gap-8">
           {/* Checklist */}
           <div className="flex-1 bg-neutral-800/30 rounded-3xl p-8 border border-neutral-700 flex flex-col">
             <h4 className="text-white font-bold mb-6 flex items-center gap-3 text-base uppercase tracking-wider">
               <ListTodo className="w-5 h-5 text-emerald-400" /> 交付清单
             </h4>
             <ul className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
               {data.uploadConfig.recommendedImages.map((item, idx) => (
                  <li key={idx} className="text-base text-neutral-300 flex items-start gap-3">
                     <div className="w-2 h-2 rounded-full bg-neutral-600 mt-2 shrink-0"></div>
                     <span className="leading-snug">{item}</span>
                  </li>
               ))}
               <li className="text-base text-neutral-300 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-neutral-600 mt-2 shrink-0"></div>
                  <span>实证数据源文件 (Excel/CSV)</span>
               </li>
             </ul>
           </div>

           {/* PDF Manager */}
           <div className="bg-neutral-800 rounded-3xl p-6 border border-neutral-700">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-neutral-400" />
                    <span className="text-white font-bold text-lg">方案文档 PDF</span>
                 </div>
              </div>
              
              {hasPdf ? (
                 <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800 mb-4 group relative hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="bg-rose-500/20 text-rose-400 p-3 rounded-xl shrink-0">
                          <FileText className="w-8 h-8" />
                       </div>
                       <div className="overflow-hidden">
                          <div className="text-base text-white font-bold truncate mb-1">
                            {pdfFile ? pdfFile.name : `${data.name}_Proposal.pdf`}
                          </div>
                          <div className="text-sm text-neutral-500">{pdfFile ? (pdfFile.size/1024/1024).toFixed(2) + ' MB' : '12.4 MB • Latest'}</div>
                       </div>
                    </div>
                    <button 
                      onClick={handlePdfDownload}
                      className="absolute top-4 right-4 p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                      title="下载文档"
                    >
                       <Download className="w-5 h-5" />
                    </button>
                 </div>
              ) : (
                 <div className="bg-neutral-900/50 rounded-2xl p-8 border-2 border-dashed border-neutral-700 mb-4 flex flex-col items-center justify-center text-center">
                    <span className="text-sm text-neutral-500 mb-1">暂无文档</span>
                 </div>
              )}

              <label className="flex items-center justify-center w-full gap-3 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-bold py-4 rounded-2xl transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                 <UploadCloud className="w-5 h-5" />
                 <span>{hasPdf ? '替换 PDF 文档' : '上传 PDF 文档'}</span>
                 <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
              </label>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  return (
    <div className="snap-container no-scrollbar bg-[#050505] font-sans selection:bg-blue-500/30 text-neutral-100">
      <Navigation />
      <SchoolSidebar />
      
      {/* 1. Overview */}
      <SectionContainer id="overview" className="bg-gradient-to-br from-neutral-900 via-[#050505] to-[#0a0a0a]">
        <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center justify-center h-full">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 border border-blue-500/30 rounded-full bg-blue-900/10 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-sm tracking-[0.2em] font-mono uppercase font-bold">Confidential Report</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter text-white mb-6 leading-none select-none">
            共创<span className="text-neutral-700 mx-6 font-light">/</span>未来
          </h1>
          <div className="text-4xl md:text-6xl font-light text-neutral-300 mb-20 tracking-tight">
            L3+AI 人机共驾<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 mx-4">自然交互</span>创新方案
          </div>
          
          <div className="grid grid-cols-4 gap-20 w-full max-w-5xl border-t border-neutral-800 pt-16">
            {[
              { label: '参与高校', val: '4', unit: '所' },
              { label: '拟立项', val: '3', unit: '项' },
              { label: '总资金池', val: '30', unit: '万' },
              { label: '研发周期', val: '18', unit: '月' }
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="text-6xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {stat.val}<span className="text-2xl ml-2 text-neutral-600 font-normal">{stat.unit}</span>
                </div>
                <div className="text-sm text-neutral-500 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-neutral-600">
            <ChevronDown className="w-8 h-8" />
          </div>
        </div>
      </SectionContainer>

      {/* 2. Background */}
      <SectionContainer id="background">
        <div className="h-full flex flex-col justify-center py-10">
          <h2 className="text-6xl font-bold mb-12 text-white">
            <span className="text-blue-500 mr-6 font-mono">01.</span>
            项目背景与痛点
          </h2>
          
          {/* Top: Pain Points & Requirements */}
          <div className="grid grid-cols-2 gap-16 mb-12 flex-1">
             <div className="bg-neutral-900 p-12 rounded-[2.5rem] border border-neutral-800 flex flex-col justify-center hover:border-blue-500/30 transition-colors shadow-2xl">
                <div className="mb-8 bg-rose-500/10 w-20 h-20 rounded-3xl flex items-center justify-center">
                  <AlertCircle className="text-rose-500 w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-6">核心体验断层</h3>
                <p className="text-neutral-400 text-2xl leading-relaxed">
                  L3级自动驾驶落地后，线控转向的<strong className="text-white border-b-2 border-rose-500/50">物理反馈缺失</strong>与数字交互逻辑形成割裂。
                  驾驶员在“脱手”与“接管”切换时，缺乏足够的信心支撑。
                </p>
             </div>
             <div className="bg-neutral-900 p-12 rounded-[2.5rem] border border-neutral-800 flex flex-col justify-center hover:border-emerald-500/30 transition-colors shadow-2xl">
                <div className="mb-8 bg-emerald-500/10 w-20 h-20 rounded-3xl flex items-center justify-center">
                  <FileCheck className="text-emerald-500 w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-6">自然基金实施要求</h3>
                <p className="text-neutral-400 text-2xl leading-relaxed">
                  必须契合“基础学科支撑+技术创新”双重导向。
                  方案需提供扎实的<strong className="text-white border-b-2 border-emerald-500/50">基础理论</strong>（心理学、人因工程）及<strong className="text-white border-b-2 border-emerald-500/50">可量化的实证数据</strong>。
                </p>
             </div>
          </div>

          {/* Bottom: Technical Foundation */}
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 rounded-3xl p-10 shadow-2xl">
             <div className="flex items-center gap-4 mb-8 text-neutral-400 text-sm font-bold uppercase tracking-[0.2em] border-b border-neutral-700 pb-4">
               <Layers className="w-5 h-5 text-blue-500" /> 现有技术基座支撑 (Technical Foundation)
             </div>
             <div className="grid grid-cols-3 gap-12">
                <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 rounded-2xl bg-neutral-950 flex items-center justify-center border border-neutral-800 group-hover:border-blue-500/50 transition-colors"><Zap className="w-8 h-8 text-blue-400"/></div>
                   <div>
                     <div className="text-2xl text-white font-bold mb-1">恒星超级增程</div>
                     <div className="text-lg text-neutral-500">动力架构</div>
                   </div>
                </div>
                <div className="flex items-center gap-6 border-l border-neutral-700 pl-12 group">
                   <div className="w-16 h-16 rounded-2xl bg-neutral-950 flex items-center justify-center border border-neutral-800 group-hover:border-violet-500/50 transition-colors"><Activity className="w-8 h-8 text-violet-400"/></div>
                   <div>
                     <div className="text-2xl text-white font-bold mb-1">灵犀数字底盘 2.0</div>
                     <div className="text-lg text-neutral-500">线控转向</div>
                   </div>
                </div>
                <div className="flex items-center gap-6 border-l border-neutral-700 pl-12 group">
                   <div className="w-16 h-16 rounded-2xl bg-neutral-950 flex items-center justify-center border border-neutral-800 group-hover:border-emerald-500/50 transition-colors"><Maximize2 className="w-8 h-8 text-emerald-400"/></div>
                   <div>
                     <div className="text-2xl text-white font-bold mb-1">AIOS 座舱系统</div>
                     <div className="text-lg text-neutral-500">交互中枢</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </SectionContainer>

      {/* 3. Financials - Fixed Overflow & Layout */}
      <SectionContainer id="finance">
        <div className="w-full h-full flex flex-col justify-center max-h-screen">
          <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4 shrink-0">
            <h2 className="text-5xl font-bold text-white flex items-center gap-6">
              <span className="text-emerald-500 mr-2 font-mono">02.</span>
              金融方案
            </h2>
            <div className="text-right">
              <div className="text-sm text-neutral-500 uppercase tracking-widest font-medium mb-1">Project Budget</div>
              <div className="text-6xl font-mono font-bold text-emerald-400 tracking-tight">¥300,000</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1 min-h-0">
            {/* Chart Area */}
            <div className="flex flex-col justify-center h-full">
              <div className="bg-neutral-900 rounded-[2.5rem] p-8 border border-neutral-800 relative shadow-2xl h-full flex flex-col justify-center">
                 <div className="absolute -top-4 left-10 bg-neutral-800 px-4 py-2 text-sm text-neutral-400 rounded-lg border border-neutral-700 uppercase tracking-wider font-bold">资金结构</div>
                 <div className="flex gap-2 h-32 mb-10 mt-4">
                    <div className="h-full bg-blue-600 rounded-l-2xl flex flex-col justify-center items-center relative group transition-all hover:bg-blue-500" style={{width: '76.9%'}}>
                       <span className="text-5xl font-bold text-white mb-2">76.9%</span>
                       <span className="text-sm text-blue-200 uppercase font-bold tracking-widest">Enterprise</span>
                    </div>
                    <div className="h-full bg-emerald-500 rounded-r-2xl flex flex-col justify-center items-center relative group transition-all hover:bg-emerald-400" style={{width: '23.1%'}}>
                       <span className="text-5xl font-bold text-neutral-900 mb-2">23.1%</span>
                       <span className="text-sm text-emerald-900 uppercase font-bold tracking-widest">Gov</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    {FINANCIAL_DATA.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
                        <div className="flex items-center gap-4">
                           <div className={`w-4 h-4 rounded-full ${i===0 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                           <span className="text-neutral-300 font-bold text-xl">{item.label}</span>
                        </div>
                        <div className="text-right">
                           <div className="text-white font-mono text-xl font-bold">¥{item.amount.toLocaleString()}</div>
                           <div className="text-sm text-neutral-500 mt-1">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Timeline Area */}
            <div className="bg-neutral-900 rounded-[2.5rem] p-8 border border-neutral-800 flex flex-col shadow-2xl h-full overflow-hidden">
              <h3 className="text-2xl font-bold text-neutral-300 mb-8 flex items-center gap-4 uppercase tracking-wider">
                <BarChart className="w-6 h-6 text-neutral-500" />
                执行时间轴 <span className="text-xs ml-4 bg-neutral-800 px-3 py-1.5 rounded-lg text-neutral-500 font-bold border border-neutral-700">(原计划)</span>
              </h3>
              <div className="relative border-l-4 border-neutral-800 ml-4 space-y-10 pl-10 py-4 flex-1 flex flex-col justify-center">
                <div className="relative group">
                  <div className="absolute -left-[54px] w-6 h-6 rounded-full bg-neutral-700 border-4 border-neutral-900 group-hover:bg-white transition-colors"></div>
                  <div className="text-base font-mono text-neutral-500 mb-1 font-bold">2025.12 - 2026.01</div>
                  <div className="text-2xl text-white font-bold mb-1">立项申报</div>
                  <div className="text-neutral-400 text-lg">完成合同签订与入库流程</div>
                </div>
                <div className="relative group">
                  <div className="absolute -left-[54px] w-6 h-6 rounded-full bg-blue-500 border-4 border-neutral-900 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
                  <div className="text-base font-mono text-blue-400 mb-1 font-bold">2026.03 [启动]</div>
                  <div className="text-2xl text-white font-bold mb-1">首款拨付</div>
                  <div className="text-neutral-400 text-lg">总计15万 (5万/校) 启动资金到位</div>
                </div>
                <div className="relative group">
                  <div className="absolute -left-[54px] w-6 h-6 rounded-full bg-emerald-500 border-4 border-neutral-900 group-hover:scale-110 transition-transform"></div>
                  <div className="text-base font-mono text-emerald-400 mb-1 font-bold">2026.05 [验收]</div>
                  <div className="text-2xl text-white font-bold mb-1">结题验收</div>
                  <div className="text-neutral-400 text-lg">产出物审核，拨付尾款15万</div>
                </div>
                <div className="relative group">
                  <div className="absolute -left-[54px] w-6 h-6 rounded-full bg-violet-500 border-4 border-neutral-900 group-hover:scale-110 transition-transform"></div>
                  <div className="text-base font-mono text-violet-400 mb-1 font-bold">2027.06 [验证]</div>
                  <div className="text-2xl text-white font-bold mb-1">实车验证</div>
                  <div className="text-neutral-400 text-lg">量产车型搭载与用户体验闭环</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* 4. Universities - 8 Screens (2 per uni) */}
      <div id="schools">
        {UNIVERSITIES.map((uni) => (
          <React.Fragment key={uni.id}>
            {/* Screen 1: Content */}
            <SectionContainer id={`${uni.id}-content`} className="bg-[#050505] border-t border-neutral-900">
              <UniContentScreen data={uni} />
            </SectionContainer>
            {/* Screen 2: Resource */}
            <SectionContainer id={`${uni.id}-resource`} className="bg-[#050505]">
              <UniResourceScreen data={uni} />
            </SectionContainer>
          </React.Fragment>
        ))}
      </div>

      {/* 5. Summary - Redesigned Split Layout */}
      <SectionContainer id="summary" className="bg-[#0a0a0a]">
        <div className="w-full flex flex-col h-full gap-6">
          <h2 className="text-4xl font-bold text-center text-white tracking-tight shrink-0">方案核心维度横向对比与策略建议</h2>
          
          {/* Comparison Table (Top) */}
          <div className="bg-neutral-900 rounded-[2rem] border border-neutral-800 overflow-hidden shadow-2xl flex-[2] min-h-0">
            <div className="overflow-auto h-full custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-950">
                    <th className="p-6 text-neutral-500 font-bold w-64 text-lg uppercase tracking-wider border-b border-neutral-800 sticky top-0 bg-neutral-950 z-10">Evaluation</th>
                    {UNIVERSITIES.map(u => (
                      <th key={u.id} className="p-6 text-white border-l border-b border-neutral-800 relative group transition-colors hover:bg-neutral-900 sticky top-0 bg-neutral-950 z-10">
                        <div className={`absolute top-0 left-0 w-full h-1 ${u.themeColor}`}></div>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${u.themeColor} flex items-center justify-center text-xs font-bold shadow-lg`}>{u.logoLetter}</div>
                          <span className="text-xl font-bold">{u.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-6 text-neutral-400 font-bold text-xl">基础学科</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800 font-medium">触觉感知、认知心理学</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800 font-medium">航空人因工程、工效学</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800 font-medium">脑电认知机制、心理声学</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800 font-medium">情感计算</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-6 text-neutral-400 font-bold text-xl">核心痛点</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800">线控路感缺失</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800">接管安全边界模糊</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800">感官交互不精细</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800">人机信任与情感连接</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-6 text-neutral-400 font-bold text-xl">创新亮点</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800 text-blue-300 font-medium">多模态融合、路感数字化</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800 text-amber-300 font-medium">航空迁移、检查单流程</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800 text-emerald-300 font-medium">生理数据量化、声光规范</td>
                    <td className="p-6 text-neutral-200 text-lg border-l border-neutral-800">人格化IP、全场景生态</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-6 text-neutral-400 font-bold text-xl">团队资质</td>
                    <td className="p-6 text-neutral-300 border-l border-neutral-800 leading-relaxed text-base">设计+集成电路跨学科背景</td>
                    <td className="p-6 text-neutral-300 border-l border-neutral-800 leading-relaxed text-base">C919驾驶舱设计经验</td>
                    <td className="p-6 text-neutral-300 border-l border-neutral-800 leading-relaxed text-base">实验设备完备、量化严谨</td>
                    <td className="p-6 text-neutral-300 border-l border-neutral-800 leading-relaxed text-base">跨界资源丰富、商业化强</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategy Recommendation (Bottom) */}
          <div className="grid grid-cols-2 gap-6 flex-1 min-h-[250px] shrink-0">
             {/* Strategy A */}
             <div className="bg-neutral-900 rounded-[2rem] border border-neutral-800 p-8 flex flex-col justify-center relative overflow-hidden group hover:border-blue-500/30 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <TrendingUp className="w-40 h-40 text-white" />
                </div>
                <div className="flex items-center gap-3 mb-4 z-10">
                   <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-bold border border-blue-500/20 tracking-wider">STRATEGY A</span>
                   <h3 className="text-3xl font-bold text-white">科研壁垒组合</h3>
                </div>
                <p className="text-neutral-400 text-xl mb-8 z-10 leading-relaxed">侧重技术深度与实证严谨性，构建扎实的底层交互规范。</p>
                <div className="flex items-center gap-6 z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">S</div>
                      <span className="text-lg text-neutral-300 font-bold">交大</span>
                   </div>
                   <div className="h-px w-8 bg-neutral-700"></div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">U</div>
                      <span className="text-lg text-neutral-300 font-bold">上理</span>
                   </div>
                   <div className="h-px w-8 bg-neutral-700"></div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">E</div>
                      <span className="text-lg text-neutral-300 font-bold">华理</span>
                   </div>
                </div>
             </div>

             {/* Strategy B */}
             <div className="bg-neutral-900 rounded-[2rem] border border-neutral-800 p-8 flex flex-col justify-center relative overflow-hidden group hover:border-violet-500/30 transition-all">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Award className="w-40 h-40 text-white" />
                </div>
                <div className="flex items-center gap-3 mb-4 z-10">
                   <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg text-sm font-bold border border-violet-500/20 tracking-wider">STRATEGY B</span>
                   <h3 className="text-3xl font-bold text-white">品牌声量组合</h3>
                </div>
                <p className="text-neutral-400 text-xl mb-8 z-10 leading-relaxed">侧重市场影响力与IP跨界，最大化营销传播价值与商业化潜力。</p>
                 <div className="flex items-center gap-6 z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">S</div>
                      <span className="text-lg text-neutral-300 font-bold">交大</span>
                   </div>
                   <div className="h-px w-8 bg-neutral-700"></div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">U</div>
                      <span className="text-lg text-neutral-300 font-bold">上理</span>
                   </div>
                   <div className="h-px w-8 bg-neutral-700"></div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">T</div>
                      <span className="text-lg text-neutral-300 font-bold">清华</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="text-center text-neutral-600 text-xs flex items-center justify-center gap-3 shrink-0 py-1">
            <School className="w-4 h-4" />
            <span>CONFIDENTIAL - INTERNAL USE ONLY</span>
            <span className="mx-2 text-neutral-800">|</span>
            <span>智舱软件 陈晓华</span>
          </div>
        </div>
      </SectionContainer>

      {/* Gemini Widget */}
      <GeminiChatWidget />
    </div>
  );
};

export default App;