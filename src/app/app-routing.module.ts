import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AccountsComponents} from "./accounts/accounts.components";

const appRoutes: Routes = [
  { path: 'api', component: AccountsComponents },
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
