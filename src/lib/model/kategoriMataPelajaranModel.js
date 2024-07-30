'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"

export const M_Kategori_MataPelajaran_getAll = async () => {
    try {
        const responseData = await urlGet('/v1/data/mapel_kategori')

        return {
            success: true,
            data: responseData.data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.result
        }
    }
}

export const M_Kategori_MataPelajaran_create = async (payload) => {
    const responseData = await urlPost('/v1/data/mapel_kategori', payload)

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Kategori_MataPelajaran_update = async (id_kategori_mapel, payload) => {
    const responseData = await urlPut('/v1/data/mapel_kategori', {id_kategori_mapel, payload})

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Kategori_MataPelajaran_delete = async (id_kategori_mapel) => {
    const responseData = await urlDelete('/v1/data/mapel_kategori', {id_kategori_mapel})

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}