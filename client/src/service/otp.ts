import axios from '@/lib/axios';
export async function sendOtp(phone: string) {
	try {
		const res = await axios.post('/auth/phone/send-otp', {
			phone
		});
		return res;
	} catch (error) {
		throw error;
	}
}
