'use server';

import { cookies } from "next/headers";
import { decryptKey, encryptKey } from "../encrypt";
import axios from "axios";
import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher";
import { logRiwayat } from "./riwayatModel";

export const loginAkun = async (email, password, duration) => {
    // Ambil datanya
    
    const jsonBody = {
        email_akun: email,
        password_akun: password
    }
    try {
        const response = await axios.post(`${process.env.API_URL}/v1/userdata/create`, jsonBody, { 
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        const responseData = response.data
        cookies().set('userdata', responseData.token, {
            httpOnly: true,
            sameSite: true,
            maxAge: duration
        })

        return {
            success: true,
            message: responseData.success,
            token: responseData.token
        }
    } catch (error) {
        const responseData = error.response.data
        return {
            success: false,
            message: responseData.error,
            debug: responseData.debug
        }
    }    
}

export const getLoggedUserdata = async() => {
    const token = cookies().get('userdata')
    const data = await decryptKey(token.value)
    return data
}

export const logoutAkun = async () => {
    if(cookies().has('userdata')){
        cookies().delete('userdata');
    }

    if(cookies().has('userdataToken')) {
        cookies().delete('userdataToken')
    }
}

export const hasCookieUserdata = async () => {
    if(cookies().has('userdata')) {
        return true
    }else{
        return false
    }
}

export const getAllAkun = async () => {
    const responseData = await urlGet('/v1/data/akun')
    return responseData.data;
}

export const createAkun = async (dataBody) => {
    const responseData = await urlPost('/v1/data/akun', dataBody)
    await logRiwayat({
        aksi: 'Tambah',
        kategori: 'Data Akun',
        keterangan: `Menambahkan ${dataBody.length} Data ke dalam Data Akun`,
        records: `${JSON.stringify(dataBody)}`
    })
    if(responseData.success) {
        return true
    }else{
        return false
    }
}

export const deleteSingleAkunById = async (id) => {
    const responseData = await urlDelete(`/v1/data/akun`, {
        arrId_akun: id
    })
    await logRiwayat({
        aksi: 'Hapus',
        kategori: 'Data Akun',
        keterangan: `Menghapus 1 Data dari Data Akun`,
        records: `${JSON.stringify({
            arrId_akun: id
        })}`
    })
    return responseData.success
}

export const updateSingleAkun = async (akun) => {
    const newData = {
        nama_akun: akun.nama_akun,
        email_akun: akun.email_akun,
        password_akun: akun.password_akun,
        role_akun: akun.role_akun
    }

    const responseData = await urlPut(`/v1/data/akun/id_akun/${akun.id_akun}`, newData)

    await logRiwayat({
        aksi: 'Ubah',
        kategori: 'Data Akun',
        keterangan: `Mengubah 1 Data ke dalam Data Akun`,
        records: `${JSON.stringify(newData)}`
    })
    return responseData.success

}

export const deleteMultipleAkunById = async (arrayOfId) => {
    const responseData = await urlDelete('/v1/data/akun', {
        arrId_akun: arrayOfId
    })

    await logRiwayat({
        aksi: 'Hapus',
        kategori: 'Data Akun',
        keterangan: `Menghapus ${arrayOfId.length} Data dari Data Akun`,
        records: `${JSON.stringify({
            arrId_akun: arrayOfId
        })}`
    })

    return responseData.success
}