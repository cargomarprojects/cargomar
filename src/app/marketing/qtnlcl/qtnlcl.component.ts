import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Qtnm, QtndLcl } from '../models/qtnm';
import { QtnLclService } from '../services/qtnlcl.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-qtnlcl',
    templateUrl: './qtnlcl.component.html',
    providers: [QtnLclService]
})
export class QtnLclComponent {

    // Local Variables 
    title = 'Quotation LCL';

    @Input() iisModalWindow: string = 'N';
    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() clientType: string = '';

    InitCompleted: boolean = false;
    menu_record: any;

    selectedRowIndex = 0;

    modal: any;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;


    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';
    showclosebutton: boolean = true;

    // Array For Displaying List
    RecordList: Qtnm[] = [];
    // Single Record for add/edit/view details
    Record: Qtnm = new Qtnm;


    CATEGORYRECORD: SearchTable = new SearchTable();
    SALESMANRECORD: SearchTable = new SearchTable();
    CSDRECORD: SearchTable = new SearchTable();
    CNTRYRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: QtnLclService,
        private route: ActivatedRoute,
        public gs: GlobalService

    ) {


        this.page_count = 0;
        this.page_rows = 25;
        this.page_current = 0;


        this.InitLov();

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
        this.List('NEW');
    }

    InitComponent() {
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;

        }
        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    InitLov() {

        this.CATEGORYRECORD = new SearchTable();
        this.CATEGORYRECORD.controlname = "CONTACT TYPE";
        this.CATEGORYRECORD.displaycolumn = "NAME";
        this.CATEGORYRECORD.type = "CONTACT TYPE";
        this.CATEGORYRECORD.id = "";
        this.CATEGORYRECORD.code = "";
        this.CATEGORYRECORD.name = "";

        this.SALESMANRECORD = new SearchTable();
        this.SALESMANRECORD.controlname = "SALESMAN";
        this.SALESMANRECORD.displaycolumn = "NAME";
        this.SALESMANRECORD.type = "SALESMAN";
        this.SALESMANRECORD.id = "";
        this.SALESMANRECORD.code = "";
        this.SALESMANRECORD.name = "";

        this.CSDRECORD = new SearchTable();
        this.CSDRECORD.controlname = "CSD";
        this.CSDRECORD.displaycolumn = "NAME";
        this.CSDRECORD.type = "SALESMAN";
        this.CSDRECORD.id = "";
        this.CSDRECORD.code = "";
        this.CSDRECORD.name = "";

        this.CNTRYRECORD = new SearchTable();
        this.CNTRYRECORD.controlname = "COUNTRY";
        this.CNTRYRECORD.displaycolumn = "NAME";
        this.CNTRYRECORD.type = "COUNTRY";
        this.CNTRYRECORD.id = "";
        this.CNTRYRECORD.code = "";
        this.CNTRYRECORD.name = "";
    }



    LoadCombo() {

        // this.loading = true;
        // let SearchData = {
        //   type: 'type',
        //   comp_code: this.gs.globalVariables.comp_code,
        //   branch_code: this.gs.globalVariables.branch_code
        // };

        // this.ErrorMessage = '';
        // this.InfoMessage = '';
        // this.mainService.LoadDefault(SearchData)
        //   .subscribe(response => {
        //     this.loading = false;
        //     this.List("NEW");
        //   },
        //     error => {
        //       this.loading = false;
        //       this.ErrorMessage = this.gs.getError(error);
        //     });
    }


    LovSelected(_Record: any) {

        // if (_Record.controlname == "CONTACT TYPE") {
        //     this.Record.cont_type_id = _Record.id;
        //     this.Record.cont_type_name = _Record.name;
        // }

        // if (_Record.controlname == "SALESMAN") {
        //     this.Record.cont_saleman_id = _Record.id;
        //     this.Record.cont_saleman_name = _Record.name;
        // }

        // if (_Record.controlname == "CSD") {
        //     this.Record.cont_csd_id = _Record.id;
        //     this.Record.cont_csd_name = _Record.name;
        // }

        // if (_Record.controlname == "COUNTRY") {
        //     this.Record.cont_country_id = _Record.id;
        //     this.Record.cont_country_code = _Record.code;
        //     this.Record.cont_country = _Record.name;
        // }

    }



    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            this.currentTab = 'DETAILS';
            this.mode = 'ADD';
            this.ResetControls();
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            this.GetRecord(id);
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

        this.loading = true;

        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.searchstring.toUpperCase(),
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new Qtnm();
        // this.Record.cont_pkid = this.pkid;
        // this.Record.cont_name = '';
        // this.Record.cont_add1 = '';
        // this.Record.cont_add2 = '';
        // this.Record.cont_add3 = '';
        // this.Record.cont_add4 = '';
        // this.Record.cont_add5 = '';
        // this.Record.cont_state = '';
        // this.Record.cont_country_id = '';
        // this.Record.cont_country_code = '';
        // this.Record.cont_country = '';
        // this.Record.cont_tel = '';
        // this.Record.cont_fax = '';
        // this.Record.cont_mobile = '';
        // this.Record.cont_email = '';
        // this.Record.cont_web = '';
        // this.Record.cont_type_id = '';
        // this.Record.cont_type_name = '';
        // this.Record.cont_iscorporat = false;
        // this.Record.cont_saleman_id = '';
        // this.Record.cont_saleman_name = '';
        // this.Record.cont_region = '';
        // this.Record.cont_remark = '';
        // this.Record.cont_iecode = '';
        // this.Record.cont_location = '';
        // this.Record.cont_cha_name = '';
        // this.Record.cont_csd_id = '';
        // this.Record.cont_csd_name = '';
        // this.Record.cont_type_2 = '';
        // this.Record.cont_target_market = '';
        // this.Record.cont_is_seclr = false;
        // this.Record.cont_is_sefwd = false;
        // this.Record.cont_is_siclr = false;
        // this.Record.cont_is_sifwd = false;
        // this.Record.cont_is_aeclr = false;
        // this.Record.cont_is_aefwd = false;
        // this.Record.cont_is_aiclr = false;
        // this.Record.cont_is_aifwd = false;
        // this.Record.cont_is_pj = false;
        // this.Record.cont_is_wh = false;
        // this.Record.cont_is_tp = false;
        // this.Record.cont_contact = '';
        // this.Record.rec_mode = this.mode;
        // this.InitLov();
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {

        this.loading = true;
        let SearchData = {
            pkid: Id,
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    LoadData(_Record: Qtnm) {
        this.Record = _Record;
        // this.Record.rec_mode = "EDIT";

        // this.InitLov();

        // this.CATEGORYRECORD.id = this.Record.cont_type_id.toString();
        // this.CATEGORYRECORD.name = this.Record.cont_type_name;

        // this.SALESMANRECORD.id = this.Record.cont_saleman_id.toString();
        // this.SALESMANRECORD.name = this.Record.cont_saleman_name;

        // this.CSDRECORD.id = this.Record.cont_csd_id.toString();
        // this.CSDRECORD.name = this.Record.cont_csd_name;

        // this.CNTRYRECORD.id = this.Record.cont_country_id;
        // this.CNTRYRECORD.code = this.Record.cont_country_code;
        // this.CNTRYRECORD.name = this.Record.cont_country;

    }




    // Save Data
    Save() {
        if (!this.allvalid()) {
            alert(this.ErrorMessage);
            return;
        }

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.mode = 'EDIT';
                // this.Record.rec_mode = this.mode;
                this.InfoMessage = "Save Complete";
                this.RefreshList();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        // if (this.gs.isBlank(this.Record.cont_name)) {
        //   bret = false;
        //   sError = " | Name Cannot be Blank";
        // }

        // if (this.gs.isBlank(this.Record.cont_type_2)) {
        //   bret = false;
        //   sError += " | Type Cannot be Blank";
        // }

        // if (bret) {
        //     this.Record.cont_name = this.Record.cont_name.toUpperCase().trim();
        // }

        // if (bret === false)
        //   this.ErrorMessage = sError;
        return bret;
    }

    Isnumeric(i: any) {

        if (i >= 0 && i <= 9) {
            return true;
        }
        else {
            return false;
        }

    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        // var REC = this.RecordList.find(rec => rec.cont_pkid == this.Record.cont_pkid);
        // if (REC == null) {
        //     this.RecordList.push(this.Record);
        // }
        // else {
        //     REC.cont_name = this.Record.cont_name;
        //     REC.cont_add1 = this.Record.cont_add1;
        //     REC.cont_state = this.Record.cont_state;
        //     REC.cont_country = this.Record.cont_country;
        //     REC.cont_tel = this.Record.cont_tel;
        //     REC.cont_mobile = this.Record.cont_mobile;
        //     REC.cont_email = this.Record.cont_email;
        // }
    }


    OnBlur(field: string) {

        // if (field == 'cont_name') {
        //     this.Record.cont_name = this.Record.cont_name.toUpperCase();
        // }
    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }

}