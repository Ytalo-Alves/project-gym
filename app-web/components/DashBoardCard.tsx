import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DashboardCard({ title, value, icon, onClick }: any) {
  const showNotification = title === "Autorizar Check-ins" && Number(value) > 0;

  return (
    <div
      className={`relative group ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {showNotification && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)] z-10" />
      )}

      <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white hover:bg-zinc-900 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
            {title}
          </CardTitle>
          <div className="text-zinc-500 group-hover:text-red-500 transition-colors duration-300 p-2 bg-white/5 rounded-lg group-hover:bg-red-500/10">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold tracking-tight text-zinc-100">
            {value}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
