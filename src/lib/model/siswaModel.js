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

export const naikkanKelasSiswa = async (nisTidakNaikKelas) => {
    try {
        // Dapatkan Semua data kelas 10 11 12
        let dataSiswa = await prisma.data_siswa.findMany();
        let siswaTidakNaik;

        // Kalau ada siswa tidak naik, di filter dulu
        if(nisTidakNaikKelas && nisTidakNaikKelas.length > 0) {
            const daftarNisTidakNaikKelas = nisTidakNaikKelas.map(({nis}) => nis)
            siswaTidakNaik = dataSiswa.filter(siswa => daftarNisTidakNaikKelas.includes(siswa.nis))
            dataSiswa = dataSiswa.filter(siswa => !daftarNisTidakNaikKelas.includes(siswa.nis))
        }

        const dataKelas10 = dataSiswa.filter(siswa => siswa.kelas.includes('X '))
        const dataKelas11 = dataSiswa.filter(siswa => siswa.kelas.includes('XI '))
        const dataKelas12 = dataSiswa.filter(siswa => siswa.kelas.includes('XII '))
        

        // menghapus semua data siswa dari tabel data siswa
        await prisma.data_siswa.deleteMany();

        // Memasukkan dataKelas12 ke dalam tabel alumni
        await prisma.data_alumni.createMany({
            data: dataKelas12
        })

        // Mengupdate dataKelas 11 menjadi kelas 12, dan kelas 10 menjadi kelas 11
        const newDataKelas12 = dataKelas11.map(siswa => ({...siswa, kelas: siswa.kelas.replace('XI ', 'XII ')}))
        const newDataKelas11 = dataKelas10.map(siswa => ({...siswa, kelas: siswa.kelas.replace('X ', 'XI ')}))

        // Insert data ke tabel siswa
        await prisma.data_siswa.createMany({
            data: [...newDataKelas11, ...newDataKelas12]
        })

        if(siswaTidakNaik && siswaTidakNaik.length > 0) {
            await prisma.data_siswa.createMany({
                data: siswaTidakNaik
            })
        }

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