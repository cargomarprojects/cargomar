import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpComponent } from './emp/emp.component';
import { TaxplanDetComponent } from './taxplandet/taxplandet.component';
import { TaxPlanComponent } from './taxplan/taxplan.component';
import { SalaryHeadComponent } from './salaryhead/salaryhead.component';
import { SalaryMasterComponent } from './salarymaster/salarymaster.component';
import { PayRollComponent } from './payroll/payroll.component';
import { LeaveDetComponent } from './leavedet/leavedet.component';
import { LeaveMasterComponent } from './leavemaster/leavemaster.component';
import { HrReportsComponent } from './hrreports/hrreports.component';
import { WageRegisterComponent } from './wageregister/wageregister.component';
import { BonusComponent } from './bonus/bonus.component';
import { ArrearsComponent } from './arrears/arrears.component';
import { ConsolPayrollComponent } from './consolpayroll/consolpayroll.component';

const routes: Routes = [
  { path: 'emp', component: EmpComponent },
  { path: 'taxplandet', component: TaxplanDetComponent },
  { path: 'taxplan', component: TaxPlanComponent },
  { path: 'salaryhead', component: SalaryHeadComponent },
  { path: 'salarymaster', component: SalaryMasterComponent },
  { path: 'payroll', component: PayRollComponent },
  { path: 'leavedet', component: LeaveDetComponent },
  { path: 'leavemaster', component: LeaveMasterComponent },
  { path: 'hrreports', component: HrReportsComponent },
  { path: 'wageregister', component: WageRegisterComponent },
  { path: 'bonus', component: BonusComponent },
  { path: 'consolpayroll', component: ConsolPayrollComponent },
  { path: 'arrears', component: ArrearsComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class HrRoutingModule {
}
