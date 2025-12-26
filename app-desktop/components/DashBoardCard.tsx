import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DashboardCard({ title, value, icon, onClick }: any) {
  const showNotification = title === "Autorizar Check-ins" && Number(value) > 0;

  return (
    <div
      className={`relative group ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {showNotification && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse shadow-[0_0_10px_color-mix(in_oklab,var(--color-destructive),transparent_45%)] z-10" />
      )}

      <Card className="bg-card/60 border-border/60 hover:bg-card/75 hover:border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground/70 transition-colors">
            {title}
          </CardTitle>
          <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300 p-2 bg-accent/30 rounded-lg group-hover:bg-primary/10">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-semibold tracking-tight">{value}</span>
        </CardContent>
      </Card>
    </div>
  );
}
