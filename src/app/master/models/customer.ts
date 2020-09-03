
import { GlobalVariables } from '../../core/models/globalvariables';

import { Addressm } from './addressm';

export class Customerm {
    cust_pkid: string;
    cust_code: string;
    cust_name: string;

    cust_group: string;

    cust_iecode: string;
    cust_panno: string;
    cust_tanno: string;
    cust_type: string;
    cust_class: string;
    cust_sman_id: string;
    cust_sman_name: string;
    cust_csd_id: string;
    cust_csd_name: string;
    cust_kyc_status: string;

    cust_crdays: number;
    cust_crlimit: number;
    cust_crdate: string;

    cust_branch_code: string;

    cust_linked: boolean;

    cust_sepz_unit: boolean;

    cust_is_agent: boolean;
    cust_is_shipper: boolean;
    cust_is_ungst: boolean;
    cust_is_consignee: boolean;
    cust_is_cha: boolean;
    cust_is_others: boolean;
    cust_is_creditor: boolean;
    cust_is_foreigner: boolean;

    cust_nomination: string;

    cust_referdby: string;

    cust_dbkacno: string;
    cust_adcode: string;
    cust_bank: string;
    cust_bank_branch: string;
    cust_acno: string;
    cust_forexacno: string;
    cust_bank_address1: string;
    cust_bank_address2: string;
    cust_bank_address3: string;
    cust_docs: number;

    acc_group_id: string;
    acc_type_id: string;
    acc_against_invoice: string;

    cust_remarks: string;
    cust_country: string;
    cust_is_incomplete: boolean;
    cust_incomplete_remarks: string;
    cust_is_complete: string;
    cust_is_editable: boolean;
    cust_branch_remarks: string;

    rec_mode: string;

    rec_locked: boolean = false;
    rec_created_by: string;
    rec_created_date: string;
    rec_aprvd_by: string;
    rec_aprvd_date: string;

    cust_pan_status: string;
    cust_tan_status: string;
    cust_auth_status: string;
    cust_gst_status: string;
    cust_iec_status: string;
    cust_uploaded_docs: string;
    cust_caseno: string;
    cust_alert: boolean;
    
    _globalvariables: GlobalVariables;

    AddressList: Addressm[] = [];

}

