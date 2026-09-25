import { buildAssessmentPDFDocument, DEFAULT_PDF_SETTINGS } from '../src/utils/pdfGenerator';
import type { StudentSubmissionDetail } from '../src/types/database';

function createMockDetail(
  studentName: string,
  assessmentTitle: string,
  questionCount: number,
  options?: {
    longQuestion?: boolean;
    longAnswer?: boolean;
    score?: number;
  }
): StudentSubmissionDetail {
  const items = Array.from({ length: questionCount }, (_, i) => {
    let questionText = `Pertanyaan nomor ${i + 1} mengenai materi pembelajaran kurikulum merdeka pada sekolah dasar.`;
    if (options?.longQuestion) {
      questionText = `Pertanyaan narasi panjang nomor ${i + 1}: Seorang siswa sedang melakukan pengamatan mendalam mengenai berbagai macam gerak lokomotor, non-lokomotor, dan manipulatif dalam aktivitas olahraga beregu di lapangan sekolah. Jelaskan secara komprehensif apa yang dimaksud dengan koordinasi gerak dasar tersebut serta bagaimana pengaruhnya terhadap kebugaran jasmani siswa!`;
    }

    let selectedText = `Pilihan Jawaban Singkat ${i + 1}`;
    let correctText = `Pilihan Jawaban Singkat ${i + 1}`;
    if (options?.longAnswer) {
      selectedText = `Ini adalah uraian jawaban siswa yang sangat panjang dan memuat berbagai penjelasan detail mengenai teknik pelaksanaan gerakan olahraga secara benar dan terstruktur`;
      correctText = `Kunci jawaban resmi dari guru pengampu yang menerangkan standar capaian pembelajaran dan indikator keberhasilan secara lengkap`;
    }

    const isCorrect = i % 4 !== 0; // 75% correct
    return {
      question_number: i + 1,
      question_id: i + 1,
      question_text: questionText,
      options: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
      selected_option: 0,
      selected_text: selectedText,
      correct_option: 0,
      correct_text: correctText,
      is_correct: isCorrect,
      points: isCorrect ? 2 : 0,
      max_points: 2
    };
  });

  const correctCount = items.filter(it => it.is_correct).length;
  const incorrectCount = questionCount - correctCount;
  const calculatedScore = options?.score !== undefined 
    ? options.score 
    : Math.round((correctCount / questionCount) * 100);

  return {
    session_id: `test-sess-${Date.now()}`,
    student_name: studentName,
    student_class: 'Kelas 4-A',
    assessment_title: assessmentTitle,
    assessment_id: 101,
    token: 'TEST01',
    score: calculatedScore,
    total_questions: questionCount,
    total_correct: correctCount,
    total_incorrect: incorrectCount,
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    duration_text: '20 Menit',
    date_formatted: '25 September 2026',
    items
  };
}

console.log('====================================================');
console.log('RUNNING AUTOMATED TEST SCENARIOS FOR REDESIGNED PDF');
console.log('====================================================');

const scenarios = [
  {
    name: 'Skenario 1: 5 Soal (1 Halaman Ringkas)',
    detail: createMockDetail('Ahmad Raihan', 'Penilaian Harian PJOK 1', 5)
  },
  {
    name: 'Skenario 2: 20 Soal (Dokumen 2 Halaman)',
    detail: createMockDetail('Siti Nurhaliza', 'Penilaian Tengah Semester PJOK', 20)
  },
  {
    name: 'Skenario 3: 50 Soal (Dokumen Multi-Halaman Masif)',
    detail: createMockDetail('Budi Santoso', 'Ujian Akhir Semester PJOK Terpadu', 50)
  },
  {
    name: 'Skenario 4: Pertanyaan Sangat Panjang',
    detail: createMockDetail('Dewi Sartika', 'Asesmen Naratif PJOK', 8, { longQuestion: true })
  },
  {
    name: 'Skenario 5: Jawaban Sangat Panjang',
    detail: createMockDetail('Farhan Pratama', 'Asesmen Analisis Gerak', 8, { longAnswer: true })
  },
  {
    name: 'Skenario 6: Nama Siswa Sangat Panjang (>45 Karakter)',
    detail: createMockDetail('Muhammad Rayyan Al-Fatih Pratama Kusumah Diningrat', 'Penilaian Sumatif Bab 2', 10)
  },
  {
    name: 'Skenario 7: Nilai 0 (Evaluasi Perlu Bimbingan)',
    detail: createMockDetail('Doni Saputra', 'Kuis PJOK Cepat', 5, { score: 0 })
  },
  {
    name: 'Skenario 8: Nilai 100 Sempurna (Prestasi Luar Biasa)',
    detail: createMockDetail('Anindya Putri', 'Penilaian Harian Gerak Dasar', 10, { score: 100 })
  }
];

let allPassed = true;

for (let i = 0; i < scenarios.length; i++) {
  const s = scenarios[i];
  try {
    const doc = buildAssessmentPDFDocument(s.detail, DEFAULT_PDF_SETTINGS);
    const pages = doc.getNumberOfPages();
    const pdfOutput = doc.output('arraybuffer');
    
    console.log(`[PASS] ${s.name}`);
    console.log(`       -> Total Halaman: ${pages}, Ukuran Buffer: ${pdfOutput.byteLength} bytes`);
  } catch (err: any) {
    console.error(`[FAIL] ${s.name}:`, err);
    allPassed = false;
  }
}

console.log('====================================================');
if (allPassed) {
  console.log('SELURUH 8 SKENARIO PDF BERHASIL 100% TANPA KENDALA!');
} else {
  console.error('ADA SKENARIO YANG GAGAL!');
  process.exit(1);
}
console.log('====================================================');
