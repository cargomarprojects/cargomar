import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
//EDIT-AJITH-20-12-2021

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
})
export class MailComponent {
  // Local Variables 
  title = 'Mail Details';
  @ViewChild('fileinput') private fileinput: ElementRef;

  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() menuid: string = '';
  @Input() public pkid: string = '';
  @Input() public type: string = '';
  @Input() public sHtml: string = '';
  @Input() public defaultto_ids: string = '';
  @Input() public defaultmessage: string = '';
  @Input() public defaultsubject: string = '';
  @Input() public updateto_ids: boolean = false;
  @Input() public AttachList = new Array<any>();
  @Input() public canftp: boolean = false;
  @Input() public ftpfolderblexist: boolean = false;
  @Input() public agentname: string = '';
  @Input() public agentcode: string = '';
  @Input() public updatesql: string = '';
  @Input() public rootpage: string = 'MAILPAGE';
  @Input() public FtpAttachList = new Array<any>();
  @Input() public PoFtpAttachList = new Array<any>();
  @Input() public disableBLftp: boolean = false;
  @Input() public PoFtpError: string = '';
  @Input() public default_ftptype: string = '';
  @Input() public updatetype: string = '';
  @Input() public emaildisplayname: string = '';
  @Input() public sHtmlHeight: string = '';

  InitCompleted: boolean = false;
  ftpcompleted: boolean = false;

  menu_record: any;
  showattach: boolean = false;
  catg_id: string = 'OTHERS';
  myFiles: string[] = [];
  filesSelected: boolean = false;;
  attach_totfilesize: number = 0;
  lbl_ftpattachfz: string = '';
  lbl_msgattachfz: string = '';
  lbl_poftpattachfz: string = '';

  msgFontFamily: string = '';
  msgFontSize: string = '';
  msgForeground: string = '';
  msgFontWeight: string = '';

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  rdbchkd: true;
  to_ids: string = '';
  cc_ids: string = '';
  bcc_ids: string = '';
  subject: string = '';
  message: string = '';
  ftpsubject: string = '';

  ftptype: string = 'BL-FTP';
  ftptypecaption: string = 'BL-FTP';
  ftptype_id: string = '';
  FtpTypeList: any[] = [];
  FtpTypeListMaster: any[] = [];
  FtpAttachListMaster = new Array<any>();

  poftptype_id: string = '';
  PoFtpTypeList: any[] = [];
  innerHtmlHt: string = '';

  EmailFromUserID: string = '';

  customer_name: string = '';
  ErrorMessage = "";
  InfoMessage = "";
  CUSTRECORD: SearchTable = new SearchTable();
  CUSTADDRECORD: SearchTable = new SearchTable();
  constructor(
    private route: ActivatedRoute,
    private http2: HttpClient,
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
    if (this.type == 'AIR EXPORT COSTING' || this.type == 'SEA EXPORT COSTING' || this.type == 'AGENT INVOICE' || this.type == 'DRCR ISSUE' || this.type == 'SE CONSOLE COSTING')
      this.ftptypecaption = 'COSTING-FTP';
    else
      this.ftptypecaption = 'BL-FTP';
    if (this.type == 'BP-APPROVAL')
      this.innerHtmlHt = '200px';
    else
      this.innerHtmlHt = this.sHtmlHeight;
    this.ftptype = this.default_ftptype;
    this.to_ids = this.defaultto_ids;
    this.subject = this.defaultsubject;
    this.ftpsubject = this.defaultsubject;
    this.message = this.defaultmessage;
    this.ftpsubject = this.ftpsubject.replace('PRE-ALERT FOR', '');
    this.ftpsubject = this.ftpsubject.trim();
    this.GetTotfilesize();
    this.LoadCombo();
  }

  InitComponent() {
    this.ftpcompleted = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.InitLov();
    this.customer_name = '';
    this.catg_id = 'OTHERS';

  }

  InitLov() {

    this.CUSTRECORD = new SearchTable();
    this.CUSTRECORD.controlname = "CUSTOMER";
    this.CUSTRECORD.displaycolumn = "CODE";
    this.CUSTRECORD.type = "CUSTOMER";
    //this.CUSTRECORD.where = " CUST_IS_AGENT <> 'Y' ";
    this.CUSTRECORD.id = "";
    this.CUSTRECORD.code = "";
    this.CUSTRECORD.name = "";

    this.CUSTADDRECORD = new SearchTable();
    this.CUSTADDRECORD.controlname = "CUSTADDRESS";
    this.CUSTADDRECORD.displaycolumn = "CODE";
    this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
    this.CUSTADDRECORD.id = "";
    this.CUSTADDRECORD.code = "";
    this.CUSTADDRECORD.name = "";
    this.CUSTADDRECORD.parentid = "";

  }
  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == 'CUSTOMER') {
      this.customer_name = _Record.name;
      this.CUSTADDRECORD = new SearchTable();
      this.CUSTADDRECORD.controlname = "CUSTADDRESS";
      this.CUSTADDRECORD.displaycolumn = "CODE";
      this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
      this.CUSTADDRECORD.id = "";
      this.CUSTADDRECORD.code = "";
      this.CUSTADDRECORD.name = "";
      this.CUSTADDRECORD.parentid = _Record.id;
    } else if (_Record.controlname == "CUSTADDRESS") {
      this.to_ids = _Record.col6;
    }
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {
    this.ErrorMessage = '';
    this.FtpAttachListMaster = new Array<any>();
    for (let rec of this.FtpAttachList) {
      this.FtpAttachListMaster.push(rec);
    }
    this.SearchRecord('maillist', 'LIST');
  }

  // Save Data
  SendMail() {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (!this.allvalid())
      return;
    this.SearchRecord('smtpmail', 'MAIL');
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.to_ids.trim().length <= 0) {
      sError = "To IDs Cannot Be Blank";
      bret = false;
    }

    if (this.subject.trim().length <= 0) {
      sError += " | Subject Cannot Be Blank";
      bret = false;
    }

    if (this.message.trim().length <= 0) {
      sError += " | Message Cannot Be Blank";
      bret = false;
    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }
  OnBlur(field: string) {

  }

  OnChange(field: string) {
    if (field == 'ftptype') {

      this.FtpTypeList = new Array<any>();
      for (let rec of this.FtpTypeListMaster) {
        if (rec.param_id2 == this.ftptype)
          this.FtpTypeList.push(rec);
      }

      if (this.FtpTypeList != null) {
        var REC = this.FtpTypeList.find(rec => rec.param_id1 == this.agentcode && rec.param_id2 == this.ftptype);
        if (REC != null) {
          this.ftptype_id = REC.param_pkid;
        }
      }

      this.FtpAttachList = new Array<any>();
      for (let rec of this.FtpAttachListMaster) {
        if (rec.fileftptype === this.ftptype)
          this.FtpAttachList.push(rec);
      }
      this.GetTotfilesize();
    }
  }
  Close() {

  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  SaveIDs() {
    this.SearchRecord('maillist', 'SAVE');
  }


  SearchRecord(controlname: string, _type: string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (controlname == "maillist" && this.type.trim().length <= 0) {
      this.ErrorMessage = "Invalid Type";
      alert(this.ErrorMessage);
      return;
    }

    let filename: string = "";
    let filedisplayname: string = "";
    if (this.AttachList != null) {
      if (this.AttachList.length == 1) {
        filename = this.AttachList[0].filename;
        filedisplayname = this.AttachList[0].filedisplayname;
      } else {
        for (let rec of this.AttachList) {
          if (filename != "")
            filename = filename.concat(",");
          filename = filename.concat(rec.filename, "~", rec.filedisplayname);
        }
      }
    }

    this.loading = true;
    let SearchData = {
      table: controlname,
      pkid: '',
      to_ids: '',
      cc_ids: '',
      bcc_ids: '',
      subject: '',
      message: '',
      filename: '',
      filedisplayname: '',
      rowtype: this.type,
      type: _type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_pkid: this.gs.globalVariables.user_pkid,
      user_name: this.gs.globalVariables.user_name,
      user_code: this.gs.globalVariables.user_code,
      update_toids: '',
      canftp: 'N',
      updatetype: '',
      email_display_name: ''
    };

    SearchData.table = controlname;
    SearchData.pkid = this.pkid;
    SearchData.to_ids = this.to_ids;
    SearchData.cc_ids = this.cc_ids;
    SearchData.bcc_ids = this.bcc_ids;
    SearchData.subject = this.subject;
    if (controlname == 'smtpmail' && this.type == "BL-SURRENDER-MAIL") 
      SearchData.message = this.getFormattedMsg();//will set font name, size ...
    else
      SearchData.message = this.sHtml.concat(this.message);
    SearchData.filename = filename;
    SearchData.filedisplayname = filedisplayname;
    SearchData.rowtype = this.type;
    SearchData.type = _type;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    if (this.gs.isBlank(this.EmailFromUserID))
      SearchData.user_pkid = this.gs.globalVariables.user_pkid;
    else
      SearchData.user_pkid = this.EmailFromUserID;
    SearchData.user_name = this.gs.globalVariables.user_name;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.update_toids = (this.updateto_ids == true) ? "Y" : "N";
    SearchData.canftp = (this.canftp == true) ? "Y" : "N";
    SearchData.updatetype = this.updatetype;
    SearchData.email_display_name = this.emaildisplayname;
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        if (_type == "MAIL") {
          this.InfoMessage = response.smtpmail;
          if (this.ModifiedRecords != null && (this.type == "DESPATCH-DETAILS" || this.type == "BP-APPROVAL"))
            this.ModifiedRecords.emit({ saction: this.InfoMessage, sid: this.pkid });

          // Auto ftp Sent
          if (this.InfoMessage.trim().toUpperCase() == "MAIL SENT SUCCESSFULLY" && this.canftp && this.ftpfolderblexist) {
            this.SendFtp(this.InfoMessage, 'BL-FTP');
          } else
            alert(this.InfoMessage);
        }
        else if (_type == "LIST") {
          if (response.to_ids.length > 0 && this.updateto_ids)
            this.to_ids = response.to_ids;
          else if (response.to_ids.length > 0 && this.defaultto_ids) {
            if (response.to_ids.toString().indexOf(this.defaultto_ids) < 0)
              this.to_ids = response.to_ids + ',' + this.defaultto_ids;
          }
          if (response.cc_ids.length > 0)
            this.cc_ids = response.cc_ids;
          if (response.bcc_ids.length > 0)
            this.bcc_ids = response.bcc_ids;
          if (response.from_user_pkid)
            this.EmailFromUserID = response.from_user_pkid;

          this.message += response.mailsignature;

          //Ftp Dropdown 
          this.FtpTypeListMaster = new Array<any>();
          this.FtpTypeListMaster = response.ftplist;
          this.OnChange('ftptype');

          // this.FtpTypeList = new Array<any>();
          // for (let rec of this.FtpTypeListMaster) {
          //   if (rec.param_id2 == this.ftptype)
          //     this.FtpTypeList.push(rec);
          // }

          // if (this.FtpTypeList != null) {
          //   var REC = this.FtpTypeList.find(rec => rec.param_id1 == this.agentcode && rec.param_id2 == this.ftptype);
          //   if (REC != null) {
          //     this.ftptype_id = REC.param_pkid;
          //   }
          // }


          /*
                    this.FtpTypeList = new Array<any>();
                    this.PoFtpTypeList = new Array<any>();
                    for (let rec of response.ftplist) {
                      if (rec.param_id2 == 'BL-FTP')
                        this.FtpTypeList.push(rec);
                      else
                        this.PoFtpTypeList.push(rec);
                    }
          
                    if (this.FtpTypeList != null) {
                      var REC = this.FtpTypeList.find(rec => rec.param_id1 == this.agentcode && rec.param_id2 == 'BL-FTP');
                      if (REC != null) {
                        this.ftptype_id = REC.param_pkid;
                      }
                    }
          
                    if (this.PoFtpTypeList != null) {
                      var REC = this.PoFtpTypeList.find(rec => rec.param_id1 == this.agentcode && rec.param_id2 == 'PO-FTP');
                      if (REC != null) {
                        this.poftptype_id = REC.param_pkid;
                      }
                    }
          */

        }
        else if (_type == "SAVE") {
          this.InfoMessage = "Save Complete";
          alert(this.InfoMessage);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  /*
  ShowBL() {
    //this.router.navigate([rec.menu_route1], { queryParams: { parameter: rec.menu_route2 }, replaceUrl: true });
    //this.router.navigate(["operations/seabl"], { queryParams: { parameter:"menuid:JOBSEAEXPORT,type:SEA EXPORT"}, replaceUrl: true });
    //this.router.navigate([{ outlets: { blpage: ['operations/seabl'] } }]); 
  }
  */

  SendFtp(_smsg: string = "", _ftp_type: string = "BL-FTP") {
    this.ftpcompleted = false;
    this.InfoMessage = _smsg;
    this.ErrorMessage = '';

    if (_ftp_type == 'BL-FTP' || _ftp_type == 'PO-FTP' || _ftp_type == 'BOOKING-FTP') {
      if (this.ftptype_id.trim().length <= 0) {
        this.ErrorMessage += "\n\r | FTP To Cannot Be Blank";
        alert(this.ErrorMessage);
        return;
      }
      if (this.FtpAttachList == null || this.FtpAttachList.length <= 0) {
        this.ErrorMessage += "\n\r | Attachment Not Found ";
        alert(this.ErrorMessage);
        return
      }
    }

    if (_ftp_type == 'PO-FTP') {

      if (this.PoFtpError.trim().length > 0) {
        this.ErrorMessage += "\n\r " + this.PoFtpError;
        alert(this.ErrorMessage);
        return;
      }

    }
    if (this.FtpTypeList != null) {
      var REC = this.FtpTypeList.find(rec => rec.param_pkid == this.ftptype_id);
      if (REC != null) {
        if (this.agentname.indexOf("RITRA") >= 0) {
          if (REC.param_name.indexOf("RITRA") < 0) {
            this.ErrorMessage += "\n\r | Please Select RITRA FTP and Continue.....";
            alert(this.ErrorMessage);
            return;
          }
        }
        if (this.agentname.indexOf("RITRA") < 0) {
          if (REC.param_name.indexOf("RITRA") >= 0) {
            this.ErrorMessage += "\n\r | Invalid FTP Details.....";
            alert(this.ErrorMessage);
            return;
          }
        }
      }
    }

    let filename: string = "";
    let filenameack: string = "";

    if (this.FtpAttachList != null && (_ftp_type == 'BL-FTP' || _ftp_type == 'PO-FTP' || _ftp_type == 'BOOKING-FTP')) {
      for (let rec of this.FtpAttachList) {
        if (rec.filecategory != 'OTHERS') {
          if (filename != "")
            filename = filename.concat(",");
          if (filenameack != "")
            filenameack = filenameack.concat(",");
          if (rec.fileisack == 'Y')
            filenameack = filenameack.concat(rec.filename, "~", rec.filecategory, "~", rec.fileftpfolder, "~", rec.fileprocessid);
          else
            filename = filename.concat(rec.filename, "~", rec.filecategory, "~", rec.fileftpfolder, "~", rec.fileprocessid);
        }
      }
    }


    this.loading = true;
    let SearchData = {
      table: '',
      pkid: '',
      filename: '',
      filenameack: '',
      rowtype: this.type,
      ftptypeid: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_pkid: this.gs.globalVariables.user_pkid,
      user_name: this.gs.globalVariables.user_name,
      user_code: this.gs.globalVariables.user_code,
      subject: '',
      updatesql: ''
    };

    SearchData.table = 'ftp';
    SearchData.pkid = this.pkid;
    // SearchData.ftptypeid = _ftp_type == 'BL-FTP' ? this.ftptype_id : this.poftptype_id;
    SearchData.ftptypeid = this.ftptype_id;
    SearchData.filename = filename;
    SearchData.filenameack = filenameack;
    SearchData.rowtype = this.type;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.user_pkid = this.gs.globalVariables.user_pkid;
    SearchData.user_name = this.gs.globalVariables.user_name;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.subject = this.subject;
    SearchData.updatesql = this.updatesql;
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ftpcompleted = true;
        if (response.error.length > 0) {
          this.ErrorMessage += "\n\r | " + response.error;
          alert(this.ErrorMessage);
        } else {
          this.InfoMessage += "\n\r | " + response.ftp;
          alert(this.InfoMessage);
        }
        if (this.ftptypecaption == "COSTING-FTP" && this.InfoMessage.indexOf("Successfully") >= 0) {
          if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: 'SENT-ON', sid: this.pkid, sdate: response.sentondate });
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  getFileDetails(e: any) {
    //console.log (e.target.files);
    let isValidFile = true;
    let fname: string = '';
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesSelected = true;
      fname = e.target.files[i].name;
      if (fname.indexOf('&') >= 0)
        isValidFile = false;
      if (fname.indexOf('%') >= 0)
        isValidFile = false;
      if (fname.indexOf('#') >= 0)
        isValidFile = false;
      this.myFiles.push(e.target.files[i]);
    }

    if (!isValidFile) {
      this.filesSelected = false;
      alert('Invalid File Name - &%#');
    } else
      this.uploadFiles();
  }


  uploadFiles() {
    let ftpFolder: string = "";
    let ftpFilePrefix: string = "";
    if (this.catg_id == '' && this.rootpage != "MAILPAGE") {
      alert('Pls Select Category');
      return;
    }
    if (!this.filesSelected) {
      alert('No File Selected');
      return;
    }

    this.loading = true;

    let frmData: FormData = new FormData();

    frmData.append("COMPCODE", this.gs.globalVariables.comp_code);
    frmData.append("BRANCHCODE", this.gs.globalVariables.branch_code);
    frmData.append("PARENTID", this.gs.globalVariables.report_folder);
    frmData.append("GROUPID", 'MAIL-FTP-ATTACHMENT');
    frmData.append("TYPE", this.type);
    frmData.append("CATGID", this.catg_id);
    frmData.append("CREATEDBY", this.gs.globalVariables.user_code);

    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    this.http2.post<any>(
      this.gs.baseUrl + '/api/General/UploadFiles', frmData, this.gs.headerparam2('authorized-fileupload')).subscribe(
        data => {
          this.loading = false;
          this.filesSelected = false;
          this.fileinput.nativeElement.value = '';
          // if (this.rootpage == "PO-FTPPAGE") {
          //   if (this.PoFtpAttachList == null)
          //     this.PoFtpAttachList = new Array<any>();
          //   ftpFilePrefix = this.GetAttachFtpFilePreFix();
          //   ftpFolder = this.GetAttachFtpFolder();
          //   this.PoFtpAttachList.push({ filename: data.filename, filetype: data.filetype, filedisplayname: ftpFilePrefix + data.filedisplayname, filecategory: data.category, fileftpfolder: ftpFolder, fileisack: 'N', fileprocessid: '', filesize: data.filesize });
          // } else 
          if (this.rootpage == "FTPPAGE") {
            if (this.FtpAttachList == null)
              this.FtpAttachList = new Array<any>();
            ftpFolder = this.GetAttachFtpFolder();
            ftpFilePrefix = '';
            if (this.ftptype === 'PO-FTP')
              ftpFilePrefix = this.GetAttachFtpFilePreFix();
            this.FtpAttachList.push({ filename: data.filename, filetype: data.filetype, filedisplayname: ftpFilePrefix + data.filedisplayname, filecategory: data.category, fileftpfolder: ftpFolder, fileisack: 'N', fileprocessid: '', filesize: data.filesize, fileftptype: this.ftptype });
          } else {
            if (this.AttachList == null)
              this.AttachList = new Array<any>();
            this.AttachList.push({ filename: data.filename, filetype: data.filetype, filedisplayname: data.filedisplayname, filecategory: data.category, fileftpfolder: '', fileisack: 'N', fileprocessid: '', filesize: data.filesize });
          }
          this.GetTotfilesize();
        },
        error => {
          this.loading = false;
          alert('Failed');
        }
      );
  }

  GetTotfilesize() {
    this.attach_totfilesize = 0;

    try {
      if (this.FtpAttachList != null) {
        for (let rec of this.FtpAttachList) {
          if (rec.fileftptype === this.ftptype)
            this.attach_totfilesize += rec.filesize;
        }
      }
      this.lbl_ftpattachfz = this.GetFileSize(this.attach_totfilesize);

      // this.attach_totfilesize = 0;
      // if (this.PoFtpAttachList != null) {
      //   for (let rec of this.PoFtpAttachList) {
      //     this.attach_totfilesize += rec.filesize;
      //   }
      // }
      // this.lbl_poftpattachfz = this.GetFileSize(this.attach_totfilesize);

      this.attach_totfilesize = 0;
      if (this.AttachList != null) {
        for (let rec of this.AttachList) {
          this.attach_totfilesize += rec.filesize;
        }
      }
      this.lbl_msgattachfz = this.GetFileSize(this.attach_totfilesize);

    } catch (e) {

    }

  }

  GetAttachFtpFilePreFix() {
    if (this.catg_id == 'HBL')
      return 'HBL-';
    else if (this.catg_id == 'MBL')
      return 'MBL-';
    else if (this.catg_id == 'INVOICE')
      return 'IN-';
    else if (this.catg_id == 'PACKINGLIST')
      return 'PL-';
    else
      return '';
  }

  GetAttachFtpFolder() {
    if (this.catg_id == 'HBL')
      return 'FTP-FOLDER-HBL-DIGITAL';
    else if (this.catg_id == 'MBL')
      return 'FTP-FOLDER-MBL-DIGITAL';
    else if (this.catg_id == 'INVOICE')
      return 'FTP-FOLDER-INVOICE-DIGITAL';
    else if (this.catg_id == 'PACKINGLIST')
      return 'FTP-FOLDER-PL-DIGITAL';
    else
      return '';
  }

  ShowHideAttach() {
    this.showattach = !this.showattach;
  }
  ShowPage(_type: string) {
    this.rootpage = _type;
    // if (_type == "MAIL")
    //   this.rootpage = "MAILPAGE";
    // else
    //   this.rootpage = "FTPPAGE";
    if (_type == "FTPPAGE")
      this.canftp = true;
  }

  RemoveAttachment(Id: string, _type: string) {
    if (_type == "MAIL") {
      this.AttachList.splice(this.AttachList.findIndex(rec => rec.filename == Id), 1);
    } else if (_type == this.ftptype) {
      this.FtpAttachList.splice(this.FtpAttachList.findIndex(rec => rec.filename == Id), 1);
    }
    // else {
    //   this.PoFtpAttachList.splice(this.PoFtpAttachList.findIndex(rec => rec.filename == Id), 1);
    // }
    this.GetTotfilesize();
  }

  GetFileSize(_fsize: number) {
    let strsize: string = "";
    if (_fsize < 1024)
      strsize = _fsize.toString() + "bytes";
    else {
      let _newfsize = (_fsize / 1024.00);
      _newfsize = this.gs.roundNumber(_newfsize, 2);
      _newfsize = Math.ceil(_newfsize);
      if (_newfsize < 1024) {
        strsize = _newfsize.toString() + "KB";
      }
      else {
        _newfsize = (_newfsize / 1024.00);
        _newfsize = this.gs.roundNumber(_newfsize, 2);
        _newfsize = Math.ceil(_newfsize);
        strsize = _newfsize.toString() + "MB";
      }
    }
    return " " + strsize;
  }

  CheckList() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: this.InfoMessage, sid: this.pkid, type: 'MAIL-PO-CHECKLIST' });
  }

  getFormattedMsg() {
    let sFormatMsg = "";
    this.msgFontFamily = "Times New Roman";
    this.msgFontSize = "14";
    this.msgForeground = "";
    this.msgFontWeight = "";

    sFormatMsg = " <p style='font-family: " + this.msgFontFamily + "; font-size: " + this.msgFontSize + "pt;'>";
    sFormatMsg += this.message.toString();
    sFormatMsg += " </p>";

    return sFormatMsg;
  }

}
