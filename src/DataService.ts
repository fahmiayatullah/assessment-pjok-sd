import { supabase } from './supabase';
import type { Assessment, Question, Session, Answer, TokenItem, QuestionItem } from './types/database';

export class SupabaseDataService {
  /**
   * Fetch all assessments ordered by creation date
   */
  async getAssessments(): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments from Supabase:', error);
      throw error;
    }
    return data || [];
  }

  /**
   * Create a new assessment with its questions
   */
  async createAssessment(
    title: string,
    description: string,
    questions: QuestionItem[]
  ): Promise<Assessment> {
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

    if (assError) {
      console.error('Error creating assessment in Supabase:', assError);
      throw assError;
    }

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
        console.warn('Questions table insert warning (jsonb preserved in assessments):', qError.message);
      }
    } catch (e) {
      console.warn('Could not insert rows to questions table:', e);
    }

    return assessment;
  }

  /**
   * Create and register a reusable exam token
   */
  async createToken(assessmentId: number): Promise<TokenItem> {
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Try inserting into tokens table if it exists
    const { data, error } = await supabase
      .from('tokens')
      .insert({ token, assessment_id: assessmentId })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Notice: `tokens` table not available, using local token cache:', error.message);
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
  }

  /**
   * Get all tokens for a given assessment
   */
  async getTokens(assessmentId: number): Promise<TokenItem[]> {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback to local storage or unique tokens found in sessions
      const stored: TokenItem[] = JSON.parse(localStorage.getItem('pjok_tokens') || '[]');
      const filtered = stored.filter(t => t.assessment_id === assessmentId);
      if (filtered.length > 0) return filtered;

      // Extract tokens from existing sessions
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
  }

  /**
   * Retrieve assessment and questions by examination token
   */
  async getAssessmentByToken(token: string): Promise<{ token: string; assessment_id: number; assessment: Assessment }> {
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
      console.error('Error fetching assessment by token from Supabase:', assError);
      throw new Error('Assessment tidak ditemukan.');
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

    if (error) {
      console.error('Error creating student session in Supabase:', error);
      throw error;
    }

    return data;
  }

  /**
   * Fetch all student sessions for a given assessment
   */
  async getSessions(assessmentId: number): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions from Supabase:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Save or update student answer for a question
   */
  async saveAnswer(sessionId: string, questionId: number, selectedOption: number): Promise<Answer | null> {
    const payload = {
      session_id: sessionId,
      question_id: questionId,
      selected_option: selectedOption
    };

    // Use .upsert() as requested
    const { data, error } = await supabase
      .from('answers')
      .upsert(payload, { onConflict: 'session_id,question_id' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Upsert onConflict error, attempting fallback update/insert:', error.message);
      // Fallback if there is no unique constraint on (session_id, question_id)
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

        if (updateError) {
          console.error('Error updating answer in Supabase:', updateError);
          throw updateError;
        }
        return updated;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('answers')
          .insert(payload)
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Error inserting answer in Supabase:', insertError);
          throw insertError;
        }
        return inserted;
      }
    }

    return data;
  }

  /**
   * Submit student assessment and record final score
   */
  async submitAssessment(sessionId: string, score: number): Promise<Session> {
    // Payload strictly matching schema requirements
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

    if (error) {
      console.error('Error submitting assessment in Supabase:', error);
      throw error;
    }

    return data;
  }
}

// Export singleton instance initialized with Supabase client
export const dataService = new SupabaseDataService();
