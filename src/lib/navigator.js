'use client'

import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"


const mySwal = withReactContent(Swal)
export const navigator = () => {
    const router = useRouter()
    return {
        go: (url) => {
            mySwal.fire({
                title: 'Mohon Tunggu Sebentar..',
                allowOutsideClick: false,
                timer: 10000,
                didOpen: () => router.push(url)
            })
        },
        back: () => {
            mySwal.fire({
                title: 'Mohon Tunggu Sebentar..',
                allowOutsideClick: false,
                timer: 10000,
                didOpen: () => router.back()
            })
        }
    }
}