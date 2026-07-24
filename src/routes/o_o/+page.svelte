<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let Panggilan_User_Ke_Saya = $state('');
	let pesanDiisi = $state(false);

	// Object untuk menampung info browser
	let browserInfo = $state({});

	onMount(() => {
		// 1. Cek local storage
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

		// 2. Kumpulkan Semua Informasi Browser yang Tersedia
		browserInfo = {
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			language: navigator.language,
			languages: navigator.languages ? navigator.languages.join(', ') : '',
			cookieEnabled: navigator.cookieEnabled,
			onlineStatus: navigator.onLine,
			screenResolution: `${screen.width}x${screen.height}`,
			screenColorDepth: `${screen.colorDepth}-bit`,
			windowSize: `${window.innerWidth}x${window.innerHeight}`,
			devicePixelRatio: window.devicePixelRatio,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			hardwareConcurrency: navigator.hardwareConcurrency || 'N/A', // Jumlah Core CPU
			deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A', // RAM (approx)
			touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
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
	<section class="p-4">
		<p>wow bagus, kmu manggil aku <strong>{Panggilan_User_Ke_Saya}</strong></p>

		{#if !pesanDiisi}
			<form action="/kita-main" method="POST" use:enhance={handleSubmit} class="mt-4">
				<label for="Jejak" class="block mb-1 text-sm font-medium">sebelum lanjut mungkin kamu mau kasih catatan? setelah kirim tidak bisa dihapus sebelum saya baca:</label>

				<textarea
					class="border-1 py-1 px-2 rounded-lg block mb-2 w-full max-w-xs h-30"
					placeholder="catatan..."
					name="pesan"
					id="Jejak"
					required
				></textarea>

				<!-- INPUT HIDDEN: Mengirimkan info browser sebagai JSON string -->
				<input type="hidden" name="browser_info" value={JSON.stringify(browserInfo)} />

				<button class="font-bold text-white rounded-xl py-1 px-2 bg-pink-500 cursor-pointer" type="submit">
					kirim
				</button>
			</form>
		{:else}
			<p class="mt-4 text-slate-900 font-light">saya sudah baca buku darimu, sy ada something else yg mungkin bisa menjawab pernyataanmu </p>
			<a href="/1" class="inline-block mt-2 font-bold text-white rounded-xl py-1 px-3 bg-pink-500">
				baiklah
			</a>
		{/if}
	</section>
{/if}