import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { Costingd } from '../../models/costing';

@Component({
  selector: 'app-consoleeditor',
  templateUrl: './consoleeditor.component.html'
})
export class ConsoleEditorComponent {
  // Local Variables 
  title = 'Console Editor Details';
  @Output() ModifiedEditorRecords = new EventEmitter<any>();
  @Input() mRecord: Costingd = new Costingd;

  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  Total_Amount: number = 0;

  bChanged: boolean;

  pkid = "";
  ErrorMessage = "";
  InfoMessage = "";
  
   Record: Costingd = new Costingd;
  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.LoadCombo();
    this.Record.costd_agent_format = this.mRecord.costd_agent_format;
    this.Record.costd_pkid = this.mRecord.costd_pkid;
    this.Record.costd_parent_id = this.mRecord.costd_parent_id;
    this.Record.costd_acc_id = this.mRecord.costd_acc_id;
    this.Record.costd_type = this.mRecord.costd_type;
    this.Record.costd_sino = this.mRecord.costd_sino;
    this.Record.costd_shipper_name = this.mRecord.costd_shipper_name;
    this.Record.costd_consignee_name = this.mRecord.costd_consignee_name;
    this.Record.costd_consignee_group = this.mRecord.costd_consignee_group;
    this.Record.costd_hbl_nomination = this.mRecord.costd_hbl_nomination;
    this.Record.costd_hbl_terms = this.mRecord.costd_hbl_terms;
    this.Record.costd_pofd_name = this.mRecord.costd_pofd_name;
    this.Record.costd_grwt = this.mRecord.costd_grwt;
    this.Record.costd_chwt = this.mRecord.costd_chwt;
    this.Record.costd_frt_pp = this.mRecord.costd_frt_pp;
    this.Record.costd_frt_cc = this.mRecord.costd_frt_cc;
    this.Record.costd_frt_rate_pp = this.mRecord.costd_frt_rate_pp;
    this.Record.costd_frt_rate_cc = this.mRecord.costd_frt_rate_cc;
    this.Record.costd_baf_pp = this.mRecord.costd_baf_pp;
    this.Record.costd_baf_cc = this.mRecord.costd_baf_cc;
    this.Record.costd_baf_rate_pp = this.mRecord.costd_baf_rate_pp;
    this.Record.costd_baf_rate_cc = this.mRecord.costd_baf_rate_cc;
    this.Record.costd_caf_pp = this.mRecord.costd_caf_pp;
    this.Record.costd_caf_cc = this.mRecord.costd_caf_cc;
    this.Record.costd_caf_rate_pp = this.mRecord.costd_caf_rate_pp;
    this.Record.costd_caf_rate_cc = this.mRecord.costd_caf_rate_cc;
    this.Record.costd_ddc_pp = this.mRecord.costd_ddc_pp;
    this.Record.costd_ddc_cc = this.mRecord.costd_ddc_cc;
    this.Record.costd_ddc_rate_pp = this.mRecord.costd_ddc_rate_pp;
    this.Record.costd_ddc_rate_cc = this.mRecord.costd_ddc_rate_cc;
    this.Record.costd_acd_pp = this.mRecord.costd_acd_pp;
    this.Record.costd_acd_cc = this.mRecord.costd_acd_cc;
    this.Record.costd_acd_rate_pp = this.mRecord.costd_acd_rate_pp;
    this.Record.costd_acd_rate_cc = this.mRecord.costd_acd_rate_cc;
    this.Record.costd_oth_pp = this.mRecord.costd_oth_pp;
    this.Record.costd_oth_cc = this.mRecord.costd_oth_cc;
    this.Record.costd_oth_rate_pp = this.mRecord.costd_oth_rate_pp;
    this.Record.costd_oth_rate_cc = this.mRecord.costd_oth_rate_cc;
    this.Record.costd_pp = this.mRecord.costd_pp;
    this.Record.costd_cc = this.mRecord.costd_cc;
    this.Record.costd_tot = this.mRecord.costd_tot;
    this.Record.costd_blno = this.mRecord.costd_blno;
    this.Record.costd_ctr = this.mRecord.costd_ctr;
    this.Record.costd_category = this.mRecord.costd_category;
    this.Record.costd_cbm = this.mRecord.costd_cbm;
    this.Record.costd_actual_cbm = this.mRecord.costd_actual_cbm;
    this.Record.costd_rebate = this.mRecord.costd_rebate;
    this.Record.costd_amenment_chrgs = this.mRecord.costd_amenment_chrgs;
    this.Record.costd_seal_chrgs = this.mRecord.costd_seal_chrgs;
    this.Record.costd_consignee_group = this.mRecord.costd_consignee_group;
    this.Record.costd_hbl_nomination = this.mRecord.costd_hbl_nomination;
    this.Record.costd_hbl_terms = this.mRecord.costd_hbl_terms;
    this.Record.costd_incentive_rate = this.mRecord.costd_incentive_rate;
    this.Record.costd_fh_rate1 = this.mRecord.costd_fh_rate1;
    this.Record.costd_fh_limit1 = this.mRecord.costd_fh_limit1;
    this.Record.costd_fh_rate2 = this.mRecord.costd_fh_rate2;
    this.Record.costd_fh_limit2 = this.mRecord.costd_fh_limit2;
    this.Record.costd_fh_rate3 = this.mRecord.costd_fh_rate3
    this.Record.costd_fh_limit3 = this.mRecord.costd_fh_limit3;
    this.Record.costd_pofd_name = this.mRecord.costd_pofd_name;
    this.Record.costd_oth_chrgs_ritra = this.mRecord.costd_oth_chrgs_ritra;
    this.Record.costd_incentive_notreceived = this.mRecord.costd_incentive_notreceived;
    this.Record.costd_fh_chrg_perhouse = this.mRecord.costd_fh_chrg_perhouse;
    this.Record.costd_spl_incentive_rate = this.mRecord.costd_spl_incentive_rate;
    this.Record.costd_house_notinclude = this.mRecord.costd_house_notinclude;
    this.Record.costd_ex_chrg_ritrahouse = this.mRecord.costd_ex_chrg_ritrahouse;
    this.Record.costd_haulage_per_cbm = this.mRecord.costd_haulage_per_cbm;
    this.Record.costd_haulage_min_rate = this.mRecord.costd_haulage_min_rate;
    this.Record.costd_haulage_wt_divider = this.mRecord.costd_haulage_wt_divider;
    this.Record.costd_destuff_pd = this.mRecord.costd_destuff_pd;
    this.Record.costd_handling_fee = this.mRecord.costd_handling_fee;
    this.Record.costd_truck_cost = this.mRecord.costd_truck_cost;
    this.Record.costd_cntr_shifit = this.mRecord.costd_cntr_shifit;
    this.Record.costd_vessel_chrgs = this.mRecord.costd_vessel_chrgs;
    this.Record.costd_ex_works = this.mRecord.costd_ex_works;
  }

  InitComponent() {
    this.InitLov();
  }

  InitLov() {

   
  }
  LovSelected(_Record: SearchTable) {
   
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
   // this.sub.unsubscribe();
  }

  LoadCombo() {
  }
  
  // Save Data
  OnBlur(field: string) {
    if (field == "costd_frt_rate_pp") {
      this.Record.costd_frt_rate_pp = this.gs.roundNumber(this.Record.costd_frt_rate_pp, 3);
    }
    if (field == "costd_frt_rate_cc") {
      this.Record.costd_frt_rate_cc = this.gs.roundNumber(this.Record.costd_frt_rate_cc, 3);
    }
    if (field == "costd_acd_rate_pp") {
      this.Record.costd_acd_rate_pp = this.gs.roundNumber(this.Record.costd_acd_rate_pp, 3);
    }
    if (field == "costd_acd_rate_cc") {
      this.Record.costd_acd_rate_cc = this.gs.roundNumber(this.Record.costd_acd_rate_cc, 3);
    }
    if (field == "costd_baf_rate_pp") {
      this.Record.costd_baf_rate_pp = this.gs.roundNumber(this.Record.costd_baf_rate_pp, 3);
    }
    if (field == "costd_baf_rate_cc") {
      this.Record.costd_baf_rate_cc = this.gs.roundNumber(this.Record.costd_baf_rate_cc, 3);
    }
    if (field == "costd_caf_rate_pp") {
      this.Record.costd_caf_rate_pp = this.gs.roundNumber(this.Record.costd_caf_rate_pp, 3);
    }
    if (field == "costd_caf_rate_cc") {
      this.Record.costd_caf_rate_cc = this.gs.roundNumber(this.Record.costd_caf_rate_cc, 3);
    }
    if (field == "costd_ddc_rate_pp") {
      this.Record.costd_ddc_rate_pp = this.gs.roundNumber(this.Record.costd_ddc_rate_pp, 3);
    }
    if (field == "costd_ddc_rate_cc") {
      this.Record.costd_ddc_rate_cc = this.gs.roundNumber(this.Record.costd_ddc_rate_cc, 3);
    }
    if (field == "costd_oth_rate_pp") {
      this.Record.costd_oth_rate_pp = this.gs.roundNumber(this.Record.costd_oth_rate_pp, 3);
    }
    if (field == "costd_oth_rate_cc") {
      this.Record.costd_oth_rate_cc = this.gs.roundNumber(this.Record.costd_oth_rate_cc, 3);
    }


    if (field == "costd_frt_pp") {
      this.Record.costd_frt_pp = this.gs.roundNumber(this.Record.costd_frt_pp, 3);
      this.FindTotal();
    }
    if (field == "costd_frt_cc") {
      this.Record.costd_frt_cc = this.gs.roundNumber(this.Record.costd_frt_cc, 3);
      this.FindTotal();
    }
    if (field == "costd_acd_pp") {
      this.Record.costd_acd_pp = this.gs.roundNumber(this.Record.costd_acd_pp, 3);
      this.FindTotal();
    }
    if (field == "costd_acd_cc") {
      this.Record.costd_acd_cc = this.gs.roundNumber(this.Record.costd_acd_cc, 3);
      this.FindTotal();
    }
    if (field == "costd_baf_pp") {
      this.Record.costd_baf_pp = this.gs.roundNumber(this.Record.costd_baf_pp, 3);
      this.FindTotal();
    }
    if (field == "costd_baf_cc") {
      this.Record.costd_baf_cc = this.gs.roundNumber(this.Record.costd_baf_cc, 3);
      this.FindTotal();
    }
    if (field == "costd_caf_pp") {
      this.Record.costd_caf_pp = this.gs.roundNumber(this.Record.costd_caf_pp, 3);
      this.FindTotal();
    }
    if (field == "costd_caf_cc") {
      this.Record.costd_caf_cc = this.gs.roundNumber(this.Record.costd_caf_cc, 3);
      this.FindTotal();
    }
    if (field == "costd_ddc_pp") {
      this.Record.costd_ddc_pp = this.gs.roundNumber(this.Record.costd_ddc_pp, 3);
      this.FindTotal();
    }
    if (field == "costd_ddc_cc") {
      this.Record.costd_ddc_cc = this.gs.roundNumber(this.Record.costd_ddc_cc, 3);
      this.FindTotal();
    }
    if (field == "costd_oth_pp") {
      this.Record.costd_oth_pp = this.gs.roundNumber(this.Record.costd_oth_pp, 3);
      this.FindTotal();
    }
    if (field == "costd_oth_cc") {
      this.Record.costd_oth_cc = this.gs.roundNumber(this.Record.costd_oth_cc, 3);
      this.FindTotal();
    }
    if (field == "costd_hbl_nomination") {
      this.Record.costd_hbl_nomination = this.Record.costd_hbl_nomination.toUpperCase(); 
    }
    if (field == "costd_hbl_terms") {
      this.Record.costd_hbl_terms = this.Record.costd_hbl_terms.toUpperCase();
    }
    if (field == "costd_pofd_name") {
      this.Record.costd_pofd_name = this.Record.costd_pofd_name.toUpperCase();
    }   
    if (field == "costd_cbm") {
      this.Record.costd_cbm = this.gs.roundNumber(this.Record.costd_cbm, 3);  
    }
    if (field == "costd_grwt") {
      this.Record.costd_grwt = this.gs.roundNumber(this.Record.costd_grwt, 3);
    }
    if (field == "costd_rebate") {
      this.Record.costd_rebate = this.gs.roundNumber(this.Record.costd_rebate, 3);
    }
    if (field == "costd_amenment_chrgs") {
      this.Record.costd_amenment_chrgs = this.gs.roundNumber(this.Record.costd_amenment_chrgs, 3);
    }
    if (field == "costd_fh_chrg_perhouse") {
      this.Record.costd_fh_chrg_perhouse = this.gs.roundNumber(this.Record.costd_fh_chrg_perhouse, 3);
    }
    if (field == "costd_oth_chrgs_ritra") {
      this.Record.costd_oth_chrgs_ritra = this.gs.roundNumber(this.Record.costd_oth_chrgs_ritra, 3);
    }
    if (field == "costd_ex_chrg_ritrahouse") {
      this.Record.costd_ex_chrg_ritrahouse = this.gs.roundNumber(this.Record.costd_ex_chrg_ritrahouse, 3);
    }
    if (field == "costd_consignee_group") {
      this.Record.costd_consignee_group = this.Record.costd_consignee_group.toUpperCase(); 
    }
    if (field == "costd_spl_incentive_rate") {
      this.Record.costd_spl_incentive_rate = this.gs.roundNumber(this.Record.costd_spl_incentive_rate, 3);
    }
    if (field == "costd_haulage_per_cbm") {
      this.Record.costd_haulage_per_cbm = this.gs.roundNumber(this.Record.costd_haulage_per_cbm, 3);
    }
    if (field == "costd_haulage_min_rate") {
      this.Record.costd_haulage_min_rate = this.gs.roundNumber(this.Record.costd_haulage_min_rate, 3);
    }
    if (field == "costd_haulage_wt_divider") {
      this.Record.costd_haulage_wt_divider = this.gs.roundNumber(this.Record.costd_haulage_wt_divider, 3);
    }
    if (field == "costd_destuff_pd") {
      this.Record.costd_destuff_pd = this.gs.roundNumber(this.Record.costd_destuff_pd, 3);
    }
    if (field == "costd_handling_fee") {
      this.Record.costd_handling_fee = this.gs.roundNumber(this.Record.costd_handling_fee, 3);
    }
    if (field == "costd_truck_cost") {
      this.Record.costd_truck_cost = this.gs.roundNumber(this.Record.costd_truck_cost, 3);
    }
    if (field == "costd_cntr_shifit") {
      this.Record.costd_cntr_shifit = this.gs.roundNumber(this.Record.costd_cntr_shifit, 3);
    }
    if (field == "costd_vessel_chrgs") {
      this.Record.costd_vessel_chrgs = this.gs.roundNumber(this.Record.costd_vessel_chrgs, 3);
    }
    if (field == "costd_ex_works") {
      this.Record.costd_ex_works = this.gs.roundNumber(this.Record.costd_ex_works, 3);
    }
  }


  FindTotal() {
 
    this.Record.costd_pp = this.Record.costd_frt_pp;
    this.Record.costd_pp += this.Record.costd_acd_pp;
    this.Record.costd_pp += this.Record.costd_baf_pp;
    this.Record.costd_pp += this.Record.costd_caf_pp;
    this.Record.costd_pp += this.Record.costd_ddc_pp;
    this.Record.costd_pp += this.Record.costd_oth_pp;
    this.Record.costd_pp = this.gs.roundNumber(this.Record.costd_pp, 3);

    this.Record.costd_cc = this.Record.costd_frt_cc;
    this.Record.costd_cc += this.Record.costd_acd_cc;
    this.Record.costd_cc += this.Record.costd_baf_cc;
    this.Record.costd_cc += this.Record.costd_caf_cc;
    this.Record.costd_cc += this.Record.costd_ddc_cc;
    this.Record.costd_cc += this.Record.costd_oth_cc;
    this.Record.costd_cc = this.gs.roundNumber(this.Record.costd_cc, 3);

    this.Record.costd_tot = this.Record.costd_pp + this.Record.costd_cc;
    this.Record.costd_tot = this.gs.roundNumber(this.Record.costd_tot, 3);
  }

  Close() {
    if (this.ModifiedEditorRecords != null)
      this.ModifiedEditorRecords.emit({ saction: "CLOSE", sid: this.pkid });
  }

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new Costingd();
    this.Record.costd_pkid = this.pkid;
    this.Record.costd_parent_id = "";
    this.Record.costd_category = "INVOICE";
    this.Record.costd_blno = "";
    this.Record.costd_acc_name = "";
    this.Record.costd_acc_qty = 0;
    this.Record.costd_acc_rate = 0;
    this.Record.costd_acc_amt = 0;
  }

  Save() {
    if (this.ModifiedEditorRecords != null) {
      this.mRecord.costd_pkid = this.Record.costd_pkid;
      this.mRecord.costd_parent_id = this.Record.costd_parent_id;
      this.mRecord.costd_acc_id = this.Record.costd_acc_id;
      this.mRecord.costd_type = this.Record.costd_type;
      this.mRecord.costd_sino = this.Record.costd_sino;
      this.mRecord.costd_shipper_name = this.Record.costd_shipper_name;
      this.mRecord.costd_consignee_name = this.Record.costd_consignee_name;
      this.mRecord.costd_consignee_group = this.Record.costd_consignee_group;
      this.mRecord.costd_hbl_nomination = this.Record.costd_hbl_nomination;
      this.mRecord.costd_hbl_terms = this.Record.costd_hbl_terms;
      this.mRecord.costd_pofd_name = this.Record.costd_pofd_name;
      this.mRecord.costd_grwt = this.Record.costd_grwt;
      this.mRecord.costd_chwt = this.Record.costd_chwt;
      this.mRecord.costd_frt_pp = this.Record.costd_frt_pp;
      this.mRecord.costd_frt_cc = this.Record.costd_frt_cc;
      this.mRecord.costd_frt_rate_pp = this.Record.costd_frt_rate_pp;
      this.mRecord.costd_frt_rate_cc = this.Record.costd_frt_rate_cc;
      this.mRecord.costd_baf_pp = this.Record.costd_baf_pp;
      this.mRecord.costd_baf_cc = this.Record.costd_baf_cc;
      this.mRecord.costd_baf_rate_pp = this.Record.costd_baf_rate_pp;
      this.mRecord.costd_baf_rate_cc = this.Record.costd_baf_rate_cc;
      this.mRecord.costd_caf_pp = this.Record.costd_caf_pp;
      this.mRecord.costd_caf_cc = this.Record.costd_caf_cc;
      this.mRecord.costd_caf_rate_pp = this.Record.costd_caf_rate_pp;
      this.mRecord.costd_caf_rate_cc = this.Record.costd_caf_rate_cc;
      this.mRecord.costd_ddc_pp = this.Record.costd_ddc_pp;
      this.mRecord.costd_ddc_cc = this.Record.costd_ddc_cc;
      this.mRecord.costd_ddc_rate_pp = this.Record.costd_ddc_rate_pp;
      this.mRecord.costd_ddc_rate_cc = this.Record.costd_ddc_rate_cc;
      this.mRecord.costd_acd_pp = this.Record.costd_acd_pp;
      this.mRecord.costd_acd_cc = this.Record.costd_acd_cc;
      this.mRecord.costd_acd_rate_pp = this.Record.costd_acd_rate_pp;
      this.mRecord.costd_acd_rate_cc = this.Record.costd_acd_rate_cc;
      this.mRecord.costd_oth_pp = this.Record.costd_oth_pp;
      this.mRecord.costd_oth_cc = this.Record.costd_oth_cc;
      this.mRecord.costd_oth_rate_pp = this.Record.costd_oth_rate_pp;
      this.mRecord.costd_oth_rate_cc = this.Record.costd_oth_rate_cc;
      this.mRecord.costd_pp = this.Record.costd_pp;
      this.mRecord.costd_cc = this.Record.costd_cc;
      this.mRecord.costd_tot = this.Record.costd_tot;
      this.mRecord.costd_blno = this.Record.costd_blno;
      this.mRecord.costd_ctr = this.Record.costd_ctr;
      this.mRecord.costd_category = this.Record.costd_category;
      this.mRecord.costd_cbm = this.Record.costd_cbm;
      this.mRecord.costd_actual_cbm = this.Record.costd_actual_cbm;
      this.mRecord.costd_rebate = this.Record.costd_rebate;
      this.mRecord.costd_amenment_chrgs = this.Record.costd_amenment_chrgs;
      this.mRecord.costd_seal_chrgs = this.Record.costd_seal_chrgs;
      this.mRecord.costd_consignee_group = this.Record.costd_consignee_group;
      this.mRecord.costd_hbl_nomination = this.Record.costd_hbl_nomination;
      this.mRecord.costd_hbl_terms = this.Record.costd_hbl_terms;
      this.mRecord.costd_incentive_rate = this.Record.costd_incentive_rate;
      this.mRecord.costd_fh_rate1 = this.Record.costd_fh_rate1;
      this.mRecord.costd_fh_limit1 = this.Record.costd_fh_limit1;
      this.mRecord.costd_fh_rate2 = this.Record.costd_fh_rate2;
      this.mRecord.costd_fh_limit2 = this.Record.costd_fh_limit2;
      this.mRecord.costd_fh_rate3 = this.Record.costd_fh_rate3
      this.mRecord.costd_fh_limit3 = this.Record.costd_fh_limit3;
      this.mRecord.costd_pofd_name = this.Record.costd_pofd_name;
      this.mRecord.costd_oth_chrgs_ritra = this.Record.costd_oth_chrgs_ritra;
      this.mRecord.costd_incentive_notreceived = this.Record.costd_incentive_notreceived;
      this.mRecord.costd_fh_chrg_perhouse = this.Record.costd_fh_chrg_perhouse;
      this.mRecord.costd_spl_incentive_rate = this.Record.costd_spl_incentive_rate;
      this.mRecord.costd_house_notinclude = this.Record.costd_house_notinclude;
      this.mRecord.costd_ex_chrg_ritrahouse = this.Record.costd_ex_chrg_ritrahouse;
      this.mRecord.costd_haulage_per_cbm = this.Record.costd_haulage_per_cbm;
      this.mRecord.costd_haulage_min_rate = this.Record.costd_haulage_min_rate;
      this.mRecord.costd_haulage_wt_divider = this.Record.costd_haulage_wt_divider;
      this.mRecord.costd_destuff_pd = this.Record.costd_destuff_pd;
      this.mRecord.costd_handling_fee = this.Record.costd_handling_fee;
      this.mRecord.costd_truck_cost = this.Record.costd_truck_cost;
      this.mRecord.costd_cntr_shifit = this.Record.costd_cntr_shifit;
      this.mRecord.costd_vessel_chrgs = this.Record.costd_vessel_chrgs;
      this.mRecord.costd_ex_works = this.Record.costd_ex_works;
      this.ModifiedEditorRecords.emit({ saction: "SAVE", sid: this.pkid });
    }

  }
}
