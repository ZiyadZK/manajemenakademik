'use server';

import { cookies } from "next/headers";
import { prisma } from "../prisma"
import jwt from 'jsonwebtoken'
import { updaterEmitter } from "../updater";
import { io } from "socket.io-client";


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
            httpOnly: true,
            sameSite: true
        })
    }

    return data;
}

export const logoutAkun = async () => {
    if(cookies().has('userdata')){
        cookies().delete('userdata');
    }
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

export const getAllAkun = async () => {
    const result = await prisma.data_akuns.findMany();
    return result;
}

export const createAkun = async (dataBody) => {

    const socket = io();

    try {
        await prisma.data_akuns.createMany({
            data: dataBody
        })

        socket.emit('test connect', 'Hello');

        
        return true;
    } catch (error) {
        return false;
    }
}

export const deleteSingleAkunById = async (id) => {
    try {
        await prisma.data_akuns.delete({
            where: {
                id_akun: id
            }
        })
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const updateSingleAkun = async (akun) => {
    const newData = {
        nama_akun: akun.nama_akun,
        email_akun: akun.email_akun,
        password_akun: akun.password_akun,
        role_akun: akun.role_akun
    }
    try {
        await prisma.data_akuns.update({
            where: {
                id_akun: akun.id_akun
            },
            data: newData
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteMultipleAkunById = async (arrayOfId) => {
    try {
        await prisma.data_akuns.deleteMany({
            where: {
                id_akun: {
                    in: arrayOfId
                }
            }
        })

        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}