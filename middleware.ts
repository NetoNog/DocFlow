import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('docflow_session')
  const { pathname } = request.nextUrl

  // Protected paths that require authentication
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/documents')

  if (isProtectedPath && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/documents/:path*'],
}
