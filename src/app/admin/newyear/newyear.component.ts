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
    title = 'NEW FIN-YEAR';
    loading = false;
    currentTab = 'DETAILS';
    
    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    

    ErrorMessage = "User Details";
    
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
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;

        //this.List("NEW"); this is moved to LoadCombo Function
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
            finyear : 2001
        }

        this.mainService.newyear(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Save Complete";
        
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
