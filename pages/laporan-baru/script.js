/*
 * script.js halaman laporan baru demo.
 */

var dataBaru = null;
var penggunaBaru = null;
var fotoBaru = null;

function isiFasilitas() {
    var pilih = document.getElementById("fasilitas_id");
    var isi = '<option value="">Pilih gedung dan ruang</option>';
    var i;
    var f;

    for (i = 0; i < dataBaru.fasilitas.length; i++) {
        f = dataBaru.fasilitas[i];

        if (f.aktif === 1) {
            isi = isi + '<option value="' + f.id + '">' + demoE(f.kode) + " &#8212; " +
                demoE(f.nama) + " (lantai " + demoE(f.lantai) + ")</option>";
        }
    }

    pilih.innerHTML = isi;
}

window.onload = function () {
    penggunaBaru = demoWajibMasuk();

    if (penggunaBaru === null) {
        return;
    }

    dataBaru = demoBaca();
    isiFasilitas();

    var inputFoto = document.getElementById("foto");

    inputFoto.onchange = function () {
        var berkas = this.files[0];
        var pratinjau = document.getElementById("pratinjau-foto");

        fotoBaru = null;
        pratinjau.innerHTML = "";

        if (!berkas) {
            return;
        }

        if (berkas.size > 400000) {
            pratinjau.innerHTML = '<p class="bantuan">Foto lebih dari 400 KB. Untuk demo, pilih foto yang lebih kecil.</p>';
            this.value = "";
            return;
        }

        var pembaca = new FileReader();

        pembaca.onload = function (peristiwa) {
            fotoBaru = peristiwa.target.result;
            pratinjau.innerHTML = '<img src="' + fotoBaru + '" alt="Pratinjau foto kondisi" />';
        };

        pembaca.readAsDataURL(berkas);
    };

    document.getElementById("ambil-lokasi").onclick = function () {
        var status = document.getElementById("status-lokasi");

        if (navigator.geolocation === undefined) {
            status.innerHTML = "Perangkat ini tidak menyediakan layanan lokasi.";
            return;
        }

        status.innerHTML = "Mengambil lokasi...";

        navigator.geolocation.getCurrentPosition(function (posisi) {
            var lat = posisi.coords.latitude.toFixed(7);
            var lng = posisi.coords.longitude.toFixed(7);

            document.getElementById("lat").value = lat;
            document.getElementById("lng").value = lng;
            status.innerHTML = "Lokasi terekam: " + lat + ", " + lng;
            document.getElementById("tautan-peta").innerHTML =
                '<a href="https://www.openstreetmap.org/?mlat=' + lat + '&amp;mlon=' + lng +
                '#map=19/' + lat + '/' + lng + '" target="_blank" rel="noopener">Buka di peta</a>';
        }, function () {
            status.innerHTML = "Lokasi tidak dapat diambil. Isi patokan lokasi secara manual.";
        }, { enableHighAccuracy: true, timeout: 8000 });
    };

    document.getElementById("form-laporan").onsubmit = function () {
        var fasilitasId = parseInt(document.getElementById("fasilitas_id").value, 10);
        var kategori = document.getElementById("kategori").value;
        var prioritas = document.getElementById("prioritas").value;
        var judul = document.getElementById("judul").value.trim();
        var deskripsi = document.getElementById("deskripsi").value.trim();
        var lokasiNama = document.getElementById("lokasi_nama").value.trim();
        var lat = document.getElementById("lat").value;
        var lng = document.getElementById("lng").value;
        var galat = document.getElementById("galat-laporan");
        var fasilitas = demoFasilitas(dataBaru, fasilitasId);
        var id;
        var kode;
        var waktu;
        var laporan;

        galat.innerHTML = "";

        if (fasilitas === null) {
            galat.innerHTML = "Pilih fasilitas dan ruang terlebih dahulu.";
            return false;
        }

        if (kategori === "") {
            galat.innerHTML = "Pilih kategori gangguan.";
            return false;
        }

        if (judul.length < 8 || judul.length > 140) {
            galat.innerHTML = "Judul laporan harus 8 sampai 140 karakter.";
            return false;
        }

        if (deskripsi.length < 20 || deskripsi.length > 1200) {
            galat.innerHTML = "Uraian kondisi harus 20 sampai 1200 karakter.";
            return false;
        }

        if (lokasiNama === "") {
            lokasiNama = fasilitas.nama + ", " + fasilitas.gedung + " lantai " + fasilitas.lantai;
        }

        id = dataBaru.urut.laporan;
        kode = "SGP-" + new Date().getFullYear() + "-" + ("0000" + id).slice(-4);
        waktu = new Date().toISOString();

        laporan = {
            id: id,
            kode: kode,
            pelapor_id: penggunaBaru.id,
            fasilitas_id: fasilitasId,
            kategori: kategori,
            judul: judul,
            deskripsi: deskripsi,
            prioritas: prioritas,
            status: "baru",
            teknisi_id: null,
            lat: lat !== "" ? lat : null,
            lng: lng !== "" ? lng : null,
            lokasi_nama: lokasiNama,
            foto: fotoBaru,
            catatan_admin: null,
            dibuat: waktu,
            diperbarui: waktu,
            selesai_pada: null
        };

        dataBaru.laporan.push(laporan);
        dataBaru.urut.laporan = dataBaru.urut.laporan + 1;

        dataBaru.riwayat.push({
            id: dataBaru.urut.riwayat,
            laporan_id: id,
            pengguna_id: penggunaBaru.id,
            status: "baru",
            catatan: "Laporan diterima sistem dan menunggu verifikasi admin.",
            dibuat: waktu
        });

        dataBaru.urut.riwayat = dataBaru.urut.riwayat + 1;
        demoTulis(dataBaru);

        demoFlash("sukses", "Laporan " + kode + " berhasil dikirim.");
        window.location.href = "../laporan-detail/index.xhtml?id=" + id;
        return false;
    };
};
