import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Yearm } from '../../core/models/yearm';
import { YearmService } from '../services/yearm.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-yearm',
    templateUrl: './yearm.component.html',
    providers: [YearmService]
})
export class YearmComponent {
    // Local Variables 
    title = 'Year Details';

    mdate: string;

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

    sub: any;
    urlid: string;
    selectedRowIndex = 0;

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';

    // Array For Displaying List
    RecordList: Yearm[] = [];
    // Single Record for add/edit/view details
    Record: Yearm = new Yearm;

    constructor(
        private mainService: YearmService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 15;
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
    }

    InitComponent() {

        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record)
            this.title = this.menu_record.menu_name;

        this.LoadCombo();

    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }



    LoadCombo() {

        //this.loading = true;
        //let SearchData = {
        //  type: 'type',
        //  comp_code: this.gs.globalVariables.comp_code,
        //  branch_code: this.gs.globalVariables.branch_code
        //};

        //this.ErrorMessage = '';
        //this.InfoMessage = '';
        //this.mainService.LoadDefault(SearchData)
        //  .subscribe(response => {
        //    this.loading = false;

        //    this.List("NEW");
        //  },
        //  error => {
        //    this.loading = false;
        //    this.ErrorMessage = JSON.parse(error._body).Message;
        //  });

        this.List("NEW");
    }


    LovSelected(_Record: any) {
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
            this.NewRecord();
            this.mode = 'ADD';
            this.ResetControls();
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
                    alert(this.ErrorMessage);
                });
    }


    NewRecord() {
        this.pkid = this.gs.getGuid();
        this.Record = new Yearm();
        this.Record.year_pkid = this.pkid;
        this.Record.year_code = '';
        this.Record.year_name = '';
        this.Record.year_start_date = '';
        this.Record.year_end_date = '';
        this.Record.year_closed = 'N';
        this.mode = 'ADD';
        this.Record.rec_mode = this.mode;
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

    LoadData(_Record: Yearm) {
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
                    alert(this.ErrorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (this.mode == 'ADD') {
            bret = false;
            sError = " | Use transfer Balance window to create new year.";
        }

        if (this.Record.year_code.trim().length <= 0) {
            bret = false;
            sError = " | Year Code Cannot Be Blank";
        }

        if (this.Record.year_name.trim().length <= 0) {
            bret = false;
            sError = " | Year name Cannot Be Blank";
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.year_pkid == this.Record.year_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.year_code = this.Record.year_code;
            REC.year_name = this.Record.year_name;
            REC.year_start_date = this.gs.ConvertDate2DisplayFormat(this.Record.year_start_date);
            REC.year_end_date = this.gs.ConvertDate2DisplayFormat(this.Record.year_end_date);
            REC.year_closed = this.Record.year_closed;
        }
    }


    OnBlur(field: string) {
        // if (field == 'ritc_code') {

        //   this.Record.ritc_code = this.GetSpaceTrim(this.Record.ritc_code.trim()).newstr.toUpperCase();

        // }
        // if (field == 'ritc_name') {
        //   this.Record.ritc_name = this.Record.ritc_name.toUpperCase();
        // }

    }

    GetSpaceTrim(str: string) {
        let num: number;
        let strTrim = {
            newstr: ''
        };
        if (str.trim() != "") {
            var temparr = str.split(' ');
            for (num = 0; num < temparr.length; num++) {
                strTrim.newstr = strTrim.newstr.concat(temparr[num]);
            }
        }
        return strTrim;
    }

    Close() {
        this.gs.ClosePage('home');
    }
}