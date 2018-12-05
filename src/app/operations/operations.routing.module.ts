import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsComponent } from './operations.component';
import { HblSeaAirComponent } from './hblseaair/hblseaair.component';
import { MblSeaComponent } from './mblsea/mblsea.component';
import { ContainerComponent } from './container/container.component';
import { GenJobComponent } from './genjob/genjob.component';
import { MblAirComponent } from './mblair/mblair.component';
import { ImpMblSeaAirComponent } from './import/impmblseaair.component';
import { ImpHblSeaAirComponent } from './import/imphblseaair/imphblseaair.component';
import { StuffingComponent } from './stuffing/stuffing.component';
import { VesselLoadingComponent } from './vesselloading/vesselloading.component';
import { LandingCertificateComponent } from './landingcertificate/landingcertificate.component';
import { PreAlertComponent } from './prealert/prealert.component';
import { AirPreAlertComponent } from './prealert/airprealert.component';
import { CostingComponent } from './costing/costing.component';
import { DrCrComponent } from './costing/drcr/drcr.component';
import { AgentInvoiceComponent } from './costing/agentinvoice/agentinvoice.component';
import { AirCostingComponent } from './costing/air/aircosting.component';
import { BlComponent } from './hblseaair/seabl/seabl.component';
import { ConsolerateComponent } from './costing/consolerate/consolerate.component';
import { ConsoleCostingComponent } from './costing/consolecosting/consolecosting.component';

const routes: Routes = [
    { path: 'operations', component: OperationsComponent },
    { path: 'hblseaair', component: HblSeaAirComponent },
    { path: 'mblsea', component: MblSeaComponent },
    { path: 'container', component: ContainerComponent },
    { path: 'genjobm', component: GenJobComponent },
    { path: 'mblair', component: MblAirComponent },
    { path: 'impmblseaair', component: ImpMblSeaAirComponent },
    { path: 'imphblseaair', component: ImpHblSeaAirComponent },
    { path: 'stuffing', component: StuffingComponent },
    { path: 'vesselloading', component: VesselLoadingComponent },
    { path: 'landingcertificate', component: LandingCertificateComponent },
    { path: 'prealert', component: PreAlertComponent },
    { path: 'airprealert', component: AirPreAlertComponent },
    { path: 'costing', component: CostingComponent },
    { path: 'drcrissue', component: DrCrComponent },
    { path: 'agentinvoice', component: AgentInvoiceComponent },
    { path: 'aircosting', component: AirCostingComponent },
    { path: 'seabl', component: BlComponent },
    { path: 'consolerate', component: ConsolerateComponent },
    { path: 'consolecosting', component: ConsoleCostingComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class OperationsRoutingModule {
}
