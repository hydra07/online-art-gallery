import { createAxiosInstance } from '@/lib/axios';

export interface ReportForm {
	refId: string;
	refType: string;
	reason: string;
	description: string;
	url?: string;
	image: string[];
}
const reportService = {
	async get() {
		try {
			const axios = await createAxiosInstance({ useToken: true });
			if (!axios) {
				throw new Error('Failed to create axios instance');
			}
			const res = await axios.get('/report/my-report/:reporterId');
			return res.data.data;
		} catch (error) {
			console.error('Error getting reports:', error);
			return null;
		}
	},

	async getMyreport(reporterId: string) {
		try {
			const axios = await createAxiosInstance({ useToken: true });
			if (!axios) {
				throw new Error('Failed to create axios instance');
			}
			const res = await axios.get(`/report/my-report/${reporterId}`);
			return res.data.data;
		} catch (error) {
			console.error('Error getting reports by reporterId:', error);
			return null;
		}
	},

	async create(data: ReportForm) {
		try {
			const axios = await createAxiosInstance({ useToken: true });
			if (!axios) {
				throw new Error('Failed to create axios instance');
			}
			const imageArray = Array.isArray(data.image) ? data.image : [data.image].filter(Boolean);
			const res = await axios.post('/report', {
				refId: data.refId,
				refType: data.refType,
				reason: data.reason,
				description: data.description,
				url: data.url || '',
				image: imageArray,
			});
			return res.data.data;
		} catch (error) {
			console.error('Error creating report:', error);
			throw new Error('Error creating report');
		}
	}
};

export default reportService;
