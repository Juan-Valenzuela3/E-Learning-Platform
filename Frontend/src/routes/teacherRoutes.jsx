import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import TeacherDashboard from '@/features/teacher/components/TeacherDashboard';
import Courses from '@/features/teacher/components/Courses';
import TeacherRoute from '@/interfaces/routing/guards/TeacherRoute';
import VideoProductionGuide from '@/features/teacher/components/VideoProductionGuide';
import NewCourse from '@/features/teacher/components/NewCourse';

// Lazy load other teacher components
const Students = lazy(() => import('@/features/teacher/components/Students'));
const Analytics = lazy(() => import('@/features/teacher/components/Analytics'));
const CourseDetail = lazy(() => import('@/features/teacher/components/CourseDetail'));

const teacherRoutes = [
  {
    path: '/teacher',
    element: (
      <TeacherRoute>
        <TeacherDashboard />
      </TeacherRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <TeacherDashboard />,
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            element: <Courses />,
          },
          {
            path: 'new',
            element: <NewCourse />,
          },
          {
            path: 'edit/:id',
            element: <NewCourse isEditing={true} />,
          },
          {
            path: ':id',
            element: <CourseDetail />,
          },
        ],
      },
      {
        path: 'students',
        element: <Students />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'video-guide',
        element: <VideoProductionGuide />,
      },
    ],
  },
];

export default teacherRoutes;
