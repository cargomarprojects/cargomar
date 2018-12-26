import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Settings } from '../models/settings';
import { Settings_VM } from '../models/settings';
import { BankInfoService } from '../services/bankinfo.service';

import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-bankinfo',
  templateUrl: './bankinfo.component.html',
  providers: [BankInfoService]
})
export class BankInfoComponent {
  // Local Variables 
  title = '';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() Invokefrom: string = '';
  InitCompleted: boolean = false;
  menu_record: any;


  loading = false;
  currentTab = 'LIST';

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  tabletype: string;

  sub: any;

  bank_company: string;
  bank_ac: string;
  bank_name: string;
  bank_ifsc_code: string;
  bank_addresslin1: string;
  bank_addresslin2: string;
  bank_addresslin3: string;

  // Array For Displaying List
  RecordList: Settings[] = [];
  // Single Record for add/edit/view details
  Record: Settings_VM = new Settings_VM;

  SaveList: Settings[] = [];
  
  constructor(
    private mainService: BankInfoService,
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

  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
    }

    this.Init();
    this.tabletype = "SEA EXPORT";
    this.List(this.currentTab);

  }
  Init() {

    this.bank_company = '';
    this.bank_ac = '';
    this.bank_name = '';
    this.bank_ifsc_code = '';
    this.bank_addresslin1 = '';
    this.bank_addresslin2 = '';
    this.bank_addresslin3 = '';
  }

  // Init Will be called After executing Constructor
  ngOnInit() {

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addRec(parentid: string, tablename: string, caption: string, id: string, code: string, name: string, tabletype: string): Settings {
    var rec = new Settings;
    rec.parentid = parentid;
    rec.tablename = tablename;
    rec.caption = caption;
    rec.id = id;
    rec.code = code;
    rec.name = name;
    rec.tabletype = tabletype;
    return rec;
  }

  SaveBranch() {


    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.SaveData();
    this.Record.RecordDet = this.SaveList;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.SaveSettings(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
      },
      error => {
        this.ErrorMessage = this.gs.getError(error);
        this.loading = false;
      });
  }

  SaveData() {
    this.Record = new Settings_VM;
    this.SaveList = Array<Settings>();
    let _parentid = '';
    _parentid = this.gs.globalVariables.branch_code;

    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BANK_COMPANY', '', '', this.bank_company.toString().toUpperCase(), this.tabletype.toString()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BANK_ACNO', '', '', this.bank_ac.toString().toUpperCase(), this.tabletype.toString()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BANK_NAME', '', '', this.bank_name.toString().toUpperCase(), this.tabletype.toString()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BANK_IFSC_CODE', '', '', this.bank_ifsc_code.toString().toUpperCase(), this.tabletype.toString()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BANK_ADD1', '', '', this.bank_addresslin1.toString().toUpperCase(), this.tabletype.toString()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BANK_ADD2', '', '', this.bank_addresslin2.toString().toUpperCase(), this.tabletype.toString()));
    this.SaveList.push(this.addRec(_parentid, 'TEXT', 'BANK_ADD3', '', '', this.bank_addresslin3.toString().toUpperCase(), this.tabletype.toString()));
  }

  List(_type: string) {
    
    this.InfoMessage = '';
    this.loading = true;
    let SearchData = {
      parentid: this.gs.globalVariables.comp_code,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      tabletype: ''
    };

    SearchData.parentid = this.gs.globalVariables.branch_code;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.tabletype = this.tabletype;

    this.ErrorMessage = '';
    this.mainService.getSettings(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.Loaddata();
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  Loaddata() {

    this.RecordList.forEach(rec => {

      if (rec.caption == "BANK_COMPANY")
        this.bank_company = rec.name;
      if (rec.caption == "BANK_ACNO")
        this.bank_ac = rec.name;
      if (rec.caption == "BANK_NAME")
        this.bank_name = rec.name;
      if (rec.caption == "BANK_IFSC_CODE")
        this.bank_ifsc_code = rec.name;
      if (rec.caption == "BANK_ADD1")
        this.bank_addresslin1 = rec.name;
      if (rec.caption == "BANK_ADD2")
        this.bank_addresslin2 = rec.name;
        if (rec.caption == "BANK_ADD3")
        this.bank_addresslin3 = rec.name;
    })
  }

  OnBlur(field: string) {
    switch (field) {
      case 'bank_company':
        {
          this.bank_company = this.bank_company.toUpperCase();
          break;
        }
      case 'bank_ac':
        {
          this.bank_ac = this.bank_ac.toUpperCase();
          break;
        }
      case 'bank_name':
        {
          this.bank_name = this.bank_name.toUpperCase();
          break;
        }
      case 'bank_ifsc_code':
        {
          this.bank_ifsc_code = this.bank_ifsc_code.toUpperCase();
          break;
        }
      case 'bank_addresslin1':
        {
          this.bank_addresslin1 = this.bank_addresslin1.toUpperCase();
          break;
        }
      case 'bank_addresslin2':
        {
          this.bank_addresslin2 = this.bank_addresslin2.toUpperCase();
          break;
        }
        case 'bank_addresslin3':
        {
          this.bank_addresslin3 = this.bank_addresslin3.toUpperCase();
          break;
        }
    }
  }


  OnChange(field: string) {

    this.Init();
    this.List(this.tabletype);
  }

  Close() {
    this.gs.ClosePage('home');
  }

}
