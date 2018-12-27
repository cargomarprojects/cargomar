import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { GenJobm } from '../models/genjob';
import { GenJobService } from '../services/genjob.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-genjobm',
  templateUrl: './genjob.component.html',
  providers: [GenJobService]
})
export class GenJobComponent {
  // Local Variables 
  title = 'GENERAL JOB MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  //hideLRno = true;
  //  disablecategory = true;
  //disableLRNo = false;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  porttype = 'PORT';

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: GenJobm[] = [];
  // Single Record for add/edit/view details
  Record: GenJobm = new GenJobm;


  SHIPPERRECORD: SearchTable = new SearchTable();
  SHIPPERADDRRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();
  TYPERECORD: SearchTable = new SearchTable();


  constructor(
    private mainService: GenJobService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
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
    this.InitLov();
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
    //    this.StatusList = response.statuslist;

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = this.gs.getError(error);
    //  });

    this.List("NEW");
  }


  InitLov() {

    this.SHIPPERRECORD = new SearchTable();
    this.SHIPPERRECORD.controlname = "SHIPPER";
    this.SHIPPERRECORD.displaycolumn = "CODE";
    this.SHIPPERRECORD.type = "CUSTOMER";
    this.SHIPPERRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.SHIPPERRECORD.id = "";
    this.SHIPPERRECORD.code = "";
    this.SHIPPERRECORD.name = "";
    this.SHIPPERRECORD.parentid = "";

    this.SHIPPERADDRRECORD = new SearchTable();
    this.SHIPPERADDRRECORD.controlname = "SHIPPERADDRESS";
    this.SHIPPERADDRRECORD.displaycolumn = "CODE";
    this.SHIPPERADDRRECORD.type = "CUSTOMERADDRESS";
    this.SHIPPERADDRRECORD.id = "";
    this.SHIPPERADDRRECORD.code = "";
    this.SHIPPERADDRRECORD.name = "";
    this.SHIPPERADDRRECORD.parentid = "";

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

    this.TYPERECORD = new SearchTable();
    this.TYPERECORD.controlname = "TYPE";
    this.TYPERECORD.displaycolumn = "CODE";
    this.TYPERECORD.type = "GENERAL JOB TYPES";
    this.TYPERECORD.id = "";
    this.TYPERECORD.code = "";
    this.TYPERECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;
    if (_Record.controlname == 'SHIPPER') {
      bchange = false;
      if (this.Record.gj_shipper_id != _Record.id)
        bchange = true;
      this.Record.gj_shipper_id = _Record.id;
      this.Record.gj_shipper_name = _Record.name;

      if (bchange) {
        this.SHIPPERADDRRECORD = new SearchTable();
        this.SHIPPERADDRRECORD.controlname = "SHIPPERADDRESS";
        this.SHIPPERADDRRECORD.type = "CUSTOMERADDRESS";
        this.SHIPPERADDRRECORD.displaycolumn = "CODE";
        this.SHIPPERADDRRECORD.id = "";
        this.SHIPPERADDRRECORD.code = "";
        this.SHIPPERADDRRECORD.name = "";
        this.SHIPPERADDRRECORD.parentid = this.Record.gj_shipper_id;
        this.Record.gj_shipper_br_addr = "";
      }

    }

    else if (_Record.controlname == "SHIPPERADDRESS") {

      this.Record.gj_shipper_br_id = _Record.id;
      this.Record.gj_shipper_br_no = _Record.code;
      this.Record.gj_shipper_br_addr = this.GetBrAddress(_Record.name).address;
    }


    else if (_Record.controlname == "POL") {
      this.Record.gj_pol_id = _Record.id;
      this.Record.gj_pol_code = _Record.code;
      this.Record.gj_pol_name = _Record.name;
    }

    else if (_Record.controlname == "POD") {
      this.Record.gj_pod_id = _Record.id;
      this.Record.gj_pod_code = _Record.code;
      this.Record.gj_pod_name = _Record.name;
    }
    else if (_Record.controlname == "TYPE") {
      this.Record.gj_type_id = _Record.id;
      this.Record.gj_type_code = _Record.code;
      this.Record.gj_type_name = _Record.name;
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
    if (this.mode == "EDIT")
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
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
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

    this.pkid = this.gs.getGuid();
    this.Record = new GenJobm();
    this.Record.gj_pkid = this.pkid;
    this.Record.gj_job_prefix = '';
    this.Record.rec_category = '';
    this.Record.gj_job_date = this.gs.defaultValues.today;
    this.Record.gj_shipper_inv_no = '';
    this.Record.gj_licence_no = '';
    this.Record.gj_status = '';
    this.Record.gj_shipper_id = '';
    this.Record.gj_shipper_code = '';
    this.Record.gj_shipper_name = '';
    this.Record.gj_shipper_br_id = '';
    this.Record.gj_shipper_br_no = '';
    this.Record.gj_shipper_br_addr = '';
    this.Record.gj_pol_id = '';
    this.Record.gj_pol_code = '';
    this.Record.gj_pol_name = '';
    this.Record.gj_pod_id = '';
    this.Record.gj_pod_code = '';
    this.Record.gj_pod_name = '';
    this.Record.gj_container_no = '';
    this.Record.gj_seal_no = '';
    this.Record.gj_igmitem_no = '';
    this.Record.gj_loaded_on = '';
    this.Record.gj_unloaded_on = '';
    this.Record.gj_cfs = '';
    this.Record.gj_from = '';
    this.Record.gj_to1 = '';
    this.Record.gj_to2 = '';
    this.Record.gj_type_id = '';
    this.Record.gj_type_code = '';
    this.Record.gj_type_name = '';
    this.Record.gj_remarks = '';
    this.Record.gj_consignee_name = '';
    this.Record.gj_consignee_add1 = '';
    this.Record.gj_consignee_add2 = '';
    this.Record.gj_consignee_add3 = '';
    this.Record.gj_vehicle_no = '';
    this.Record.gj_cargo = '';
    this.Record.gj_booking_no = '';
    this.Record.gj_liner_name = '';
    this.Record.gj_vessel = '';
    this.Record.gj_gr_wt = 0;
    this.Record.gj_cartons = '';
    this.Record.gj_lr_no = '';
    this.Record.gj_our_refno = '';
    this.Record.gj_mbl_no = '';
    this.Record.gj_hbl_no = '';
    this.Record.gj_frt_status = '';
    this.Record.gj_cha_name = '';
    this.Record.gj_sb_no = '';
    this.Record.gj_commodity = '';
    this.Record.gj_pack_list_no = '';

    this.InitLov();
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

  LoadData(_Record: GenJobm) {
    this.Record = _Record;
    //this.Record.AddressList = _Record.AddressList;

    this.InitLov();


    this.SHIPPERRECORD.id = this.Record.gj_shipper_id;
    this.SHIPPERRECORD.code = this.Record.gj_shipper_code;
    this.SHIPPERRECORD.name = this.Record.gj_shipper_name;

    this.SHIPPERADDRRECORD.id = this.Record.gj_shipper_br_id;
    this.SHIPPERADDRRECORD.code = this.Record.gj_shipper_br_no;
    this.SHIPPERADDRRECORD.parentid = this.Record.gj_shipper_id;

    this.POLRECORD.id = this.Record.gj_pol_id;
    this.POLRECORD.code = this.Record.gj_pol_code;
    this.POLRECORD.name = this.Record.gj_pol_name;

    this.PODRECORD.id = this.Record.gj_pod_id;
    this.PODRECORD.code = this.Record.gj_pod_code;
    this.PODRECORD.name = this.Record.gj_pod_name;

    this.TYPERECORD.id = this.Record.gj_type_id;
    this.TYPERECORD.code = this.Record.gj_type_code;
    this.TYPERECORD.name = this.Record.gj_type_name;



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
        if (this.mode == 'ADD') {
          this.Record.gj_job_prefix = response.genjobprefix;
        }
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
    //if (this.Record.job_date.trim().length <= 0) {
    //  bret = false;
    //  sError = " | Job Date Cannot Be Blank";
    //}

    if (this.Record.gj_job_date.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Date Cannot Be Blank";
    }

    if (this.Record.gj_type_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Type Cannot Be Blank";
    }

    if (this.Record.gj_shipper_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Shipper Cannot Be Blank";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.gj_pkid == this.Record.gj_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.gj_job_prefix = this.Record.gj_job_prefix;
      REC.rec_category = this.Record.rec_category;
      REC.gj_job_date = this.Record.gj_job_date;
      REC.gj_shipper_name = this.Record.gj_shipper_name;
      REC.gj_status = this.Record.gj_status;
      REC.gj_pol_name = this.Record.gj_pol_name;
      REC.gj_pod_name = this.Record.gj_pod_name;
    }
  }


  OnBlur(field: string) {
    if (field == 'gj_shipper_inv_no') {
      this.Record.gj_shipper_inv_no = this.Record.gj_shipper_inv_no.toUpperCase();
    }
    if (field == 'gj_licence_no') {
      this.Record.gj_licence_no = this.Record.gj_licence_no.toUpperCase();
    }
    if (field == 'gj_container_no') {
      this.Record.gj_container_no = this.Record.gj_container_no.toUpperCase();
    }
    if (field == 'gj_seal_no') {
      this.Record.gj_seal_no = this.Record.gj_seal_no.toUpperCase();
    }
    if (field == 'gj_igmitem_no') {
      this.Record.gj_igmitem_no = this.Record.gj_igmitem_no.toUpperCase();
    }
    if (field == 'gj_cfs') {
      this.Record.gj_cfs = this.Record.gj_cfs.toUpperCase();
    }
    if (field == 'gj_from') {
      this.Record.gj_from = this.Record.gj_from.toUpperCase();
    }
    if (field == 'gj_to1') {
      this.Record.gj_to1 = this.Record.gj_to1.toUpperCase();
    }
    if (field == 'gj_to2') {
      this.Record.gj_to2 = this.Record.gj_to2.toUpperCase();
    }
    if (field == 'gj_remarks') {
      this.Record.gj_remarks = this.Record.gj_remarks.toUpperCase();
    }
    if (field == 'gj_consignee_name') {
      this.Record.gj_consignee_name = this.Record.gj_consignee_name.toUpperCase();
    }
    if (field == 'gj_consignee_add1') {
      this.Record.gj_consignee_add1 = this.Record.gj_consignee_add1.toUpperCase();
    }
    if (field == 'gj_consignee_add2') {
      this.Record.gj_consignee_add2 = this.Record.gj_consignee_add2.toUpperCase();
    }
    if (field == 'gj_consignee_add3') {
      this.Record.gj_consignee_add3 = this.Record.gj_consignee_add3.toUpperCase();
    }
    if (field == 'gj_vehicle_no') {
      this.Record.gj_vehicle_no = this.Record.gj_vehicle_no.toUpperCase();
    }
    if (field == 'gj_cargo') {
      this.Record.gj_cargo = this.Record.gj_cargo.toUpperCase();
    }
    if (field == 'gj_booking_no') {
      this.Record.gj_booking_no = this.Record.gj_booking_no.toUpperCase();
    }
    if (field == 'gj_liner_name') {
      this.Record.gj_liner_name = this.Record.gj_liner_name.toUpperCase();
    }
    if (field == 'gj_vessel') {
      this.Record.gj_vessel = this.Record.gj_vessel.toUpperCase();
    }

    if (field == 'gj_gr_wt') {
      this.Record.gj_gr_wt = this.gs.roundNumber(this.Record.gj_gr_wt, 3);
    }
    if (field == 'gj_cartons') {
      this.Record.gj_cartons = this.Record.gj_cartons.toUpperCase();
    }

    if (field == 'gj_mbl_no') {
      this.Record.gj_mbl_no = this.Record.gj_mbl_no.toUpperCase();
    }

    if (field == 'gj_hbl_no') {
      this.Record.gj_hbl_no = this.Record.gj_hbl_no.toUpperCase();
    }

    if (field == 'gj_frt_status') {
      this.Record.gj_frt_status = this.Record.gj_frt_status.toUpperCase();
    }

    if (field == 'gj_cha_name') {
      this.Record.gj_cha_name = this.Record.gj_cha_name.toUpperCase();
    }

    if (field == 'gj_sb_no') {
      this.Record.gj_sb_no = this.Record.gj_sb_no.toUpperCase();
    }

    if (field == 'gj_commodity') {
      this.Record.gj_commodity = this.Record.gj_commodity.toUpperCase();
    }
    if (field == 'gj_pack_list_no') {
      this.Record.gj_pack_list_no = this.Record.gj_pack_list_no.toUpperCase();
    }
    if (field == 'gj_lr_no') {
      this.Record.gj_lr_no = this.Record.gj_lr_no.toUpperCase();
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  GetBrAddress(straddress: string) {
    let AddressSplit = {
      addressbrno: '',
      address: ''
    };
    if (straddress.trim() != "") {
      var temparr = straddress.split(' ');
      AddressSplit.addressbrno = temparr[0];
      AddressSplit.address = straddress.substr(AddressSplit.addressbrno.length).trim();
    }
    return AddressSplit;
  }


  GenerateLRNo(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GenerateLRNo(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.gj_lr_no = response.genlrnoprefix;
        this.Record.gj_our_refno = response.genrefnoprefix;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }

  folder_id: string;
  PrintLrReceipt(_type: string = 'PDF') {
    this.ErrorMessage = ''

    if (this.pkid.length <= 0) {
      this.ErrorMessage = "\n\r | Invalid ID";
    }

    if (this.ErrorMessage.length > 0)
      return;


    this.loading = true;
    this.folder_id = this.gs.getGuid();

    let SearchData = {
      type: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: ''
    }

    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;


    this.ErrorMessage = '';
    this.mainService.PrintReceipt(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
}
