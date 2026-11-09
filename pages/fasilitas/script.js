/*
 * script.js halaman fasilitas demo.
 * Menampilkan daftar fasilitas, menambah, mengubah, dan menghapus data
 * yang belum dipakai laporan.
 */

var dataFasilitas = null;
var editFasilitas = 0;

function fasilitasUrut(daftar) {
    var salinan = daftar.slice(0);

    salinan.sort(function (a, b) {
        if (a.gedung !== b.gedung) {
            return a.gedung < b.gedung ? -1 : 1;
        }

        if (Number(a.lantai) !== Number(b.lantai)) {
            return Number(a.lantai) - Number(b.lantai);
        }

        if (a.nama === b.nama) {
            return 0;
        }

        return a.nama < b.nama ? -1 : 1;
    });

    return salinan;
}

function tampilFasilitas() {
    var daftar = fasilitasUrut(dataFasilitas.fasilitas);
    var tabel = "<tr><th>Kode</th><th>Nama dan gedung</th><th>Jenis</th>" +
        '<th class="kanan">Laporan</th><th>Status</th><th></th></tr>';
    var i;
    var f;
    var jumlah;

    for (i = 0; i < daftar.length; i++) {
        f = daftar[i];
        jumlah = demoJumlahLaporanFasilitas(dataFasilitas, f.id);

        tabel = tabel + "<tr>" +
            '<td><span class="kode">' + demoE(f.kode) + "</span></td>" +
            "<td><span class=\"utama\">" + demoE(f.nama) + "</span>" +
            '<span class="sub-baris">' + demoE(f.gedung) + " &#183; lantai " +
            demoE(f.lantai) + "</span></td>" +
            "<td>" + demoE(f.kategori) + "</td>" +
            '<td class="kanan">' + jumlah + "</td>" +
            "<td>" + (f.aktif === 1
                ? '<span class="tanda status-selesai"><span class="kotak"></span>Aktif</span>'
                : '<span class="tanda status-ditolak"><span class="kotak"></span>Nonaktif</span>') +
            "</td>" +
            '<td class="kanan aksi-baris">' +
            '<a class="tautan-kecil" href="index.xhtml?edit=' + f.id + '">Ubah</a>' +
            '<button type="button" class="tautan-hapus" data-hapus="' + f.id + '">Hapus</button>' +
            "</td></tr>";
    }

    if (daftar.length === 0) {
        tabel = tabel + '<tr><td colspan="6"><div class="kosong-demo">Belum ada fasilitas.</div></td></tr>';
    }

    document.getElementById("tabel-fasilitas").innerHTML = tabel;
    document.getElementById("hitung-fasilitas").innerHTML = daftar.length + " ruang dan area";
}

function isiFormFasilitas() {
    var f;

    if (editFasilitas === 0) {
        return;
    }

    f = demoFasilitas(dataFasilitas, editFasilitas);

    if (f === null) {
        editFasilitas = 0;
        return;
    }

    document.getElementById("id").value = f.id;
    document.getElementById("kode").value = f.kode;
    document.getElementById("nama").value = f.nama;
    document.getElementById("gedung").value = f.gedung;
    document.getElementById("lantai").value = f.lantai;
    document.getElementById("kategori").value = f.kategori;
    document.getElementById("keterangan").value = f.keterangan;
    document.getElementById("aktif").checked = f.aktif === 1;

    document.getElementById("judul-form").innerHTML = "Ubah fasilitas";
    document.getElementById("tombol-simpan").innerHTML = "Simpan perubahan";
    document.getElementById("batal-edit").style.display = "inline-block";
}

function hapusFasilitas(id) {
    var f = demoFasilitas(dataFasilitas, id);
    var jumlah;
    var i;

    if (f === null) {
        demoFlash("galat", "Fasilitas tidak ditemukan.");
        window.location.href = "index.xhtml";
        return;
    }

    jumlah = demoJumlahLaporanFasilitas(dataFasilitas, id);

    if (jumlah > 0) {
        demoFlash("galat", "Fasilitas " + f.kode + " sudah dipakai " + jumlah +
            " laporan sehingga tidak dapat dihapus. Nonaktifkan melalui formulir ubah.");
        window.location.href = "index.xhtml";
        return;
    }

    if (!window.confirm("Hapus fasilitas " + f.kode + "?")) {
        return;
    }

    for (i = 0; i < dataFasilitas.fasilitas.length; i++) {
        if (Number(dataFasilitas.fasilitas[i].id) === Number(id)) {
            dataFasilitas.fasilitas.splice(i, 1);
            break;
        }
    }

    demoTulis(dataFasilitas);
    demoFlash("sukses", "Fasilitas " + f.kode + " dihapus.");
    window.location.href = "index.xhtml";
}

window.onload = function () {
    var pengguna = demoWajibAdmin();
    var cocok;
    var form;

    if (pengguna === null) {
        return;
    }

    dataFasilitas = demoBaca();

    cocok = window.location.search.match(/[?&]edit=(\d+)/);

    if (cocok !== null) {
        editFasilitas = parseInt(cocok[1], 10);
    }

    isiFormFasilitas();
    tampilFasilitas();

    document.getElementById("tabel-fasilitas").onclick = function (peristiwa) {
        var sasaran = peristiwa.target;
        var id = sasaran.getAttribute("data-hapus");

        if (id !== null) {
            hapusFasilitas(parseInt(id, 10));
        }
    };

    form = document.getElementById("form-fasilitas");

    form.onsubmit = function () {
        var kode = document.getElementById("kode");
        var nama = document.getElementById("nama");
        var gedung = document.getElementById("gedung");
        var lantai = document.getElementById("lantai");
        var kategori = document.getElementById("kategori");
        var keterangan = document.getElementById("keterangan");
        var aktif = document.getElementById("aktif").checked ? 1 : 0;
        var galat = document.getElementById("galat-fasilitas");
        var pola = /^[A-Z0-9-]{2,20}$/;
        var data = dataFasilitas;
        var i;
        var f;
        var baru;

        document.getElementById("galat-kode").innerHTML = "";
        document.getElementById("galat-nama").innerHTML = "";
        document.getElementById("galat-gedung").innerHTML = "";
        galat.innerHTML = "";

        if (kode.value.toUpperCase() !== kode.value) {
            kode.value = kode.value.toUpperCase();
        }

        if (!pola.test(kode.value)) {
            document.getElementById("galat-kode").innerHTML =
                "Kode harus 2 sampai 20 karakter: huruf kapital, angka, atau tanda hubung.";
            return false;
        }

        if (nama.value.replace(/ /g, "").length < 3) {
            document.getElementById("galat-nama").innerHTML = "Nama ruang minimal 3 karakter.";
            return false;
        }

        if (gedung.value.replace(/ /g, "").length < 3) {
            document.getElementById("galat-gedung").innerHTML = "Nama gedung wajib diisi.";
            return false;
        }

        if (lantai.value.replace(/ /g, "") === "") {
            document.getElementById("galat-gedung").innerHTML =
                "Lantai wajib diisi (isi 0 untuk area luar).";
            return false;
        }

        for (i = 0; i < data.fasilitas.length; i++) {
            f = data.fasilitas[i];

            if (f.kode.toUpperCase() === kode.value && Number(f.id) !== editFasilitas) {
                document.getElementById("galat-kode").innerHTML =
                    "Kode " + kode.value + " sudah dipakai fasilitas lain.";
                return false;
            }
        }

        if (editFasilitas > 0) {
            f = demoFasilitas(data, editFasilitas);

            if (f === null) {
                galat.innerHTML = "Fasilitas yang akan diubah tidak ditemukan.";
                return false;
            }

            f.kode = kode.value;
            f.nama = nama.value.trim();
            f.gedung = gedung.value.trim();
            f.lantai = lantai.value.trim();
            f.kategori = kategori.value;
            f.keterangan = keterangan.value.trim();
            f.aktif = aktif;

            demoTulis(data);
            demoFlash("sukses", "Fasilitas " + f.kode + " diperbarui.");
        } else {
            baru = {
                id: data.urut.fasilitas,
                kode: kode.value,
                nama: nama.value.trim(),
                gedung: gedung.value.trim(),
                lantai: lantai.value.trim(),
                kategori: kategori.value,
                keterangan: keterangan.value.trim(),
                aktif: aktif
            };

            data.fasilitas.push(baru);
            data.urut.fasilitas = data.urut.fasilitas + 1;

            demoTulis(data);
            demoFlash("sukses", "Fasilitas " + baru.kode + " ditambahkan.");
        }

        window.location.href = "index.xhtml";
        return false;
    };
};
