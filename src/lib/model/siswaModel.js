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

export const getSiswaByNIS = async (nis) => {
    try {
        const data = await prisma.data_siswa.findFirst({
            where: {
                nis
            }
        })
        if(data === null) {
            return {
                exist: false
            }
        }
        return {
            exist: true,
            data
        }
    } catch (error) {
        console.log(error)
        return {
            exist: false
        }
    }
}

export const updateSiswaByNIS = async (nis, payload) => {
    try {
        await prisma.data_siswa.update({
            where: {
                nis
            },
            data: payload
        })
        return {
            success: true
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
        }
    }
}