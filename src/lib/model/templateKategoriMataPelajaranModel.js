'use server'

import { urlDelete, urlGet, urlPost, urlPut } from "../fetcher"

export const M_Template_Kategori_Mapel_getAll = async (tahun, jurusan = 'Semua', kelas = 'Semua') => {

    const responseData = await urlGet(`/v1/data/template_kategori/${tahun}/${jurusan}/${kelas}`)

    return {
        success: responseData.success,
        data: responseData.data,
        message: responseData.result
    }
}

export const M_Template_Kategori_Mapel_create = async (payload) => {
    const responseData = await urlPost('/v1/data/template_kategori', payload)

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Template_Kategori_Mapel_assign_mapel = async (payload) => {
    const responseData = await urlPost('/v1/data/template_mapel', payload)

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Template_Kategori_Mapel_edit_mapel = async (no, payload) => {
    const responseData = await urlPut('/v1/data/template_mapel', {no, payload})

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Template_Kategori_Mapel_delete_mapel = async (no, payload) => {
    const responseData = await urlDelete('/v1/data/template_mapel', {no, payload})

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Template_Kategori_Mapel_ascend_mapel = async (fk_no_template_kategori, fk_mapel_id_mapel) => {
    const responseData = await urlPut('/v1/data/template_mapel/asc', {fk_no_template_kategori, fk_mapel_id_mapel})

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Template_Kategori_Mapel_descend_mapel = async (fk_no_template_kategori, fk_mapel_id_mapel) => {
    const responseData = await urlPut('/v1/data/template_mapel/desc', {fk_no_template_kategori, fk_mapel_id_mapel})

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Template_Kategori_Mapel_delete = async (no) => {
    const responseData = await urlDelete('/v1/data/template_kategori', {no})

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}

export const M_Template_Kategori_Mapel_edit = async (no, payload) => {
    const responseData = await urlPut('/v1/data/template_kategori', {no, payload})

    return {
        success: responseData.success,
        data: responseData?.data,
        message: responseData?.result
    }
}