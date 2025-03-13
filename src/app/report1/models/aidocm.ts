
export class AiDocm {

    ai_pkid: string;
    ai_from_id: string;
    ai_to_id: string;
    ai_folder: string;
    ai_subfolder: string;
    ai_type: string;
    ai_bucket: string;
    ai_subject: string;
    ai_secret: string;
    rec_created_date: string;
    rec_mode: string;
}

export interface iAiDocmModel {
    // filter Values
    selectedRowIndex: number;
    RecordList: AiDocm[];
    ErrorMessage: string;
    // header search Values
    type: string;
    searchstring: string;
    // Page Values
    page_count: number;
    page_current: number;
    page_rows: number;
    page_rowcount: number;
};

export const initialState: iAiDocmModel = {
    selectedRowIndex: 0,
    RecordList: [],
    ErrorMessage: '',
    type: '',
    searchstring: '',
    page_count: 0,
    page_current: 0,
    page_rows: 15,
    page_rowcount: 0
}