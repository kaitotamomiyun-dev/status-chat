import React, { useState } from 'react';
import { Send, Sparkles, AlertCircle, Copy, Check, Settings2, ShieldCheck, Activity, Cpu } from 'lucide-react';

export default function App() {
  const [endpoint, setEndpoint] = useState('http://localhost:11434');
  const [model, setModel] = useState('qwen2.5-coder:7b');
  const [prompt, setPrompt] = useState('');
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const currentPrompt = prompt;
    setLastUserPrompt(currentPrompt);
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.trim() || 'qwen2.5-coder:7b',
          prompt: currentPrompt,
          stream: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro na resposta do Ollama (Status ${res.status}: ${res.statusText})`);
      }

      const data = await res.json();
      setResponse(data.response || '[Modelo retornou resposta vazia]');
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || 
        'Falha ao conectar com o Ollama local em ' + endpoint + '. Verifique se o Ollama está rodando e se OLLAMA_ORIGINS="*" está habilitado.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#030806] text-[#e8f7f2] glass-depth-bg flex flex-col p-3 sm:p-5 lg:p-6 box-border border-4 border-[#072418]/80 relative select-text">
      
      {/* Fantasy Header */}
      <header className="fantasy-header flex-wrap gap-2">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="text-xl sm:text-2xl font-bold tracking-widest text-[#00f5a0]">
            [ STATUS WINDOW ]
          </span>
          <span className="status-label sm:ml-4 text-[#ffd166]">LVL: 99</span>
          <span className="status-label text-[#80a99c]">MP: 11434 / 11434</span>
        </div>
        <div className="status-label flex items-center gap-2 text-[#00f5a0]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00f5a0] animate-pulse shadow-[0_0_8px_#00f5a0]"></span>
          <span>OLLAMA-{model.toUpperCase()} // CONNECTION: {loading ? 'TRANSMITTING' : 'STABLE'}</span>
        </div>
      </header>

      {/* High Density Grid Area with Glass Panels */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6 flex-grow overflow-hidden min-h-[580px]">
        
        {/* Left Sidebar: Designation & System Stats */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col gap-4">
          
          {/* Node Identity Card */}
          <div className="hud-glass-panel p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="status-label text-[#80a99c]">USER_DESIGNATION</div>
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffd166]" />
            </div>
            <div className="stat-value mb-4 text-[#e8f7f2]">PROMPTER_01</div>

            <div className="flex items-center justify-between mb-1">
              <div className="status-label text-[#80a99c]">ACTIVE_MODEL</div>
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-[10px] text-[#ffd166] hover:underline flex items-center gap-1 font-hud-tech cursor-pointer"
                title="Configurar Modelo e Endpoint"
              >
                <Settings2 className="w-3 h-3" />
                <span>{showConfig ? 'CLOSE_CFG' : 'EDIT_CFG'}</span>
              </button>
            </div>
            <div className="stat-value text-[#00f5a0] truncate mb-2">{model}</div>
            
            {showConfig && (
              <div className="mt-3 pt-3 border-t border-[#00f5a0]/20 space-y-2.5 text-xs">
                <div>
                  <label className="status-label block mb-1">ENDPOINT_URL</label>
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="w-full bg-[#04150e]/80 border border-[#00f5a0]/30 px-2 py-1 text-xs text-white outline-none focus:border-[#00f5a0] rounded"
                    placeholder="http://localhost:11434"
                  />
                </div>
                <div>
                  <label className="status-label block mb-1">MODEL_TAG</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-[#04150e]/80 border border-[#00f5a0]/30 px-2 py-1 text-xs text-white outline-none focus:border-[#00f5a0] rounded"
                    placeholder="qwen2.5-coder:7b"
                  />
                </div>
              </div>
            )}
          </div>

          {/* System Telemetry & Event Logs */}
          <div className="hud-glass-panel p-4 flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="status-label text-[#80a99c]">SYSTEM_STATS</div>
                <Activity className="w-3.5 h-3.5 text-[#00f5a0]" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] font-hud-tech mb-1 text-[#80a99c]">
                    <span>PROCESSING_POWER</span>
                    <span className="text-[#00f5a0]">{loading ? '96%' : '14%'}</span>
                  </div>
                  <div className="h-1 bg-[#04150e] w-full rounded overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-[#00f5a0] to-[#ffd166] transition-all duration-500 ${loading ? 'w-[96%] shadow-[0_0_8px_#00f5a0]' : 'w-[14%]'}`}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-hud-tech mb-1 text-[#80a99c]">
                    <span>MEMORY_ALLOCATION</span>
                    <span className="text-[#ffd166]">4.2GB / 8.0GB</span>
                  </div>
                  <div className="h-1 bg-[#04150e] w-full rounded overflow-hidden">
                    <div className="h-full bg-[#00f5a0] w-[52%] opacity-80"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-hud-tech mb-1 text-[#80a99c]">
                    <span>LINK_PROTOCOL</span>
                    <span className="text-[#00f5a0]">REST / API / GENERATE</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#00f5a0]/15 space-y-1.5 font-hud-tech">
              <div className="text-[10px] text-[#80a99c] opacity-60">LOG_EVENT: 0x01_INITIALIZED</div>
              <div className="text-[10px] text-[#80a99c] opacity-75">LOG_EVENT: 0x02_SOCKET_ESTABLISHED</div>
              <div className="text-[10px] text-[#00f5a0] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-ping"></span>
                <span>LOG_EVENT: {loading ? '0x03_PROCESSING_PAYLOAD...' : '0x03_READY_FOR_TRANSMISSION'}</span>
              </div>
            </div>

          </div>

        </aside>

        {/* Main Console & Dialogue Stream */}
        <main className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col hud-glass-panel overflow-hidden">
          
          {/* Dialogue Message Container */}
          <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col">
            
            {/* System Initial Message */}
            <div className="system-msg">
              <span className="system-tag">[ SYSTEM_MESSAGE ]</span>
              <p className="text-sm leading-relaxed text-[#e8f7f2]">
                Welcome, User. I am the local intelligence node running on the Ollama protocol ({model}).
                Invoque um comando ou instrução abaixo para canalizar o modelo neural.
              </p>
            </div>

            {/* Previous User Prompt (if submitted) */}
            {lastUserPrompt && (
              <div className="self-end text-right max-w-[85%] sm:max-w-[75%] space-y-1">
                <div className="status-label text-[#ffd166]">USER_PROMPT</div>
                <div className="bg-[#051c14]/80 backdrop-blur-md p-3 sm:p-3.5 text-sm border border-[#00f5a0]/30 text-[#e8f7f2] text-left font-mono leading-relaxed whitespace-pre-wrap rounded-lg shadow-sm">
                  {lastUserPrompt}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="system-msg animate-pulse">
                <span className="system-tag flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00f5a0] animate-spin" />
                  [ SYSTEM_PROCESSING: CANALIZANDO RESPOSTA... ]
                </span>
                <p className="text-xs sm:text-sm font-mono text-[#00f5a0]/90">
                  Transmitindo payload para {endpoint}/api/generate com modelo {model}...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && !loading && (
              <div className="border-l-4 border-rose-500 bg-rose-950/40 backdrop-blur-md p-4 border border-rose-500/30 text-xs sm:text-sm rounded-r-lg">
                <div className="flex items-center gap-2 font-hud-tech text-rose-400 font-bold tracking-wider uppercase mb-1">
                  <AlertCircle className="w-4 h-4" />
                  [ SYSTEM_ERROR: FALHA DE TRANSMISSÃO ]
                </div>
                <p className="text-rose-200 mb-2 leading-relaxed">{error}</p>
                <div className="bg-[#030d08]/90 p-2.5 border border-rose-500/30 text-[11px] font-mono text-slate-300 rounded">
                  <span className="text-[#00f5a0] font-bold block mb-1 font-hud-tech tracking-wider">
                    DICA DE CORS NO OLLAMA:
                  </span>
                  <code>OLLAMA_ORIGINS="*" ollama serve</code>
                </div>
              </div>
            )}

            {/* Model Response Message */}
            {response && !loading && (
              <div className="system-msg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="system-tag">[ SYSTEM_REPLY ]</span>
                  <button
                    onClick={handleCopyResponse}
                    className="text-[11px] font-hud-tech text-[#00f5a0] hover:text-[#ffd166] flex items-center gap-1 transition-colors px-2 py-0.5 border border-[#00f5a0]/30 bg-[#00f5a0]/10 rounded cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'COPIED' : 'COPY_TEXT'}</span>
                  </button>
                </div>
                <div className="text-sm sm:text-base text-[#e8f7f2] leading-relaxed font-sans whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            )}

          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="border-t border-[#00f5a0]/20 p-3 sm:p-4 bg-[#03150e]/60 backdrop-blur-md flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              id="prompt-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ENTER COMMAND OR PROMPT FOR OLLAMA..."
              disabled={loading}
              className="fantasy-input text-xs sm:text-sm"
            />
            <button
              id="send-button"
              type="submit"
              disabled={loading || !prompt.trim()}
              className="send-btn flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'TRANSMITTING...' : 'TRANSMIT'}</span>
            </button>
          </form>

        </main>

      </div>

      {/* Footer Info */}
      <footer className="mt-3 pt-2 flex flex-wrap justify-between items-center opacity-50 text-[10px] uppercase font-hud-tech tracking-widest text-[#80a99c]">
        <span>Secure_Link: Established</span>
        <span>Target: {endpoint}</span>
        <span>Mana_Resonance: 100%</span>
      </footer>

    </div>
  );
}
