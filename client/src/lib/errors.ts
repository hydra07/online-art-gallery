export class PublicError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class RateLimitError extends PublicError {
	constructor() {
		super('rateLimitExceeded');
		this.name = 'RateLimitError';
	}
}

export class UserNotFoundError extends PublicError {
	constructor() {
		super('userNotFound');
		this.name = 'UserNotFoundError';
	}
}

export class PasswordIncorrectError extends PublicError {
	constructor() {
		super('passwordIncorrect');
		this.name = 'PasswordIncorrectError';
	}
}

export class AuthenticationError extends PublicError {
	constructor() {
		super('authenticationError');
		this.name = 'AuthenticationError';
	}
}

export class RegistrationFailedError extends PublicError {
	constructor() {
		super('registrationFailed');
		this.name = 'RegistrationFailedError';
	}
}

export class AuthorizationError extends PublicError {
	constructor() {
		super('authorizationError');
		this.name = 'AuthorizationError';
	}
}

export class EmailInUseError extends PublicError {
	constructor() {
		super('emailInUse');
		this.name = 'EmailInUseError';
	}
}

export class NotFoundError extends PublicError {
	constructor() {
		super('notFound');
		this.name = 'NotFoundError';
	}
}

export class TokenExpiredError extends PublicError {
	constructor() {
		super('tokenExpired');
		this.name = 'TokenExpiredError';
	}
}

export class RefreshTokenExpiredError extends Error {
	constructor() {
		super('refreshTokenExpired');
		this.name = 'RefreshTokenExpiredError';
	}
}

export class UserAlreadyExistsError extends PublicError {
	constructor() {
		super('userExists');
		this.name = 'UserAlreadyExistsError';
	}
}

export class InvalidOtpError extends PublicError {
	constructor() {
		super('invalidOtp');
		this.name = 'InvalidOtpError';
	}
}

export class OtpExpiredError extends PublicError {
	constructor() {
		super('otpExpired');
		this.name = 'OtpExpiredError';
	}
}

export class InvalidFileError extends PublicError {
	constructor() {
		super('invalidFile');
		this.name = 'InvalidFileError';
	}
}

