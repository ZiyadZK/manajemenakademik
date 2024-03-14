'use server'

import { prisma } from "../prisma"

export const getAllPegawai = async () => {
    try {
        const data = await prisma.data_pegawai.findMany()
        return {
            success: true,
            data: data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
}