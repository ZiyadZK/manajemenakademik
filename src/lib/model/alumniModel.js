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