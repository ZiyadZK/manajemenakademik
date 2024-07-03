'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"

export const getDataSertifikat = async (id_pegawai) => {

    const responseData = await urlGet(`/v1/data/sertifikat/id_pegawai/${id_pegawai}`)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }

    
}

export const createSertifikat = async (payload) => {
    const responseData = await urlPost('/v1/data/sertifikat', payload)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const updateSertifikat = async (payload, arraySertifikat_id) => {
    const responseData = await urlPut('/v1/data/sertifikat', {payload, arraySertifikat_id})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const deleteSertifikat = async (arraySertifikat_id) => {
    const responseData = await urlDelete('/v1/data/sertifikat', {arraySertifikat_id})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}