import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Shield, Globe, Moon, Sun, Database } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Search } from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [webhookNotifications, setWebhookNotifications] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
            <p className="text-xs text-muted-foreground">Configuración de tu cuenta y preferencias</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold ml-1">U</div>
          </div>
        </header>

        <div className="p-8 max-w-4xl">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="profile" className="text-xs gap-1.5"><User className="w-3.5 h-3.5" />Perfil</TabsTrigger>
              <TabsTrigger value="security" className="text-xs gap-1.5"><Shield className="w-3.5 h-3.5" />Seguridad</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs gap-1.5"><Bell className="w-3.5 h-3.5" />Notificaciones</TabsTrigger>
              <TabsTrigger value="preferences" className="text-xs gap-1.5"><Globe className="w-3.5 h-3.5" />Preferencias</TabsTrigger>
              <TabsTrigger value="data" className="text-xs gap-1.5"><Database className="w-3.5 h-3.5" />Datos</TabsTrigger>
            </TabsList>

            {/* Profile */}
            <TabsContent value="profile">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 space-y-6">
                <h3 className="text-sm font-semibold text-foreground">Información del perfil</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Nombre</Label>
                    <Input placeholder="Tu nombre" className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" placeholder="tu@email.com" className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Organización</Label>
                    <Input placeholder="Nombre de empresa" className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Rol</Label>
                    <Input placeholder="Developer" className="text-sm" />
                  </div>
                </div>
                <Button size="sm">Guardar cambios</Button>
              </motion.div>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 space-y-6">
                <h3 className="text-sm font-semibold text-foreground">Seguridad</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Contraseña actual</Label>
                    <Input type="password" className="text-sm max-w-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Nueva contraseña</Label>
                    <Input type="password" className="text-sm max-w-sm" />
                  </div>
                  <Button size="sm">Actualizar contraseña</Button>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Autenticación de dos factores</p>
                      <p className="text-xs text-muted-foreground">Añade una capa extra de seguridad</p>
                    </div>
                    <Button variant="outline" size="sm">Activar 2FA</Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-semibold text-foreground">Notificaciones</h3>
                {[
                  { label: "Notificaciones por email", desc: "Recibe alertas de uso y facturación", value: emailNotifications, setter: setEmailNotifications },
                  { label: "Webhooks", desc: "Envía eventos a tu endpoint personalizado", value: webhookNotifications, setter: setWebhookNotifications },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.value} onCheckedChange={item.setter} />
                  </div>
                ))}
                {webhookNotifications && (
                  <div className="space-y-2 pt-2">
                    <Label className="text-xs">Webhook URL</Label>
                    <Input placeholder="https://tu-servidor.com/webhook" className="text-sm" />
                    <Button size="sm" variant="outline">Guardar webhook</Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-semibold text-foreground">Preferencias</h3>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Modo oscuro</p>
                    <p className="text-xs text-muted-foreground">Cambia la apariencia del dashboard</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-muted-foreground" />
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Idioma</p>
                    <p className="text-xs text-muted-foreground">Selecciona el idioma de la interfaz</p>
                  </div>
                  <Button variant="outline" size="sm">Español</Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Data / Persistence */}
            <TabsContent value="data">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-semibold text-foreground">Gestión de datos</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium text-foreground">Exportar datos</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Descarga un respaldo completo de tu historial de uso, claves y configuraciones.</p>
                    <Button variant="outline" size="sm">Exportar todo</Button>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive">Zona de peligro</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">Eliminar tu cuenta y todos los datos asociados. Esta acción es irreversible.</p>
                    <Button variant="destructive" size="sm">Eliminar cuenta</Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
