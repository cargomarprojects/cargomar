import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { ShipmentData } from '../models/shipmentdata';
import { ShipmentDataService } from '../services/shipmentdata.service';

@Component({
    selector: 'app-shipdata',
    templateUrl: './shipdata.component.html',
    providers: [ShipmentDataService]
})
export class ShipDataComponent {
    // Local Variables 
    title = 'Shipment Details';

    @Input() public type: string = '';
    @Input() menuid: string = '';

    menu_record: any;
    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    urlid: string;

    pkid: string;
    searchType: string = 'EXPORT';
    searchCustomer: string = '';
    searchAddress1: string = '';
    searchAddress2: string = '';
    searchAddress3: string = '';
    searchRegion: string = '';
    searchCity: string = '';
    searchRegionType: string = 'NA';
    searchCityType: string = 'NA';
    searchGroupBy: string = 'NA';

    page_count: number = 0;
    page_current: number = 0;
    page_rowcount: number = 0;
    page_rows: number = 0;

    ErrorMessage = "";
    InfoMessage = "";
    RecordList: ShipmentData[] = [];

    constructor(
        private mainService: ShipmentDataService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                this.InitCompleted = false;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                this.InitComponent();
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.LoadCombo();
        this.InitComponent();
    }

    InitComponent() {
        if (this.InitCompleted)
            return;
        this.searchType = "EXPORT";
        this.searchRegionType = "NA";
        this.searchCityType = "NA";
        this.searchGroupBy = "NA";
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
        }
        this.InitLov();
        this.InitCompleted = true;
    }

    InitLov() {
    }
    LovSelected(_Record: SearchTable) {
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
    }

    // Save Data
    OnBlur(field: string) {
        if (field == 'searchCustomer') {
            this.searchCustomer = this.searchCustomer.toUpperCase();
        }
        if (field == 'searchAddress1') {
            this.searchAddress1 = this.searchAddress1.toUpperCase();
        }
        if (field == 'searchAddress2') {
            this.searchAddress2 = this.searchAddress2.toUpperCase();
        }
        if (field == 'searchAddress3') {
            this.searchAddress3 = this.searchAddress3.toUpperCase();
        }
        if (field == 'searchRegion') {
            this.searchRegion = this.searchRegion.toUpperCase();
        }
        if (field == 'searchCity') {
            this.searchCity = this.searchCity.toUpperCase();
        }
    }
    Close() {
        this.gs.ClosePage('home');
    }

    List(_type: string) {
        this.InfoMessage = "";
        this.ErrorMessage = '';
        this.pkid = this.gs.getGuid();
        this.loading = true;
        let SearchData = {
            pkid: this.pkid,
            type: _type,
            rowtype: this.type,
            report_folder: this.gs.globalVariables.report_folder,
            searchType: this.searchType,
            customer: this.searchCustomer,
            address1: this.searchAddress1,
            address2: this.searchAddress2,
            address3: this.searchAddress3,
            region: this.searchRegion,
            city: this.searchCity,
            regiontype: this.searchRegionType,
            citytype: this.searchCityType,
            groupby: this.searchGroupBy,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_pkid: this.gs.globalVariables.user_pkid,
            year_code: this.gs.globalVariables.year_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };

        this.ErrorMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }


}
