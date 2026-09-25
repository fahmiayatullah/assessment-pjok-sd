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
 * Resolves document subject name, header title, narrative, and teacher role dynamically
 * based on assessment title and user settings.
 */
export function resolveSubjectAndHeader(assessmentTitle: string, settings: PDFSettings): {
  subjectName: string;
  documentTitle: string;
  headerNarrative: string;
  teacherRole: string;
} {
  const t = (assessmentTitle || '').toLowerCase();

  if (settings.headerMode === 'custom' && settings.customDocumentTitle) {
    let guessedSubject = 'Mata Pelajaran';
    if (t.includes('pjok') || t.includes('olahraga')) guessedSubject = 'PJOK';
    else if (t.includes('matematika') || t.includes('mtk')) guessedSubject = 'Matematika';
    else if (t.includes('ipas') || t.includes('ipa')) guessedSubject = 'IPAS';
    else if (t.includes('indonesia')) guessedSubject = 'Bahasa Indonesia';
    else if (t.includes('pancasila')) guessedSubject = 'Pendidikan Pancasila';
    else if (t.includes('agama') || t.includes('pai')) guessedSubject = 'Pendidikan Agama Islam';
    else if (t.includes('inggris')) guessedSubject = 'Bahasa Inggris';
    else if (t.includes('seni')) guessedSubject = 'Seni Budaya';

    return {
      subjectName: guessedSubject,
      documentTitle: settings.customDocumentTitle,
      headerNarrative: settings.customHeaderNarrative || "Platform Tugas & Assessment Digital • SDI SAIQ AL-HIKMAH",
      teacherRole: settings.teacherRole || "Guru Pengampu"
    };
  }

  // Automatic subject detection
  if (t.includes('pjok') || t.includes('olahraga') || t.includes('penjas') || t.includes('gerak')) {
    return {
      subjectName: 'PJOK',
      documentTitle: 'HASIL ASSESSMENT PJOK',
      headerNarrative: 'Pendidikan Jasmani, Olahraga, dan Kesehatan • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu PJOK'
    };
  }
  if (t.includes('matematika') || t.includes('mtk') || t.includes('hitung')) {
    return {
      subjectName: 'Matematika',
      documentTitle: 'HASIL ASSESSMENT MATEMATIKA',
      headerNarrative: 'Mata Pelajaran Matematika • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu Matematika'
    };
  }
  if (t.includes('ipas') || t.includes('sains') || t.includes('ipa') || t.includes('ips')) {
    return {
      subjectName: 'IPAS',
      documentTitle: 'HASIL ASSESSMENT IPAS',
      headerNarrative: 'Ilmu Pengetahuan Alam & Sosial • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu IPAS'
    };
  }
  if (t.includes('indonesia') || t.includes('bahasa indonesia') || t.includes('b.indo')) {
    return {
      subjectName: 'Bahasa Indonesia',
      documentTitle: 'HASIL ASSESSMENT BAHASA INDONESIA',
      headerNarrative: 'Mata Pelajaran Bahasa Indonesia • Literasi & Bahasa Terpadu',
      teacherRole: settings.teacherRole || 'Guru Pengampu Bahasa Indonesia'
    };
  }
  if (t.includes('pancasila') || t.includes('ppkn') || t.includes('kewarganegaraan')) {
    return {
      subjectName: 'Pendidikan Pancasila',
      documentTitle: 'HASIL ASSESSMENT PENDIDIKAN PANCASILA',
      headerNarrative: 'Pendidikan Pancasila & Karakter • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu Pendidikan Pancasila'
    };
  }
  if (t.includes('agama') || t.includes('pai') || t.includes('islam')) {
    return {
      subjectName: 'Pendidikan Agama Islam',
      documentTitle: 'HASIL ASSESSMENT PENDIDIKAN AGAMA ISLAM',
      headerNarrative: 'Pendidikan Agama Islam & Budi Pekerti • SDI SAIQ AL-HIKMAH',
      teacherRole: settings.teacherRole || 'Guru Pengampu Pendidikan Agama'
    };
  }
  if (t.includes('inggris') || t.includes('english')) {
    return {
      subjectName: 'Bahasa Inggris',
      documentTitle: 'HASIL ASSESSMENT BAHASA INGGRIS',
      headerNarrative: 'Mata Pelajaran Bahasa Inggris • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu Bahasa Inggris'
    };
  }
  if (t.includes('seni') || t.includes('budaya') || t.includes('sbdp')) {
    return {
      subjectName: 'Seni Budaya',
      documentTitle: 'HASIL ASSESSMENT SENI BUDAYA',
      headerNarrative: 'Seni Budaya & Prakarya • Platform Tugas & Assessment Digital',
      teacherRole: settings.teacherRole || 'Guru Pengampu Seni Budaya'
    };
  }

  return {
    subjectName: 'Mata Pelajaran Terpadu',
    documentTitle: 'HASIL ASSESSMENT & TUGAS ONLINE',
    headerNarrative: 'Platform Tugas & Assessment Digital • SDI SAIQ AL-HIKMAH',
    teacherRole: settings.teacherRole || 'Guru Pengampu'
  };
}

/**
 * Constructs the professional A4 jsPDF instance for assessment results
 * following school document editorial standards.
 * 
 * Dimensions: 210 x 297 mm (A4 Portrait)
 * Margins: 18 mm symmetrically
 * Content width: 174 mm
 */
export function buildAssessmentPDFDocument(
  detail: StudentSubmissionDetail,
  customSettings?: PDFSettings
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const settings = customSettings || getPDFSettings();
  const resolved = resolveSubjectAndHeader(detail.assessment_title, settings);

  // Exact A4 dimensions
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174 mm
  const rightMarginX = margin + contentWidth;  // 192 mm
  const bottomLimitY = pageHeight - margin;    // 279 mm

  // =========================================================================
  // 1. KOP DOKUMEN RESMI (Clean Professional Header)
  // =========================================================================
  // Sisi Kiri: Identitas Sekolah
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('SDI SAIQ AL-HIKMAH', margin, 21.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(resolved.headerNarrative, margin, 26);

  // Sisi Kanan: Kategori Dokumen
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text(resolved.documentTitle, rightMarginX, 21.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Dokumen Resmi Evaluasi Belajar', rightMarginX, 26, { align: 'right' });

  // Garis Pemisah Tipis (Hairline divider)
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.25);
  doc.line(margin, 29.5, rightMarginX, 29.5);

  // =========================================================================
  // 2. JUDUL ASSESSMENT
  // =========================================================================
  let currentY = 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // slate-900

  // Text wrap for long assessment title
  const titleLines = doc.splitTextToSize(detail.assessment_title, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += (titleLines.length * 5) + 3;

  // =========================================================================
  // 3. INFORMASI SISWA (Card 2 Kolom Seimbang)
  // =========================================================================
  const cardStartY = currentY;
  const cardHeight = 25;
  const colDividerX = margin + 87; // center divider of the 174mm card

  // Background Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, cardStartY, contentWidth, cardHeight, 1.5, 1.5, 'FD');

  // Vertical divider inside card
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.15);
  doc.line(colDividerX, cardStartY + 3, colDividerX, cardStartY + cardHeight - 3);

  // Column 1 Content (Left)
  const col1X = margin + 4;
  const col1ValX = col1X + 27;
  const lineSpacing = 6;
  let textY = cardStartY + 6.5;

  const leftItems = [
    { label: 'Nama Siswa', value: detail.student_name, isBold: true },
    { label: 'Kelas', value: detail.student_class || '-', isBold: false },
    { label: 'Mata Pelajaran', value: resolved.subjectName, isBold: false }
  ];

  leftItems.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(item.label, col1X, textY);
    doc.text(':', col1ValX - 2, textY);

    doc.setFont('helvetica', item.isBold ? 'bold' : 'normal');
    doc.setTextColor(15, 23, 42); // slate-900
    // Limit width so it doesn't cross the divider
    const valText = doc.splitTextToSize(item.value, 52);
    doc.text(valText[0] || item.value, col1ValX, textY);
    textY += lineSpacing;
  });

  // Column 2 Content (Right)
  const col2X = colDividerX + 4;
  const col2ValX = col2X + 28;
  textY = cardStartY + 6.5;

  const rightItems = [
    { label: 'Assessment', value: detail.assessment_title, isBold: false },
    { label: 'Tanggal', value: detail.date_formatted || '-', isBold: false },
    { label: 'Waktu Pengerjaan', value: detail.duration_text || '-', isBold: false }
  ];

  rightItems.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(item.label, col2X, textY);
    doc.text(':', col2ValX - 2, textY);

    doc.setFont('helvetica', item.isBold ? 'bold' : 'normal');
    doc.setTextColor(15, 23, 42);
    const valText = doc.splitTextToSize(item.value, 50);
    doc.text(valText[0] || item.value, col2ValX, textY);
    textY += lineSpacing;
  });

  currentY = cardStartY + cardHeight + 6;

  // =========================================================================
  // 4. RINGKASAN HASIL (Structured 4-Column Table Card)
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RINGKASAN HASIL', margin, currentY);
  currentY += 3;

  const sumBoxY = currentY;
  const sumBoxHeight = 16.5;
  const colW = contentWidth / 4; // 43.5 mm each

  // Outer Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, sumBoxY, contentWidth, sumBoxHeight, 1.5, 1.5, 'FD');

  // Header band fill
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, sumBoxY, contentWidth, 6, 'F');

  // Highlight fill for Final Score column
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.rect(margin + colW * 3, sumBoxY, colW, sumBoxHeight, 'F');

  // Redraw outer borders
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, sumBoxY, contentWidth, sumBoxHeight, 1.5, 1.5, 'D');

  // Horizontal divider inside summary box
  doc.line(margin, sumBoxY + 6, rightMarginX, sumBoxY + 6);

  // Vertical column dividers
  doc.line(margin + colW, sumBoxY, margin + colW, sumBoxY + sumBoxHeight);
  doc.line(margin + colW * 2, sumBoxY, margin + colW * 2, sumBoxY + sumBoxHeight);
  doc.line(margin + colW * 3, sumBoxY, margin + colW * 3, sumBoxY + sumBoxHeight);

  // Column Headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);

  doc.setTextColor(100, 116, 139);
  doc.text('Jumlah Soal', margin + colW * 0.5, sumBoxY + 4.2, { align: 'center' });

  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text('Jawaban Benar', margin + colW * 1.5, sumBoxY + 4.2, { align: 'center' });

  doc.setTextColor(190, 18, 60); // rose-700
  doc.text('Jawaban Salah', margin + colW * 2.5, sumBoxY + 4.2, { align: 'center' });

  doc.setTextColor(4, 120, 87);
  doc.text('Nilai Akhir', margin + colW * 3.5, sumBoxY + 4.2, { align: 'center' });

  // Column Values
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${detail.total_questions} Butir`, margin + colW * 0.5, sumBoxY + 12.5, { align: 'center' });

  doc.setTextColor(4, 120, 87);
  doc.text(`${detail.total_correct} Soal`, margin + colW * 1.5, sumBoxY + 12.5, { align: 'center' });

  doc.setTextColor(190, 18, 60);
  doc.text(`${detail.total_incorrect} Soal`, margin + colW * 2.5, sumBoxY + 12.5, { align: 'center' });

  // Score value prominent styling
  doc.setFontSize(13);
  doc.setTextColor(4, 120, 87);
  doc.text(`${detail.score}`, margin + colW * 3.5 - 4, sumBoxY + 12.7, { align: 'right' });
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('/ 100', margin + colW * 3.5 - 2, sumBoxY + 12.5, { align: 'left' });

  currentY = sumBoxY + sumBoxHeight + 6;

  // =========================================================================
  // 5. RINCIAN HASIL JAWABAN (Table with Automatic Text Wrap & Multi-page repeat)
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RINCIAN HASIL JAWABAN', margin, currentY);
  currentY += 3;

  const tableBody = detail.items.map(item => [
    item.question_number.toString(),
    item.question_text || '-',
    item.selected_text || '-',
    item.correct_text || '-',
    item.is_correct ? '✓ Benar' : '✕ Salah',
    item.points !== undefined ? item.points.toString() : '0'
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 22, top: 18 },
    showHead: 'everyPage', // REPEATS COLUMN HEADERS ON PAGE 2, 3, etc.
    head: [['No', 'Pertanyaan', 'Jawaban Siswa', 'Kunci Jawaban', 'Status', 'Poin']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42], // slate-900 for high authority
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      valign: 'middle',
      cellPadding: { top: 2.5, bottom: 2.5, left: 1.5, right: 1.5 }
    },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      textColor: [30, 41, 59], // slate-800
      lineColor: [226, 232, 240], // slate-200
      lineWidth: 0.15,
      cellPadding: { top: 2.2, bottom: 2.2, left: 2, right: 2 },
      valign: 'top',
      overflow: 'linebreak'
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250] // crisp alternate row
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // No
      1: { cellWidth: 64 },                   // Pertanyaan (auto text wrapped)
      2: { cellWidth: 40 },                   // Jawaban Siswa
      3: { cellWidth: 36 },                   // Kunci Jawaban
      4: { cellWidth: 14, halign: 'center' }, // Status (✓ Benar / ✕ Salah)
      5: { cellWidth: 10, halign: 'center' }  // Poin
    },
    didParseCell: (data) => {
      // Color & Font formatting for Status column
      if (data.section === 'body' && data.column.index === 4) {
        if (data.cell.raw === '✓ Benar') {
          data.cell.styles.textColor = [5, 150, 105]; // emerald-600
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [225, 29, 72]; // rose-600
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // =========================================================================
  // 6. AVOID ORPHAN / WIDOW: CATATAN GURU & TANDA TANGAN
  // =========================================================================
  const lastTableY = (doc as any).lastAutoTable?.finalY || 160;
  const notesHeight = settings.showNotesBox ? 21 : 0;
  const signatureHeight = 35;
  const totalTrailingNeeded = notesHeight + signatureHeight + 10;

  // If trailing content doesn't fit on current page, cleanly move to a new page
  if (lastTableY + totalTrailingNeeded > bottomLimitY) {
    doc.addPage();
    currentY = 22;
  } else {
    currentY = lastTableY + 5;
  }

  // 6A. Kotak Catatan Guru & Evaluasi Hasil Belajar
  if (settings.showNotesBox) {
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, currentY, contentWidth, notesHeight, 1.5, 1.5, 'FD');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('CATATAN GURU & EVALUASI HASIL BELAJAR', margin + 3.5, currentY + 5);

    // Note content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85); // slate-700

    let fullNote = settings.teacherNotes || 'Pertahankan semangat belajar dan terus kembangkan kemampuan diri.';
    if (settings.autoGradeFeedback) {
      if (detail.score >= 85) {
        fullNote += ' • Apresiasi: Prestasi luar biasa! Pemahaman materi sangat baik dan memuaskan.';
      } else if (detail.score >= 70) {
        fullNote += ' • Catatan: Hasil baik dan tuntas. Tingkatkan ketelitian pada butir soal yang belum tepat.';
      } else {
        fullNote += ' • Evaluasi: Perlu latihan tambahan dan mengulang kembali materi yang belum dikuasai.';
      }
    }

    const splitNote = doc.splitTextToSize(fullNote, contentWidth - 7);
    doc.text(splitNote, margin + 3.5, currentY + 9.5);

    currentY += notesHeight + 5;
  } else {
    currentY += 4;
  }

  // 6B. Kolom Tanda Tangan Guru Pengampu
  const signX = 135; // width from 135 to 192 (57 mm)
  const signY = currentY + 2;

  // Extra guard in case of tight spacing
  if (signY + 30 > bottomLimitY) {
    doc.addPage();
    currentY = 22;
  }

  const resolvedDate = detail.date_formatted || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${settings.cityName || 'Kepanjen'}, ${resolvedDate}`, signX, signY);

  const roleText = resolved.teacherRole.endsWith(',') ? resolved.teacherRole : `${resolved.teacherRole},`;
  doc.text(roleText, signX, signY + 4.5);

  // Line for physical or stamp signature
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.2);
  doc.line(signX, signY + 22, signX + 52, signY + 22);

  // Teacher Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(settings.teacherName || 'Fahmi Ayatollah, S.Pd', signX, signY + 26);

  // NIP / School Identifier
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const nipLabel = settings.teacherNip && settings.teacherNip !== '-' ? `NIP/NUPTK. ${settings.teacherNip}` : 'SDI SAIQ AL-HIKMAH';
  doc.text(nipLabel, signX, signY + 29.5);

  // =========================================================================
  // 7. FOOTER RESMI DI SETIAP HALAMAN (Global Page Loop)
  // =========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Hairline divider above footer
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, 286, rightMarginX, 286);

    // Footer Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400

    doc.text(
      'Tugas Online SDI SAIQ AL-HIKMAH • Dokumen Resmi Hasil Assessment',
      margin,
      290.5
    );

    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      rightMarginX,
      290.5,
      { align: 'right' }
    );
  }

  return doc;
}

/**
 * Generate and trigger download of assessment results in A4 PDF format
 * for SDI SAIQ AL-HIKMAH.
 */
export function generateAssessmentPDF(
  detail: StudentSubmissionDetail,
  customSettings?: PDFSettings
): void {
  const doc = buildAssessmentPDFDocument(detail, customSettings);

  const cleanStudentName = detail.student_name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanAssessment = detail.assessment_title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Hasil_${cleanStudentName}_${cleanAssessment}.pdf`;

  doc.save(filename);
}
