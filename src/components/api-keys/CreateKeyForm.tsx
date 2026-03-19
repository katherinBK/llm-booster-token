import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProviderSelector from "./ProviderSelector";
import { generateRandomKey, type ApiKey } from "./types";
import { getModel } from "@/lib/providers";

interface CreateKeyFormProps {
  onCreated: (key: ApiKey) => void;
  onCancel: () => void;
}

const CreateKeyForm = ({ onCreated, onCancel }: CreateKeyFormProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSelectProvider = (id: string) => {
    setSelectedProvider(id);
    setSelectedModel(null);
  };

  const handleNext = () => {
    if (!selectedProvider || !selectedModel) {
      setError("Selecciona un proveedor y modelo");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleCreate = () => {
    const trimmed = keyName.trim();
    if (!trimmed) {
      setError("Ingresa un nombre para la clave");
      return;
    }
    if (trimmed.length > 50) {
      setError("Máximo 50 caracteres");
      return;
    }

    const model = getModel(selectedProvider!, selectedModel!);

    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: trimmed,
      key: generateRandomKey(selectedProvider!),
      providerId: selectedProvider!,
      modelId: selectedModel!,
      createdAt: new Date(),
      lastUsed: null,
      requestCount: 0,
      rTokensGenerated: 0,
    };

    onCreated(newKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-card border border-border rounded-xl p-6">
        {/* Header with steps */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              1
            </div>
            <span className={`text-xs font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>Proveedor</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              2
            </div>
            <span className={`text-xs font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>Nombre</span>
          </div>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProviderSelector
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              onSelectProvider={handleSelectProvider}
              onSelectModel={setSelectedModel}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre de la API Key</label>
              <input
                type="text"
                placeholder="ej: production-backend, mi-app-web"
                value={keyName}
                onChange={(e) => { setKeyName(e.target.value); setError(null); }}
                maxLength={50}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Pay-as-you-go</p>
              <p>Solo pagas por lo que usas. Los rTokens generados en Solana subsidian cada request, dándote más uso por el mismo precio.</p>
            </div>
          </motion.div>
        )}

        {error && (
          <p className="text-xs text-destructive mt-3">{error}</p>
        )}

        <div className="flex items-center justify-between mt-5">
          <Button variant="ghost" size="sm" onClick={step === 1 ? onCancel : () => setStep(1)} className="gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            {step === 1 ? "Cancelar" : "Atrás"}
          </Button>

          {step === 1 ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleNext}
              disabled={!selectedProvider || !selectedModel}
              className="gap-1.5"
            >
              Siguiente <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={handleCreate}>
              Generar API Key
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateKeyForm;
