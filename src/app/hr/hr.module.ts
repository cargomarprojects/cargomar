import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { HrRoutingModule } from './hr.routing.module';

import { HrComponent } from './hr.component';
import { EmpComponent } from './emp/emp.component';
import { TaxplanDetComponent } from './taxplandet/taxplandet.component';
import { TaxPlanComponent } from './taxplan/taxplan.component';
import { SalaryHeadComponent } from './salaryhead/salaryhead.component';
import { SalaryMasterComponent } from './salarymaster/salarymaster.component';
import { PayRollComponent } from './payroll/payroll.component';
import { LeaveDetComponent } from './leavedet/leavedet.component';
import { LeaveMasterComponent } from './leavemaster/leavemaster.component';
import { HrReportsComponent } from './hrreports/hrreports.component';


@NgModule({
  imports: [
    SharedModule,
    HrRoutingModule
  ],
  declarations: [
    HrComponent,
    EmpComponent,
    TaxplanDetComponent,
    TaxPlanComponent,
    SalaryHeadComponent,
    SalaryMasterComponent,
    PayRollComponent,
    LeaveDetComponent,
    LeaveMasterComponent,
    HrReportsComponent
  ],
  providers: [
  ],
})
export class HrModule { }
