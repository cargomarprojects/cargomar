import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { GenService } from '../services/gen.services';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-xmloms',
  templateUrl: './xmloms.component.html',
  providers: [GenService]
})
export class XmlomsComponent {
  // Local Variables 

  title = 'EDI';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() pkid: string = '';
  @Input() filename: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  loading = false;

  bCompany = false;
  sub: any;
  urlid: string;
  // Prealertdate: boolean = false;
  senton_date = "";
  ErrorMessage = "";

  constructor(
    private mainService: GenService,
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
    this.bCompany = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      if (this.menu_record.rights_company)
        this.bCompany = true;
    }
    this.initLov();
    this.LoadCombo();
  }
  initLov(caption: string = '') {
  }

  LovSelected(_Record: SearchTable) {
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


  GenerateXml() {
    this.ErrorMessage = '';
    if (this.pkid.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Invalid ID";
      return;
    }
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      type: this.type,
      pkid: '',
      filedisplayname: ''
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.type = this.type;
    SearchData.pkid = this.pkid;
    SearchData.filedisplayname = this.filename;

    this.mainService.GenerateXmlEdiMexico(SearchData)
      .subscribe(response => {
        this.loading = false;
        //this.ErrorMessage = response.savemsg;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        // if (this.type == 'CONTAINER' || this.type == 'MBL')
        if (this.type == 'CONTAINER')
          this.Downloadfile(response.filenameack, response.filetypeack, response.filedisplaynameack);
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

}
