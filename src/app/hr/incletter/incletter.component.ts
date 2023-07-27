import { Component, Input, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { HrReport } from '../models/hrreport';
import { HrReportService } from '../services/hrreport.service';

@Component({
  selector: 'app-incletter',
  templateUrl: './incletter.component.html',
  providers: [HrReportService]
})
export class IncLetterComponent {
  // Local Variables 
  title = '';
  @ViewChild('fileinput') private fileinput: ElementRef;

  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';
  myFiles: string[] = [];
  filesSelected: boolean = false;

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  jobno = '';
  searchstring = '';
  print_date = '';
  effective_date = '';
  incentive_effective_date = '';
  folderid = "";
  uploadfilename = "";
  uploadfiledispname = "";
  incentive_format = "FORMAT-2022";
  ctr: number;
  jobdisabled = false;
  sub: any;
  bValueChanged: boolean = false;

  // Array For Displaying List
  RecordList: HrReport[] = [];
  // Single Record for add/edit/view details
  Record: HrReport = new HrReport;


  constructor(
    private mainService: HrReportService,
    private http2: HttpClient,
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
    this.InitLov();
  }


  InitComponent() {
    this.jobno = '';
    this.searchstring = '';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
    }
  }

  // Init Will be called After executing Constructor
  ngOnInit() {

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {


  }


  NewRecord() {

    this.pkid = this.gs.getGuid();
    //this.Record = new HrReport();

    this.InitLov();

    //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
    //this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;
  }



  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    // switch (field) {
    //   case 'opr_sbill_no':
    //     {
    //       //   this.Record.opr_sbill_no = this.Record.opr_sbill_no.toUpperCase();
    //       //   this.SearchRecord('opr_sbill_no');
    //       break;
    //     }

    // }
  }

  onLostFocus(field: string) {
    // if (this.bValueChanged && field == 'search') {

    // }
  }
  OnChange(field: string) {
    if (field == 'search')
      this.bValueChanged = true;
  }
  OnFocus(field: string) {
    if (field == 'search')
      this.bValueChanged = false;
  }

  ProcessIncrementLetter(_type: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_type == "PROCESS-LETTER") {
      if (this.print_date.length <= 0) {
        this.ErrorMessage = " | Print Date Cannot be blank";
        alert(this.ErrorMessage);
        return;
      }
      if (this.effective_date.length <= 0) {
        this.ErrorMessage = " | Effective Date Cannot be blank";
        alert(this.ErrorMessage);
        return;
      }

      if (this.uploadfilename.length <= 0) {
        this.ErrorMessage = " | Please upload the template without formula to Process.....";
        alert(this.ErrorMessage);
        return;
      }
    }
    if (_type == "INCENTIVE-LETTER") {
      if (this.print_date.length <= 0) {
        this.ErrorMessage = " | Print Date Cannot be blank";
        alert(this.ErrorMessage);
        return;
      }
      if (this.effective_date.length <= 0) {
        this.ErrorMessage = " | Effective Date Cannot be blank";
        alert(this.ErrorMessage);
        return;
      }

      if (this.incentive_effective_date.length <= 0) {
        this.ErrorMessage = " | Incentive Effective Date Cannot be blank";
        alert(this.ErrorMessage);
        return;
      }
    }

    this.folderid = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      branch_region: this.gs.defaultValues.pf_br_region,
      folderid: this.folderid,
      uploadfileid: this.uploadfilename,
      print_date: this.print_date,
      effective_date: this.effective_date,
      incentive_effective_date: this.incentive_effective_date,
      incentive_format: this.incentive_format
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.ProcessLetter(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'DOWNLOAD-TEMPLATE' || _type == 'INCENTIVE-LETTER')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        if (_type == 'PROCESS-LETTER') {
          if (response.serror.length > 0) {
            this.ErrorMessage = response.serror;
            alert(this.ErrorMessage);
          } else
            this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
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

  uploadFiles() {
    if (!this.filesSelected) {
      alert('No File Selected');
      return;
    }

    this.loading = true;

    let frmData: FormData = new FormData();

    frmData.append("COMPCODE", this.gs.globalVariables.comp_code);
    frmData.append("BRANCHCODE", this.gs.globalVariables.branch_code);
    frmData.append("PARENTID", this.gs.globalVariables.report_folder);
    frmData.append("GROUPID", 'INCREMENT-LETTER');
    frmData.append("TYPE", this.type);
    frmData.append("CATGID", '');
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

          this.uploadfilename = data.filename;
          this.uploadfiledispname = data.filedisplayname;
          //   this.AttachList.push({ filename: data.filename, filetype: data.filetype, filedisplayname: data.filedisplayname, filecategory: data.category, fileftpfolder: '', fileisack: 'N', fileprocessid: '' });

        },
        error => {
          this.loading = false;
          alert('Failed');
        }
      );
  }
  getFileDetails(e: any) {
    //console.log (e.target.files);
    this.uploadfiledispname = "";
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
    }
  }
}
