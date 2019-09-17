import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';



import { HttpClient } from '@angular/common/http';

import { Observable } from 'RxJS/Rx';
import 'rxjs/add/operator/map'

import { GlobalService } from '../../core/services/global.service';
import { AlertService } from '../services/alert.service';
import { GenerateDocService } from '../services/generatedoc.service';
import { SearchTable } from '../models/searchtable';


@Component({
  selector: 'app-generatedoc',
  templateUrl: './generatedoc.component.html'
})
export class GenerateDocComponent {

  @Input() public pkid: string;
  @Input() public type: string;
  
  title = 'Generate Docs';
  folder_id: string;
  ErrorMessage: string = '';
  InfoMessage: string = '';

  loading = false;

  constructor(
    private gs: GlobalService,
    private mainService: GenerateDocService,
    private alertService: AlertService,
    private http: HttpClient,
  ) {

  }

  @ViewChild('fileinput') private fileinput: ElementRef;

  RecordList: SearchTable[] = [];

  ngOnInit() {
    this.List("NEW");
  }

  List(_type: string) {

    this.ErrorMessage = ''

    if (this.pkid.length <= 0) {
      this.ErrorMessage = "\n\r | Invalid ID";
    }

    if (this.ErrorMessage.length > 0)
      return;

    this.loading = true;

    let SearchData = {
      type: '',
      pkid: ''
    }

    SearchData.pkid = this.pkid;

    this.mainService.GenerateDocList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
      error => {
        this.loading = false;
        alert(this.gs.getError(error));
      });
  }
  
  GenerateDocs(id: string, _type: string) {
    if (_type == "CHECK LIST") {
      this.PrintCheckList(id, this.type, "EXCEL")
    }
    else
      this.PrintInvoice(id, "DETAIL", "PDF");
  }

  PrintCheckList(id: string, category: string, _type: string) {
    this.folder_id = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      category: '',
      type: _type,
      pkid: '',
      report_folder: '',
      folderid: '',
      branch_code: '',
      comp_code: ''
    };
    SearchData.category = category;
    SearchData.type = _type;
    SearchData.pkid = id;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.folderid = this.folder_id;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PrintCheckList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }
   
  PrintInvoice(id: string,reportformat: string, _type: string = 'PDF') {

    this.loading = true;
    this.folder_id = this.gs.getGuid();

    let SearchData = {
      type: '',
      araptype: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: '',
      report_caption: '',
      report_format: ''
    }

    SearchData.pkid = id;
    SearchData.report_format = reportformat;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.report_caption = "INVOICE";

    this.ErrorMessage = '';
    this.mainService.GenerateInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  

}
