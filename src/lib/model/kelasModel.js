'use server'

import { urlDelete, urlGet, urlPost } from "../fetcher"

export const getAllKelas = async () => {
    const responseData = await urlGet('/v1/data/kelas')

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const getDetailKelas = async (kelas, rombel, no_rombel) => {
    const responseData = await urlGet(`/v1/data/kelas/${kelas}/${rombel}/${no_rombel}`)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const setWaliKelas = async (kelas, rombel, no_rombel, payload) => {
    const responseData = await urlPost(`/v1/data/kelas/${kelas}/${rombel}/${no_rombel}/walikelas`, payload)

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const setGuruBK = async (kelas, rombel, no_rombel, payload) => {
    const responseData = await urlPost(`/v1/data/kelas/${kelas}/${rombel}/${no_rombel}/gurubk`, payload)

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const deleteWaliKelas = async (kelas, rombel, no_rombel) => {
    const responseData = await urlDelete(`/v1/data/kelas/${kelas}/${rombel}/${no_rombel}/walikelas`)

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const deleteGuruBK = async (kelas, rombel, no_rombel) => {
    const responseData = await urlDelete(`/v1/data/kelas/${kelas}/${rombel}/${no_rombel}/gurubk`)

    return {
        success: responseData.success,
        message: responseData.result
    }
}