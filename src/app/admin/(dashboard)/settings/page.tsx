import { Settings, User, Lock, MessageCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Pengaturan Sistem</h2>
          <p className="text-muted-foreground mt-1">Konfigurasi akun admin, keamanan, dan integrasi pihak ketiga.</p>
        </div>
      </div>

      <Tabs defaultValue="account" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 p-1 rounded-xl mb-8">
          <TabsTrigger value="account" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <User className="w-4 h-4" /> <span className="hidden sm:inline">Pengaturan Akun</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <Lock className="w-4 h-4" /> <span className="hidden sm:inline">Keamanan & Password</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">Integrasi WhatsApp</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="border-border/50 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl">
              <AlertCircle className="w-10 h-10 text-primary mb-3 opacity-80" />
              <h3 className="text-lg font-bold text-foreground">Dalam Pengembangan</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
                Fitur edit profil administrator sedang dalam tahap penyelesaian.
              </p>
            </div>
            <CardHeader className="opacity-40 pointer-events-none">
              <CardTitle className="font-serif">Profil Administrator</CardTitle>
              <CardDescription>Ubah detail informasi kontak dan nama tampilan Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 opacity-40 pointer-events-none">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input defaultValue="Admin Utama" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="admin@alvirahomestay.com" disabled />
                </div>
              </div>
              <Button disabled>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-border/50 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl">
              <AlertCircle className="w-10 h-10 text-primary mb-3 opacity-80" />
              <h3 className="text-lg font-bold text-foreground">Dalam Pengembangan</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
                Modul pembaruan kata sandi saat ini sedang diuji coba untuk alasan keamanan.
              </p>
            </div>
            <CardHeader className="opacity-40 pointer-events-none">
              <CardTitle className="font-serif">Ganti Kata Sandi</CardTitle>
              <CardDescription>Pastikan kata sandi Anda kuat untuk mengamankan data booking tamu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md opacity-40 pointer-events-none">
              <div className="space-y-2">
                <Label>Kata Sandi Lama</Label>
                <Input type="password" value="********" disabled />
              </div>
              <div className="space-y-2">
                <Label>Kata Sandi Baru</Label>
                <Input type="password" value="********" disabled />
              </div>
              <div className="space-y-2">
                <Label>Konfirmasi Kata Sandi Baru</Label>
                <Input type="password" value="********" disabled />
              </div>
              <Button disabled>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="border-border/50 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-50/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/30 rounded-xl">
              <Settings className="w-10 h-10 text-emerald-600 mb-3 opacity-80 animate-spin-slow" />
              <h3 className="text-lg font-bold text-emerald-900">Integrasi API Sedang Dibuat</h3>
              <p className="text-sm text-emerald-800/70 text-center max-w-md mt-1">
                Bot WhatsApp (Wablas/Fonnte) untuk notifikasi otomatis ke tamu saat ini sedang dalam proses review Meta.
              </p>
            </div>
            <CardHeader className="opacity-40 pointer-events-none">
              <CardTitle className="font-serif flex items-center gap-2">
                Notifikasi WhatsApp Otomatis
              </CardTitle>
              <CardDescription>Kirim invoice dan pengingat check-in otomatis ke nomor tamu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 opacity-40 pointer-events-none">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-emerald-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Koneksi API WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">Status: Terputus</p>
                  </div>
                </div>
                <Button variant="outline" disabled>Hubungkan Ulang</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
