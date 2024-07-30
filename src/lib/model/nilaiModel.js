'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"

export const M_Nilai_getAll = async (nis) => {
    const response = await urlGet(`/v1/data/nilai/${nis}`)

    return {
        success: response.success,
        data: response?.data,
        message: response.message
    }
}

export const M_Nilai_create = async (payload) => {
    const response = await urlPost('/v1/data/nilai', payload)

    return {
        success: response.success,
        data: response?.data,
        message: response.message
    }
}

export const M_Nilai_delete = async (id_nilai) => {
    const response = await urlDelete('/v1/data/nilai', {id_nilai})

    return {
        success: response.success,
        data: response?.data,
        message: response.message
    }
}

export const M_Nilai_delete_nis = async (nis) => {
    const response = await urlDelete('/v1/data/nilai', {nis})

    return {
        success: response.success,
        data: response?.data,
        message: response.message
    }
}

export const M_Nilai_update = async (id_nilai, payload) => {
    const response = await urlPut('/v1/data/nilai', {id_nilai, payload})

    return {
        success: response.success,
        data: response?.data,
        message: response.message
    }
}