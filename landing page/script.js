const transportButtons =
    document.querySelectorAll(".transport");

const form =
    document.getElementById("ticketForm");

const hasil =
    document.getElementById("hasil");

const dari =
    document.getElementById("dari");

const ke =
    document.getElementById("ke");

const swap =
    document.getElementById("swap");


let jenisTransportasi = "Pesawat";

let kelasTiket = "Basic";

let totalPembayaran = 0;

const tiketCards =
    document.querySelectorAll(".tiket-card");


/* =========================
   PILIH KELAS TIKET
========================= */

tiketCards.forEach(function(card) {

    card.addEventListener("click", function() {

        tiketCards.forEach(function(item) {
            item.classList.remove("dipilih");
        });

        card.classList.add("dipilih");

        kelasTiket =
            card.getAttribute("data-kelas");

    });

});


/* PILIH BASIC SEBAGAI DEFAULT */

if (tiketCards.length > 0) {

    tiketCards[0].classList.add("dipilih");

}


/* =========================
   PILIH TRANSPORTASI
========================= */

transportButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        transportButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        jenisTransportasi =
            button.getAttribute("data-type");

        if (jenisTransportasi === "Hotel") {

            dari.placeholder = "Kota atau hotel";
            ke.placeholder = "Jumlah malam";

        } else {

            dari.placeholder = "Kota asal";
            ke.placeholder = "Kota tujuan";

        }

        hasil.innerHTML = "";

    });

});


/* =========================
   TUKAR KOTA
========================= */

swap.addEventListener("click", function() {

    let sementara = dari.value;

    dari.value = ke.value;

    ke.value = sementara;

});


/* =========================
   PEMBELIAN TIKET
========================= */

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const kotaDari =
        dari.value.trim();

    const kotaKe =
        ke.value.trim();

    const tanggal =
        document.getElementById("tanggal").value;

    const penumpang =
        document.getElementById("penumpang").value;

    const total =
    harga * Number(penumpang);
    
totalPembayaran = total;


  /* VALIDASI */

if (
    kotaDari === "" ||
    kotaKe === "" ||
    tanggal === ""
) {
    hasil.innerHTML = `
        <div class="pesanan">
            <h3>Data Belum Lengkap</h3>
            <p>Silakan isi semua data terlebih dahulu.</p>
        </div>
    `;

    return;
}


/* HITUNG TOTAL */

const total = harga * Number(penumpang);

totalPembayaran = total;


/* =========================
   HARGA BERDASARKAN
   TRANSPORTASI + KELAS
========================= */

if (jenisTransportasi === "Pesawat") {

    if (kelasTiket === "Basic") {
        harga = 750000;
    }

    else if (kelasTiket === "Medium") {
        harga = 950000;
    }

    else if (kelasTiket === "Elite") {
        harga = 1200000;
    }

    else if (kelasTiket === "VIP") {
        harga = 1500000;
    }

}


else if (jenisTransportasi === "Kereta") {

    if (kelasTiket === "Basic") {
        harga = 350000;
    }

    else if (kelasTiket === "Medium") {
        harga = 500000;
    }

    else if (kelasTiket === "Elite") {
        harga = 700000;
    }

    else if (kelasTiket === "VIP") {
        harga = 900000;
    }

}


else if (jenisTransportasi === "Bus") {

    if (kelasTiket === "Basic") {
        harga = 200000;
    }

    else if (kelasTiket === "Medium") {
        harga = 300000;
    }

    else if (kelasTiket === "Elite") {
        harga = 450000;
    }

    else if (kelasTiket === "VIP") {
        harga = 600000;
    }

}


else if (jenisTransportasi === "Hotel") {

    if (kelasTiket === "Basic") {
        harga = 450000;
    }

    else if (kelasTiket === "Medium") {
        harga = 650000;
    }

    else if (kelasTiket === "Elite") {
        harga = 900000;
    }

    else if (kelasTiket === "VIP") {
        harga = 1500000;
    }

}

    const total =
        harga * Number(penumpang);


    const hargaFormat =
        harga.toLocaleString("id-ID");

    const totalFormat =
        total.toLocaleString("id-ID");


    /* TAMPILKAN PESANAN */

    hasil.innerHTML = `

        <div class="pesanan">

            <h3>
                Pesanan ${jenisTransportasi}
            </h3>

            <p>

                <strong>Perjalanan:</strong>
                ${kotaDari} → ${kotaKe}

                <br>

                <strong>Tanggal:</strong>
                ${tanggal}

                <br>

                <strong>Transportasi:</strong>
                ${jenisTransportasi}

                <br>

                <strong>Harga per orang:</strong>
                Rp ${hargaFormat}

                <br>

                <strong>Jumlah:</strong>
                ${penumpang} Penumpang

                <br>

                <strong>Total:</strong>
                Rp ${totalFormat}

                <strong>Kelas Tiket:</strong>
               ${kelasTiket}

                <br>
            </p>


            <button
                class="bayar"
                onclick="pembayaran()"
            >
                Lanjut Pembayaran
            </button>

        </div>

    `;

});


/* =========================
   PEMBAYARAN
========================= */


/* =========================
   PILIH METODE PEMBAYARAN
========================= */

function pembayaran() {
    hasil.innerHTML = `
        <div class="pembayaran-box">

            <h3>Pilih Metode Pembayaran</h3>

            <p class="total-bayar">
                Total pembayaran:
                <strong>
                    Rp ${totalPembayaran.toLocaleString("id-ID")}
                </strong>
            </p>

            <div class="metode-container">

                <button
                    type="button"
                    class="metode-card"
                    onclick="pilihMetode('QRIS')">

                    <span class="metode-icon">▦</span>
                    <strong>QRIS</strong>
                    <small>Bayar dengan aplikasi pembayaran</small>

                </button>

                <button
                    type="button"
                    class="metode-card"
                    onclick="pilihMetode('Transfer Bank')">

                    <span class="metode-icon">🏦</span>
                    <strong>Transfer Bank</strong>
                    <small>Bayar melalui rekening bank</small>

                </button>

            </div>

            <div id="detailPembayaran"></div>

            <button
                type="button"
                class="kembali-bayar"
                onclick="location.reload()">

                Kembali ke halaman utama

            </button>

        </div>
    `;
}


/* =========================
   DETAIL METODE PEMBAYARAN
========================= */

function pilihMetode(metode) {
    const detail =
        document.getElementById("detailPembayaran");

    if (metode === "QRIS") {
        detail.innerHTML = `
            <div class="detail-metode">

                <h4>Pembayaran QRIS</h4>

                <div class="qris-placeholder">
                    QRIS
                    <p>Tempat gambar QR pembayaran</p>
                </div>

                <p>
                    Total:
                    <strong>
                        Rp ${totalPembayaran.toLocaleString("id-ID")}
                    </strong>
                </p>

                <p class="catatan">
                    QRIS resmi perlu disediakan oleh penyedia
                    pembayaran. Area ini masih berupa contoh.
                </p>

            </div>
        `;
    } else {
        detail.innerHTML = `
            <div class="detail-metode">

                <h4>Transfer Bank</h4>

                <p>
                    Total:
                    <strong>
                        Rp ${totalPembayaran.toLocaleString("id-ID")}
                    </strong>
                </p>

                <p>
                    Informasi rekening tujuan akan ditampilkan
                    setelah rekening resmi atau layanan pembayaran
                    dihubungkan ke website.
                </p>

                <p class="catatan">
                    Jangan transfer ke rekening yang belum
                    diverifikasi.
                </p>

            </div>
        `;
    }
}


const pilihanMetode = document.querySelectorAll(
    'input[name="metodePembayaran"]'
);

const detailQris = document.getElementById("detailQris");
const detailTransfer = document.getElementById("detailTransfer");

function tampilkanMetodePembayaran() {
    const metodeTerpilih = document.querySelector(
        'input[name="metodePembayaran"]:checked'
    );

    if (!metodeTerpilih) return;

    const gunakanQris = metodeTerpilih.value === "QRIS";

    detailQris.hidden = !gunakanQris;
    detailTransfer.hidden = gunakanQris;

    document.querySelectorAll(".metode-card").forEach((kartu) => {
        const radio = kartu.querySelector(
            'input[name="metodePembayaran"]'
        );

        kartu.classList.toggle("dipilih", radio.checked);
    });
}

pilihanMetode.forEach((radio) => {
    radio.addEventListener("change", tampilkanMetodePembayaran);
});

tampilkanMetodePembayaran();


/* ===== PILIHAN LAYANAN HANDYFLY ===== */

const tombolTransportasi = document.querySelectorAll(".transport");
const inputDari = document.getElementById("dari");
const inputKe = document.getElementById("ke");
const labelDari = document.getElementById("labelDari");
const labelKe = document.getElementById("labelKe");
const kartuTiket = document.querySelectorAll(".tiket-card");

let layananAktif = "Pesawat";

const dataLayanan = {
    Pesawat: {
        labelDari: "KOTA ASAL",
        labelKe: "KOTA TUJUAN",
        placeholderDari: "Contoh: Bandung",
        placeholderKe: "Contoh: Bali",
        kelas: ["Basic", "Medium", "Elite", "VIP"],
        harga: [750000, 950000, 1200000, 1500000]
    },
    Kereta: {
        labelDari: "STASIUN ASAL",
        labelKe: "STASIUN TUJUAN",
        placeholderDari: "Contoh: Bandung",
        placeholderKe: "Contoh: Yogyakarta",
        kelas: ["Basic", "Medium", "Elite", "VIP"],
        harga: [100000, 175000, 250000, 350000]
    },
    Bus: {
        labelDari: "KOTA ASAL",
        labelKe: "KOTA TUJUAN",
        placeholderDari: "Contoh: Bandung",
        placeholderKe: "Contoh: Jakarta",
        kelas: ["Basic", "Medium", "Elite", "VIP"],
        harga: [75000, 120000, 175000, 250000]
    },
    Hotel: {
        labelDari: "KOTA / LOKASI HOTEL",
        labelKe: "NAMA HOTEL",
        placeholderDari: "Contoh: Bandung",
        placeholderKe: "Contoh: Hotel pilihan",
        kelas: ["Basic", "Medium", "Elite", "VIP"],
        harga: [250000, 450000, 750000, 1200000]
    }
};

function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

function perbaruiLayanan(jenis) {
    layananAktif = jenis;
    const data = dataLayanan[jenis];

    tombolTransportasi.forEach((tombol) => {
        tombol.classList.toggle(
            "active",
            tombol.dataset.type === jenis
        );
    });

    labelDari.textContent = data.labelDari;
    labelKe.textContent = data.labelKe;
    inputDari.placeholder = data.placeholderDari;
    inputKe.placeholder = data.placeholderKe;

    kartuTiket.forEach((kartu, index) => {
        const judul = kartu.querySelector("h4");
        const harga = kartu.querySelector(".harga-tiket");

        if (judul) {
            judul.textContent = data.kelas[index];
        }

        if (harga) {
            harga.textContent = formatRupiah(data.harga[index]);
        }
    });

    // Pilih kelas pertama saat jenis layanan berubah
    kartuTiket.forEach((kartu, index) => {
        kartu.classList.toggle("dipilih", index === 0);
    });
}

tombolTransportasi.forEach((tombol) => {
    tombol.addEventListener("click", () => {
        perbaruiLayanan(tombol.dataset.type);
    });
});

/* ===== TABEL RINGKASAN PEMESANAN ===== */

const formPemesanan = document.getElementById("ticketForm");
const hasilPemesanan = document.getElementById("hasil");

formPemesanan.addEventListener("submit", function (event) {
    event.preventDefault();

    const dari = inputDari.value.trim();
    const ke = inputKe.value.trim();
    const tanggal = document.getElementById("tanggal").value;
    const jumlah = Number(document.getElementById("penumpang").value);

    const kelasDipilih = document.querySelector(".tiket-card.dipilih");
    const metodeDipilih = document.querySelector(
        'input[name="metodePembayaran"]:checked'
    );

    if (!dari || !ke || !tanggal) {
        hasilPemesanan.textContent =
            "Lengkapi lokasi dan tanggal terlebih dahulu.";
        return;
    }

    if (!kelasDipilih) {
        hasilPemesanan.textContent = "Silakan pilih kelas layanan.";
        return;
    }

    if (!metodeDipilih) {
        hasilPemesanan.textContent =
            "Silakan pilih metode pembayaran.";
        return;
    }

    const indeksKelas = Array.from(kartuTiket).indexOf(kelasDipilih);
    const data = dataLayanan[layananAktif];
    const hargaSatuan = data.harga[indeksKelas];
    const total = hargaSatuan * jumlah;
    const namaKelas = data.kelas[indeksKelas];

    hasilPemesanan.innerHTML = `
        <div class="ringkasan-pesanan">
            <h3>Ringkasan Pemesanan</h3>

            <table class="tabel-pesanan">
                <tr>
                    <th>Jenis layanan</th>
                    <td>${layananAktif}</td>
                </tr>
                <tr>
                    <th>Asal / lokasi</th>
                    <td>${escapeHTML(dari)}</td>
                </tr>
                <tr>
                    <th>Tujuan / hotel</th>
                    <td>${escapeHTML(ke)}</td>
                </tr>
                <tr>
                    <th>Tanggal</th>
                    <td>${escapeHTML(tanggal)}</td>
                </tr>
                <tr>
                    <th>Kelas</th>
                    <td>${namaKelas}</td>
                </tr>
                <tr>
                    <th>Jumlah orang</th>
                    <td>${jumlah}</td>
                </tr>
                <tr>
                    <th>Harga satuan</th>
                    <td>${formatRupiah(hargaSatuan)}</td>
                </tr>
                <tr>
                    <th>Metode pembayaran</th>
                    <td>${metodeDipilih.value}</td>
                </tr>
                <tr>
                    <th>Total harga</th>
                    <td><strong>${formatRupiah(total)}</strong></td>
                </tr>
            </table>

            <p class="pesanan-catatan">
                Ini adalah ringkasan pesanan. Pembayaran
                belum diverifikasi.
            </p>
        </div>
    `;

    hasilPemesanan.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

function escapeHTML(teks) {
    return teks.replace(/[&<>"']/g, function (karakter) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[karakter];
    });
}

// Pilihan awal
perbaruiLayanan("Pesawat");
