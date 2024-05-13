'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"

export const getAllPegawai = async () => {
    const responseData = await urlGet('/v1/data/pegawai')

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const getSinglePegawai = async ({id_pegawai, nip, nuptk}) => {
    const responseData = await urlGet(`/v1/data/pegawai/id_pegawai/${id_pegawai}`)    

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const updateSinglePegawai = async (id_pegawai, payload) => {
    const responseData = await urlPut('/v1/data/pegawai', {arrayId_pegawai: id_pegawai, payload})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const deleteSinglePegawai = async (id_pegawai) => {
    const responseData = await urlDelete('/v1/data/pegawai', {arrayId_pegawai: id_pegawai})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const deleteManyPegawai = async (arrayOfID_Pegawai) => {
    const responseData = await urlDelete('/v1/data/pegawai', {arrayId_pegawai: arrayOfID_Pegawai})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const createSinglePegawai = async (payload) => {
    const responseData = await urlPost('/v1/data/pegawai', payload)

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const createMultiPegawai = async (arrayDataPegawai) => {
    const responseData = await urlPost('/v1/data/pegawai', arrayDataPegawai)

    return {
        success: responseData.success,
        message: responseData.result
    }
}