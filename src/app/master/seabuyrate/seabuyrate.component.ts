import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SeaBuyRate } from '../models/seabuyrate';
import { SeaBuyRateService } from '../services/seabuyrate.service';
import { WarningAlertComponent } from '../../shared/warningalert/warningalert.component';

@Component({
  selector: 'app-seabuyrate',
  templateUrl: './seabuyrate.component.html',
  providers: [SeaBuyRateService]
})
export class SeaBuyRateComponent {
  // Local Variables 
  title = 'Sea Buyrate Details';

  // @ViewChild('addressComponent') addressComponent: any;
  @ViewChild('WarnMsg') private _WarnMsg: WarningAlertComponent;

  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  /// selectedRowIndex = 0;
  
  ispercent = false;
  disableSave = true;
  loading = false;
  /// currentTab = 'LIST';
  bPrint = false;
  bDelete = false;
  bAdmin = false;
  /// allbr = false;

  dbkmode = '';
  searchstring = '';
  /// page_count = 0;
  /// page_current = 0;
  /// page_rows = 0;
  /// page_rowcount = 0;

  sub: any;
  urlid: string;
  modal: any;
  /// fromdate: string = "";
  /// todate: string = "";
  /// search_validdate: string = "";
  /// search_tradelane: string = "";
  /// search_pol: string = "";
  /// search_pod: string = "";
  /// search_liner: string = "";
  /// search_branch_code: string = "";
  /// sort_by = "sbr_valid_from,sbr_valid_to";
  /// print_format = "FORMAT-1";
  /// search_tradelane_id: string = "";
  /// search_pol_id: string = "";
  /// search_pod_id: string = "";
  /// search_liner_id: string = "";

  /// ErrorMessage = "";
  /// InfoMessage = "";


  /// mode = '';
  /// pkid = '';

  POLRECORD: any = {};
  PODRECORD: any = {};
  LINERRECORD: any = {};
  TRADELANERECORD: any = {};

  /// Array For Displaying List
  /// RecordList: SeaBuyRate[] = [];
  /// Single Record for add/edit/view details
  Record: SeaBuyRate = new SeaBuyRate;

  constructor(
    private modalService: NgbModal,
    public ms: SeaBuyRateService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    /// this.page_count = 0;
    /// this.page_rows = 30;
    /// this.page_current = 0;


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

    this.ms.init(this.menuid, this.type);

    if (this.bAdmin) {
      this.ms.state.search_branch_code = '';
      this.ms.state.allbr = true;
    }
    if(!this.ms.state.Initialized){
      this.List('NEW');
      this.ms.state.Initialized = true;
    }
    /// to load add/edit screen when selected
    if (this.ms.state.mode == "ADD")
        this.ActionHandler('LIST', '');
    else if (this.ms.state.mode == "EDIT")
        this.ActionHandler('EDIT', this.ms.state.pkid);
  }

  InitComponent() {
    /// this.search_branch_code = this.gs.globalVariables.branch_code;
    /// this.fromdate = this.gs.defaultValues.monthbegindate;
    /// this.todate = '';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      this.bPrint = this.menu_record.rights_print;
      this.bDelete = this.menu_record.rights_delete;
      this.bAdmin = this.menu_record.rights_admin;
    }
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /// for restore selected row in list
  ngAfterViewInit() {
    this.restoreRowPosition();
  }

  restoreRowPosition(){
    setTimeout(() => {
      this.scrollToRowPosition();
    }, 100);
  }

  scrollToRowPosition() {
    const row = document.getElementById('row-' + this.ms.state.selectedRowIndex);
    if (row) {
      row.scrollIntoView({
        behavior: 'auto',
        block: 'center'
      });
    }
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
    //this.ms.LoadDefault(SearchData)
    //  .subscribe(response => {
    //    this.loading = false;

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = JSON.parse(error._body).Message;
    //  });

    // this.List("NEW");
  }


  LovSelected(_Record: any) {

    if (_Record.controlname == "POL") {
      this.Record.sbr_pol_id = _Record.id;
      this.Record.sbr_pol_code = _Record.code;
      this.Record.sbr_pol_name = _Record.name;
    }
    if (_Record.controlname == "POD") {
      this.Record.sbr_pod_id = _Record.id;
      this.Record.sbr_pod_code = _Record.code;
      this.Record.sbr_pod_name = _Record.name;
    }
    if (_Record.controlname == "LINER") {
      this.Record.sbr_carrier_id = _Record.id;
      this.Record.sbr_carrier_code = _Record.code;
      this.Record.sbr_carrier_name = _Record.name;
    }
    if (_Record.controlname == "TRADELANE") {
      this.Record.sbr_tradelane_id = _Record.id;
      this.Record.sbr_tradelane_code = _Record.code;
      this.Record.sbr_tradelane_name = _Record.name;
    }

    if (_Record.controlname == "BRANCH") {
      this.ms.state.search_branch_code = _Record.code;
    }

    if (_Record.controlname == "SEARCHPOL") {
      this.ms.state.search_pol_id = _Record.id;
      this.ms.state.search_pol = _Record.name;
    }
    if (_Record.controlname == "SEARCHPOD") {
      this.ms.state.search_pod_id = _Record.id;
      this.ms.state.search_pod = _Record.name;
    }
    if (_Record.controlname == "SEARCHLINER") {
      this.ms.state.search_liner_id = _Record.id;
      this.ms.state.search_liner = _Record.name;
    }
    if (_Record.controlname == "SEARCHTRADELANE") {
      this.ms.state.search_tradelane_id = _Record.id;
      this.ms.state.search_tradelane = _Record.name;
    }
  }



  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    if (action == 'LIST') {
      this.ms.state.mode = '';
      this.ms.state.pkid = '';
      this.ms.state.currentTab = 'LIST';
      this.restoreRowPosition();
    }
    else if (action === 'ADD') {
      this.ms.state.currentTab = 'DETAILS';
      this.ms.state.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.ms.state.currentTab = 'DETAILS';
      this.ms.state.mode = 'EDIT';
      this.ResetControls();
      this.ms.state.pkid = id;
      this.GetRecord(id);
    }
  }


  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.ms.state.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.ms.state.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;
    return this.disableSave;
  }

  // Query List Data
  List(_type: string) {

    if (!this.ms.state.allbr) {
      if (this.gs.isBlank(this.ms.state.search_branch_code)) {
        alert('Enter the Branch or Select All');
        return;
      }
    }
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      page_count: this.ms.state.page_count,
      page_current: this.ms.state.page_current,
      page_rows: this.ms.state.page_rows,
      page_rowcount: this.ms.state.page_rowcount,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.ms.state.search_branch_code,
      from_date: this.ms.state.fromdate,
      to_date: this.ms.state.todate,
      report_folder: this.gs.globalVariables.report_folder,
      sort_by: this.ms.state.sort_by,
      is_admin: this.bAdmin,
      search_validdate: this.ms.state.search_validdate,
      search_tradelane: this.ms.state.search_tradelane,
      search_pol: this.ms.state.search_pol,
      search_pod: this.ms.state.search_pod,
      search_liner: this.ms.state.search_liner,
      search_tradelane_id: this.ms.state.search_tradelane_id,
      search_pol_id: this.ms.state.search_pol_id,
      search_pod_id: this.ms.state.search_pod_id,
      search_liner_id: this.ms.state.search_liner_id,
      allbr: this.ms.state.allbr,
      print_format: this.ms.state.print_format
    };

    this.ms.state.selectedRowIndex = 0;
    this.restoreRowPosition();
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    this.ms.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.ms.state.RecordList = response.list;
          this.ms.state.page_count = response.page_count;
          this.ms.state.page_current = response.page_current;
          this.ms.state.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  NewRecord() {
    this.ms.state.pkid = this.gs.getGuid();

    this.Record = new SeaBuyRate();
    this.Record.sbr_pkid = this.ms.state.pkid;
    this.Record.rec_mode = this.ms.state.mode;
    this.Init();
    // this.ClearRates();

    this.POLRECORD = { 'controlname': 'POL', 'type': 'SEA PORT', displaycolumn: 'CODE', id: '', code: '', name: '' };
    this.PODRECORD = { 'controlname': 'POD', 'type': 'SEA PORT', displaycolumn: 'CODE', id: '', code: '', name: '' };
    this.LINERRECORD = { 'controlname': 'LINER', 'type': 'SEA CARRIER', displaycolumn: 'CODE', id: '', code: '', name: '' };
    this.TRADELANERECORD = { 'controlname': 'TRADELANE', 'type': 'COUNTRY', displaycolumn: 'CODE', id: '', code: '', name: '' };
  }

  Init() {
    // lblStatus.Text = "";
    this.Record.sbr_pol_id = "";
    this.Record.sbr_pol_code = "";
    this.Record.sbr_pol_name = "";
    this.Record.sbr_pod_id = "";
    this.Record.sbr_pod_code = "";
    this.Record.sbr_pod_name = "";
    this.Record.sbr_tradelane_id = "";
    this.Record.sbr_tradelane_code = "";
    this.Record.sbr_tradelane_name = "";
    this.Record.sbr_carrier_id = "";
    this.Record.sbr_carrier_code = "";
    this.Record.sbr_carrier_name = "";
    this.Record.sbr_routing = '';
    this.Record.sbr_remarks = '';
    this.Record.sbr_valid_from = '';
    this.Record.sbr_valid_to = '';
    this.Record.sbr_gst_rate = 0;
    this.Record.sbr_terms = 'PREPAID';
    this.Record.sbr_cntr_type = 'STANDARD';
    this.Record.rec_branch_code = this.gs.globalVariables.branch_code;
    this.ClearRates();
  }

  ClearRates() {
    this.Record.sbr_transit = '';
    this.Record.sbr_dest_freetime = '';
    this.Record.sbr_20_allin = 0;
    this.Record.sbr_40_allin = 0;
    this.Record.sbr_40hc_allin = 0;
    this.Record.sbr_20 = 0;
    this.Record.sbr_40 = 0;
    this.Record.sbr_40hc = 0;
    this.Record.sbr_20_baf = 0;
    this.Record.sbr_20_caf = 0;
    this.Record.sbr_20_ddc = 0;
    this.Record.sbr_20_pss = 0;
    this.Record.sbr_20_ebf = 0;
    this.Record.sbr_20_chassis = 0;
    this.Record.sbr_20_suez = 0;
    this.Record.sbr_20_piracy = 0;
    this.Record.sbr_20_ihc = 0;
    this.Record.sbr_20_ifs = 0;
    this.Record.sbr_20_other = 0;
    this.Record.sbr_20_acd = 0;
    this.Record.sbr_20_isps = 0;
    this.Record.sbr_40_baf = 0;
    this.Record.sbr_40_caf = 0;
    this.Record.sbr_40_ddc = 0;
    this.Record.sbr_40_pss = 0;
    this.Record.sbr_40_ebf = 0;
    this.Record.sbr_40_chassis = 0;
    this.Record.sbr_40_suez = 0;
    this.Record.sbr_40_piracy = 0;
    this.Record.sbr_40_ihc = 0;
    this.Record.sbr_40_ifs = 0;
    this.Record.sbr_40_other = 0;
    this.Record.sbr_40_acd = 0;
    this.Record.sbr_40_isps = 0;
    this.Record.sbr_40hc_baf = 0;
    this.Record.sbr_40hc_caf = 0;
    this.Record.sbr_40hc_ddc = 0;
    this.Record.sbr_40hc_pss = 0;
    this.Record.sbr_40hc_ebf = 0;
    this.Record.sbr_40hc_chassis = 0;
    this.Record.sbr_40hc_suez = 0;
    this.Record.sbr_40hc_piracy = 0;
    this.Record.sbr_40hc_ihc = 0;
    this.Record.sbr_40hc_ifs = 0;
    this.Record.sbr_40hc_other = 0;
    this.Record.sbr_40hc_acd = 0;
    this.Record.sbr_40hc_isps = 0;

    // Lbl_Predata.Text = "";

    this.Record.sbr_frequency = 'ONCE IN A WEEK';
    this.Record.sbr_vsl_cutoff = '';
    this.Record.sbr_sail_day = '';
    this.Record.sbr_routing = '';
    this.Record.sbr_remarks = '';
  }


  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    this.ms.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  LoadData(_Record: SeaBuyRate) {
    this.Record = _Record;
    this.Record.rec_mode = this.ms.state.mode;

    this.POLRECORD = { 'controlname': 'POL', 'type': 'SEA PORT', displaycolumn: 'CODE', id: this.Record.sbr_pol_id, code: this.Record.sbr_pol_code, name: this.Record.sbr_pol_name };
    this.PODRECORD = { 'controlname': 'POD', 'type': 'SEA PORT', displaycolumn: 'CODE', id: this.Record.sbr_pod_id, code: this.Record.sbr_pod_code, name: this.Record.sbr_pod_name };
    this.LINERRECORD = { 'controlname': 'LINER', 'type': 'SEA CARRIER', displaycolumn: 'CODE', id: this.Record.sbr_carrier_id, code: this.Record.sbr_carrier_code, name: this.Record.sbr_carrier_name };
    this.TRADELANERECORD = { 'controlname': 'TRADELANE', 'type': 'COUNTRY', displaycolumn: 'CODE', id: this.Record.sbr_tradelane_id, code: this.Record.sbr_tradelane_code, name: this.Record.sbr_tradelane_name };
    //Fill Duplicate buyrate
    if (this.ms.state.mode == "ADD") {
      this.Record.sbr_pkid = this.ms.state.pkid;
    }
  }

  // Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.loading = true;
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;

    this.ms.CanSave(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (response.warningmsg.length > 0) {
          // if (confirm(response.warningmsg)) {
          //   this.Save2();
          // }
          this._WarnMsg.showConfirm(response.warningmsg).then((confirmed) => {
            if (confirmed) {
             this.Save2();
            }
          });

        } else
          this.Save2();

      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);

        });
  }

  Save2() {

    this.loading = true;
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;

    this.ms.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.ms.state.InfoMessage = "Save Complete";
        this.ms.state.mode = 'EDIT';
        this.Record.rec_mode = this.ms.state.mode;
        this.RefreshList();
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    // if (this.Record.dbk_slno.trim().length <= 0) {
    //   bret = false;
    //   sError = " | Drawback Code Cannot Be Blank";
    // }

    // if (bret === false)
    //   this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.ms.state.RecordList == null)
      return;
    var REC = this.ms.state.RecordList.find(rec => rec.sbr_pkid == this.Record.sbr_pkid);
    if (REC == null) {
      this.ms.state.RecordList.push(this.Record);
      this.ms.state.selectedRowIndex = this.ms.state.RecordList.length - 1;
    }
    else {
      REC.sbr_tradelane_name = this.Record.sbr_tradelane_name;
      REC.sbr_pol_name = this.Record.sbr_pol_name;
      REC.sbr_pod_name = this.Record.sbr_pod_name;
      REC.sbr_carrier_name = this.Record.sbr_carrier_name;
      REC.sbr_frequency = this.Record.sbr_frequency;
      REC.sbr_routing = this.Record.sbr_routing;
      if (this.Record.sbr_vsl_cutoff.length > 0)
        REC.sbr_vsl_cutoff = "DAY " + this.Record.sbr_vsl_cutoff;
      if (this.Record.sbr_sail_day.length > 0)
        REC.sbr_sail_day = "DAY " + this.Record.sbr_sail_day;
      REC.sbr_transit = this.Record.sbr_transit;
      REC.sbr_dest_freetime = this.Record.sbr_dest_freetime;
      REC.sbr_20_allin = this.Record.sbr_20_allin;
      REC.sbr_40_allin = this.Record.sbr_40_allin;
      REC.sbr_40hc_allin = this.Record.sbr_40hc_allin;
      REC.sbr_20_acd = this.Record.sbr_20_acd;
      REC.sbr_40_acd = this.Record.sbr_40_acd;
      REC.sbr_40hc_acd = this.Record.sbr_40hc_acd;
      REC.sbr_valid_from = this.Record.sbr_valid_from;
      REC.sbr_valid_to = this.Record.sbr_valid_to;
    }
  }

  RemoveRecord(Id: string) {

    if (!confirm("DELETE RECORD")) {
      return;
    }

    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    this.loading = true;
    let SearchData = {
      pkid: Id
    };

    this.ms.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ms.state.RecordList.splice(this.ms.state.RecordList.findIndex(rec => rec.sbr_pkid == Id), 1);
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  OnBlur(field: string) {

    if (field == 'sbr_pol_name') {
      this.Record.sbr_pol_name = this.Record.sbr_pol_name.toUpperCase();
    }
    if (field == 'sbr_pod_name') {
      this.Record.sbr_pod_name = this.Record.sbr_pod_name.toUpperCase();
    }
    if (field == 'sbr_carrier_name') {
      this.Record.sbr_carrier_name = this.Record.sbr_carrier_name.toUpperCase();
    }
    if (field == 'sbr_tradelane_name') {
      this.Record.sbr_tradelane_name = this.Record.sbr_tradelane_name.toUpperCase();
    }
    if (field == 'sbr_transit') {
      this.Record.sbr_transit = this.Record.sbr_transit.toUpperCase();
    }

    if (field == 'sbr_dest_freetime') {
      this.Record.sbr_dest_freetime = this.Record.sbr_dest_freetime.toUpperCase();
    }
    if (field == 'sbr_routing') {
      this.Record.sbr_routing = this.Record.sbr_routing.toUpperCase();
    }

    if (field == 'sbr_remarks') {
      this.Record.sbr_remarks = this.Record.sbr_remarks.toUpperCase();
    }

    if (field == 'sbr_vsl_cutoff') {
      this.Record.sbr_vsl_cutoff = this.Record.sbr_vsl_cutoff.toUpperCase();
    }

    if (field == 'sbr_sail_day') {
      this.Record.sbr_sail_day = this.Record.sbr_sail_day.toUpperCase();
    }


    if (field == 'sbr_20') {
      this.Record.sbr_20 = this.gs.roundNumber(this.Record.sbr_20, 2);
    }



    if (field == 'sbr_40') {
      this.Record.sbr_40 = this.gs.roundNumber(this.Record.sbr_40, 2);
    }

    if (field == 'sbr_40hc') {
      this.Record.sbr_40hc = this.gs.roundNumber(this.Record.sbr_40hc, 2);
    }

    if (field == 'sbr_20_baf') {
      this.Record.sbr_20_baf = this.gs.roundNumber(this.Record.sbr_20_baf, 2);
    }

    if (field == 'sbr_20_caf') {
      this.Record.sbr_20_caf = this.gs.roundNumber(this.Record.sbr_20_caf, 2);
    }

    if (field == 'sbr_20_ddc') {
      this.Record.sbr_20_ddc = this.gs.roundNumber(this.Record.sbr_20_ddc, 2);
    }

    if (field == 'sbr_20_pss') {
      this.Record.sbr_20_pss = this.gs.roundNumber(this.Record.sbr_20_pss, 2);
    }

    if (field == 'sbr_20_ebf') {
      this.Record.sbr_20_ebf = this.gs.roundNumber(this.Record.sbr_20_ebf, 2);
    }

    if (field == 'sbr_20_chassis') {
      this.Record.sbr_20_chassis = this.gs.roundNumber(this.Record.sbr_20_chassis, 2);
    }

    if (field == 'sbr_20_suez') {
      this.Record.sbr_20_suez = this.gs.roundNumber(this.Record.sbr_20_suez, 2);
    }

    if (field == 'sbr_20_piracy') {
      this.Record.sbr_20_piracy = this.gs.roundNumber(this.Record.sbr_20_piracy, 2);
    }

    if (field == 'sbr_20_ihc') {
      this.Record.sbr_20_ihc = this.gs.roundNumber(this.Record.sbr_20_ihc, 2);
    }

    if (field == 'sbr_20_ifs') {
      this.Record.sbr_20_ifs = this.gs.roundNumber(this.Record.sbr_20_ifs, 2);
    }

    if (field == 'sbr_20_other') {
      this.Record.sbr_20_other = this.gs.roundNumber(this.Record.sbr_20_other, 2);
    }

    if (field == 'sbr_20_acd') {
      this.Record.sbr_20_acd = this.gs.roundNumber(this.Record.sbr_20_acd, 2);
    }

    if (field == 'sbr_20_isps') {
      this.Record.sbr_20_isps = this.gs.roundNumber(this.Record.sbr_20_isps, 2);
    }

    if (field == 'sbr_40_baf') {
      this.Record.sbr_40_baf = this.gs.roundNumber(this.Record.sbr_40_baf, 2);
    }

    if (field == 'sbr_40_caf') {
      this.Record.sbr_40_caf = this.gs.roundNumber(this.Record.sbr_40_caf, 2);
    }

    if (field == 'sbr_40_ddc') {
      this.Record.sbr_40_ddc = this.gs.roundNumber(this.Record.sbr_40_ddc, 2);
    }

    if (field == 'sbr_40_pss') {
      this.Record.sbr_40_pss = this.gs.roundNumber(this.Record.sbr_40_pss, 2);
    }

    if (field == 'sbr_40_ebf') {
      this.Record.sbr_40_ebf = this.gs.roundNumber(this.Record.sbr_40_ebf, 2);
    }

    if (field == 'sbr_40_chassis') {
      this.Record.sbr_40_chassis = this.gs.roundNumber(this.Record.sbr_40_chassis, 2);
    }

    if (field == 'sbr_40_suez') {
      this.Record.sbr_40_suez = this.gs.roundNumber(this.Record.sbr_40_suez, 2);
    }

    if (field == 'sbr_40_piracy') {
      this.Record.sbr_40_piracy = this.gs.roundNumber(this.Record.sbr_40_piracy, 2);
    }

    if (field == 'sbr_40_ihc') {
      this.Record.sbr_40_ihc = this.gs.roundNumber(this.Record.sbr_40_ihc, 2);
    }

    if (field == 'sbr_40_ifs') {
      this.Record.sbr_40_ifs = this.gs.roundNumber(this.Record.sbr_40_ifs, 2);
    }

    if (field == 'sbr_40_other') {
      this.Record.sbr_40_other = this.gs.roundNumber(this.Record.sbr_40_other, 2);
    }

    if (field == 'sbr_40_acd') {
      this.Record.sbr_40_acd = this.gs.roundNumber(this.Record.sbr_40_acd, 2);
    }

    if (field == 'sbr_40_isps') {
      this.Record.sbr_40_isps = this.gs.roundNumber(this.Record.sbr_40_isps, 2);
    }

    if (field == 'sbr_40hc_baf') {
      this.Record.sbr_40hc_baf = this.gs.roundNumber(this.Record.sbr_40hc_baf, 2);
    }

    if (field == 'sbr_40hc_caf') {
      this.Record.sbr_40hc_caf = this.gs.roundNumber(this.Record.sbr_40hc_caf, 2);
    }

    if (field == 'sbr_40hc_ddc') {
      this.Record.sbr_40hc_ddc = this.gs.roundNumber(this.Record.sbr_40hc_ddc, 2);
    }

    if (field == 'sbr_40hc_pss') {
      this.Record.sbr_40hc_pss = this.gs.roundNumber(this.Record.sbr_40hc_pss, 2);
    }

    if (field == 'sbr_40hc_ebf') {
      this.Record.sbr_40hc_ebf = this.gs.roundNumber(this.Record.sbr_40hc_ebf, 2);
    }

    if (field == 'sbr_40hc_chassis') {
      this.Record.sbr_40hc_chassis = this.gs.roundNumber(this.Record.sbr_40hc_chassis, 2);
    }

    if (field == 'sbr_40hc_suez') {
      this.Record.sbr_40hc_suez = this.gs.roundNumber(this.Record.sbr_40hc_suez, 2);
    }

    if (field == 'sbr_40hc_piracy') {
      this.Record.sbr_40hc_piracy = this.gs.roundNumber(this.Record.sbr_40hc_piracy, 2);
    }

    if (field == 'sbr_40hc_ihc') {
      this.Record.sbr_40hc_ihc = this.gs.roundNumber(this.Record.sbr_40hc_ihc, 2);
    }

    if (field == 'sbr_40hc_ifs') {
      this.Record.sbr_40hc_ifs = this.gs.roundNumber(this.Record.sbr_40hc_ifs, 2);
    }

    if (field == 'sbr_40hc_other') {
      this.Record.sbr_40hc_other = this.gs.roundNumber(this.Record.sbr_40hc_other, 2);
    }

    if (field == 'sbr_40hc_acd') {
      this.Record.sbr_40hc_acd = this.gs.roundNumber(this.Record.sbr_40hc_acd, 2);
    }

    if (field == 'sbr_40hc_isps') {
      this.Record.sbr_40hc_isps = this.gs.roundNumber(this.Record.sbr_40hc_isps, 2);
    }
    if (field == 'sbr_gst_rate') {
      this.Record.sbr_gst_rate = this.gs.roundNumber(this.Record.sbr_gst_rate, 2);
    }

    if (field == 'search_tradelane') {
      this.ms.state.search_tradelane = this.ms.state.search_tradelane.toUpperCase();
    }
    if (field == 'search_pol') {
      this.ms.state.search_pol = this.ms.state.search_pol.toUpperCase();
    }
    if (field == 'search_pod') {
      this.ms.state.search_pod = this.ms.state.search_pod.toUpperCase();
    }
    if (field == 'search_liner') {
      this.ms.state.search_liner = this.ms.state.search_liner.toUpperCase();
    }

  }
  OnChange(field: string) {
    if (this.ms.state.allbr)
      this.ms.state.search_branch_code = '';
    else
      this.ms.state.search_branch_code = this.gs.globalVariables.branch_code;
  }

  Close() {
    this.gs.ClosePage('home');
  }


  // SearchRecord(controlname: string) {
  //   this.InfoMessage = '';
  //   this.loading = true;
  //   let SearchData = {
  //     pkid: '',
  //     parentid:'',
  //     table: 'DBK-UPDATE-FILE'
  //   };

  //   if (controlname == 'DBK-UPDATE-FILE') {
  //     SearchData.pkid = '';
  //     SearchData.parentid = '';
  //     SearchData.table = 'dbk-update-file';
  //   }

  //   this.gs.SearchRecord(SearchData)
  //     .subscribe(response => {
  //       this.loading = false;
  //       if(response.serror.length>0)
  //       this.ErrorMessage = response.serror;
  //       else 
  //       {
  //         let strmsg: string = "";
  //         strmsg = "PROCESS DBK RATES  \n\n FILE NAME : " + response.filename +" \n\n UPLOADED ON : " + response.uploaddate;
  //         if (confirm(strmsg)) {
  //           this.ProcessDbkRates();
  //         }
  //       }
  //     },
  //     error => {
  //       this.loading = false;
  //       this.InfoMessage = this.gs.getError(error);
  //     });
  //   }

  // ProcessDbkRates(){
  //   this.loading = true;
  //   let SearchData = {
  //     pkid: '',
  //     dbkmode:'',
  //     comp_code:'',
  //     user_code:'',
  //     ispercent:'N',
  //     root_folder:''
  //   };

  //   SearchData.dbkmode=this.dbkmode;
  //   SearchData.comp_code=this.gs.globalVariables.comp_code;
  //   SearchData.user_code=this.gs.globalVariables.user_code;
  //   SearchData.ispercent= this.ispercent == true?'Y':'N';
  //   SearchData.root_folder=this.gs.defaultValues.root_folder;


  //   this.ErrorMessage = '';
  //   this.InfoMessage = '';
  //   this.ms.ProcessDrawbackRates(SearchData)
  //     .subscribe(response => {
  //       this.loading = false;
  //       this.InfoMessage = "Process Complete";
  //       alert(this.InfoMessage);
  //     },
  //     error => {
  //       this.loading = false;
  //       this.ErrorMessage = this.gs.getError(error);
  //     });

  // }
  ShowDocuments(doc: any) {
    this.ms.state.ErrorMessage = '';
    this.open(doc);
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  DuplicateBuyrate(_id: string) {
    if (!confirm("Copy Selected Record ?")) {
      return;
    }
    this.ActionHandler('ADD', '');
    this.GetRecord(_id);
  }


}
