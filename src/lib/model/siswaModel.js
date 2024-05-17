'use server'

import axios from "axios";
import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher";
import { logRiwayat } from "./riwayatModel"

export const getAllSiswa = async () => {
    try {
        let responseData;

        await axios.get(`${process.env.API_URL}/v1/data/siswa`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            const data = response.data

            responseData = data
        }).catch(error => {
            const data = error.response.data

            responseData = data
        })

        return responseData.data
    } catch (error) {
        console.log(error)
        return []        
    }
}

export const getSiswaByNIS = async (nis) => {
    try {
        const responseData = await urlGet(`/v1/data/siswa/nis/${nis}`)
        if(!responseData.success) {
            return {
                exist: false
            }
        }

        return {
            exist: true,
            data: responseData.data
        }
    } catch (error) {
        console.log(error)
        return {
            exist: false
        }
    }
}

export const updateSiswaByNIS = async (nis, payload) => {
    const responseData = await urlPut('/v1/data/siswa', {arrayNis: nis, payload})

    await logRiwayat({
        aksi: 'Ubah',
        kategori: 'Data Siswa',
        keterangan: `Mengubah ${Array.isArray(nis) ? nis.length : '1'} Data ke dalam Data Siswa`,
        records: `${JSON.stringify({nis, payload})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const createSingleSiswa = async (payload) => {
    const responseData = await urlPost('/v1/data/siswa', payload)

    await logRiwayat({
        aksi: 'Tambah',
        kategori: 'Data Siswa',
        keterangan: `Menambah ${Array.isArray(payload) ? payload.length : '1'} Data ke dalam Data Siswa`,
        records: `${JSON.stringify(Array.isArray(payload) ? payload : {...payload})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const createMultiSiswa = async (payload) => {
    const responseData = await urlPost('/v1/data/siswa', payload)

    await logRiwayat({
        aksi: 'Tambah',
        kategori: 'Data Siswa',
        keterangan: `Menambah ${Array.isArray(payload) ? payload.length : '1'} Data ke dalam Data Siswa`,
        records: `${JSON.stringify(Array.isArray(payload) ? payload : {...payload})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const deleteSingleSiswaByNis = async (nis) => {
    const responseData = await urlDelete('/v1/data/siswa', {arrayNis: nis})

    await logRiwayat({
        aksi: 'Hapus',
        kategori: 'Data Siswa',
        keterangan: `Menghapus ${Array.isArray(nis) ? nis.length : '1'} Data dari Data Siswa`,
        records: `${JSON.stringify({arrayNis: nis})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const deleteMultiSiswaByNis = async arrayNis => {
    const responseData = await urlDelete('/v1/data/siswa', {arrayNis})

    await logRiwayat({
        aksi: 'Hapus',
        kategori: 'Data Siswa',
        keterangan: `Menghapus ${Array.isArray(arrayNis) ? arrayNis.length : '1'} Data dari Data Siswa`,
        records: `${JSON.stringify({arrayNis: arrayNis})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const naikkanKelasSiswa = async (nisTidakNaikKelas) => {
    console.log(nisTidakNaikKelas)
    const responseData = await urlPost('/v1/data/siswa/naikkelas', {nisTidakNaikKelasArr: nisTidakNaikKelas})

    await logRiwayat({
        aksi: 'Naik Kelas',
        kategori: 'Data Siswa',
        keterangan: nisTidakNaikKelas.length > 0 ? `Menaikkan Data Kelas dari Data Siswa, kecuali beberapa siswa` : 'Menaikkan semua Data Kelas dari Data Siswa',
        records: `${JSON.stringify({arrayNis: nisTidakNaikKelas})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const updateBulkSiswa = async (nisArray, data) => {
    const responseData = await urlPut('/v1/data/siswa', {arrayNis: nisArray, payload: data})

    await logRiwayat({
        aksi: 'Ubah',
        kategori: 'Data Siswa',
        keterangan: `Mengubah ${Array.isArray(nisArray) ? nisArray.length : '1'} Data ke dalam Data Siswa`,
        records: `${JSON.stringify({nisArray, data})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}