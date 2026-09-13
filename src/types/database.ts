export interface Assessment {
  id: number;
  created_at?: string;
  title: string;
  description?: string | null;
  questions?: QuestionItem[] | any;
}

export interface QuestionItem {
  id?: number | string;
  text: string;
  options: string[];
  correct_option?: number;
  correctOption?: number;
}

export interface Question {
  id: number;
  assessment_id: number;
  created_at?: string;
  text: string;
  options: string[] | any;
  correct_option: number;
}

export interface Session {
  id: string; // uuid
  created_at?: string;
  assessment_id: number;
  token: string;
  student_name: string;
  student_class: string;
  status: string;
  score: number | null;
  is_completed: boolean;
  end_time?: string | null;
  submitted_at?: string | null;
  assessment?: Assessment;
}

export interface Answer {
  id?: string; // uuid
  session_id: string; // uuid
  question_id: number; // int8
  selected_option: number; // int4
  created_at?: string;
}

export interface TokenItem {
  id?: string | number;
  token: string;
  assessment_id: number;
  created_at?: string;
}
