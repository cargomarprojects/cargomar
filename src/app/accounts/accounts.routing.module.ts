import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsComponent } from './accounts.component';
import { AcctmComponent } from './acctm/acctm.component';

import { LedgerComponent } from './ledger/ledger.component';

import { ArApComponent } from './ledger/arap.component';

import { TaxmComponent } from './taxm/taxm.component';
import { AcgroupmComponent } from './acgroupm/acgroupm.component';

import { TrialComponent } from './trial/trial.component';
import { PandLComponent } from './pandl/pandl.component';

import { LedgerBalComponent } from './ledgerbal/ledgerbal.component';
import { OpLedgerComponent } from './ledger/opledger.component';

import { OsComponent } from './os/os.component';
import { CcReportComponent } from './ccreport/ccreport.component';
import { ReconComponent } from './Recon/recon.component';

import { CostCenterComponent } from './costcenter/costcenter.component';

import { FcComponent } from './fc/fc.component';

import { CostAllocationComponent } from './costallocation/costallocation.component';

import { FreeAllocationComponent } from './ledger/freeallocation.component';

import { FreeCrAllocationComponent } from './ledger/freecrallocation.component';

import { CostrecoComponent } from './costingrecons/costreco.component';

import { TdsPaidComponent } from './tdspaid/tdspaid.component';

import { BillWiseComponent } from './billwise/billwise.component';

import { ProfitComponent } from './profit/profit.component';

import { TdsPayComponent } from './tdspay/tdspay.component';

import { OsAgingComponent } from './osaging/osaging.component';

import { OsAgentComponent } from './osagent/osagent.component';
import { OsAgent2Component } from './osagent/osagent2.component';

import { PayHistoryComponent } from './payhistory/payhistory.component';

import { AcTransComponent } from './actransreport/actrans.report';

import { OscrComponent } from './oscr/oscr.component';

import { OscrAgingComponent } from './oscraging/oscraging.component';
import { PayRequestComponent } from './payrequest/payrequest.component';
import { SetlmntComponent } from './setlmnt/setlmnt.component';

import { TransDetComponent} from './transdet/transdet.report';
import { MtReportComponent} from './moneytransfer/mtreport.component';
import { CashBookComponent } from './cashbook/cashbook.component';
import { CollectionComponent } from './collection/collection.component';
import { DailyExpComponent } from './dailyexp/dailyexp.component';

const routes: Routes = [
  { path: 'accounts', component: AccountsComponent },
  { path: 'acctm', component: AcctmComponent },
  { path: 'taxm', component: TaxmComponent },
  { path: 'acgroupm', component: AcgroupmComponent },
  { path: 'jv', component: LedgerComponent },
  { path: 'trial', component: TrialComponent },
  { path: 'pandl', component: PandLComponent },
  { path: 'ledger', component: LedgerBalComponent },
  { path: 'fc', component: FcComponent },
  { path: 'arap', component: ArApComponent },
  { path: 'op', component: OpLedgerComponent },
  { path: 'os', component: OsComponent },
  { path: 'ccreport', component: CcReportComponent },
  { path: 'recon', component: ReconComponent },
  { path: 'costcenter', component: CostCenterComponent },
  { path: 'costallocation', component: CostAllocationComponent },
  { path: 'osallocation', component: FreeAllocationComponent },
  { path: 'oscrallocation', component: FreeCrAllocationComponent },
  { path: 'costrecon', component: CostrecoComponent },
  { path: 'tdspaid', component: TdsPaidComponent },
  { path: 'billwise', component: BillWiseComponent },
  { path: 'profit', component: ProfitComponent },
  { path: 'tdspay', component: TdsPayComponent },
  { path: 'osaging', component: OsAgingComponent },
  { path: 'osagent', component: OsAgentComponent },
  { path: 'osagent2', component: OsAgent2Component },
  { path: 'payhistory', component: PayHistoryComponent },
  { path: 'actransreport', component: AcTransComponent },
  { path: 'transdetreport', component: TransDetComponent },
  { path: 'oscr', component: OscrComponent },
  { path: 'oscraging', component: OscrAgingComponent },
  { path: 'payrequest', component: PayRequestComponent },
  { path: 'setlmnt', component: SetlmntComponent },
  { path: 'mtreport', component: MtReportComponent},
  { path: 'cashbook', component: CashBookComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'dailyexp', component: DailyExpComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountsRoutingModule {
}
