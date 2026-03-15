import {NextRequest, NextResponse} from 'next/server'

const MAIN_PATHS = ['/feed', '/explore', '/post', '/profile', '/follows']
const AUTH_PATHS = ['/login', '/register']

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const token = request.cookies.get('auth-token')?.value

    const isMainPath = MAIN_PATHS.some((path) => pathname.startsWith(path))
    const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path))

    if (isMainPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthPath && token) {
        return NextResponse.redirect(new URL('/feed', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
