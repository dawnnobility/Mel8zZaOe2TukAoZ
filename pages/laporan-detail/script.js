/*
 * script.js halaman detail tiket demo.
 */

var dataDetail = null;
var penggunaDetail = null;
var laporanDetail = null;
var idDetail = 0;

function paramId() {
    var cari = window.location.search;
    var pasangan;
    var i;

    if (cari.indexOf("?") === 0) {
        cari = cari.substring(1);
    }

    pasangan = cari.split("&");

    for (i = 0; i < pasangan.length; i++) {
        if (pasangan[i].indexOf("id=") === 0) {
            return parseInt(pasangan[i].substring(3), 10);
        }
    }

    return 0;
}

function metaBaris(kunci, nilai) {
    return '<li><span class="k">' + demoE(kunci) + '</span><span class="v">' + nilai + "</span></li>";
}

function formAksi(aksi, judul, isi, label, kelas) {
    return '<div class="aksi-tiket-demo"><h3>' + judul + "</h3>" +
        '<form data-aksi="' + aksi + '">' + isi +
        '<p><button type="submit" class="btn ' + kelas + ' btn-penuh">' + label + "</button></p></form></div>";
}

function renderDetail() {
    var fasilitas = demoFasilitas(dataDetail, laporanDetail.fasilitas_id);
    var pelapor = demoPengguna(dataDetail, laporanDetail.pelapor_id);
    var teknisi = demoPengguna(dataDetail, laporanDetail.teknisi_id);
    var sla = demoSla(laporanDetail);
    var riwayat = demoRiwayatLaporan(dataDetail, laporanDetail.id);
    var isiRiwayat = "";
    var meta = "";
    var aksi = "";
    var i;
    var catatan;
    var pelaku;
    var peta = "";
    var foto = "";
    var html = "";

    if (fasilitas === null) {
        fasilitas = { nama: "-", gedung: "", lantai: "" };
    }

    html = '<p class="remah"><a href="../laporan/index.xhtml">Laporan</a>' +
        '<span class="pemisah">/</span><span class="mono">' + demoE(laporanDetail.kode) + "</span></p>" +
        '<div class="kepala"><div class="judul"><h1>' + demoE(laporanDetail.judul) + "</h1>" +
        '<p class="keterangan">' + demoE(fasilitas.nama) + " &#183; " + demoE(fasilitas.gedung) +
        " lantai " + demoE(fasilitas.lantai) + " &#160;|&#160; Dilaporkan " +
        demoTanggal(laporanDetail.dibuat) + "</p></div>" +
        '<div class="aksi"><a class="btn btn-garis" href="../laporan/index.xhtml">Kembali ke daftar</a></div></div>';

    for (i = 0; i < riwayat.length; i++) {
        catatan = riwayat[i];
        pelaku = demoPengguna(dataDetail, catatan.pengguna_id);

        isiRiwayat = isiRiwayat + '<li class="' + (catatan.status === "selesai" ? "selesai" : "") +
            (catatan.status === "ditolak" ? " ditolak" : "") + '">' +
            '<span class="judul">' + demoStatusLabel(catatan.status) + "</span>" +
            '<span class="waktu">' + demoTanggal(catatan.dibuat) + " &#183; " +
            demoE(pelaku !== null ? pelaku.nama : "-") + " (" +
            demoPeranLabel(pelaku !== null ? pelaku.role : "pelapor") + ")</span>" +
            (catatan.catatan !== "" ? '<p class="catatan">' + demoE(catatan.catatan) + "</p>" : "") +
            "</li>";
    }

    if (laporanDetail.lat !== null && laporanDetail.lng !== null) {
        peta = '<p class="koordinat"><span class="mono">' + demoE(laporanDetail.lat) + ", " +
            demoE(laporanDetail.lng) + "</span> &#160; " +
            '<a href="https://www.openstreetmap.org/?mlat=' + demoE(laporanDetail.lat) +
            "&amp;mlon=" + demoE(laporanDetail.lng) + "#map=19/" + demoE(laporanDetail.lat) + "/" +
            demoE(laporanDetail.lng) + '" target="_blank" rel="noopener">Buka di peta</a></p>';
    }

    if (laporanDetail.foto !== null && laporanDetail.foto !== "") {
        foto = '<div class="foto-bukti"><img src="' + laporanDetail.foto +
            '" alt="Foto kondisi gangguan pada tiket ' + demoE(laporanDetail.kode) + '" /></div>';
    }

    meta = metaBaris("Status", '<span class="tanda ' + demoStatusKelas(laporanDetail.status) +
        '"><span class="kotak"></span>' + demoStatusLabel(laporanDetail.status) + "</span>") +
        metaBaris("Kategori", demoE(laporanDetail.kategori)) +
        metaBaris("Prioritas", '<span class="tanda ' + demoPrioritasKelas(laporanDetail.prioritas) +
        '"><span class="kotak"></span>' + demoPrioritasLabel(laporanDetail.prioritas) + "</span>") +
        metaBaris("Target waktu", '<span class="' + sla.kelas + '">' + demoE(sla.label) + "</span>") +
        metaBaris("Pelapor", demoE(pelapor !== null ? pelapor.nama : "-")) +
        metaBaris("Teknisi", demoE(teknisi !== null ? teknisi.nama : "Belum ditugaskan")) +
        metaBaris("Fasilitas", demoE(fasilitas.nama) + "<br />" +
        '<span class="teks-kecil teks-redup">' + demoE(fasilitas.gedung) + "</span>") +
        metaBaris("Diperbarui", demoTanggal(laporanDetail.diperbarui));

    if (penggunaDetail.role === "admin") {
        if (laporanDetail.status === "baru") {
            aksi = aksi + formAksi("verifikasi", "Verifikasi laporan",
                '<div class="field"><label for="catatan-verifikasi">Catatan verifikasi</label>' +
                '<textarea id="catatan-verifikasi" class="textarea" rows="3"></textarea></div>',
                "Verifikasi laporan", "");
        }

        if (laporanDetail.status === "diverifikasi" || laporanDetail.status === "ditugaskan" ||
            laporanDetail.status === "dikerjakan") {
            var pilihan = '<div class="field"><label for="teknisi-tugas">Teknisi</label>' +
                '<select id="teknisi-tugas" class="select"><option value="">Pilih teknisi</option>';
            var j;

            for (j = 0; j < dataDetail.pengguna.length; j++) {
                if (dataDetail.pengguna[j].role === "teknisi" && dataDetail.pengguna[j].aktif === 1) {
                    pilihan = pilihan + '<option value="' + dataDetail.pengguna[j].id + '">' +
                        demoE(dataDetail.pengguna[j].nama) + " &#8212; " +
                        demoE(dataDetail.pengguna[j].unit) + "</option>";
                }
            }

            pilihan = pilihan + '</select></div><div class="field">' +
                '<label for="catatan-tugas">Catatan penugasan</label>' +
                '<textarea id="catatan-tugas" class="textarea" rows="3"></textarea></div>';

            aksi = aksi + formAksi("tugaskan", "Tugaskan teknisi", pilihan,
                "Simpan penugasan", "");
        }

        if (laporanDetail.status === "ditugaskan" || laporanDetail.status === "dikerjakan") {
            aksi = aksi + formAksi("selesai", "Tutup tiket",
                '<div class="field"><label for="catatan-tutup">Catatan penutupan</label>' +
                '<textarea id="catatan-tutup" class="textarea" rows="3"></textarea></div>',
                "Tutup sebagai selesai", "btn-garis");
        }

        if (laporanDetail.status !== "selesai" && laporanDetail.status !== "ditolak") {
            aksi = aksi + formAksi("tolak", "Tolak laporan",
                '<div class="field"><label for="catatan-tolak">Alasan penolakan <span class="wajib">*</span></label>' +
                '<textarea id="catatan-tolak" class="textarea" rows="3"></textarea></div>',
                "Tolak laporan", "btn-bahaya");
        }
    }

    if (penggunaDetail.role === "teknisi" && teknisi !== null &&
        Number(teknisi.id) === Number(penggunaDetail.id)) {
        if (laporanDetail.status === "ditugaskan") {
            aksi = aksi + formAksi("mulai", "Tindakan teknisi",
                '<div class="field"><label for="catatan-mulai">Catatan awal</label>' +
                '<textarea id="catatan-mulai" class="textarea" rows="3"></textarea></div>',
                "Mulai pengerjaan", "");
        }

        if (laporanDetail.status === "dikerjakan") {
            aksi = aksi + formAksi("selesai", "Selesaikan tugas",
                '<div class="field"><label for="catatan-selesai">Catatan pekerjaan</label>' +
                '<textarea id="catatan-selesai" class="textarea" rows="4"></textarea></div>',
                "Tandai selesai", "");
        }
    }

    if (Number(laporanDetail.pelapor_id) === Number(penggunaDetail.id) &&
        laporanDetail.status === "baru") {
        aksi = aksi + formAksi("hapus", "Tiket saya",
            '<p class="bantuan">Tiket yang belum diverifikasi dapat dibatalkan bila laporan dibuat keliru.</p>',
            "Batalkan tiket", "btn-bahaya");
    }

    if (aksi === "") {
        aksi = '<p class="teks-kecil teks-redup">Tidak ada tindakan lanjutan untuk peran Anda pada tiket ini.</p>';
    }

    html = html + '<div class="baris">' +
        '<div class="kolom k-66">' +
        '<div class="tiket"><div class="tiket-atas"><span class="kode">' + demoE(laporanDetail.kode) + "</span>" +
        '<span class="status-di"><span class="tanda"><span class="kotak"></span>' +
        demoStatusLabel(laporanDetail.status) + "</span></span></div>" +
        '<div class="tiket-isi"><p class="uraian">' + demoE(laporanDetail.deskripsi) + "</p>" + foto +
        '<div class="lokasi-laporan"><span class="judul-kecil">Lokasi</span><p>' +
        demoE(laporanDetail.lokasi_nama) + "</p>" + peta + "</div></div>" +
        '<div class="tiket-kaki"><span class="kiri">Pelapor: ' +
        demoE(pelapor !== null ? pelapor.nama : "-") + '</span><span class="kanan">Target: ' +
        '<span class="' + sla.kelas + '">' + demoE(sla.label) + "</span></span></div></div>" +
        '<div class="panel riwayat-panel"><div class="panel-kepala"><h2>Riwayat penanganan</h2>' +
        '<span class="tautan">' + riwayat.length + ' catatan</span></div><div class="panel-isi">' +
        '<ul class="riwayat">' + isiRiwayat + "</ul></div></div>" +
        "</div>" +
        '<div class="kolom k-34">' +
        '<div class="panel"><div class="panel-kepala"><h2>Keterangan tiket</h2></div>' +
        '<div class="panel-isi"><ul class="meta">' + meta + "</ul></div></div>" +
        '<div class="panel"><div class="panel-kepala"><h2>Tindakan</h2></div>' +
        '<div class="panel-isi">' + aksi + "</div></div>" +
        "</div></div>";

    document.getElementById("isi-detail").innerHTML = html;
}

function catatRiwayat(data, laporan, pengguna, status, catatan, waktu) {
    data.riwayat.push({
        id: data.urut.riwayat,
        laporan_id: laporan.id,
        pengguna_id: pengguna.id,
        status: status,
        catatan: catatan,
        dibuat: waktu
    });
    data.urut.riwayat = data.urut.riwayat + 1;
}

function jalankanAksi(aksi, form) {
    var data = demoBaca();
    var laporan = demoCari(data.laporan, idDetail);
    var pengguna = demoSesiPengguna();
    var waktu = new Date().toISOString();
    var areaCatatan = form.getElementsByTagName("textarea");
    var catatan = "";
    var i;

    if (laporan === null || pengguna === null) {
        return;
    }

    if (areaCatatan.length > 0) {
        catatan = areaCatatan[0].value.trim();
    }

    if (aksi === "hapus") {
        if (!window.confirm("Batalkan dan hapus tiket ini?")) {
            return;
        }

        if (pengguna.role !== "admin" && Number(laporan.pelapor_id) !== Number(pengguna.id)) {
            demoFlash("galat", "Anda tidak berhak menghapus tiket ini.");
            window.location.reload();
            return;
        }

        if (laporan.status !== "baru") {
            demoFlash("galat", "Tiket yang sudah diverifikasi tidak dapat dihapus.");
            window.location.reload();
            return;
        }

        for (i = data.laporan.length - 1; i >= 0; i--) {
            if (Number(data.laporan[i].id) === Number(laporan.id)) {
                data.laporan.splice(i, 1);
            }
        }

        for (i = data.riwayat.length - 1; i >= 0; i--) {
            if (Number(data.riwayat[i].laporan_id) === Number(laporan.id)) {
                data.riwayat.splice(i, 1);
            }
        }

        demoTulis(data);
        demoFlash("sukses", "Tiket " + laporan.kode + " dibatalkan dan dihapus.");
        window.location.href = "../laporan/index.xhtml";
        return;
    }

    if (aksi === "verifikasi") {
        if (pengguna.role !== "admin" || laporan.status !== "baru") {
            demoFlash("galat", "Verifikasi tidak dapat dilakukan pada tiket ini.");
            window.location.reload();
            return;
        }

        if (catatan === "") {
            catatan = "Laporan diverifikasi dan masuk antrian penanganan.";
        }

        laporan.status = "diverifikasi";
        laporan.catatan_admin = catatan;
        laporan.diperbarui = waktu;
        catatRiwayat(data, laporan, pengguna, "diverifikasi", catatan, waktu);
    } else if (aksi === "tugaskan") {
        var pilih = form.getElementsByTagName("select")[0];
        var teknisi = demoPengguna(data, parseInt(pilih.value, 10));

        if (pengguna.role !== "admin") {
            demoFlash("galat", "Penugasan hanya dapat dilakukan admin.");
            window.location.reload();
            return;
        }

        if (teknisi === null) {
            demoFlash("galat", "Pilih teknisi aktif terlebih dahulu.");
            window.location.reload();
            return;
        }

        if (catatan === "") {
            catatan = "Tiket ditugaskan kepada " + teknisi.nama + ".";
        }

        laporan.status = "ditugaskan";
        laporan.teknisi_id = teknisi.id;
        laporan.catatan_admin = catatan;
        laporan.diperbarui = waktu;
        catatRiwayat(data, laporan, pengguna, "ditugaskan", catatan, waktu);
    } else if (aksi === "mulai") {
        if (Number(laporan.teknisi_id) !== Number(pengguna.id) || laporan.status !== "ditugaskan") {
            demoFlash("galat", "Pengerjaan tidak dapat dimulai dari status ini.");
            window.location.reload();
            return;
        }

        if (catatan === "") {
            catatan = "Teknisi mulai memeriksa lokasi.";
        }

        laporan.status = "dikerjakan";
        laporan.diperbarui = waktu;
        catatRiwayat(data, laporan, pengguna, "dikerjakan", catatan, waktu);
    } else if (aksi === "selesai") {
        var boleh = pengguna.role === "admin" || Number(laporan.teknisi_id) === Number(pengguna.id);

        if (!boleh || laporan.status !== "dikerjakan") {
            demoFlash("galat", "Tiket harus dikerjakan sebelum ditutup.");
            window.location.reload();
            return;
        }

        if (catatan === "") {
            catatan = "Pekerjaan selesai dan area sudah diuji.";
        }

        laporan.status = "selesai";
        laporan.selesai_pada = waktu;
        laporan.diperbarui = waktu;
        laporan.catatan_admin = catatan;
        catatRiwayat(data, laporan, pengguna, "selesai", catatan, waktu);
    } else if (aksi === "tolak") {
        if (pengguna.role !== "admin") {
            demoFlash("galat", "Penolakan hanya dapat dilakukan admin.");
            window.location.reload();
            return;
        }

        if (catatan === "") {
            demoFlash("galat", "Alasan penolakan wajib diisi.");
            window.location.reload();
            return;
        }

        laporan.status = "ditolak";
        laporan.catatan_admin = catatan;
        laporan.diperbarui = waktu;
        catatRiwayat(data, laporan, pengguna, "ditolak", catatan, waktu);
    } else {
        return;
    }

    demoTulis(data);
    demoFlash("sukses", "Tindakan " + aksi + " pada " + laporan.kode + " tersimpan.");
    window.location.reload();
}

window.onload = function () {
    penggunaDetail = demoWajibMasuk();

    if (penggunaDetail === null) {
        return;
    }

    idDetail = paramId();
    dataDetail = demoBaca();
    laporanDetail = demoCari(dataDetail.laporan, idDetail);

    if (laporanDetail === null) {
        demoFlash("galat", "Tiket tidak ditemukan.");
        window.location.href = "../laporan/index.xhtml";
        return;
    }

    if (penggunaDetail.role !== "admin" &&
        !(penggunaDetail.role === "teknisi" && Number(laporanDetail.teknisi_id) === Number(penggunaDetail.id)) &&
        !(penggunaDetail.role === "pelapor" && Number(laporanDetail.pelapor_id) === Number(penggunaDetail.id))) {
        demoFlash("galat", "Tiket ini bukan milik atau bukan tugas Anda.");
        window.location.href = "../laporan/index.xhtml";
        return;
    }

    renderDetail();

    document.getElementById("isi-detail").onsubmit = function (peristiwa) {
        var kejadian = peristiwa || window.event;
        var form = kejadian.target || kejadian.srcElement;
        var aksi = form.getAttribute("data-aksi");

        if (aksi === null) {
            return true;
        }

        if (kejadian.preventDefault) {
            kejadian.preventDefault();
        } else {
            kejadian.returnValue = false;
        }

        jalankanAksi(aksi, form);
        return false;
    };
};
