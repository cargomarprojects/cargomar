
export class AiDocm {

    ai_pkid: string;
    ai_date: string;
    ai_from_id: string;
    ai_to_id: string;
    ai_folder: string;
    ai_subfolder: string;
    ai_type: string;
    ai_bucket: string;
    ai_subject: string;
    ai_secret: string;
    ai_status: string;
    ai_hitl: string;
    rec_created_date: string;
    rec_mode: string;
    rec_displayed: boolean;
    Details: AiDocd[] = [];
}

export class AiDocd {
    aid_pkid: string;
    aid_parent_id: string;
    aid_folder: string;
    aid_file_name: string;
    aid_doc_type: string;
    aid_classified: string;
    aid_extracted: string;
}

export interface iAiDocmModel {
    // filter Values
    selectedRowIndex: number;
    RecordList: AiDocm[];
    RecordDetList: AiDocd[];
    ErrorMessage: string;
    // header search Values
    type: string;
    searchtype: string;
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
    RecordDetList: [],
    ErrorMessage: '',
    type: '',
    searchtype: '',
    searchstring: '',
    page_count: 0,
    page_current: 0,
    page_rows: 15,
    page_rowcount: 0
}