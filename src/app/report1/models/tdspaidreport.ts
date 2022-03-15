export class TdsPaidReport {
    row_type: string;
    row_colour: string;
    branch_code: string;
    jv_pkid: string;
    jv_vrno: string;
    jv_type: string;
    jv_date: string;
    jv_credit: number;
    party_code: string;
    party_name: string;
    tan_id: string;
    tan_code: string;
    tan_name: string;
    tds_cert_no: string;
    tds_cert_qtr: string;
    cert_recvd_at: string;
    gross_bill_amt: number;
    gross_cert_amt: number;
    tds_amt: number;
    cert_amt: number;
    cert_alloc_amt: number;
    pending_amt: number;
    displayed: boolean;

    branch_count: number;
    cert_count: number;
    tds_26_amt: number;
    tds_cert_amt: number;
    tds_paid_amt: number;
    diff_26as_cert: number;
    cert_26as_status: string;
    diff_26as_tdspaid: number;
    paid_26as_status: string;
    diff_cert_tdspaid: number;
    cert_paid_status: string;
    status: string;
    tds_doc_count:number;
    rec_created_by:string;
    rec_created_date:string;

}