import { Button } from "@/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { Calendar, Clock, MoreHorizontal, Video } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { es } from "date-fns/locale";

const getEventDateLabel = (date) => {
  if (isToday(new Date(date))) return 'Hoy';
  if (isTomorrow(new Date(date))) return 'Mañana';
  
  return format(new Date(date), 'EEEE d MMMM', { locale: es });
};

export default function UpcomingEvents({ events, onJoinEvent }) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximos eventos</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No hay eventos programados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Próximos eventos</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="group flex items-start">
            <div className="bg-blue-50 p-2 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {event.title}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 mt-1 space-y-1 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {format(new Date(event.startTime), 'HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                  </span>
                </div>
                <span className="hidden sm:inline-block text-gray-300">•</span>
                <div className="flex items-center">
                  <Video className="h-3 w-3 mr-1" />
                  <span className="truncate">{event.platform || 'Plataforma por definir'}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getEventDateLabel(event.startTime)}
                </span>
              </div>
            </div>
            <div className="ml-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap"
                onClick={() => onJoinEvent(event.id)}
              >
                Unirse
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <Button variant="ghost" className="text-blue-600 w-full" size="sm">
          Ver calendario completo
        </Button>
      </CardFooter>
    </Card>
  );
}
