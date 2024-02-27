'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faArrowLeftLong, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"

export default function DataSiswaNewPage() {
    const router = useRouter()
    return (
        <MainLayoutPage>
            <div className="p-5">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-5">
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center rounded border border-zinc-600 text-zinc-800 hover:bg-zinc-800 hover:text-white transition-all duration-300 hover:scale-95 focus:bg-zinc-800 focus:text-white focus:scale-95 text-sm w-6 h-6" title="Kembali ke sebelumnya">
                            <FontAwesomeIcon icon={faArrowLeftLong} className="w-3 h-3 text-inherit" />
                        </button>
                        <h1 className="px-2 py-1 rounded-full bg-zinc-800 text-white font-bold text-sm">
                            Pembuatan Data Siswa Baru
                        </h1>
                    </div>
                    <button type="button" className="flex items-center gap-3 justify-center rounded bg-blue-400 hover:bg-blue-500 focus:bg-blue-500 button text-white p-2 font-bold text-xs transition-all duration-300">
                        <FontAwesomeIcon icon={faUpload} className="w-4 h-4 text-inherit" />
                        Import dari CSV
                    </button>
                </div>
                
            </div>
        </MainLayoutPage>
    )
}