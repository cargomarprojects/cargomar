import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() ftp_agent_name:string ='';
  @Input() ftp_agent_code:string ='';

  InitCompleted: boolean = false;
  menu_record: any;
  loading = false;
  modal: any;

  bCompany = false;
  sub: any;
  urlid: string;
  // Prealertdate: boolean = false;
  senton_date = "";
  ErrorMessage = "";

  ftpUpdtSql: string = '';
  sSubject: string = '';
  sMsg: string = '';
  sHtml: string = '';
  AttachList: any[] = [];

  constructor(
    private modalService: NgbModal,
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


  GenerateXml(_type: string, ftpsent: any) {
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
      rowtype: _type,
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
        if (_type == 'FTP') {
          this.sSubject = response.subject;
          this.ftpUpdtSql = response.updatesql;
          this.AttachList = new Array<any>();
          if (this.type == 'MBL-SE')
            this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: 'BLINFO', fileftpfolder: 'FTP-FOLDER-VSL-DATA', fileisack: 'N', fileprocessid: response.processid });
          if (this.type == 'CONTAINER') {
            this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: 'CARGO PROCESS', fileftpfolder: 'FTP-FOLDER-PO-DATA', fileisack: 'N', fileprocessid: response.processid });
            // this.AttachList.push({ filename: response.filenameack, filetype: response.filetypeack, filedisplayname: response.filedisplaynameack, filecategory: 'CARGO PROCESS', fileftpfolder: 'FTP-FOLDER-PO-DATA-ACK', fileisack: 'Y' });
          }
          if (this.type == 'ORDERLIST') {
            this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: 'ORDER', fileftpfolder: 'FTP-FOLDER-PO-CREATE', fileisack: 'N', fileprocessid: response.processid  });
            this.AttachList.push({ filename: response.filenameack, filetype: response.filetypeack, filedisplayname: response.filedisplaynameack, filecategory: 'ORDER', fileftpfolder: 'FTP-FOLDER-PO-CREATE-ACK', fileisack: 'Y', fileprocessid: response.processid });
          }
          if (this.type == 'AGENTBOOKING') {
            this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: 'ORDERS', fileftpfolder: 'FTP-FOLDER-PO-CREATE', fileisack: 'N', fileprocessid: response.processid });
            this.AttachList.push({ filename: response.filenameack, filetype: response.filetypeack, filedisplayname: response.filedisplaynameack, filecategory: 'ORDERS', fileftpfolder: 'FTP-FOLDER-PO-CREATE-ACK', fileisack: 'Y', fileprocessid: response.processid });
          }
          this.open(ftpsent);
        } else {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
          if (this.type == 'ORDERLIST' || this.type == 'AGENTBOOKING')
            this.Downloadfile(response.filenameack, response.filetypeack, response.filedisplaynameack);
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

  open(content: any) {
    this.modal = this.modalService.open(content);
  }
}
