'use server'

import { nanoid } from "nanoid"
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

export const createSinglePegawai = async (payload) => {
    try {
        await prisma.data_pegawai.create({
            data: payload
        })

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        }
    }
}

export const createMultiPegawai = async (arrayDataPegawai) => {
    // Cek kalau misalkan pegawai belum punya nik
    let updatedData;
    updatedData = arrayDataPegawai.map(pegawai => pegawai['nik'] === '' || typeof(pegawai['nik']) === 'undefined' ? ({...pegawai, nik: nanoid(16)}) : pegawai)

    // Cek kalau misalkan kolom pendidikan terakhir terdapat value kosong
    updatedData = updatedData.map(pegawai => pegawai['pendidikan_terakhir'] === "" || typeof(pegawai['pendidikan_terakhir']) === 'undefined' ? ({...pegawai, pendidikan_terakhir: 'Tidak Ada'}) : pegawai)

    // ubah kolom id_pegawai menjadi Integer
    updatedData = updatedData.map(pegawai => ({...pegawai, id_pegawai: Number(pegawai.id_pegawai)}))

    try {
        
        await prisma.data_pegawai.createMany({
            data: updatedData
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