import { GlobalVariables } from '../../core/models/globalvariables';

export class Gstr2bDownload {
    row_type: string;
    row_color: string;
    row_color2: string;
    pkid: string;
    gstr1_period: string;
    gstin_supplier: string;
    trade_legal_name: string;
    invoice_number: string;
    invoice_type: string;
    note_type: string;
    invoice_date: string;
    invoice_ref_date: string;
    invoice_value: number;
    place_supply: string;
    reverse_charge: string;
    rate: number;
    taxable_value: number;
    integrated_tax: number;
    central_tax: number;
    state_ut_tax: number;
    cess: string;
    gstr1_filing_date: string;
    itc_availability: string;
    reason: string;
    applicable_per_taxrate: string;
    source: string;
    irn: string;
    irn_date: string;
    download_type: string;
    download_file_id: string;
    download_source: string;
    download_period: number;
    download_state_code: string;
    purchase_id: string;
    purchase_period: string;
    tot_rows: number;
    gstr2b_id: string;
    gstr2b_period: string;

    p_match_id: string;
    p_gstin_supplier: string;
    p_customer: string;
    p_gstr1_period: string;
    p_invoice_number: string;
    p_invoice_date: string;
    p_invoice_ref_date: string;
    p_reverse_charge: string;
    p_invoice_amt: number;
    p_taxable_amt: number;
    p_rate: number;
    p_igst_amt: number;
    p_cgst_amt: number;
    p_sgst_amt: number;
    g_match_id: string;
    g_gstin_supplier: string;
    g_customer: string;
    g_gstr1_period: string;
    g_invoice_number: string;
    g_invoice_date: string;
    g_invoice_ref_date: string;
    g_reverse_charge: string;
    g_invoice_amt: number;
    g_taxable_amt: number;
    g_rate: number;
    g_igst_amt: number;
    g_cgst_amt: number;
    g_sgst_amt: number;
    display_order: string;
    match_gst: string;
    match_period: string;
    reconcile_status: string;
    doc_vrno: string;
    rec_selected: boolean;
    rec_displayed: boolean;
    supplier_name: string;
    supplier_state: string;
    purchase_count: number;
    gstr2b_count: number;
    matched_count: number;
    tot_gst_purchase: number;
    tot_gst_gstr2b: number;
    gst_diff: number;
    claim_status: string;
    display_claimed_period: string;

    org_invoice_number: string;
    org_invoice_type: string;
    org_invoice_date: string;
    claim_created_by: string;
    claim_created_date: string;
    display_download_period: string;

    integrated_tax_actual: number;
    central_tax_actual: number;
    state_ut_tax_actual: number;
    gst_bal: number;
    rec_status: string;
    rec_category: string;

}

export interface iGstr2bDownloadModel {
    // filter Values
    gst_recon_searchstring: string;
    gst_recon_state_code: string;
    gst_recon_state_name: string;
    gst_recon_month: string;
    gst_recon_year: string;
    gst_recon_round_off: number;

    gst_recon_cdnr_searchstring: string;
    gst_recon_cdnr_state_code: string;
    gst_recon_cdnr_state_name: string;
    gst_recon_cdnr_month: string;
    gst_recon_cdnr_year: string;
    gst_recon_cdnr_round_off: number;

    gst_recon_rc_searchstring: string;
    gst_recon_rc_state_code: string;
    gst_recon_rc_state_name: string;
    gst_recon_rc_month: string;
    gst_recon_rc_year: string;
    gst_recon_rc_round_off: number;

    gst_recon_ament_searchstring: string;
    gst_recon_ament_state_code: string;
    gst_recon_ament_state_name: string;
    gst_recon_ament_month: string;
    gst_recon_ament_year: string;

    gst_recon_itc_searchstring: string;
    gst_recon_itc_state_code: string;
    gst_recon_itc_state_name: string;
    gst_recon_itc_month: string;
    gst_recon_itc_year: string;
    gst_recon_itc_status: string;
    gst_recon_itc_claim_status: string;
    gst_recon_itc_claim_period: string;
    gst_recon_itc_list_state_code: string;
    gst_recon_itc_list_state_name: string;
    gst_recon_itc_list_month: string;
    gst_recon_itc_list_year: string;
    gst_recon_itc_chk_notclaimed: boolean;

    RecordListReco: Gstr2bDownload[];
    RecordListItc: Gstr2bDownload[];
    RecordListCdnr: Gstr2bDownload[];
    RecordListRc: Gstr2bDownload[];
    RecordListAment: Gstr2bDownload[];
};

export const initialState: iGstr2bDownloadModel = {
    gst_recon_searchstring: '',
    gst_recon_state_code: '',
    gst_recon_state_name: '',
    gst_recon_month: '',
    gst_recon_year: '',
    gst_recon_round_off: 5,
    gst_recon_cdnr_searchstring: '',
    gst_recon_cdnr_state_code: '',
    gst_recon_cdnr_state_name: '',
    gst_recon_cdnr_month: '',
    gst_recon_cdnr_year: '',
    gst_recon_cdnr_round_off: 5,
    gst_recon_rc_searchstring: '',
    gst_recon_rc_state_code: '',
    gst_recon_rc_state_name: '',
    gst_recon_rc_month: '',
    gst_recon_rc_year: '',
    gst_recon_rc_round_off: 5,
    gst_recon_ament_searchstring: '',
    gst_recon_ament_state_code: '',
    gst_recon_ament_state_name: '',
    gst_recon_ament_month: '',
    gst_recon_ament_year: '',
    gst_recon_itc_searchstring: '',
    gst_recon_itc_state_code: '',
    gst_recon_itc_state_name: '',
    gst_recon_itc_month: '',
    gst_recon_itc_year: '',
    gst_recon_itc_status: 'MATCHED',
    gst_recon_itc_claim_status: 'ITC AVAILED',
    gst_recon_itc_claim_period: '',
    gst_recon_itc_list_state_code: '',
    gst_recon_itc_list_state_name: '',
    gst_recon_itc_list_month: '',
    gst_recon_itc_list_year: '',
    gst_recon_itc_chk_notclaimed: true,
    RecordListReco: [],
    RecordListItc: [],
    RecordListCdnr: [],
    RecordListRc: [],
    RecordListAment: []
} 