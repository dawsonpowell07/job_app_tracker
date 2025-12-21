export type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "ghosted";

export interface Application {
  job_title?: string;
  company?: string;
  pay?: number;
  location?: string;
  resume_used?: string;
  resume_id?: string;
  job_url?: string;
  status: ApplicationStatus;
  id?: string;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  s3_key: string;
  upload_status: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AddApplicationInterface {
  job_title: string;
  company: string;
  status?: ApplicationStatus;
  pay?: number;
  location?: string;
  job_url?: string;
  resume_used?: string;
}

export interface ApplicationAgentState {
    currentView: "cardsView" | "excelView";
  };