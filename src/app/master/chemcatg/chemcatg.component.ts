import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ChemCatgm } from '../models/chemcatgm';
import { ChemCatgService } from '../services/chemcatg.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-chemcatg',
    templateUrl: './chemcatg.component.html',
    providers: [ChemCatgService]
})
export class ChemCatgComponent {
    // Local Variables 
    title = 'Ritc Info Code Details';

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


    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';

    // Array For Displaying List
    RecordList: ChemCatgm[] = [];
    // Single Record for add/edit/view details
    Record: ChemCatgm = new ChemCatgm;

    constructor(
        private mainService: ChemCatgService,
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
        if (_Record.controlname == "RITC") {
            this.Record.chem_ritc_id = _Record.id;
            this.Record.chem_ritc_code = _Record.code;
            this.Record.chem_ritc_name = _Record.name;
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
                });
    }


    NewRecord() {

        // let _rec: ChemCatgm = this.Record;

        this.pkid = this.gs.getGuid();
        this.Record = new ChemCatgm();
        this.Record.chem_pkid = this.pkid;
        this.Record.chem_code = '';
        this.Record.chem_desc = '';
        this.Record.chem_ritc_id = '';
        this.Record.chem_ritc_code = '';
        this.Record.chem_type = 'SW_CONST';
        this.Record.chem_info_type = '';
        this.Record.chem_info_qualifier = '';
        this.Record.chem_category = 'MEDICINAL PLANT';
        this.Record.rec_locked = false;
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
                });
    }

    LoadData(_Record: ChemCatgm) {
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
        if (this.Record.chem_code.trim().length <= 0) {
            bret = false;
            sError = " | Code Cannot Be Blank";
        }
        if (this.Record.chem_desc.trim().length <= 0) {
            bret = false;
            sError = " | Description Cannot Be Blank";
        }
        if (this.Record.chem_ritc_id.trim().length <= 0 || this.Record.chem_ritc_code.trim().length <= 0) {
            bret = false;
            sError = " | RITC Code Cannot Be Blank";
        }
        if (this.Record.chem_type.trim().length <= 0) {
            bret = false;
            sError = " | Type Cannot Be Blank";
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.chem_pkid == this.Record.chem_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.chem_code = this.Record.chem_code;
            REC.chem_desc = this.Record.chem_desc;
            REC.chem_ritc_code = this.Record.chem_ritc_code;
            REC.chem_info_type = this.Record.chem_info_type;
            REC.chem_info_qualifier = this.Record.chem_info_qualifier;
            REC.chem_category = this.Record.chem_category;
        }
    }


    OnBlur(field: string) {

        if (field == 'chem_ritc_code') {
            this.Record.chem_ritc_code = this.Record.chem_ritc_code.toUpperCase();
        }
        if (field == 'chem_code') {
            this.Record.chem_code = this.Record.chem_code.toUpperCase();
        }
        if (field == 'chem_desc') {
            this.Record.chem_desc = this.Record.chem_desc.toUpperCase();
        }
        if (field == 'chem_info_type') {
            this.Record.chem_info_type = this.Record.chem_info_type.toUpperCase();
        }
        if (field == 'chem_info_qualifier') {
            this.Record.chem_info_qualifier = this.Record.chem_info_qualifier.toUpperCase();
        }
    }

    OnChange(field: string) {

        if (field == "chem_type" && this.mode == "ADD") {
            this.Record.chem_info_type = '';
            this.Record.chem_info_qualifier = '';
            if(this.Record.chem_type=="SW_INFO_TYPE")
            {
                this.Record.chem_info_type = 'CHR';
                this.Record.chem_info_qualifier = 'SMC';
            }
        }
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
