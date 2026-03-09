import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Pengaturan</h2>
          <p className="text-muted-foreground mt-1">Konfigurasi akun dan preferensi dashboard.</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Pengaturan Sistem (Dalam Pengembangan)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Segera Hadir</h3>
            <p>Halaman pengaturan akun, password, dan integrasi WhatsApp sedang dalam pembuatan.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
