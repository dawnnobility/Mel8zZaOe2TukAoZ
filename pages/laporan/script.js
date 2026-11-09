/*
 * script.js halaman daftar laporan demo.
 */

var dataLaporan = null;
var penggunaLaporan = null;
var semuaLaporan = [];
var statusLaporan = "semua";

function laporanCocok(laporan) {
    var prioritas = document.getElementById("saring-prioritas").value;
    var kategori = document.getElementById("saring-kategori").value;
    var cari = document.getElementById("cari-laporan").value.trim().toLowerCase();
    var fasilitas = demoFasilitas(dataLaporan, laporan.fasilitas_id);
    var teks = (laporan.kode + " " + laporan.judul + " " + laporan.kategori).toLowerCase();

    if (fasilitas !== null) {
        teks = teks + " " + fasilitas.nama.toLowerCase() + " " + fasilitas.gedung.toLowerCase();
    }

    if (statusLaporan === "aktif" && !demoLaporanAktif(laporan)) {
        return false;
    }

    if (statusLaporan === "selesai" && laporan.status !== "selesai") {
        return false;
    }

    if (statusLaporan === "ditolak" && laporan.status !== "ditolak") {
        return false;
    }

    if (prioritas !== "" && laporan.prioritas !== prioritas) {
        return false;
    }

    if (kategori !== "" && laporan.kategori !== kategori) {
        return false;
    }

    if (cari !== "" && teks.indexOf(cari) === -1) {
        return false;
    }

    return true;
}

function gambarLaporan() {
    var hasil = 0;
    var tabel = "<tr><th>Tiket</th><th>Fasilitas</th><th>Pelapor</th><th>Prioritas</th><th>Status</th><th>Target waktu</th><th></th></tr>";
    var i;
    var laporan;
    var fasilitas;
    var pelapor;
    var sla;

    for (i = 0; i < semuaLaporan.length; i++) {
        laporan = semuaLaporan[i];

        if (!laporanCocok(laporan)) {
            continue;
        }

        hasil = hasil + 1;
        fasilitas = demoFasilitas(dataLaporan, laporan.fasilitas_id);
        pelapor = demoPengguna(dataLaporan, laporan.pelapor_id);
        sla = demoSla(laporan);

        tabel = tabel + "<tr>" +
            '<td><span class="utama">' + demoE(laporan.judul) + "</span><br />" +
            '<span class="kode">' + demoE(laporan.kode) + "</span> &#183; " +
            '<span class="redup">' + demoE(laporan.kategori) + "</span></td>" +
            "<td>" + demoE(fasilitas !== null ? fasilitas.nama : "-") + "<br />" +
            '<span class="redup">' + demoE(fasilitas !== null ? fasilitas.gedung : "-") + "</span></td>" +
            "<td>" + demoE(pelapor !== null ? pelapor.nama : "-") + "</td>" +
            '<td><span class="tanda ' + demoPrioritasKelas(laporan.prioritas) + '">' +
            '<span class="kotak"></span>' + demoPrioritasLabel(laporan.prioritas) + "</span></td>" +
            '<td><span class="tanda ' + demoStatusKelas(laporan.status) + '">' +
            '<span class="kotak"></span>' + demoStatusLabel(laporan.status) + "</span></td>" +
            '<td><span class="' + sla.kelas + '">' + demoE(sla.label) + "</span></td>" +
            '<td class="kanan"><a class="btn btn-garis btn-kecil" href="' +
            demoArah("pages/laporan-detail/index.xhtml?id=" + laporan.id) + '">Buka</a></td>' +
            "</tr>";
    }

    if (hasil === 0) {
        tabel = tabel + '<tr><td colspan="7"><div class="kosong-demo">Tidak ada tiket yang cocok dengan penyaring ini.</div></td></tr>';
    }

    document.getElementById("tabel-laporan").innerHTML = tabel;
    document.getElementById("hitung-laporan").innerHTML = hasil + " tiket ditemukan";
}

function hitungTab() {
    var semua = 0;
    var aktif = 0;
    var selesai = 0;
    var ditolak = 0;
    var i;

    for (i = 0; i < semuaLaporan.length; i++) {
        semua = semua + 1;

        if (demoLaporanAktif(semuaLaporan[i])) {
            aktif = aktif + 1;
        }

        if (semuaLaporan[i].status === "selesai") {
            selesai = selesai + 1;
        }

        if (semuaLaporan[i].status === "ditolak") {
            ditolak = ditolak + 1;
        }
    }

    document.querySelector('[data-hitung="semua"]').innerHTML = semua;
    document.querySelector('[data-hitung="aktif"]').innerHTML = aktif;
    document.querySelector('[data-hitung="selesai"]').innerHTML = selesai;
    document.querySelector('[data-hitung="ditolak"]').innerHTML = ditolak;
}

window.onload = function () {
    penggunaLaporan = demoWajibMasuk();

    if (penggunaLaporan === null) {
        return;
    }

    dataLaporan = demoBaca();
    semuaLaporan = demoLaporanTerlihat(dataLaporan, penggunaLaporan);

    hitungTab();
    gambarLaporan();

    var tab = document.getElementById("tab-laporan").getElementsByTagName("a");
    var i;

    for (i = 0; i < tab.length; i++) {
        tab[i].onclick = function () {
            var j;

            statusLaporan = this.getAttribute("data-status");

            for (j = 0; j < tab.length; j++) {
                tab[j].className = "";
            }

            this.className = "pilih";
            gambarLaporan();
            return false;
        };
    }

    document.getElementById("saring-prioritas").onchange = gambarLaporan;
    document.getElementById("saring-kategori").onchange = gambarLaporan;
    document.getElementById("cari-laporan").onkeyup = gambarLaporan;
    document.getElementById("terapkan").onclick = gambarLaporan;

    document.getElementById("atur-ulang").onclick = function () {
        document.getElementById("saring-prioritas").value = "";
        document.getElementById("saring-kategori").value = "";
        document.getElementById("cari-laporan").value = "";
        statusLaporan = "semua";

        for (i = 0; i < tab.length; i++) {
            tab[i].className = "";
        }

        tab[0].className = "pilih";
        gambarLaporan();
        return false;
    };
};
