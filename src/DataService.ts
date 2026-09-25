import { supabase, isSupabaseConfigured } from './supabase';
import type { 
  Assessment, 
  Question, 
  Session, 
  Answer, 
  TokenItem, 
  QuestionItem,
  StudentSubmissionDetail,
  QuestionAnswerDetail
} from './types/database';

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
    questions: QuestionItem[],
    className?: string
  ): Promise<Assessment> {
    this.ensureConfigured();
    try {
      const formattedQuestions = questions.map((q, idx) => ({
        ...q,
        id: q.id || idx + 1,
        correct_option: q.correctOption !== undefined ? q.correctOption : q.correct_option ?? 0,
        points: Number(q.points) > 0 ? Number(q.points) : Math.round(100 / (questions.length || 1))
      }));

      const insertPayload: any = {
        title,
        description: description || null,
        questions: formattedQuestions
      };

      // 1. Insert assessment record (with class_name resilience)
      let assessment: any = null;
      if (className) {
        const { data, error } = await supabase
          .from('assessments')
          .insert({ ...insertPayload, class_name: className })
          .select()
          .single();

        if (error && error.message?.includes('class_name')) {
          // Column class_name not yet in schema, retry without it
          const retry = await supabase
            .from('assessments')
            .insert(insertPayload)
            .select()
            .single();
          if (retry.error) throw retry.error;
          assessment = retry.data;
        } else if (error) {
          throw error;
        } else {
          assessment = data;
        }
      } else {
        const { data, error } = await supabase
          .from('assessments')
          .insert(insertPayload)
          .select()
          .single();
        if (error) throw error;
        assessment = data;
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
   * Fetch all student sessions for a given assessment, enriched with summary counts
   */
  async getSessions(assessmentId: number): Promise<Session[]> {
    this.ensureConfigured();
    try {
      const [sessionsRes, assessmentRes] = await Promise.all([
        supabase
          .from('sessions')
          .select('*')
          .eq('assessment_id', assessmentId)
          .order('created_at', { ascending: false }),
        supabase
          .from('assessments')
          .select('questions')
          .eq('id', assessmentId)
          .maybeSingle()
      ]);

      if (sessionsRes.error) throw sessionsRes.error;
      const sessions = sessionsRes.data || [];
      const totalQuestions = assessmentRes.data?.questions?.length || 0;

      return sessions.map(s => {
        const score = s.score;
        let totalCorrect = s.total_correct;
        let totalIncorrect = s.total_incorrect;

        if ((totalCorrect === null || totalCorrect === undefined) && score !== null && score !== undefined && totalQuestions > 0) {
          totalCorrect = Math.round((score / 100) * totalQuestions);
          totalIncorrect = Math.max(0, totalQuestions - totalCorrect);
        }

        // Format duration if dates exist
        let durationText = '-';
        if (s.created_at) {
          const start = new Date(s.created_at);
          const end = s.submitted_at ? new Date(s.submitted_at) : (s.end_time ? new Date(s.end_time) : null);
          if (end) {
            const diffSec = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
            const m = Math.floor(diffSec / 60);
            const sec = diffSec % 60;
            durationText = m > 0 ? `${m}m ${sec}s` : `${sec}s`;
          }
        }

        return {
          ...s,
          total_correct: totalCorrect ?? 0,
          total_incorrect: totalIncorrect ?? 0,
          total_questions: totalQuestions,
          duration_text: durationText
        };
      });
    } catch (err: any) {
      throw this.handleNetworkError(err, 'getSessions');
    }
  }

  /**
   * Save or update student answer for a question
   */
  async saveAnswer(sessionId: string, questionId: number | string, selectedOption: number): Promise<Answer | null> {
    this.ensureConfigured();
    try {
      const parsedQId = typeof questionId === 'number' 
        ? questionId 
        : parseInt(String(questionId).replace(/\D/g, '') || '1', 10);

      const payload = {
        session_id: sessionId,
        question_id: parsedQId,
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
          .eq('question_id', parsedQId)
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
   * Submit student assessment and record final score and statistics
   */
  async submitAssessment(
    sessionId: string, 
    score: number,
    totalCorrect?: number,
    totalIncorrect?: number
  ): Promise<Session> {
    this.ensureConfigured();
    try {
      const payload: any = {
        score: score,
        is_completed: true,
        status: 'completed',
        submitted_at: new Date().toISOString()
      };
      if (totalCorrect !== undefined) payload.total_correct = totalCorrect;
      if (totalIncorrect !== undefined) payload.total_incorrect = totalIncorrect;

      let { data, error } = await supabase
        .from('sessions')
        .update(payload)
        .eq('id', sessionId)
        .select()
        .single();

      if (error && (error.message?.includes('total_correct') || error.message?.includes('total_incorrect'))) {
        delete payload.total_correct;
        delete payload.total_incorrect;
        const retry = await supabase
          .from('sessions')
          .update(payload)
          .eq('id', sessionId)
          .select()
          .single();
        if (retry.error) throw retry.error;
        data = retry.data;
      } else if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      throw this.handleNetworkError(err, 'submitAssessment');
    }
  }

  /**
   * Fetch full student submission detail including every question, chosen option,
   * correct option, correctness status, points, and duration.
   */
  async getSessionDetails(sessionId: string): Promise<StudentSubmissionDetail> {
    this.ensureConfigured();
    try {
      // 1. Fetch session record
      const { data: session, error: sessErr } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessErr || !session) throw new Error('Data sesi siswa tidak ditemukan.');

      // 2. Fetch assessment record
      const { data: assessment, error: assErr } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', session.assessment_id)
        .single();

      if (assErr || !assessment) throw new Error('Data assessment tidak ditemukan.');

      // 3. Fetch relational questions if available
      const { data: questionsTable } = await supabase
        .from('questions')
        .select('*')
        .eq('assessment_id', session.assessment_id)
        .order('id', { ascending: true });

      const rawQuestions: any[] = (questionsTable && questionsTable.length > 0)
        ? questionsTable
        : (assessment.questions || []);

      // 4. Fetch answers for this session
      const { data: answersData } = await supabase
        .from('answers')
        .select('*')
        .eq('session_id', sessionId);

      const answersList = answersData || [];

      // Map answers by question_id
      const answersMap = new Map<string, number>();
      answersList.forEach(a => {
        answersMap.set(String(a.question_id), a.selected_option);
      });

      const optionLetters = ['A', 'B', 'C', 'D', 'E'];
      let calculatedCorrect = 0;

      const items: QuestionAnswerDetail[] = rawQuestions.map((q, idx) => {
        const qId = q.id !== undefined ? String(q.id) : String(idx + 1);
        
        // Find answer by qId, or fallback to index matching
        let selectedOption: number | null = null;
        if (answersMap.has(qId)) {
          selectedOption = answersMap.get(qId)!;
        } else if (answersMap.has(String(idx + 1))) {
          selectedOption = answersMap.get(String(idx + 1))!;
        } else if (idx < answersList.length && answersList[idx]?.selected_option !== undefined) {
          selectedOption = answersList[idx].selected_option;
        }

        const correctOpt: number = q.correct_option !== undefined 
          ? Number(q.correct_option) 
          : (q.correctOption !== undefined ? Number(q.correctOption) : 0);

        const isCorrect = selectedOption !== null && selectedOption === correctOpt;
        if (isCorrect) calculatedCorrect++;

        const maxPoints = Number(q.points) > 0 ? Number(q.points) : Math.round(100 / (rawQuestions.length || 1));
        const points = isCorrect ? maxPoints : 0;

        const optionsArray: string[] = Array.isArray(q.options) ? q.options : [];
        const selectedText = (selectedOption !== null && optionsArray[selectedOption] !== undefined)
          ? `${optionLetters[selectedOption] || ''}. ${optionsArray[selectedOption]}`
          : '(Tidak dijawab)';

        const correctText = optionsArray[correctOpt] !== undefined
          ? `${optionLetters[correctOpt] || ''}. ${optionsArray[correctOpt]}`
          : '-';

        return {
          question_number: idx + 1,
          question_id: qId,
          question_text: q.text || `Pertanyaan ${idx + 1}`,
          options: optionsArray,
          selected_option: selectedOption,
          selected_text: selectedText,
          correct_option: correctOpt,
          correct_text: correctText,
          is_correct: isCorrect,
          points,
          max_points: maxPoints
        };
      });

      const totalQuestions = rawQuestions.length;
      const totalCorrect = session.total_correct ?? calculatedCorrect;
      const totalIncorrect = session.total_incorrect ?? Math.max(0, totalQuestions - totalCorrect);
      const score = session.score !== null && session.score !== undefined
        ? session.score
        : Math.round((totalCorrect / (totalQuestions || 1)) * 100);

      // Format dates and duration
      const startDate = session.created_at ? new Date(session.created_at) : new Date();
      const endDate = session.submitted_at 
        ? new Date(session.submitted_at) 
        : (session.end_time ? new Date(session.end_time) : startDate);

      const diffSec = Math.max(0, Math.floor((endDate.getTime() - startDate.getTime()) / 1000));
      const minutes = Math.floor(diffSec / 60);
      const seconds = diffSec % 60;
      let durationText = '';
      if (minutes > 0) {
        durationText = `${minutes} menit ${seconds} detik`;
      } else {
        durationText = `${seconds} detik`;
      }

      const dateFormatted = startDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return {
        session_id: session.id,
        student_name: session.student_name || 'Tanpa Nama',
        student_class: session.student_class || '-',
        assessment_title: assessment.title || 'Assessment PJOK',
        assessment_id: assessment.id,
        token: session.token || '-',
        score: score,
        total_questions: totalQuestions,
        total_correct: totalCorrect,
        total_incorrect: totalIncorrect,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        duration_text: durationText,
        date_formatted: dateFormatted,
        items
      };
    } catch (err: any) {
      throw this.handleNetworkError(err, 'getSessionDetails');
    }
  }

  /**
   * Delete an assessment and all associated data (questions, tokens, answers, sessions)
   * used when an exam has been completed and needs to be cleaned up.
   */
  async deleteAssessment(assessmentId: number): Promise<void> {
    this.ensureConfigured();
    try {
      // 1. Get all session IDs for this assessment
      const { data: sessionRows } = await supabase
        .from('sessions')
        .select('id')
        .eq('assessment_id', assessmentId);

      const sessionIds = (sessionRows || []).map(s => s.id);

      // 2. Delete all answers for these sessions
      if (sessionIds.length > 0) {
        const { error: ansErr } = await supabase
          .from('answers')
          .delete()
          .in('session_id', sessionIds);
        if (ansErr) console.warn('[SupabaseDataService] Delete answers warning:', ansErr.message);
      }

      // 3. Delete all sessions for this assessment
      const { error: sessErr } = await supabase
        .from('sessions')
        .delete()
        .eq('assessment_id', assessmentId);
      if (sessErr) console.warn('[SupabaseDataService] Delete sessions warning:', sessErr.message);

      // 4. Delete all tokens for this assessment
      const { error: tokErr } = await supabase
        .from('tokens')
        .delete()
        .eq('assessment_id', assessmentId);
      if (tokErr) console.warn('[SupabaseDataService] Delete tokens warning:', tokErr.message);

      // Clean local storage cache
      try {
        const stored: TokenItem[] = JSON.parse(localStorage.getItem('pjok_tokens') || '[]');
        const updated = stored.filter(t => t.assessment_id !== assessmentId);
        localStorage.setItem('pjok_tokens', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      // 5. Delete questions for this assessment
      const { error: qErr } = await supabase
        .from('questions')
        .delete()
        .eq('assessment_id', assessmentId);
      if (qErr) console.warn('[SupabaseDataService] Delete questions warning:', qErr.message);

      // 6. Delete assessment record
      const { error: assErr } = await supabase
        .from('assessments')
        .delete()
        .eq('id', assessmentId);

      if (assErr) throw assErr;
    } catch (err: any) {
      throw this.handleNetworkError(err, 'deleteAssessment');
    }
  }

  /**
   * Delete a student examination session and its answers
   */
  async deleteSession(sessionId: string): Promise<void> {
    this.ensureConfigured();
    try {
      await supabase
        .from('answers')
        .delete()
        .eq('session_id', sessionId);

      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    } catch (err: any) {
      throw this.handleNetworkError(err, 'deleteSession');
    }
  }

  /**
   * Delete a specific question from an assessment
   */
  async deleteQuestionFromAssessment(assessmentId: number, questionIndex: number): Promise<Assessment> {
    this.ensureConfigured();
    try {
      const { data: currentAss, error: fetchErr } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (fetchErr) throw fetchErr;
      if (!currentAss) throw new Error('Ujian tidak ditemukan');

      const currentQuestions = Array.isArray(currentAss.questions) ? currentAss.questions : [];
      const questionToDelete = currentQuestions[questionIndex];

      const updatedQuestions = currentQuestions.filter((_, idx) => idx !== questionIndex);

      const { data: updated, error: updateErr } = await supabase
        .from('assessments')
        .update({ questions: updatedQuestions })
        .eq('id', assessmentId)
        .select()
        .single();

      if (updateErr) throw updateErr;

      // Clean up from relational questions table if matching
      if (questionToDelete?.text) {
        try {
          await supabase
            .from('questions')
            .delete()
            .eq('assessment_id', assessmentId)
            .eq('text', questionToDelete.text);
        } catch (e) {
          // ignore
        }
      }

      return updated;
    } catch (err: any) {
      throw this.handleNetworkError(err, 'deleteQuestionFromAssessment');
    }
  }
}

export const dataService = new SupabaseDataService();


