import React from 'react';
import { 
  BookOpen, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  Award, 
  FileDown, 
  Laptop, 
  Check, 
  Star,
  GraduationCap,
  FileCheck2,
  Clock,
  School,
  Heart,
  HelpCircle,
  Eye
} from 'lucide-react';

const subjects = [
  { name: 'Bahasa Indonesia', desc: 'Literasi, Membaca & Menulis', icon: '📖', color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-900' },
  { name: 'Matematika', desc: 'Berhitung, Pola & Logika', icon: '📐', color: 'from-blue-500/10 to-cyan-500/10 border-blue-200 text-blue-900' },
  { name: 'IPAS', desc: 'Sains Alam & Lingkungan Sosial', icon: '🔬', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-900' },
  { name: 'Pendidikan Pancasila', desc: 'Nilai Karakter & Kebangsaan', icon: '🏛️', color: 'from-rose-500/10 to-red-500/10 border-rose-200 text-rose-900' },
  { name: 'Pendidikan Agama', desc: 'Iman, Doa & Budi Pekerti', icon: '🕌', color: 'from-teal-500/10 to-emerald-500/10 border-teal-200 text-teal-900' },
  { name: 'Bahasa Inggris', desc: 'Kosa Kata & Percakapan Seru', icon: '🇬🇧', color: 'from-indigo-500/10 to-violet-500/10 border-indigo-200 text-indigo-900' },
  { name: 'Seni & Budaya', desc: 'Kreativitas, Rupa & Musik', icon: '🎨', color: 'from-fuchsia-500/10 to-pink-500/10 border-fuchsia-200 text-fuchsia-900' },
  { name: 'PJOK', desc: 'Kebugaran, Jasmani & Kesehatan', icon: '🏃', color: 'from-lime-500/10 to-emerald-500/10 border-lime-200 text-lime-900' },
  { name: 'Muatan Lokal', desc: 'Budaya & Bahasa Daerah', icon: '📚', color: 'from-slate-500/10 to-slate-600/10 border-slate-200 text-slate-800' }
];

const platformFeatures = [
  {
    title: 'Tugas Online',
    desc: 'Kerjakan penugasan harian mandiri maupun kelompok dengan panduan soal terstruktur.',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700'
  },
  {
    title: 'Assessment Digital',
    desc: 'Pelaksanaan ujian formatif, sumatif, PTS, dan PAS dengan antarmuka yang ramah bagi siswa SD.',
    icon: GraduationCap,
    color: 'bg-teal-100 text-teal-700'
  },
  {
    title: 'Bank Soal Terpadu',
    desc: 'Ratusan pilihan materi latihan yang disusun sesuai capaian pembelajaran kurikulum sekolah.',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-700'
  },
  {
    title: 'Token Akses Reusable',
    desc: 'Satu kode token ujian praktis yang dapat dibagikan guru dan digunakan bersama seluruh murid di kelas.',
    icon: Key,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    title: 'Penilaian Otomatis',
    desc: 'Sistem langsung mengoreksi seluruh jawaban saat siswa selesai dan menampilkan skor secara instan.',
    icon: CheckCircle2,
    color: 'bg-indigo-100 text-indigo-700'
  },
  {
    title: 'Hasil Belajar Transparan',
    desc: 'Rincian setiap butir soal, pilihan siswa, kunci jawaban, dan status benar/salah tersimpan rapi.',
    icon: Eye,
    color: 'bg-sky-100 text-sky-700'
  },
  {
    title: 'Rekap Nilai Siswa',
    desc: 'Tabel daftar nilai lengkap untuk memudahkan bapak/ibu guru memantau kemajuan belajar kelas.',
    icon: Award,
    color: 'bg-violet-100 text-violet-700'
  },
  {
    title: 'PDF Hasil Assessment',
    desc: 'Cetak dan unduh lembar hasil belajar resmi dalam ukuran format A4 siap arsip dokumentasi sekolah.',
    icon: FileDown,
    color: 'bg-rose-100 text-rose-700'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 flex flex-col">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP NAVBAR                                        */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <a href="#/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-2 shadow-xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOM1FPnzn7IZ30L1OWuHrJjULToj1O5yDB4ubW-rtL4Kw-kl7lrRyDuwWwhxRfuO-KItBHtwiAJ6fPA4XT7eQy0gRKu9chyphenhyphenCfFWaFgx9uK4jqZDXZVYpm1iSvyx3YrB4nBHohI8koE-bO4JRm-4W8jexQl5QmBdP0ciVr-nvwvyYI2iOnnMkDPQng7jPZS/s100/1000741465.png" 
                alt="Logo SDI SAIQ AL-HIKMAH" 
                className="w-full h-full object-contain"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/100x100/059669/ffffff?text=SDI';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight leading-none">
                  Tugas Online
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Digital School
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1">SDI SAIQ AL-HIKMAH</p>
            </div>
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href="#/siswa"
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm border border-emerald-200 transition-all flex items-center"
            >
              <Users className="w-4 h-4 mr-1.5 text-emerald-600" />
              <span>Masuk Siswa</span>
            </a>
            <a 
              href="#/guru"
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-slate-900/10 flex items-center"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
              <span>Portal Guru</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ---------------------------------------------------- */}
        {/* 2. HERO SECTION                                      */}
        {/* ---------------------------------------------------- */}
        <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
          {/* Subtle Decorative Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-100/60 via-teal-50/40 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
          <div className="absolute top-36 -right-24 w-80 h-80 bg-blue-100/50 blur-3xl -z-10 pointer-events-none rounded-full" />

          <div className="max-w-6xl mx-auto">
            {/* Tagline Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/80 shadow-xs text-xs sm:text-sm font-bold text-emerald-800 animate-in fade-in zoom-in-95">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Platform Tugas & Assessment Digital • SDI SAIQ AL-HIKMAH</span>
              </div>
            </div>

            {/* Headline & Subheadline */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
                Belajar Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">Lebih Mudah</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-medium">
                Kerjakan tugas, ikuti assessment, dan pantau hasil belajar dalam satu platform. 
                Dirancang khusus untuk mendukung seluruh kegiatan belajar mengajar di SDI SAIQ AL-HIKMAH.
              </p>
            </div>

            {/* -------------------------------------------------- */}
            {/* DUA AKSI UTAMA (MAIN ACTION CARDS)                 */}
            {/* -------------------------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16">
              
              {/* CARD 1: MULAI BELAJAR (SISWA) */}
              <div className="relative bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/40 rounded-[2.2rem] p-7 sm:p-9 border-2 border-emerald-200 shadow-xl shadow-emerald-500/5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="absolute top-6 right-6">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                    Siswa
                  </span>
                </div>

                <div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                    Mulai Belajar
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                    Masukkan token tugas atau assessment yang diberikan oleh bapak/ibu guru untuk mulai mengerjakan soal.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Token Praktis
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Nilai Otomatis
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Bebas Ribet
                    </span>
                  </div>
                </div>

                <a 
                  href="#/siswa"
                  className="w-full min-h-[52px] py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center transition-all group-hover:shadow-emerald-600/35"
                >
                  <span>Masuk sebagai Siswa</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* CARD 2: PORTAL GURU */}
              <div className="relative bg-gradient-to-br from-white via-indigo-50/20 to-sky-50/40 rounded-[2.2rem] p-7 sm:p-9 border-2 border-slate-200 hover:border-indigo-300 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="absolute top-6 right-6">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-300 uppercase tracking-wider">
                    Pendidik
                  </span>
                </div>

                <div>
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                    Portal Guru
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                    Buat tugas, assessment, bagikan token ujian reusable, dan lihat rekap hasil belajar seluruh murid.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <Check className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Bank Soal SD
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <Check className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Token Reusable
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <Check className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Cetak PDF A4
                    </span>
                  </div>
                </div>

                <a 
                  href="#/guru"
                  className="w-full min-h-[52px] py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-slate-900/20 flex items-center justify-center transition-all group-hover:shadow-slate-900/30"
                >
                  <span>Masuk sebagai Guru</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

            {/* Visual Edukatif Siswa & Sekolah (Ilustrasi Belajar Digital) */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <Star className="w-7 h-7 fill-amber-400 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                      Ruang Belajar Digital Ramah Anak
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                      Tampilan ceria, tombol jelas, dan mudah dioperasikan dari HP orang tua maupun tablet siswa.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="block text-xs font-bold text-slate-400">Kelas</span>
                    <span className="text-sm font-extrabold text-slate-800">1 s/d 6 SD</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="block text-xs font-bold text-emerald-600">Akses</span>
                    <span className="text-sm font-extrabold text-emerald-800">Token Instan</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 3. SECTION UNTUK SEMUA MATA PELAJARAN               */}
        {/* ---------------------------------------------------- */}
        <section className="py-14 sm:py-20 bg-white border-y border-slate-200/70 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Kurikulum Terpadu
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3 mb-3">
                Untuk Semua Mata Pelajaran
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium">
                Platform terbuka untuk seluruh bapak/ibu guru pengampu mata pelajaran di SDI SAIQ AL-HIKMAH dengan posisi yang setara.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {subjects.map((sub, idx) => (
                <div 
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${sub.color} border transition-all hover:scale-[1.02] flex items-start gap-3.5`}
                >
                  <span className="text-2xl sm:text-3xl select-none" role="img" aria-label={sub.name}>
                    {sub.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                      {sub.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 leading-snug">
                      {sub.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 4. SECTION FITUR PLATFORM                            */}
        {/* ---------------------------------------------------- */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
                Fitur Lengkap
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3 mb-3">
                Semua Kebutuhan Belajar dalam Satu Platform
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium">
                Berbagai fasilitas digital yang telah aktif dan siap digunakan untuk mendukung asesmen berkualitas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {platformFeatures.map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-4`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 5. SECTION UNTUK SISWA                               */}
        {/* ---------------------------------------------------- */}
        <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-700 rounded-[2.5rem] p-8 sm:p-14 text-white shadow-xl shadow-emerald-600/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

              <div className="relative z-10 max-w-2xl mb-12">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black bg-white/20 text-emerald-50 border border-white/30 uppercase tracking-widest mb-3">
                  Panduan Siswa
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                  Belajar Tanpa Ribet
                </h2>
                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-medium">
                  Masukkan token dari guru, kerjakan tugas, dan selesaikan assessment dengan mudah langsung dari gawai.
                </p>
              </div>

              {/* 3 Langkah Siswa */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/25">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 font-black text-lg flex items-center justify-center mb-4 shadow-xs">
                    1
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1.5">Masukkan Token</h3>
                  <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                    Terima 6 karakter token ujian dari guru, masukkan di portal siswa tanpa perlu pendaftaran akun rumit.
                  </p>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/25">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 font-black text-lg flex items-center justify-center mb-4 shadow-xs">
                    2
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1.5">Kerjakan Soal</h3>
                  <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                    Isi nama dan kelas, lalu jawab soal satu per satu. Jawaban otomatis tersimpan secara real-time.
                  </p>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/25">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 font-black text-lg flex items-center justify-center mb-4 shadow-xs">
                    3
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1.5">Selesai & Terdata</h3>
                  <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                    Tekan tombol kumpul setelah selesai. Skor otomatis dikoreksi dan tersimpan di database guru.
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-emerald-100 font-medium text-center sm:text-left">
                  Sudah memiliki token ujian dari bapak/ibu guru hari ini?
                </p>
                <a 
                  href="#/siswa"
                  className="px-6 py-3.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 font-bold text-sm transition-all shadow-md flex items-center whitespace-nowrap"
                >
                  <span>Mulai Kerjakan Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-emerald-700" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 6. SECTION UNTUK GURU                                */}
        {/* ---------------------------------------------------- */}
        <section className="py-16 sm:py-24 bg-slate-50 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-5">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
                  Untuk Pendidik
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3 mb-4">
                  Guru Mengajar, Platform Membantu
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                  Guru dapat membuat tugas dan assessment, membagikannya kepada siswa, serta memantau hasil belajar dalam satu tempat.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Buat Assessment Cepat</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Tarik soal dari Bank Soal Nasional atau input soal mandiri dengan bobot poin.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Token Ujian Reusable</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Satu token dibagikan ke seluruh kelas. Tidak perlu input kode satu per satu.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Unduh Dokumen PDF A4</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Cetak lembar rincian jawaban murid lengkap dengan kop sekolah untuk dokumentasi.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a 
                    href="#/guru"
                    className="inline-flex items-center px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <span>Buka Portal Guru</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>

              {/* Mockup Dashboard Guru (Visual Ilustratif) */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 relative">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-400 ml-2">Portal Guru • SDI SAIQ AL-HIKMAH</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                      Visual Ilustratif
                    </span>
                  </div>

                  {/* Mockup Card Stat */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <span className="text-[11px] font-bold text-emerald-700 block">Assessment</span>
                      <span className="text-xl font-black text-emerald-950">Aktif</span>
                    </div>
                    <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <span className="text-[11px] font-bold text-indigo-700 block">Token Kelas</span>
                      <span className="text-xl font-black text-indigo-950 font-mono">XXXXXX</span>
                    </div>
                    <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
                      <span className="text-[11px] font-bold text-blue-700 block">Koreksi</span>
                      <span className="text-xl font-black text-blue-950">Otomatis</span>
                    </div>
                  </div>

                  {/* Mockup Table */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-400 px-3 py-2 border-b border-slate-200/60">
                      <span>Nama Murid</span>
                      <span>Kelas</span>
                      <span>Nilai</span>
                      <span>Aksi</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      <div className="flex justify-between items-center px-3 py-2.5 font-medium text-slate-700">
                        <span className="font-bold text-slate-800">Siswa Teladan</span>
                        <span>Kelas 4</span>
                        <span className="font-black text-emerald-600 text-sm">95</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">Cetak PDF</span>
                      </div>
                      <div className="flex justify-between items-center px-3 py-2.5 font-medium text-slate-700">
                        <span className="font-bold text-slate-800">Siswa Berprestasi</span>
                        <span>Kelas 4</span>
                        <span className="font-black text-emerald-600 text-sm">90</span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg">Detail</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center mt-4 font-medium italic">
                    * Antarmuka nyata dapat diakses dengan kata sandi guru pengampu.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------- */}
      {/* 7. FOOTER                                            */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200/80 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1.5 shadow-2xs flex items-center justify-center">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOM1FPnzn7IZ30L1OWuHrJjULToj1O5yDB4ubW-rtL4Kw-kl7lrRyDuwWwhxRfuO-KItBHtwiAJ6fPA4XT7eQy0gRKu9chyphenhyphenCfFWaFgx9uK4jqZDXZVYpm1iSvyx3YrB4nBHohI8koE-bO4JRm-4W8jexQl5QmBdP0ciVr-nvwvyYI2iOnnMkDPQng7jPZS/s100/1000741465.png" 
                alt="Logo SDI SAIQ AL-HIKMAH" 
                className="w-full h-full object-contain"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/100x100/059669/ffffff?text=SDI';
                }}
              />
            </div>
            <div>
              <p className="font-black text-slate-900 text-base leading-tight">Tugas Online</p>
              <p className="text-xs text-slate-500 font-semibold">SDI SAIQ AL-HIKMAH</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-bold text-slate-600">
            <a href="#/" className="hover:text-emerald-600 transition-colors">Beranda</a>
            <a href="#/siswa" className="hover:text-emerald-600 transition-colors">Portal Siswa</a>
            <a href="#/guru" className="hover:text-emerald-600 transition-colors">Portal Guru</a>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} SDI SAIQ AL-HIKMAH.</p>
            <p className="mt-0.5">Platform Tugas & Assessment Digital.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
