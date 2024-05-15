'use server'

import { urlGet } from "../fetcher"

export const getDataSertifikat = async (id_pegawai) => {

    const responseData = await urlGet(`/v1/data/sertifikat/id_pegawai/${id_pegawai}`)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }

    // try {
    //     let data = await prisma.data_sertifikat.findMany({
    //         where: {
    //             sertifikat_id_pegawai: id_pegawai
    //         }
    //     })

    //     // change Uint8Array
    //     let updatedData = data.map(sertifikat => ({...sertifikat, fileData: sertifikat.fileData !== '' || typeof(sertifikat.fileData) !== 'undefined' ? 'valid' : 'tidak valid'}))
        
    //     return {
    //         success: true,
    //         data: updatedData
    //     }
    // } catch (error) {
    //     console.log(error.message)
    //     return {
    //         success: false,
    //         error: error.message
    //     }
    // }
}