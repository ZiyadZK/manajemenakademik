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

export const createSingleSiswa = async (payload) => {
    try {
        await prisma.data_siswa.create({
            data: payload
        })
        return {
            success: true
        }
    } catch (error) {
        console.error(error)
        return {
            success: false
        }
    }
}

export const deleteSingleSiswaByNis = async (nis) => {
    try {
        await prisma.data_siswa.delete({
            where: {
                nis
            }
        })
        return {
            success: true
        }
    } catch (error) {
        console.error(error)
        return {
            success: false
        }
    }
}

export const deleteMultiSiswaByNis = async arrayNis => {
    try {
        await prisma.data_siswa.deleteMany({
            where: {
                nis: {
                    in: arrayNis
                }
            }
        })
        return {
            success: true
        }
    } catch (error) {
        console.error(error)
        return {
            success: false
        }
    }
}

export const naikkanKelasSiswa = async () => {
    try {
        // Naikkan kelas 12 menjadi Alumni
        const dataKelas12 = await prisma.data_siswa.findMany({
            where: {
                kelas: {
                    startsWith: 'XII '
                }
            }
        })
        const nisKelas12 = dataKelas12.map(({nis}) => nis)
        await prisma.data_alumni.createMany({
            data: dataKelas12
        })
    } catch (error) {
        console.log(error)
    }
}