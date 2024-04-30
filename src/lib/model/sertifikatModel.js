'use server'

import { prisma } from "../prisma"

export const getDataSertifikat = async (id_pegawai) => {
    try {
        let data = await prisma.data_sertifikat.findMany({
            where: {
                sertifikat_id_pegawai: id_pegawai
            }
        })

        // change Uint8Array
        let updatedData = data.map(sertifikat => ({...sertifikat, fileData: sertifikat.fileData !== '' || typeof(sertifikat.fileData) !== 'undefined' ? 'valid' : 'tidak valid'}))
        
        return {
            success: true,
            data: updatedData
        }
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            error: error.message
        }
    }
}