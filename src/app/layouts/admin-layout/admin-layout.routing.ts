import { Routes } from '@angular/router';

import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { HomeComponent } from 'app/pages/system/home/home.component';
import { IconsComponent } from 'app/pages/system/icons/icons.component';
import { IsLoginGuard } from 'app/guards/is-login.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: HomeComponent , canActivate: [IsLoginGuard]},
    { path: 'icons', component: IconsComponent },
    { path: 'upgrade', component: UpgradeComponent },
];
