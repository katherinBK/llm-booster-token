import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, Trash2, Eye, EyeOff, Key, CheckCircle2, AlertTriangle } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
}

const generateRandomKey = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "rk_live_";
  let result = prefix;
  for (let i = 0; i < 40; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const maskKey = (key: string) => {
  return key.slice(0, 12) + "•".repeat(24) + key.slice(-6);
};

const ApiKeys = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreate = useCallback(() => {
    const trimmed = newKeyName.trim();
    if (!trimmed) {
      toast({ title: "Nombre requerido", description: "Ingresa un nombre para identificar la clave.", variant: "destructive" });
      return;
    }
    if (trimmed.length > 50) {
      toast({ title: "Nombre muy largo", description: "El nombre debe tener máximo 50 caracteres.", variant: "destructive" });
      return;
    }

    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: trimmed,
      key: generateRandomKey(),
      createdAt: new Date(),
      lastUsed: null,
    };

    setKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    setIsCreating(false);
    setShowKeyId(newKey.id);

    toast({ title: "API Key creada", description: "Copia tu clave ahora. No podrás verla de nuevo más adelante." });
  }, [newKeyName, toast]);

  const handleCopy = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Copiada", description: "La API key fue copiada al portapapeles." });
  }, [toast]);

  const handleDelete = useCallback((id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    setConfirmDeleteId(null);
    toast({ title: "API Key eliminada", description: "La clave fue revocada permanentemente." });
  }, [toast]);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">API Keys</h1>
            <p className="text-xs text-muted-foreground">Genera y gestiona tus claves de acceso a la API</p>
          </div>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4" /> Nueva clave
          </Button>
        </header>

        <div className="p-8 max-w-4xl space-y-6">
          {/* Security notice */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Tus API keys son secretas</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                No compartas tus claves ni las expongas en código cliente. Úsalas solo desde tu backend.
              </p>
            </div>
          </div>

          {/* Create form */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Crear nueva API Key</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Nombre descriptivo (ej: production-backend)"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      maxLength={50}
                      className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    <Button variant="default" size="sm" onClick={handleCreate}>
                      Generar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setIsCreating(false); setNewKeyName(""); }}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keys list */}
          {keys.length === 0 && !isCreating ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-12 text-center"
            >
              <Key className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">No tienes API keys</p>
              <p className="text-xs text-muted-foreground mb-4">Crea tu primera clave para empezar a hacer requests</p>
              <Button variant="hero" size="sm" className="gap-2" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4" /> Crear primera clave
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {keys.map((apiKey, i) => {
                const isVisible = showKeyId === apiKey.id;
                const isDeleting = confirmDeleteId === apiKey.id;

                return (
                  <motion.div
                    key={apiKey.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{apiKey.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Creada {apiKey.createdAt.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                          {apiKey.lastUsed
                            ? ` · Último uso ${apiKey.lastUsed.toLocaleDateString("es-ES")}`
                            : " · Nunca usada"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 text-xs text-success font-medium mr-2">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Activa
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-lg px-3 py-2 font-mono text-xs text-foreground select-all overflow-hidden">
                        {isVisible ? apiKey.key : maskKey(apiKey.key)}
                      </div>
                      <button
                        onClick={() => setShowKeyId(isVisible ? null : apiKey.id)}
                        className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        title={isVisible ? "Ocultar" : "Mostrar"}
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(apiKey.key)}
                        className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        title="Copiar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-1">
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(apiKey.id)}>
                            Confirmar
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                            No
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(apiKey.id)}
                          className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                          title="Revocar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApiKeys;
