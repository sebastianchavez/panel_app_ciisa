import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './pages/system/login/login.component';
import { RegisterComponent } from './pages/system/register/register.component';
import { IsLoginGuard } from './guards/is-login.guard';
import { UsersComponent } from './pages/admins/users/users.component';
import { SegmentationComponent } from './pages/admins/segmentation/segmentation.component';
import { ActivitiesComponent } from './pages/admins/activities/activities.component';
import { NewsComponent } from './pages/admins/news/news.component';
import { ReportsComponent } from './pages/admins/reports/reports.component';
import { NotificationsComponent } from './pages/admins/notifications/notifications.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [IsLoginGuard],
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule',
      }, {
        path: 'users',
        component: UsersComponent
      }, {
        path: 'segmentations',
        component: SegmentationComponent
      },{
        path:'activities',
        component: ActivitiesComponent
      },{
        path: 'news',
        component: NewsComponent
      },{
        path: 'notifications',
        component: NotificationsComponent
      },{
        path: 'reports',
        component: ReportsComponent
      }],
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // {
  //   path: '**',
  //   redirectTo: 'dashboard'
  // }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
