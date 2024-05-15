'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta } from "@/config/fonts"
import { faEllipsisH, faPlus, faTable, faTimeline } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { Toaster } from "react-hot-toast"

export default function DataRiwayatPage() {

    const [showData, setShowData] = useState('timeline')

    return (
        <MainLayoutPage>
            <Toaster />
            <div className={`mt-3 ${jakarta.className}`}>
                <hr className="my-3 opacity-0" />
                <div className="grid grid-cols-12 w-full  bg-blue-500 *:px-2 *:py-3 text-white text-sm">
                    <div className="flex items-center gap-3 col-span-2 place-items-center">
                        Tanggal, Waktu
                    </div>
                    <div className="flex items-center col-span-2">
                        Aksi
                    </div>
                    <div className="flex items-center gap-3 col-span-2">
                        Data
                    </div>
                    <div className="flex items-center col-span-3">
                        Keterangan
                    </div>
                    <div className="flex items-center col-span-2">
                        A
                    </div>
                </div>
                <div className="divide-y relative overflow-auto w-full max-h-[300px]">                    
                    <div className="grid grid-cols-12 w-full divide-x *:px-2 *:py-3 text-zinc-600 text-sm">
                        <div className="col-span-2 flex items-center gap-5">
                            <p>20/20/2023</p>
                            <p>09.09</p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <div className="flex items-center rounded-full px-2 py-1 text-xs w-fit bg-green-100 text-green-600 gap-2">
                                <FontAwesomeIcon icon={faPlus} className="w-2 h-2 text-inherit" />
                                Tambah
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="px-2 py-1 text-xs bg-zinc-100 text-zinc-700 w-fit rounded-full">
                                Data Akun
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}