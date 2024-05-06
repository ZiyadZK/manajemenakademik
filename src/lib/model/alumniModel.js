'use server'

import { prisma } from "../prisma"

export const model_getAllAlumni = async () => {
    try {
        const data = await prisma.data_alumni.findMany()

        return {
            success: true,
            data: data
        }
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message
        }
    }
}

export const model_deleteAlumni = async (arrayNis) => {
    try {
        await prisma.data_alumni.deleteMany({
            where: {
                nis: {
                    in: arrayNis
                }
            }
        })
        return {
            success: true
        }
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message
        }
    }
}

export const model_updateAlumni = async (arrayNis, payload) => {
    try {
        await prisma.data_alumni.updateMany({
            where: {
                nis: {
                    in: arrayNis
                }
            },
            data: payload
        })
        return {
            success: true
        }
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message
        }
    }
}

export const model_getAlumniByNis = async (nis) => {
    try {
        const data = await prisma.data_alumni.findFirst({
            where: {
                nis: nis
            }
        })

        return {
            success: true,
            data: data
        }
        
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message
        }
    }
}

export const model_createAlumni = async (payload) => {
    try {
        await prisma.data_alumni.createMany({
            data: payload
        })

        return {
            success: true
        }
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message
        }
    }
}