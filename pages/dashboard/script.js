/*
 * script.js dashboard demo.
 */

function demoSelDashboard(label, nilai, catatan, peringatan) {
    var kelas = "nilai";

    if (peringatan) {
        kelas = kelas + " peringatan";
    }

    return '<div class="sel"><span class="label">' + demoE(label) + "</span>" +
        '<span class="' + kelas + '">' + nilai + "</span>" +
        '<span class="catatan">' + demoE(catatan) + "</span></div>";
}

function demoBarisDashboard(data, laporan) {
    var pelapor = demoPengguna(data, laporan.pelapor_id);
    var sla = demoSla(laporan);

    return "<tr>" +
        '<td><span class="utama">' + demoE(laporan.judul) + "</span><br />" +
        '<span class="kode">' + demoE(laporan.kode) + "</span></td>" +
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

window.onload = function () {
    var pengguna = demoWajibMasuk();
    var data;
    var daftar;
    var aktif = 0;
    var baru = 0;
    var lewat = 0;
    var selesai = 0;
    var ditolak = 0;
    var dikerjakan = 0;
    var i;
    var laporan;
    var sla;
    var strip = "";
    var tabel = "";
    var samping = "";
    var aktivitas = "";
    var batas;

    if (pengguna === null) {
        return;
    }

    data = demoBaca();
    daftar = demoLaporanTerlihat(data, pengguna);

    for (i = 0; i < daftar.length; i++) {
        laporan = daftar[i];
        sla = demoSla(laporan);

        if (laporan.status === "baru") {
            baru = baru + 1;
        }

        if (laporan.status === "dikerjakan") {
            dikerjakan = dikerjakan + 1;
        }

        if (laporan.status === "selesai") {
            selesai = selesai + 1;
        }

        if (laporan.status === "ditolak") {
            ditolak = ditolak + 1;
        }

        if (demoLaporanAktif(laporan)) {
            aktif = aktif + 1;

            if (sla.kelas === "sla-lewat") {
                lewat = lewat + 1;
            }
        }
    }

    if (pengguna.role === "admin") {
        document.getElementById("ket-dashboard").innerHTML =
            "Antrian seluruh fasilitas kampus per " + demoTanggal(new Date().toISOString(), false) + ".";
        document.getElementById("judul-samping").innerHTML = "Beban teknisi";

        strip = demoSelDashboard("Antrian terbuka", aktif, "Belum ditutup", false) +
            demoSelDashboard("Menunggu verifikasi", baru, "Perlu diperiksa admin", false) +
            demoSelDashboard("Lewat target waktu", lewat, "Perlu dinaikkan prioritasnya", lewat > 0) +
            demoSelDashboard("Selesai", selesai, "Tiket yang sudah ditutup", false);

        for (i = 0; i < data.pengguna.length; i++) {
            if (data.pengguna[i].role === "teknisi" && data.pengguna[i].aktif === 1) {
                var jumlahTugas = 0;
                var j;

                for (j = 0; j < data.laporan.length; j++) {
                    if (Number(data.laporan[j].teknisi_id) === Number(data.pengguna[i].id) &&
                        demoLaporanAktif(data.laporan[j])) {
                        jumlahTugas = jumlahTugas + 1;
                    }
                }

                samping = samping + '<div class="beban"><div class="baris-atas">' +
                    '<span class="nama">' + demoE(data.pengguna[i].nama) + "</span>" +
                    '<span class="jumlah">' + jumlahTugas + " tiket</span></div>" +
                    '<div class="batang"><span class="isi" style="width:' +
                    Math.round((jumlahTugas / 3) * 100) + '%"></span></div></div>';
            }
        }
    } else if (pengguna.role === "teknisi") {
        document.getElementById("ket-dashboard").innerHTML =
            "Tugas yang ditugaskan kepada Anda per " + demoTanggal(new Date().toISOString(), false) + ".";
        document.getElementById("judul-samping").innerHTML = "Ringkasan tugas";

        strip = demoSelDashboard("Tugas aktif", aktif, "Belum ditutup", false) +
            demoSelDashboard("Sedang dikerjakan", dikerjakan, "Sedang berjalan", false) +
            demoSelDashboard("Lewat target", lewat, "Perlu segera diselesaikan", lewat > 0) +
            demoSelDashboard("Selesai", selesai, "Sudah ditutup", false);

        samping = '<div class="ringkas">' +
            '<div class="butir"><span class="angka">' + daftar.length + '</span><span class="label">Total tugas</span></div>' +
            '<div class="butir"><span class="angka">' + aktif + '</span><span class="label">Masih berjalan</span></div>' +
            '<div class="butir"><span class="angka">' + selesai + '</span><span class="label">Selesai</span></div>' +
            '<div class="butir"><span class="angka">' + lewat + '</span><span class="label">Lewat target</span></div>' +
            "</div>";
    } else {
        document.getElementById("ket-dashboard").innerHTML =
            "Laporan yang Anda kirim per " + demoTanggal(new Date().toISOString(), false) + ".";
        document.getElementById("judul-samping").innerHTML = "Ringkasan laporan";

        strip = demoSelDashboard("Laporan saya", daftar.length, "Seluruh tiket Anda", false) +
            demoSelDashboard("Masih berjalan", aktif, "Belum ditutup", false) +
            demoSelDashboard("Selesai", selesai, "Sudah ditangani", false) +
            demoSelDashboard("Ditolak", ditolak, "Tidak dilanjutkan", false);

        samping = '<div class="ringkas">' +
            '<div class="butir"><span class="angka">' + daftar.length + '</span><span class="label">Total laporan</span></div>' +
            '<div class="butir"><span class="angka">' + baru + '</span><span class="label">Menunggu verifikasi</span></div>' +
            '<div class="butir"><span class="angka">' + aktif + '</span><span class="label">Sedang berjalan</span></div>' +
            '<div class="butir"><span class="angka">' + selesai + '</span><span class="label">Selesai</span></div>' +
            "</div>";
    }

    document.getElementById("strip-dashboard").innerHTML = strip;

    tabel = "<tr><th>Tiket</th><th>Pelapor</th><th>Prioritas</th><th>Status</th><th>Target waktu</th><th></th></tr>";

    for (i = 0; i < daftar.length && i < 7; i++) {
        tabel = tabel + demoBarisDashboard(data, daftar[i]);
    }

    if (daftar.length === 0) {
        tabel = tabel + '<tr><td colspan="6"><div class="kosong-demo">Belum ada laporan untuk peran ini.</div></td></tr>';
    }

    document.getElementById("tabel-dashboard").innerHTML = tabel;
    document.getElementById("panel-samping").innerHTML = samping;

    batas = demoAktivitas(data, pengguna, 6);

    for (i = 0; i < batas.length; i++) {
        var catatan = batas[i];
        var tiket = demoCari(data.laporan, catatan.laporan_id);
        var pelaku = demoPengguna(data, catatan.pengguna_id);

        aktivitas = aktivitas + "<li>" +
            '<span class="waktu">' + demoTanggal(catatan.dibuat, true) + " &#183; " +
            demoE(pelaku !== null ? pelaku.nama : "-") + "</span>" +
            "<strong>" + demoStatusLabel(catatan.status) + "</strong> &#183; " +
            '<a href="' + demoArah("pages/laporan-detail/index.xhtml?id=" + catatan.laporan_id) + '">' +
            demoE(tiket !== null ? tiket.kode : "-") + "</a><br />" +
            '<span class="catatan-kecil">' + demoE(catatan.catatan) + "</span></li>";
    }

    if (aktivitas === "") {
        aktivitas = '<p class="kosong-demo">Belum ada aktivitas.</p>';
    }

    document.getElementById("aktivitas").innerHTML = aktivitas;
};
