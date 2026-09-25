import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, PlusCircle, Users, CheckCircle2, 
  ArrowRight, Save, LogOut, Loader2, Link as LinkIcon, 
  AlertCircle, Trash2, HelpCircle, Check, Copy, Settings, 
  Key, RefreshCw, Award, Activity, Clock, ShieldCheck, 
  ChevronRight, Sparkles, X, Play, Hash, Lock,
  FileDown, Eye, FileText, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';

import { dataService } from './DataService';
import { generateAssessmentPDF } from './utils/pdfGenerator';
import type { StudentSubmissionDetail } from './types/database';
import LandingPage from './components/LandingPage';


function Modal({ children, onClose, title, maxWidth = 'max-w-md' }: { children: React.ReactNode; onClose: () => void; title: string; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${maxWidth} my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100`}>
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/70">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}


const localQuestionBank = {
  "Kelas 1 - Pertemuan 1: Gerak Dasar Lokomotor & Non-Lokomotor": [
    { text: "Berjalan memindahkan tubuh ke depan disebut gerak...", options: ["Manipulatif", "Lokomotor", "Non-lokomotor", "Keseimbangan"], correctOption: 1 },
    { text: "Gerakan membungkuk tanpa berpindah tempat termasuk gerak...", options: ["Non-lokomotor", "Lokomotor", "Manipulatif", "Berirama"], correctOption: 0 },
    { text: "Melompat ke depan sejauh-jauhnya bertumpu pada...", options: ["Dua kaki", "Satu kaki", "Kedua tangan", "Lutut"], correctOption: 1 },
    { text: "Gerakan meliukkan badan bertujuan untuk melatih...", options: ["Kekuatan", "Kelenturan", "Kecepatan", "Ketepatan"], correctOption: 1 },
    { text: "Saat berlari, posisi badan yang benar adalah...", options: ["Condong ke belakang", "Condong ke depan", "Tegak lurus", "Membungkuk"], correctOption: 1 },
    { text: "Mengayunkan lengan ke depan dan belakang termasuk gerak...", options: ["Lokomotor", "Berpindah tempat", "Non-lokomotor", "Manipulatif"], correctOption: 2 },
    { text: "Sebelum berolahraga, kita wajib melakukan...", options: ["Pemanasan", "Pendinginan", "Makan", "Minum es"], correctOption: 0 },
    { text: "Pemanasan berguna untuk mencegah...", options: ["Keringat", "Cedera", "Haus", "Lapar"], correctOption: 1 },
    { text: "Menirukan gerak katak melompat melatih kekuatan otot...", options: ["Tangan", "Perut", "Kaki", "Leher"], correctOption: 2 },
    { text: "Berjalan mundur berarti melangkah ke arah...", options: ["Depan", "Samping", "Belakang", "Serong"], correctOption: 2 },
    { text: "Menekuk lutut sambil berdiri melatih kekuatan...", options: ["Kaki", "Tangan", "Punggung", "Perut"], correctOption: 0 },
    { text: "Contoh gerak berpindah tempat adalah...", options: ["Jalan di tempat", "Berlari", "Mengangguk", "Meliuk"], correctOption: 1 },
    { text: "Sikap awal saat akan melakukan jalan cepat adalah...", options: ["Duduk", "Jongkok", "Berdiri tegak", "Berbaring"], correctOption: 2 },
    { text: "Membungkukkan badan menyentuh ujung kaki melatih otot...", options: ["Punggung dan kaki", "Leher", "Tangan", "Dada"], correctOption: 0 },
    { text: "Pandangan mata saat berjalan tegak ke depan adalah...", options: ["Ke bawah", "Ke atas", "Lurus ke depan", "Ke samping"], correctOption: 2 },
    { text: "Bermain kejar-kejaran menggunakan gerak dasar...", options: ["Lari", "Meliuk", "Menekuk", "Jalan santai"], correctOption: 0 },
    { text: "Setelah berolahraga kita harus melakukan...", options: ["Pemanasan", "Pendinginan", "Tidur", "Mandi langsung"], correctOption: 1 },
    { text: "Pakaian olahraga harus terbuat dari bahan yang...", options: ["Menyerap keringat", "Keras", "Tebal", "Tahan air"], correctOption: 0 },
    { text: "Mendorong tembok melatih kekuatan...", options: ["Kaki", "Tangan dan bahu", "Leher", "Perut"], correctOption: 1 },
    { text: "Gerakan memutar kepala berguna untuk melemaskan otot...", options: ["Leher", "Tangan", "Kaki", "Pinggang"], correctOption: 0 },
    { text: "Saat melompat, mendarat yang aman menggunakan...", options: ["Satu kaki kaku", "Dua kaki mengeper", "Tumit", "Lutut"], correctOption: 1 },
    { text: "Lari zig-zag adalah lari yang jalurnya...", options: ["Lurus", "Berkelok-kelok", "Mundur", "Di tempat"], correctOption: 1 },
    { text: "Agar tubuh sehat kita harus olahraga secara...", options: ["Jarang", "Teratur", "Setiap menit", "Sebulan sekali"], correctOption: 1 },
    { text: "Mengayun kaki ke depan dan ke belakang melatih kelenturan...", options: ["Tangan", "Sendi paha/pinggul", "Leher", "Bahu"], correctOption: 1 },
    { text: "Saat cuaca panas, sebaiknya kita berolahraga di...", options: ["Tengah lapangan tanpa topi", "Tempat teduh", "Dalam air mendidih", "Jalan raya"], correctOption: 1 },
    { text: "Latihan keseimbangan dapat dilakukan dengan cara...", options: ["Berlari cepat", "Berdiri satu kaki", "Tidur terlentang", "Makan"], correctOption: 1 },
    { text: "Sepatu olahraga dipakai untuk melindungi...", options: ["Tangan", "Kaki", "Kepala", "Lutut"], correctOption: 1 },
    { text: "Berjalan jinjit berarti berjalan menggunakan...", options: ["Tumit", "Ujung kaki", "Samping kaki", "Telapak tangan"], correctOption: 1 },
    { text: "Lomba balap karung dominan menggunakan gerakan...", options: ["Berjalan", "Lari", "Melompat", "Merayap"], correctOption: 2 },
    { text: "Bernapas saat berlari yang baik sebaiknya melalui...", options: ["Mulut", "Hidung", "Perut", "Telinga"], correctOption: 1 }
  ],
  "Kelas 4 - Pertemuan 1: Permainan Bola Besar & P3K": [
    { text: "Permainan bola voli diciptakan oleh...", options: ["James Naismith", "William G. Morgan", "Ebenezer Morley", "Dr. Gulick"], correctOption: 1 },
    { text: "Jumlah pemain satu regu dalam permainan bola voli mini adalah...", options: ["4 orang", "5 orang", "6 orang", "11 orang"], correctOption: 0 },
    { text: "Teknik memantulkan bola ke atas dengan merapatkan kedua tangan dari bawah disebut...", options: ["Smash", "Servis", "Passing bawah", "Passing atas"], correctOption: 2 },
    { text: "Tendangan pertama untuk memulai pertandingan sepak bola disebut...", options: ["Offside", "Kick-off", "Corner kick", "Penalty"], correctOption: 1 },
    { text: "Anggota tubuh yang TIDAK boleh digunakan oleh pemain bola voli adalah...", options: ["Kaki", "Kepala", "Tidak ada, semua boleh", "Tangan"], correctOption: 2 },
    { text: "Induk organisasi sepak bola di Indonesia adalah...", options: ["PSSI", "PBVSI", "PERBASI", "PASI"], correctOption: 0 },
    { text: "Dalam sepak bola, pemain yang bertugas khusus menjaga gawang adalah...", options: ["Striker", "Defender", "Midfielder", "Goalkeeper"], correctOption: 3 },
    { text: "Menggiring bola dalam permainan sepak bola disebut...", options: ["Passing", "Shooting", "Dribbling", "Heading"], correctOption: 2 },
    { text: "Pukulan keras menukik ke lapangan lawan dalam bola voli disebut...", options: ["Servis", "Smash / Spike", "Block", "Passing"], correctOption: 1 },
    { text: "Ukuran lapangan sepak bola mini untuk SD biasanya memiliki panjang sekitar...", options: ["90-120 m", "25-40 m", "10-15 m", "200 m"], correctOption: 1 },
    { text: "Pertolongan Pertama Pada Kecelakaan disingkat menjadi...", options: ["P2K", "P3K", "P4K", "PMI"], correctOption: 1 },
    { text: "Benda di bawah ini wajib ada di dalam kotak P3K, KECUALI...", options: ["Kasa steril", "Plester", "Gunting", "Cokelat"], correctOption: 3 },
    { text: "Jika teman mengalami luka lecet akibat terjatuh, langkah pertama adalah...", options: ["Memberi obat merah", "Membersihkan luka dengan air", "Dibiarkan saja", "Ditutup plastik"], correctOption: 1 },
    { text: "Kain mitela pada P3K bentuknya berupa kain...", options: ["Segi empat", "Segi tiga", "Bulat", "Persegi panjang"], correctOption: 1 },
    { text: "Obat yang sering digunakan untuk membersihkan luka dan mencegah infeksi adalah...", options: ["Sirup", "Rivanol / Betadine", "Balsem panas", "Obat tetes mata"], correctOption: 1 },
    { text: "Teknik menendang bola ke arah gawang untuk mencetak gol disebut...", options: ["Dribbling", "Shooting", "Passing", "Throw-in"], correctOption: 1 },
    { text: "Jika bola sepak keluar melalui garis samping lapangan, maka dilakukan...", options: ["Tendangan sudut", "Tendangan bebas", "Lemparan ke dalam (Throw-in)", "Tendangan gawang"], correctOption: 2 },
    { text: "Servis dalam bola voli mini biasanya dilakukan dari...", options: ["Tengah lapangan", "Garis belakang lapangan", "Dekat net", "Luar stadion"], correctOption: 1 },
    { text: "Passing atas dalam bola voli dominan menggunakan...", options: ["Telapak tangan terbuka", "Ujung jari-jari tangan", "Kepalan tangan", "Lengan bawah"], correctOption: 1 },
    { text: "Berapa poin yang harus dicapai sebuah tim voli untuk memenangkan satu set (rally point)?", options: ["15", "21", "25", "30"], correctOption: 2 },
    { text: "Pendarahan pada hidung (mimisan) dapat ditolong dengan cara...", options: ["Tunduk, tekan hidung", "Mendongak ke atas kuat", "Dimasukkan air", "Diikat dengan kain"], correctOption: 0 },
    { text: "Untuk merekatkan perban atau kasa pada kulit digunakan...", options: ["Lem kertas", "Plester medis", "Karet gelang", "Tali rafia"], correctOption: 1 },
    { text: "Mengontrol bola dalam sepak bola menggunakan telapak kaki disebut...", options: ["Heading", "Dribbling", "Trapping", "Tackling"], correctOption: 2 },
    { text: "Pemain sepak bola mini setiap regunya berjumlah...", options: ["5 atau 7 orang", "11 orang", "6 orang", "9 orang"], correctOption: 0 },
    { text: "Menyundul bola dalam sepak bola menggunakan bagian...", options: ["Ubun-ubun", "Dahi", "Belakang kepala", "Hidung"], correctOption: 1 },
    { text: "Tujuan utama permainan bola voli adalah...", options: ["Menjatuhkan bola di lapangan lawan", "Mencetak gol ke gawang", "Memasukkan bola ke keranjang", "Melempar bola sejauh mungkin"], correctOption: 0 },
    { text: "Saat kaki kram, pertolongan pertama yang dilakukan adalah...", options: ["Diluruskan dan diregangkan perlahan", "Ditekuk dengan kuat", "Dipukul-pukul", "Diberi es balok"], correctOption: 0 },
    { text: "Salah satu fungsi bidai (spalk) pada P3K adalah untuk...", options: ["Menyembuhkan luka", "Menyangga tulang diduga patah", "Menghangatkan tubuh", "Membersihkan darah"], correctOption: 1 },
    { text: "Bermain sepak bola sangat bermanfaat untuk meningkatkan kerja...", options: ["Mata dan telinga", "Jantung dan paru-paru", "Lambung", "Ginjal"], correctOption: 1 },
    { text: "Sikap sportif dalam olahraga berarti...", options: ["Marah saat kalah", "Menerima kekalahan dan menghargai lawan", "Mencurangi aturan", "Menyalahkan wasit"], correctOption: 1 }
  ],
  "Kelas 6 - Pertemuan 1: Atletik & Bahaya Zat Adiktif": [
    { text: "Start yang digunakan pada nomor lari jarak pendek (sprint) adalah...", options: ["Start berdiri", "Start melayang", "Start jongkok", "Start duduk"], correctOption: 2 },
    { text: "Lari sambung menggunakan tongkat disebut dengan lari...", options: ["Maraton", "Estafet", "Halang rintang", "Sprint"], correctOption: 1 },
    { text: "Alat yang dilempar pada modifikasi olahraga lempar lembing anak SD adalah...", options: ["Tolak peluru", "Cakram", "Roket / Turbo", "Gada"], correctOption: 2 },
    { text: "Induk organisasi atletik di Indonesia adalah...", options: ["PASI", "PSSI", "PBSI", "PERBASI"], correctOption: 0 },
    { text: "Kombinasi gerak lari, melompat, dan mendarat terdapat pada olahraga...", options: ["Lompat jauh", "Lempar roket", "Tolak peluru", "Jalan cepat"], correctOption: 0 },
    { text: "Gaya lompat jauh dimana saat di udara posisi badan seperti orang berjalan disebut...", options: ["Jongkok", "Menggantung", "Berjalan di udara", "Guling perut"], correctOption: 2 },
    { text: "Berikut ini yang termasuk Narkotika adalah...", options: ["Paracetamol", "Ganja, Sabu, Heroin", "Amoxicillin", "Vitamin C"], correctOption: 1 },
    { text: "Bahaya mengkonsumsi Narkoba bagi sistem saraf adalah...", options: ["Membuat pintar", "Merusak sel otak", "Menyembuhkan sakit kepala", "Meningkatkan daya ingat"], correctOption: 1 },
    { text: "Minuman keras (Miras) berbahaya karena mengandung zat memabukkan yaitu...", options: ["Alkohol", "Nikotin", "Kafein", "Kalsium"], correctOption: 0 },
    { text: "Sikap terbaik jika ada teman yang menawari rokok atau narkoba adalah...", options: ["Mencoba sedikit", "Menolak dengan tegas", "Disimpan dulu", "Ikut-ikutan"], correctOption: 1 },
    { text: "Latihan lari berkeliling melewati pos-pos latihan berguna untuk melatih...", options: ["Kebugaran keseluruhan", "Hanya otot jari", "Hanya pernapasan hidung", "Kekuatan leher"], correctOption: 0 },
    { text: "Teknik menerima tongkat estafet tanpa menoleh ke arah pemberi disebut...", options: ["Visual", "Non-visual", "Campuran", "Lemparan"], correctOption: 1 },
    { text: "Lompat jauh diawali dengan gerakan...", options: ["Tolakan", "Awalan (Berlari)", "Sikap di udara", "Mendarat"], correctOption: 1 },
    { text: "Mendarat yang benar pada bak lompat jauh menggunakan...", options: ["Satu kaki", "Kedua kaki secara bersamaan", "Pantat", "Tangan"], correctOption: 1 },
    { text: "Zat adiktif pada rokok yang membuat paru-paru hitam dan memicu kanker adalah...", options: ["Tar", "Nikotin", "Oksigen", "Hidrogen"], correctOption: 0 },
    { text: "Karbon monoksida pada asap rokok sangat berbahaya karena...", options: ["Membuat wangi", "Mengikat sel darah merah", "Menambah darah", "Memperkuat paru-paru"], correctOption: 1 },
    { text: "Jarak lari estafet yang sering dilombakan di tingkat SD biasanya adalah...", options: ["4 x 1000 meter", "4 x 400 meter", "4 x 50 / 4 x 80 meter", "4 x 10 meter"], correctOption: 2 },
    { text: "Sudut sektor tolakan pada lapangan tolak peluru adalah...", options: ["90 derajat", "45 derajat", "34,92 derajat", "180 derajat"], correctOption: 2 },
    { text: "Posisi badan saat aba-aba 'Bersedia' pada start jongkok adalah...", options: ["Berdiri tegak", "Jongkok satu lutut di tanah", "Pinggul diangkat", "Lari secepatnya"], correctOption: 1 },
    { text: "Aba-aba start jongkok secara berurutan adalah...", options: ["Siap, Ya, Bersedia", "Bersedia, Siap, Ya", "Ya, Bersedia, Siap", "Lari, Siap, Mulai"], correctOption: 1 },
    { text: "Narkoba merupakan singkatan dari...", options: ["Narkotika, Psikotropika, Bahan Adiktif", "Narkotika dan Obat Berbahaya", "Narkotika dan Obat Alami", "Narkotika dan Bahan Kimia"], correctOption: 0 },
    { text: "Perilaku hidup sehat terbebas dari narkoba dapat dilakukan dengan...", options: ["Suka keluyuran", "Olahraga rutin", "Menyendiri di kamar", "Bergaul tanpa batas"], correctOption: 1 },
    { text: "Lempar turbo atau roket menggabungkan gerak...", options: ["Lari, jingkat, tolak", "Jalan, lari, melempar", "Lompat, guling, lari", "Lompat, tangkap, lempar"], correctOption: 1 },
    { text: "Tujuan melakukan olahraga atletik secara rutin bagi anak sekolah adalah...", options: ["Mendapat uang", "Meningkatkan pertumbuhan tulang dan otot", "Menjadi malas belajar", "Agar bisa berkelahi"], correctOption: 1 },
    { text: "Merokok sangat dilarang bagi pelajar karena...", options: ["Harganya mahal", "Merusak kesehatan", "Dilarang orang tua", "Semua jawaban benar"], correctOption: 3 },
    { text: "Zat di dalam kopi dan teh yang jika berlebihan bisa membuat jantung berdebar...", options: ["Nikotin", "Alkohol", "Kafein", "Tar"], correctOption: 2 },
    { text: "Salah satu cara mendarat yang salah dan berbahaya pada lompat jauh adalah...", options: ["Lutut mengeper", "Badan condong ke depan", "Tangan di belakang badan", "Jatuh ke depan"], correctOption: 2 },
    { text: "Alat yang digunakan wasit untuk membunyikan aba-aba 'Ya' pada lari adalah...", options: ["Pistol start / Peluit", "Gendang", "Sirine mobil", "Teriakan penonton"], correctOption: 0 },
    { text: "Pada lempar roket, sudut lemparan yang baik agar roket meluncur jauh adalah...", options: ["10 derajat", "90 derajat", "45 derajat", "180 derajat"], correctOption: 2 },
    { text: "Dampak sosial pelajar yang menyalahgunakan narkoba adalah...", options: ["Dibanggakan teman", "Dikucilkan dari lingkungan", "Diberi hadiah", "Menjadi ketua kelas"], correctOption: 1 }
  ]
};

function TeacherCreateAssessment({ dataService, showToast, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetClass, setTargetClass] = useState('Kelas 4');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctOption: 0, points: 10 }]);
  const [loading, setLoading] = useState(false);
  
  const [selectedTopic, setSelectedTopic] = useState(Object.keys(localQuestionBank)[0]);
  const [bankCount, setBankCount] = useState(10); 
  
  const maxAvailable = localQuestionBank[selectedTopic]?.length || 0;

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    if (topic.includes('Kelas 1')) setTargetClass('Kelas 1');
    else if (topic.includes('Kelas 2')) setTargetClass('Kelas 2');
    else if (topic.includes('Kelas 3')) setTargetClass('Kelas 3');
    else if (topic.includes('Kelas 4')) setTargetClass('Kelas 4');
    else if (topic.includes('Kelas 5')) setTargetClass('Kelas 5');
    else if (topic.includes('Kelas 6')) setTargetClass('Kelas 6');
  };

  const handleGenerateFromBank = () => {
    const availableQuestions = localQuestionBank[selectedTopic];
    if (!availableQuestions || availableQuestions.length === 0) {
      return showToast('Materi belum tersedia di bank soal.', 'error');
    }

    const validCount = Math.min(bankCount, availableQuestions.length);
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, validCount).map(q => ({
      ...q,
      points: 10
    }));
    
    const currentList = questions.length === 1 && !questions[0].text ? [] : questions;
    setQuestions([...currentList, ...selected]);
    
    if (!title) setTitle(`Latihan: ${selectedTopic.split(':')[1]?.trim() || selectedTopic}`);
    showToast(`${selected.length} Soal berhasil ditambahkan!`, 'success');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title) return showToast('Judul wajib diisi', 'error');
    
    const isValid = questions.every(q => q.text && q.options.every(o => o.trim() !== ''));
    if (!isValid) return showToast('Pastikan semua pertanyaan dan pilihan jawaban terisi', 'error');

    setLoading(true);
    try {
      await dataService.createAssessment(title, description, questions, targetClass);
      showToast('Assessment berhasil disimpan!', 'success');
      onSuccess();
    } catch (err: any) {
      showToast(err?.message || 'Gagal menyimpan assessment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = questions.reduce((acc, q) => acc + (Number(q.points) > 0 ? Number(q.points) : 10), 0);

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Buat Assessment Baru</h2>
        
        <div className="space-y-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Assessment</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Contoh: UTS PJOK Kelas 4" 
                className="w-full p-3 sm:p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Kelas</label>
              <select 
                value={targetClass} 
                onChange={(e) => setTargetClass(e.target.value)} 
                className="w-full p-3.5 sm:p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base bg-white font-medium text-slate-700"
              >
                <option value="Kelas 1">Kelas 1</option>
                <option value="Kelas 2">Kelas 2</option>
                <option value="Kelas 3">Kelas 3</option>
                <option value="Kelas 4">Kelas 4</option>
                <option value="Kelas 5">Kelas 5</option>
                <option value="Kelas 6">Kelas 6</option>
                <option value="Semua Kelas">Semua Kelas</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi / Petunjuk</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Petunjuk pengerjaan ujian..." 
              className="w-full p-3 sm:p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base font-medium" 
              rows={2} 
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-5 sm:p-6 rounded-3xl border border-emerald-100 mb-8 shadow-sm">
          <div className="flex items-center mb-5">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 text-lg">Bank Soal Nasional</h3>
              <p className="text-emerald-700 text-xs sm:text-sm">Tarik soal acak sesuai Kurikulum SD</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <select 
              value={selectedTopic} 
              onChange={(e) => handleTopicChange(e.target.value)} 
              className="flex-1 p-3.5 border-0 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/20 text-slate-700 bg-white font-medium text-sm sm:text-base appearance-none truncate"
            >
              {Object.keys(localQuestionBank).map((topic) => (
                <option key={topic} value={topic}>{topic} ({localQuestionBank[topic].length} Soal Tersedia)</option>
              ))}
            </select>
            
            <div className="flex gap-3">
              <div className="relative group flex-shrink-0 w-24 sm:w-32">
                <input 
                  type="number" 
                  min="1" 
                  max={maxAvailable} 
                  value={bankCount} 
                  onChange={(e) => {
                    let val = parseInt(e.target.value) || 1;
                    if (val > maxAvailable) val = maxAvailable; 
                    setBankCount(val);
                  }} 
                  className="w-full p-3.5 border-0 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/20 text-center font-bold text-slate-700 bg-white" 
                  title={`Maksimal ${maxAvailable} Soal`}
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-10">
                  Maks: {maxAvailable} Soal
                </span>
              </div>
              <button 
                type="button" 
                onClick={handleGenerateFromBank} 
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl flex justify-center items-center transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
              >
                Ambil Soal
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
            <h3 className="font-bold text-slate-800 text-lg">
              Daftar Pertanyaan <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-sm ml-2">{questions.length}</span>
            </h3>
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center">
              <span>Total Bobot: </span>
              <span className="font-black text-emerald-950 ml-1.5">{totalPoints} Poin</span>
            </div>
          </div>
          
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="p-4 sm:p-6 border border-slate-200 rounded-3xl bg-slate-50 relative group transition-all hover:border-slate-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-200 px-3 py-1 rounded-full">Soal {qIdx + 1}</label>
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-xs">
                    <span className="text-slate-400">Bobot:</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="100" 
                      value={q.points !== undefined ? q.points : 10} 
                      onChange={(e) => {
                        const newQ = [...questions];
                        newQ[qIdx].points = parseInt(e.target.value) || 0;
                        setQuestions(newQ);
                      }}
                      className="w-12 text-center bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-slate-500">Poin</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors sm:absolute sm:top-4 sm:right-4"
                  title="Hapus Soal"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-5 sm:pr-12">
                <textarea
                  value={q.text}
                  onChange={(e) => { const newQ = [...questions]; newQ[qIdx].text = e.target.value; setQuestions(newQ); }}
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white font-medium text-slate-800 resize-none"
                  rows={2} placeholder="Tuliskan pertanyaan di sini..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className={`flex items-center p-2 sm:p-3 rounded-2xl border-2 transition-colors ${q.correctOption === optIdx ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correctOption === optIdx}
                      onChange={() => { const newQ = [...questions]; newQ[qIdx].correctOption = optIdx; setQuestions(newQ); }}
                      className="w-5 h-5 text-emerald-600 mx-2 sm:mx-3 cursor-pointer focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => { const newQ = [...questions]; newQ[qIdx].options[optIdx] = e.target.value; setQuestions(newQ); }}
                      placeholder={`Pilihan ${['A', 'B', 'C', 'D'][optIdx]}`}
                      className="flex-1 bg-transparent outline-none py-1 text-sm sm:text-base text-slate-700 w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button 
            type="button" 
            onClick={() => setQuestions([...questions, { text: '', options: ['', '', '', ''], correctOption: 0, points: 10 }])}
            className="flex-1 px-4 py-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-bold rounded-2xl flex items-center justify-center transition-all"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Tambah Soal Manual
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={loading}
            className="flex-1 px-4 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 active:scale-[0.98] text-white font-bold rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30 text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Save className="w-6 h-6 mr-2" />} 
            Simpan Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentDetailModal({ sessionId, onClose, showToast, onDownloadPDF, pdfLoading }) {
  const [detail, setDetail] = useState<StudentSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await dataService.getSessionDetails(sessionId);
        setDetail(res);
      } catch (err: any) {
        showToast(err?.message || 'Gagal memuat detail jawaban.', 'error');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [sessionId]);

  return (
    <Modal title="Detail Hasil Assessment Siswa" onClose={onClose} maxWidth="max-w-4xl">
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Memuat detail pengerjaan...</p>
        </div>
      ) : detail ? (
        <div className="space-y-6">
          {/* Header Identitas Siswa */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-slate-400 text-xs block font-bold uppercase">Nama Siswa</span>
                <span className="font-bold text-slate-800 text-base">{detail.student_name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block font-bold uppercase">Kelas</span>
                <span className="font-bold text-slate-800 text-base">{detail.student_class}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block font-bold uppercase">Assessment</span>
                <span className="font-bold text-slate-800 text-base truncate block" title={detail.assessment_title}>{detail.assessment_title}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block font-bold uppercase">Tanggal</span>
                <span className="font-medium text-slate-700">{detail.date_formatted}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block font-bold uppercase">Waktu Pengerjaan</span>
                <span className="font-medium text-slate-700">{detail.duration_text}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block font-bold uppercase">Token Ujian</span>
                <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">{detail.token}</span>
              </div>
            </div>
          </div>

          {/* Kartu Ringkasan Nilai */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center">
              <span className="text-xs font-bold text-emerald-700 uppercase block mb-1">Nilai Akhir</span>
              <span className="text-3xl font-black text-emerald-600">{detail.score}</span>
              <span className="text-[11px] text-emerald-600/70 block">dari 100</span>
            </div>
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-center">
              <span className="text-xs font-bold text-teal-700 uppercase block mb-1">Jumlah Soal</span>
              <span className="text-3xl font-black text-teal-800">{detail.total_questions}</span>
              <span className="text-[11px] text-teal-600/70 block">Butir</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-center">
              <span className="text-xs font-bold text-blue-700 uppercase block mb-1">Jawaban Benar</span>
              <span className="text-3xl font-black text-blue-600">{detail.total_correct}</span>
              <span className="text-[11px] text-blue-600/70 block">Soal</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-center">
              <span className="text-xs font-bold text-rose-700 uppercase block mb-1">Jawaban Salah</span>
              <span className="text-3xl font-black text-rose-600">{detail.total_incorrect}</span>
              <span className="text-[11px] text-rose-600/70 block">Soal</span>
            </div>
          </div>

          {/* Detail Jawaban Per Nomor Soal */}
          <div>
            <h4 className="font-bold text-slate-800 text-base mb-3 flex items-center justify-between">
              <span>Rincian Seluruh Jawaban ({detail.items.length} Soal)</span>
            </h4>
            <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
              {detail.items.map((item) => (
                <div 
                  key={item.question_number} 
                  className={`p-4 rounded-2xl border transition-all ${
                    item.is_correct 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                      Soal {item.question_number}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center ${
                        item.is_correct 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {item.is_correct ? <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
                        {item.is_correct ? 'Benar' : 'Salah'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                        {item.points} Poin
                      </span>
                    </div>
                  </div>

                  <p className="font-semibold text-slate-800 text-sm sm:text-base mb-3 leading-relaxed">
                    {item.question_text}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className={`p-2.5 rounded-xl border ${
                      item.is_correct 
                        ? 'bg-white border-emerald-200 text-slate-700' 
                        : 'bg-white border-rose-200 text-rose-900 font-medium'
                    }`}>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Jawaban Siswa</span>
                      <span>{item.selected_text}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase block mb-0.5">Kunci Jawaban</span>
                      <span className="font-semibold text-emerald-800">{item.correct_text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onDownloadPDF(detail.session_id)}
              disabled={pdfLoading}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-emerald-300 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center text-sm"
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
              Download PDF Hasil Assessment
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function TeacherResults({ dataService, showToast }) {
  const [assessments, setAssessments] = useState([]);
  const [selectedAss, setSelectedAss] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailSessionId, setDetailSessionId] = useState<string | null>(null);
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);

  // States for deleting completed assessments, questions, and sessions
  const [showDeleteAssModal, setShowDeleteAssModal] = useState(false);
  const [deletingAss, setDeletingAss] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [deleteQuestionIdx, setDeleteQuestionIdx] = useState<number | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const [deleteSessionModal, setDeleteSessionModal] = useState<{ id: string; name: string } | null>(null);
  const [deletingSession, setDeletingSession] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await dataService.getAssessments();
      setAssessments(data);
    } catch (err: any) {
      showToast(err?.message || 'Gagal memuat data ujian', 'error');
    } finally { setLoading(false); }
  };

  const selectAssessment = async (ass) => {
    setSelectedAss(ass);
    setLoading(true);
    try {
      const [tList, sList] = await Promise.all([
        dataService.getTokens(ass.id),
        dataService.getSessions(ass.id)
      ]);
      setTokens(tList);
      setSessions(sList);
    } catch (err: any) {
      showToast(err?.message || 'Gagal memuat sesi & token', 'error');
    } finally { setLoading(false); }
  };

  const handleCreateToken = async () => {
    if (!selectedAss) return;
    try {
      const newT = await dataService.createToken(selectedAss.id);
      setTokens([newT, ...tokens]);
      showToast('Token baru berhasil dibuat!', 'success');
    } catch (err: any) { showToast(err?.message || 'Gagal membuat token', 'error'); }
  };

  const handleDownloadPDF = async (sessionId: string) => {
    setPdfLoadingId(sessionId);
    try {
      const details = await dataService.getSessionDetails(sessionId);
      generateAssessmentPDF(details);
      showToast('File PDF berhasil dibuat dan diunduh!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Gagal membuat file PDF.', 'error');
    } finally {
      setPdfLoadingId(null);
    }
  };

  const handleDeleteAssessment = async () => {
    if (!selectedAss) return;
    setDeletingAss(true);
    try {
      await dataService.deleteAssessment(selectedAss.id);
      showToast('Ujian beserta seluruh soal dan data nilai berhasil dihapus!', 'success');
      setShowDeleteAssModal(false);
      setSelectedAss(null);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Gagal menghapus ujian', 'error');
    } finally {
      setDeletingAss(false);
    }
  };

  const handleDeleteQuestion = async (qIndex: number) => {
    if (!selectedAss) return;
    setDeletingQuestion(true);
    try {
      const updated = await dataService.deleteQuestionFromAssessment(selectedAss.id, qIndex);
      setSelectedAss(updated);
      setAssessments(prev => prev.map(a => a.id === updated.id ? updated : a));
      setDeleteQuestionIdx(null);
      showToast('Soal berhasil dihapus dari ujian!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Gagal menghapus soal', 'error');
    } finally {
      setDeletingQuestion(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!deleteSessionModal) return;
    setDeletingSession(true);
    try {
      await dataService.deleteSession(deleteSessionModal.id);
      setSessions(prev => prev.filter(s => s.id !== deleteSessionModal.id));
      showToast(`Data nilai ${deleteSessionModal.name} berhasil dihapus!`, 'success');
      setDeleteSessionModal(null);
    } catch (err: any) {
      showToast(err?.message || 'Gagal menghapus data siswa', 'error');
    } finally {
      setDeletingSession(false);
    }
  };

  const copyLink = (token) => {
    const url = `${window.location.origin}${window.location.pathname}#/siswa?token=${token}`;
    try {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      showToast('Tautan siswa berhasil disalin!', 'success');
    } catch (err) {
      showToast('Gagal menyalin tautan.', 'error');
    }
  };

  if (loading && !assessments.length) return <div className="p-12 flex justify-center"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-24">
      {detailSessionId && (
        <StudentDetailModal 
          sessionId={detailSessionId} 
          onClose={() => setDetailSessionId(null)} 
          showToast={showToast}
          onDownloadPDF={handleDownloadPDF}
          pdfLoading={pdfLoadingId === detailSessionId}
        />
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Pilih Assessment</h2>
        </div>
        <div className="p-3 sm:p-4 bg-slate-50/30">
          {assessments.length === 0 ? (
             <p className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">Belum ada ujian. Silakan buat di menu sebelah.</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto p-2 snap-x pb-4 hide-scrollbar">
              {assessments.map(a => (
                <button
                  key={a.id}
                  onClick={() => selectAssessment(a)}
                  className={`min-w-[220px] max-w-[280px] flex-shrink-0 p-5 rounded-2xl text-left transition-all snap-start ${
                    selectedAss?.id === a.id 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <h3 className="font-bold mb-2 truncate text-base">{a.title}</h3>
                  <p className={`text-xs ${selectedAss?.id === a.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Dibuat: {new Date(a.created_at).toLocaleDateString('id-ID')}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAss && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Panel Informasi Ujian & Aksi Hapus */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                  {selectedAss.class_name || 'Semua Kelas'}
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200">
                  {Array.isArray(selectedAss.questions) ? `${selectedAss.questions.length} Butir Soal` : '0 Soal'}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full">
                  {sessions.filter(s => s.student_name && s.student_name !== 'TOKEN').length} Siswa Mengerjakan
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">{selectedAss.title}</h2>
              {selectedAss.description && (
                <p className="text-slate-500 text-sm">{selectedAss.description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setShowQuestions(!showQuestions)}
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center text-sm transition-all"
              >
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                {showQuestions ? 'Tutup Daftar Soal' : 'Lihat / Kelola Soal'}
                {showQuestions ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteAssModal(true)}
                className="flex-1 md:flex-none px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold rounded-2xl flex items-center justify-center text-sm transition-all border border-rose-200"
                title="Hapus ujian dan soal yang telah selesai dilakukan"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Ujian Selesai
              </button>
            </div>
          </div>

          {/* Panel Daftar Soal Ujian (Bisa Dilihat & Dihapus Per Butir) */}
          {showQuestions && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-base flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                  Daftar Soal Ujian ({Array.isArray(selectedAss.questions) ? selectedAss.questions.length : 0})
                </h3>
                <span className="text-xs text-slate-400 hidden sm:inline">Guru dapat menghapus butir soal jika ujian telah selesai</span>
              </div>

              {(!selectedAss.questions || selectedAss.questions.length === 0) ? (
                <p className="text-slate-400 text-sm italic py-4 text-center">Tidak ada butir soal pada ujian ini.</p>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {selectedAss.questions.map((q: any, idx: number) => {
                    const correctIdx = q.correct_option !== undefined ? q.correct_option : (q.correctOption ?? 0);
                    return (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl transition-all hover:border-slate-300">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                              {q.points || 10} Poin
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDeleteQuestionIdx(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus butir soal ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mb-3">{q.text}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options?.map((opt: string, optIdx: number) => {
                            const isCorrect = optIdx === correctIdx;
                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                  isCorrect 
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' 
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                                {isCorrect && <Check className="w-3.5 h-3.5 ml-auto text-emerald-600" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Token Management Panel */}
          <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Token Ujian Reusable</h2>
                <p className="text-slate-500 mt-1 text-sm">Satu token dapat dibagikan dan digunakan oleh banyak siswa.</p>
              </div>
              <button 
                onClick={handleCreateToken}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-800 font-bold rounded-2xl flex justify-center items-center transition-all"
              >
                <Key className="w-5 h-5 mr-2" /> Buat Token Baru
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tokens.length === 0 ? (
                <div className="col-span-full p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  Belum ada token aktif. Klik tombol di atas untuk membuat token.
                </div>
              ) : tokens.map(t => (
                <div key={t.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xl font-black tracking-widest text-slate-800">{t.token}</span>
                    <p className="text-xs text-slate-400 mt-0.5">Multi-pengguna</p>
                  </div>
                  <button 
                    onClick={() => copyLink(t.token)}
                    title="Salin Tautan"
                    className="p-3 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl border border-slate-200 transition-colors shadow-sm"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Student Submissions List */}
          <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Daftar Nilai Siswa</h2>
                <p className="text-slate-500 text-sm mt-1">Hasil ujian tertera lengkap beserta tombol lihat detail jawaban dan cetak PDF.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs sm:text-sm border-b border-slate-200">
                    <th className="p-4 sm:p-5 font-bold">Nama Siswa</th>
                    <th className="p-4 sm:p-5 font-bold">Kelas</th>
                    <th className="p-4 sm:p-5 font-bold">Assessment</th>
                    <th className="p-4 sm:p-5 font-bold text-center">Nilai</th>
                    <th className="p-4 sm:p-5 font-bold text-center">Benar</th>
                    <th className="p-4 sm:p-5 font-bold text-center">Salah</th>
                    <th className="p-4 sm:p-5 font-bold text-center">Waktu Pengerjaan</th>
                    <th className="p-4 sm:p-5 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {sessions.filter(s => s.student_name && s.student_name !== 'TOKEN').length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-slate-500">
                        Belum ada siswa yang mengerjakan ujian ini.
                      </td>
                    </tr>
                  ) : sessions.filter(s => s.student_name && s.student_name !== 'TOKEN').map(s => {
                    const isPdfLoading = pdfLoadingId === s.id;
                    const totalQ = s.total_questions || selectedAss?.questions?.length || 0;
                    const correctCount = s.total_correct !== undefined && s.total_correct !== null
                      ? s.total_correct
                      : (s.score !== null && s.score !== undefined ? Math.round((s.score / 100) * totalQ) : 0);
                    const incorrectCount = s.total_incorrect !== undefined && s.total_incorrect !== null
                      ? s.total_incorrect
                      : Math.max(0, totalQ - correctCount);
                    const dateStr = s.created_at ? new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                        <td className="p-4 sm:p-5 font-bold text-slate-800 text-base">{s.student_name}</td>
                        <td className="p-4 sm:p-5 text-slate-600 font-medium">{s.student_class}</td>
                        <td className="p-4 sm:p-5 text-slate-600 text-xs max-w-[150px] truncate" title={selectedAss?.title}>{selectedAss?.title}</td>
                        <td className="p-4 sm:p-5 text-center">
                          {s.score !== null && s.score !== undefined ? (
                            <span className="font-black text-xl text-emerald-600">{s.score}</span>
                          ) : s.is_completed || s.status === 'completed' ? (
                            <span className="font-black text-xl text-emerald-600">0</span>
                          ) : (
                            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-lg font-bold">Proses</span>
                          )}
                        </td>
                        <td className="p-4 sm:p-5 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {correctCount}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            {incorrectCount}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-center text-xs text-slate-500 whitespace-nowrap">
                          <div className="font-medium text-slate-700">{dateStr}</div>
                          <div className="text-[11px] text-slate-400">{s.duration_text || '-'}</div>
                        </td>
                        <td className="p-4 sm:p-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setDetailSessionId(s.id)}
                              title="Lihat Detail Jawaban"
                              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl font-bold text-xs flex items-center transition-colors border border-slate-200 shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Detail
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(s.id)}
                              disabled={isPdfLoading}
                              title="Download PDF Hasil Assessment"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 active:scale-95 text-white rounded-xl font-bold text-xs flex items-center transition-all shadow-xs"
                            >
                              {isPdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <FileDown className="w-3.5 h-3.5 mr-1" />}
                              PDF
                            </button>
                            <button
                              onClick={() => setDeleteSessionModal({ id: s.id, name: s.student_name })}
                              title="Hapus Nilai Siswa Ini"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Ujian */}
      {showDeleteAssModal && selectedAss && (
        <Modal onClose={() => !deletingAss && setShowDeleteAssModal(false)} title="Konfirmasi Hapus Ujian">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-black text-slate-800 mb-1">Hapus Ujian Selesai?</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Anda akan menghapus ujian <span className="font-bold text-slate-800">"{selectedAss.title}"</span> beserta seluruh butir soal, token ujian, dan data nilai siswa yang sudah selesai dikerjakan.
              </p>
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                ⚠️ Peringatan: Tindakan ini permanen dan data tidak dapat dikembalikan lagi.
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                disabled={deletingAss}
                onClick={() => setShowDeleteAssModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deletingAss}
                onClick={handleDeleteAssessment}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold transition-all flex items-center justify-center text-sm shadow-lg shadow-rose-600/30"
              >
                {deletingAss ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Ya, Hapus Ujian
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus Butir Soal */}
      {deleteQuestionIdx !== null && selectedAss && (
        <Modal onClose={() => !deletingQuestion && setDeleteQuestionIdx(null)} title="Konfirmasi Hapus Soal">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800 mb-1">
                Hapus Soal Nomor {deleteQuestionIdx + 1}?
              </h4>
              <p className="text-slate-500 text-xs line-clamp-2 px-2">
                "{selectedAss.questions?.[deleteQuestionIdx]?.text}"
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={deletingQuestion}
                onClick={() => setDeleteQuestionIdx(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deletingQuestion}
                onClick={() => handleDeleteQuestion(deleteQuestionIdx)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold transition-all flex items-center justify-center text-xs shadow-md shadow-rose-600/20"
              >
                {deletingQuestion ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
                Hapus Soal
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus Nilai Siswa */}
      {deleteSessionModal && (
        <Modal onClose={() => !deletingSession && setDeleteSessionModal(null)} title="Konfirmasi Hapus Nilai Siswa">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-800 mb-1">
                Hapus Data Siswa: {deleteSessionModal.name}?
              </h4>
              <p className="text-slate-500 text-xs">
                Data pengerjaan ujian dan rincian jawaban siswa ini akan dihapus permanen.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={deletingSession}
                onClick={() => setDeleteSessionModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deletingSession}
                onClick={handleDeleteSession}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold transition-all flex items-center justify-center text-xs shadow-md shadow-rose-600/20"
              >
                {deletingSession ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
                Hapus Nilai
              </button>
            </div>
          </div>
        </Modal>
      )}
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}

function StudentPortal({ dataService, showToast }) {
  const [tokenInput, setTokenInput] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const hashParts = window.location.hash.split('?');
    if (hashParts.length > 1) {
      const urlParams = new URLSearchParams(hashParts[1]);
      const urlToken = urlParams.get('token');
      if (urlToken) setTokenInput(urlToken.toUpperCase());
    }
  }, []);

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return showToast('Masukkan token ujian!', 'error');
    
    setLoading(true);
    try {
      const res = await dataService.getAssessmentByToken(tokenInput.trim().toUpperCase());
      setSession(res); // { token, assessment_id, assessment }
      setStep(2);
    } catch (err: any) {
      showToast(err?.message || 'Token tidak valid atau tidak ditemukan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentClass.trim()) {
      return showToast('Nama dan Kelas wajib diisi!', 'error');
    }
    
    setLoading(true);
    try {
      const newSession = await dataService.createStudentSession(session.token, session.assessment_id, studentName.trim(), studentClass.trim());
      setSession({ ...session, ...newSession });
      setStep(3); 
    } catch (err: any) {
      showToast(err?.message || 'Gagal memulai ujian', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return <AssessmentTaking session={session} dataService={dataService} showToast={showToast} onComplete={() => setStep(4)} />;
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl max-w-md w-full text-center animate-in zoom-in duration-500 border border-slate-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">Luar Biasa!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm sm:text-base">
            Jawaban kamu telah berhasil disimpan. Terima kasih sudah mengerjakan ujian dengan baik.
          </p>
          <a href="#/" className="inline-flex w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-2xl transition-all justify-center">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden relative z-10">
        <div className="bg-emerald-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">Portal Siswa</h2>
          <p className="text-emerald-100 text-sm mt-1 font-medium">Tugas Online • SDI SAIQ AL-HIKMAH</p>
        </div>
        
        <div className="p-6 sm:p-8">
          {step === 1 && (
            <form onSubmit={handleVerifyToken} className="space-y-6 animate-in slide-in-from-bottom-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 text-center">Masukkan Token Ujian</label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  placeholder="XXXXXX"
                  className="w-full text-center text-4xl tracking-[0.25em] font-mono font-black p-5 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none uppercase transition-all shadow-inner bg-slate-50 focus:bg-white"
                  maxLength="6"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !tokenInput}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 flex justify-center items-center text-lg"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verifikasi Token'}
              </button>
              <div className="text-center mt-4">
                <a href="#/" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Batal & Kembali</a>
              </div>
            </form>
          )}

          {step === 2 && session && (
            <form onSubmit={handleStartExam} className="space-y-5 animate-in slide-in-from-right">
              <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl mb-6 text-center">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-1">Ujian Ditemukan</p>
                <p className="font-bold text-emerald-950 text-lg leading-tight">{session.assessment?.title}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all text-lg font-medium text-slate-800"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kelas</label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all text-lg font-medium text-slate-800"
                  placeholder="Contoh: 5A"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex justify-center items-center text-lg"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Mulai Ujian Sekarang'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function AssessmentTaking({ session, dataService, showToast, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingState, setSavingState] = useState(''); 
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const assessment = session.assessment;
  const questions = assessment.questions || [];

  const handleSelectOption = async (questionId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    
    setSavingState('saving');
    try {
      await dataService.saveAnswer(session.id, questionId, optionIdx);
      setSavingState('saved');
      setTimeout(() => setSavingState(''), 2500);

      if (currentIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentIndex(prevIndex => prevIndex + 1);
        }, 400);
      } else if (currentIndex === questions.length - 1) {
        setTimeout(() => {
           showToast('Semua soal telah dijawab. Anda dapat menekan tombol Kumpul jika sudah yakin.', 'success');
        }, 500);
      }
    } catch (err) {
      console.error('Error saving answer to Supabase:', err);
      showToast('Jawaban tersimpan secara lokal.', 'info');
      setSavingState('saved');
    }
  };

  const calculateResult = () => {
    let correct = 0;
    let earnedPoints = 0;
    let totalMaxPoints = 0;
    const hasCustomPoints = questions.some((q: any) => Number(q.points) > 0);

    questions.forEach((q: any, idx: number) => {
      const correctOpt = q.correct_option !== undefined ? q.correct_option : q.correctOption;
      const qId = q.id || `fallback-${idx}`;
      const qPoint = Number(q.points) > 0 ? Number(q.points) : 10;
      totalMaxPoints += qPoint;

      if (answers[qId] === correctOpt) {
        correct++;
        earnedPoints += qPoint;
      }
    });

    const incorrect = Math.max(0, questions.length - correct);
    let finalScore = 0;
    if (hasCustomPoints && totalMaxPoints > 0) {
      finalScore = Math.round((earnedPoints / totalMaxPoints) * 100);
    } else {
      finalScore = Math.round((correct / (questions.length || 1)) * 100);
    }

    return { score: finalScore, correct, incorrect };
  };

  const triggerSubmit = () => setShowConfirm(true);

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      const { score, correct, incorrect } = calculateResult();
      await dataService.submitAssessment(session.id, score, correct, incorrect);
      onComplete();
    } catch (err) {
      console.error('Error submitting assessment to Supabase:', err);
      showToast('Gagal mengumpulkan ujian. Coba lagi.', 'error');
      setIsSubmitting(false);
    }
  };

  const unanswered = questions.filter(q => answers[q.id] === undefined).length;
  const currentQ = questions[currentIndex];
  const qId = currentQ?.id || `fallback-${currentIndex}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200">
      {showConfirm && (
        <Modal title="Konfirmasi Kumpul" onClose={() => setShowConfirm(false)}>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Yakin ingin mengumpulkan?</h4>
            {unanswered > 0 ? (
              <p className="text-rose-600 font-medium mb-6">Masih ada <span className="font-black text-xl">{unanswered}</span> soal yang belum dijawab!</p>
            ) : (
              <p className="text-slate-500 mb-6">Semua soal sudah dijawab. Pastikan jawabanmu sudah benar.</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Periksa Lagi</button>
              <button onClick={confirmSubmit} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-colors">Ya, Kumpulkan</button>
            </div>
          </div>
        </Modal>
      )}

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3 sm:py-4 shadow-sm flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="font-bold text-slate-800 truncate text-base sm:text-lg">{assessment.title}</h1>
          <p className="text-xs sm:text-sm text-slate-500 truncate">{session.student_name} • Kelas {session.student_class}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="text-[10px] sm:text-xs flex items-center text-slate-500 bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
            {savingState === 'saving' ? <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 animate-spin text-amber-500" /> :
             savingState === 'saved' ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-slate-300 mr-1.5"></div>}
            <span className="hidden sm:inline">{savingState === 'saving' ? 'Menyimpan...' : savingState === 'saved' ? 'Tersimpan' : 'Auto-save aktif'}</span>
            <span className="sm:hidden">{savingState === 'saving' ? 'Proses...' : savingState === 'saved' ? 'Aman' : 'Auto'}</span>
          </div>
          <button 
            onClick={triggerSubmit} 
            disabled={isSubmitting}
            className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kumpul'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-32 flex flex-col justify-center min-h-[60vh]">
        <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-2">
          <span>Soal ke {currentIndex + 1} dari {questions.length}</span>
          {answers[qId] !== undefined && <span className="text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full text-xs">Sudah Dijawab</span>}
        </div>

        {currentQ && (
          <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex gap-3 sm:gap-4 mb-6">
              <p className="font-bold text-slate-800 leading-relaxed pt-1 text-lg sm:text-xl lg:text-2xl">{currentQ.text}</p>
            </div>
            
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[qId] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(qId, optIdx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center group touch-manipulation ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 shadow-sm' 
                        : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white group-hover:border-slate-400'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />}
                    </div>
                    <span className="text-base sm:text-lg font-medium">{opt}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4 mt-4">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
          >
            Sebelumnya
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
          >
            Selanjutnya
          </button>
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 flex justify-center items-center shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-3xl w-full flex items-center justify-between text-sm font-medium text-slate-600 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 px-1 flex-1 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
            {questions.map((q, idx) => {
              const qIdTemp = q.id || `fallback-${idx}`;
              const isAnswered = answers[qIdTemp] !== undefined;
              const isActive = idx === currentIndex;
              
              return (
                <button 
                  key={qIdTemp} 
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base transition-all active:scale-95 ${
                    isActive ? 'ring-4 ring-emerald-500/30 border-emerald-500 scale-110 ' : ''
                  } ${
                    isAnswered ? 'bg-emerald-500 text-white shadow-md border border-emerald-400' : 'bg-slate-100 text-slate-400 border border-transparent hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
          <div className="bg-slate-800 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-2xl whitespace-nowrap shadow-lg flex-shrink-0">
            <span className="font-bold text-base sm:text-lg">{Object.keys(answers).length}</span><span className="text-slate-400 text-xs sm:text-sm">/{questions.length}</span>
          </div>
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function TeacherDashboard({ dataService, showToast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = "sdisaiq123";
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      showToast('Berhasil masuk ke Portal Guru', 'success');
    } else {
      showToast('Sandi salah! Silakan coba lagi.', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Portal Guru Terkunci</h2>
          <p className="text-slate-500 text-sm text-center mb-8">Masukkan sandi guru untuk mengakses manajemen ujian dan nilai siswa.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan Kata Sandi Guru"
                className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-center font-bold text-slate-800 tracking-wider"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/30 text-lg"
            >
              Buka Portal
            </button>
            <div className="text-center pt-2">
              <a href="#/" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Kembali ke Beranda</a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-lg sm:text-xl text-slate-800">Portal Guru</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Tugas Online • SDI SAIQ AL-HIKMAH</p>
            </div>
          </div>
          <a href="#/" className="p-2 sm:px-4 sm:py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold rounded-xl text-sm transition-all flex items-center group">
            <span className="hidden sm:inline mr-2">Keluar</span>
            <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </a>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-4 sm:p-6 mt-2">
        <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-full sm:w-fit overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm flex justify-center items-center transition-all whitespace-nowrap ${
              activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm scale-100' : 'text-slate-500 hover:bg-white/40 hover:text-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Buat Ujian
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm flex justify-center items-center transition-all whitespace-nowrap ${
              activeTab === 'results' ? 'bg-white text-emerald-700 shadow-sm scale-100' : 'text-slate-500 hover:bg-white/40 hover:text-slate-700'
            }`}
          >
            <Award className="w-4 h-4 mr-2" /> Token & Nilai
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeTab === 'create' && (
            <TeacherCreateAssessment dataService={dataService} showToast={showToast} onSuccess={() => setActiveTab('results')} />
          )}
          {activeTab === 'results' && (
            <TeacherResults dataService={dataService} showToast={showToast} />
          )}
        </div>
      </main>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const Toast = () => toast ? (
    <div className="fixed top-4 left-0 right-0 z-[999] flex justify-center pointer-events-none px-4">
      <div className={`px-6 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base shadow-2xl transition-all animate-in slide-in-from-top-4 fade-in flex items-center ${
        toast.type === 'error' ? 'bg-rose-500 shadow-rose-500/30' : toast.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-800'
      }`}>
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 mr-2" />}
        {toast.message}
      </div>
    </div>
  ) : null;

  let content = null;
  
  if (route.startsWith('#/siswa')) {
    content = <StudentPortal dataService={dataService} showToast={showToast} />;
  } else if (route.startsWith('#/guru')) {
    content = <TeacherDashboard dataService={dataService} showToast={showToast} />;
  } else {
    content = <LandingPage />;
  }

  return (
    <>
      <Toast />
      {content}
    </>
  );
}