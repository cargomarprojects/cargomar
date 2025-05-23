import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { XmlService } from '../services/xml.service';
import { SearchTable } from '../../shared/models/searchtable';
import { FileDetails } from '../../operations/models/filedetails';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-xml',
  templateUrl: './xml.component.html',
  providers: [XmlService]
})
export class XmlComponent {
  // Local Variables 
  title = 'XmlEdi';

  @ViewChild('pdfContainer') pdfContainer: ElementRef;
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  modal: any;
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
  sWhere = "CUST_IS_SHIPPER = 'Y'";

  files_bytes: string = '';
  json_data: string = '';
  exporter_id = "";
  exporter_name = "";
  partner_id = "E4A7788E-D38B-2C00-B120-4865E82EF88D";
  ref_no = "";
  ref_type = "FCR";

  hbl_nos = '';
  agent_id = 'E5A80C01-0528-4759-A0E3-CBE5DDDD5621';
  agent_name = 'RITRA CARGO (HOLLAND) B.V.';
  agent_code = 'RITRACARGO-NL';

  BRRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  FileList: FileDetails[] = [];

  sSubject: string = '';
  ftpUpdtSql: string = '';
  ftpTransfertype: string = 'MBL-SE-BOOKING';
  FtpAttachList: any[] = [];
  ftp_agent_name: string = "";
  ftp_agent_code: string = "";
  AttachList: any[] = [];
  canftp: boolean = false;
  mMsg: string = "";
  mail_update_type: string = "";
  pkid: string = "";
  booking_format: string = "TRANSPORT MULTIMODAL";

  constructor(
    private modalService: NgbModal,
    private mainService: XmlService,
    private route: ActivatedRoute,
    public gs: GlobalService
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
    this.AGENTRECORD.id = this.agent_id;
    this.AGENTRECORD.code = this.agent_code;
    this.AGENTRECORD.name = this.agent_name;

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
    if (_Record.controlname == "SHIPPER") {
      this.exporter_id = _Record.id;
      this.exporter_name = _Record.name;
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
      alert(this.ErrorMessage);
      return;
    }
    if (this.agent_name.indexOf("RITRA") < 0) {
      this.ErrorMessage = "\n\r | Invalid Agent Selected";
      alert(this.ErrorMessage);
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
        alert(this.ErrorMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  GenerateCostingXml() {
    this.ErrorMessage = '';
    if (this.agent_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }
    if (this.agent_name.indexOf("RITRA") < 0) {
      this.ErrorMessage = "\n\r | Invalid Agent Selected";
      alert(this.ErrorMessage);
      return;
    }
    if (this.senton_date.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Date Cannot be blank";
      alert(this.ErrorMessage);
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

  GenerateBookingXml(ftpsent: any) {

    this.ErrorMessage = '';
    if (this.agent_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }
    if (this.agent_name.indexOf("RITRA") < 0) {
      this.ErrorMessage = "\n\r | Invalid Agent Selected";
      alert(this.ErrorMessage);
      return;
    }

    // if (!confirm("Generate Booking Xml " + this.branch_name)) {
    //   return;
    // }




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
        // this.ErrorMessage = response.savemsg;
        // // alert(this.ErrorMessage);
        // for (let rec of this.FileList) {
        //   this.Downloadfile(rec.filename, rec.filetype, rec.filedisplayname);
        // }

        this.canftp = true;
        this.sSubject = "BOOKING - " + this.agent_name;
        this.ftp_agent_code = this.agent_code;
        this.ftp_agent_name = this.agent_name;
        this.FtpAttachList = new Array<any>();
        this.FileList = response.filelist;
        this.AttachList = new Array<any>();
        for (let rec of this.FileList) {
          this.FtpAttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: rec.filecategory, fileftpfolder: 'FTP-FOLDER', fileisack: 'N', fileprocessid: rec.fileprocessid, filesize: rec.filesize, fileftptype: 'BOOKING-FTP' });
        }

        this.open(ftpsent);

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

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }


  AutoBookingXmlFtp() {
    this.ErrorMessage = '';
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      agent_id: 'E5A80C01-0528-4759-A0E3-CBE5DDDD5621',
      agent_code: 'RITRACARGO-NL',
      auto_ftp: 'Y'
    };
    this.mainService.GenerateXmlBooking(SearchData)
      .subscribe(response => {
        this.loading = false;
        alert(response.savemsg);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }

  GenerateBookingXls(ftpsent: any) {

    this.ErrorMessage = '';
    if (this.agent_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }

    // if (!confirm("Generate Booking Xml " + this.branch_name)) {
    //   return;
    // }

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
      format: this.booking_format
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
    SearchData.format = this.booking_format;

    this.mainService.GenerateXlsBooking(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.FileList = response.filelist;

        this.mail_update_type = "BOOKING-REPORT-" + this.agent_code;
        this.canftp = false;
        this.sSubject = response.subject;
        this.mMsg = response.message;
        this.ftp_agent_code = this.agent_code;
        this.ftp_agent_name = this.agent_name;
        this.FtpAttachList = new Array<any>();
        this.FileList = response.filelist;
        this.AttachList = new Array<any>();
        for (let rec of response.filelist) {
          this.AttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: rec.filecategory, fileftpfolder: '', fileisack: 'N', fileprocessid: '', filesize: rec.filesize });
        }

        this.open(ftpsent);

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }

  /* This funtion is used in Powershell scheduler*/
  DeleteFiles() {

    this.ErrorMessage = '';
    if (!confirm("Delete Files ")) {
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      folderpath: "C:\\Reports\\INWARD-EDI-FILES\\CHNSF\\SB-SHIPPER-INVOICE",
      todate: "2024-11-07",
      deletetemp: true
    };

    this.mainService.DeleteFilesFromFolder(SearchData)
      .subscribe(response => {
        this.loading = false;
        alert(response.msg);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }

  DownloadPdf(_type: string) {

    if (this.gs.isBlank(this.files_bytes)) {
      alert('Invalid File Bytes')
      return;
    }
    const base64String = this.files_bytes; // Your Base64 string
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    if (_type == 'DOWNLOAD') {
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    if (_type == 'VIEW') {
      // Create a URL for the Blob to view
      const objectURL = URL.createObjectURL(blob);

      // Create an object element and set the data attribute to the object URL
      const object = document.createElement('object');
      object.data = objectURL;
      object.type = 'application/pdf';
      object.style.width = '100%';  // Set the width of the object
      object.style.height = '600px'; // Set the height of the object
      //document.body.appendChild(object); // Append object to the body (or specific container)

      this.pdfContainer.nativeElement.appendChild(object);
    }
    if (_type == 'CLOSE') {
      const pdfObject = document.querySelector('object');
      if (pdfObject) {
        pdfObject.remove(); // Removes the specific PDF viewer (object)
      }
    }
  }

  GenerateFcrData() {
    this.ErrorMessage = '';

    if (this.gs.isBlank(this.ref_no)) {
      alert('Invalid FCR No')
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      exporter_id: this.exporter_id,
      refno: this.ref_no,
      reftype: this.ref_type,
      partner_id: this.partner_id
    };

    this.mainService.GenerateFcrData(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.json_data = JSON.stringify(response.data);
        this.files_bytes = response.data.fcr_pdf;
        console.log('Data: ', this.json_data);
        this.DownloadPdf('VIEW');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
}
