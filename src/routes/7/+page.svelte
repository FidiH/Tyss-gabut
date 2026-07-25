<script lang="ts">
  // 1. Array berisi teks yang ingin ditampilkan bergantian
  let listKata = $state([
    "buka......",
    "bukunya...",
    "dihalaman.",
    "enampuluh.",
    "cari-tau...",
    "sendri.....",
  ]);

  let speed = $state(1000); // Waktu ganti kata (2000ms = 2 detik)

  $effect(() => {
    let index = 0;

    const interval = setInterval(() => {
      // Ambil kata berdasarkan indeks saat ini
      const kataSekarang = listKata[index];

      // Update URL hashtag
      window.history.replaceState(null, '', `#${kataSekarang}`);

      // Lanjut ke kata berikutnya (looping kembali ke 0 jika sudah di ujung array)
      index = (index + 1) % listKata.length;
    }, speed);

    // Cleanup interval
    return () => clearInterval(interval);
  });
</script>

<main class="">
  <h1 class="">baca halaman 60</h1>
</main>