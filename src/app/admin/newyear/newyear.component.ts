import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';
import { ModuleService } from '../services/module.service';

@Component({
    selector: 'app-newyear',
    templateUrl: './newyear.component.html',
    providers : [ModuleService]
})
export class NewYearComponent {
    // Local Variables 
    title = 'Transfer Balance';
    loading = false;
    currentTab = 'DETAILS';
    
    sub: any;
    urlid: string;

    year_code : string;

    ErrorMessage = "";
    
    mode = '';
    pkid = '';

    // Modules List

    // Array For Displaying List
    // Single Record for add/edit/view details

    constructor(
        private mainService: ModuleService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

        this.year_code = this.gs.globalVariables.year_code;

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
    }

    NewRecord() {
    }

    // Save Data
    NewYear() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';

        //this.Record._globalvariables = this.gs.globalVariables;

        let SearchData = {
            current_year : this.gs.globalVariables.year_code,
            company_code :this.gs.globalVariables.comp_code,
            branch_code :this.gs.globalVariables.branch_code,
            user_code :this.gs.globalVariables.user_code,            
        }

        this.mainService.newyear(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = response.status;
                alert(this.ErrorMessage);
            },
            error => {
              this.loading = false;
              this.ErrorMessage = this.gs.getError(error);
                
            });
    }

    TransferBalance() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';

        //this.Record._globalvariables = this.gs.globalVariables;

        let SearchData = {
            current_year : this.gs.globalVariables.year_code,
            company_code :this.gs.globalVariables.comp_code,
            branch_code :this.gs.globalVariables.branch_code,
            user_code :this.gs.globalVariables.user_code,
        }

        this.mainService.TransferBalance(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = response.status;
                alert(this.ErrorMessage);
            },
            error => {
              this.loading = false;
              this.ErrorMessage = this.gs.getError(error);
                
            });
    }




    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
       

        return bret;
    }

    Close() {
        this.gs.ClosePage('home');
    }


}
