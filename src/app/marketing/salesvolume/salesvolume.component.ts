import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkSalesVolume } from '../models/marksalesvolume';
import { MarkSalesVolumeService } from '../services/marksalesvolume.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-salesvolume',
    templateUrl: './salesvolume.component.html',
    providers: [MarkSalesVolumeService]
})
export class SalesVolumeComponent {

    // Local Variables 
    title = 'Sales Volume Report';

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
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    // Array For Displaying List
    RecordList: MarkSalesVolume[] = [];
    // Single Record for add/edit/view details
    Record: MarkSalesVolume = new MarkSalesVolume;


    CUSTRECORD: SearchTable = new SearchTable();
    COUNTERPARTRECORD: SearchTable = new SearchTable();
    POLRECORD: SearchTable = new SearchTable();
    PODRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: MarkSalesVolumeService,
        private route: ActivatedRoute,
        public gs: GlobalService

    ) {


        this.page_count = 0;
        this.page_rows = 25;
        this.page_current = 0;

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
        this.IsAdmin = false;
        this.IsCompany = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.IsAdmin = true;
            if (this.menu_record.rights_company)
                this.IsCompany = true;
        }
        this.LoadCombo();
        this.InitLov();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    InitLov() {

        this.CUSTRECORD = new SearchTable();
        this.CUSTRECORD.controlname = "CUSTOMER";
        this.CUSTRECORD.displaycolumn = "NAME";
        this.CUSTRECORD.type = "MARKETING CONTACT";
        this.CUSTRECORD.id = "";
        this.CUSTRECORD.code = "";
        this.CUSTRECORD.name = "";



        this.COUNTERPARTRECORD = new SearchTable();
        this.COUNTERPARTRECORD.controlname = "COUNTER-PART";
        this.COUNTERPARTRECORD.displaycolumn = "NAME";
        this.COUNTERPARTRECORD.type = "MARKETING CONTACT";
        this.COUNTERPARTRECORD.id = "";
        this.COUNTERPARTRECORD.code = "";
        this.COUNTERPARTRECORD.name = "";

        this.POLRECORD = new SearchTable();
        this.POLRECORD.controlname = "POL";
        this.POLRECORD.displaycolumn = "CODE";
        this.POLRECORD.type = "PORT";
        this.POLRECORD.id = "";
        this.POLRECORD.code = "";
        this.POLRECORD.name = "";

        this.PODRECORD = new SearchTable();
        this.PODRECORD.controlname = "POD";
        this.PODRECORD.displaycolumn = "CODE";
        this.PODRECORD.type = "PORT";
        this.PODRECORD.id = "";
        this.PODRECORD.code = "";
        this.PODRECORD.name = "";
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

        if (_Record.controlname == "CUSTOMER") {
            this.Record.sv_cust_id = _Record.id;
            this.Record.sv_cust_code = _Record.code;
            this.Record.sv_cust_name = _Record.name;
        }
        if (_Record.controlname == "COUNTER-PART") {
            this.Record.sv_counterpart_id = _Record.id;
            this.Record.sv_counterpart_code = _Record.code;
            this.Record.sv_counterpart_name = _Record.name;
        }
        if (_Record.controlname == "POL") {
            this.Record.sv_pol_id = _Record.id;
            this.Record.sv_pol_code = _Record.code;
            this.Record.sv_pol_name = _Record.name;
        }
        if (_Record.controlname == "POD") {
            this.Record.sv_pod_id = _Record.id;
            this.Record.sv_pod_code = _Record.code;
            this.Record.sv_pod_name = _Record.name;
        }
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
            year_code: this.gs.globalVariables.year_code,
            user_id: this.gs.globalVariables.user_pkid,
            user_code: this.gs.globalVariables.user_code,
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            report_folder: this.gs.globalVariables.report_folder
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
        this.Record = new MarkSalesVolume();
        this.Record.sv_pkid = this.pkid;
        this.Record.sv_mode = 'SEA EXPORT';
        this.Record.sv_type = 'BOTH';
        this.Record.sv_cust_id = '';
        this.Record.sv_cust_code = '';
        this.Record.sv_cust_name = '';
        this.Record.sv_cust_is_new = 'Y';
        this.Record.sv_cntr_20 = 0;
        this.Record.sv_cntr_40 = 0;
        this.Record.sv_cntr_lcl = 0;
        this.Record.sv_kgs = 0;
        this.Record.sv_sb = 0;
        this.Record.sv_be = 0;
        this.Record.sv_pol_id = '';
        this.Record.sv_pol_code = '';
        this.Record.sv_pol_name = '';
        this.Record.sv_pod_id = '';
        this.Record.sv_pod_code = '';
        this.Record.sv_pod_name = '';
        this.Record.sv_counterpart_id = '';
        this.Record.sv_counterpart_code = '';
        this.Record.sv_counterpart_name = '';
        this.Record.sv_commodity = '';
        this.Record.sv_date = this.gs.defaultValues.today;
        this.Record.sv_week_no = 0;
        
        this.Record.rec_mode = this.mode;
        this.Record.rec_created_by = this.gs.globalVariables.user_code;
        this.Record.rec_created_date = this.gs.defaultValues.today;

        this.InitLov();

        this.CUSTRECORD.id = this.Record.sv_cust_id;
        this.CUSTRECORD.code = this.Record.sv_cust_code;
        this.CUSTRECORD.name = this.Record.sv_cust_name;

        this.COUNTERPARTRECORD.id = this.Record.sv_counterpart_id;
        this.COUNTERPARTRECORD.code = this.Record.sv_counterpart_code;
        this.COUNTERPARTRECORD.name = this.Record.sv_counterpart_name;

        this.POLRECORD.id = this.Record.sv_pol_id;
        this.POLRECORD.code = this.Record.sv_pol_code;
        this.POLRECORD.name = this.Record.sv_pol_name;

        this.PODRECORD.id = this.Record.sv_pod_id;
        this.PODRECORD.code = this.Record.sv_pod_code;
        this.PODRECORD.name = this.Record.sv_pod_name

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

    LoadData(_Record: MarkSalesVolume) {
        this.Record = _Record;
        this.Record.rec_mode = "EDIT";

        this.InitLov();

        this.CUSTRECORD.id = this.Record.sv_cust_id;
        this.CUSTRECORD.code = this.Record.sv_cust_code;
        this.CUSTRECORD.name = this.Record.sv_cust_name;

        this.COUNTERPARTRECORD.id = this.Record.sv_counterpart_id;
        this.COUNTERPARTRECORD.code = this.Record.sv_counterpart_code;
        this.COUNTERPARTRECORD.name = this.Record.sv_counterpart_name;

        this.POLRECORD.id = this.Record.sv_pol_id;
        this.POLRECORD.code = this.Record.sv_pol_code;
        this.POLRECORD.name = this.Record.sv_pol_name;

        this.PODRECORD.id = this.Record.sv_pod_id;
        this.PODRECORD.code = this.Record.sv_pod_code;
        this.PODRECORD.name = this.Record.sv_pod_name

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
                this.Record.rec_mode = this.mode;
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

        if (bret) {

        }

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
        var REC = this.RecordList.find(rec => rec.sv_pkid == this.Record.sv_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.rec_created_by = this.Record.rec_created_by;
            REC.rec_created_date = this.Record.rec_created_date;
            REC.sv_mode = this.Record.sv_mode;
            REC.sv_type = this.Record.sv_type;
            REC.sv_cust_name = this.Record.sv_cust_name;
            REC.sv_cntr_20 = this.Record.sv_cntr_20;
            REC.sv_cntr_40 = this.Record.sv_cntr_40;
            REC.sv_cntr_lcl = this.Record.sv_cntr_lcl;
            REC.sv_kgs = this.Record.sv_kgs;
            REC.sv_sb = this.Record.sv_sb;
            REC.sv_be = this.Record.sv_be;
            REC.sv_pol_name = this.Record.sv_pol_name;
            REC.sv_pod_name = this.Record.sv_pod_name;
            REC.sv_counterpart_name = this.Record.sv_counterpart_name;
            REC.sv_commodity = this.Record.sv_commodity;
            REC.sv_week_no = this.Record.sv_week_no;
        }
    }


    OnBlur(field: string) {

        if (field == 'sv_commodity') {
            this.Record.sv_commodity = this.Record.sv_commodity.toUpperCase();
        }

        if (field == 'searchstring') {
            this.searchstring = this.searchstring.toUpperCase().trim();
        }
        if (field == 'sv_commodity') {
            this.Record.sv_commodity = this.Record.sv_commodity.toUpperCase().trim();
        }

        if (field == 'sv_cntr_20') {
            this.Record.sv_cntr_20 = this.gs.roundNumber(this.Record.sv_cntr_20, 0);
        }
        if (field == 'sv_cntr_40') {
            this.Record.sv_cntr_40 = this.gs.roundNumber(this.Record.sv_cntr_40, 0);
        }
        if (field == 'sv_cntr_lcl') {
            this.Record.sv_cntr_lcl = this.gs.roundNumber(this.Record.sv_cntr_lcl, 0);
        }
        if (field == 'sv_kgs') {
            this.Record.sv_kgs = this.gs.roundNumber(this.Record.sv_kgs, 3);
        }
        if (field == 'sv_sb') {
            this.Record.sv_sb = this.gs.roundNumber(this.Record.sv_sb, 0);
        }
        if (field == 'sv_be') {
            this.Record.sv_be = this.gs.roundNumber(this.Record.sv_be, 0);
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }

}
