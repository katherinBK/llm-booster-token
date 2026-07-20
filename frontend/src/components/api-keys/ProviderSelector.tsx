import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { providers, type LLMProvider, type LLMModel } from "@/lib/providers";
import { cn } from "@/lib/utils";

interface ProviderSelectorProps {
  selectedProvider: string | null;
  selectedModel: string | null;
  onSelectProvider: (id: string) => void;
  onSelectModel: (id: string) => void;
}

const ProviderSelector = ({ selectedProvider, selectedModel, onSelectProvider, onSelectModel }: ProviderSelectorProps) => {
  const activeProvider = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="space-y-4">
      {/* Provider cards */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Proveedor</p>
        <div className="grid grid-cols-2 gap-3">
          {providers.map((provider) => {
            const isSelected = selectedProvider === provider.id;
            return (
              <button
                key={provider.id}
                onClick={() => onSelectProvider(provider.id)}
                className={cn(
                  "relative text-left rounded-xl border p-4 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50"
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <span className={cn("text-2xl", provider.color)}>{provider.logo}</span>
                <p className="text-sm font-semibold text-foreground mt-2">{provider.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{provider.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model selection */}
      {activeProvider && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Modelo</p>
          <div className="space-y-2">
            {activeProvider.models.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => onSelectModel(model.id)}
                  className={cn(
                    "w-full text-left rounded-xl border p-4 transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{model.name}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                          <Zap className="w-3 h-3" />
                          {model.rTokenMultiplier}x
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{model.description}</p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-xs text-muted-foreground">Input / Output</p>
                      <p className="text-xs font-mono font-medium text-foreground">
                        ${model.inputPrice} / ${model.outputPrice}
                      </p>
                      <p className="text-[10px] text-muted-foreground">por 1M tokens</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                    <span>Contexto: {model.contextWindow}</span>
                    <span className="text-accent font-medium">
                      Ahorro rToken: ~{Math.round((model.rTokenMultiplier - 1) * 100)}% más requests
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProviderSelector;
