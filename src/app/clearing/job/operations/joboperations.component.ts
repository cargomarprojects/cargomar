import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { JobOperationsm  } from '../../models/joboperations';

import { JobOperationsService } from '../../services/joboperations.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-joboperations',
  templateUrl: './joboperations.component.html',
  providers: [JobOperationsService]
})
export class JobOperationsComponent {
  // Local Variables 
  title = '';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() Invokefrom: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';

  
  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  jobno = '';
  searchstring = '';

  ctr: number;
  jobdisabled = false;
  sub: any;
  bValueChanged: boolean = false;

  // Array For Displaying List
  RecordList: JobOperationsm[] = [];
  // Single Record for add/edit/view details
  Record: JobOperationsm = new JobOperationsm;

  EXPRECORD: SearchTable = new SearchTable();
  EXPADDRRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: JobOperationsService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
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
    this.InitLov();
  }


  InitComponent() {
    this.jobno = '';
    this.searchstring = '';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
    }
    this.ActionHandler("ADD", null);
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (this.parentid != '')
      this.ActionHandler("EDIT", this.parentid);
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {


  }

  LovSelected(_Record: SearchTable) {


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
    else if (action === 'REMOVE') {
      this.currentTab = 'DETAILS';
      this.pkid = id;
      this.RemoveRecord(id);
    }
  }

  ResetControls() {
    if (this.mode == "ADD")
      this.jobdisabled = false;
    else
      this.jobdisabled = true;
  }

  List111(_type: string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      parentid: this.parentid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.title = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.title = response.containerno;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new JobOperationsm();
    this.Record.opr_job_id = this.parentid;
    this.Record.rec_mode = this.mode;
    this.Record.opr_sbill_no = '';
    this.Record.opr_sbill_date = '';
    this.Record.opr_sbillcollect_date = '';
    this.Record.opr_gr_number = '';
    this.Record.opr_gr_date = '';
    this.Record.opr_csno = '';
    this.Record.opr_doc_rcvd_date = '';
    this.Record.opr_cargo_received_on = '';
    this.Record.opr_cleared_date = '';
    this.Record.opr_stuffed_at = '';
    this.Record.opr_stuffed_on = '';
    this.Record.opr_stuff_sent_shipper = '';
    this.Record.opr_stuff_sent_agent = '';
    this.Record.opr_crs = 'NIL';
    this.Record.opr_carting_at = '';
    this.Record.opr_vehicle_no = '';
    this.Record.opr_cargo_arrived_cfs = '';
    this.Record.opr_oc_no = '';
    this.Record.opr_ep_rec_date = '';
    this.Record.opr_ep_sent_date = '';
    this.Record.opr_depb_endorsed_date = '';
    this.Record.opr_eano = '';
    this.Record.opr_eano_date = '';
    this.Record.opr_factory_invno = '';
    this.Record.opr_factory_invdt = '';
    this.Record.opr_ar_no = '';
    this.Record.opr_ar4_rec_date = '';
    this.Record.opr_onboard_sent_shipper = '';
    this.Record.opr_onboard_sent_agent = '';
    this.Record.opr_mate_no = '';
    this.Record.opr_mate_dt = '';
    this.Record.opr_drawback_slno = '';
    this.Record.opr_drawback_date = '';
    this.Record.opr_drawback_amt = 0;
    this.Record.opr_egm_status = 'EGM';
    this.Record.opr_remarks = '';
    this.Record.opr_cargo_received_at = '';
    this.Record.opr_egmno = '';
    this.Record.opr_egmdt = '';
    this.Record.opr_stacked_on = '';
    this.InitLov();

    //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
    //this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
      parentid: this.parentid,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.mode == "ADD")
          this.ActionHandler("ADD", null);
        else {
          this.mode = "EDIT";
          this.LoadData(response.record);
        }
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  LoadData(_Record: JobOperationsm) {
    this.Record = _Record;
    this.InitLov();

    this.Record.rec_mode = this.mode;
  }
  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.opr_job_id = this.parentid;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
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


    if (this.Record.opr_job_id.toString().trim().length <= 0) {
      bret = false;
      sError += "\n\r Parent ID Cannot Be Blank";
    }

    if (bret == false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

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
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.opr_job_id == this.pkid), 1);
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

  OnBlur(field: string) {
    switch (field) {
      case 'opr_sbill_no':
        {
          this.Record.opr_sbill_no = this.Record.opr_sbill_no.toUpperCase();
          this.SearchRecord('opr_sbill_no');
          break;
        }
      case 'opr_gr_number':
        {
          this.Record.opr_gr_number = this.Record.opr_gr_number.toUpperCase();
          break;
        }
      case 'opr_csno':
        {
          this.Record.opr_csno = this.Record.opr_csno.toUpperCase();
          break;
        }
      case 'opr_stuffed_at':
        {
          this.Record.opr_stuffed_at = this.Record.opr_stuffed_at.toUpperCase();
          break;
        }
      case 'opr_carting_at':
        {
          this.Record.opr_carting_at = this.Record.opr_carting_at.toUpperCase();
          break;
        }
      case 'opr_vehicle_no':
        {
          this.Record.opr_vehicle_no = this.Record.opr_vehicle_no.toUpperCase();
          break;
        }
      case 'opr_oc_no':
        {
          this.Record.opr_oc_no = this.Record.opr_oc_no.toUpperCase();
          break;
        }
      case 'opr_eano':
        {
          this.Record.opr_eano = this.Record.opr_eano.toUpperCase();
          break;
        }
      case 'opr_factory_invno':
        {
          this.Record.opr_factory_invno = this.Record.opr_factory_invno.toUpperCase();
          break;
        }
      case 'opr_factory_invdt':
        {
          this.Record.opr_factory_invdt = this.Record.opr_factory_invdt.toUpperCase();
          break;
        }
      case 'opr_ar_no':
        {
          this.Record.opr_ar_no = this.Record.opr_ar_no.toUpperCase();
          break;
        }
      case 'opr_mate_no':
        {
          this.Record.opr_mate_no = this.Record.opr_mate_no.toUpperCase();
          break;
        }
      case 'opr_drawback_slno':
        {
          this.Record.opr_drawback_slno = this.Record.opr_drawback_slno.toUpperCase();
          break;
        }
      case 'opr_drawback_amt':
        {
          this.Record.opr_drawback_amt = this.gs.roundNumber(this.Record.opr_drawback_amt, 2);
          break;
        }
      case 'opr_remarks':
        {
          this.Record.opr_remarks = this.Record.opr_remarks.toUpperCase();
          break;
        }
      case 'opr_cargo_received_at':
        {
          this.Record.opr_cargo_received_at = this.Record.opr_cargo_received_at.toUpperCase();
          break;
        }
      case 'opr_egmno':
        {
          this.Record.opr_egmno = this.Record.opr_egmno.toUpperCase();
          break;
        }
    }
  }

  onLostFocus(field: string) {
    if (this.bValueChanged && field == 'search') {
      this.SearchRecord('opr_job_id');
    }
  }
  OnChange(field: string) {
    if (field == 'search')
      this.bValueChanged = true;
  }
  OnFocus(field: string) {
    if (field == 'search')
      this.bValueChanged = false;
  }

  SearchRecord(controlname: string) {
    this.ErrorMessage = '';

    if (controlname == "opr_sbill_no") {
      if (this.Record.opr_sbill_no.trim().length <= 0)
        return;
      if (this.parentid.trim().length <= 0) {
        this.ErrorMessage = "Invalid ID";
        return;
      }
    }

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      table: 'dupjobsbno',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      sbill_no: '',
      job_pkid: '',
      job_no: ''
    };
    if (controlname == 'opr_sbill_no') {
      SearchData.rowtype = this.type;
      SearchData.table = 'dupjobsbno';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.sbill_no = this.Record.opr_sbill_no;
      SearchData.job_pkid = this.parentid;
    }
    if (controlname == 'opr_job_id') {
      SearchData.rowtype = this.type;
      SearchData.table = 'oprjobid';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.job_no = this.searchstring;
    }
    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';
        if (controlname == 'opr_sbill_no') {
          if (response.dupjobsbno.length > 0) {
            this.ErrorMessage = "Shipping Bill no Duplication, JOB NO " + response.dupjobsbno;
            alert(this.ErrorMessage);
          }
        }
        if (controlname == 'opr_job_id') {
          this.parentid = "";
          this.jobno = "";
          this.ActionHandler("ADD", "");
          if (response.pkid.length > 0) {
            this.parentid = response.pkid;
            this.jobno = response.jobno;
            this.ActionHandler("EDIT", this.parentid);
          } else {
            this.ErrorMessage = " Invalid JOB or SB Number ";
            alert(this.ErrorMessage);
          }
        }

      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  //GetBrAddress(straddress: string) {
  //  let AddressSplit = {
  //    addressbrno: '',
  //    address: ''
  //  };
  //  if (straddress.trim() != "") {
  //    var temparr = straddress.split(' ');
  //    AddressSplit.addressbrno = temparr[0];
  //  }
  //  return AddressSplit;
  //}
  
}
