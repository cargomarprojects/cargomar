
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { LandingCertificateReport } from '../models/landingcertificatereport';

import { LandingCertificateReportService } from '../services/landingcertificatereport.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-landingcertificate',
    templateUrl: './landingcertificate.component.html',
    providers: [LandingCertificateReportService]
})

export class LandingCertificateComponent {
    // Local Variables 
    title = 'Landing Certificate';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    hbl_ids = '';
    selectdeselect = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    from_date: string = '';
    to_date: string = '';
    search_shprid: string = '';
    sub: any;
    urlid: string;

    ErrorMessage = "";
    mode = '';
    pkid = '';

    SearchData = {
      type: '',
      pkid: '',
      report_folder: '',
      company_code: '',
      branch_code: '',
      year_code: '',
      from_date: '',
      to_date: '',
      search_shprid: '',
      hbl_ids:''
    };
    
    EXPRECORD: any;
    EXPREC: any = { id: '', code: '', name: '' };
    // Array For Displaying List
    RecordList: LandingCertificateReport[] = [];
    // Single Record for add/edit/view details
    Record: LandingCertificateReport = new LandingCertificateReport;

    constructor(
      private mainService: LandingCertificateReportService,
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
    }

    InitComponent() {

        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record)
            this.title = this.menu_record.menu_name;
        this.initLov();
        this.InitDefault();
        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    initLov(caption: string = '') {
      if (caption == '' || caption == 'SHIPPER') {
        this.EXPRECORD = {
          controlname: 'SHIPPER', type: 'CUSTOMER', where: " CUST_IS_SHIPPER = 'Y' ", displaycolumn: 'NAME',
          parentid: '', id: this.EXPREC.id, code: this.EXPREC.code, name: this.EXPREC.name
        };
      }
    }

    LovSelected(_Record: SearchTable) {

      // Company Settings
      if (_Record.controlname == 'SHIPPER') {
        this.search_shprid =  _Record.id;
      }
    }
    LoadCombo() {
    }
    InitDefault() {
      this.to_date = this.gs.defaultValues.today;
      //var tempdt = this.to_date.split('-');
      //let dtyr: number = +tempdt[0];
      //let dtmn: number = +tempdt[1];
      //let dtdy: number = +tempdt[2];
      //let dt = new Date(dtyr, dtmn, dtdy);
      // dt.setDate(dt.getDate() - 60) ;
      this.from_date = this.gs.defaultValues.monthbegindate;
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
      this.hbl_ids = "";
      if (this.from_date.trim().length <= 0) {
        this.ErrorMessage = 'From Date Cannot Be Blank';
        return;
      }
      if (this.to_date.trim().length <= 0) {
        this.ErrorMessage = 'To Date Cannot Be Blank';
        return;
      }
      if (this.search_shprid.trim().length <= 0) {
        this.ErrorMessage = 'Shipper Cannot Be Blank';
        return;
      }
      if (_type == 'EXCEL') {
        if (this.RecordList.length <= 0) {
          this.ErrorMessage = 'List Not Found.';
          return;
        }
        this.GetSelectedSINos();
        if (this.hbl_ids.trim().length <= 0) {
          this.ErrorMessage = 'Please select SI Nos and Continue.....';
          return;
        }
      }

      this.loading = true;
      this.pkid = this.gs.getGuid();
      this.SearchData.pkid = this.pkid;
      this.SearchData.report_folder = this.gs.globalVariables.report_folder;
      this.SearchData.company_code = this.gs.globalVariables.comp_code;
      this.SearchData.branch_code = this.gs.globalVariables.branch_code;
      this.SearchData.year_code = this.gs.globalVariables.year_code;
      this.SearchData.search_shprid = this.search_shprid;
      this.SearchData.type = _type;
      this.SearchData.from_date = this.from_date;
      this.SearchData.to_date = this.to_date;
      this.SearchData.hbl_ids = this.hbl_ids;

      this.ErrorMessage = '';
      this.mainService.List(this.SearchData)
        .subscribe(response => {
          this.loading = false;
          if (_type == 'EXCEL')
            this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
          else {
            this.RecordList = response.list;
          }
        },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
      this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }
    Close() {
        this.gs.ClosePage('home');
    }
     

    //OnChange(field: string) {
    //  if (field == "chkselect")
    //    this.SelectSINos();
    //}


    SelectSINos() {
      this.selectdeselect = !this.selectdeselect;
      for (let rec of this.RecordList) {
        rec.hbl_no_checked = this.selectdeselect;
      }
    }

    GetSelectedSINos() {
      this.hbl_ids = "";
      for (let rec of this.RecordList) {
        if (rec.hbl_no_checked) {
          if (this.hbl_ids.trim() != "")
            this.hbl_ids = this.hbl_ids.concat(",");
          this.hbl_ids = this.hbl_ids.concat("'", rec.hbl_pkid, "'");
        }
      }
    }

}
