/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, getClientAddress }) => {
		const formData = await request.formData();

		const pesan = formData.get('pesan');
		const rawDataBrowser = formData.get('data_browser');
		let dataKlien = {};

		try {
			dataKlien = rawDataBrowser ? JSON.parse(rawDataBrowser) : {};
		} catch (e) {
			console.error('Gagal membaca data browser:', e);
		}

		// Penggabungan data server & klien dalam Bahasa Indonesia
		const dataLengkap = {
			pesanPengguna: pesan,
			alamatIp: getClientAddress(),
			waktuServerDiterima: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
			headerServer: {
				bahasaDiterima: request.headers.get('accept-language'),
				platformPerangkat: request.headers.get('sec-ch-ua-platform'),
				sistemMobile: request.headers.get('sec-ch-ua-mobile') === '?1' ? 'Ya (Mobile)' : 'Bukan Mobile'
			},
			detailPerangkatKlien: dataKlien
		};

		console.log('=== DATA PENGUNJUNG MOBILE ===');
		console.log(JSON.stringify(dataLengkap, null, 2));

		return {
			success: true
		};
	}
};