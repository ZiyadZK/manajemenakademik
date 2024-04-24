'use server'

const CryptoJS = require("crypto-js");

export const decryptKey = async (token) => {
    const bytes = CryptoJS.AES.decrypt(token, process.env.PUBLIC_KEY)
    const payload = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(payload)
}

export const encryptKey = async (payload) => {
    const data = typeof(payload) === 'object' ? JSON.stringify(payload) : String(payload)
    const token = CryptoJS.AES.encrypt(data, process.env.PUBLIC_KEY)
    return token
}