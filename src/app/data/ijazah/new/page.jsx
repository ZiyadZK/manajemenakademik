'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont } from "@/config/fonts"
import { faArrowLeft, faDownload, faFileCirclePlus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Toaster } from "react-hot-toast"

export default function DataIjazahNewPage() {
    const router = useRouter()
    const [formData, setFormData] = useState([])


    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-3">
                <div className={`flex md:items-center md:justify-between w-full md:flex-row flex-col gap-3`}>
                    <div className="flex items-center gap-2 md:gap-5">
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                        </button>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faFileCirclePlus} className="w-4 h-4 text-blue-600" />
                            <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text">
                                Penambahan Data Ijazah
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <button type="button" onClick={() => router.push('/data/ijazah/new/import')} className="w-1/2 md:w-fit px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                            Import Data
                        </button>
                        <button type="button" className="w-1/2 rounded-full py-2 bg-green-50 hover:bg-green-100 focus:bg-green-200 text-green-700 md:hidden flex items-center justify-center gap-4">
                            <FontAwesomeIcon icon={faSave} className="w-5 h-5 text-inherit" />
                            Simpan
                        </button>
                    </div>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="flex md:flex-row flex-col-reverse gap-5">
                    <div className="w-full md:w-10/12"></div>
                    <div className={`${mont.className} w-full md:w-2/12 text-xs md:text-sm`}>
                        <div className="flex items-center gap-5 p-5 rounded-lg bg-zinc-50">
                            <p className="opacity-50 w-2/5">Jumlah</p>
                            <p className="w-3/5">{formData.length}</p>
                        </div>
                        <hr className="my-1 opacity-0" />
                        <button type="button" className="w-full rounded-lg py-5 bg-green-50 hover:bg-green-100 focus:bg-green-200 text-green-700 hidden md:flex items-center justify-center gap-4">
                            <FontAwesomeIcon icon={faSave} className="w-5 h-5 text-inherit" />
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}