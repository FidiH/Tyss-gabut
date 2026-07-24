<script lang="ts">
	// 1. Array berisi teks yang ingin ditampilkan bergantian
	let listKata = $state(['/_.____', '--._____', '\\_._____', '/___.___', '--_.____', '\\.______']);

	let speed = $state(100);

	$effect(() => {
		let index = 0;

		const interval = setInterval(() => {
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

<main class="p-5">
	<h1 class="font-bold mb-5">PART#1</h1>
	<p>
		Wow, kok kamu bisa sampai sini?
		<br />
		<br />
		Tapi oke deh... berhubung kamu sudah sampai sini, aku kasih coretan secara digital aja ya. Nggak
		mau mengotori bukumu juga sih. kamu aja belum ada coret-coret, nggak afdol kalau yang punya
		belum duluan.
		<br />
		<br />
		Waktuku terbatas banget pas bikin website ini, jadi aku bagi jadi beberapa part ya biar gampang
		diketiknya ;)
		<br />
		<br />
		Thurs 23 July at 03:25PM Aku mulai buka-buka bukunya, dan yah... ternyata bukunya masih baru.
		Aku yakin kamu sendiri aja belum baca bukunya, kan? Judulnya aja udah bikin "wow", agak effort
		juga kamu ternyata sampai beli buku tapi belum diisi malah langsung dikasih ke aku 🤣.
		<br />
		<br />
		Di halaman utama, seperti buku cetak pada umumnya, ada copyright... [skip]
		<br />
		<br />
		Deretan awal sampai halaman 90 isinya pernyataan yang dibalut puitis dan rasa malu buat
		mengungkapkan. Jujur, aku bacanya biasa aja sih. Andai kamu isi bagian yang kosong di halaman
		19, 25, 37, 61, 67, atau semuanya deh... mungkin aku bacanya bakal lebih terbawa emosi.
		<br />
		<br />
		Untuk halaman selanjutnya setelah halaman 90 bakal aku catat di tempat lain, jadi nanti link-nya
		bakal aku selipkan di halaman 111 ya.
	</p>
</main>
