/*
 * script.js halaman profil demo.
 * Mengubah data akun, foto profil (disimpan sebagai data URL di
 * localStorage), dan kata sandi.
 */

var dataProfil = null;
var penggunaProfil = null;
var fotoProfilBaru = null;

function tampilAvatar(pengguna) {
    var kotak = document.getElementById("avatar-profil");

    if (pengguna.foto !== null && pengguna.foto !== undefined && pengguna.foto !== "") {
        kotak.innerHTML = '<img src="' + pengguna.foto + '" alt="Foto profil ' +
            demoE(pengguna.nama) + '" width="76" height="76" class="avatar-besar bulat" />';
    } else {
        kotak.innerHTML = '<span class="avatar avatar-besar">' +
            demoE(demoInisial(pengguna.nama)) + "</span>";
    }
}

function tampilProfil() {
    var jumlah = 0;
    var label;
    var i;

    document.getElementById("nama").value = penggunaProfil.nama;
    document.getElementById("username").value = penggunaProfil.username;
    document.getElementById("email").value = penggunaProfil.email;
    document.getElementById("telepon").value = penggunaProfil.telepon !== null
        ? penggunaProfil.telepon : "";
    document.getElementById("unit").value = penggunaProfil.unit;

    document.getElementById("ket-bergabung").innerHTML =
        "Bergabung " + demoTanggal(penggunaProfil.dibuat, false);

    document.getElementById("ringkas-nama").innerHTML = demoE(penggunaProfil.nama);
    document.getElementById("ringkas-peran").innerHTML =
        demoE(demoPeranLabel(penggunaProfil.role)) + " &#183; " + demoE(penggunaProfil.unit);

    if (penggunaProfil.role === "teknisi") {
        for (i = 0; i < dataProfil.laporan.length; i++) {
            if (Number(dataProfil.laporan[i].teknisi_id) === Number(penggunaProfil.id)) {
                jumlah = jumlah + 1;
            }
        }

        label = "Tugas";
    } else if (penggunaProfil.role === "admin") {
        jumlah = dataProfil.laporan.length;
        label = "Laporan";
    } else {
        for (i = 0; i < dataProfil.laporan.length; i++) {
            if (Number(dataProfil.laporan[i].pelapor_id) === Number(penggunaProfil.id)) {
                jumlah = jumlah + 1;
            }
        }

        label = "Laporan";
    }

    document.getElementById("ringkas-meta").innerHTML =
        '<li><span class="k">' + label + '</span><span class="v">' + jumlah +
        " tiket</span></li>" +
        '<li><span class="k">Bergabung</span><span class="v">' +
        demoTanggal(penggunaProfil.dibuat, false) + "</span></li>" +
        '<li><span class="k">Status</span><span class="v">' +
        (penggunaProfil.aktif === 1 ? "Aktif" : "Nonaktif") + "</span></li>";

    if (penggunaProfil.foto !== null && penggunaProfil.foto !== undefined &&
        penggunaProfil.foto !== "") {
        document.getElementById("baris-hapus-foto").style.display = "block";
    }

    tampilAvatar(penggunaProfil);
}

window.onload = function () {
    var sesi = demoWajibMasuk();
    var formProfil;
    var formSandi;
    var inputFoto;

    if (sesi === null) {
        return;
    }

    dataProfil = demoBaca();
    penggunaProfil = demoPengguna(dataProfil, sesi.id);

    if (penggunaProfil === null) {
        demoFlash("galat", "Akun tidak ditemukan. Silakan masuk kembali.");
        window.location.href = "../login/index.xhtml";
        return;
    }

    tampilProfil();

    inputFoto = document.getElementById("foto");
    inputFoto.onchange = function () {
        var berkas = this.files[0];
        var pratinjau = document.getElementById("pratinjau-foto");

        fotoProfilBaru = null;
        pratinjau.innerHTML = "";

        if (!berkas) {
            return;
        }

        if (berkas.size > 400000) {
            pratinjau.innerHTML = '<p class="bantuan">Foto lebih dari 400 KB. ' +
                "Untuk demo, pilih foto yang lebih kecil.</p>";
            this.value = "";
            return;
        }

        var pembaca = new FileReader();

        pembaca.onload = function (peristiwa) {
            fotoProfilBaru = peristiwa.target.result;
            pratinjau.innerHTML = '<img src="' + fotoProfilBaru +
                '" alt="Pratinjau foto profil baru" />';
        };

        pembaca.readAsDataURL(berkas);
    };

    formProfil = document.getElementById("form-profil");

    formProfil.onsubmit = function () {
        var nama = document.getElementById("nama").value.trim();
        var email = document.getElementById("email").value.trim().toLowerCase();
        var telepon = document.getElementById("telepon").value.trim();
        var unit = document.getElementById("unit").value;
        var hapusFoto = document.getElementById("hapus_foto").checked;
        var polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var galat = document.getElementById("galat-profil");
        var i;
        var akun;

        document.getElementById("galat-nama").innerHTML = "";
        document.getElementById("galat-email").innerHTML = "";
        document.getElementById("galat-unit").innerHTML = "";
        galat.innerHTML = "";

        if (nama.length < 2) {
            document.getElementById("galat-nama").innerHTML = "Nama lengkap wajib diisi.";
            return false;
        }

        if (!polaEmail.test(email)) {
            document.getElementById("galat-email").innerHTML = "Format email belum benar.";
            return false;
        }

        if (unit === "") {
            document.getElementById("galat-unit").innerHTML = "Pilih fakultas atau unit Anda.";
            return false;
        }

        for (i = 0; i < dataProfil.pengguna.length; i++) {
            akun = dataProfil.pengguna[i];

            if (Number(akun.id) !== Number(penggunaProfil.id) &&
                akun.email.toLowerCase() === email) {
                document.getElementById("galat-email").innerHTML =
                    "Email " + email + " sudah dipakai akun lain.";
                return false;
            }
        }

        penggunaProfil.nama = nama;
        penggunaProfil.email = email;
        penggunaProfil.telepon = telepon;
        penggunaProfil.unit = unit;

        if (hapusFoto) {
            penggunaProfil.foto = null;
        }

        if (fotoProfilBaru !== null) {
            penggunaProfil.foto = fotoProfilBaru;
        }

        demoTulis(dataProfil);
        demoFlash("sukses", "Data profil diperbarui.");
        window.location.href = "index.xhtml";
        return false;
    };

    formSandi = document.getElementById("form-sandi");

    formSandi.onsubmit = function () {
        var lama = document.getElementById("sandi_lama");
        var baru = document.getElementById("sandi_baru");
        var ulang = document.getElementById("sandi_ulang");

        document.getElementById("galat-sandi-lama").innerHTML = "";
        document.getElementById("galat-sandi-baru").innerHTML = "";
        document.getElementById("galat-sandi-ulang").innerHTML = "";

        if (lama.value === "") {
            document.getElementById("galat-sandi-lama").innerHTML =
                "Masukkan kata sandi sekarang.";
            return false;
        }

        if (lama.value !== penggunaProfil.sandi) {
            document.getElementById("galat-sandi-lama").innerHTML =
                "Kata sandi sekarang belum sesuai.";
            return false;
        }

        if (baru.value.length < 8) {
            document.getElementById("galat-sandi-baru").innerHTML =
                "Kata sandi baru minimal 8 karakter.";
            return false;
        }

        if (ulang.value !== baru.value) {
            document.getElementById("galat-sandi-ulang").innerHTML =
                "Ulangi kata sandi belum sama.";
            return false;
        }

        penggunaProfil.sandi = baru.value;
        demoTulis(dataProfil);
        demoFlash("sukses", "Kata sandi berhasil diubah.");
        window.location.href = "index.xhtml";
        return false;
    };
};
