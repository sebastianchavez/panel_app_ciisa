import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


//********** Dependencies **********/
import { ModalModule } from 'ngx-bootstrap/modal';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

//********** Components **********/
import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { AppComponent } from './app.component';

//********** Pages **********/
import { LoginComponent } from './pages/system/login/login.component';
import { RegisterComponent } from './pages/system/register/register.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SearchPipe } from './pipes/search.pipe';
import { UsersComponent } from './pages/admins/users/users.component';
import { SegmentationComponent } from './pages/admins/segmentation/segmentation.component';
import { NotificationsComponent } from './pages/admins/notifications/notifications.component';
import { ReportsComponent } from './pages/admins/reports/reports.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NewsComponent } from './pages/admins/news/news.component';
import { ActivitiesComponent } from './pages/admins/activities/activities.component';
import { ReportNotificationsComponent } from './pages/reports/report-notifications/report-notifications.component';
import { ReportNewsComponent } from './pages/reports/report-news/report-news.component';
import { ReportActivitiesComponent } from './pages/reports/report-activities/report-activities.component';
import { ReportUsersComponent } from './pages/reports/report-users/report-users.component';
import { LbdModule } from './lbd/lbd.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { InterceptorService } from './interceptors/interceptor.service';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    SweetAlert2Module.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TimepickerModule.forRoot(),
    LbdModule,
    NgSelectModule,
    NgOptionHighlightModule,
    CommonModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    RegisterComponent,
    SearchPipe,
    UsersComponent,
    SegmentationComponent,
    NotificationsComponent,
    ReportsComponent,
    CalendarComponent,
    NewsComponent,
    ActivitiesComponent,
    ReportNotificationsComponent,
    ReportNewsComponent,
    ReportActivitiesComponent,
    ReportUsersComponent,
    TranslatePipe,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
