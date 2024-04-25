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

export const getSinglePegawai = async ({id_pegawai, nip, nuptk}) => {
    try {
        if(typeof id_pegawai !== 'undefined') {
            const data = await prisma.data_pegawai.findFirst({
                where: {
                    id_pegawai: id_pegawai
                }
            })
            return {
                success: true,
                data: data
            }
        }

        if(typeof nip !== 'undefined') {
            const data = await prisma.data_pegawai.findFirst({
                where: {
                    nip: nip
                }
            })
            return {
                success: true,
                data: data
            }
        }

        if(typeof nuptk !== 'undefined') {
            const data = await prisma.data_pegawai.findFirst({
                where: {
                    nuptk: nuptk
                }
            })
            return {
                success: true,
                data: data
            }
        }

        return {
            success: false
        }

    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
}

export const updateSinglePegawai = async (id_pegawai, payload) => {
    try {
        await prisma.data_pegawai.update({
            where: {
                id_pegawai: id_pegawai
            },
            data: payload
        })

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
}

export const deleteSinglePegawai = async (id_pegawai) => {
    try {
        await prisma.data_pegawai.delete({
            where: {
                id_pegawai: id_pegawai
            }
        })
        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
}

export const deleteManyPegawai = async (arrayOfID_Pegawai) => {
    try {
        await prisma.data_pegawai.deleteMany({
            where: {
                id_pegawai: {
                    in: arrayOfID_Pegawai
                }
            }
        })
        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
}

export const createMultiPegawai = async (arrayDataPegawai) => {
    try {
        await prisma.data_pegawai.createMany({
            data: arrayDataPegawai
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