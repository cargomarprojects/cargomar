import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { CostFircRpt } from '../models/costfircrpt';
import { RepService } from '../services/report.service';

@Component({
    selector: 'app-costfircrptdet',
    templateUrl: './costfircrptdet.component.html',
})
export class CostFircRptDetComponent {

    // Local Variables
    title = 'Details';

    @Input() public pkid: string = "";
    @Input() public type: string = '';

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    urlid: string = "";

    SearchData = {
        parentid: '',
        company_code: '',
        branch_code: '',
        year_code: ''
    };
    RecordList: CostFircRpt[] = [];

    selectedRowIndex = 0;

    constructor(
        private mainService: RepService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {
        // URL Query Parameter
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.LoadCombo();
        // this.List("NEW");
    }

    InitComponent() {
        this.InitLov();
    }

    InitLov() {


    }
    LovSelected(_Record: SearchTable) {

    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }

    LoadCombo() {


    }

    // Save Data
    OnBlur(field: string) {

    }
    Close() {

    }

    List(_type: string) {

        if (this.pkid.length <= 0) {
            alert("Invalid ID");
            return;
        }

        this.loading = true;
        this.SearchData.parentid = this.pkid;
        this.SearchData.company_code = this.gs.globalVariables.year_code;
        this.SearchData.branch_code = this.gs.globalVariables.year_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.mainService.CostFircDetList(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.RecordList = new Array<CostFircRpt>();
                    alert(this.gs.getError(error));
                });
    }

}
