import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Companym } from '../models/company';

import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  providers: [CompanyService]
})
export class CompanyComponent {
  // Local Variables 
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  title = 'COMPANY MASTER';
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  mylist: any = [];

  ErrorMessage = "";

  mode = '';
  pkid = '';


  CompanyList: Companym[] = [];

  // Array For Displaying List
  RecordList: Companym[] = [];
  // Single Record for add/edit/view details
  Record: Companym = new Companym;

  constructor(
    private mainService: CompanyService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 50;
    this.page_current = 0;


    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        this.InitComponent();
      }
    });

    // URL Query Parameter 
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

    if (this.type == 'B')
      this.LoadCombo();
    else
      this.List("NEW");
    this.currentTab = 'LIST';
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
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
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
    };

    this.ErrorMessage = '';

    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.CompanyList = response.list;
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
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
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

    this.Record = new Companym();
    this.Record.comp_pkid = this.pkid;
    this.Record.comp_code = '';
    this.Record.comp_name = '';
    this.Record.comp_type = this.type;
    this.Record.comp_address1 = '';
    this.Record.comp_address2 = '';
    this.Record.comp_address3 = '';
    this.Record.comp_tel = '';
    this.Record.comp_fax = '';
    this.Record.comp_web = '';
    this.Record.comp_email = '';
    this.Record.comp_ptc = '';
    this.Record.comp_mobile = '';
    this.Record.comp_prefix = '';
    this.Record.comp_panno = '';
    this.Record.comp_cinno = '';
    this.Record.comp_gstin = '';
    this.Record.comp_reg_address = '';
    this.Record.comp_iata_code = '';
    this.Record.comp_location = '';

    this.Record.comp_country_code = '';
    this.Record.comp_pol_code = '';

    this.Record.comp_order = 0;

    this.Record.comp_branch_type = 'BOTH';
    this.Record.comp_uamno= '';

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

  LoadData(_Record: Companym) {
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
    if (this.Record.comp_code.trim().length <= 0) {
      bret = false;
      sError = "Code Cannot Be Blank";
    }

    if (this.Record.comp_name.trim().length <= 0) {
      bret = false;
      sError += "\n\rName Cannot Be Blank";
    }

    if (this.type == 'B') {
      if (this.Record.comp_branch_type.trim().length <= 0) {
        bret = false;
        sError += "\n\rBranch Type Cannot Be Blank";
      }
      if (bret) {
        if (this.Record.comp_branch_type.trim() != 'AIR' && this.Record.comp_branch_type.trim() != 'SEA' && this.Record.comp_branch_type.trim() != 'BOTH') {
          bret = false;
          sError += "\n\r Invalid Branch Type";
        }
      }
    }


    //if (this.Record.user_password.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\rPassword Cannot Be Blank";
    //}

    if (bret) {
      this.Record.comp_code = this.Record.comp_code.toUpperCase().replace(' ', '');
      this.Record.comp_name = this.Record.comp_name.toUpperCase().trim();
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;

    var REC = this.RecordList.find(rec => rec.comp_pkid == this.Record.comp_pkid);
    if (REC == null) {
      if (this.type == 'B')
        this.Record.comp_parent_name = this.CompanyList.find(row => row.comp_pkid == this.Record.comp_parent_id).comp_name;
      this.RecordList.push(this.Record);
    }
    else {
      REC.comp_code = this.Record.comp_code;
      REC.comp_name = this.Record.comp_name;
      REC.comp_branch_type = this.Record.comp_branch_type;

      if (this.type == 'B')
        REC.comp_parent_name = this.CompanyList.find(row => row.comp_pkid == this.Record.comp_parent_id).comp_name;
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }
  OnBlur(field: string) {
    switch (field) {
      case 'comp_code':
        {
          this.Record.comp_code = this.Record.comp_code.toUpperCase();
          break;
        }
      case 'comp_name':
        {
          this.Record.comp_name = this.Record.comp_name.toUpperCase();
          break;
        }
      case 'comp_address1':
        {
          this.Record.comp_address1 = this.Record.comp_address1.toUpperCase();
          break;
        }
      case 'comp_address2':
        {
          this.Record.comp_address2 = this.Record.comp_address2.toUpperCase();
          break;
        }
      case 'comp_address3':
        {
          this.Record.comp_address3 = this.Record.comp_address3.toUpperCase();
          break;
        }
      case 'comp_tel':
        {
          this.Record.comp_tel = this.Record.comp_tel.toUpperCase();
          break;
        }
      case 'comp_fax':
        {
          this.Record.comp_fax = this.Record.comp_fax.toUpperCase();
          break;
        }
      case 'comp_web':
        {
          this.Record.comp_web = this.Record.comp_web.toLowerCase();
          break;
        }
      case 'comp_email':
        {
          this.Record.comp_email = this.Record.comp_email.toLowerCase();
          break;
        }
      case 'comp_ptc':
        {
          this.Record.comp_ptc = this.Record.comp_ptc.toUpperCase();
          break;
        }
      case 'comp_mobile':
        {
          this.Record.comp_mobile = this.Record.comp_mobile.toUpperCase();
          break;
        }
      case 'comp_prefix':
        {
          this.Record.comp_prefix = this.Record.comp_prefix.toUpperCase();
          break;
        }
      case 'comp_panno':
        {
          this.Record.comp_panno = this.Record.comp_panno.toUpperCase();
          break;
        }
      case 'comp_cinno':
        {
          this.Record.comp_cinno = this.Record.comp_cinno.toUpperCase();
          break;
        }
      case 'comp_gstin':
        {
          this.Record.comp_gstin = this.Record.comp_gstin.toUpperCase();
          break;
        }
      case 'comp_reg_address':
        {
          this.Record.comp_reg_address = this.Record.comp_reg_address.toUpperCase();
          break;
        }
      case 'comp_iata_code':
        {
          this.Record.comp_iata_code = this.Record.comp_iata_code.toUpperCase();
          break;
        }
      case 'comp_location':
        {
          this.Record.comp_location = this.Record.comp_location.toUpperCase();
          break;
        }
      case 'comp_branch_type':
        {
          this.Record.comp_branch_type = this.Record.comp_branch_type.toUpperCase();
          break;
        }
      case 'comp_country_code':
        {
          this.Record.comp_country_code = this.Record.comp_country_code.toUpperCase();
          break;
        }
      case 'comp_pol_code':
        {
          this.Record.comp_pol_code = this.Record.comp_pol_code.toUpperCase();
          break;
        }
        case 'comp_uamno':
        {
          this.Record.comp_uamno = this.Record.comp_uamno.toUpperCase();
          break;
        }
    }
  }

}
