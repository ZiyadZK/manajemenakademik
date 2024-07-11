'use client'

import MainLayoutPage, { useContextLoggedData } from "@/components/mainLayout"
import { date_getDay, date_getMonth, date_getYear } from "@/lib/dateConvertes"
import { getAllRiwayat } from "@/lib/model/riwayatModel"
import { faExclamationCircle, faFile, faRefresh, faSearch, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

export default function DataRiwayatPage() {
    const [data, setData] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)

    const getData = async () => {
        setLoadingFetch('loading')
        const response = await getAllRiwayat()
        console.log(response)
        if(response.success) {
            setData(response.data)
        }
        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                {loadingFetch !== 'fetched' && (
                    <div className="flex items-center gap-2">
                        <button type="button" disabled className="rounded-md border dark:border-zinc-700 bg-zinc-300 dark:bg-zinc-700 px-3 py-2 flex items-center justify-center gap-3 w-1/2 md:w-fit ease-out duration-200 animate-pulse">
                            <FontAwesomeIcon icon={faRefresh} className="w-3 h-3 text-inherit opacity-0" />
                            <span className="opacity-0">Bersihkan</span>
                        </button>
                        <button type="button" disabled className="rounded-md border dark:border-zinc-700 bg-zinc-300 dark:bg-zinc-700 px-3 py-2 flex items-center justify-center gap-3 w-1/2 md:w-fit ease-out duration-200 animate-pulse">
                            <FontAwesomeIcon icon={faUpload} className="w-3 h-3 text-inherit opacity-0" />
                            <span className="opacity-0">Backup</span>
                        </button>
                    </div>
                )}
                {loadingFetch === 'fetched' && data.length > 0 && (
                    <div className="flex items-center gap-2">
                        <button type="button" className="rounded-md border dark:border-zinc-700 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3 w-1/2 md:w-fit ease-out duration-200">
                            <FontAwesomeIcon icon={faRefresh} className="w-3 h-3 text-inherit opacity-60" />
                            Bersihkan
                        </button>
                        <button type="button" className="rounded-md border dark:border-zinc-700 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3 w-1/2 md:w-fit ease-out duration-200">
                            <FontAwesomeIcon icon={faUpload} className="w-3 h-3 text-inherit opacity-60" />
                            Backup
                        </button>
                    </div>
                )}
                <hr className="my-5 dark:opacity-10" />
                <div className="grid grid-cols-12 p-3 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                    <div className="col-span-2 hidden md:flex items-center font-semibold">
                        Waktu
                    </div>
                    <div className="col-span-7 md:col-span-2 flex items-center font-semibold">
                        User
                    </div>
                    <div className="col-span-2 hidden md:flex items-center font-semibold">
                        Aksi
                    </div>
                    <div className="col-span-2 hidden md:flex items-center font-semibold">
                        Kategori
                    </div>
                    <div className="col-span-2 hidden md:flex items-center font-semibold">
                        Keterangan
                    </div>
                    <div className="col-span-5 md:col-span-2 flex items-center justify-center">
                        <input type="text" className="w-full bg-white dark:bg-zinc-900 px-2 py-1 rounded-md border dark:border-zinc-700" placeholder="Cari disini" />
                    </div>
                </div>
                {loadingFetch !== 'fetched' && (
                    <div className="w-full py-2 flex items-center justify-center">
                        <div className="loading loading-sm opacity-50 loading-spinner"></div>
                    </div>
                )}
                <div className="py-2 relative overflow-auto max-h-[600px]">
                    {data.slice(0, 30).map((value, index) => (
                        <div key={index} className="grid grid-cols-12 px-3 py-2 rounded-md">
                            <div className="col-span-2 hidden md:flex items-center">
                                <div className="space-y-1">
                                    <p>
                                        {date_getDay(value['tanggal'])} {date_getMonth('string', value['tanggal'])} {date_getYear(value['tanggal'])}
                                     </p>
                                    <p className="opacity-60">
                                        {value['waktu']}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-7 md:col-span-2 flex items-center">
                                <div className="space-y-1">
                                    <p>
                                        {value['nama_akun']}
                                    </p>
                                    <p className="opacity-60">
                                        {value['email_akun']}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-1">
                                {value['aksi'] === 'Tambah' && (
                                    <p className="px-2 py-1 rounded-full bg-green-500 text-white border border-green-500 dark:bg-green-500/10 dark:text-green-500">
                                        Tambah
                                    </p>
                                )}
                                {value['aksi'] === 'Hapus' && (
                                    <p className="px-2 py-1 rounded-full bg-red-500 text-white border border-red-500 dark:bg-red-500/10 dark:text-red-500">
                                        Hapus
                                    </p>
                                )}
                                {value['aksi'] === 'Ubah' && (
                                    <p className="px-2 py-1 rounded-full bg-amber-500 text-white border border-amber-500 dark:bg-amber-500/10 dark:text-amber-500">
                                        Ubah
                                    </p>
                                )}
                                {value['aksi'] === 'Naikkan Kelas' && (
                                    <p className="px-2 py-1 rounded-full bg-cyan-500 text-white border border-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-500">
                                        Naikkan Kelas
                                    </p>
                                )}
                                {value['aksi'] === 'Turunkan Kelas' && (
                                    <p className="px-2 py-1 rounded-full bg-red-500 text-white border border-red-500 dark:bg-red-500/10 dark:text-red-500">
                                        Turunkan Kelas
                                    </p>
                                )}
                                {value['aksi'] === 'Export' && (
                                    <p className="px-2 py-1 rounded-full bg-rose-500 text-white border border-rose-500 dark:bg-rose-500/10 dark:text-rose-500">
                                        Export
                                    </p>
                                )}
                                {value['aksi'] === 'Import' && (
                                    <p className="px-2 py-1 rounded-full bg-fuchsia-500 text-white border border-fuchsia-500 dark:bg-fuchsia-500/10 dark:text-fuchsia-500">
                                        Import
                                    </p>
                                )}
                                {value['aksi'] === 'Mutasi' && (
                                    <p className="px-2 py-1 rounded-full bg-violet-500 text-white border border-violet-500 dark:bg-violet-500/10 dark:text-violet-500">
                                        Mutasi
                                    </p>
                                )}
                            </div>
                            <div className="col-span-2 hidden md:flex items-center">
                                {value['kategori']}
                            </div>
                            <div className="col-span-2 hidden md:flex items-center">
                                {value['keterangan']}
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center justify-center gap-1">
                                <button type="button" onClick={() => document.getElementById(`info_${value['id_riwayat']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex md:hidden items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                </button>
                                <dialog id={`info_${value['id_riwayat']}`} className="modal backdrop-blur">
                                    <div className="modal-box rounded-md border dark:border-zinc-700 dark:bg-zinc-900">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Info Riwayat</h3>
                                        <hr className="my-3 dark:opacity-10" />
                                        <div className="divide-y dark:divide-zinc-800">
                                            <div className="space-y-1 py-3">
                                                <p className="opacity-60">
                                                    Tanggal & Waktu
                                                </p>
                                                <p>
                                                    {date_getDay(value['tanggal'])} {date_getMonth('string', value['tanggal'])} {date_getYear(value['tanggal'])} {value['waktu']}
                                                </p>
                                            </div>
                                            <div className="space-y-1 py-3">
                                                <p className="opacity-60">
                                                    Nama
                                                </p>
                                                <p>
                                                    {value['nama_akun']}
                                                </p>
                                            </div>
                                            <div className="space-y-1 py-3">
                                                <p className="opacity-60">
                                                    Email
                                                </p>
                                                <p>
                                                    {value['email_akun']}
                                                </p>
                                            </div>
                                            <div className="space-y-1 py-3">
                                                <p className="opacity-60">
                                                    Aksi
                                                </p>
                                                <div className="w-fit">
                                                    {value['aksi'] === 'Tambah' && (
                                                        <p className="px-2 py-1 rounded-full bg-green-500 text-white border border-green-500 dark:bg-green-500/10 dark:text-green-500">
                                                            Tambah
                                                        </p>
                                                    )}
                                                    {value['aksi'] === 'Hapus' && (
                                                        <p className="px-2 py-1 rounded-full bg-red-500 text-white border border-red-500 dark:bg-red-500/10 dark:text-red-500">
                                                            Hapus
                                                        </p>
                                                    )}
                                                    {value['aksi'] === 'Ubah' && (
                                                        <p className="px-2 py-1 rounded-full bg-amber-500 text-white border border-amber-500 dark:bg-amber-500/10 dark:text-amber-500">
                                                            Ubah
                                                        </p>
                                                    )}
                                                    {value['aksi'] === 'Naikkan Kelas' && (
                                                        <p className="px-2 py-1 rounded-full bg-cyan-500 text-white border border-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-500">
                                                            Naikkan Kelas
                                                        </p>
                                                    )}
                                                    {value['aksi'] === 'Turunkan Kelas' && (
                                                        <p className="px-2 py-1 rounded-full bg-red-500 text-white border border-red-500 dark:bg-red-500/10 dark:text-red-500">
                                                            Turunkan Kelas
                                                        </p>
                                                    )}
                                                    {value['aksi'] === 'Export' && (
                                                        <p className="px-2 py-1 rounded-full bg-rose-500 text-white border border-rose-500 dark:bg-rose-500/10 dark:text-rose-500">
                                                            Export
                                                        </p>
                                                    )}
                                                    {value['aksi'] === 'Import' && (
                                                        <p className="px-2 py-1 rounded-full bg-fuchsia-500 text-white border border-fuchsia-500 dark:bg-fuchsia-500/10 dark:text-fuchsia-500">
                                                            Import
                                                        </p>
                                                    )}
                                                    {value['aksi'] === 'Mutasi' && (
                                                        <p className="px-2 py-1 rounded-full bg-violet-500 text-white border border-violet-500 dark:bg-violet-500/10 dark:text-violet-500">
                                                            Mutasi
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-1 py-3">
                                                <p className="opacity-60">
                                                    Kategori
                                                </p>
                                                <p>
                                                    {value['kategori']}
                                                </p>
                                            </div>
                                            <div className="space-y-1 py-3">
                                                <p className="opacity-60">
                                                    Keterangan
                                                </p>
                                                <p>
                                                    {value['keterangan']}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </dialog>
                                {value['records'] !== null && (
                                    <button type="button" onClick={() => document.getElementById(`records_${value['id_riwayat']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </button>
                                )}
                                <dialog id={`records_${value['id_riwayat']}`} className="modal backdrop-blur">
                                    <div className="modal-box rounded-md border dark:border-zinc-700 dark:bg-zinc-900">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Records Data</h3>
                                        <hr className="my-3 dark:opacity-10" />
                                        <div className="p-3 rounded-md border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950">
                                            <pre>
                                                {JSON.stringify(JSON.parse(value['records']), null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </dialog>
                            </div>
                        </div>
                    ))}

                </div>
                
            </div>

        </MainLayoutPage>
    )
}