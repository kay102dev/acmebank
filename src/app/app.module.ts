import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AccountsComponent} from "./accounts/accounts.component";
import {AppRoutingModule} from "./app-routing.module";
import {FooterComponent} from "./footer/footer.component";
import {HeaderComponent} from "./header/header.component";
import {AccountUrlService} from "./accounts/account.url.service";
import {HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent, AccountsComponent, FooterComponent, HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [AccountUrlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
