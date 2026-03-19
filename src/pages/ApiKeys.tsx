import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Key, AlertTriangle } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ApiKeyCard from "@/components/api-keys/ApiKeyCard";
import CreateKeyForm from "@/components/api-keys/CreateKeyForm";
import type { ApiKey } from "@/components/api-keys/types";

const ApiKeys = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreated = useCallback((newKey: ApiKey) => {
    setKeys((prev) => [newKey, ...prev]);
    setIsCreating(false);
    setShowKeyId(newKey.id);
    toast({ title: "API Key creada", description: "Copia tu clave ahora. No podrás verla de nuevo más adelante." });
  }, [toast]);

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
            <p className="text-xs text-muted-foreground">Genera claves vinculadas a tu proveedor de LLM preferido</p>
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
                No compartas tus claves ni las expongas en código cliente. Cada clave está vinculada a un proveedor y modelo específico.
              </p>
            </div>
          </div>

          {/* Create form */}
          <AnimatePresence>
            {isCreating && (
              <CreateKeyForm
                onCreated={handleCreated}
                onCancel={() => setIsCreating(false)}
              />
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
              <p className="text-xs text-muted-foreground mb-4">Elige tu proveedor de LLM y genera tu primera clave</p>
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
