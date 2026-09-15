import React from 'react';

export default function OraginPage() {
  return (
    <div className="min-h-screen bg-[#050914] flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-slate-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div 
        className="w-full max-w-sm rounded-[2rem] p-8 relative flex flex-col items-center"
        style={{
          background: 'linear-gradient(145deg, #060b18, #04070e)',
          boxShadow: '12px 12px 24px #020408, -12px -12px 24px #081020',
          border: '1px solid rgba(192, 192, 200, 0.15)'
        }}
      >
        {/* Top inner highlight for 3D depth */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent rounded-t-[2rem]"></div>
        
        <div className="w-20 h-20 mb-8 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #050a16, #070c1a)',
            boxShadow: 'inset 5px 5px 10px #03050a, inset -5px -5px 10px #090f22',
            border: '1px solid rgba(192, 192, 192, 0.1)'
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-600"
            style={{ boxShadow: '0 0 15px rgba(200,200,200,0.2)' }}
          ></div>
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2 text-center tracking-wide" 
          style={{ 
            background: 'linear-gradient(to bottom right, #e2e8f0, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0px 4px 10px rgba(0,0,0,0.8)' 
          }}>
          SYSTEM
        </h1>
        <p className="text-slate-500 text-sm mb-10 text-center tracking-widest uppercase font-semibold">
          Restricted Access
        </p>
        
        <div className="w-full space-y-5">
          <div 
            className="w-full p-4 rounded-xl"
            style={{
              background: '#040710',
              boxShadow: 'inset 4px 4px 8px #02040a, inset -4px -4px 8px #060a16',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Status</span>
              <span className="text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
                Online
              </span>
            </div>
          </div>

          <button 
            className="w-full py-4 rounded-xl font-bold text-slate-200 transition-all active:scale-[0.97] flex items-center justify-center tracking-widest hover:text-white"
            style={{
              background: 'linear-gradient(145deg, #070c1a, #050914)',
              boxShadow: '6px 6px 12px #03040a, -6px -6px 12px #090e1e',
              border: '1px solid rgba(192, 192, 192, 0.2)'
            }}
          >
            INITIALIZE
          </button>
        </div>
      </div>
    </div>
  );
}
