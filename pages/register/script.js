/*
 * script.js halaman daftar akun demo.
 */

window.onload = function () {
    demoTampilFlash();

    var form = document.getElementById("form-daftar");

    form.onsubmit = function () {
        var data = demoBaca();
        var nama = document.getElementById("nama").value.trim();
        var username = document.getElementById("username").value.trim();
        var email = document.getElementById("email").value.trim().toLowerCase();
        var telepon = document.getElementById("telepon").value.trim();
        var unit = document.getElementById("unit").value;
        var sandi = document.getElementById("password").value;
        var sandi2 = document.getElementById("password2").value;
        var setuju = document.getElementById("setuju").checked;
        var galat = document.getElementById("galat-daftar");
        var pola = /^[A-Za-z0-9_]+$/;
        var i;
        var u;
        var baru;

        galat.innerHTML = "";

        if (nama === "") {
            galat.innerHTML = "Nama lengkap wajib diisi.";
            return false;
        }

        if (username.length < 4 || username.length > 40) {
            galat.innerHTML = "Username harus 4 sampai 40 karakter.";
            return false;
        }

        if (!pola.test(username)) {
            galat.innerHTML = "Username hanya boleh memakai huruf, angka, dan garis bawah.";
            return false;
        }

        if (email.indexOf("@") < 1 || email.indexOf(".") < 0) {
            galat.innerHTML = "Format email belum benar.";
            return false;
        }

        if (unit === "") {
            galat.innerHTML = "Pilih fakultas atau unit terlebih dahulu.";
            return false;
        }

        if (sandi.length < 8) {
            galat.innerHTML = "Kata sandi minimal delapan karakter.";
            return false;
        }

        if (sandi !== sandi2) {
            galat.innerHTML = "Ulangi kata sandi belum sama.";
            return false;
        }

        if (!setuju) {
            galat.innerHTML = "Centang pernyataan kebenaran data sebelum mendaftar.";
            return false;
        }

        for (i = 0; i < data.pengguna.length; i++) {
            u = data.pengguna[i];

            if (u.username.toLowerCase() === username.toLowerCase()) {
                galat.innerHTML = "Username " + username + " sudah dipakai. Pilih nama lain.";
                return false;
            }

            if (u.email.toLowerCase() === email) {
                galat.innerHTML = "Email " + email + " sudah terdaftar. Gunakan email lain.";
                return false;
            }
        }

        baru = {
            id: data.urut.pengguna,
            nama: nama,
            username: username,
            email: email,
            sandi: sandi,
            role: "pelapor",
            unit: unit,
            telepon: telepon,
            foto: null,
            aktif: 1,
            dibuat: new Date().toISOString()
        };

        data.pengguna.push(baru);
        data.urut.pengguna = data.urut.pengguna + 1;
        demoTulis(data);

        demoFlash("sukses", "Akun dibuat. Silakan masuk dengan username " + username + ".");
        window.location.href = "../login/index.xhtml";
        return false;
    };
};
