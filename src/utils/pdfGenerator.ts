import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { StudentSubmissionDetail } from '../types/database';

export interface PDFSettings {
  // Identitas Guru
  teacherName: string;
  teacherNip: string;
  teacherRole: string;
  cityName: string;

  // Kop Surat & Narasi Dokumen
  headerMode: 'auto' | 'custom';
  customDocumentTitle: string;
  customHeaderNarrative: string;

  // Catatan Guru / Evaluasi
  teacherNotes: string;
  showNotesBox: boolean;
  autoGradeFeedback: boolean;
}

export const DEFAULT_PDF_SETTINGS: PDFSettings = {
  teacherName: "Fahmi Ayatollah, S.Pd",
  teacherNip: "-",
  teacherRole: "Guru Pengampu PJOK",
  cityName: "Kepanjen",
  headerMode: "auto",
  customDocumentTitle: "HASIL TUGAS & ASSESSMENT ONLINE",
  customHeaderNarrative: "Platform Tugas & Assessment Digital • SDI SAIQ AL-HIKMAH",
  teacherNotes: "Tingkatkan terus semangat belajar, jaga kebugaran jasmani dan rohani, serta selalu disiplin dalam berlatih.",
  showNotesBox: true,
  autoGradeFeedback: true
};

export function getPDFSettings(): PDFSettings {
  try {
    const raw = localStorage.getItem('sdisaiq_pdf_settings');
    if (raw) {
      return { ...DEFAULT_PDF_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse pdf settings from localStorage', e);
  }
  return DEFAULT_PDF_SETTINGS;
}

export function savePDFSettings(settings: PDFSettings): void {
  try {
    localStorage.setItem('sdisaiq_pdf_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save pdf settings to localStorage', e);
  }
}

/**
 * Resolves document header, narrative, and teacher role dynamically
 * based on assessment title and user's settings.
 */
export function resolveSubjectAndHeader(assessmentTitle: string, settings: PDFSettings): {
  documentTitle: string;
  headerNarrative: string;
  teacherRole: string;
} {
  if (settings.headerMode === 'custom' && settings.customDocumentTitle) {
    return {
      documentTitle: settings.customDocumentTitle,
      headerNarrative: settings.customHeaderNarrative || "Platform Tugas & Assessment Digital • SDI SAIQ AL-HIKMAH",
      teacherRole: settings.teacherRole || "Guru Pengampu"
    };
  }

  // Automatic subject detection from assessment title
  const t = (assessmentTitle || '').toLowerCase();
  
  if (t.includes('pjok') || t.includes('olahraga') || t.includes('penjas') || t.includes('gerak')) {
    return {
      documentTitle: 'HASIL ASSESSMENT PJOK',
      headerNarrative: 'Pendidikan Jasmani, Olahraga, dan Kesehatan • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu PJOK'
    };
  }
  if (t.includes('matematika') || t.includes('mtk') || t.includes('hitung')) {
    return {
      documentTitle: 'HASIL ASSESSMENT MATEMATIKA',
      headerNarrative: 'Mata Pelajaran Matematika • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu Matematika'
    };
  }
  if (t.includes('ipas') || t.includes('sains') || t.includes('ipa') || t.includes('ips')) {
    return {
      documentTitle: 'HASIL ASSESSMENT IPAS',
      headerNarrative: 'Ilmu Pengetahuan Alam & Sosial • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu IPAS'
    };
  }
  if (t.includes('indonesia') || t.includes('bahasa indonesia') || t.includes('b.indo')) {
    return {
      documentTitle: 'HASIL ASSESSMENT BAHASA INDONESIA',
      headerNarrative: 'Mata Pelajaran Bahasa Indonesia • Literasi & Bahasa Terpadu',
      teacherRole: settings.teacherRole || 'Guru Pengampu Bahasa Indonesia'
    };
  }
  if (t.includes('pancasila') || t.includes('ppkn') || t.includes('kewarganegaraan')) {
    return {
      documentTitle: 'HASIL ASSESSMENT PENDIDIKAN PANCASILA',
      headerNarrative: 'Pendidikan Pancasila & Karakter • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu Pendidikan Pancasila'
    };
  }
  if (t.includes('agama') || t.includes('pai') || t.includes('islam')) {
    return {
      documentTitle: 'HASIL ASSESSMENT PENDIDIKAN AGAMA ISLAM',
      headerNarrative: 'Pendidikan Agama Islam & Budi Pekerti • SDI SAIQ AL-HIKMAH',
      teacherRole: settings.teacherRole || 'Guru Pengampu Pendidikan Agama'
    };
  }
  if (t.includes('inggris') || t.includes('english')) {
    return {
      documentTitle: 'HASIL ASSESSMENT BAHASA INGGRIS',
      headerNarrative: 'Mata Pelajaran Bahasa Inggris • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu Bahasa Inggris'
    };
  }
  if (t.includes('seni') || t.includes('budaya') || t.includes('sbdp')) {
    return {
      documentTitle: 'HASIL ASSESSMENT SENI BUDAYA',
      headerNarrative: 'Seni Budaya & Prakarya • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu Seni Budaya'
    };
  }

  // General fallback
  return {
    documentTitle: 'HASIL ASSESSMENT & TUGAS ONLINE',
    headerNarrative: 'Platform Tugas & Assessment Digital • SDI SAIQ AL-HIKMAH',
    teacherRole: settings.teacherRole || 'Guru Pengampu'
  };
}

/**
 * Generate and trigger download of assessment results in A4 PDF format
 * for SDI SAIQ AL-HIKMAH with dynamic settings and teacher notes
 */
export function generateAssessmentPDF(
  detail: StudentSubmissionDetail,
  customSettings?: PDFSettings
): void {
  const settings = customSettings || getPDFSettings();
  const resolvedInfo = resolveSubjectAndHeader(detail.assessment_title, settings);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // ----------------------------------------------------
  // 1. KOP SURAT / HEADER
  // ----------------------------------------------------
  // Nama Sekolah
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('SDI SAIQ AL-HIKMAH', pageWidth / 2, 16, { align: 'center' });

  // Judul Dokumen Dinamis Sesuai Mapel / Setting
  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(resolvedInfo.documentTitle, pageWidth / 2, 22, { align: 'center' });

  // Keterangan Narasi Dokumen Sesuai Mapel / Setting
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(resolvedInfo.headerNarrative, pageWidth / 2, 27, { align: 'center' });

  // Double accent lines
  doc.setDrawColor(5, 150, 105); // emerald-600
  doc.setLineWidth(0.8);
  doc.line(margin, 30, pageWidth - margin, 30);
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.2);
  doc.line(margin, 31, pageWidth - margin, 31);

  // ----------------------------------------------------
  // 2. DATA SISWA & RINGKASAN NILAI
  // ----------------------------------------------------
  const startY = 36;

  // Box background for metadata
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, startY, contentWidth, 36, 2, 2, 'FD');

  // Left column: Data Siswa
  const colLeftX = margin + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('DATA SISWA', colLeftX, startY + 6);

  doc.setFontSize(8.5);
  const studentData = [
    ['Nama Siswa', `: ${detail.student_name}`],
    ['Kelas', `: ${detail.student_class}`],
    ['Assessment', `: ${detail.assessment_title}`],
    ['Tanggal', `: ${detail.date_formatted}`],
    ['Waktu Pengerjaan', `: ${detail.duration_text}`]
  ];

  let lineY = startY + 12;
  studentData.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, colLeftX, lineY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    // Limit width of assessment title to avoid overflow
    const maxValWidth = 65;
    const splitVal = doc.splitTextToSize(val, maxValWidth);
    doc.text(splitVal, colLeftX + 28, lineY);
    lineY += 4.8;
  });

  // Vertical divider inside box
  const dividerX = margin + 105;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(dividerX, startY + 3, dividerX, startY + 33);

  // Right column: RINGKASAN NILAI
  const colRightX = dividerX + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('RINGKASAN NILAI', colRightX, startY + 6);

  doc.setFontSize(8.5);
  const summaryRows = [
    ['Jumlah Soal', `: ${detail.total_questions} Butir`],
    ['Jawaban Benar', `: ${detail.total_correct} Soal`],
    ['Jawaban Salah', `: ${detail.total_incorrect} Soal`]
  ];

  let sumY = startY + 12;
  summaryRows.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, colRightX, sumY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, colRightX + 26, sumY);
    sumY += 4.8;
  });

  // Final score highlight badge
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setLineWidth(0.5);
  doc.roundedRect(colRightX, sumY - 1, 65, 8.5, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text('Nilai Akhir :', colRightX + 3, sumY + 5);

  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(`${detail.score}`, colRightX + 45, sumY + 5.2, { align: 'right' });
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('/ 100', colRightX + 47, sumY + 5);

  // ----------------------------------------------------
  // 3. DETAIL JAWABAN (TABEL A4)
  // ----------------------------------------------------
  const tableStartY = startY + 41;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('DETAIL JAWABAN', margin, tableStartY - 2);

  const tableBody = detail.items.map(item => [
    item.question_number.toString(),
    item.question_text,
    item.selected_text,
    item.correct_text,
    item.is_correct ? 'Benar' : 'Salah',
    item.points.toString()
  ]);

  autoTable(doc, {
    startY: tableStartY,
    margin: { left: margin, right: margin, bottom: 20 },
    head: [['No', 'Pertanyaan', 'Jawaban Siswa', 'Kunci Jawaban', 'Status', 'Poin']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [5, 150, 105], // emerald-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
      valign: 'middle',
      cellPadding: 2.2
    },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      valign: 'top',
      textColor: [30, 41, 59], // slate-800
      lineColor: [226, 232, 240], // slate-200
      lineWidth: 0.15
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // No
      1: { cellWidth: 68 },                   // Pertanyaan
      2: { cellWidth: 42 },                   // Jawaban Siswa
      3: { cellWidth: 42 },                   // Kunci Jawaban
      4: { cellWidth: 16, halign: 'center' }, // Status
      5: { cellWidth: 14, halign: 'center' }  // Poin
    },
    didParseCell: (data) => {
      // Color-code Status column: Benar = Green, Salah = Red
      if (data.section === 'body' && data.column.index === 4) {
        if (data.cell.raw === 'Benar') {
          data.cell.styles.textColor = [16, 185, 129]; // emerald-500
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [225, 29, 72]; // rose-600
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    didDrawPage: (data) => {
      // Footer page numbering on each page
      const pageNumber = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : 1;
      const currentPage = data.pageNumber;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `Dokumen resmi SDI SAIQ AL-HIKMAH • Dicetak pada ${new Date().toLocaleDateString('id-ID')}`,
        margin,
        pageHeight - 8
      );
      doc.text(
        `Halaman ${currentPage}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: 'right' }
      );
    }
  });

  // ----------------------------------------------------
  // 4. CATATAN GURU & TANDA TANGAN
  // ----------------------------------------------------
  const tableBottomY = (doc as any).lastAutoTable?.finalY || 160;

  // Space calculation
  const notesHeight = settings.showNotesBox ? 22 : 0;
  const signatureHeight = 36;
  const totalNeeded = notesHeight + signatureHeight + 12;

  // Add new page if remaining vertical space is insufficient
  if (tableBottomY + totalNeeded > pageHeight - 14) {
    doc.addPage();
  }

  let currentY = (tableBottomY + totalNeeded > pageHeight - 14) ? 24 : tableBottomY + 5;

  // 4A. Kotak Catatan Guru / Evaluasi
  if (settings.showNotesBox) {
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, notesHeight, 2, 2, 'FD');

    // Title Catatan Guru
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('CATATAN GURU / EVALUASI HASIL BELAJAR:', margin + 4, currentY + 5.5);

    // Isi Catatan Guru + Smart Grade Feedback
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59); // slate-800

    let fullNote = settings.teacherNotes || 'Pertahankan semangat belajar dan terus tingkatkan pemahaman materi.';
    if (settings.autoGradeFeedback) {
      let gradeFeedback = '';
      if (detail.score >= 85) {
        gradeFeedback = ' • Apresiasi: Prestasi istimewa! Pemahaman materi sangat baik dan memuaskan.';
      } else if (detail.score >= 70) {
        gradeFeedback = ' • Evaluasi: Hasil baik dan tuntas. Terus pertahankan dan tingkatkan ketelitian belajar.';
      } else {
        gradeFeedback = ' • Evaluasi: Perlu lebih giat berlatih dan mengulang kembali materi yang belum dikuasai.';
      }
      fullNote += gradeFeedback;
    }

    const splitNote = doc.splitTextToSize(fullNote, contentWidth - 8);
    doc.text(splitNote, margin + 4, currentY + 10.5);

    currentY += notesHeight + 5;
  } else {
    currentY += 4;
  }

  // 4B. Tanda Tangan Guru Pengampu
  const signX = pageWidth - margin - 58;
  const signY = currentY + 2;

  // Check if sign fits
  if (signY + 30 > pageHeight - 12) {
    doc.addPage();
  }

  const resolvedDate = detail.date_formatted || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`${settings.cityName || 'Kepanjen'}, ${resolvedDate}`, signX, signY);

  const roleText = resolvedInfo.teacherRole.endsWith(',') ? resolvedInfo.teacherRole : `${resolvedInfo.teacherRole},`;
  doc.text(roleText, signX, signY + 4.5);

  doc.setDrawColor(203, 213, 225);
  doc.line(signX, signY + 22, signX + 50, signY + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(settings.teacherName || 'Fahmi Ayatollah, S.Pd', signX, signY + 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const nipLabel = settings.teacherNip && settings.teacherNip !== '-' ? `NIP/NUPTK. ${settings.teacherNip}` : 'SDI SAIQ AL-HIKMAH';
  doc.text(nipLabel, signX, signY + 30);

  // ----------------------------------------------------
  // 5. DOWNLOAD PDF
  // ----------------------------------------------------
  const cleanStudentName = detail.student_name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanAssessment = detail.assessment_title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Hasil_${cleanStudentName}_${cleanAssessment}.pdf`;

  doc.save(filename);
}
