'use server';

import { cookies } from "next/headers";
import { prisma } from "../prisma"
import jwt from 'jsonwebtoken'

export const loginAkun = async (email, password) => {
    // Ambil datanya
    const data = await prisma.data_akuns.findFirst({
        where: {
            password_akun: password,
            email_akun: email
        }
    })
    if(data !== null){
        cookies().set('userdata', data.id_akun, {
            secure: true,
            httpOnly: true
        });
    }

    return data;
}

export const validateCookie = async () => {
    const cookie = cookies().get('userdata').value
    const result = await prisma.data_akuns.findFirst({
        where: {
            id_akun: cookie
        }
    })
    if(result === null) {
        return false;
    } else {
        return true;
    }
}