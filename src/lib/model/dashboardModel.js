'use server'

import { urlGet } from "../fetcher"

export const getAllDashboard = async () => {
    try {
        const data = await urlGet('/v1/data/dashboard')
        
        return {
            success: true,
            data: data.result.data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }        
    }
}