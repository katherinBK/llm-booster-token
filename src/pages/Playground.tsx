import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Zap, ChevronDown, Terminal, RotateCcw } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { kairoSupabase } from "@/integrations/supabase/kairo-client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  tokens?: number;
  latency?: number;
  rtokens?: number;
}

interface ApiKeyOption {
  id: string;
  name: string;
  key: string;
  providerId: string;
  modelId: string;
}

const BACKEND_URL = import.meta.env.DEV ? "http://localhost:3001/v1/chat/completions" : "/v1/chat/completions";

const Playground = () => {
  const [keys, setKeys] = useState<ApiKeyOption[]>([]);
  const [selectedKey, setSelectedKey] = useState<ApiKeyOption | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Fetch user's API keys
  useEffect(() => {
    const loadKeys = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await kairoSupabase.from("api_keys").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const mapped = data.map((k: any) => ({ id: k.id, name: k.name, key: k.encrypted_key, providerId: k.provider_id, modelId: k.model_id }));
        setKeys(mapped);
        setSelectedKey(mapped[0]);
      }
    };
    loadKeys();
  }, []);

  // Fetch recent logs (last 5)
  const fetchRecentLogs = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await kairoSupabase.from("usage_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
    if (data) setRecentLogs(data);
  }, []);

  useEffect(() => {
    fetchRecentLogs();
  }, [fetchRecentLogs]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedKey || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const start = Date.now();

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${selectedKey.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedKey.modelId,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const latency = Date.now() - start;
      const tokens = data.usage?.total_tokens || 0;
      const rtokens = Math.floor(tokens / 10);
      const assistantText = data.choices?.[0]?.message?.content || "(Sin respuesta)";

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
        timestamp: new Date(),
        tokens,
        latency,
        rtokens,
      };

      setMessages(prev => [...prev, assistantMsg]);
      // Refresh logs after a short delay to let the backend write them
      setTimeout(fetchRecentLogs, 1200);

    } catch (err: any) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `❌ Error: ${err.message}${import.meta.env.DEV ? '\\n\\nAsegúrate de que el backend esté corriendo en http://localhost:3001' : ''}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Playground
            </h1>
            <p className="text-xs text-muted-foreground">Prueba tus API Keys directamente desde el dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            {/* API Key Selector */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
              >
                {selectedKey ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="max-w-[180px] truncate">{selectedKey.name}</span>
                    <Badge variant="secondary" className="text-[10px] px-1">{selectedKey.providerId}</Badge>
                  </>
                ) : (
                  <span className="text-muted-foreground">Sin API Key</span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 mt-1 w-72 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {keys.length === 0 ? (
                      <p className="text-xs text-muted-foreground p-4">No tienes API Keys. Ve a API Keys para crear una.</p>
                    ) : keys.map(k => (
                      <button
                        key={k.id}
                        onClick={() => { setSelectedKey(k); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors text-sm ${selectedKey?.id === k.id ? "bg-primary/5" : ""}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{k.name}</p>
                          <p className="text-[10px] text-muted-foreground">{k.providerId} · {k.modelId}</p>
                        </div>
                        {selectedKey?.id === k.id && <span className="ml-auto text-primary text-xs">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button variant="ghost" size="icon" onClick={clearChat} title="Limpiar chat">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">Kairo Playground</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      {selectedKey
                        ? `Prueba tu clave "${selectedKey.name}" usando ${selectedKey.providerId}`
                        : "Crea y selecciona una API Key para comenzar"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["¿Qué es Solana?", "Explícame qué son los rTokens", "Escribe un Hola Mundo en Rust", "¿Cómo funciona Kairo?"].map(s => (
                      <button key={s} onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                        className="text-xs text-left px-3 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "gradient-primary" : "bg-muted border border-border"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-foreground" />}
                    </div>
                    <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "gradient-primary text-white rounded-tr-sm" : "bg-card border border-border text-foreground rounded-tl-sm"}`}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-3 px-1">
                        <span className="text-[10px] text-muted-foreground">{msg.timestamp.toLocaleTimeString()}</span>
                        {msg.tokens && <span className="text-[10px] text-muted-foreground font-mono">{msg.tokens} tokens</span>}
                        {msg.latency && <span className="text-[10px] text-muted-foreground">{msg.latency}ms</span>}
                        {msg.rtokens && <span className="text-[10px] text-accent font-semibold">+{msg.rtokens} rTokens</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-card border border-border rounded-tl-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Procesando via {selectedKey?.providerId}...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-background">
              {!selectedKey && (
                <p className="text-xs text-center text-muted-foreground mb-2">Selecciona una API Key arriba para comenzar</p>
              )}
              <div className="flex gap-2 items-end bg-card border border-border rounded-xl p-2 focus-within:border-primary/50 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder={selectedKey ? `Enviar mensaje usando ${selectedKey.name}...  (Enter para enviar, Shift+Enter nueva línea)` : "Selecciona una API Key para empezar"}
                  disabled={!selectedKey || loading}
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none px-2 py-1 max-h-40"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!selectedKey || !input.trim() || loading}
                  size="icon"
                  className="h-9 w-9 shrink-0 gradient-primary hover:opacity-90"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Live Logs Panel */}
          <div className="w-80 border-l border-border bg-card/50 flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Logs en Vivo</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={fetchRecentLogs}>
                <RotateCcw className="w-3 h-3 mr-1" />Refresh
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {recentLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
                  <Terminal className="w-6 h-6 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">Los logs aparecerán aquí después de cada request</p>
                </div>
              ) : recentLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-background border border-border rounded-lg p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={log.status_code === 200 ? "default" : "destructive"} className="text-[10px] px-1.5 py-0">
                      {log.status_code}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{log.latency_ms}ms</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div>
                      <p className="text-muted-foreground">Tokens</p>
                      <p className="font-mono font-semibold text-foreground">{(log.tokens_input + log.tokens_output).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">rTokens</p>
                      <p className="font-mono font-semibold text-accent">+{log.rtokens_generated}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Provider</p>
                      <p className="font-semibold text-foreground capitalize">{log.provider_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Costo</p>
                      <p className="font-mono font-semibold text-foreground">${log.cost_usd?.toFixed(5)}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Playground;
