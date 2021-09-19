import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ShellModule } from "@hello-spring-client/feature/shell";
import { ACCOUNT_BASE_PATH } from "@hello-spring-client/data-generated";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [AppComponent],
    imports: [BrowserModule, ShellModule],
  providers: [
    {
      provide: ACCOUNT_BASE_PATH,
      useValue: environment.accountUrl
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
