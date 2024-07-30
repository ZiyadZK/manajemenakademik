'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"

export const M_MataPelajaran_getAll = async () => {
    const responseData = await urlGet('/v1/data/mapel')

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const M_MataPelajaran_create = async (payload) => {
    const responseData = await urlPost('/v1/data/mapel', payload)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const M_MataPelajaran_update = async (id_mapel, payload) => {
    const responseData = await urlPut('/v1/data/mapel', {payload, id_mapel})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const M_MataPelajaran_delete = async (id_mapel) => {
    const responseData = await urlDelete('/v1/data/mapel', {id_mapel})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}