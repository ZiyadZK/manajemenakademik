'use server'

import { urlDelete, urlPost, urlPut } from "../fetcher"

export const createPendidikan = async (payload) => {
    const responseData = await urlPost('/v1/data/pendidikan', payload)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const updatePendidikan = async (payload, no_pendidikan) => {
    const responseData = await urlPut('/v1/data/pendidikan', {payload, no_pendidikan})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const deletePendidikan = async (no_pendidikan) => {
    const responseData = await urlDelete('/v1/data/pendidikan', {no_pendidikan})

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}