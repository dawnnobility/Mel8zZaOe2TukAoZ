/*
 * data.js
 * Data contoh dan penyimpanan lokal untuk demo statis SIGAP.
 * Semua perubahan disimpan di localStorage peramban pengunjung.
 */

var DEMO_KUNCI = "sigap_demo_data_v1";
var DEMO_SESI = "sigap_demo_sesi_v1";
var DEMO_FLASH = "sigap_demo_flash_v1";

function demoWaktu(menit) {
    var waktu = new Date();

    waktu.setMinutes(waktu.getMinutes() - menit);

    return waktu.toISOString();
}

function demoDataAwal() {
    var pengguna = [
        {
            id: 1, nama: "Rina Kusumastuti", username: "admin",
            email: "rina@uajy.ac.id", sandi: "admin123", role: "admin",
            unit: "Biro Sarana dan Prasarana", telepon: "081234567001",
            foto: null, aktif: 1, dibuat: demoWaktu(20000)
        },
        {
            id: 2, nama: "Yohanes Bagas Pratama", username: "teknisi",
            email: "bagas@uajy.ac.id", sandi: "teknisi123", role: "teknisi",
            unit: "Unit Layanan Teknis", telepon: "081234567002",
            foto: null, aktif: 1, dibuat: demoWaktu(19000)
        },
        {
            id: 3, nama: "Maria Elisabeth Sari", username: "teknisi2",
            email: "maria@uajy.ac.id", sandi: "teknisi123", role: "teknisi",
            unit: "Unit Layanan Teknis", telepon: "081234567003",
            foto: null, aktif: 1, dibuat: demoWaktu(18000)
        },
        {
            id: 4, nama: "Aditya Nurwibowo", username: "mahasiswa",
            email: "aditya@student.uajy.ac.id", sandi: "mahasiswa123", role: "pelapor",
            unit: "Fakultas Teknologi Industri", telepon: "081234567004",
            foto: null, aktif: 1, dibuat: demoWaktu(17000)
        },
        {
            id: 5, nama: "Lucia Widyastuti", username: "dosen",
            email: "lucia@uajy.ac.id", sandi: "dosen123", role: "pelapor",
            unit: "Fakultas Ekonomi", telepon: "081234567005",
            foto: null, aktif: 1, dibuat: demoWaktu(16000)
        }
    ];

    var fasilitas = [
        { id: 1, kode: "TA-201", nama: "Ruang Kuliah TA-201", gedung: "Gedung Thomas Aquinas", lantai: "2", kategori: "Ruang Kuliah", keterangan: "Sayap utara, dekat tangga utama.", aktif: 1 },
        { id: 2, kode: "TA-305", nama: "Laboratorium Jaringan TA-305", gedung: "Gedung Thomas Aquinas", lantai: "3", kategori: "Laboratorium", keterangan: "Lab jaringan Fakultas Teknologi Industri.", aktif: 1 },
        { id: 3, kode: "BO-101", nama: "Ruang Dosen BO-101", gedung: "Gedung Bonaventura", lantai: "1", kategori: "Ruang Dosen", keterangan: "Dekat ruang rapat fakultas.", aktif: 1 },
        { id: 4, kode: "BO-TOILET2", nama: "Toilet Lantai 2 Bonaventura", gedung: "Gedung Bonaventura", lantai: "2", kategori: "Toilet", keterangan: "Toilet pria dan wanita.", aktif: 1 },
        { id: 5, kode: "FR-AULA", nama: "Aula Fransiskus", gedung: "Gedung Fransiskus", lantai: "1", kategori: "Aula", keterangan: "Aula serbaguna kampus.", aktif: 1 },
        { id: 6, kode: "PARK-IR", nama: "Area Parkir Timur", gedung: "Area Luar", lantai: "0", kategori: "Area Umum", keterangan: "Parkir motor dan mobil sisi timur.", aktif: 1 },
        { id: 7, kode: "FTI-LAB1", nama: "Lab Komputer FTI", gedung: "Gedung Thomas Aquinas", lantai: "3", kategori: "Laboratorium", keterangan: "Lab komputer bersama.", aktif: 1 },
        { id: 8, kode: "LIB-READ", nama: "Ruang Baca Perpustakaan", gedung: "Perpustakaan Pusat", lantai: "1", kategori: "Area Umum", keterangan: "Ruang baca lantai satu.", aktif: 1 }
    ];

    var laporan = [
        {
            id: 1, kode: "SGP-2026-0001", pelapor_id: 4, fasilitas_id: 1,
            kategori: "Kelistrikan", judul: "Lampu ruang kuliah mati sebagian",
            deskripsi: "Empat lampu di baris belakang ruang TA-201 tidak menyala sejak kuliah pagi. Ruangan menjadi gelap saat proyektor digunakan.",
            prioritas: "tinggi", status: "dikerjakan", teknisi_id: 2,
            lat: "-7.7829100", lng: "110.4096100", lokasi_nama: "Ruang Kuliah TA-201, dekat papan tulis",
            foto: null, catatan_admin: "Teknisi sudah memeriksa panel dan menyiapkan penggantian ballast.",
            dibuat: demoWaktu(600), diperbarui: demoWaktu(30), selesai_pada: null
        },
        {
            id: 2, kode: "SGP-2026-0002", pelapor_id: 5, fasilitas_id: 2,
            kategori: "Kelistrikan", judul: "Stop kontak di lab terasa panas dan berbau",
            deskripsi: "Stop kontak di meja praktikum dekat pintu terasa panas dan mengeluarkan bau terbakar. Mahasiswa diminta tidak memakainya sementara.",
            prioritas: "kritis", status: "ditugaskan", teknisi_id: 2,
            lat: "-7.7827400", lng: "110.4094200", lokasi_nama: "Laboratorium Jaringan TA-305",
            foto: null, catatan_admin: "Prioritas kritis, teknisi diminta memeriksa jalur kabel.",
            dibuat: demoWaktu(300), diperbarui: demoWaktu(20), selesai_pada: null
        },
        {
            id: 3, kode: "SGP-2026-0003", pelapor_id: 5, fasilitas_id: 3,
            kategori: "AC dan Ventilasi", judul: "AC ruang dosen menetes ke meja kerja",
            deskripsi: "AC di ruang dosen BO-101 menetes tepat di atas meja kerja dan membasahi berkas. Ember penampung sudah dipasang sementara.",
            prioritas: "sedang", status: "baru", teknisi_id: null,
            lat: null, lng: null, lokasi_nama: "Ruang Dosen BO-101",
            foto: null, catatan_admin: null,
            dibuat: demoWaktu(40), diperbarui: demoWaktu(40), selesai_pada: null
        },
        {
            id: 4, kode: "SGP-2026-0004", pelapor_id: 4, fasilitas_id: 4,
            kategori: "Air dan Sanitasi", judul: "Toilet lantai 2 tersumbat",
            deskripsi: "Air di kloset toilet pria lantai 2 tidak turun dan mulai meluap ke koridor. Area sudah diberi tanda agar tidak dipakai.",
            prioritas: "tinggi", status: "diverifikasi", teknisi_id: null,
            lat: "-7.7822100", lng: "110.4089300", lokasi_nama: "Toilet pria lantai 2 Gedung Bonaventura",
            foto: null, catatan_admin: "Kondisi sesuai laporan, menunggu penugasan teknisi.",
            dibuat: demoWaktu(600), diperbarui: demoWaktu(560), selesai_pada: null
        },
        {
            id: 5, kode: "SGP-2026-0005", pelapor_id: 4, fasilitas_id: 8,
            kategori: "Perabot dan Interior", judul: "Kursi peserta seminar patah",
            deskripsi: "Satu kursi di ruang baca perpustakaan patah pada bagian sandaran. Kursi sudah dipindahkan agar tidak dipakai.",
            prioritas: "rendah", status: "selesai", teknisi_id: 3,
            lat: null, lng: null, lokasi_nama: "Ruang Baca Perpustakaan",
            foto: null, catatan_admin: "Kursi diganti dari stok gudang dan sudah diuji.",
            dibuat: demoWaktu(1500), diperbarui: demoWaktu(240), selesai_pada: demoWaktu(240)
        },
        {
            id: 6, kode: "SGP-2026-0006", pelapor_id: 4, fasilitas_id: 6,
            kategori: "Kelistrikan", judul: "Lampu area parkir timur padam",
            deskripsi: "Dua lampu di area parkir timur padam sejak sore. Area menjadi gelap saat parkir malam.",
            prioritas: "rendah", status: "baru", teknisi_id: null,
            lat: "-7.7834300", lng: "110.4100800", lokasi_nama: "Area Parkir Timur",
            foto: null, catatan_admin: null,
            dibuat: demoWaktu(25), diperbarui: demoWaktu(25), selesai_pada: null
        },
        {
            id: 7, kode: "SGP-2026-0007", pelapor_id: 5, fasilitas_id: 1,
            kategori: "Jaringan dan IT", judul: "Proyektor ruang TA-201 tidak menyala",
            deskripsi: "Proyektor ruang TA-201 tidak menyala saat kuliah. Kabel HDMI sudah dicoba dan lampu indikator tetap mati.",
            prioritas: "tinggi", status: "selesai", teknisi_id: 2,
            lat: null, lng: null, lokasi_nama: "Ruang Kuliah TA-201",
            foto: null, catatan_admin: "Kabel daya proyektor diganti dan perangkat sudah diuji.",
            dibuat: demoWaktu(2000), diperbarui: demoWaktu(700), selesai_pada: demoWaktu(700)
        },
        {
            id: 8, kode: "SGP-2026-0008", pelapor_id: 4, fasilitas_id: 2,
            kategori: "Jaringan dan IT", judul: "Wi-Fi lantai 3 lambat saat praktikum",
            deskripsi: "Koneksi Wi-Fi di lantai 3 lambat saat praktikum berlangsung. Mahasiswa kesulitan mengakses materi lab.",
            prioritas: "sedang", status: "ditolak", teknisi_id: null,
            lat: null, lng: null, lokasi_nama: "Laboratorium Jaringan TA-305",
            foto: null, catatan_admin: "Duplikat dari SGP-2026-0002. Pemantauan jaringan dilakukan menyatu dengan tiket tersebut.",
            dibuat: demoWaktu(700), diperbarui: demoWaktu(650), selesai_pada: null
        }
    ];

    var riwayat = [];
    var nomor = 1;

    function catat(laporan_id, pengguna_id, status, teks, menit) {
        riwayat.push({
            id: nomor, laporan_id: laporan_id, pengguna_id: pengguna_id,
            status: status, catatan: teks, dibuat: demoWaktu(menit)
        });
        nomor = nomor + 1;
    }

    catat(1, 4, "baru", "Laporan diterima sistem dan menunggu pemeriksaan admin.", 600);
    catat(1, 1, "diverifikasi", "Kondisi sesuai foto. Laporan masuk antrian penanganan.", 580);
    catat(1, 1, "ditugaskan", "Ditugaskan kepada Yohanes Bagas Pratama untuk pemeriksaan panel.", 570);
    catat(1, 2, "dikerjakan", "Teknisi tiba di lokasi dan mulai memeriksa jalur lampu belakang.", 30);

    catat(2, 5, "baru", "Laporan diterima sistem dan menunggu pemeriksaan admin.", 300);
    catat(2, 1, "diverifikasi", "Prioritas dinaikkan menjadi kritis karena ada risiko keselamatan.", 280);
    catat(2, 1, "ditugaskan", "Ditugaskan kepada Yohanes Bagas Pratama, pemeriksaan segera.", 20);

    catat(3, 5, "baru", "Laporan diterima sistem dan menunggu pemeriksaan admin.", 40);

    catat(4, 4, "baru", "Laporan diterima sistem dan menunggu pemeriksaan admin.", 600);
    catat(4, 1, "diverifikasi", "Foto dan lokasi lengkap. Menunggu penugasan teknisi.", 560);

    catat(5, 4, "baru", "Laporan diterima sistem dan menunggu pemeriksaan admin.", 1500);
    catat(5, 1, "diverifikasi", "Laporan diverifikasi, kursi segera diganti.", 1400);
    catat(5, 1, "ditugaskan", "Ditugaskan kepada Maria Elisabeth Sari.", 1300);
    catat(5, 3, "dikerjakan", "Teknisi memeriksa kursi dan menyiapkan pengganti dari gudang.", 900);
    catat(5, 3, "selesai", "Kursi diganti dan sudah diuji. Tidak ada kursi rusak lain di area.", 240);

    catat(6, 4, "baru", "Laporan diterima sistem dan menunggu pemeriksaan admin.", 25);

    catat(7, 5, "baru", "Laporan diterima sistem dan menunggu pemeriksaan admin.", 2000);
    catat(7, 1, "diverifikasi", "Laporan diverifikasi dan diteruskan ke teknisi.", 1900);
    catat(7, 1, "ditugaskan", "Ditugaskan kepada Yohanes Bagas Pratama.", 1800);
    catat(7, 2, "dikerjakan", "Teknisi memeriksa kabel daya dan lampu indikator proyektor.", 1200);
    catat(7, 2, "selesai", "Kabel daya diganti, proyektor menyala dan sudah diuji bersama pelapor.", 700);

    catat(8, 4, "baru", "Laporan diterima sistem dan menunggu pemeriksaan admin.", 700);
    catat(8, 1, "ditolak", "Duplikat dari SGP-2026-0002. Pemantauan jaringan menyatu dengan tiket tersebut.", 650);

    return {
        pengguna: pengguna,
        fasilitas: fasilitas,
        laporan: laporan,
        riwayat: riwayat,
        urut: { pengguna: 6, fasilitas: 9, laporan: 9, riwayat: nomor }
    };
}

function demoSeed() {
    var data = demoDataAwal();

    localStorage.setItem(DEMO_KUNCI, JSON.stringify(data));

    return data;
}

function demoBaca() {
    var teks = localStorage.getItem(DEMO_KUNCI);

    if (teks === null) {
        return demoSeed();
    }

    try {
        return JSON.parse(teks);
    } catch (galat) {
        return demoSeed();
    }
}

function demoTulis(data) {
    localStorage.setItem(DEMO_KUNCI, JSON.stringify(data));
}

function demoReset() {
    localStorage.removeItem(DEMO_KUNCI);
    localStorage.removeItem(DEMO_SESI);
    sessionStorage.removeItem(DEMO_FLASH);
    demoSeed();
}
