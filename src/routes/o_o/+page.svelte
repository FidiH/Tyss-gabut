<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let Panggilan_User_Ke_Saya = $state('');
	let pesanDiisi = $state(false);

	// Object untuk menampung data informasi perangkat/browser
	let infoBrowser = $state({});

	onMount(async () => {
		// 1. Pengecekan localStorage
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

		if (localStorage.getItem('pesan_sudah_dikirim') === 'true') {
			pesanDiisi = true;
		}

		// 2. Deteksi Merek HP (Menggunakan User-Agent Client Hints jika didukung)
		let merekHP = 'Tidak terdeteksi';
		let modelHP = 'Tidak terdeteksi';

		if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
			try {
				const hints = await navigator.userAgentData.getHighEntropyValues(['model', 'platformVersion']);
				modelHP = hints.model || 'Tidak diketahui';
				
				// Mengambil merek dari daftar brands
				const brandData = navigator.userAgentData.brands.find(
					(b) => !b.brand.includes('Not') && !b.brand.includes('Chromium')
				);
				if (brandData) merekHP = brandData.brand;
			} catch (e) {
				console.log('Gagal mengambil detail merek HP:', e);
			}
		} else {
			// Fallback: Analisis sederhana dari User Agent String
			const ua = navigator.userAgent;
			if (/iPhone/i.test(ua)) merekHP = 'Apple (iPhone)';
			else if (/Samsung/i.test(ua)) merekHP = 'Samsung';
			else if (/Xiaomi|Redmi|POCO/i.test(ua)) merekHP = 'Xiaomi';
			else if (/Oppo/i.test(ua)) merekHP = 'OPPO';
			else if (/Vivo/i.test(ua)) merekHP = 'Vivo';
			else if (/Realme/i.test(ua)) merekHP = 'Realme';
			else if (/Android/i.test(ua)) merekHP = 'Android (Merek Generik)';
		}

		// 3. Kumpulkan Informasi Lengkap dalam Bahasa Indonesia
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
		return async ({ result }) => {
			if (result.type === 'success') {
				localStorage.setItem('pesan_sudah_dikirim', 'true');
				pesanDiisi = true;
			}
		};
	}
</script>

{#if Panggilan_User_Ke_Saya}
	<section class="p-4 max-w-md mx-auto">
		<p class="mb-3">wow bagus, kmu manggil aku <strong>{Panggilan_User_Ke_Saya}</strong></p>

		{#if !pesanDiisi}
			<form action="/kita-main" method="POST" use:enhance={handleSubmit} class="mt-4">
				<label for="Jejak" class="block mb-1 text-sm font-medium">mungkin kamu ingin meninggalkan catatan?: <br> catatan yang kamu kirim gak bisa di hapus sebelum aku baca</label>

				<textarea
					class="border py-2 px-3 rounded-lg block mb-3 w-full"
					placeholder="Kasih kata kata..."
					name="pesan"
					id="Jejak"
					rows="8"
					required
				></textarea>

				<!-- INPUT HIDDEN: Mengirimkan data berbahasa Indonesia -->
				<input type="hidden" name="data_browser" value={JSON.stringify(infoBrowser)} />

				<button class="w-full font-bold text-white rounded-xl py-2 px-4 bg-pink-500 cursor-pointer active:bg-pink-600" type="submit">
					Kirim
				</button>
			</form>
		{:else}
			<p class="mt-4 text-green-600 font-semibold">saya sudah baca buku darimu, sy ada something else yg mungkin bisa menjawab pernyataanmu </p>
			<a href="/1" class="inline-block mt-2 font-bold text-white rounded-xl py-2 px-4 bg-pink-500">
			baiklah
			</a>
		{/if}
	</section>
{/if}