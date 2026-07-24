<script>
	import { onDestroy } from 'svelte';

	const List_Dialog = [
		'kmu menemukan coretanku',
		'dengerin lagu yg biasanya sy putar',
		'dengarin yah!, nikmati aja'
	];

	let Index_Dialog = $state(0);
	let Dialog = $derived(List_Dialog[Index_Dialog]);

	// Waktu mundur dalam detik (2 menit 50 detik = 170 detik)
	const TOTAL_WAKTU = 170;
	let sisaWaktu = $state(TOTAL_WAKTU);
	let timerSelesai = $state(false);
	let timerInterval = null;

	function Lanjut_Dialog() {
		if (Index_Dialog < List_Dialog.length - 1) {
			Index_Dialog += 1;
		}
	}

	// Format detik menjadi format MM:SS (misal: 02:50)
	function formatWaktu(detik) {
		const menit = Math.floor(detik / 60);
		const sisaDetik = detik % 60;
		return `${String(menit).padStart(2, '0')}:${String(sisaDetik).padStart(2, '0')}`;
	}

	// Jalankan timer saat mencapai dialog terakhir
	$effect(() => {
		if (Index_Dialog === List_Dialog.length - 1 && !timerInterval && !timerSelesai) {
			timerInterval = setInterval(() => {
				if (sisaWaktu > 0) {
					sisaWaktu -= 1;
				} else {
					timerSelesai = true;
					clearInterval(timerInterval);
				}
			}, 1000);
		}
	});

	// Bersihkan interval jika komponen dihancurkan
	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});
</script>

<section class="p-7">
	<h1>Sepertinya kau tau</h1>
	<div>
		<p id="dialog_teks">{Dialog}</p>
		<button
			class="rounded-xl bg-pink-600 px-3 py-1 font-bold text-white disabled:opacity-50"
			onclick={Lanjut_Dialog}
			disabled={Index_Dialog === List_Dialog.length - 1}
		>
			Lanjut
		</button>
	</div>

	{#if Index_Dialog === List_Dialog.length - 1}
		<iframe
			width="100%"
			height="315"
			class="my-2 aspect-[1/1] rounded-2xl"
			src="https://www.youtube.com/embed/IXllKXhFMEs?si=VrHhqRxyb4Gj6_ho&autoplay=1"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
		></iframe>

		<!-- Tampilkan Timer Mundur jika belum selesai -->
		{#if !timerSelesai}
			<div class="mt-4 font-mono text-lg font-bold text-amber-500">
				Dengerin dulu jangan pergi {formatWaktu(sisaWaktu)}
			</div>
		{:else}
			<!-- Tampilkan Tautan setelah waktu selesai (2 menit 50 detik) -->
			<p class="mt-4">
				Udah nunggu sambil dengerin, kita lanjut
				<a class="font-bold text-sky-600 underline" href="/o_o">kesini</a>
			</p>
		{/if}
	{/if}
</section>
