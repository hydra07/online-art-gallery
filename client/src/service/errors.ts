/*

import { getLocale } from "next-intl/server";

export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor(locale?: string) {
    super(locale === 'en' 
      ? 'You must be logged in to view this content' 
      : 'Bạn phải đăng nhập để xem nội dung này'
    );
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends PublicError {
  constructor(locale?: string) {
    super(locale === 'en' 
      ? 'You are not authorized to view this content' 
      : 'Bạn không có quyền xem nội dung này'
    );
    this.name = "AuthorizationError";
  }
}

export class EmailInUseError extends PublicError {
  constructor(locale?: string) {
    super(locale === 'en' 
      ? 'Email is already in use' 
      : 'Email đã được sử dụng'
    );
    this.name = "EmailInUseError";
  }
}

export class NotFoundError extends PublicError {
  constructor(locale?: string) {
    super(locale === 'en' 
      ? 'Resource not found' 
      : 'Không tìm thấy tài nguyên'
    );
    this.name = "NotFoundError";
  }
}

export class TokenExpiredError extends PublicError {
  constructor(locale?: string) {
    super(locale === 'en' 
      ? 'Token has expired' 
      : 'Token đã hết hạn'
    );
    this.name = "TokenExpiredError";
  }
}

export class UserAlreadyExistsError extends PublicError {
  constructor(locale?: string) {
    super(locale === 'en' 
      ? 'User already exists' 
      : 'Người dùng đã tồn tại'
    );
    this.name = "UserAlreadyExistsError";
  }
}

// Helper function to create localized errors
export async function createLocalizedError<T extends new (locale: string) => PublicError>(
  ErrorClass: T
): Promise<InstanceType<T>> {
  const locale = await getLocale();
  return new ErrorClass(locale) as InstanceType<T>;
}
*/
