'use server'

import { cookies } from "next/headers"

export const setCookie = async (name, value) => {
    cookies().set(name, value)
}