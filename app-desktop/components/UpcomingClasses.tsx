import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Users } from "lucide-react";

const classes = [
  {
    time: "06:00",
    name: "Crossfit - WOD",
    instructor: "Coach Mike",
    spots: "18/20",
    status: "live", // live, upcoming, finished
  },
  {
    time: "07:00",
    name: "Musculação",
    instructor: "Instrutor João",
    spots: "Livre",
    status: "upcoming",
  },
  {
    time: "18:00",
    name: "Muay Thai",
    instructor: "Mestre Silva",
    spots: "12/15",
    status: "upcoming",
  },
  {
    time: "19:00",
    name: "Zumba",
    instructor: "Prof. Ana",
    spots: "25/30",
    status: "upcoming",
  },
  {
    time: "20:00",
    name: "Jiu-Jitsu",
    instructor: "Sensei Carlos",
    spots: "10/20",
    status: "upcoming",
  },
];

export function UpcomingClasses() {
  return (
    <Card className="bg-card border-border/60 h-full">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarClock className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-medium">
              Próximas Aulas
            </CardTitle>
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Hoje
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {classes.map((item, index) => (
            <div
              key={index}
              className="p-4 flex items-center justify-between hover:bg-accent/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded border border-border/60">
                  {item.time}
                </span>
                <div>
                  <p className="font-medium group-hover:text-foreground transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.instructor}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full border border-border/60">
                <Users className="w-3 h-3" />
                {item.spots}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
