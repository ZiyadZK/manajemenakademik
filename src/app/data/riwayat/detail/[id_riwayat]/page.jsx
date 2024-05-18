'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta } from "@/config/fonts"
import { getSingleRiwayat } from "@/lib/model/riwayatModel"
import { faArrowLeft, faClipboard, faInfoCircle, faUserTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export default function DataRiwayatDetailPage({params}) {
    const router = useRouter()

    const [data, setData] = useState({})
    const [displayData, setDisplayData] = useState('tabel')
    const [loadingFetch, setLoadingFetch] = useState('')

    const getData = async () => {
        const responseData = await getSingleRiwayat(params.id_riwayat)

        if(responseData.success) {
            setData(responseData.data)
        }

        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getData()
    }, [])

    const handleCopyData = (json) => {
        navigator.clipboard.writeText(JSON.parse(json, null, 2)).then(() => {
            toast.success('Berhasil meng-copy data')
        }).catch(error => {
            toast.error('Gagal meng-copy data!')
            console.log(error)
        })
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className={`mt-3 ${jakarta.className}`}>
                <div className={`flex md:items-center md:justify-between w-full md:flex-row flex-col gap-3`}>
                    <div className="flex items-center gap-2 md:gap-5">
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                        </button>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faUserTimes} className="w-4 h-4 text-blue-600" />
                            <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text">
                                Detail Riwayat
                            </h1>
                        </div>
                    </div>
                </div>
                <hr className="my-3" />

                <div className="space-y-1">

                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Tanggal, Waktu
                        </p>
                        {loadingFetch !== 'fetched' && (
                            <div className="w-full py-4 rounded-lg bg-zinc-100 animate-pulse md:w-3/5"></div>
                        )}
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            {data.tanggal} {data.waktu}
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Aksi
                        </p>
                        {loadingFetch !== 'fetched' && (
                            <div className="w-full py-4 rounded-lg bg-zinc-100 animate-pulse md:w-3/5"></div>
                        )}
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            {data.aksi}
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Kategori Data
                        </p>
                        {loadingFetch !== 'fetched' && (
                            <div className="w-full py-4 rounded-lg bg-zinc-100 animate-pulse md:w-3/5"></div>
                        )}
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            {data.kategori}
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Keterangan
                        </p>
                        {loadingFetch !== 'fetched' && (
                            <div className="w-full py-4 rounded-lg bg-zinc-100 animate-pulse md:w-3/5"></div>
                        )}
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            {data.keterangan}
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Nama
                        </p>
                        {loadingFetch !== 'fetched' && (
                            <div className="w-full py-4 rounded-lg bg-zinc-100 animate-pulse md:w-3/5"></div>
                        )}
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            {data.nama}
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Email
                        </p>
                        {loadingFetch !== 'fetched' && (
                            <div className="w-full py-4 rounded-lg bg-zinc-100 animate-pulse md:w-3/5"></div>
                        )}
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            {data.email}
                        </div>
                    </div>
                </div>

                <hr className="my-2 opacity-0" />
                {loadingFetch !== 'fetched' && (
                    <div className="w-full p-5 rounded-2xl bg-zinc-100 animate-pulse"></div>
                )}
                {loadingFetch === 'fetched' && data && (
                    <div className="w-full border rounded-2xl p-5">
                        <div className="flex items-center gap-5">
                            <button type="button" onClick={() => handleCopyData(data.records)} className="p-2 rounded bg-zinc-100 flex items-center w-fit gap-3 text-sm hover:bg-zinc-200 focus:bg-zinc-300">
                                <FontAwesomeIcon icon={faClipboard} className="w-3 h-3 text-inherit" />
                                Copy this data
                            </button>
                            <button type="button" onClick={() => document.getElementById('info_json').showModal()} className="text-zinc-600 hover:text-blue-700">
                                <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-inherit" />
                            </button>
                            <dialog id="info_json" class="modal">
                                <div class="modal-box bg-white">
                                    <form method="dialog">
                                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 class="font-bold text-lg">Informasi</h3>
                                    <p className="text-zinc-500" class="py-4">
                                        Jika anda mengalami kebingungan / kesusahan untuk membaca data ini, anda bisa pergi ke halaman <a target="_blank" className="hover:text-blue-700 text-zinc-700" href="https://jsonviewer.stack.hu/">JSON Viewer ini.</a>
                                    </p>
                                </div>
                            </dialog>
                        </div>
                        <hr className="my-2 opacity-0" />
                        <div className="relative w-full overflow-auto h-fit max-h-[400px]">
                            <pre className="text-pretty overflow-auto">
                                {JSON.parse(data.records, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}


            </div>
        </MainLayoutPage>
    )
}