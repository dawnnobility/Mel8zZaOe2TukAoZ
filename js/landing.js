/*
 * landing.js
 * Mengubah isi tiket contoh ketika pengunjung memilih salah satu tahap,
 * lalu menampilkan bagian halaman secara bertahap saat digulir.
 * Data tahap disimpan dalam array sederhana.
 */

var tahapTiket = new Array();

tahapTiket[0] = {
    status: "Baru",
    catatan: "Laporan masuk pukul 08.14. Admin fasilitas menerima tiket dan memeriksa kelengkapan foto serta lokasi.",
    waktu: "Diperbarui 2 jam lalu",
    pelapor: "Aditya N.",
    petugas: "Menunggu verifikasi"
};

tahapTiket[1] = {
    status: "Ditugaskan",
    catatan: "Tiket diteruskan ke Yohanes Bagas, teknisi listrik. Pemeriksaan dijadwalkan setelah jam praktikum.",
    waktu: "Diperbarui 1 jam lalu",
    pelapor: "Aditya N.",
    petugas: "Y. Bagas"
};

tahapTiket[2] = {
    status: "Dikerjakan",
    catatan: "Teknisi memeriksa jalur kabel dan mengganti stop kontak. Area diberi penanda agar tidak dipakai sementara.",
    waktu: "Diperbarui 20 menit lalu",
    pelapor: "Aditya N.",
    petugas: "Y. Bagas"
};

tahapTiket[3] = {
    status: "Selesai",
    catatan: "Pekerjaan selesai dan diuji bersama pelapor. Tiket ditutup dengan catatan penggantian komponen.",
    waktu: "Ditutup hari ini",
    pelapor: "Aditya N.",
    petugas: "Y. Bagas"
};

function pilihTahap(nomor) {
    var data = tahapTiket[nomor];
    var daftar = document.getElementById("langkah-tiket").getElementsByTagName("button");
    var i;

    document.getElementById("status-tiket").innerHTML = data.status;
    document.getElementById("catatan-tiket").innerHTML = data.catatan;
    document.getElementById("waktu-tiket").innerHTML = data.waktu;
    document.getElementById("pelapor-tiket").innerHTML = data.pelapor;
    document.getElementById("petugas-tiket").innerHTML = data.petugas;

    for (i = 0; i < daftar.length; i++) {
        if (i === nomor) {
            daftar[i].className = "pilih";
            daftar[i].setAttribute("aria-pressed", "true");
        } else {
            daftar[i].className = "";
            daftar[i].setAttribute("aria-pressed", "false");
        }
    }
}

/* ---------------------------------------------------------------------------
 * Gerak masuk
 * Elemen berkelas "gerak" mulai transparan lalu muncul saat masuk layar.
 * Bila pengunjung meminta gerak dikurangi, elemen dibiarkan tampil apa adanya.
 * ------------------------------------------------------------------------- */

var daftarGerak = document.getElementsByClassName("gerak");
var sudahGerak = new Array();

function tampilkanGerak() {
    var tinggi = window.innerHeight || document.documentElement.clientHeight;
    var kotak;
    var i;

    for (i = 0; i < daftarGerak.length; i++) {
        if (sudahGerak[i] === true) {
            continue;
        }

        kotak = daftarGerak[i].getBoundingClientRect();

        if (kotak.top < tinggi - 40) {
            daftarGerak[i].style.opacity = "1";
            daftarGerak[i].style.transform = "translateY(0)";
            sudahGerak[i] = true;
        }
    }
}

function tampilkanSemua() {
    var i;

    for (i = 0; i < daftarGerak.length; i++) {
        daftarGerak[i].style.opacity = "1";
        daftarGerak[i].style.transform = "translateY(0)";
        sudahGerak[i] = true;
    }
}

function siapkanGerak() {
    var kurangi = false;
    var i;

    if (window.matchMedia !== undefined) {
        kurangi = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    if (kurangi) {
        return;
    }

    for (i = 0; i < daftarGerak.length; i++) {
        sudahGerak[i] = false;
        daftarGerak[i].style.opacity = "0";
        daftarGerak[i].style.transform = "translateY(16px)";
        daftarGerak[i].style.transitionDelay = ((i % 4) * 60) + "ms";
    }

    window.onscroll = tampilkanGerak;
    window.setTimeout(tampilkanGerak, 120);
    window.setTimeout(tampilkanSemua, 500);
}

siapkanGerak();

window.onload = function () {
    var daftar = document.getElementById("langkah-tiket").getElementsByTagName("button");
    var i;

    for (i = 0; i < daftar.length; i++) {
        daftar[i].onclick = function () {
            pilihTahap(parseInt(this.getAttribute("data-tahap"), 10));
        };
    }

    pilihTahap(2);
    tampilkanGerak();
};
