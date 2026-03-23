import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Key, AlertTriangle, Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ApiKeyCard from "@/components/api-keys/ApiKeyCard";
import CreateKeyForm from "@/components/api-keys/CreateKeyForm";
import type { ApiKey } from "@/components/api-keys/types";
import { supabase } from "@/integrations/supabase/client";
import { kairoSupabase } from "@/integrations/supabase/kairo-client";

const ApiKeys = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchKeys = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await kairoSupabase
      .from("api_keys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setKeys(data.map((k) => ({
        id: k.id,
        name: k.name,
        key: k.encrypted_key,
        providerId: k.provider_id,
        modelId: k.model_id,
        createdAt: new Date(k.created_at),
        lastUsed: k.last_used_at ? new Date(k.last_used_at) : null,
        requestCount: k.request_count,
        rTokensGenerated: k.rtokens_generated,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const handleCreated = useCallback(async (newKey: ApiKey) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await kairoSupabase.from("api_keys").insert({
      user_id: user.id,
      name: newKey.name,
      provider_id: newKey.providerId,
      model_id: newKey.modelId,
      encrypted_key: newKey.key,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    await fetchKeys();
    setIsCreating(false);
    toast({ title: "API Key creada", description: "Tu clave ha sido guardada de forma segura." });
  }, [toast, fetchKeys]);

  const handleCopy = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Copiada", description: "La API key fue copiada al portapapeles." });
  }, [toast]);

  const handleDelete = useCallback(async (id: string) => {
    const { error } = await kairoSupabase.from("api_keys").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
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
            <p className="text-xs text-muted-foreground">Conecta tu propio proveedor LLM (BYOK) o genera claves Kairo</p>
          </div>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4" /> Nueva clave
          </Button>
        </header>

        <div className="p-8 max-w-4xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Bring Your Own Key (BYOK)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Conecta tu API key de OpenAI, OpenRouter o Google directamente. Kairo optimiza tus requests con rTokens sin importar el proveedor.
                </p>
              </div>
            </div>
            
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
              <Key className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Punto de Integración (Base URL)</p>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Usa tu clave Kairo en cualquier SDK (OpenAI/LangChain) cambiando la Base URL. Solo necesitas el header estándar <code className="bg-muted px-1 py-0.5 rounded">Authorization: Bearer</code>.
                </p>
                <code className="text-xs bg-background border border-border px-2 py-1 rounded text-foreground font-mono select-all">
                  http://localhost:3001/v1
                </code>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isCreating && (
              <CreateKeyForm onCreated={handleCreated} onCancel={() => setIsCreating(false)} />
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : keys.length === 0 && !isCreating ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-12 text-center">
              <Key className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">No tienes API keys</p>
              <p className="text-xs text-muted-foreground mb-4">Conecta tu proveedor LLM o genera una clave Kairo</p>
              <Button variant="hero" size="sm" className="gap-2" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4" /> Crear primera clave
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {keys.map((apiKey, i) => (
                <ApiKeyCard
                  key={apiKey.id}
                  apiKey={apiKey}
                  index={i}
                  isVisible={showKeyId === apiKey.id}
                  isDeleting={confirmDeleteId === apiKey.id}
                  onToggleVisibility={() => setShowKeyId(showKeyId === apiKey.id ? null : apiKey.id)}
                  onCopy={() => handleCopy(apiKey.key)}
                  onRequestDelete={() => setConfirmDeleteId(apiKey.id)}
                  onConfirmDelete={() => handleDelete(apiKey.id)}
                  onCancelDelete={() => setConfirmDeleteId(null)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApiKeys;
