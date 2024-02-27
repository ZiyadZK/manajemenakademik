'use server'

import { prisma } from "../prisma"

export const getAllSiswa = async () => {
    try {
        const data = await prisma.data_siswa.findMany();
        return data
    } catch (error) {
        console.log(error)
        return []        
    }
}