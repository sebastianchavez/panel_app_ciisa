import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/users', title: 'Usuarios',  icon:'pe-7s-user', class: '' },
    { path: '/segmentations', title: 'Segmentación', icon: 'pe-7s-network', class: ''},
    { path: '/activities', title: 'Actividades', icon: 'pe-7s-graph1', class: ''},
    { path: '/news', title: 'Noticias', icon: 'pe-7s-news-paper', class: ''},
    { path: '/notifications', title: 'Notificaciones', icon: 'pe-7s-paper-plane', class: ''},
    { path: '/reports', title: 'Reportería', icon: 'pe-7s-graph3', class: ''}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  logOut(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
