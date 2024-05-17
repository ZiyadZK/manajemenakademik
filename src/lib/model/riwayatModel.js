'use server'

import { decryptKey } from "../encrypt"
import { urlGet, urlPost } from "../fetcher"
import { getLoggedUserdata } from "./akunModel"

export const getAllRiwayat = async () => {
    const responseData = await urlGet('/v1/data/riwayat')

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}



export const logRiwayat = async ({aksi, kategori, keterangan, records}) => {
    const userdata = await getLoggedUserdata()
    const updatedData = {
        aksi, kategori, keterangan, records,
        username: userdata.nama_akun,
        nama: userdata.nama_akun,
        email: userdata.email_akun,
        tanggal: `${new Date().toLocaleString('id-ID').split(', ')[0]}`,
        waktu: `${new Date().toLocaleString('id-ID').split(', ')[1].replace('.', ':')}`
    }

    const responseData = await urlPost('/v1/data/riwayat', updatedData)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}