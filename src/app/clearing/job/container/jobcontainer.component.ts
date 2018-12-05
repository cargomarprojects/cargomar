import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { JobContainer } from '../../models/jobcontainer';

import { JobContainerService } from '../../services/jobcontainer.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-jobcontainer',
    templateUrl: './jobcontainer.component.html',
    providers: [JobContainerService]
})
export class JobContainerComponent {
    // Local Variables 
    title = 'Container List';

    @ViewChild('cntr_no') private cntr_no: ElementRef;

    @Input() menuid: string = '';
    @Input() type: string = '';

    @Input() parentid: string = '';

    selectedRowIndex: number = -1;

    Total_Amount: number = 0;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;

    // Array For Displaying List
    RecordList: JobContainer[] = [];
    // Single Record for add/edit/view details
    Record: JobContainer = new JobContainer;


    constructor(
        private mainService: JobContainerService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.List("NEW");
        this.ActionHandler("ADD", null);
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {

    }

    LovSelected(_Record: SearchTable) {

    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
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
            this.selectedRowIndex = _selectedRowIndex;
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            this.GetRecord(id);
        }
        else if (action === 'REMOVE') {
            this.currentTab = 'DETAILS';
            this.pkid = id;
            this.RemoveRecord(id);
        }
    }

    ResetControls() {

    }

    List(_type: string) {
        this.loading = true;

        let SearchData = {
            type: _type,
            rowtype: this.type,
            parentid: this.parentid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
            error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
            });
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new JobContainer();
        this.Record.cntr_pkid = this.pkid;
        this.Record.cntr_no = '';
        this.Record.cntr_sealno = '';
        this.Record.cntr_sealdate = '';
        this.Record.cntr_size = '';
        this.Record.cntr_type = 'GP';
        this.Record.cntr_pkts = 0;
        this.Record.cntr_transporter = '';
        this.Record.cntr_sealtype = this.gs.defaultValues.sea_jobcntr_sealtype;
        this.Record.cntr_sealdevice_id = '';
        this.Record.cntr_movdoc_type = '';
        this.Record.cntr_movdoc_number = '';

        this.Record.rec_mode = this.mode;
        this.InitLov();
      
        this.cntr_no.nativeElement.focus();
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

    LoadData(_Record: JobContainer) {
        this.Record = _Record;
        this.InitLov();
        this.Record.rec_mode = this.mode;
        this.cntr_no.nativeElement.focus();
    }

    // Save Data
    Save() {
      if (!this.allvalid())
        return;
      this.loading = true;
      this.ErrorMessage = '';
      this.InfoMessage = '';
      this.Record.cntr_job_id = this.parentid;
      this.Record._globalvariables = this.gs.globalVariables;
      this.mainService.Save(this.Record)
        .subscribe(response => {
          this.loading = false;
          this.InfoMessage = "Save Complete";
          this.mode = 'EDIT';
          this.Record.rec_mode = this.mode;
          this.RefreshList();
          this.ActionHandler('ADD', null);
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

        if (this.Record.cntr_no.trim().length <= 0) {
          bret = false;
          sError += "\n\r | Container Number Cannot Be Blank";
        }

        if (this.Record.cntr_size.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Container Size Cannot Be Blank";
        }


        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.cntr_pkid == this.Record.cntr_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.cntr_no = this.Record.cntr_no;
            REC.cntr_sealno = this.Record.cntr_sealno;
            REC.cntr_sealdate = this.Record.cntr_sealdate;
            REC.cntr_sealtype = this.Record.cntr_sealtype;
            REC.cntr_sealdevice_id = this.Record.cntr_sealdevice_id;
            REC.cntr_movdoc_type = this.Record.cntr_movdoc_type;
            REC.cntr_movdoc_number = this.Record.cntr_movdoc_number;
            REC.cntr_size = this.Record.cntr_size;
            REC.cntr_type = this.Record.cntr_type;
            REC.cntr_pkts = this.Record.cntr_pkts;
            REC.cntr_transporter = this.Record.cntr_transporter;
        }
    }

    RemoveList(event: any) {
      if (event.selected) {
        this.ActionHandler('REMOVE', event.id)
      }
    }
    RemoveRecord(Id: string) {
        this.loading = true;
        let SearchData = {
            pkid: Id,
            parentid: this.parentid
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.cntr_pkid == this.pkid), 1);
                this.ActionHandler('ADD', null);
            },
            error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
            });
    }


    Close() {
        this.gs.ClosePage('home');
    }

    OnFocus(field: string) {
        this.bChanged = false;
    }

    OnChange(field: string) {
        this.bChanged = true;

    }

    OnBlur(field: string) {
      var oldChar = / /gi;//replace all blank space in a string
        switch (field) {
            case 'cntr_no':
                {
              this.Record.cntr_no = this.Record.cntr_no.replace(oldChar, '').toUpperCase();
                    break;
                }
            case 'cntr_sealno':
                {
                    this.Record.cntr_sealno = this.Record.cntr_sealno.toUpperCase();
                    break;
                }
            case 'cntr_transporter':
                {
                    this.Record.cntr_transporter = this.Record.cntr_transporter.toUpperCase();
                    break;
                }
            case 'cntr_size':
                {
                    this.Record.cntr_size = this.Record.cntr_size.toUpperCase();
                    break;
                }
            case 'cntr_sealdevice_id':
                {
                    this.Record.cntr_sealdevice_id = this.Record.cntr_sealdevice_id.toUpperCase();
                    break;
                }
            case 'cntr_movdoc_type':
                {
                    this.Record.cntr_movdoc_type = this.Record.cntr_movdoc_type.toUpperCase();
                    break;
                }
            case 'cntr_movdoc_number':
                {
                    this.Record.cntr_movdoc_number = this.Record.cntr_movdoc_number.toUpperCase();
                    break;
                }
        }
    }

}
