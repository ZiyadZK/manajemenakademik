'use server'

import { cookies } from "next/headers"

export const setCookie = async (name, value, options) => {
    cookies().set(name, value, options)
}