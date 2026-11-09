/*
 * script.js halaman masuk demo.
 */

window.onload = function () {
    if (demoSesiPengguna() !== null) {
        window.location.replace("../dashboard/index.xhtml");
        return;
    }

    demoTampilFlash();

    var form = document.getElementById("form-masuk");

    form.onsubmit = function () {
        var data = demoBaca();
        var kunci = document.getElementById("username").value.trim().toLowerCase();
        var sandi = document.getElementById("password").value;
        var galat = document.getElementById("galat-masuk");
        var cocok = null;
        var i;
        var u;

        galat.innerHTML = "";

        if (kunci === "" || sandi === "") {
            galat.innerHTML = "Username dan kata sandi wajib diisi.";
            return false;
        }

        for (i = 0; i < data.pengguna.length; i++) {
            u = data.pengguna[i];

            if ((u.username.toLowerCase() === kunci || u.email.toLowerCase() === kunci) &&
                u.sandi === sandi) {
                cocok = u;
            }
        }

        if (cocok === null) {
            galat.innerHTML = "Username atau kata sandi belum sesuai.";
            return false;
        }

        if (cocok.aktif !== 1) {
            galat.innerHTML = "Akun ini sedang dinonaktifkan oleh admin.";
            return false;
        }

        localStorage.setItem(DEMO_SESI, String(cocok.id));
        demoFlash("sukses", "Selamat datang, " + cocok.nama + ".");
        window.location.href = "../dashboard/index.xhtml";
        return false;
    };
};
