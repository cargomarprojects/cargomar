import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SaveShipData, ShipmentData } from '../models/shipmentdata';
import { ShipmentReportService } from '../services/shipmentreport.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-shipreport',
    templateUrl: './shipreport.component.html',
    providers: [ShipmentReportService]
})
export class ShipReportComponent {
    // Local Variables 
    title = 'Shipment Report Details';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    page_count2 = 0;
    page_current2 = 0;
    page_rows2 = 0;
    page_rowcount2 = 0;

    sub: any;
    urlid: string;

    searchType: string = 'EXPORT';
    IndianCompany: string = '';
    IndianPort: string = '';
    ForeignPort: string = '';
    ReportFormat: string = 'SUMMARY';
    Region: string = '';

    IndianPortList: ShipmentData[] = [];
    ForeignPortList: ShipmentData[] = [];
    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';
    report_name = '';
    // Array For Displaying List
    RecordList: SaveShipData[] = [];
    // Single Record for add/edit/view details
    Record: SaveShipData = new SaveShipData;

    constructor(
        private mainService: ShipmentReportService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 25;
        this.page_current = 0;

        this.page_count2 = 0;
        this.page_rows2 = 25;
        this.page_current2 = 0;

        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                this.InitCompleted = false;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                this.InitComponent();
            }
        });

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {

        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record)
            this.title = this.menu_record.menu_name;

        this.LoadCombo();
        this.InitCompleted = true;
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }



    LoadCombo() {
        this.loading = true;
        let SearchData = {
            type: 'type',
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;

                this.IndianPortList = response.indianports;
                this.ForeignPortList = response.foreignports;

                this.List("NEW");
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = JSON.parse(error._body).Message;
                });
    }


    LovSelected(_Record: any) {
    }



    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.report_name = '';
            this.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            this.currentTab = 'DETAILS';
            this.NewRecord();
            this.mode = 'ADD';
            this.ResetControls();
        }
        else if (action === 'EDIT') {
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.ResetControls();
            this.report_name = id;
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
            company_code: this.gs.globalVariables.comp_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                this.page_count = response.page_count;
                this.page_current = response.page_current;
                this.page_rowcount = response.page_rowcount;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }


    NewRecord() {
        this.report_name = '';
        this.Record = new SaveShipData();
        this.Record.ssd_report_name = this.report_name;
        this.Record.ssd_report_created_by = this.gs.globalVariables.user_code;
        this.Record.ssd_report_created_date = this.gs.defaultValues.today;
        this.Record.rec_mode = this.mode;
    }


    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;
        let SearchData = {
            report_name: Id,
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
                });
    }

    LoadData(_Record: SaveShipData) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
    }


    // Save Data
    Save() {

        if (!this.allvalid())
            return;

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.RefreshList();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (this.Record.ssd_report_name.trim().length <= 0) {
            bret = false;
            sError = " | Report Name Cannot Be Blank";
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage)
        }
        return bret;
    }

    RefreshList() {
        if (this.RecordList == null)
            return;
        this.RecordList.push(this.Record);
    }


    OnBlur(field: string) {
        // if (field == 'ritc_code') {

        //     this.Record.ritc_code = this.GetSpaceTrim(this.Record.ritc_code.trim()).newstr.toUpperCase();

        // }
        // if (field == 'ritc_name') {
        //     this.Record.ritc_name = this.Record.ritc_name.toUpperCase();
        // }
    }

    Close() {
        this.gs.ClosePage('home');
    }
 
    List2(_type: string) {
        this.InfoMessage = "";
        this.ErrorMessage = '';
        this.pkid = this.gs.getGuid();
        this.loading = true;
        let SearchData = {
            pkid: this.pkid,
            type: _type,
            rowtype: this.type,
            report_folder: this.gs.globalVariables.report_folder,
            searchtype: this.searchType,
            indiancompany: this.IndianCompany,
            indianport: this.IndianPort,
            foreignport: this.ForeignPort,
            region: this.Region,
            reportformat: this.ReportFormat,
            reportname: this.Record.ssd_report_name,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_pkid: this.gs.globalVariables.user_pkid,
            year_code: this.gs.globalVariables.year_code,
            page_count: this.page_count2,
            page_current: this.page_current2,
            page_rows: this.page_rows2,
            page_rowcount: this.page_rowcount2
        };

        this.ErrorMessage = '';
        this.mainService.List2(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.Record.ssd_List = response.list;
                    this.page_count2 = response.page_count;
                    this.page_current2 = response.page_current;
                    this.page_rowcount2 = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

}
