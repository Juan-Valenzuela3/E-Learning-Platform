import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { TrendingUp, Award, Clock3, CheckCircle, BookType } from "lucide-react";

const iconComponents = {
  BookType: BookType,
  CheckCircle: CheckCircle,
  Clock3: Clock3,
  Award: Award,
  TrendingUp: TrendingUp
};

export default function DashboardStats({ stats = [
  { title: "Cursos en progreso", value: "3", icon: "BookType", change: "+2 desde la semana pasada" },
  { title: "Cursos completados", value: "5", icon: "CheckCircle", change: "+1 desde la semana pasada" },
  { title: "Horas aprendidas", value: "24h", icon: "Clock3", change: "+5h desde la semana pasada" },
  { title: "Logros", value: "8", icon: "Award", change: "+2 desde la semana pasada" }
] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = iconComponents[stat.icon];
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
