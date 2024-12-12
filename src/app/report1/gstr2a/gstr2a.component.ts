import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { RepService } from '../services/report.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-gstr2a',
    templateUrl: './gstr2a.component.html',
    providers: [RepService]
})

export class Gstr2aComponent {
    title = 'GSTR-2A Report'

    @Input() menuid: string = '';
    @Input() type: string = '';

    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    ErrorMessage = "";
    mode = '';
    pkid = '';
    modal: any;
    selectedRowIndex = 0;
    recon_year: string = "0";
    recon_month: string = "0";
    retn_period: string = "";
    state_code: string = "";
    state_name: string = "";

    branch_code: string = '';
    format_type: string = '';
    from_date: string = '';
    to_date: string = '';
    searchstring = '';
    display_format_type: string = '';
    round_off: number = 5;
    chk_pending: boolean = true;

    bPrint = false;
    bDocs: boolean = false;
    bAdmin: boolean = false;
    bSave: boolean = false;
    bSaveOtp: boolean = false;
    bCompany = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    MonList: any[] = [];

    SearchData = {
        type: '',
        pkid: '',
        report_folder: '',
        company_code: '',
        branch_code: '',
        year_code: '',
        searchstring: '',
        from_date: '',
        to_date: '',
        format_type: '',
        user_code: '',
        state_name: '',
        state_code: '',
        round_off: 5,
        recon_year: 0,
        recon_month: 0,
        chk_pending: this.chk_pending,
        hide_ho_entries: this.gs.globalVariables.hide_ho_entries,
        reverse_charge: 'NO'
    };

    // Array For Displaying List
    RecordList: Gstr2bDownload[] = [];
    //  Single Record for add/edit/view details
    Record: Gstr2bDownload = new Gstr2bDownload;


    constructor(
        private modalService: NgbModal,
        public mainService: RepService,
        private route: ActivatedRoute,
        private gs: GlobalService
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
        this.bAdmin = false;
        this.bPrint = false;
        this.bSave = false;
        this.bSaveOtp = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            this.bCompany = this.menu_record.rights_company;
            this.bAdmin = this.menu_record.rights_admin;
            this.bPrint = this.menu_record.rights_print;
            if (this.menu_record.rights_add || this.menu_record.rights_edit)
                this.bSave = true;
            if (this.menu_record.rights_approval.length > 0) {
                if (this.menu_record.rights_approval.toString().indexOf('{SAVEOTP}') >= 0)
                    this.bSaveOtp = true;
            }
            if (this.gs.globalVariables.user_code == "ADMIN")
                this.bSaveOtp = true;
        }
        this.initLov();
        this.LoadCombo();
        this.Init();
    }

    Init() {
        this.branch_code = this.gs.globalVariables.branch_code;
        this.from_date = this.gs.defaultValues.monthbegindate;
        this.to_date = this.gs.defaultValues.today;
        this.display_format_type = this.format_type;
        this.state_code = this.gs.globalVariables.branch_gstin_state_code;
        this.state_name = this.gs.globalVariables.branch_gstin_state_name;
        var tempdt = this.gs.defaultValues.today.split('-');
        if (tempdt.length > 1) {
            this.recon_year = tempdt[0];
            this.recon_month = tempdt[1];
        }
    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    initLov(caption: string = '') {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "STATE") {
            this.state_code = _Record.code;
            this.state_name = _Record.name;
        }

    }
    LoadCombo() {
        this.MonList = [{ "id": "01", "name": "JANUARY" }, { "id": "02", "name": "FEBRUARY" }, { "id": "03", "name": "MARCH" }
            , { "id": "04", "name": "APRIL" }, { "id": "05", "name": "MAY" }, { "id": "06", "name": "JUNE" }
            , { "id": "07", "name": "JULY" }, { "id": "08", "name": "AUGUST" }, { "id": "09", "name": "SEPTEMBER" }
            , { "id": "10", "name": "OCTOBER" }, { "id": "11", "name": "NOVEMBER" }, { "id": "12", "name": "DECEMBER" }];

        // this.loading = true;
        // let SearchData = {
        //   comp_code: this.gs.globalVariables.comp_code,
        //   branch_code: this.gs.globalVariables.branch_code
        // };
        // SearchData.comp_code = this.gs.globalVariables.comp_code;
        // SearchData.branch_code = this.gs.globalVariables.branch_code;
        // this.ErrorMessage = '';
        // this.mainService.LoadDefault(SearchData)
        //   .subscribe(response => {
        //     this.loading = false;
        //     // this.BranchList = response.branchlist;
        //   },
        //     error => {
        //       this.loading = false;
        //       this.ErrorMessage = this.gs.getError(error);
        //     });

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


    // // Query List Data
    List(_type: string) {
        if (this.gs.isBlank(this.state_name)) {
            alert("State Cannot be Blank");
            return;
        }
        if (+this.recon_year <= 0) {
            alert("Invalid Year");
            return;
        } else if (+this.recon_year < 100) {
            alert("YEAR FORMAT : - YYYY ");
            return;
        }
        if (+this.recon_month <= 0 || +this.recon_month > 12) {
            alert("Invalid Month");
            return;
        }

        this.display_format_type = this.format_type;
        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.user_code = this.gs.globalVariables.user_code;
        this.SearchData.searchstring = this.gs.defaultValues.gst_recon_searchstring.toUpperCase();
        this.SearchData.type = _type;
        this.SearchData.state_code = this.gs.defaultValues.gst_recon_state_code;
        this.SearchData.state_name = this.gs.defaultValues.gst_recon_state_name;
        this.SearchData.recon_year = +this.recon_year;
        this.SearchData.recon_month = +this.recon_month;
        this.ErrorMessage = '';
        this.mainService.Gstr2aReport(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL') {
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                }
                else {
                    this.RecordList = response.list;
                }
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    OnChange(field: string) {
        this.RecordList = null;
    }
    Close() {
        this.gs.ClosePage('home');
    }

    ShowHideRecord(_rec: Gstr2bDownload) {
        // _rec.row_displayed = !_rec.row_displayed;
    }

    OnBlur(field: string) {
        if (field == "searchstring") {
            this.searchstring = this.searchstring.toUpperCase();
        }
    }

    getMonth(_month: string) {
        let _mName = "";
        if (this.MonList != null) {
            var REC = this.MonList.find(rec => rec.id == _month);
            if (REC != null) {
                _mName = REC.name;
            }
        }
        return _mName;
    }


    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    ProcessGstr2B(_type: string) {
        this.ErrorMessage = '';

        this.retn_period = this.recon_month + this.recon_year;

        if (this.state_code.trim().length <= 0) {
            this.ErrorMessage = "State Cannot Be Blank";
            alert(this.ErrorMessage);
            return;
        }
        if (this.retn_period.trim().length <= 0) {
            this.ErrorMessage = "Return Period Cannot Be Blank";
            alert(this.ErrorMessage);
            return;
        }

        let SearchData2 = {
            type: '',
            pkid: '',
            report_folder: '',
            company_code: '',
            branch_code: '',
            year_code: '',
            searchstring: '',
            state_code: '',
            return_period: '',
            user_code: '',
            otp: ''
        };


        this.loading = true;
        SearchData2.pkid = this.gs.getGuid();
        SearchData2.report_folder = this.gs.globalVariables.report_folder;
        SearchData2.company_code = this.gs.globalVariables.comp_code;
        SearchData2.branch_code = this.gs.globalVariables.branch_code;
        SearchData2.year_code = this.gs.globalVariables.year_code;
        SearchData2.state_code = this.state_code;
        SearchData2.return_period = this.retn_period;
        SearchData2.searchstring = '';
        SearchData2.type = _type;
        SearchData2.user_code = this.gs.globalVariables.user_code;
        SearchData2.otp = '';

        this.ErrorMessage = '';
        this.mainService.ProcessGSTRApi(SearchData2)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else if (_type == 'GSTR2A' || _type == 'GSTR2B') {
                    if (response.status != "")
                        alert(response.status);
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    showGspOtp(_gspotp: any) {
        this.open(_gspotp);
    }
}
