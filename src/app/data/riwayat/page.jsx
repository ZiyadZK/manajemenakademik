'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta } from "@/config/fonts"
import { formattedDateTime } from "@/lib/dateConvertes"
import { getAllRiwayat } from "@/lib/model/riwayatModel"
import { faEdit } from "@fortawesome/free-regular-svg-icons"
import { faArrowUp, faEllipsisH, faInfoCircle, faMinus, faPlus, faTable, faTimeline } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

const aksiIcon = {
    'Tambah': faPlus,
    'Hapus': faMinus,
    'Ubah': faEdit,
    'Naik Kelas': faArrowUp
}

const aksiColor = {
    'Tambah': 'green',
    'Hapus': 'red',
    'Ubah': 'amber',
    'Naik Kelas': 'blue'
}

export default function DataRiwayatPage() {

    const [dataRiwayat, setDataRiwayat] = useState([])
    const [filteredDataRiwayat, setFilteredDataRiwayat] = useState([])

    const [filterDataRiwayat, setFilterDataRiwayat] = useState({
        aksi: [], kategori: [], usernameOrName: ''
    })

    const getDataRiwayat = async () => {
        const responseData = await getAllRiwayat()
        if(responseData.success) {
            console.log(responseData.data)
            setDataRiwayat(responseData.data)
            setFilteredDataRiwayat(responseData.data)

        }
    }

    useEffect(() => {
        getDataRiwayat()
    }, [])

    return (
        <MainLayoutPage>
            <Toaster />
            <div className={`mt-3 ${jakarta.className}`}>
                <hr className="my-3 opacity-0" />
                <div className="w-full md:w-1/2 space-y-3">
                    <div className="flex md:items-center flex-col md:flex-row">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Pilih Aksi
                        </p>
                        <div className="flex items-center gap-2 w-full md:w-3/5">
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium">
                                Tambah
                            </button>
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium">
                                Hapus
                            </button>
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium">
                                Ubah
                            </button>
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Pilih Kategori Data
                        </p>
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium flex-shrink-0">
                                Siswa
                            </button>
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium flex-shrink-0">
                                Mutasi Siswa
                            </button>
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium flex-shrink-0">
                                Alumni
                            </button>
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium flex-shrink-0">
                                Pegawai
                            </button>
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium flex-shrink-0">
                                Ijazah
                            </button>
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium flex-shrink-0">
                                Kelas
                            </button>
                            <button type="button" className="px-3 py-2 rounded border text-sm font-medium flex-shrink-0">
                                Akun
                            </button>
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Cari Nama
                        </p>
                        <input type="text" className="px-3 py-2 rounded text-sm border w-full md:w-3/5" placeholder="Cari di sini" />
                    </div>
                </div>
                <hr className="my-2" />
                <div className="grid grid-cols-12 w-full  bg-blue-500 *:px-2 *:py-3 text-white text-sm">
                    <div className="hidden md:block items-center gap-3 col-span-1 place-items-center">
                        Tanggal, Waktu
                    </div>
                    <div className="hidden md:block items-center col-span-1">
                        Aksi
                    </div>
                    <div className="hidden md:flex items-center gap-3 col-span-1">
                        Kategori
                    </div>
                    <div className="hidden md:flex items-center col-span-4">
                        Keterangan
                    </div>
                    <div className="flex items-center md:col-span-2 col-span-8">
                        Nama
                    </div>
                    <div className="col-span-2 hidden md:flex items-center">
                        Email
                    </div>
                    <div className="col-span-1 hidden md:flex items-center">
                        Records
                    </div>
                    <div className="md:col-span-1 md:hidden block col-span-4">Detail</div>
                </div>
                <div className="divide-y relative overflow-auto w-full max-h-[600px]">                    
                    {filteredDataRiwayat.map(data => (
                        <div className="grid grid-cols-12 w-full divide-x *:px-2 *:py-3 text-zinc-600 text-sm">
                            <div className="col-span-1 hidden md:block">
                                <p>{data.tanggal}</p>
                                <p className="text-xs">{data.waktu}</p>
                            </div>
                            <div className="col-span-1 hidden md:block">
                                <div className={`flex items-center rounded-full px-2 py-1 text-xs w-fit bg-${aksiColor[data.aksi]}-100 text-${aksiColor[data.aksi]}-600 gap-2`}>
                                    <FontAwesomeIcon icon={aksiIcon[data.aksi]} className="w-2 h-2 text-inherit" />
                                    {data.aksi}
                                </div>
                            </div>
                            <div className="col-span-1 hidden md:block">
                                <div className="px-2 py-1 text-xs font-medium text-zinc-700 w-fit rounded-full">
                                    {data.kategori}
                                </div>
                            </div>
                            <div className="col-span-4 text-zinc-700 text-sm hidden md:block">
                                {data.keterangan}
                            </div>
                            <div className="md:col-span-2 col-span-8 text-zinc-700 text-sm ">
                                <p>{data.nama}</p>
                            </div>
                            <div className="col-span-2 text-zinc-700 text-sm hidden md:flex">
                                {data.email}
                            </div>
                            <div className="col-span-1 hidden md:flex">
                                <button type="button"  className="px-2 py-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 flex items-center justify-center gap-3 text-xs rounded-full">
                                    <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-inherit" />
                                    Lihat Data
                                </button>
                            </div>
                            <div className="md:col-span-1 md:hidden block col-span-4">
                                <button type="button" onClick={() => document.getElementById(`detail_modal_${data.id_riwayat}`).showModal()} className="px-2 py-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 flex items-center justify-center gap-3 text-xs rounded-full">
                                    <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-inherit" />
                                    Detail
                                </button>
                                <dialog id={`detail_modal_${data.id_riwayat}`} className="modal">
                                    <div className="modal-box bg-white">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Detail</h3>
                                        <hr className="my-2 opacity-0" />
                                        <div className="space-y-4">
                                            <div className="space-y-0">
                                                <p className="text-xs opacity-60">Tanggal, Waktu</p>
                                                <p className="font-medium">{data.tanggal}, {data.waktu}</p>
                                            </div>
                                            <div className="space-y-0">
                                                <p className="text-xs opacity-60">Aksi</p>
                                                <div className={`flex items-center rounded-full px-2 py-1 text-xs w-fit bg-${aksiColor[data.aksi]}-100 text-${aksiColor[data.aksi]}-600 gap-2`}>
                                                    <FontAwesomeIcon icon={aksiIcon[data.aksi]} className="w-2 h-2 text-inherit" />
                                                    {data.aksi}
                                                </div>
                                            </div>
                                            <div className="space-y-0">
                                                <p className="text-xs opacity-60">Kategori</p>
                                                <div className=" text-xs font-medium text-zinc-700 w-fit rounded-full">
                                                    {data.kategori}
                                                </div>
                                            </div>
                                            <div className="space-y-0">
                                                <p className="text-xs opacity-60">Keterangan</p>
                                                <div className=" text-xs text-zinc-700 w-fit rounded-full">
                                                    {data.keterangan}
                                                </div>
                                            </div>
                                            <div className="space-y-0">
                                                <p className="text-xs opacity-60">Email</p>
                                                <div className=" text-xs font-medium text-zinc-700 w-fit rounded-full">
                                                    {data.email}
                                                </div>
                                            </div>
                                            <div className="space-y-0">
                                                <p className="text-xs opacity-60">Records</p>
                                                <button type="button"  className="px-2 py-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 flex items-center justify-center gap-3 text-xs rounded-full">
                                                    <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-inherit" />
                                                    Lihat Data
                                                </button>
                                            </div>
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