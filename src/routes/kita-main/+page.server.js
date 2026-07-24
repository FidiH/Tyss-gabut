/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, getClientAddress }) => {
		const formData = await request.formData();

		// Ambil data pesan
		const pesan = formData.get('pesan');

		// Ambil data info browser dari client
		const rawBrowserInfo = formData.get('browser_info');
		let browserData = {};

		try {
			browserData = rawBrowserInfo ? JSON.parse(rawBrowserInfo) : {};
		} catch (e) {
			console.error('Gagal parse browser info:', e);
		}

		// Tambahkan info yang hanya bisa didapat di sisi Server (IP & Server Headers)
		const completeData = {
			pesan: pesan,
			ipAddress: getClientAddress(), // Alamat IP Pengunjung
			serverReceivedAt: new Date().toISOString(),
			headers: {
				acceptLanguage: request.headers.get('accept-language'),
				secChUa: request.headers.get('sec-ch-ua'), // Info browser modern
				secChUaMobile: request.headers.get('sec-ch-ua-mobile'),
				secChUaPlatform: request.headers.get('sec-ch-ua-platform')
			},
			clientInfo: browserData
		};

		// Cetak di terminal server untuk debugging/melihat hasilnya
		console.log('=== DATA LENGKAP PENGUNJUNG ===');
		console.log(JSON.stringify(completeData, null, 2));

		// Di sini kamu bisa simpan `completeData` ke Database (Supabase/Firebase/Prisma, dll)

		return {
			success: true
		};
	}
};