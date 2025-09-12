import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { ChevronDown, ChevronRight, CheckCircle, Play, Clock, Award, BookOpen } from 'lucide-react';
import ReactPlayer from 'react-player';

// Mock data for course content
const courseData = {
  id: 1,
  title: 'Desarrollo Web Moderno',
  instructor: 'Ana García',
  progress: 75,
  modules: [
    {
      id: 1,
      title: 'Introducción al Desarrollo Web',
      lessons: [
        { id: 1, title: 'Bienvenida al curso', duration: '5 min', completed: true, videoUrl: 'https://www.youtube.com/watch?v=BRAZ8whEAP0' },
        { id: 2, title: 'Configuración del entorno', duration: '15 min', completed: true, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ],
    },
  ],
};

const CourseContent = () => {
  const { courseId } = useParams();
  const [isClient, setIsClient] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [activeLesson, setActiveLesson] = useState(1);
  const [expandedModules, setExpandedModules] = useState([1]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson.id);
    setCurrentVideo(lesson.videoUrl);
  };

  if (!isClient) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contenido del Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {courseData.modules.map((module) => (
                  <div key={module.id} className="border rounded-md overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full text-left p-4 flex justify-between items-center bg-gray-50"
                    >
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                        <span className="font-medium">{module.title}</span>
                      </div>
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedModules.includes(module.id) && (
                      <div className="pl-12 pr-4 pb-2">
                        <ul>
                          {module.lessons.map((lesson) => (
                            <li key={lesson.id} className="py-2">
                              <button
                                onClick={() => handleLessonClick(lesson)}
                                className={`flex items-center w-full text-left ${
                                  activeLesson === lesson.id ? 'text-blue-600 font-medium' : 'text-gray-700'
                                }`}
                              >
                                <span className="mr-2">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Play className="h-4 w-4 text-gray-400" />
                                  )}
                                </span>
                                <span>{lesson.title}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{courseData.title}</h1>
            <p className="text-gray-600 mb-4">Instructor: {courseData.instructor}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${courseData.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{courseData.progress}% completado</span>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Continuar aprendiendo
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <Card className="mb-6">
            <div className="aspect-w-16 aspect-h-9 bg-black">
              {currentVideo ? (
                <ReactPlayer
                  url={currentVideo}
                  width="100%"
                  height="100%"
                  controls
                  onError={(e) => console.error('Error al reproducir el video:', e)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Selecciona una lección para comenzar</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
