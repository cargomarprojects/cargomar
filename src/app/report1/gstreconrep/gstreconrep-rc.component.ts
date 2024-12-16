import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-gstreconrep-rc',
    templateUrl: './gstreconrep-rc.component.html'
})

export class GstReconRepRcComponent {
    title = 'GST Reconcile Report'

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() bPrint: boolean = false;
    @Input() bDocs: boolean = false;
    @Input() bAdmin: boolean = false;
    @Input() bSave: boolean = false;
    @Input() bCompany: boolean = false;
    @Input() download_doc_type: string = 'INVOICE';
    @Input() reverse_charge: string = 'YES';

    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    ErrorMessage = "";
    mode = '';
    pkid = '';
    modal: any;
    selectedRowIndex = 0;
    recon_year = 0;
    recon_month = 0;
    gstin_supplier: string = "";
    period: number = 2020;
    state_code: string = "";

    branch_code: string = '';
    format_type: string = '';
    from_date: string = '';
    to_date: string = '';
    // searchstring = '';
    display_format_type: string = '';
    // reconcile_state_name: string = "KERALA";
    // reconcile_state_code: string = "32";
    //round_off: number = 5;
    chk_pending: boolean = true;
     
    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    MonList: any[] = [];

    SearchData = {
        category: '',
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
        download_doc_type: this.download_doc_type,
        reverse_charge: this.reverse_charge
    };

    // Array For Displaying List
    // RecordListReco: Gstr2bDownload[] = [];
    //  Single Record for add/edit/view details
    Record: Gstr2bDownload = new Gstr2bDownload;


    constructor(
        private modalService: NgbModal,
        public mainService: GstReconRepService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {
        // URL Query Parameter


    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.mainService.init(this.menuid);
        if (!this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {

        this.initLov();
        this.LoadCombo();
        this.Init();
    }

    Init() {
        this.format_type = "RECONCILE-GSTR2B";
        this.display_format_type = this.format_type;
    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    initLov(caption: string = '') {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "STATE") {
            this.mainService.state.gst_recon_rc_state_code = _Record.code;
            this.mainService.state.gst_recon_rc_state_name = _Record.name;
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
        if (this.gs.isBlank(this.mainService.state.gst_recon_rc_state_name)) {
            alert("State Cannot be Blank");
            return;
        }
        if (+this.mainService.state.gst_recon_rc_year <= 0) {
            alert("Invalid Year");
            return;
        } else if (+this.mainService.state.gst_recon_rc_year < 100) {
            alert("YEAR FORMAT : - YYYY ");
            return;
        }
        if (+this.mainService.state.gst_recon_rc_month <= 0 || +this.mainService.state.gst_recon_rc_month > 12) {
            alert("Invalid Month");
            return;
        }

        this.display_format_type = this.format_type;
        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;
        this.SearchData.category = this.type;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.mainService.state.gst_recon_rc_searchstring.toUpperCase();
        this.SearchData.type = _type;
        this.SearchData.from_date = this.from_date;
        this.SearchData.to_date = this.to_date;
        this.SearchData.format_type = this.format_type;
        this.SearchData.user_code = this.gs.globalVariables.user_code;
        this.SearchData.state_code = this.mainService.state.gst_recon_rc_state_code;
        this.SearchData.state_name = this.mainService.state.gst_recon_rc_state_name;
        this.SearchData.round_off = this.mainService.state.gst_recon_rc_round_off;
        this.SearchData.recon_year = +this.mainService.state.gst_recon_rc_year;
        this.SearchData.recon_month = +this.mainService.state.gst_recon_rc_month;
        this.SearchData.chk_pending = this.chk_pending;
        this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
        this.SearchData.download_doc_type = this.download_doc_type;
        this.SearchData.reverse_charge = 'YES';
        this.ErrorMessage = '';
        this.mainService.List(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL') {
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                }
                else {
                    this.mainService.state.RecordListRc = response.list;
                }
            },
                error => {
                    this.loading = false;
                    this.mainService.state.RecordListRc = null;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    OnChange(field: string) {
        this.mainService.state.RecordListRc = null;
    }
    Close() {
        this.gs.ClosePage('home');
    }


    OnBlur(field: string) {
        if (field == "searchstring")
            this.mainService.state.gst_recon_rc_searchstring = this.mainService.state.gst_recon_rc_searchstring.toUpperCase();
    }

    ProcessGstReconcile() {

        if (this.gs.isBlank(this.mainService.state.gst_recon_rc_state_name)) {
            alert("State Cannot be Blank");
            return;
        }

        // if (this.recon_year <= 0) {
        //   alert("Invalid Year");
        //   return;
        // } else if (this.recon_year < 100) {
        //   alert("YEAR FORMAT : - YYYY ");
        //   return;
        // }
        // if (this.recon_month <= 0 || this.recon_month > 12) {
        //   alert("Invalid Month");
        //   return;
        // }

        if (!confirm("Do you want to Process Data - " + this.mainService.state.gst_recon_rc_state_name + " - " + this.getMonth(this.mainService.state.gst_recon_rc_month) + ", " + this.mainService.state.gst_recon_rc_year)) {
            return;
        }

        this.loading = true;
        this.SearchData.category = this.type;
        this.SearchData.state_code = this.mainService.state.gst_recon_rc_state_code;
        this.SearchData.state_name = this.mainService.state.gst_recon_rc_state_name;
        this.SearchData.round_off = this.mainService.state.gst_recon_rc_round_off;
        this.SearchData.recon_year = +this.mainService.state.gst_recon_rc_year;
        this.SearchData.recon_month = +this.mainService.state.gst_recon_rc_month;
        this.SearchData.download_doc_type = this.download_doc_type;
        this.SearchData.reverse_charge = this.reverse_charge;
        this.ErrorMessage = '';
        this.mainService.ProcessGstReconcile(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                // alert('Process Completed')
                this.List('SCREEN');
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
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

    showDetailList(gstrdet: any, _gstin_supplier: string, _period: number, _state_code: string, _supplier_name: string) {
        if (_gstin_supplier == "TOTAL")
            return;
        this.gstin_supplier = _gstin_supplier;
        this.period = _period;
        this.state_code = _state_code;
        this.open(gstrdet);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    UpdatePurchaseData() {

        if (this.gs.isBlank(this.mainService.state.gst_recon_rc_state_name)) {
            alert("State Cannot be Blank");
            return;
        }

        if (+this.mainService.state.gst_recon_rc_year <= 0) {
            alert("Invalid Year");
            return;
        } else if (+this.mainService.state.gst_recon_rc_year < 100) {
            alert("YEAR FORMAT : - YYYY ");
            return;
        }
        if (+this.mainService.state.gst_recon_rc_month <= 0 || +this.mainService.state.gst_recon_rc_month > 12) {
            alert("Invalid Month");
            return;
        }

        if (!confirm("Do you want to Update Data - " + this.mainService.state.gst_recon_rc_state_name + " - " + this.getMonth(this.mainService.state.gst_recon_rc_month) + ", " + this.mainService.state.gst_recon_rc_year)) {
            return;
        }


        let SearchData2 = {
            category: '',
            type: '',
            pkid: '',
            report_folder: '',
            company_code: '',
            branch_code: '',
            year_code: '',
            searchstring: '',
            from_date: 'PURCHASE',
            to_date: '',
            format_type: '',
            all: false,
            gst_only: true,
            print_new_format: true,
            user_code: '',
            state_name: '',
            state_code: '',
            round_off: 5,
            hide_ho_entries: this.gs.globalVariables.hide_ho_entries,
            recon_year: 0,
            recon_month: 0,
            download_doc_type: this.download_doc_type,
            reverse_charge: this.reverse_charge
        };


        this.loading = true;
        this.pkid = this.gs.getGuid();
        SearchData2.pkid = this.pkid;
        SearchData2.category = this.type;
        SearchData2.report_folder = this.gs.globalVariables.report_folder;
        SearchData2.company_code = this.gs.globalVariables.comp_code;
        SearchData2.branch_code = "STATE-WISE";
        SearchData2.year_code = this.gs.globalVariables.year_code;
        SearchData2.searchstring = '';
        SearchData2.type = 'RECONCILE-EXP-DATA';
        SearchData2.from_date = '';
        SearchData2.to_date = '';
        SearchData2.format_type = 'PURCHASE';
        SearchData2.all = false;
        SearchData2.gst_only = true;
        SearchData2.print_new_format = false;
        SearchData2.user_code = this.gs.globalVariables.user_code;
        SearchData2.state_code = this.mainService.state.gst_recon_rc_state_code;
        SearchData2.state_name = this.mainService.state.gst_recon_rc_state_name;
        SearchData2.round_off = this.mainService.state.gst_recon_rc_round_off;
        SearchData2.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
        SearchData2.recon_year = +this.mainService.state.gst_recon_rc_year;
        SearchData2.recon_month = +this.mainService.state.gst_recon_rc_month;
        SearchData2.download_doc_type = this.download_doc_type;
        SearchData2.reverse_charge = 'YES';
        this.ErrorMessage = '';
        this.mainService.UpdatePurchaseData(SearchData2)
            .subscribe(response => {
                this.loading = false;
                // alert(response.retmsg)
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}
