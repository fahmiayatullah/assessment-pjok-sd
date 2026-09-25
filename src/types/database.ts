export interface Assessment {
  id: number;
  created_at?: string;
  title: string;
  description?: string | null;
  class_name?: string | null;
  questions?: QuestionItem[] | any;
}

export interface QuestionItem {
  id?: number | string;
  text: string;
  options: string[];
  correct_option?: number;
  correctOption?: number;
  points?: number;
}

export interface Question {
  id: number;
  assessment_id: number;
  created_at?: string;
  text: string;
  options: string[] | any;
  correct_option: number;
  points?: number;
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
  total_correct?: number;
  total_incorrect?: number;
  total_questions?: number;
  duration_text?: string;
}

export interface Answer {
  id?: string; // uuid
  session_id: string; // uuid
  question_id: number; // int8
  selected_option: number; // int4
  is_correct?: boolean;
  points?: number;
  created_at?: string;
}

export interface TokenItem {
  id?: string | number;
  token: string;
  assessment_id: number;
  created_at?: string;
}

export interface QuestionAnswerDetail {
  question_number: number;
  question_id: number | string;
  question_text: string;
  options: string[];
  selected_option: number | null;
  selected_text: string;
  correct_option: number;
  correct_text: string;
  is_correct: boolean;
  points: number;
  max_points: number;
}

export interface StudentSubmissionDetail {
  session_id: string;
  student_name: string;
  student_class: string;
  assessment_title: string;
  assessment_id: number;
  token: string;
  score: number;
  total_questions: number;
  total_correct: number;
  total_incorrect: number;
  start_time: string;
  end_time: string;
  duration_text: string;
  date_formatted: string;
  items: QuestionAnswerDetail[];
}

