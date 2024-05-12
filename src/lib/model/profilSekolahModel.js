'use server'

import { Old_Standard_TT } from "next/font/google"
import { prisma } from "../prisma"

export const getProfilSekolah = async () => {
    try {
        const data = await prisma.data_profil_sekolah.findFirst()
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

export const getKepalaSekolah = async () => {
    try {
        const data = await prisma.data_pegawai.findFirst({
            where: {
                jabatan: 'Kepala Sekolah'
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
            message: error.message
        }
    }
}

export const updateProfilSekolah = async (oldData, newData) => {
    try {
        // Get ID Kepsek
        const newIdKepsek = newData.id_kepala_sekolah
        const oldIdKepsek = oldData.id_kepala_sekolah

        const { id_kepala_sekolah, kepala_sekolah, ...updatedData} = newData

        // Replace new Profil Sekolah
        await prisma.data_profil_sekolah.update({
            where: {
                npsn: oldData.npsn
            },
            data: updatedData
        })

        // Replace the old one into karyawan
        await prisma.data_pegawai.update({
            where: {
                id_pegawai: oldIdKepsek
            },
            data: {
                jabatan: 'Guru'
            }
        })

        
        await prisma.data_pegawai.update({
            where: {
                id_pegawai: newIdKepsek
            },
            data: {
                jabatan: 'Kepala Sekolah'
            }
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