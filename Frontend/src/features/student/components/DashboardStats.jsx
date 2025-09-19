import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import {
  TrendingUp,
  Award,
  Clock3,
  CheckCircle,
  BookType,
  Users,
  Target,
} from "lucide-react";

const iconComponents = {
  BookType: BookType,
  CheckCircle: CheckCircle,
  Clock3: Clock3,
  Award: Award,
  TrendingUp: TrendingUp,
  Users: Users,
  Target: Target,
};

export default function DashboardStats({ stats = [] }) {
  if (stats.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = iconComponents[stat.icon];
        const isPositive =
          stat.change &&
          (stat.change.includes("+") ||
            stat.change.includes("completado") ||
            stat.change.includes("activo"));

        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              {IconComponent && (
                <div className="p-2 rounded-full bg-blue-100">
                  <IconComponent className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p
                className={`text-xs font-medium ${
                  isPositive ? "text-green-600" : "text-gray-500"
                }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
