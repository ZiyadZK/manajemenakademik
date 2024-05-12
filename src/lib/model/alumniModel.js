'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"
import { prisma } from "../prisma"

export const model_getAllAlumni = async () => {
    const responseData = await urlGet('/v1/data/alumni')
    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const model_deleteAlumni = async (arrayNis) => {
    const responseData = await urlDelete('/v1/data/alumni', {arrayNis})
    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const model_updateAlumni = async (arrayNis, payload) => {
    const responseData = await urlPut('/v1/data/alumni', {arrayNis, payload})
    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const model_getAlumniByNis = async (nis) => {
    const responseData = await urlGet(`/v1/data/alumni/nis/${nis}`)
    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const model_createAlumni = async (payload) => {
    const responseData = await urlPost('/v1/data/alumni', payload)
    return {
        success: responseData.success,
        message: responseData.result
    }
}