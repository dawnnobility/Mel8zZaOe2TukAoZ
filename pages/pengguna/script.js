/*
 * script.js halaman pengguna demo.
 * Menampilkan akun, mengubah peran dan status, serta menghapus akun
 * yang belum memiliki riwayat laporan.
 */

var dataPengguna = null;
var penggunaAdmin = null;

function peranUrut(peran) {
    if (peran === "admin") {
        return 0;
    }

    if (peran === "teknisi") {
        return 1;
    }

    return 2;
}

function tampilPengguna() {
    var daftar = dataPengguna.pengguna.slice(0);
    var tabel = "<tr><th>Nama dan akun</th><th>Unit</th><th>Peran dan status</th>" +
        '<th class="kanan">Laporan</th><th></th></tr>';
    var jumlahAdmin = 0;
    var jumlahTeknisi = 0;
    var jumlahPelapor = 0;
    var strip;
    var i;
    var akun;
    var laporan;
    var tugas;
    var opsi;

    daftar.sort(function (a, b) {
        if (peranUrut(a.role) !== peranUrut(b.role)) {
            return peranUrut(a.role) - peranUrut(b.role);
        }

        if (a.nama === b.nama) {
            return 0;
        }

        return a.nama < b.nama ? -1 : 1;
    });

    for (i = 0; i < daftar.length; i++) {
        akun = daftar[i];

        if (akun.role === "admin") {
            jumlahAdmin = jumlahAdmin + 1;
        } else if (akun.role === "teknisi") {
            jumlahTeknisi = jumlahTeknisi + 1;
        } else {
            jumlahPelapor = jumlahPelapor + 1;
        }

        laporan = 0;
        tugas = 0;

        var j;

        for (j = 0; j < dataPengguna.laporan.length; j++) {
            if (Number(dataPengguna.laporan[j].pelapor_id) === Number(akun.id)) {
                laporan = laporan + 1;
            }

            if (Number(dataPengguna.laporan[j].teknisi_id) === Number(akun.id)) {
                tugas = tugas + 1;
            }
        }

        opsi = "";

        opsi = opsi + '<option value="pelapor"' +
            (akun.role === "pelapor" ? ' selected="selected"' : "") + ">Pelapor</option>";
        opsi = opsi + '<option value="teknisi"' +
            (akun.role === "teknisi" ? ' selected="selected"' : "") + ">Teknisi</option>";
        opsi = opsi + '<option value="admin"' +
            (akun.role === "admin" ? ' selected="selected"' : "") + ">Admin</option>";

        tabel = tabel + "<tr>" +
            "<td><span class=\"utama\">" + demoE(akun.nama) + "</span>" +
            '<span class="sub-baris">' + demoE(akun.username) + " &#183; " +
            demoE(akun.email) + "</span></td>" +
            "<td>" + demoE(akun.unit) +
            '<span class="sub-baris">' + demoE(akun.telepon !== "" && akun.telepon !== null
                ? akun.telepon : "Tanpa telepon") + "</span></td>" +
            "<td>" +
            '<form action="#" method="post" class="form-peran" data-id="' + akun.id + '">' +
            '<select name="role" class="select select-kecil">' + opsi + "</select>" +
            '<label class="cek-kecil"><input type="checkbox" name="aktif" value="1"' +
            (akun.aktif === 1 ? ' checked="checked"' : "") + " /> Aktif</label>" +
            '<button type="submit" class="btn btn-kecil btn-garis">Simpan</button>' +
            "</form>" +
            (Number(akun.id) === Number(penggunaAdmin.id)
                ? '<span class="teks-kecil teks-redup">Akun Anda</span>' : "") +
            "</td>" +
            '<td class="kanan">' + laporan +
            '<span class="sub-baris">' + tugas + " tugas</span></td>" +
            '<td class="kanan">' +
            (Number(akun.id) === Number(penggunaAdmin.id)
                ? ""
                : '<button type="button" class="tautan-hapus" data-hapus="' + akun.id +
                  '">Hapus</button>') +
            "</td></tr>";
    }

    document.getElementById("tabel-pengguna").innerHTML = tabel;
    document.getElementById("hitung-pengguna").innerHTML = daftar.length + " akun";

    strip = '<div class="sel"><span class="label">Admin fasilitas</span>' +
        '<span class="nilai">' + jumlahAdmin + "</span>" +
        '<span class="catatan">Verifikasi dan penugasan</span></div>' +
        '<div class="sel"><span class="label">Teknisi</span>' +
        '<span class="nilai">' + jumlahTeknisi + "</span>" +
        '<span class="catatan">Pelaksana perbaikan</span></div>' +
        '<div class="sel"><span class="label">Pelapor</span>' +
        '<span class="nilai">' + jumlahPelapor + "</span>" +
        '<span class="catatan">Mahasiswa, dosen, dan staf</span></div>';

    document.getElementById("strip-pengguna").innerHTML = strip;
}

function simpanPeran(form) {
    var id = parseInt(form.getAttribute("data-id"), 10);
    var role = form.elements.role.value;
    var aktif = form.elements.aktif.checked ? 1 : 0;
    var akun = demoPengguna(dataPengguna, id);

    if (akun === null) {
        demoFlash("galat", "Akun tidak ditemukan.");
        window.location.href = "index.xhtml";
        return;
    }

    if (Number(id) === Number(penggunaAdmin.id) && role !== "admin") {
        demoFlash("galat", "Anda tidak dapat menurunkan peran akun sendiri.");
        window.location.href = "index.xhtml";
        return;
    }

    if (Number(id) === Number(penggunaAdmin.id) && aktif === 0) {
        demoFlash("galat", "Anda tidak dapat menonaktifkan akun sendiri.");
        window.location.href = "index.xhtml";
        return;
    }

    if (!window.confirm("Simpan perubahan peran dan status akun ini?")) {
        return;
    }

    akun.role = role;
    akun.aktif = aktif;

    demoTulis(dataPengguna);
    demoFlash("sukses", "Akun " + akun.username + " diperbarui menjadi " +
        demoPeranLabel(role) + (aktif === 1 ? " dan aktif." : " dan nonaktif."));
    window.location.href = "index.xhtml";
}

function hapusPengguna(id) {
    var akun = demoPengguna(dataPengguna, id);
    var laporan = 0;
    var tugas = 0;
    var i;

    if (akun === null) {
        demoFlash("galat", "Akun tidak ditemukan.");
        window.location.href = "index.xhtml";
        return;
    }

    if (Number(id) === Number(penggunaAdmin.id)) {
        demoFlash("galat", "Akun sendiri tidak dapat dihapus.");
        window.location.href = "index.xhtml";
        return;
    }

    for (i = 0; i < dataPengguna.laporan.length; i++) {
        if (Number(dataPengguna.laporan[i].pelapor_id) === Number(id)) {
            laporan = laporan + 1;
        }

        if (Number(dataPengguna.laporan[i].teknisi_id) === Number(id)) {
            tugas = tugas + 1;
        }
    }

    if (laporan > 0 || tugas > 0) {
        demoFlash("galat", "Akun " + akun.username + " memiliki " + laporan +
            " laporan dan " + tugas + " tugas. Nonaktifkan akun agar riwayat tetap utuh.");
        window.location.href = "index.xhtml";
        return;
    }

    if (!window.confirm("Hapus akun " + akun.username + "?")) {
        return;
    }

    for (i = 0; i < dataPengguna.pengguna.length; i++) {
        if (Number(dataPengguna.pengguna[i].id) === Number(id)) {
            dataPengguna.pengguna.splice(i, 1);
            break;
        }
    }

    demoTulis(dataPengguna);
    demoFlash("sukses", "Akun " + akun.username + " dihapus.");
    window.location.href = "index.xhtml";
}

window.onload = function () {
    penggunaAdmin = demoWajibAdmin();

    if (penggunaAdmin === null) {
        return;
    }

    dataPengguna = demoBaca();
    tampilPengguna();

    document.getElementById("tabel-pengguna").onclick = function (peristiwa) {
        var id = peristiwa.target.getAttribute("data-hapus");

        if (id !== null) {
            hapusPengguna(parseInt(id, 10));
        }
    };

    document.getElementById("tabel-pengguna").onsubmit = function (peristiwa) {
        if (peristiwa.target.className === "form-peran") {
            simpanPeran(peristiwa.target);
            peristiwa.preventDefault();
        }
    };
};
