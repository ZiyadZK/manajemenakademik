'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"
import { logRiwayat } from "./riwayatModel"

export const getAllIjazah = async () => {
    const responseData = await urlGet('/v1/data/ijazah')
    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const createMultiIjazah = async (payload) => {
    try {
        
        const responseData = await urlPost('/v1/data/ijazah', payload)
    
        await logRiwayat({
            aksi: 'Tambah',
            kategori: 'Data Ijazah',
            keterangan: `Menambah ${Array.isArray(payload) ? payload.length : '1'} Data ke dalam Data Ijazah`,
            records: `${JSON.stringify(Array.isArray(payload) ? payload : {...payload})}`
        })
    
        return {
            success: true,
            message: responseData.result
        }
    } catch (error) {
        console.log(error.result.data)
        return {
            success: false,
            message: error.result.data.error
        }
    }
}

export const updateMultiIjazah = async (arrayNisn, payload) => {
    const responseData = await urlPut('/v1/data/ijazah', {arrayNisn, payload})

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const deleteMultiIjazah = async (arrayNisn) => {
    const responseData = await urlDelete('/v1/data/ijazah', {arrayNisn})

    await logRiwayat({
        aksi: 'Hapus',
        kategori: 'Data Ijazah',
        keterangan: `Menghapus ${Array.isArray(arrayNisn) ? arrayNisn.length : '1'} Data ke dalam Data Ijazah`,
        records: `${JSON.stringify({arrayNisn})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}