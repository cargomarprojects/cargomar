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
import { WageRegisterComponent } from './wageregister/wageregister.component';
import { BonusComponent } from './bonus/bonus.component';
import { ArrearsComponent } from './arrears/arrears.component';
import { ConsolPayrollComponent } from './consolpayroll/consolpayroll.component';
import { IncLetterComponent } from './incletter/incletter.component';
import { AttendanceRegComponent } from './attendancereg/attendancereg.component';
import { LeaveReqComponent } from './leavereq/leavereq.component';
import { DeductmComponent } from './deduction/deductm.component';
import { DeductmEditComponent } from './deduction/deductm-edit.component';
import { CommonDeductComponent } from './deduction/commondeduct.component';
import { IncentiveComponent } from './incentive/incentive.component';
import { LoanReportComponent } from './loanreport/loanreport.component';
import { TravelExpenseComponent } from './travelexp/travelexp.component';
import { SalMasImportComponent } from './salarymaster/salmasImport.component';

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
    HrReportsComponent,
    WageRegisterComponent,
    BonusComponent,
    ArrearsComponent,
    ConsolPayrollComponent,
    IncLetterComponent,
    AttendanceRegComponent,
    LeaveReqComponent,
    DeductmComponent,
    DeductmEditComponent,
    CommonDeductComponent,
    IncentiveComponent,
    LoanReportComponent,
    TravelExpenseComponent
  ],
  providers: [
  ],
})
export class HrModule { }
