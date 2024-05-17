'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"
import { logRiwayat } from "./riwayatModel"

export const getAllPegawai = async () => {
    const responseData = await urlGet('/v1/data/pegawai')

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const getSinglePegawai = async ({id_pegawai, nip, nuptk}) => {
    const responseData = await urlGet(`/v1/data/pegawai/id_pegawai/${id_pegawai}`)    

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const updateSinglePegawai = async (id_pegawai, payload) => {
    const responseData = await urlPut('/v1/data/pegawai', {arrayId_pegawai: id_pegawai, payload})

    await logRiwayat({
        aksi: 'Ubah',
        kategori: 'Data Pegawai',
        keterangan: `Mengubah ${Array.isArray(id_pegawai) ? id_pegawai.length : '1'} Data ke dalam Data Pegawai`,
        records: `${JSON.stringify({arrayId_pegawai: id_pegawai, payload})}`
    })

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const deleteSinglePegawai = async (id_pegawai) => {
    const responseData = await urlDelete('/v1/data/pegawai', {arrayId_pegawai: id_pegawai})

    await logRiwayat({
        aksi: 'Hapus',
        kategori: 'Data Pegawai',
        keterangan: `Menghapus ${Array.isArray(id_pegawai) ? id_pegawai.length : '1'} Data dari Data Pegawai`,
        records: `${JSON.stringify({arrayId_pegawai: id_pegawai})}`
    })

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const deleteManyPegawai = async (arrayOfID_Pegawai) => {
    const responseData = await urlDelete('/v1/data/pegawai', {arrayId_pegawai: arrayOfID_Pegawai})

    await logRiwayat({
        aksi: 'Hapus',
        kategori: 'Data Pegawai',
        keterangan: `Menghapus ${Array.isArray(id_pegawai) ? id_pegawai.length : '1'} Data dari Data Pegawai`,
        records: `${JSON.stringify({arrayId_pegawai: id_pegawai})}`
    })

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const createSinglePegawai = async (payload) => {
    const responseData = await urlPost('/v1/data/pegawai', payload)

    await logRiwayat({
        aksi: 'Tambah',
        kategori: 'Data Pegawai',
        keterangan: `Menambah ${Array.isArray(payload) ? payload.length : '1'} Data ke dalam Data Pegawai`,
        records: `${JSON.stringify(Array.isArray(payload) ? payload : {...payload})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}

export const createMultiPegawai = async (arrayDataPegawai) => {
    const responseData = await urlPost('/v1/data/pegawai', arrayDataPegawai)

    await logRiwayat({
        aksi: 'Tambah',
        kategori: 'Data Pegawai',
        keterangan: `Menambah ${Array.isArray(arrayDataPegawai) ? arrayDataPegawai.length : '1'} Data ke dalam Data Pegawai`,
        records: `${JSON.stringify(Array.isArray(arrayDataPegawai) ? arrayDataPegawai : {...arrayDataPegawai})}`
    })

    return {
        success: responseData.success,
        message: responseData.result
    }
}