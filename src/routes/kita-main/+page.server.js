// Impor variabel GOOGLE_SCRIPT_URL dari file .env
import { GOOGLE_SCRIPT_URL } from '$env/static/private';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, getClientAddress }) => {
		const formData = await request.formData();

		const pesan = formData.get('pesan');
		const panggilanUser = formData.get('panggilan_user') || 'Tidak diisi';
		const rawDataBrowser = formData.get('data_browser');
		
		let dataKlien = {};
		try {
			dataKlien = rawDataBrowser ? JSON.parse(rawDataBrowser) : {};
		} catch (e) {
			console.error('Gagal membaca data browser:', e);
		}

		// Siapkan payload data
		const dataLengkap = {
			panggilanUser: panggilanUser,
			pesanPengguna: pesan,
			alamatIp: getClientAddress(),
			waktuServerDiterima: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
			headerServer: {
				bahasaDiterima: request.headers.get('accept-language'),
				platformPerangkat: request.headers.get('sec-ch-ua-platform'),
				sistemMobile: request.headers.get('sec-ch-ua-mobile') === '?1' ? 'Ya' : 'Bukan'
			},
			detailPerangkatKlien: dataKlien
		};

		// Kirim data dari Server SvelteKit (Proxy) ke Google Sheets
		try {
			const res = await fetch(GOOGLE_SCRIPT_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataLengkap)
			});

			const responseGoogle = await res.json();
			console.log('Respon Google Sheets:', responseGoogle);
		} catch (error) {
			console.error('Gagal mengirim ke Google Sheets:', error);
			return {
				success: false,
				error: 'Gagal menyimpan data'
			};
		}

		return {
			success: true
		};
	}
};