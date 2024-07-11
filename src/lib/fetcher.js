'use server'

import axios from "axios"

export const urlGet = async (url) => {
    return new Promise(async (resolve, reject) => {
        await axios.get(`${process.env.API_URL}${url}`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            const responseData = response.data
            resolve({
                success: true,
                result: responseData,
                data: responseData.data
            })
        }).catch(error => {
            const responseData = error.response
            reject({
                success: false,
                result: responseData
            })
        })
    })
}

export const urlPost = async (url, payload) => {
    return new Promise(async (resolve, reject) => {
        await axios.post(`${process.env.API_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        }).then(response => {
            const responseData = response.data
            resolve({
                success: true,
                result: responseData,
                data: responseData.data
            })
        }).catch(error => {
            const responseData = error.response
            reject({
                success: false,
                result: responseData
            })
        })
    })
}

export const urlPut = async (url, payload) => {
    return new Promise(async (resolve, reject) => {
        await axios.put(`${process.env.API_URL}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            const responseData = response.data
            resolve({
                success: true,
                result: responseData,
                data: responseData.data
            })
        }).catch(error => {
            const responseData = error.response
            reject({
                success: false,
                result: responseData
            })
        })
    })
}

export const urlDelete = async (url, payload) => {
    return new Promise(async (resolve, reject) => {
        await axios({
            method: 'DELETE',
            url: `${process.env.API_URL}${url}`,
            data: payload,
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            const responseData = response.data
            resolve({
                success: true,
                result: responseData
            })
        }).catch(error => {
            const responseData = error.response
            reject({
                success: false,
                result: responseData
            })
        })
    })
}