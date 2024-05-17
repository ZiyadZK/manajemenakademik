'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"
import { logRiwayat } from "./riwayatModel"

export const model_getAllAlumni = async () => {
    const responseData = await urlGet('/v1/data/alumni')
    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const model_deleteAlumni = async (arrayNis) => {
    const responseData = await urlDelete('/v1/data/alumni', {arrayNis})

    await logRiwayat({
        aksi: 'Hapus',
        kategori: 'Data Alumni',
        keterangan: `Menghapus ${Array.isArray(arrayNis) ? arrayNis.length : '1'} Data ke dalam Data Alumni`,
        records: `${JSON.stringify({
            nis: arrayNis
        })}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const model_updateAlumni = async (arrayNis, payload) => {
    const responseData = await urlPut('/v1/data/alumni', {arrayNis, payload})

    await logRiwayat({
        aksi: 'Ubah',
        kategori: 'Data Alumni',
        keterangan: `Mengubah ${Array.isArray(arrayNis) ? arrayNis.length : '1'} Data ke dalam Data Alumni`,
        records: `${JSON.stringify({arrayNis, payload})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const model_getAlumniByNis = async (nis) => {
    const responseData = await urlGet(`/v1/data/alumni/nis/${nis}`)
    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const model_createAlumni = async (payload) => {
    const responseData = await urlPost('/v1/data/alumni', payload)

    await logRiwayat({
        aksi: 'Tambah',
        kategori: 'Data Alumni',
        keterangan: `Menambah ${Array.isArray(payload) ? payload.length : '1'} Data ke dalam Data Alumni`,
        records: `${JSON.stringify(Array.isArray(payload) ? payload : {...payload})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}