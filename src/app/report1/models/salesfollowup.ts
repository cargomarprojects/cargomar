
import { GlobalVariables } from '../../core/models/globalvariables';

export class SalesFollowup {
    row_type: string;
    row_colour: string;
    report_date: string;
    report_created_date: string;
    report_created_by: string;
    report_remarks: string;
    pkid: string;
    branch: string;
    brcode: string;
    sman_name: string;
    party_name: string;
    op: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
    jan: number;
    feb: number;
    mar: number;
    bal: number;
    adv: number;
    arratio: number;
    osdays_ratio: number;
    acd: number;
    sales: number;
    cust_crdays: number;
    cust_crlimit: number;
    cust_billed_date: string;
    cust_payment_date: string;

    fin_year_name: string;
    row_displayed: boolean;
    row_checked: boolean;
    row_updated: string;
    row_updated_by: string;
    uid: string;
    _globalvariables: GlobalVariables;
}
