import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-gstgen-search',
    templateUrl: './gstgen-search.component.html'
})

export class GstGenSearchComponent {
    title = 'GST Reconcile Report'

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() bPrint: boolean = false;
    @Input() bDocs: boolean = false;
    @Input() bAdmin: boolean = false;
    @Input() bSave: boolean = false;
    @Input() bCompany: boolean = false;


    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    // gensearch_state_code = "";
    // gensearch_state_name = "";
    // gensearch_from_date: string = "";
    // gensearch_to_date: string = "";
    // gensearch_supplier: string = "";
    // gensearch_inv_no: string = "";

    ErrorMessage = "";
    mode = '';
    pkid = '';
    modal: any;
    selectedRowIndex = 0;
    MonList: any[] = [];
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
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
        chk_notclaimed: true
    };

    // Array For Displaying List
    // RecordListItc: Gstr2bDownload[] = [];
    //  Single Record for add/edit/view details
    Record: Gstr2bDownload = new Gstr2bDownload;

    constructor(
        private modalService: NgbModal,
        public mainService: GstReconRepService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {


    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.Init();
    }


    Init() {
        this.mainService.init(this.menuid);
        this.MonList = [{ "id": "01", "name": "JANUARY" }, { "id": "02", "name": "FEBRUARY" }, { "id": "03", "name": "MARCH" }
            , { "id": "04", "name": "APRIL" }, { "id": "05", "name": "MAY" }, { "id": "06", "name": "JUNE" }
            , { "id": "07", "name": "JULY" }, { "id": "08", "name": "AUGUST" }, { "id": "09", "name": "SEPTEMBER" }
            , { "id": "10", "name": "OCTOBER" }, { "id": "11", "name": "NOVEMBER" }, { "id": "12", "name": "DECEMBER" }];

    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    initLov(caption: string = '') {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "STATE") {
            this.mainService.state.gst_recon_itc_state_code = _Record.code;
            this.mainService.state.gst_recon_itc_state_name = _Record.name;
        }
    }
    LoadCombo() {

    }

    // // Query List Data
    List(_type: string) {

        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;
        this.SearchData.category = this.type;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.mainService.state.gst_recon_itc_searchstring.toUpperCase();
        this.SearchData.type = _type;
        this.SearchData.format_type = this.mainService.state.gst_recon_itc_status;
        this.SearchData.user_code = this.gs.globalVariables.user_code;
        this.SearchData.state_code = this.mainService.state.gst_recon_itc_list_state_code;
        this.SearchData.state_name = this.mainService.state.gst_recon_gensearch_state_name;
        this.SearchData.recon_year = +this.mainService.state.gst_recon_itc_list_year;
        this.SearchData.recon_month = +this.mainService.state.gst_recon_itc_list_month;
        this.SearchData.chk_notclaimed = this.mainService.state.gst_recon_itc_chk_notclaimed;
        this.ErrorMessage = '';
        this.mainService.GstGenSearchList(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL') {
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                }
                else {
                    this.mainService.state.RecordListSearch = response.list;
                }
            },
                error => {
                    this.loading = false;
                    this.mainService.state.RecordListSearch = null;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    OnChange(field: string) {
        this.mainService.state.RecordListSearch = null;
    }

    Close() {
        this.gs.ClosePage('home');
    }

    OnBlur(field: string) {
        if (field == "searchstring")
            this.mainService.state.gst_recon_itc_searchstring = this.mainService.state.gst_recon_itc_searchstring.toUpperCase();
    }

    OnBlurCell(field: string, _rec: Gstr2bDownload) {

    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }
}
