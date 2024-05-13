'use server'

import { urlGet, urlPost, urlPut } from "../fetcher"

export const getProfilSekolah = async () => {
    const responseData = await urlGet('/v1/data/profilsekolah')

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const getKepalaSekolah = async () => {
    const responseData = await urlGet('/v1/data/pegawai/kepalasekolah')

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const updateProfilSekolah = async (oldData, newData) => {
    const responseData = await urlPut('/v1/data/profilsekolah', {oldData, newData})

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const createProfilSekolah = async (payload) => {
    const responseData = await urlPost('/v1/data/profilsekolah', payload)

    return {
        success: responseData.success,
        message: responseData.result
    }
}