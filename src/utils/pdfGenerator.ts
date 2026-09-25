import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { StudentSubmissionDetail } from '../types/database';

/**
 * Generate and trigger download of assessment results in A4 PDF format
 * for SDI SAIQ AL-HIKMAH
 */
export function generateAssessmentPDF(detail: StudentSubmissionDetail): void {
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
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('SDI SAIQ AL-HIKMAH', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text('HASIL ASSESSMENT PJOK', pageWidth / 2, 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Pendidikan Jasmani, Olahraga, dan Kesehatan • Platform Ujian Online Terpadu', pageWidth / 2, 27, { align: 'center' });

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
  let startY = 36;

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
  // 4. SIGNATURE / FOOTER SECTION
  // ----------------------------------------------------
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  
  // Check if signature fits on current page, otherwise add a new page
  if (finalY + 38 > pageHeight - 15) {
    doc.addPage();
  }

  const signY = (finalY + 38 > pageHeight - 15) ? 25 : finalY + 10;
  const signX = pageWidth - margin - 55;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Kepanjen, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, signX, signY);
  doc.text('Guru Pengampu PJOK,', signX, signY + 5);

  doc.setDrawColor(203, 213, 225);
  doc.line(signX, signY + 24, signX + 48, signY + 24);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Fahmi Ayatollah, S.Pd', signX, signY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NIP / NUPTK. SDI SAIQ AL-HIKMAH', signX, signY + 32);

  // ----------------------------------------------------
  // 5. DOWNLOAD PDF
  // ----------------------------------------------------
  const cleanStudentName = detail.student_name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanAssessment = detail.assessment_title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Hasil_PJOK_${cleanStudentName}_${cleanAssessment}.pdf`;

  doc.save(filename);
}
