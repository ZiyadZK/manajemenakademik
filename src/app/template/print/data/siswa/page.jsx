'use client'

import Image from "next/image"
import { forwardRef } from "react"

export const TemplatePrintDataSiswa = forwardRef((props, ref) => {
    return (
        <div ref={ref} className="p-5 bg-white">
            <div className="flex items-center justify-between">
                <Image src={'/logo-sekolah.png'} width={10} height={10} className="w-10 h-10" />
                <div className="text-center">
                    Data Siswa
                </div>
                <div className="text-center">
                    Data Siswa
                </div>
            </div>
            <hr className="my-2 opacity-0" />
            ABC 123
        </div>
    )
}) 