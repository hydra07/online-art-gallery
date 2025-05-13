export interface ReportedUser {
	id: string;
	username: string;
	email: string;
	reason: string;
	status: 'active' | 'warned' | 'banned';
	lastReportDate: string;
}

export interface NotificationPayload {
	userId: string;
	action: 'warning' | 'ban';
	message: string;
}
