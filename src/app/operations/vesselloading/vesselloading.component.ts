
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { VesselLoadingReport } from '../models/vesselloadingreport';

import { VesselLoadingReportService } from '../services/vesselloadingreport.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-vesselloading',
  templateUrl: './vesselloading.component.html',
  providers: [VesselLoadingReportService]
})

export class VesselLoadingComponent {
  // Local Variables 
  title = 'Vessel Loading List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  selectedRowIndex = 0;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  // searchcarrierid = '';
  // searchvesselid = '';
  // searchvoyage = '';

  rows_to_display: number = 0;
  rows_total: number = 0;
  rows_starting_number: number = 0;
  rows_ending_number: number = 0;
  bShowMore = false;

  sub: any;
  urlid: string;

  // ErrorMessage = "";
  mode = '';
  pkid = '';

  SearchData = {
    type: '',
    rows_to_display: 0,
    rows_starting_number: 0,
    rows_ending_number: 0,
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchvslid: '',
    searchcarrid: '',
    searchvoyage: ''
  };

  // VESSELRECORD: any;
  // VESSELREC: any = { id: '', code: '', name: '' };
  // SEACARRIERRECORD: any;
  // SEACARRIERREC: any = { id: '', code: '', name: '' };

  // Array For Displaying List
  // RecordList: VesselLoadingReport[] = [];
  // Single Record for add/edit/view details
  Record: VesselLoadingReport = new VesselLoadingReport;

  constructor(
    public ms: VesselLoadingReportService,
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

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.ms.init(this.menuid, this.type);
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    // this.initLov();
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.restoreRowPosition();
    }, 100);
  }

  restoreRowPosition() {

    const row = document.getElementById('row-' + this.ms.state.selectedRowIndex);

    if (row) {
      row.scrollIntoView({
        behavior: 'auto',
        block: 'center'
      });
    }
  }

  initLov(caption: string = '') {
    // if (caption == '' || caption == 'VSL')
    //   this.VESSELRECORD = {
    //     controlname: 'VSL', type: 'VESSEL', displaycolumn: 'NAME',
    //     parentid: '', id: this.VESSELREC.id, code: this.VESSELREC.code, name: this.VESSELREC.name
    //   };

    // if (caption == '' || caption == 'SEACARRIER')
    //   this.SEACARRIERRECORD = {
    //     controlname: 'SEACARRIER', type: 'SEA CARRIER', displaycolumn: 'NAME',
    //     parentid: '', id: this.SEACARRIERREC.id, code: this.SEACARRIERREC.code, name: this.SEACARRIERREC.name
    //   };

  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == 'SEACARRIER') {
      this.ms.state.searchcarrierid = _Record.id;
      this.ms.state.searchcarrier_name = _Record.name;
    }
    if (_Record.controlname == 'VSL') {
      this.ms.state.searchvesselid = _Record.id;
      this.ms.state.searchvessel_name = _Record.name;
    }
  }
  LoadCombo() {
  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ms.state.ErrorMessage = '';
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
    if (this.ms.state.searchcarrierid.trim().length <= 0) {
      this.ms.state.ErrorMessage = 'Carrier Cannot Be Blank';
      alert(this.ms.state.ErrorMessage);
      return;
    }
    if (_type == "NEW") {
      this.rows_to_display = 10;
      this.rows_starting_number = 1;
      this.rows_ending_number = this.rows_to_display;
      this.bShowMore = true;
    }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.rows_to_display = this.rows_to_display;
    this.SearchData.rows_starting_number = this.rows_starting_number;
    this.SearchData.rows_ending_number = this.rows_ending_number;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchvslid = this.ms.state.searchvesselid;
    this.SearchData.searchcarrid = this.ms.state.searchcarrierid;
    this.SearchData.searchvoyage = this.ms.state.searchvoyage.toUpperCase();
    this.SearchData.type = _type;

    this.ms.state.selectedRowIndex = 0;
    this.restoreRowPosition()

    this.ms.state.ErrorMessage = '';
    this.ms.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {

          this.rows_total = response.rows_total;
          if (this.rows_ending_number >= this.rows_total)
            this.bShowMore = false;

          if (_type == 'NEW') {
            this.ms.state.RecordList = response.list;
          } else {
            this.ms.state.RecordList.push(...response.list);//_type=NEXT
          }
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
  Close() {
    this.gs.ClosePage('home');
  }
  More() {
    if (this.rows_ending_number < this.rows_total) {
      this.rows_starting_number = this.rows_ending_number + 1;
      this.rows_ending_number = this.rows_ending_number + this.rows_to_display;

      this.List('NEXT');
    }
  }
}
