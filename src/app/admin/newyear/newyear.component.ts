import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Menum } from '../models/menum';
import { Modulem } from '../models/modulem';

import { MenuService } from '../services/menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    providers : [MenuService]
})
export class MenuComponent {
    // Local Variables 
    title = 'MENU MASTER';
    loading = false;
    currentTab = 'LIST';
    
    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    

    ErrorMessage = "User Details";
    
    mode = '';
    pkid = '';

    // Modules List
    ModuleList: Modulem[] = [];

    // Array For Displaying List
    RecordList: Menum[] = [];
    // Single Record for add/edit/view details
    Record: Menum = new Menum;

    constructor(
        private mainService: MenuService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;

        this.LoadCombo();
        //this.List("NEW"); this is moved to LoadCombo Function
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
    
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action : string, id :string ) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            this.currentTab = 'DETAILS';
            this.mode = 'ADD';
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.pkid = id;
            this.GetRecord(id);
        }
    }

    LoadCombo() {

        this.loading = true;
        let SearchData = {
            type: 'type',
            comp_code : this.gs.globalVariables.comp_code
        };

        this.ErrorMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ModuleList = response.modules;
                this.List("NEW");
            },
            error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
            });
    }


    // Query List Data
    List(_type: string) {

        this.loading = true;

        let SearchData = {
            type: _type,
            searchstring: this.searchstring.toUpperCase(),
            comp_code: this.gs.globalVariables.comp_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };

        this.ErrorMessage = '';
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

        this.pkid = this.gs.getGuid();

        this.Record = new Menum();
        this.Record.menu_pkid = this.pkid;
        this.Record.menu_code = '';
        this.Record.menu_name = '';
        this.Record.menu_route1 = '';
        this.Record.menu_type = '';
        this.Record.rec_mode = this.mode;
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
        };

        this.ErrorMessage = '';
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

    LoadData(_Record: Menum) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
    }


    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';

        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Save Complete";
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
        if (this.Record.menu_code.trim().length <= 0) {
            bret = false;
            sError = "Code Cannot Be Blank";
        }
        if (this.Record.menu_name.trim().length <= 0) {
            bret = false;
            sError += "\n\rName Cannot Be Blank";
        }

        //if (this.Record.user_password.trim().length <= 0) {
        //    bret = false;
        //    sError += "\n\rPassword Cannot Be Blank";
        //}

        if (bret) {
            this.Record.menu_code = this.Record.menu_code.toUpperCase().replace(' ', '');
            this.Record.menu_name = this.Record.menu_name.trim();
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;

        var REC = this.RecordList.find(rec => rec.menu_pkid == this.Record.menu_pkid);
        if (REC == null) {
            this.Record.menu_module_name = this.ModuleList.find(row => row.module_pkid == this.Record.menu_module_id).module_name;
            this.RecordList.push(this.Record);
        }
        else {
            REC.menu_code = this.Record.menu_code;
            REC.menu_name = this.Record.menu_name;
            REC.menu_route1 = this.Record.menu_route1;
            REC.menu_route2 = this.Record.menu_route2;
            REC.menu_order = this.Record.menu_order;
            REC.menu_module_name = this.ModuleList.find(row => row.module_pkid == this.Record.menu_module_id).module_name;
        }
    }
    
    Close() {
        this.gs.ClosePage('home');
    }



}
