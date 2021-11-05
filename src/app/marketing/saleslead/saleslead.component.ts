import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkSalesleadd, MarkSalesleadm } from '../models/marksaleslead';
import { MarkSalesleadService } from '../services/marksaleslead.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-saleslead',
    templateUrl: './saleslead.component.html',
    providers: [MarkSalesleadService]
})
export class SalesleadComponent {

    // Local Variables 
    title = 'Saleslead';


    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

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
    RecordList: MarkSalesleadm[] = [];
    // Single Record for add/edit/view details
    Record: MarkSalesleadm = new MarkSalesleadm;

    LOCATIONRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: MarkSalesleadService,
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

        this.LOCATIONRECORD = new SearchTable();
        this.LOCATIONRECORD.controlname = "LOCATION";
        this.LOCATIONRECORD.displaycolumn = "NAME";
        this.LOCATIONRECORD.type = "LOCATION";
        this.LOCATIONRECORD.id = "";
        this.LOCATIONRECORD.name = "";

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

        if (_Record.controlname == "LOCATION") {
            this.Record.msl_location_id = _Record.id;
            this.Record.msl_location_name = _Record.name;
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
        this.Record = new MarkSalesleadm();
        this.Record.msl_pkid = this.pkid;
        this.Record.msl_location_id = "";
        this.Record.msl_location_name = "";
        this.Record.msl_date = this.gs.defaultValues.today;
        this.Record.msl_shipper_name = "";
        this.Record.msl_shipper_add1 = "";
        this.Record.msl_shipper_add2 = "";
        this.Record.msl_shipper_add3 = "";
        this.Record.msl_city = "";
        this.Record.msl_pic = "";
        this.Record.msl_consignee = "";
        this.Record.msl_destination = "";
        this.Record.msl_remarks = "";
        this.Record.msl_shipper_tel = "";
        this.Record.msl_shipper_email = "";
        this.Record.msl_consignee_add1 = "";
        this.Record.msl_consignee_add2 = "";
        this.Record.msl_consignee_add3 = "";
        this.Record.msl_consignee_pic = "";
        this.Record.msl_consignee_tel = "";
        this.Record.msl_consignee_email = "";
        this.Record.rec_mode = this.mode;
        this.InitLov();
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

    LoadData(_Record: MarkSalesleadm) {
        this.Record = _Record;
        this.Record.rec_mode = "EDIT";

        this.InitLov();

        this.LOCATIONRECORD.id = this.Record.msl_location_id.toString();
        this.LOCATIONRECORD.name = this.Record.msl_location_name;

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

        if (this.gs.isBlank(this.Record.msl_shipper_name)) {
            bret = false;
            sError = " | Shipper Name Cannot be Blank";
        }

        if (bret) {
            this.Record.msl_action = "ACTION";
          }

        if (bret === false)
            this.ErrorMessage = sError;
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
        var REC = this.RecordList.find(rec => rec.msl_pkid == this.Record.msl_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.msl_date = this.Record.msl_date;
            REC.msl_location_name = this.Record.msl_location_name;
            REC.msl_shipper_name = this.Record.msl_shipper_name;
            REC.msl_shipper_add1 = this.Record.msl_shipper_add1;
            REC.msl_shipper_add2 = this.Record.msl_shipper_add2;
            REC.msl_shipper_add3 = this.Record.msl_shipper_add3;
            REC.msl_city = this.Record.msl_city;
            REC.msl_pic = this.Record.msl_pic;
            REC.msl_consignee = this.Record.msl_consignee;
            REC.msl_destination = this.Record.msl_destination;
            REC.msl_remarks = this.Record.msl_remarks;
        }
    }


    OnBlur(field: string) {

        if (field == 'msl_location_name') {
            this.Record.msl_location_name = this.Record.msl_location_name.toUpperCase();
        }
        if (field == 'msl_shipper_name') {
            this.Record.msl_shipper_name = this.Record.msl_shipper_name.toUpperCase();
        }
        if (field == 'msl_shipper_add1') {
            this.Record.msl_shipper_add1 = this.Record.msl_shipper_add1.toUpperCase();
        }
        if (field == 'msl_shipper_add2') {
            this.Record.msl_shipper_add2 = this.Record.msl_shipper_add2.toUpperCase();
        }
        if (field == 'msl_shipper_add3') {
            this.Record.msl_shipper_add3 = this.Record.msl_shipper_add3.toUpperCase();
        }
        if (field == 'msl_city') {
            this.Record.msl_city = this.Record.msl_city.toUpperCase();
        }
        if (field == 'msl_pic') {
            this.Record.msl_pic = this.Record.msl_pic.toUpperCase();
        }
        if (field == 'msl_consignee') {
            this.Record.msl_consignee = this.Record.msl_consignee.toUpperCase();
        }
        if (field == 'msl_destination') {
            this.Record.msl_destination = this.Record.msl_destination.toUpperCase();
        }
        if (field == 'msl_remarks') {
            this.Record.msl_remarks = this.Record.msl_remarks.toUpperCase();
        }
        if (field == 'msl_shipper_tel') {
            this.Record.msl_shipper_tel = this.Record.msl_shipper_tel.toUpperCase();
        }
        if (field == 'msl_shipper_email') {
            this.Record.msl_shipper_email = this.Record.msl_shipper_email.toLowerCase();
        }

        if (field == 'msl_consignee_add1') {
            this.Record.msl_consignee_add1 = this.Record.msl_consignee_add1.toUpperCase();
        }

        if (field == 'msl_consignee_add2') {
            this.Record.msl_consignee_add2 = this.Record.msl_consignee_add2.toUpperCase();
        }

        if (field == 'msl_consignee_add3') {
            this.Record.msl_consignee_add3 = this.Record.msl_consignee_add3.toUpperCase();
        }

        if (field == 'msl_consignee_pic') {
            this.Record.msl_consignee_pic = this.Record.msl_consignee_pic.toUpperCase();
        }

        if (field == 'msl_consignee_tel') {
            this.Record.msl_consignee_tel = this.Record.msl_consignee_tel.toUpperCase();
        }

        if (field == 'msl_consignee_email') {
            this.Record.msl_consignee_email = this.Record.msl_consignee_email.toLowerCase();
        }

         
    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }

}
