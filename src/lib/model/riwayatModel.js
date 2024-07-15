'use server'

import { date_getDay, date_getMonth, date_getTime, date_getYear } from "../dateConvertes"
import { decryptKey } from "../encrypt"
import { urlDelete, urlGet, urlPost } from "../fetcher"
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
        fk_riwayat_id_akun: userdata.id_akun,
        aksi, kategori, keterangan, records,
        tanggal: `${date_getYear()}-${date_getMonth()}-${date_getDay()}`,
        waktu: `${date_getTime('hour')}:${date_getTime('minutes')}`
    }

    const responseData = await urlPost('/v1/data/riwayat', updatedData)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const getSingleRiwayat = async (id_riwayat) => {
    const responseData = await urlGet(`/v1/data/riwayat/detail/${id_riwayat}`)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const resetRiwayat = async () => {
    try {
        await urlDelete('/v1/data/riwayat', { all: true })

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        }
    }
}