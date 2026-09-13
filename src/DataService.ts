import { supabase, isSupabaseConfigured } from './supabase';
import type { Assessment, Question, Session, Answer, TokenItem, QuestionItem } from './types/database';

export class SupabaseDataService {
  private ensureConfigured(): void {
    if (!isSupabaseConfigured) {
      const msg = 'Koneksi Supabase belum terkonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah ditambahkan pada Environment Variables Vercel.';
      console.error('[SupabaseDataService]', msg);
      throw new Error(msg);
    }
  }

  private handleNetworkError(err: any, actionName: string): Error {
    console.error(`[SupabaseDataService] Error pada ${actionName}:`, err);
    if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError') || err?.name === 'TypeError') {
      return new Error(
        'Gagal menghubungi server Supabase (Failed to fetch). Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diisi pada Environment Variables Vercel.'
      );
    }
    return new Error(err?.message || 'Terjadi kesalahan saat memproses data.');
  }

  /**
   * Fetch all assessments ordered by creation date
   */
  async getAssessments(): Promise<Assessment[]> {
    this.ensureConfigured();
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      throw this.handleNetworkError(err, 'getAssessments');
    }
  }

  /**
   * Create a new assessment with its questions
   */
  async createAssessment(
    title: string,
    description: string,
    questions: QuestionItem[]
  ): Promise<Assessment> {
    this.ensureConfigured();
    try {
      const formattedQuestions = questions.map((q, idx) => ({
        ...q,
        id: q.id || idx + 1,
        correct_option: q.correctOption !== undefined ? q.correctOption : q.correct_option ?? 0
      }));

      // 1. Insert assessment record with JSONB questions
      const { data: assessment, error: assError } = await supabase
        .from('assessments')
        .insert({
          title,
          description: description || null,
          questions: formattedQuestions
        })
        .select()
        .single();

      if (assError) throw assError;

      // 2. Also insert into questions table for relational schema compatibility
      try {
        const questionRows = formattedQuestions.map(q => ({
          assessment_id: assessment.id,
          text: q.text,
          options: q.options,
          correct_option: q.correct_option
        }));

        const { error: qError } = await supabase
          .from('questions')
          .insert(questionRows);

        if (qError) {
          console.warn('[SupabaseDataService] Questions relational insert warning:', qError.message);
        }
      } catch (e) {
        console.warn('[SupabaseDataService] Could not insert rows to questions table:', e);
      }

      return assessment;
    } catch (err: any) {
      throw this.handleNetworkError(err, 'createAssessment');
    }
  }

  /**
   * Create and register a reusable exam token
   */
  async createToken(assessmentId: number): Promise<TokenItem> {
    this.ensureConfigured();
    try {
      const token = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Try inserting into tokens table
      const { data, error } = await supabase
        .from('tokens')
        .insert({ token, assessment_id: assessmentId })
        .select()
        .maybeSingle();

      if (error) {
        console.warn('[SupabaseDataService] Tokens table insert warning, using local cache:', error.message);
        const fallbackToken: TokenItem = {
          id: Date.now(),
          token,
          assessment_id: assessmentId,
          created_at: new Date().toISOString()
        };
        const stored = JSON.parse(localStorage.getItem('pjok_tokens') || '[]');
        localStorage.setItem('pjok_tokens', JSON.stringify([fallbackToken, ...stored]));
        return fallbackToken;
      }

      return data || { token, assessment_id: assessmentId };
    } catch (err: any) {
      throw this.handleNetworkError(err, 'createToken');
    }
  }

  /**
   * Get all tokens for a given assessment
   */
  async getTokens(assessmentId: number): Promise<TokenItem[]> {
    this.ensureConfigured();
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback to local storage or sessions
        const stored: TokenItem[] = JSON.parse(localStorage.getItem('pjok_tokens') || '[]');
        const filtered = stored.filter(t => t.assessment_id === assessmentId);
        if (filtered.length > 0) return filtered;

        const sessions = await this.getSessions(assessmentId);
        const tokenMap = new Map<string, TokenItem>();
        sessions.forEach(s => {
          if (s.token && !tokenMap.has(s.token)) {
            tokenMap.set(s.token, {
              id: s.id,
              token: s.token,
              assessment_id: s.assessment_id,
              created_at: s.created_at
            });
          }
        });
        return Array.from(tokenMap.values());
      }

      return data || [];
    } catch (err: any) {
      throw this.handleNetworkError(err, 'getTokens');
    }
  }

  /**
   * Retrieve assessment and questions by examination token
   */
  async getAssessmentByToken(token: string): Promise<{ token: string; assessment_id: number; assessment: Assessment }> {
    this.ensureConfigured();
    try {
      let assessmentId: number | null = null;

      // 1. Check tokens table
      const { data: tokenRecord } = await supabase
        .from('tokens')
        .select('assessment_id, token')
        .eq('token', token)
        .maybeSingle();

      if (tokenRecord?.assessment_id) {
        assessmentId = tokenRecord.assessment_id;
      } else {
        // 2. Check sessions table
        const { data: sessionRecord } = await supabase
          .from('sessions')
          .select('assessment_id, token')
          .eq('token', token)
          .maybeSingle();

        if (sessionRecord?.assessment_id) {
          assessmentId = sessionRecord.assessment_id;
        } else {
          // 3. Check local cache
          const stored: TokenItem[] = JSON.parse(localStorage.getItem('pjok_tokens') || '[]');
          const found = stored.find(t => t.token.toUpperCase() === token.toUpperCase());
          if (found) {
            assessmentId = found.assessment_id;
          }
        }
      }

      if (!assessmentId) {
        throw new Error('Token tidak valid atau ujian tidak ditemukan.');
      }

      // Fetch assessment
      const { data: assessment, error: assError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (assError || !assessment) {
        throw new Error('Assessment tidak ditemukan di database.');
      }

      // Try fetching questions from questions table
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('id', { ascending: true });

      const finalQuestions = questions && questions.length > 0 ? questions : assessment.questions || [];

      return {
        token,
        assessment_id: assessmentId,
        assessment: {
          ...assessment,
          questions: finalQuestions
        }
      };
    } catch (err: any) {
      throw this.handleNetworkError(err, 'getAssessmentByToken');
    }
  }

  /**
   * Create a new student examination session
   */
  async createStudentSession(
    token: string,
    assessmentId: number,
    studentName: string,
    studentClass: string
  ): Promise<Session> {
    this.ensureConfigured();
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          token,
          assessment_id: assessmentId,
          student_name: studentName,
          student_class: studentClass,
          status: 'active',
          is_completed: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      throw this.handleNetworkError(err, 'createStudentSession');
    }
  }

  /**
   * Fetch all student sessions for a given assessment
   */
  async getSessions(assessmentId: number): Promise<Session[]> {
    this.ensureConfigured();
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      throw this.handleNetworkError(err, 'getSessions');
    }
  }

  /**
   * Save or update student answer for a question
   */
  async saveAnswer(sessionId: string, questionId: number, selectedOption: number): Promise<Answer | null> {
    this.ensureConfigured();
    try {
      const payload = {
        session_id: sessionId,
        question_id: questionId,
        selected_option: selectedOption
      };

      // Primary attempt: upsert with unique conflict
      const { data, error } = await supabase
        .from('answers')
        .upsert(payload, { onConflict: 'session_id,question_id' })
        .select()
        .maybeSingle();

      if (error) {
        console.warn('[SupabaseDataService] Upsert conflict warning, fallback update/insert:', error.message);
        const { data: existing } = await supabase
          .from('answers')
          .select('id')
          .eq('session_id', sessionId)
          .eq('question_id', questionId)
          .maybeSingle();

        if (existing?.id) {
          const { data: updated, error: updateError } = await supabase
            .from('answers')
            .update({ selected_option: selectedOption })
            .eq('id', existing.id)
            .select()
            .maybeSingle();

          if (updateError) throw updateError;
          return updated;
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from('answers')
            .insert(payload)
            .select()
            .maybeSingle();

          if (insertError) throw insertError;
          return inserted;
        }
      }

      return data;
    } catch (err: any) {
      throw this.handleNetworkError(err, 'saveAnswer');
    }
  }

  /**
   * Submit student assessment and record final score
   */
  async submitAssessment(sessionId: string, score: number): Promise<Session> {
    this.ensureConfigured();
    try {
      const payload = {
        score: score,
        is_completed: true,
        status: 'completed',
        submitted_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('sessions')
        .update(payload)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      throw this.handleNetworkError(err, 'submitAssessment');
    }
  }
}

export const dataService = new SupabaseDataService();
