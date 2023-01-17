import { GlobalVariables } from '../../core/models/globalvariables';
export class Qtnm {
    qtnm_pkid: string;
    qtnm_cfno: number;
    qtnm_no: string;
    qtnm_to_id: string;
    qtnm_to_code: string;
    qtnm_to_name: string;
    qtnm_to_addr1: string;
    qtnm_to_addr2: string;
    qtnm_to_addr3: string;
    qtnm_to_addr4: string;
    qtnm_date: string;
    qtnm_quot_by: string;
    qtnm_valid_date: string;
    qtnm_salesman_id: string;
    qtnm_salesman_name: string;
    qtnm_move_type: string;
    qtnm_por_id: string;
    qtnm_por_code: string;
    qtnm_por_name: string;
    qtnm_pol_id: string;
    qtnm_pol_code: string;
    qtnm_pol_name: string;
    qtnm_pod_id: string;
    qtnm_pod_code: string;
    qtnm_pod_name: string;
    qtnm_pld_name: string;
    qtnm_plfd_name: string;
    qtnm_commodity: string;
    qtnm_package: string;
    qtnm_type: string;
    qtnm_kgs: number;
    qtnm_lbs: number;
    qtnm_cbm: number;
    qtnm_cft: number;
    qtnm_tot_amt: number;
    qtnm_subjects: string;
    qtnm_remarks: string;
    qtnm_office_use: string;
    rec_files_attached: string;
    qtnm_transtime: string;
    qtnm_routing: string;
    qtnm_curr_code: string;

    qtnm_detList: QtndLcl[] = [];

    _globalvariables: GlobalVariables;
}

// export class QtndLcl {

//     qtnd_pkid: string;
//     qtnd_parent_id: string;
//     qtnd_desc_id: string;
//     qtnd_desc_code: string;
//     qtnd_desc_name: string;
//     qtnd_amt: number;
//     qtnd_per: string;
//     qtnd_transtime: string;
//     qtnd_routing: string;
//     qtnd_order: number;
//     qtnd_old_pkid: string;
//     qtnd_old_amt: number;

//     globalvariables: GlobalVariables;
// }

export class QtndLcl {
    qtnd_pkid: string;
  
    qtnd_parent_id: string;
  
    qtnd_type: string;
  
    qtnd_acc_id: string;
    qtnd_acc_code: string;
    qtnd_acc_name: string;
    qtnd_acc_main_code: string;
  
    qtnd_cntr_type_id: string;
    qtnd_cntr_type_code: string;
    
    qtnd_curr_id: string;
    qtnd_curr_code: string;
  
    qtnd_qty: number;
    qtnd_rate: number;
    qtnd_exrate: number;
    qtnd_total: number;
    qtnd_remarks: string;
    qtnd_category: string;
    rec_mode: string;
  }
