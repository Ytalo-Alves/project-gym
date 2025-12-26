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
    <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white h-full">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <CalendarClock className="w-5 h-5 text-orange-500" />
            </div>
            <CardTitle className="text-lg font-medium">
              Próximas Aulas
            </CardTitle>
          </div>
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            Hoje
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {classes.map((item, index) => (
            <div
              key={index}
              className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-zinc-400 bg-zinc-950/50 px-2 py-1 rounded border border-white/5">
                  {item.time}
                </span>
                <div>
                  <p className="font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-zinc-500">{item.instructor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950/30 px-2 py-1 rounded-full">
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
