import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Costreco } from '../models/costreco';
import { CostRecoService } from '../services/costreco.service';

@Component({
  selector: 'app-costreco',
  templateUrl: './costreco.component.html',
  providers: [CostRecoService]
})

export class CostrecoComponent {
  title = 'Costreco Report'

  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  main_code: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  format2: boolean = false;

  isclr: boolean = false;
  isimp: boolean = false;

  rec_category: string = "";
  type_date: string = '';
  from_date: string = '';
  to_date: string = '';
  code: string = '';

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  searchstring = '';
  mblno = '';

  coldr0 = '';
  colcr0 = '';
  coldr1 = '';
  colcr1 = '';
  coldr2 = '';
  colcr2 = '';

  codecount = 0;


  SearchData = {
    type: '',
    rec_category: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    type_date: '',
    code: '',
    main_code: false,
    format2: false,
    hide_ho_entries: '',
    mblno: ''
  };

  // Array For Displaying List
  RecordList: Costreco[] = [];
  // Single Record for add/edit/view details
  Record: Costreco = new Costreco;

  constructor(
    private mainService: CostRecoService,
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

        this.rec_category = this.type;

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
    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {
    this.type_date = "JOB-NO";
    this.RecordList = null;
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {
  }

  LovSelected(_Record: SearchTable) {
    // Company Settings

  }
  LoadCombo() {
  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
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

    this.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.trim().toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.rec_category = this.rec_category;
    this.SearchData.type_date = this.type_date;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.code = this.code;
    this.SearchData.main_code = this.main_code;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;

    this.SearchData.format2 = this.format2;
    this.SearchData.mblno = this.mblno.trim();

    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL' || _type == 'EXP-BOOKING-EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          this.isclr = response.isclr;
          this.isimp = response.isimp;
          this.codecount = response.codecount
          if (this.codecount > 1) {
            var splitted = this.code.split(",");
            if (this.codecount >= 1) {
              this.coldr0 = splitted[0] + "-DR";
              this.colcr0 = splitted[0] + "-CR";
            }
            if (this.codecount >= 2) {
              this.coldr1 = splitted[1] + "-DR";
              this.colcr1 = splitted[1] + "-CR";
            }
            if (this.codecount >= 3) {
              this.coldr2 = splitted[2] + "-DR";
              this.colcr2 = splitted[2] + "-CR";
            }
          }

        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    switch (field) {
      case 'searchstring':
        {
          this.searchstring = this.searchstring.toUpperCase();
          break;
        }
      case 'mblno':
        {
          this.mblno = this.mblno.toUpperCase();
          break;
        }
    }
  }

}
