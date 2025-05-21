import { NextResponse } from 'next/server'
import { loggedIn } from "@/app/actions";

export async function middleware(request) {
    // if (!await loggedIn(request)) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }
}

export const config = {
    matcher: [
        /*
         * Apply middleware to all pages except:
         * 1. /api/* (exclude all API routes)
         * 2. /login (exclude the login page)
         * 3. /_next/* (exclude Next.js assets, e.g., /_next/static/*)
         */
        '/((?!api|login|_next/static|_next/image).*)',
    ],
}