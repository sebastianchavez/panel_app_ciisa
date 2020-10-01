import { Routes } from '@angular/router';

import { MapsComponent } from '../../maps/maps.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { HomeComponent } from 'app/pages/system/home/home.component';
import { IconsComponent } from 'app/pages/system/icons/icons.component';
import { NotificationsComponent } from 'app/pages/system/notifications/notifications.component';
import { IsLoginGuard } from 'app/guards/is-login.guard';
import { LoginComponent } from 'app/pages/system/login/login.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: HomeComponent , canActivate: [IsLoginGuard]},
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
];
