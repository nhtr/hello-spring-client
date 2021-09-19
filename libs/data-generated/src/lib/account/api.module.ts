import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { AccountConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class AccountApiModule {
    public static forRoot(configurationFactory: () => AccountConfiguration): ModuleWithProviders<AccountApiModule> {
        return {
            ngModule: AccountApiModule,
            providers: [ { provide: AccountConfiguration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: AccountApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('AccountApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
