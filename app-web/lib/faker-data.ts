// Static data for check-ins (no random generation)
export interface CheckInRecord {
  id: string;
  studentName: string;
  studentId: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  duration: number | null; // in minutes
  status: "active" | "completed";
}

// Static check-in data - always returns the same data
export function generateTodayCheckIns(): CheckInRecord[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const staticData = [
    { name: "João Silva", hour: 6, minute: 15, duration: 90, active: false },
    { name: "Maria Santos", hour: 6, minute: 30, duration: 75, active: false },
    {
      name: "Pedro Oliveira",
      hour: 7,
      minute: 0,
      duration: 120,
      active: false,
    },
    { name: "Ana Souza", hour: 7, minute: 20, duration: 85, active: false },
    {
      name: "Carlos Rodrigues",
      hour: 8,
      minute: 0,
      duration: 60,
      active: false,
    },
    {
      name: "Juliana Ferreira",
      hour: 8,
      minute: 30,
      duration: 95,
      active: false,
    },
    { name: "Lucas Alves", hour: 9, minute: 0, duration: 110, active: false },
    {
      name: "Fernanda Pereira",
      hour: 9,
      minute: 15,
      duration: 70,
      active: false,
    },
    { name: "Rafael Lima", hour: 10, minute: 0, duration: 80, active: false },
    { name: "Camila Gomes", hour: 10, minute: 30, duration: 65, active: false },
    { name: "Bruno Costa", hour: 11, minute: 0, duration: 90, active: false },
    {
      name: "Beatriz Ribeiro",
      hour: 11,
      minute: 45,
      duration: 75,
      active: false,
    },
    {
      name: "Felipe Martins",
      hour: 12,
      minute: 0,
      duration: 55,
      active: false,
    },
    {
      name: "Larissa Carvalho",
      hour: 14,
      minute: 0,
      duration: 100,
      active: false,
    },
    {
      name: "Gustavo Rocha",
      hour: 14,
      minute: 30,
      duration: 85,
      active: false,
    },
    {
      name: "Amanda Almeida",
      hour: 15,
      minute: 0,
      duration: 70,
      active: false,
    },
    {
      name: "Rodrigo Nascimento",
      hour: 16,
      minute: 0,
      duration: 95,
      active: false,
    },
    {
      name: "Patrícia Araújo",
      hour: 16,
      minute: 30,
      duration: 80,
      active: false,
    },
    { name: "Thiago Melo", hour: 17, minute: 0, duration: 90, active: false },
    {
      name: "Mariana Barbosa",
      hour: 17,
      minute: 15,
      duration: 85,
      active: false,
    },
    {
      name: "Diego Cardoso",
      hour: 17,
      minute: 45,
      duration: 75,
      active: false,
    },
    {
      name: "Gabriela Correia",
      hour: 18,
      minute: 0,
      duration: 100,
      active: false,
    },
    { name: "Matheus Dias", hour: 18, minute: 20, duration: 95, active: false },
    {
      name: "Isabela Fernandes",
      hour: 18,
      minute: 40,
      duration: 80,
      active: false,
    },
    { name: "André Freitas", hour: 19, minute: 0, duration: 90, active: false },
    {
      name: "Carolina Mendes",
      hour: 19,
      minute: 15,
      duration: 85,
      active: false,
    },
    {
      name: "Leonardo Moreira",
      hour: 19,
      minute: 30,
      duration: 75,
      active: false,
    },
    { name: "Renata Nunes", hour: 19, minute: 45, duration: 70, active: false },
    {
      name: "Vinicius Silva",
      hour: 20,
      minute: 0,
      duration: 65,
      active: false,
    },
    {
      name: "Letícia Santos",
      hour: 20,
      minute: 20,
      duration: 60,
      active: false,
    },
    {
      name: "Marcelo Oliveira",
      hour: 20,
      minute: 40,
      duration: 55,
      active: false,
    },
    { name: "Aline Souza", hour: 21, minute: 0, duration: 50, active: false },
    // Active users (currently in the gym)
    {
      name: "Ricardo Rodrigues",
      hour: 17,
      minute: 30,
      duration: null,
      active: true,
    },
    {
      name: "Vanessa Ferreira",
      hour: 17,
      minute: 45,
      duration: null,
      active: true,
    },
    { name: "Daniel Alves", hour: 18, minute: 0, duration: null, active: true },
    {
      name: "Priscila Pereira",
      hour: 18,
      minute: 15,
      duration: null,
      active: true,
    },
    {
      name: "Eduardo Lima",
      hour: 18,
      minute: 30,
      duration: null,
      active: true,
    },
    {
      name: "Tatiana Gomes",
      hour: 18,
      minute: 45,
      duration: null,
      active: true,
    },
    { name: "Fábio Costa", hour: 19, minute: 0, duration: null, active: true },
    {
      name: "Cristina Ribeiro",
      hour: 19,
      minute: 10,
      duration: null,
      active: true,
    },
    {
      name: "Paulo Martins",
      hour: 19,
      minute: 20,
      duration: null,
      active: true,
    },
    {
      name: "Simone Carvalho",
      hour: 19,
      minute: 30,
      duration: null,
      active: true,
    },
    {
      name: "Roberto Rocha",
      hour: 19,
      minute: 40,
      duration: null,
      active: true,
    },
    {
      name: "Adriana Almeida",
      hour: 19,
      minute: 50,
      duration: null,
      active: true,
    },
  ];

  const checkIns: CheckInRecord[] = staticData.map((data, index) => {
    const checkInTime = new Date(today);
    checkInTime.setHours(data.hour, data.minute, 0, 0);

    let checkOutTime: Date | null = null;
    let status: "active" | "completed" = "active";

    if (!data.active && data.duration !== null) {
      checkOutTime = new Date(checkInTime.getTime() + data.duration * 60000);
      status = "completed";
    }

    return {
      id: `check-in-${index}`,
      studentName: data.name,
      studentId: `student-${index}`,
      checkInTime,
      checkOutTime,
      duration: data.duration,
      status,
    };
  });

  // Sort by check-in time (most recent first)
  return checkIns.sort(
    (a, b) => b.checkInTime.getTime() - a.checkInTime.getTime()
  );
}

// Get currently active check-ins (people in the gym)
export function getCurrentOccupancy(checkIns: CheckInRecord[]): number {
  return checkIns.filter((c) => c.status === "active").length;
}

// Generate hourly distribution for peak hours chart
export function generateHourlyDistribution(
  checkIns: CheckInRecord[]
): { hour: number; count: number }[] {
  const distribution: { [key: number]: number } = {};

  // Initialize all hours from 6 AM to 11 PM
  for (let hour = 6; hour <= 23; hour++) {
    distribution[hour] = 0;
  }

  // Count check-ins per hour
  checkIns.forEach((checkIn) => {
    const hour = checkIn.checkInTime.getHours();
    if (hour >= 6 && hour <= 23) {
      distribution[hour]++;
    }
  });

  return Object.entries(distribution).map(([hour, count]) => ({
    hour: parseInt(hour),
    count,
  }));
}

// Calculate statistics - now with static values
export function calculateStats(checkIns: CheckInRecord[]) {
  const today = checkIns.length;
  const thisWeek = 385;
  const thisMonth = 1542;
  const averageDaily = 51;
  const peakHour = generateHourlyDistribution(checkIns).reduce(
    (max, curr) => (curr.count > max.count ? curr : max),
    { hour: 0, count: 0 }
  );

  return {
    today,
    thisWeek,
    thisMonth,
    averageDaily,
    peakHour: `${peakHour.hour}:00 - ${peakHour.hour + 1}:00`,
  };
}

// Format time for display
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format duration
export function formatDuration(minutes: number | null): string {
  if (minutes === null) return "-";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
}
