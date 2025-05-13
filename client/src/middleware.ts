import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Header middleware specifically for /api routes
const headerMiddleware = async (request: NextRequest) => {
  const response = NextResponse.next();
  
  // Check if the request path starts with /api	
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.append('Access-Control-Allow-Origin', process.env.NEXTAUTH_URL as string);
    response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (request.method === 'OPTIONS') {
      return response;
    }
  }
  
  return response;
};

export default async function middleware(request: NextRequest) {
  try {
    // Apply header middleware first
    const headerResponse = await headerMiddleware(request);
    
    // For non-API routes, apply intl middleware
    if (!request.nextUrl.pathname.startsWith('/api')) {
      const intlResponse = await intlMiddleware(request);
      return intlResponse;
    }
    
    return headerResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: [
    '/',
    '/(vi|en)/:path*',
    '/((?!admin|_next|test|.*\\..*).*)',
    '/api/:path*' // Added API routes to matcher
  ]
};

/*
❌
/admin/
/api/
/_next/
/images/logo.png
/styles.css

✅
/about
/en/about
/vi/about
*/
