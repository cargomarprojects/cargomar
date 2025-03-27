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
import { IncLetterComponent } from './incletter/incletter.component';
import { AttendanceRegComponent } from './attendancereg/attendancereg.component';
import { LeaveReqComponent } from './leavereq/leavereq.component';
import { DeductmComponent } from './deduction/deductm.component';
import { CommonDeductComponent } from './deduction/commondeduct.component';
import { IncentiveComponent } from './incentive/incentive.component';
import { LoanReportComponent } from './loanreport/loanreport.component';
import { TravelExpenseComponent } from './travelexp/travelexp.component';

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
  { path: 'arrears', component: ArrearsComponent },
  { path: 'incletter', component: IncLetterComponent },
  { path: 'attendancereg', component: AttendanceRegComponent },
  { path: 'leavereq', component: LeaveReqComponent },
  { path: 'deductionmaster', component: DeductmComponent },
  { path: 'commondeduct', component: CommonDeductComponent },
  { path: 'incentive', component: IncentiveComponent},
  { path: 'loanreport', component: LoanReportComponent},
  { path: 'travelexp', component: TravelExpenseComponent},
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
