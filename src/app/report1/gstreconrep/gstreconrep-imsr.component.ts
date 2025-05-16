import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-gstreconrep-imsr',
    templateUrl: './gstreconrep-imsr.component.html'
})

export class GstReconRepImsrComponent {
    title = 'GST Reconcile Report'

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() bPrint: boolean = false;
    @Input() bDocs: boolean = false;
    @Input() bAdmin: boolean = false;
    @Input() bSave: boolean = false;
    @Input() bCompany: boolean = false;
    @Input() download_doc_type: string = 'INVOICE';
    @Input() reverse_charge: string = 'NO';

    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    ErrorMessage = "";
    mode = '';
    pkid = '';
    modal: any;
    selectedRowIndex = 0;
    gstin_supplier: string = "";
    period: number = 2020;
    state_code: string = "";

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
        chk_pending: false,
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

    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    initLov(caption: string = '') {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "STATE") {
            this.mainService.state.gst_recon_imsr_state_code = _Record.code;
            this.mainService.state.gst_recon_imsr_state_name = _Record.name;
        }
    }
    LoadCombo() {
        this.MonList = [{ "id": "01", "name": "JANUARY" }, { "id": "02", "name": "FEBRUARY" }, { "id": "03", "name": "MARCH" }
            , { "id": "04", "name": "APRIL" }, { "id": "05", "name": "MAY" }, { "id": "06", "name": "JUNE" }
            , { "id": "07", "name": "JULY" }, { "id": "08", "name": "AUGUST" }, { "id": "09", "name": "SEPTEMBER" }
            , { "id": "10", "name": "OCTOBER" }, { "id": "11", "name": "NOVEMBER" }, { "id": "12", "name": "DECEMBER" }];
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
        if (this.gs.isBlank(this.mainService.state.gst_recon_imsr_state_name)) {
            alert("State Cannot be Blank");
            return;
        }
        if (+this.mainService.state.gst_recon_imsr_year <= 0) {
            alert("Invalid Year");
            return;
        } else if (+this.mainService.state.gst_recon_imsr_year < 100) {
            alert("YEAR FORMAT : - YYYY ");
            return;
        }
        if (+this.mainService.state.gst_recon_imsr_month <= 0 || +this.mainService.state.gst_recon_imsr_month > 12) {
            alert("Invalid Month");
            return;
        }

        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;
        this.SearchData.category = this.type;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.mainService.state.gst_recon_imsr_searchstring.toUpperCase();
        this.SearchData.type = _type;
        this.SearchData.user_code = this.gs.globalVariables.user_code;
        this.SearchData.state_code = this.mainService.state.gst_recon_imsr_state_code;
        this.SearchData.state_name = this.mainService.state.gst_recon_imsr_state_name;
        this.SearchData.round_off = this.mainService.state.gst_recon_imsr_round_off;
        this.SearchData.recon_year = +this.mainService.state.gst_recon_imsr_year;
        this.SearchData.recon_month = +this.mainService.state.gst_recon_imsr_month;
        this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
        this.SearchData.download_doc_type = this.download_doc_type;
        this.SearchData.reverse_charge = 'NO';
        this.ErrorMessage = '';
        this.mainService.ImsRejectedList(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL') {
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                }
                else {
                    this.mainService.state.RecordListImsr = response.list;
                }
            },
                error => {
                    this.loading = false;
                    this.mainService.state.RecordListImsr = null;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    OnChange(field: string) {
        this.mainService.state.RecordListImsr = null;
    }
    Close() {
        this.gs.ClosePage('home');
    }


    OnBlur(field: string) {
        if (field == "searchstring")
            this.mainService.state.gst_recon_imsr_searchstring = this.mainService.state.gst_recon_imsr_searchstring.toUpperCase();
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

    UpdateImsRejected(_id: string, _status: string) {
        let SearchData2 = {
            category: this.type,
            pkid: _id,
            claim_status: _status,
            recon_year: +this.mainService.state.gst_recon_imsr_year,
            recon_month: +this.mainService.state.gst_recon_imsr_month,
            state_code: this.mainService.state.gst_recon_imsr_state_code,
            user_code: this.gs.globalVariables.user_code
        };
        this.loading = true;
        this.ErrorMessage = '';
        this.mainService.UpdateImsRejected(SearchData2)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue && _status == 'PENDING') {
                    this.mainService.state.RecordListImsr.splice(this.mainService.state.RecordListImsr.findIndex(rec => rec.pkid == _id), 1);
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}