import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { CostFircRpt } from '../models/costfircrpt';
import { RepService } from '../services/report.service';

@Component({
    selector: 'app-costfircrpt',
    templateUrl: './costfircrpt.component.html',
    providers: [RepService]
})

export class CostFircRptComponent {
    title = 'Cost FIRC Report'

    @Input() menuid: string = '';
    @Input() type: string = '';

    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string = '';
    selectedRowIndex = 0;
    ErrorMessage = "";
    mode = '';
    pkid = '';

    from_date: string = '';
    to_date: string = '';
    branch_name: string = '';
    branch_code: string = '';

    agent_id: string = '';
    agent_code: string = '';
    agent_name: string = '';

    brdramt: number = 0;
    othbrdramt: number = 0;
    totcramt: number = 0;
    bankamt: number = 0;

    disableSave = true;
    bCompany = false;
    all: boolean = false;
    loading = false;
    currentTab = 'LIST';
    searchstring = '';
    stm_no: number = 0;
    stm_id: string = '';
    modal: any;

    SearchData = {
        type: '',
        rec_category: '',
        pkid: '',
        report_folder: '',
        company_code: '',
        branch_code: '',
        branch_name: '',
        year_code: '',
        searchstring: '',
        from_date: '',
        to_date: '',
        agent_id: '',
        agent_name: ''
    };

    // Array For Displaying List
    RecordList: CostFircRpt[] = [];
    // Single Record for add/edit/view details
    Record: CostFircRpt = new CostFircRpt;

    // BRRECORD: SearchTable = new SearchTable();
    AGENTRECORD: SearchTable = new SearchTable();
    BRRECORD: SearchTable = new SearchTable();
    constructor(
        private modalService: NgbModal,
        private mainService: RepService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                this.InitCompleted = true;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                this.InitComponent();
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {
        this.bCompany = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
        }

        this.Init();
        this.initLov();
        this.LoadCombo();
    }

    Init() {

        this.RecordList = new Array<CostFircRpt>();
        this.from_date = this.gs.defaultValues.lastmonthdate;
        this.to_date = this.gs.defaultValues.today;
        this.agent_id = '';
        this.agent_name = '';
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    initLov(caption: string = '') {

        this.AGENTRECORD = new SearchTable();
        this.AGENTRECORD.controlname = "AGENT";
        this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
        this.AGENTRECORD.displaycolumn = "NAME";
        this.AGENTRECORD.type = "CUSTOMER";
        this.AGENTRECORD.id = "";
        this.AGENTRECORD.code = "";
        this.AGENTRECORD.name = "";

        this.BRRECORD = new SearchTable();
        this.BRRECORD.controlname = "BRANCH";
        this.BRRECORD.displaycolumn = "CODE";
        this.BRRECORD.type = "BRANCH";
        this.BRRECORD.id = "";
        this.BRRECORD.code = "";
        this.BRRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "AGENT") {
            this.agent_id = _Record.id;
            this.agent_code = _Record.code;
            this.agent_name = _Record.name;
        }
        if (_Record.controlname == "BRANCH") {
            this.branch_code = _Record.code;
            this.branch_name = _Record.name;
        }
    }
    LoadCombo() {
    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
    }

    ResetControls() {
        this.disableSave = true;
        if (!this.menu_record)
            return;

        if (this.menu_record.rights_admin)
            this.disableSave = false;
        if (this.mode == "ADD" && this.menu_record.rights_add)
            this.disableSave = false;
        if (this.mode == "EDIT" && this.menu_record.rights_edit)
            this.disableSave = false;

        return this.disableSave;
    }

    // Query List Data
    List(_type: string) {

        this.ErrorMessage = '';
        if (this.from_date.trim().length <= 0) {
            this.ErrorMessage = "From Date Cannot Be Blank";
            alert(this.ErrorMessage);
            return;
        }
        if (this.to_date.trim().length <= 0) {
            this.ErrorMessage = "To Date Cannot Be Blank";
            alert(this.ErrorMessage);
            return;
        }

        if (this.gs.isBlank(this.branch_code)) {
            this.ErrorMessage = "Branch Cannot Be Blank";
            alert(this.ErrorMessage);
            return;
        }

        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        if (this.branch_code) {
            this.SearchData.branch_code = this.branch_code;
            this.SearchData.branch_name = this.branch_name;
        } else {
            this.SearchData.branch_code = '';
            this.SearchData.branch_name = '';
        }
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.searchstring.toUpperCase();
        this.SearchData.type = _type;
        this.SearchData.from_date = this.from_date;
        this.SearchData.to_date = this.to_date;
        this.SearchData.agent_id = this.agent_id;
        this.SearchData.agent_name = this.agent_name;

        this.ErrorMessage = '';
        this.mainService.CostFircList(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                }
            },
                error => {
                    this.loading = false;
                    this.RecordList = new Array<CostFircRpt>();
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }
    OnChange(field: string) {
        this.RecordList = new Array<CostFircRpt>();
    }
    Close() {
        this.gs.ClosePage('home');
    }

    OnBlur(field: string) {
        switch (field) {
            case 'searchstring':
                {
                    this.searchstring = this.searchstring.trim().toUpperCase();
                    break;
                }
        }
    }

    ShowModal(_rec: CostFircRpt, _modal: any) {
        this.ErrorMessage = '';
        this.stm_id = _rec.stm_pkid;
        this.stm_no = _rec.stm_no;
        this.open(_modal);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    ModifiedRecords(params: any) {
        this.brdramt = params.brdramt;
        this.othbrdramt = params.othbrdramt;
        this.totcramt = params.totcramt;
        this.bankamt = params.bankamt;
    }
}
