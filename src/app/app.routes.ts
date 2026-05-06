import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { CourseList } from './features/courses/course-list';
import { CourseDetail } from './features/courses/course-detail';
import { LearningClassroom } from './features/courses/learning-classroom';
import { Login } from './features/auth/login';
import { Register } from './features/auth/register';
import { ForgotPassword } from './features/auth/forgot-password';
import { ProfileDashboard } from './features/profile/profile-dashboard';
import { AdminPanel } from './features/admin/admin-panel';
import { About } from './features/about/about';

import { FinalExam } from './features/courses/final-exam';
import { CertificateViewer } from './features/profile/certificate-viewer';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'courses', component: CourseList },
  { path: 'courses/:id', component: CourseDetail },
  { path: 'learning/:id', component: LearningClassroom },
  { path: 'exam/:id', component: FinalExam },
  { path: 'about', component: About },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'auth/forgot-password', component: ForgotPassword },
  { path: 'profile', component: ProfileDashboard },
  { path: 'certificates/:id', component: CertificateViewer },
  { path: 'admin', component: AdminPanel },
  { path: '**', redirectTo: '' }
];
