
//blog status enum
export enum BlogStatus {
  PUBLISHED = 'PUBLISHED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  REJECTED = 'REJECTED'
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export enum ReasonReport {
	INAPPROPRIATE = 'INAPPROPRIATE',
	COPYRIGHT = 'COPYRIGHT',
	HARASSMENT = 'HARASSMENT',
	SPAM = 'SPAM',
	Other = 'Other',
}
//type of report
export enum RefType{
  BLOG = 'BLOG',
  ARTWORK = 'ARTWORK',
  USER = 'USER',
  COMMENT = 'COMMENT',
}

export enum Role{
  ADMIN = 'ADMIN',
  USER = 'USER',
  ARTIST = 'ARTIST'
}
