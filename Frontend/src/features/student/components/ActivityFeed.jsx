import { Button } from "@/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { CheckCircle2, BookOpen, Bell, Clock, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ActivityFeed({ activities, onMarkAsRead }) {
  const getActivityIcon = (type) => {
    const iconProps = { className: "h-4 w-4 mt-0.5 flex-shrink-0" };
    
    switch(type) {
      case 'completion':
        return <CheckCircle2 {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case 'new_content':
        return <BookOpen {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      case 'reminder':
        return <Bell {...iconProps} className={`${iconProps.className} text-amber-500`} />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5" />;
    }
  };

  const getActivityAction = (type) => {
    switch(type) {
      case 'completion':
        return 'Completaste';
      case 'new_content':
        return 'Nuevo material en';
      case 'reminder':
        return 'Recordatorio:';
      default:
        return '';
    }
  };

  const formatActivityTime = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: es 
    });
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Clock className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No hay actividad reciente</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Actividad reciente</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start group"
            onClick={() => onMarkAsRead(activity.id)}
          >
            <div className="mr-3">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm group-hover:text-primary transition-colors">
                <span className="font-medium">{getActivityAction(activity.type)}</span>{' '}
                {activity.title}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">
                  {formatActivityTime(activity.time)}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs font-medium text-blue-600">
                  {activity.courseName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <Button variant="ghost" className="text-blue-600 w-full" size="sm">
          Ver toda la actividad
        </Button>
      </CardFooter>
    </Card>
  );
}
