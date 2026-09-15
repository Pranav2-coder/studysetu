import React from 'react';

export default function OraginPage() {
  return (
    <div className="min-h-screen bg-[#050914] flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-slate-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div 
        className="w-full max-w-sm rounded-[2rem] p-8 relative flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #060b18, #04070e)',
          boxShadow: '12px 12px 24px #020408, -12px -12px 24px #081020',
          border: '1px solid rgba(192, 192, 200, 0.15)'
        }}
      >
        {/* Top inner highlight for 3D depth */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent rounded-t-[2rem]"></div>
        
        <h1 className="text-3xl font-extrabold mb-2 text-center tracking-wide" 
          style={{ 
            background: 'linear-gradient(to bottom right, #e2e8f0, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0px 4px 10px rgba(0,0,0,0.8)' 
          }}>
          ORIGIN
        </h1>
        <p className="text-slate-400 text-xs mb-8 text-center tracking-wider leading-relaxed">
          Providing web solutions for anyone
        </p>
        
        <div className="w-full space-y-6">
          {/* Project 1 */}
          <div 
            className="w-full p-5 rounded-2xl flex flex-col relative"
            style={{
              background: '#040710',
              boxShadow: 'inset 4px 4px 8px #02040a, inset -4px -4px 8px #060a16',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-200 text-lg font-bold tracking-wide">Studysetu.tech</h2>
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              One platform for every institution and coaching class, offering low-budget web pages for coaching.
            </p>
          </div>

          {/* Project 2 */}
          <div 
            className="w-full p-5 rounded-2xl flex flex-col relative"
            style={{
              background: '#040710',
              boxShadow: 'inset 4px 4px 8px #02040a, inset -4px -4px 8px #060a16',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-200 text-lg font-bold tracking-wide">Excellence App</h2>
              <span className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.8)]"></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Finance management app tailored specifically for institutions and coaching classes.
            </p>
          </div>

          <button 
            className="w-full py-4 mt-4 rounded-xl font-bold text-slate-200 transition-all active:scale-[0.97] flex items-center justify-center tracking-widest hover:text-white"
            style={{
              background: 'linear-gradient(145deg, #070c1a, #050914)',
              boxShadow: '6px 6px 12px #03040a, -6px -6px 12px #090e1e',
              border: '1px solid rgba(192, 192, 192, 0.2)'
            }}
          >
            GET IN TOUCH
          </button>
        </div>
      </div>
    </div>
  );
}
