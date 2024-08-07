'use server'

import { urlDelete, urlGet, urlPost } from "../fetcher"
import { logRiwayat } from "./riwayatModel"

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

export const deleteRoleKelas = async (parameter, role) => {
    const responseData = await urlDelete('/v1/data/kelas', {parameter, role})

    return {
        success: responseData.success,
        message: responseData.result
    }
}