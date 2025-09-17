import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createCourse } from '@/services/courseService';
import { useAuth } from '@/contexts/AuthContext';
import FormStepIndicator from './FormStepIndicator';
import FormNavigation from './FormNavigation';
import BasicInfoStep from './steps/BasicInfoStep';
import RequirementsStep from './steps/RequirementsStep';
import CourseStructureStep from './steps/CourseStructureStep';
import ReviewStep from './steps/ReviewStep';

const steps = [
  { id: '1', name: 'Información básica' },
  { id: '2', name: 'Requisitos' },
  { id: '3', name: 'Estructura' },
  { id: '4', name: 'Revisar' }
];

const CourseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [course, setCourse] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    subcategory: '',
    difficulty: 'beginner',
    language: 'es',
    price: 0,
    discountPrice: 0,
    requirements: [''],
    learningOutcomes: [''],
    sections: [
      {
        id: Date.now(),
        title: 'Sección 1',
        lectures: [
          { id: Date.now() + 1, title: 'Introducción', type: 'video', duration: '5:00' }
        ]
      }
    ]
  });

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return course.title.trim() !== '' && 
               course.subtitle.trim() !== '' &&
               course.description.trim() !== '' && 
               course.category.trim() !== '' &&
               course.difficulty.trim() !== '' &&
               course.language.trim() !== '';
      case 2:
        return course.requirements.some(req => req.trim() !== '') && 
               course.learningOutcomes.some(lo => lo.trim() !== '');
      case 3:
        return course.sections.every(section => 
          section.title.trim() !== '' && 
          section.lectures.every(lecture => lecture.title.trim() !== '')
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast.error('Por favor completa todos los campos requeridos antes de continuar');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const { user } = useAuth();

  const prepareCourseData = (status) => {
    // Mapear los datos del formulario al formato esperado por la API
    return {
      title: course.title,
      description: course.description,
      shortDescription: course.subtitle,
      instructorId: user?.id, // ID del instructor autenticado
      youtubeUrls: course.sections.flatMap(section => 
        section.lectures
          .filter(lecture => lecture.type === 'video' && lecture.videoUrl)
          .map(lecture => lecture.videoUrl)
      ),
      thumbnailUrl: course.thumbnailUrl || '',
      price: parseFloat(course.price) || 0,
      isPremium: parseFloat(course.price) > 0,
      isPublished: status === 'published',
      isActive: true,
      estimatedHours: Math.ceil(
        course.sections.reduce((total, section) => {
          return total + section.lectures.reduce((sectionTotal, lecture) => {
            const [minutes = 0] = (lecture.duration || '0:00').split(':').map(Number);
            return sectionTotal + minutes;
          }, 0);
        }, 0) / 60
      ) || 1,
      // Agregar categoría y nivel cuando estén disponibles en el formulario
      // category: course.category,
      // level: course.difficulty,
    };
  };

  const handleSubmit = async (e, status = 'draft') => {
    e.preventDefault();
    
    if (!validateStep(currentStep) && status === 'published') {
      toast.error('Por favor completa todos los campos requeridos antes de publicar');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const courseData = prepareCourseData(status);
      await createCourse(courseData);
      
      toast.success(
        status === 'draft' 
          ? 'Borrador guardado correctamente' 
          : '¡Curso publicado exitosamente!'
      );
      
      navigate('/teacher/courses');
    } catch (error) {
      console.error('Error al guardar el curso:', error);
      const message = error.message || (
        status === 'draft' 
          ? 'Error al guardar el borrador. Por favor, inténtalo de nuevo.'
          : 'Error al publicar el curso. Por favor, inténtalo de nuevo.'
      );
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <BasicInfoStep course={course} setCourse={setCourse} />;
      case 2:
        return <RequirementsStep course={course} setCourse={setCourse} />;
      case 3:
        return <CourseStructureStep course={course} setCourse={setCourse} />;
      case 4:
        return <ReviewStep course={course} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Crear Nuevo Curso
      </h1>
      
      <FormStepIndicator steps={steps} currentStep={currentStep} />
      
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={(e) => handleSubmit(e, 'published')}>
            {renderStep()}
            
            <FormNavigation 
              currentStep={currentStep}
              totalSteps={steps.length}
              onNext={nextStep}
              onBack={prevStep}
              isSubmitting={isSubmitting}
              onSaveDraft={(e) => handleSubmit(e, 'draft')}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
