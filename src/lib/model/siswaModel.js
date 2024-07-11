'use server'

import axios from "axios";
import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher";
import { logRiwayat } from "./riwayatModel"

export const getAllSiswa = async () => {
    try {
        let responseData;

        await axios.get(`${process.env.API_URL}/v1/data/siswa`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            const data = response.data

            responseData = data
        }).catch(error => {
            const data = error.response.data

            responseData = data
        })

        return responseData.data
    } catch (error) {
        console.log(error)
        return []        
    }
}

export const getSiswaByNIS = async (nis) => {
    try {
        const responseData = await urlGet(`/v1/data/siswa/nis/${nis}`)
        if(!responseData.success) {
            return {
                exist: false
            }
        }

        return {
            exist: true,
            data: responseData.data
        }
    } catch (error) {
        console.log(error)
        return {
            exist: false
        }
    }
}

export const updateSiswaByNIS = async (nis, payload) => {
    const responseData = await urlPut('/v1/data/siswa', {arrayNis: nis, payload})

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const createSingleSiswa = async (payload) => {
    const responseData = await urlPost('/v1/data/siswa', payload)

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const createMultiSiswa = async (payload) => {
    const responseData = await urlPost('/v1/data/siswa', payload)

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const deleteSingleSiswaByNis = async (nis) => {
    const responseData = await urlDelete('/v1/data/siswa', {arrayNis: nis})

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const deleteMultiSiswaByNis = async arrayNis => {
    const responseData = await urlDelete('/v1/data/siswa', {arrayNis})

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const naikkanKelasSiswa = async (nisTidakNaikKelas) => {
    const responseData = await urlPost('/v1/data/siswa/naikkelas', {nisTidakNaikKelasArr: nisTidakNaikKelas})

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const updateBulkSiswa = async (nisArray, data) => {
    const responseData = await urlPut('/v1/data/siswa', {arrayNis: nisArray, payload: data})

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const naikkanKelasSiswa_selected = async (nisSelectedNaikKelasArr) => {
    const responseData = await urlPost('/v1/data/siswa/naikkelas', {nisSelectedNaikKelasArr})

    return {
        success: responseData.success,
        message: responseData.result
    }
}