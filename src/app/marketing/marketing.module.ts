import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarketingRoutingModule } from './marketing.routing.module';
import { ContactsComponent } from './contacts/contacts.component';

@NgModule({
  imports: [
    SharedModule,
    MarketingRoutingModule
  ],
  declarations: [
    ContactsComponent
    
  ],
  providers: [
  ],
})
export class MarketingModule { }
