/*
 * core.js
 * Kerangka aplikasi demo: sesi masuk, menu per peran, pesan flash,
 * dan alat bantu format. Ditulis dengan var, function, dan DOM dasar.
 */

function demoE(nilai) {
    if (nilai === null || nilai === undefined) {
        return "";
    }

    return String(nilai)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function demoAkar() {
    var akar = document.body.getAttribute("data-akar");

    if (akar === null) {
        return "";
    }

    return akar;
}

function demoArah(jalur) {
    return demoAkar() + jalur;
}

function demoCari(daftar, id) {
    var i;

    for (i = 0; i < daftar.length; i++) {
        if (Number(daftar[i].id) === Number(id)) {
            return daftar[i];
        }
    }

    return null;
}

function demoPengguna(data, id) {
    return demoCari(data.pengguna, id);
}

function demoFasilitas(data, id) {
    return demoCari(data.fasilitas, id);
}

function demoInisial(nama) {
    var bagian = String(nama).split(" ");
    var hasil = bagian[0].substring(0, 1);

    if (bagian.length > 1) {
        hasil = hasil + bagian[1].substring(0, 1);
    }

    return hasil.toUpperCase();
}

function demoPeranLabel(peran) {
    if (peran === "admin") {
        return "Admin Fasilitas";
    }

    if (peran === "teknisi") {
        return "Teknisi";
    }

    return "Pelapor";
}

function demoStatusLabel(status) {
    if (status === "baru") {
        return "Baru";
    }

    if (status === "diverifikasi") {
        return "Diverifikasi";
    }

    if (status === "ditugaskan") {
        return "Ditugaskan";
    }

    if (status === "dikerjakan") {
        return "Dikerjakan";
    }

    if (status === "selesai") {
        return "Selesai";
    }

    if (status === "ditolak") {
        return "Ditolak";
    }

    return status;
}

function demoStatusKelas(status) {
    return "status-" + status;
}

function demoPrioritasLabel(prioritas) {
    if (prioritas === "rendah") {
        return "Rendah";
    }

    if (prioritas === "sedang") {
        return "Sedang";
    }

    if (prioritas === "tinggi") {
        return "Tinggi";
    }

    if (prioritas === "kritis") {
        return "Kritis";
    }

    return prioritas;
}

function demoPrioritasKelas(prioritas) {
    return "prioritas-" + prioritas;
}

function demoLaporanAktif(laporan) {
    return laporan.status !== "selesai" && laporan.status !== "ditolak";
}

function demoLaporanTerlihat(data, pengguna) {
    var hasil = [];
    var i;
    var laporan;

    for (i = 0; i < data.laporan.length; i++) {
        laporan = data.laporan[i];

        if (pengguna.role === "admin") {
            hasil.push(laporan);
        } else if (pengguna.role === "teknisi") {
            if (Number(laporan.teknisi_id) === Number(pengguna.id)) {
                hasil.push(laporan);
            }
        } else if (Number(laporan.pelapor_id) === Number(pengguna.id)) {
            hasil.push(laporan);
        }
    }

    hasil.sort(function (a, b) {
        return new Date(b.dibuat).getTime() - new Date(a.dibuat).getTime();
    });

    return hasil;
}

function demoJumlahAktif(data, pengguna) {
    var daftar = demoLaporanTerlihat(data, pengguna);
    var jumlah = 0;
    var i;

    for (i = 0; i < daftar.length; i++) {
        if (demoLaporanAktif(daftar[i])) {
            jumlah = jumlah + 1;
        }
    }

    return jumlah;
}

function demoTanggal(iso, panjang) {
    var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var waktu = new Date(iso);
    var jam;
    var menit;

    if (isNaN(waktu.getTime())) {
        return "-";
    }

    jam = waktu.getHours();
    menit = waktu.getMinutes();

    if (jam < 10) {
        jam = "0" + jam;
    }

    if (menit < 10) {
        menit = "0" + menit;
    }

    if (panjang === false) {
        return waktu.getDate() + " " + bulan[waktu.getMonth()].substring(0, 3) + " " + waktu.getFullYear();
    }

    return waktu.getDate() + " " + bulan[waktu.getMonth()] + " " + waktu.getFullYear() + ", " + jam + ":" + menit;
}

function demoDurasi(milidetik) {
    var jam = Math.floor(milidetik / 3600000);
    var menit = Math.round((milidetik % 3600000) / 60000);

    if (jam > 0) {
        return jam + " jam";
    }

    if (menit < 1) {
        return "1 mnt";
    }

    return menit + " mnt";
}

function demoSla(laporan) {
    var jam = { rendah: 72, sedang: 24, tinggi: 8, kritis: 4 };
    var batas = jam[laporan.prioritas];
    var tenggat;
    var akhir;
    var selisih;

    if (!batas) {
        batas = 24;
    }

    tenggat = new Date(laporan.dibuat).getTime() + (batas * 3600000);

    if (laporan.status === "ditolak") {
        return { label: "Ditutup", kelas: "sla-tutup" };
    }

    akhir = laporan.selesai_pada ? new Date(laporan.selesai_pada).getTime() : new Date().getTime();
    selisih = tenggat - akhir;

    if (laporan.status === "selesai") {
        if (selisih >= 0) {
            return { label: "Tepat waktu", kelas: "sla-tutup" };
        }

        return { label: "Lewat " + demoDurasi(-selisih), kelas: "sla-tutup" };
    }

    if (selisih < 0) {
        return { label: "Lewat " + demoDurasi(-selisih), kelas: "sla-lewat" };
    }

    if (selisih < 7200000) {
        return { label: "Sisa " + demoDurasi(selisih), kelas: "sla-mepet" };
    }

    return { label: "Sisa " + demoDurasi(selisih), kelas: "sla-aman" };
}

function demoFlash(jenis, pesan) {
    sessionStorage.setItem(DEMO_FLASH, JSON.stringify({ jenis: jenis, pesan: pesan }));
}

function demoAmbilFlash() {
    var teks = sessionStorage.getItem(DEMO_FLASH);

    if (teks === null) {
        return null;
    }

    sessionStorage.removeItem(DEMO_FLASH);

    try {
        return JSON.parse(teks);
    } catch (galat) {
        return null;
    }
}

function demoTampilFlash() {
    var kotak = document.getElementById("pesan-flash");
    var pesan = demoAmbilFlash();

    if (kotak === null) {
        return;
    }

    if (pesan === null) {
        kotak.innerHTML = "";
        return;
    }

    kotak.innerHTML = '<div class="pesan pesan-' + demoE(pesan.jenis) + '">' +
        '<span class="tanda-pesan">i</span>' + demoE(pesan.pesan) + "</div>";
}

function demoSesiPengguna() {
    var teks = localStorage.getItem(DEMO_SESI);
    var data;
    var pengguna;

    if (teks === null) {
        return null;
    }

    data = demoBaca();
    pengguna = demoPengguna(data, parseInt(teks, 10));

    if (pengguna === null || pengguna.aktif !== 1) {
        localStorage.removeItem(DEMO_SESI);
        return null;
    }

    return pengguna;
}

function demoKeluar() {
    localStorage.removeItem(DEMO_SESI);
}

function demoWajibMasuk() {
    var pengguna = demoSesiPengguna();

    if (pengguna === null) {
        demoFlash("galat", "Silakan masuk terlebih dahulu untuk membuka halaman ini.");
        window.location.replace(demoArah("pages/login/index.xhtml"));
        return null;
    }

    return pengguna;
}

function demoWajibAdmin() {
    var pengguna = demoWajibMasuk();

    if (pengguna === null) {
        return null;
    }

    if (pengguna.role !== "admin") {
        demoFlash("galat", "Halaman ini hanya dapat dibuka admin fasilitas.");
        window.location.replace(demoArah("pages/dashboard/index.xhtml"));
        return null;
    }

    return pengguna;
}

function demoRiwayatLaporan(data, laporanId) {
    var hasil = [];
    var i;

    for (i = 0; i < data.riwayat.length; i++) {
        if (Number(data.riwayat[i].laporan_id) === Number(laporanId)) {
            hasil.push(data.riwayat[i]);
        }
    }

    hasil.sort(function (a, b) {
        return new Date(a.dibuat).getTime() - new Date(b.dibuat).getTime();
    });

    return hasil;
}

function demoAktivitas(data, pengguna, batas) {
    var terlihat = demoLaporanTerlihat(data, pengguna);
    var ids = [];
    var hasil = [];
    var i;
    var j;

    for (i = 0; i < terlihat.length; i++) {
        ids.push(Number(terlihat[i].id));
    }

    for (i = 0; i < data.riwayat.length; i++) {
        for (j = 0; j < ids.length; j++) {
            if (Number(data.riwayat[i].laporan_id) === ids[j]) {
                hasil.push(data.riwayat[i]);
            }
        }
    }

    hasil.sort(function (a, b) {
        return new Date(b.dibuat).getTime() - new Date(a.dibuat).getTime();
    });

    return hasil.slice(0, batas);
}

function demoJumlahLaporanFasilitas(data, fasilitasId) {
    var jumlah = 0;
    var i;

    for (i = 0; i < data.laporan.length; i++) {
        if (Number(data.laporan[i].fasilitas_id) === Number(fasilitasId)) {
            jumlah = jumlah + 1;
        }
    }

    return jumlah;
}

function demoJumlahLaporanPengguna(data, penggunaId) {
    var jumlah = 0;
    var i;

    for (i = 0; i < data.laporan.length; i++) {
        if (Number(data.laporan[i].pelapor_id) === Number(penggunaId) ||
            Number(data.laporan[i].teknisi_id) === Number(penggunaId)) {
            jumlah = jumlah + 1;
        }
    }

    return jumlah;
}

function demoSiapkanShell(pengguna) {
    var data = demoBaca();
    var halaman = document.body.getAttribute("data-page");
    var sisi = document.getElementById("sisi");
    var atas = document.getElementById("atas");
    var jumlah = demoJumlahAktif(data, pengguna);
    var menu = "";
    var i;

    function item(nav, teks, jalur, khusus) {
        var kelas = "";
        var angka = "";

        if (halaman === nav) {
            kelas = ' class="aktif"';
        } else if (khusus) {
            kelas = ' class="khusus-admin"';
        }

        if (nav === "laporan") {
            angka = '<span class="jumlah">' + jumlah + "</span>";
        }

        return '<li' + kelas + '><a href="' + demoArah(jalur) + '">' + teks + angka + "</a></li>";
    }

    if (sisi !== null) {
        menu = item("dashboard", "Dashboard", "pages/dashboard/index.xhtml", false) +
            item("laporan", "Laporan", "pages/laporan/index.xhtml", false) +
            item("laporan-baru", "Laporan baru", "pages/laporan-baru/index.xhtml", false) +
            item("fasilitas", "Fasilitas", "pages/fasilitas/index.xhtml", true) +
            item("pengguna", "Pengguna", "pages/pengguna/index.xhtml", true) +
            item("profil", "Profil", "pages/profil/index.xhtml", false);

        sisi.innerHTML = '<a href="' + demoArah("pages/dashboard/index.xhtml") + '" id="merek">' +
            '<img src="' + demoArah("assets/logos/logo-uajy.png") + '" alt="Lambang Universitas Atma Jaya Yogyakarta" width="34" height="40" />' +
            '<span class="nama">SIGAP</span>' +
            '<span class="sub">Gangguan dan perbaikan fasilitas</span></a>' +
            '<p class="grup">Ruang kerja</p><ul id="menu-utama">' + menu + "</ul>" +
            '<div class="kaki"><span class="pengguna">' +
            '<span class="inisial">' + demoE(demoInisial(pengguna.nama)) + "</span>" +
            '<span class="nama">' + demoE(pengguna.nama) + "</span>" +
            '<span class="peran">' + demoPeranLabel(pengguna.role) + "</span></span>" +
            '<a href="#" class="keluar" id="tombol-keluar">Keluar</a> &#183; ' +
            '<a href="#" class="keluar" id="reset-demo">Reset data</a></div>';

        if (pengguna.role !== "admin") {
            var admin = sisi.getElementsByClassName("khusus-admin");

            while (admin.length > 0) {
                admin[0].parentNode.removeChild(admin[0]);
            }
        }

        document.getElementById("tombol-keluar").onclick = function () {
            demoKeluar();
            window.location.href = demoArah("pages/login/index.xhtml");
            return false;
        };

        document.getElementById("reset-demo").onclick = function () {
            var setuju = window.confirm("Reset seluruh data demo ke kondisi awal?");

            if (setuju) {
                demoReset();
                window.location.href = demoArah("index.xhtml");
            }

            return false;
        };
    }

    if (atas !== null) {
        atas.innerHTML = '<button type="button" id="tombol-menu" aria-expanded="false">Menu</button>' +
            '<span class="lingkup">Biro Sarana dan Prasarana &#183; UAJY</span>' +
            '<span class="kanan"><span class="tanggal">' +
            demoTanggal(new Date().toISOString(), false).split(",")[0] +
            '</span><span class="pemisah">|</span>' + demoE(pengguna.nama) + "</span>";

        var tombol = document.getElementById("tombol-menu");

        tombol.onclick = function () {
            var terbuka = document.body.className.indexOf("nav-terbuka") !== -1;

            if (terbuka) {
                document.body.className = document.body.className.replace(" nav-terbuka", "").replace("nav-terbuka", "");
                tombol.setAttribute("aria-expanded", "false");
            } else {
                document.body.className = document.body.className + " nav-terbuka";
                tombol.setAttribute("aria-expanded", "true");
            }
        };
    }

    demoTampilFlash();
}

if (document.body.className.indexOf("aplikasi") !== -1) {
    var demoAktif = demoWajibMasuk();

    if (demoAktif !== null) {
        demoSiapkanShell(demoAktif);
    }
} else {
    demoTampilFlash();
}
