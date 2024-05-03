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