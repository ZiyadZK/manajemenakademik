'use server'

import { prisma } from "../prisma"

export const getDataSertifikat = async (id_pegawai) => {
    try {
        let data = await prisma.data_sertifikat.findMany({
            where: {
                sertifikat_id_pegawai: id_pegawai
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
            error: error.message
        }
    }
}