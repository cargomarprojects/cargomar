import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { EdiOrder } from '../../models/ediorder';
import { EdiOrderService } from '../../services/ediorder.service';
import { SearchTable } from '../../../shared/models/searchtable';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
//import { Settings } from '../../../master/models/settings';


@Component({
  selector: 'app-ediorder',
  templateUrl: './ediorder.component.html',
  providers: [EdiOrderService]
})
export class EdiOrderComponent {
  // Local Variables 
  title = 'Order List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;

  modal: any;
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  loading = false;
  currentTab = 'LIST';

  chk_all_pol: boolean = false;
  selectcheckbox: boolean = false;
  selectcheck: boolean = false;
  bAdmin = false;
  bChanged: boolean;
  user_admin = false;

  from_date: string = "";
  searchstring = "";
  ErrorMessage = "";
  InfoMessage = "";

  mode = 'ADD';
  pkid = '';
  agent_id = '';
  update_type = "";
  pono = "";
  poid = "";
  styleno = "";

  ctr: number;

  // Array For Displaying List
  RecordList: EdiOrder[] = [];
  // Single Record for add/edit/view details
  Record: EdiOrder = new EdiOrder;
  RecordMissingList: EdiOrder[] = [];

  constructor(
    private modalService: NgbModal,
    private mainService: EdiOrderService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 30;
    this.page_current = 0;
    this.InitLov();
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
    //  this.List("NEW");
  }

  InitComponent() {
    this.bAdmin = false;
    this.user_admin = false;
    this.agent_id = 'B8C93DB0-5127-E16A-23C0-BF42E6E06005';//Transport Multimodal ID
    this.update_type = "ALL";
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.from_date = this.gs.getNewdate(1);
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
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    /*
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
      //this.selectedRowIndex = _selectedRowIndex;
      //this.currentTab = 'DETAILS';
      //this.mode = 'EDIT';
      //this.ResetControls();
      //this.pkid = id;
      //this.GetRecord(id);
    }
   */


  }

  ResetControls() {

  }

  List(_type: string) {

    this.selectcheck = false;
    this.selectcheckbox = false;
    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      parentid: this.parentid,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.from_date,
      report_folder: this.gs.globalVariables.report_folder,
      user_code: this.gs.globalVariables.user_code,
      update_type: this.update_type,
      chkallpol: this.chk_all_pol == true ? "Y" : "N"
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


  Process(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      user_code: this.gs.globalVariables.user_code,
      ftptypeid: this.agent_id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.Process(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == "DOWNLOAD") {
          if (response.serror == "Complete") {
            this.InfoMessage = response.dfilecount + " Files Downloaded";
            alert(this.InfoMessage);
          }
          else {
            if (response.serror) {
              this.ErrorMessage = response.serror;
              alert(this.ErrorMessage);
            }
          }
        } else {
          this.List('NEW');
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new EdiOrder();
    this.Record.pkid = this.pkid;
    //this.Record.ord_exp_id = '';
    //this.Record.ord_exp_name = '';
    //this.Record.ord_imp_id = '';
    //this.Record.ord_imp_name = '';
    //this.Record.ord_invno = '';
    //this.Record.ord_uneco = '';
    //this.Record.ord_po = '';
    //this.Record.ord_style = '';
    //this.Record.ord_cbm = 0;
    //this.Record.ord_pcs = 0;
    //this.Record.ord_pkg = 0;
    //this.Record.ord_grwt = 0;
    //this.Record.ord_ntwt = 0;
    //this.Record.ord_hs_code = '';
    //this.Record.ord_cargo_status = '';
    //this.Record.ord_desc = '';
    //this.Record.ord_stylename = '';
    //this.Record.ord_color = '';
    //this.Record.ord_contractno = '';
    //this.Record.rec_mode = this.mode;
    //this.InitLov();
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
    };

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.GetRecord(SearchData)
    //    .subscribe(response => {
    //        this.loading = false;
    //        this.LoadData(response.record);
    //    },
    //    error => {
    //        this.loading = false;
    //        this.ErrorMessage = this.gs.getError(error);
    //    });
  }

  LoadData(_Record: EdiOrder) {
    this.Record = _Record;
    this.InitLov();
    this.Record.rec_mode = this.mode;
  }


  // Save Data
  Save(_type: string) {
    if (!this.allvalid(_type))
      return;

    // this.loading = true;
    // this.ErrorMessage = '';
    // this.InfoMessage = '';
    // let SearchData = {
    //   type: _type,
    //   rowtype: this.type,
    //   pkid:_id,
    //   br_icegate_email: '',
    //   br_icegate_email_pwd: '',
    //   br_custom_locations: '',
    //   br_start_index: '',
    //   company_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code,
    //   year_code: this.gs.globalVariables.year_code
    // };

    // SearchData.type = _type;
    // SearchData.rowtype = this.type;
    // SearchData.pkid = _id;
    // SearchData.br_start_index = this.BR_START_INDEX.toString();
    // SearchData.br_icegate_email = this.BR_ICEGATE_EMAIL;
    // SearchData.br_icegate_email_pwd = this.BR_ICEGATE_EMAIL_PWD;
    // SearchData.br_custom_locations = this.BR_CUSTOM_LOCATIONS;
    // SearchData.company_code = this.gs.globalVariables.comp_code;
    // SearchData.branch_code = this.gs.globalVariables.branch_code;
    // SearchData.year_code = this.gs.globalVariables.year_code;

    // this.mainService.SaveSettings(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //     if (_type == "SAVE")
    //       this.InfoMessage = "Save Complete";
    //     else if (_type == "DOWNLOAD") {
    //       this.InfoMessage = "Download Complete";
    //       alert(this.InfoMessage);
    //       this.List("NEW");
    //      } if (_type == "UPDATESB") {
    //        if (response.sbreason.length > 0) {
    //          if (this.RecordList == null)
    //            return;
    //          var REC = this.RecordList.find(rec => rec.sb_pkid == _id);
    //          if (REC != null) {
    //            REC.sb_reason = response.sbreason;
    //          }
    //        }
    //       this.InfoMessage = response.savemsg;
    //       alert(this.InfoMessage);
    //     }
    //   },
    //   error => {
    //     this.loading = false;
    //     this.ErrorMessage = this.gs.getError(error);
    //   });
  }

  allvalid(_type: string) {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    /*
      if (this.Record.ord_desc.trim().length <= 0) {
        bret = false;
        sError += "\n\r | Description Cannot Be Blank";
      }
    */


    //if (bret === false)
    //    this.ErrorMessage = sError;

    return bret;
  }

  RefreshList() {

    //if (this.RecordList == null)
    //    return;
    //var REC = this.RecordList.find(rec => rec.ord_pkid == this.Record.ord_pkid);
    //if (REC == null) {
    //    this.RecordList.push(this.Record);
    //}
    //else {
    //    REC.ord_po = this.Record.ord_po;
    //    REC.ord_style = this.Record.ord_style;
    //    REC.ord_cargo_status = this.Record.ord_cargo_status;
    //    REC.ord_desc = this.Record.ord_desc;
    //    REC.ord_color = this.Record.ord_color;
    //    REC.ord_contractno = this.Record.ord_contractno;
    //}
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
    switch (field) {

      case 'BR_CUSTOM_LOCATIONS':
        {
          // this.BR_CUSTOM_LOCATIONS = this.BR_CUSTOM_LOCATIONS.toUpperCase();
          // break;
        }
    }
  }

  Settings() {
    this.user_admin = !this.user_admin;
  }

  Update(_type: string) {
    if (this.agent_id == "") {
      this.ErrorMessage = "Please Select Agent and Continue.....";
      return;
    }

    let ordids: string = "";
    for (let rec of this.RecordList) {
      if (rec.selected) {
        if (rec.pol != rec.comp_pol_code) {
          this.ErrorMessage = "Invalid POL Selected";
          alert(this.ErrorMessage);
          return;
        }
        if (ordids != "")
          ordids += ",";
        ordids += rec.pkid;
      }
    }

    this.loading = true;
    let SearchData = {
      type: _type,
      agent_id: this.agent_id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      user_code: this.gs.globalVariables.user_code,
      validateonly: _type == "VALIDATE" ? 'Y' : 'N',
      pkid: ordids
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.UpdateOrdersList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordMissingList = response.list;
        if (response.error.length > 0) {
          this.ErrorMessage = response.error;
          alert(this.ErrorMessage);
        }
        else {
          if (_type == 'UPDATE')
            this.InfoMessage = "Updated Successfully";
          else if (_type == 'VALIDATE')//Validate
            this.InfoMessage = "No Errors Found";
          if (_type == 'CREATE-PO')
            this.InfoMessage = "Save Complete";
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  SelectCheckbox() {
    this.selectcheckbox = !this.selectcheckbox;
    for (var i = 0; i < this.RecordList.length; i++) {
      this.RecordList[i].selected = this.selectcheckbox;
    }
  }


  open(content: any) {
    this.modal = this.modalService.open(content);
  }
  ShowEdiUpdate(ediordupdt: any, _rec: EdiOrder) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (_rec.comp_pol_code != _rec.pol) {
      this.ErrorMessage = "Invalid POL " + _rec.pol + " Found.";
      alert(this.ErrorMessage);
      return;
    }
    this.pkid = _rec.pkid;
    this.poid = _rec.id_po;
    this.pono = _rec.po;
    this.styleno = _rec.model_sku;
    this.open(ediordupdt);
  }

  ModifiedRecords(params: any) {

    for (let rec of this.RecordList.filter(rec => rec.pkid == params.sid)) {

      if (params.saction == "SAVE")
        rec.agent_ref_no = params.srefno;
      else if (params.saction == "VALIDATE") {
        rec.selected = true;
        this.Update('VALIDATE');
      } else if (params.saction == "CREATE-PO") {
        rec.selected = true;
        this.Update('CREATE-PO');
      }
    }

    if (params.saction != "VALIDATE")
      this.modal.close();
  }
}
