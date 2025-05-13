
//blog status enum
export enum BlogStatus {
  PUBLISHED = 'PUBLISHED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  REJECTED = 'REJECTED'
}

export enum EventStatus {
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
}

export enum Role {
  USER = "user",
  ARTIST = "artist",
  ADMIN = "admin"
}

export enum ReasonReport {
	INAPPROPRIATE = 'INAPPROPRIATE',
	COPYRIGHT = 'COPYRIGHT',
	HARASSMENT = 'HARASSMENT',
	SPAM = 'SPAM',
	Other = 'Other',
}

export enum ReportStatus {
	PENDING = 'PENDING',
	DISMISSED = 'DISMISSED',
	RESOLVED = 'RESOLVED',
}
