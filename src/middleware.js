import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decryptKey } from "./lib/encrypt";

const adminPath = [
    '/data/akun', '/data/riwayat', '/data/matapelajaran'
]

export async function middleware(request) {

    // Buat dapetin pathname seperti /data/akun
    // let logRequest = false
    // if(!logRequest) {
    //     logRequest = true
    //     console.log(request.nextUrl.pathname)
    // }
    
    // Check if the user has a cookie
    if(!cookies().has('userdata')) {
       const loginURL = new URL('/login', request.url);
       return NextResponse.redirect(loginURL)
    }

    // Check if user has already pin for login

    if(!cookies().has('userdataToken')) {
        return NextResponse.redirect(new URL('/verify', request.url))
    }else{
        const encryptedUserdata = cookies().get('userdata');
        const userdataToken = cookies().get('userdataToken').value
        const userdata = await decryptKey(encryptedUserdata.value);
        if(userdata['userdataToken'] !== userdataToken) {
            return NextResponse.redirect(new URL('/verify', request.url))
        }
    }

   // Check if user has a privilege to access the page
   const pathname = request.nextUrl.pathname;
   const encryptedUserdata = cookies().get('userdata');
   const userdata = await decryptKey(encryptedUserdata.value);

   for (const path of adminPath) {
       if (pathname.startsWith(path)) {
           if (userdata.role_akun !== 'Admin') {
               return NextResponse.redirect(new URL('/', request.url));
           }
       }
   }

    // Check if user has the same
    // const userdataToken = cookies().get('userdataToken').value
    // console.log(userdataToken)
    // if(userdata['userdataToken'] !== userdataToken) {
    //     return NextResponse.redirect(new URL('/verify', request.url))
    // }

   // Return null to indicate no redirect is necessary
   return NextResponse.next();
}


export const config = {
    matcher: ['/data/:path*', '/']
}