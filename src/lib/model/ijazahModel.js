'use server'

import { prisma } from "../prisma"

export const getAllIjazah = async () => {
    try {
        const data = await prisma.data_ijazahs.findMany()
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

export const createMultiIjazah = async (payload) => {
    try {
        await prisma.data_ijazahs.createMany({
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

export const updateMultiIjazah = async (arrayNisn, payload) => {
    try {
        await prisma.data_ijazahs.updateMany({
            where: {
                nisn: {
                    in: arrayNisn
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

export const deleteMultiIjazah = async (arrayNisn) => {
    try {
        await prisma.data_ijazahs.deleteMany({
            where: {
                nisn: {
                    in: arrayNisn
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