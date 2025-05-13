export interface Recipient {
  userId: string;
  isRead: boolean;
}

export interface NotificationStats {
  totalRecipients: number;
  readCount: number;
  readPercentage: number;
}

export interface Notification {
  _id: string;
  title: string;
  content: string;
  refType: string;
  refId: string | null;
  createdAt: string;
  stats: NotificationStats;
  sampleRecipients: Recipient[];
}

export interface NotificationResponse {
  data: {
    notifications: Notification[];
    total: number;
  };
  message: string;
  statusCode: number;
  errorCode: null | string;
  details: null | unknown;
}

export interface NotificationCreatePayload {
  title: string;
  content: string;
  roles: string[];
  isSystem: boolean;
  refType: string;
}
