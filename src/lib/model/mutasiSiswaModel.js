'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"
import { logRiwayat } from "./riwayatModel"

export const getAllMutasiSiswa = async () => {
    const responseData = await urlGet('/v1/data/mutasisiswa')

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const getMutasiSiswa = async (nis) => {
    const responseData = await urlGet(`/v1/data/mutasisiswa/nis/${nis}`)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const createMutasiSiswa = async (payload) => {
    const responseData = await urlPost('/v1/data/mutasisiswa', payload)

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const updateMutasiSiswa = async (arrayNis, payload) => {
    const responseData = await urlPut('/v1/data/mutasisiswa', {arrayNis, payload})

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const deleteMutasiSiswa = async (arrayNis) => {
    const responseData = await urlDelete('/v1/data/mutasisiswa', {arrayNis})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

