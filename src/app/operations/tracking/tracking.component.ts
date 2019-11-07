import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Trackingm } from '../models/tracking';
import { TrackingService } from '../services/tracking.service';
import { SearchTable } from '../../shared/models/searchtable';
import { AutoCompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { DateComponent } from '../../shared/date/date.component';


@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  providers: [TrackingService]
})
export class TrackingComponent {
  // Local Variables 
  title = 'Tracking List';



  //@ViewChild('VesselLov') private VesselLov: ElementRef;

  @ViewChild('VesselLov') private VesselLov: AutoCompleteComponent;
  
  @ViewChild('trk_pol_etd') private trk_pol_etd: DateComponent;
  @ViewChild('trk_pod_eta') private trk_pod_eta: DateComponent;

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';

  selectedRowIndex: number = -1;

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';
  vesseltype = 'AIR CARRIER';
  porttype = 'SEA PORT';
  bChanged: boolean;

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  ctr: number;

  // Array For Displaying List
  RecordList: Trackingm[] = [];
  // Single Record for add/edit/view details
  Record: Trackingm = new Trackingm;
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();
  VESSELRECORD: SearchTable = new SearchTable();
  constructor(
    private mainService: TrackingService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (this.type == "AIR EXPORT") {
      this.vesseltype = 'AIR CARRIER';
      this.porttype = 'AIR PORT';
    } else {
      this.vesseltype = 'VESSEL';
      this.porttype = 'SEA PORT';
    }
    this.InitLov();
    this.List("NEW");
    this.ActionHandler("ADD", null);
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  InitLov() {
    this.POLRECORD = new SearchTable();
    this.POLRECORD.controlname = "POL";
    this.POLRECORD.displaycolumn = "CODE";
    this.POLRECORD.type = this.porttype;
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";

    this.PODRECORD = new SearchTable();
    this.PODRECORD.controlname = "POD";
    this.PODRECORD.displaycolumn = "CODE";
    this.PODRECORD.type = this.porttype;
    this.PODRECORD.id = "";
    this.PODRECORD.code = "";
    this.PODRECORD.name = "";

    this.VESSELRECORD = new SearchTable();
    this.VESSELRECORD.controlname = "VSL";
    this.VESSELRECORD.displaycolumn = "CODE";
    this.VESSELRECORD.type = this.vesseltype;
    this.VESSELRECORD.id = "";
    this.VESSELRECORD.code = "";
    this.VESSELRECORD.name = "";
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "POL") {
      this.Record.trk_pol_id = _Record.id;
      this.Record.trk_pol_code = _Record.code;
      this.Record.trk_pol_name = _Record.name;
    }

    if (_Record.controlname == "POD") {
      this.Record.trk_pod_id = _Record.id;
      this.Record.trk_pod_code = _Record.code;
      this.Record.trk_pod_name = _Record.name;
    }

    if (_Record.controlname == "VSL") {
      this.Record.trk_vsl_id = _Record.id;
      this.Record.trk_vsl_code = _Record.code;
      this.Record.trk_vsl_name = _Record.name;
    }
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


  RemoveList(event: any) {
    if (event.selected) {
      this.ActionHandler('REMOVE', event.id)
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
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code
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
    this.Record = new Trackingm();
    this.Record.trk_pkid = this.pkid;
    this.Record.trk_vsl_id = '';
    this.Record.trk_vsl_code = '';
    this.Record.trk_vsl_name = '';
    this.Record.trk_voyage = '';
    this.Record.trk_pol_id = '';
    this.Record.trk_pol_code = '';
    this.Record.trk_pol_name = '';
    this.Record.trk_pol_etd = '';
    this.Record.trk_pol_etd_confirm = false;
    this.Record.trk_pod_id = '';
    this.Record.trk_pod_code = '';
    this.Record.trk_pod_name = '';
    this.Record.trk_pod_eta = '';
    this.Record.trk_pod_eta_confirm = false;

    this.Record.rec_mode = this.mode;
    this.InitLov();
    // this.VesselLov.nativeElement.focus();

    this.VesselLov.Focus();

    if (this.RecordList != null) {
      if (this.RecordList.length > 0) {
        this.Record.trk_pol_id = this.RecordList[this.RecordList.length - 1].trk_pod_id;
        this.Record.trk_pol_code = this.RecordList[this.RecordList.length - 1].trk_pod_code;;
        this.Record.trk_pol_name = this.RecordList[this.RecordList.length - 1].trk_pod_name;;
        this.POLRECORD.id = this.Record.trk_pol_id;
        this.POLRECORD.code = this.Record.trk_pol_code;
        this.POLRECORD.name = this.Record.trk_pol_name;
      }
    }
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

  LoadData(_Record: Trackingm) {
    this.Record = _Record;
    this.InitLov();

    this.POLRECORD.id = this.Record.trk_pol_id;
    this.POLRECORD.code = this.Record.trk_pol_code;
    this.POLRECORD.name = this.Record.trk_pol_name;

    this.PODRECORD.id = this.Record.trk_pod_id;
    this.PODRECORD.code = this.Record.trk_pod_code;
    this.PODRECORD.name = this.Record.trk_pod_name;

    this.VESSELRECORD.id = this.Record.trk_vsl_id;
    this.VESSELRECORD.code = this.Record.trk_vsl_code;
    this.VESSELRECORD.name = this.Record.trk_vsl_name;

    this.Record.rec_mode = this.mode;
    // this.VesselLov.nativeElement.focus();

    this.VesselLov.Focus();
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record.trk_parent_id = this.parentid;
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

    if (this.Record.trk_vsl_id.trim().length <= 0) {
      bret = false;
      if (this.type == "SEA EXPORT")
        sError += "\n\r | Vessel Cannot Be Blank";
      else
        sError += "\n\r | Airline Cannot Be Blank";
    }
    if (this.Record.trk_voyage.trim().length <= 0) {
      bret = false;
      if (this.type == "SEA EXPORT")
        sError += "\n\r | Voyage Cannot Be Blank";
      else
        sError += "\n\r | Flight# Cannot Be Blank";
    }
    if (this.Record.trk_pol_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POL Cannot Be Blank";
    }
    if (this.Record.trk_pol_etd.trim().length <= 0) {
      bret = false;
      sError += "\n\r | ETD Cannot Be Blank";
    }
    if (this.Record.trk_pod_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POD Cannot Be Blank";
    }
    if (this.Record.trk_pod_eta.trim().length <= 0) {
      bret = false;
      sError += "\n\r | ETA Cannot Be Blank";
    }
   
    // if(this.Record.trk_pkid == this.parentid && this.RecordList.length==1)
    // {
    //   bret = false;
    //   sError = "\n\r | Update tracking in Basic Details if there is no Transit Shipment";
    // }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.trk_pkid == this.Record.trk_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
      REC = this.RecordList.find(rec => rec.trk_pkid == this.Record.trk_pkid);
      REC.trk_pol_etd = this.trk_pol_etd.GetDisplayDate();
      REC.trk_pod_eta = this.trk_pod_eta.GetDisplayDate();
    }
    else {
      REC.trk_vsl_name = this.Record.trk_vsl_name;
      REC.trk_voyage = this.Record.trk_voyage;
      REC.trk_pol_name = this.Record.trk_pol_name;
      REC.trk_pol_etd =  this.trk_pol_etd.GetDisplayDate();
      REC.trk_pol_etd_confirm = this.Record.trk_pol_etd_confirm;
      REC.trk_pod_name = this.Record.trk_pod_name;
      REC.trk_pod_eta = this.trk_pod_eta.GetDisplayDate();
      REC.trk_pod_eta_confirm = this.Record.trk_pod_eta_confirm;
    }
  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      pkid: Id,
      parentid: this.parentid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.trk_pkid == this.pkid), 1);
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

      case 'trk_voyage':
        {
          this.Record.trk_voyage = this.Record.trk_voyage.toUpperCase().trim();
          break;
        }
    }
  }
}
