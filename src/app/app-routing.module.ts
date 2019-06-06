import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AccountsComponent} from "./accounts/accounts.component";

const appRoutes: Routes = [
  { path: 'api', component: AccountsComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
