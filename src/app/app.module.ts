import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


//********** Dependencies **********/
import { ModalModule } from 'ngx-bootstrap/modal';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Ng2Rut } from 'ng2-rut';


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
    Ng2Rut
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    RegisterComponent,
    SearchPipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
