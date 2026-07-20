import { motion } from "framer-motion";
import { Copy, Trash2, Eye, EyeOff, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProvider, getModel } from "@/lib/providers";
import { maskKey, type ApiKey } from "./types";

interface ApiKeyCardProps {
  apiKey: ApiKey;
  index: number;
  isVisible: boolean;
  isDeleting: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

const ApiKeyCard = ({
  apiKey,
  index,
  isVisible,
  isDeleting,
  onToggleVisibility,
  onCopy,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: ApiKeyCardProps) => {
  const provider = getProvider(apiKey.providerId);
  const model = getModel(apiKey.providerId, apiKey.modelId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={provider?.color || "text-foreground"}>{provider?.logo}</span>
            <p className="text-sm font-semibold text-foreground">{apiKey.name}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {provider?.name || apiKey.providerId}
            </span>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {model?.name || apiKey.modelId}
            </span>
            {model && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3" />
                {model.rTokenMultiplier}x
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Creada {apiKey.createdAt.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
            {apiKey.lastUsed
              ? ` · Último uso ${apiKey.lastUsed.toLocaleDateString("es-ES")}`
              : " · Nunca usada"}
            {" · "}{apiKey.requestCount} requests · {apiKey.rTokensGenerated.toFixed(2)} rTokens
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-accent font-medium shrink-0 ml-2">
          <CheckCircle2 className="w-3.5 h-3.5" /> Activa
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted rounded-lg px-3 py-2 font-mono text-xs text-foreground select-all overflow-hidden">
          {isVisible ? apiKey.key : maskKey(apiKey.key)}
        </div>
        <button
          onClick={onToggleVisibility}
          className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title={isVisible ? "Ocultar" : "Mostrar"}
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button
          onClick={onCopy}
          className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title="Copiar"
        >
          <Copy className="w-4 h-4" />
        </button>

        {isDeleting ? (
          <div className="flex items-center gap-1">
            <Button variant="destructive" size="sm" onClick={onConfirmDelete}>
              Confirmar
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancelDelete}>
              No
            </Button>
          </div>
        ) : (
          <button
            onClick={onRequestDelete}
            className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
            title="Revocar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ApiKeyCard;
