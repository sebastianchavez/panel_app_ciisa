import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLogin: boolean = false
     constructor(public location: Location, public router: Router) {
      this.isAuth()
     }
    ngOnInit(){
    }

    isMap(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }
    isAuth() {
      if(localStorage.getItem('isLogin')){
          this.isLogin = true
      } else {
          this.router.navigateByUrl('/login')
      }
  }
}
