import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { XmlService } from '../services/xml.service';
import { SearchTable } from '../../shared/models/searchtable';
import { FileDetails } from '../../operations/models/filedetails';

@Component({
  selector: 'app-xml',
  templateUrl: './xml.component.html',
  providers: [XmlService]
})
export class XmlComponent {
  // Local Variables 
  title = 'XmlEdi';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex: number = -1;

  loading = false;

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  bCompany = false;
  sub: any;
  urlid: string;
  // Prealertdate: boolean = false;
  senton_date = "";
  ErrorMessage = "";

  branch_name: string;
  branch_code: string;
  branch_number: number;

  hbl_nos = '';
  agent_id = '';
  agent_name = '';
  agent_code = '';

  BRRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  FileList: FileDetails[] = [];

  constructor(
    private mainService: XmlService,
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
    this.hbl_nos = "";
    this.bCompany = false;
    this.senton_date = this.gs.getNewdate(7);
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
    }
    this.initLov();
    this.LoadCombo();
    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
    this.branch_number = this.gs.globalVariables.branch_number;
  }

  initLov(caption: string = '') {

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.displaycolumn = "NAME";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "AGENT") {
      this.agent_id = _Record.id
      this.agent_name = _Record.name
      this.agent_code = _Record.code
    }

    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
      this.branch_number = +_Record.col1;
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  LoadCombo() {
  }

  // Query List Data
  List(_type: string) {

  }


  GenerateXml(_type: string) {
    this.ErrorMessage = '';
    if (this.agent_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
      return;
    }
    if (this.agent_name.indexOf("RITRA") < 0) {
      this.ErrorMessage = "\n\r | Invalid Agent Selected";
      return;
    }
    if (!confirm("Generate " + _type + " Xml")) {
      return;
    }
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      agent_id: this.agent_id,
      agent_code: this.agent_code,
      agent_name: this.agent_name,
      pre_alert_date: '',
      hbl_nos: '',
      type: ''
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    if (this.bCompany) {
      SearchData.branch_code = this.branch_code;
    }
    else {
      SearchData.branch_code = this.gs.globalVariables.branch_code;
    }
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.agent_id = this.agent_id;
    SearchData.hbl_nos = this.hbl_nos;
    SearchData.type = _type;
    SearchData.agent_code = this.agent_code;
    SearchData.agent_name = this.agent_name;

    this.mainService.GenerateXmlEdi(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = response.savemsg;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);

        });
  }


  GenerateCostingXml() {
    this.ErrorMessage = '';
    if (this.agent_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
      return;
    }
    if (this.agent_name.indexOf("RITRA") < 0) {
      this.ErrorMessage = "\n\r | Invalid Agent Selected";
      return;
    }
    if (this.senton_date.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Date Cannot be blank";
      return;
    }

    if (!confirm("Generate Costing Xml")) {
      return;
    }
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      agent_id: this.agent_id,
      sent_on: this.senton_date
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.agent_id = this.agent_id;
    SearchData.sent_on = this.senton_date;

    this.mainService.GenerateXmlCostingInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = response.savemsg;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Close() {
    this.gs.ClosePage('home');
  }

  GenerateBookingXml() {

    this.ErrorMessage = '';
    if (this.agent_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
      return;
    }
    if (this.agent_name.indexOf("RITRA") < 0) {
      this.ErrorMessage = "\n\r | Invalid Agent Selected";
      return;
    }

    if (!confirm("Generate Booking Xml " + this.branch_name)) {
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      branch_name: this.gs.globalVariables.branch_name,
      branch_number: this.gs.globalVariables.branch_number,
      agent_id: this.agent_id,
      agent_code: this.agent_code,
      agent_name: this.agent_name,
      pre_alert_date: '',
      hbl_nos: '',
      type: '',
      mbl_id: ''
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    if (this.bCompany) {
      SearchData.branch_code = this.branch_code;
      SearchData.branch_name = this.branch_name;
      SearchData.branch_number = this.branch_number;
    }
    else {
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.branch_name = this.gs.globalVariables.branch_name;
      SearchData.branch_number = this.gs.globalVariables.branch_number;
    }
    SearchData.agent_id = this.agent_id;
    SearchData.agent_code = this.agent_code;
    SearchData.agent_name = this.agent_name;
    SearchData.hbl_nos = '';
    SearchData.mbl_id = '';
    this.mainService.GenerateXmlBooking(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.FileList = response.filelist;
        this.ErrorMessage = response.savemsg;
        // alert(this.ErrorMessage);
        for (let rec of this.FileList) {
          this.Downloadfile(rec.filename, rec.filetype, rec.filedisplayname);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
}
