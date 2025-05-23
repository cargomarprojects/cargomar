import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AccountsRoutingModule } from './accounts.routing.module';

import { AccountsComponent } from './accounts.component';
import { AcctmComponent } from './acctm/acctm.component';


import { AcgroupmComponent } from './acgroupm/acgroupm.component';


import { TaxmComponent } from './taxm/taxm.component';

import { LedgerComponent } from './ledger/Ledger.component';
import { ArApComponent } from './ledger/arap.component';

import { costCenterComponent } from './ledger/cc.component';

import { PendingListComponent } from './ledger/Pendinglist.component';


import { TrialComponent } from './trial/trial.component';

import { PandLComponent } from './pandl/pandl.component';

import { LedgerBalComponent } from './ledgerbal/ledgerbal.component';


import { FcComponent } from './fc/fc.component';

import { OpLedgerComponent } from './ledger/opledger.component';

import { OsComponent } from './os/os.component';
import { OsRemComponent } from './os/osrem.component';

import { ChequeComponent } from './ledger/cheque.component';


import { CcReportComponent } from './ccreport/ccreport.component';
import { ReconComponent } from './Recon/recon.component';

import { RecondateComponent } from './Recon/recondate.component';

import { CostCenterComponent } from './costcenter/costcenter.component';

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

import { StoreModule } from '@ngrx/store';
import { Trialreducer } from './trial/trial.reducer';
import { Pandlreducer } from './pandl/pandl.reducer';
import { LedgerReportreducer } from './ledgerbal/ledgerbal.reducer';

import { TransDetComponent } from './transdet/transdet.report';

import { MoneyTransferComponent } from './moneytransfer/moneytransfer.component';
import { MtReportComponent } from './moneytransfer/mtreport.component';
import { CashBookReportreducer } from './cashbook/cashbook.reducer';
import { CashBookComponent } from './cashbook/cashbook.component';
import { CollectionComponent } from './collection/collection.component';
import { DailyExpComponent } from './dailyexp/dailyexp.component';
import { AddressUpdateComponent } from './ledger/addressupdate.component';
import { AgentPayHistoryComponent } from './agentpayhistory/agentpayhistory.component';
import { BankImportComponent } from './ledger/bankImport.component';
import { TbMonComponent } from './tbmon/tbmon.component';
import { CiGeImportComponent } from './ledger/cigeImport.component';
import { TdsExemptionComponent } from './tdsexempt/tdsexempt.component';
import { OsRemarkComponent } from './os/osrem2.component';
import { TdsCertnoComponent } from './ledger/tdscertno.component';

@NgModule({
  imports: [
    SharedModule,
    AccountsRoutingModule,
    StoreModule.forFeature('trial', Trialreducer),
    StoreModule.forFeature('pandl', Pandlreducer),
    StoreModule.forFeature('ledgerreport', LedgerReportreducer),
    StoreModule.forFeature('cashbook', CashBookReportreducer),
  ],
  declarations: [
    AccountsComponent,
    AcctmComponent,
    TaxmComponent,
    AcgroupmComponent,
    LedgerComponent,
    ArApComponent,
    costCenterComponent,
    PendingListComponent,
    TrialComponent,
    LedgerBalComponent,
    OpLedgerComponent,
    OsComponent,
    ChequeComponent,
    CcReportComponent,
    ReconComponent,
    RecondateComponent,
    CostCenterComponent,
    FcComponent,
    CostAllocationComponent,
    FreeAllocationComponent,
    FreeCrAllocationComponent,
    PandLComponent,
    CostrecoComponent,
    TdsPaidComponent,
    BillWiseComponent,
    ProfitComponent,
    TdsPayComponent,
    OsAgingComponent,
    OsAgentComponent,
    OsAgent2Component,
    OsRemComponent,
    PayHistoryComponent,
    AcTransComponent,
    OscrComponent,
    OscrAgingComponent,
    PayRequestComponent,
    SetlmntComponent,
    TransDetComponent,
    MoneyTransferComponent,
    MtReportComponent,
    CashBookComponent,
    CollectionComponent,
    DailyExpComponent,
    AddressUpdateComponent,
    AgentPayHistoryComponent,
    BankImportComponent,
    TbMonComponent,
    CiGeImportComponent,
    TdsExemptionComponent,
    OsRemarkComponent,
    TdsCertnoComponent
  ],
  providers: [
  ],
  entryComponents: [
    PendingListComponent,
    AddressUpdateComponent
  ]

})
export class AccountsModule { }
