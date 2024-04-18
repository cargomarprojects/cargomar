import { GlobalVariables } from '../../core/models/globalvariables';

export class Gstr2bDownload {
    row_type: string;
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
}