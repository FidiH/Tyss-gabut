<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let Panggilan_User_Ke_Saya = $state('');
	let pesanDiisi = $state(false);
	let isSubmitting = $state(false);

	// Object untuk menampung data informasi perangkat/browser
	let infoBrowser = $state({});

	onMount(async () => {
		// 1. Cek penyimpanan nama di localStorage
		const savedName = localStorage.getItem('panggilan_user');
		if (savedName) {
			Panggilan_User_Ke_Saya = savedName;
		} else {
			const inputName = prompt('Kamu manggil aku siapa?');
			if (inputName) {
				Panggilan_User_Ke_Saya = inputName;
				localStorage.setItem('panggilan_user', inputName);
			}
		}

		// 2. Cek apakah form sudah pernah dikirim sebelumnya
		if (localStorage.getItem('pesan_sudah_dikirim') === 'true') {
			pesanDiisi = true;
		}

		// 3. Deteksi Merek & Model HP (Client Hints & Fallback User-Agent)
		let merekHP = 'Tidak terdeteksi';
		let modelHP = 'Tidak terdeteksi';

		if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
			try {
				const hints = await navigator.userAgentData.getHighEntropyValues(['model', 'platformVersion']);
				modelHP = hints.model || 'Tidak diketahui';

				const brandData = navigator.userAgentData.brands.find(
					(b) => !b.brand.includes('Not') && !b.brand.includes('Chromium')
				);
				if (brandData) merekHP = brandData.brand;
			} catch (e) {
				console.log('Gagal mengambil detail merek HP:', e);
			}
		} else {
			const ua = navigator.userAgent;
			if (/iPhone/i.test(ua)) merekHP = 'Apple (iPhone)';
			else if (/Samsung/i.test(ua)) merekHP = 'Samsung';
			else if (/Xiaomi|Redmi|POCO/i.test(ua)) merekHP = 'Xiaomi';
			else if (/Oppo/i.test(ua)) merekHP = 'OPPO';
			else if (/Vivo/i.test(ua)) merekHP = 'Vivo';
			else if (/Realme/i.test(ua)) merekHP = 'Realme';
			else if (/Android/i.test(ua)) merekHP = 'Android (Merek Generik)';
		}

		// 4. Kumpulkan Informasi Lengkap
		infoBrowser = {
			waktuKlien: new Date().toLocaleString('id-ID', { timeZoneName: 'short' }),
			merekPerangkat: merekHP,
			modelPerangkat: modelHP,
			sistemOperasi: navigator.platform,
			identitasBrowser: navigator.userAgent,
			bahasaUtama: navigator.language,
			daftarBahasa: navigator.languages ? navigator.languages.join(', ') : '',
			statusKoneksi: navigator.onLine ? 'Online' : 'Offline',
			resolusiLayar: `${screen.width} x ${screen.height} piksel`,
			kedalamanWarna: `${screen.colorDepth}-bit`,
			ukuranJendelaBrowser: `${window.innerWidth} x ${window.innerHeight} piksel`,
			rasioPikselLayar: window.devicePixelRatio,
			zonaWaktu: Intl.DateTimeFormat().resolvedOptions().timeZone,
			jumlahCoreCpu: navigator.hardwareConcurrency || 'Tidak diketahui',
			perkiraanKapasitasRam: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Tidak diketahui',
			dukunganLayarSentuh: 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'Ya' : 'Tidak'
		};
	});

	function handleSubmit() {
		// Kunci tombol untuk mencegah double-click
		isSubmitting = true;

		return async ({ result }) => {
			// Buka kembali kunci setelah respon selesai
			isSubmitting = false;

			if (result.type === 'success') {
				localStorage.setItem('pesan_sudah_dikirim', 'true');
				pesanDiisi = true;
			}
		};
	}

	function resetPanggilan() {
		localStorage.removeItem('panggilan_user');
		localStorage.removeItem('pesan_sudah_dikirim');
		Panggilan_User_Ke_Saya = '';
		pesanDiisi = false;
	}
</script>

{#if Panggilan_User_Ke_Saya}
	<section class="p-4 max-w-md mx-auto">
		<p class="mb-3">wow bagus, kmu manggil aku <strong>{Panggilan_User_Ke_Saya}</strong></p>

		{#if !pesanDiisi}
			<form action="/kita-main" method="POST" use:enhance={handleSubmit} class="mt-4">
				<label for="Jejak" class="block mb-1 text-sm font-medium">Tinggalkan aku catatan, setelah dikirim tidak bisa dihapus sebelum saya baca</label>

				<textarea
					class="border py-2 px-3 rounded-lg block mb-3 w-full"
					placeholder="catatan..."
					name="pesan"
					id="Jejak"
					rows="4"
					required
				></textarea>

				<!-- Input hidden untuk mengirim data ke server -->
				<input type="hidden" name="panggilan_user" value={Panggilan_User_Ke_Saya} />
				<input type="hidden" name="data_browser" value={JSON.stringify(infoBrowser)} />

				<button
					class="w-full font-bold text-white rounded-xl py-2 px-4 bg-pink-500 cursor-pointer active:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Mengirim...' : 'Kirim'}
				</button>
			</form>
		{:else}
			<p class="mt-4 text-slate-700">saya sudah baca buku darimu, sy ada something else yg mungkin bisa menjawab pernyataanmu </p>
			<a href="/7" class="inline-block mt-2 font-bold text-white rounded-xl py-2 px-4 bg-pink-500">
				lanjut
			</a>
		{/if}
	</section>
{/if}