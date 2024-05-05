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