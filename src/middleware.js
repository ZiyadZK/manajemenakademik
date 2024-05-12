import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request) {
    // Check if the user has a cookie
    if(!cookies().has('userdata')) {
       const loginURL = new URL('/login', request.url);
       return NextResponse.redirect(loginURL)
    }

    
    
}

export const config = {
    matcher: ['/data/:path*', '/']
}