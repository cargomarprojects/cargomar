import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { CostFircRpt } from '../models/costfircrpt';
import { RepService } from '../services/report.service';

@Component({
    selector: 'app-costfircrptswift',
    templateUrl: './costfircrptswift.component.html',
})
export class CostFircRptSWiftComponent {

    // Local Variables
    title = 'Details';

    @Input() public swift_code: string = "";
    @Input() public base_currency: string = "";
    @Input() public base_exrate: number = 1;
    @Input() public branch_code: string = '';
    @Output() ModifiedRecords = new EventEmitter<any>();

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    urlid: string = "";
    stm_no: number = 0;
    stm_id: string = '';
    modal: any;

    SearchData = {
        parentid: '',
        company_code: '',
        branch_code: this.branch_code,
        swift_code: '',
        base_currency: '',
        base_curr_exrate: 1,
        year_code: ''
    };
    RecordList: CostFircRpt[] = [];

    selectedRowIndex = 0;

    constructor(
         private modalService: NgbModal,
        private mainService: RepService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {
        // URL Query Parameter
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.LoadCombo();
        this.List("NEW");
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

        if (this.swift_code.length <= 0) {
            alert("Invalid  Swift Code");
            return;
        }

        this.loading = true;
        this.SearchData.swift_code = this.swift_code;
        this.SearchData.base_curr_exrate = this.base_exrate;
        this.SearchData.base_currency = this.base_currency;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.branch_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.mainService.CostFircSwiftList(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;

                // if (this.ModifiedRecords != null)
                //     this.ModifiedRecords.emit({ saction: 'LIST', brdramt: response.brdramt, othbrdramt: response.othbrdramt, totcramt: response.totcramt, bankamt: response.bankamt });
            },
                error => {
                    this.loading = false;
                    this.RecordList = new Array<CostFircRpt>();
                    alert(this.gs.getError(error));
                });
    }

    ShowModal(_rec: CostFircRpt, _modal: any) {
        if(this.gs.isBlank(_rec.stm_no))
            return;
        this.stm_id = _rec.stm_pkid;
        this.stm_no = _rec.stm_no;
        this.open(_modal);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    

}
