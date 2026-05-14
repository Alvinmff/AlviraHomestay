import { AlertTriangle, Info, XCircle } from "lucide-react";
import Link from "next/link";

interface AlertData {
  type: "warning" | "destructive" | "info";
  title: string;
  description: string;
  link?: string;
}

export function AdminAlerts({ alerts }: { alerts: AlertData[] }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "destructive":
        return <XCircle className="h-4 w-4 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 flex-shrink-0" />;
      case "info":
      default:
        return <Info className="h-4 w-4 flex-shrink-0" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case "destructive":
        return "border-red-300 bg-red-50 text-red-700 dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-400";
      case "warning":
        return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-400";
      case "info":
      default:
        return "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/50 dark:bg-blue-500/10 dark:text-blue-400";
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div key={index} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${getStyle(alert.type)}`}>
          <div className="mt-0.5">
            {getIcon(alert.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{alert.title}</p>
            <p className="text-sm opacity-80 mt-0.5">
              {alert.description}{" "}
              {alert.link && (
                <Link href={alert.link} className="underline font-medium hover:opacity-100 transition-opacity">
                  Tindak Lanjuti &rarr;
                </Link>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
