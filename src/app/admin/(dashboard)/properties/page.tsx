import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Kelola Properti</h2>
          <p className="text-muted-foreground mt-1">Atur detail dan foto untuk tiap properti.</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Manajemen Akomodasi (Dalam Pengembangan)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
            <Building2 className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Segera Hadir</h3>
            <p>Fitur untuk mengubah detail harga, deskripsi, dan foto properti sedang dikembangkan untuk fase selanjutnya.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
