'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta } from "@/config/fonts"
import { formattedDateTime } from "@/lib/dateConvertes"
import { getAllRiwayat } from "@/lib/model/riwayatModel"
import { faEdit } from "@fortawesome/free-regular-svg-icons"
import { faArrowUp, faEllipsisH, faExclamationCircle, faInfoCircle, faMinus, faPlus, faTable, faTimeline } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
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

    const router = useRouter()

    const [dataRiwayat, setDataRiwayat] = useState([])
    const [filteredDataRiwayat, setFilteredDataRiwayat] = useState([])

    const [loadingFetch, setLoadingFetch] = useState('')

    const [filterDataRiwayat, setFilterDataRiwayat] = useState({
        aksi: [], kategori: [], usernameOrName: ''
    })

    const getDataRiwayat = async () => {
        const responseData = await getAllRiwayat()
        if(responseData.success) {
            setDataRiwayat(responseData.data)
            setFilteredDataRiwayat(responseData.data)

        }
        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getDataRiwayat()
    }, [])

    const changeFilterRiwayat = (field, value) => {
        // Create a shallow copy of the filterKelas object
        let updatedFilter = { ...filterDataRiwayat };
    
        if (Array.isArray(filterDataRiwayat[field])) {
            if (updatedFilter[field].includes(value)) {
                // Create a new array without the value
                updatedFilter[field] = updatedFilter[field].filter(item => item !== value);
            } else {
                // Create a new array with the value added
                updatedFilter[field].push(value);
            }
        } else {
            // Directly assign the value if it's not an array
            updatedFilter[field] = value;
        }
    
        setFilterDataRiwayat(updatedFilter)
    };

    const submitFilterDataRiwayat =  () => {
        let updatedData = dataRiwayat

        if(filterDataRiwayat['aksi'].length > 0) {
            updatedData = updatedData.filter(data => filterDataRiwayat['aksi'].includes(data['aksi']))
        }

        if(filterDataRiwayat['kategori'].length > 0) {
            updatedData = updatedData.filter(data => filterDataRiwayat['kategori'].includes(data['kategori']))
        }

        if(filterDataRiwayat['usernameOrName'] !== '') {
            updatedData = updatedData.filter(data => 
                data['nama'].toLowerCase().includes(filterDataRiwayat['usernameOrName'].toLowerCase()) ||
                data['email'].toLowerCase().includes(filterDataRiwayat['usernameOrName'].toLowerCase())
            )
        }

        setFilteredDataRiwayat(updatedData)
    }

    useEffect(() => {
        submitFilterDataRiwayat()
    }, [filterDataRiwayat])

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
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            <button type="button" onClick={() => changeFilterRiwayat('aksi', 'Tambah')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['aksi'].includes('Tambah') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Tambah
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('aksi', 'Hapus')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['aksi'].includes('Hapus') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Hapus
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('aksi', 'Ubah')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['aksi'].includes('Ubah') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Ubah
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('aksi', 'Naik Kelas')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['aksi'].includes('Naik Kelas') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Naik Kelas
                            </button>
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Pilih Kategori Data
                        </p>
                        <div className="flex items-center gap-2  relative overflow-auto w-full md:w-3/5">
                            <button type="button" onClick={() => changeFilterRiwayat('kategori', 'Data Siswa')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['kategori'].includes('Data Siswa') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Siswa
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('kategori', 'Data Mutasi Siswa')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['kategori'].includes('Data Mutasi Siswa') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Mutasi Siswa
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('kategori', 'Data Alumni')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['kategori'].includes('Data Alumni') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Alumni
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('kategori', 'Data Pegawai')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['kategori'].includes('Data Pegawai') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Pegawai
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('kategori', 'Data Ijazah')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['kategori'].includes('Data Ijazah') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Ijazah
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('kategori', 'Data Kelas')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['kategori'].includes('Data Kelas') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Kelas
                            </button>
                            <button type="button" onClick={() => changeFilterRiwayat('kategori', 'Data Akun')} className={`px-3 py-2 rounded border text-sm font-medium flex-shrink-0 ${filterDataRiwayat['kategori'].includes('Data Akun') ? 'text-blue-500 hover:text-blue-700 bg-blue-50 border-blue-500' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                Akun
                            </button>
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row">
                        <p className="font-medium opacity-50 text-xs md:text-sm w-full md:w-2/5">
                            Cari Nama
                        </p>
                        <input type="text" value={filterDataRiwayat['usernameOrName']} onChange={e => changeFilterRiwayat('usernameOrName', e.target.value)} className="px-3 py-2 bg-white rounded text-sm border w-full md:w-3/5" placeholder="Cari di sini" />
                    </div>
                </div>
                <hr className="my-2" />
                <div className="grid grid-cols-12 w-full  bg-blue-500 *:px-2 *:py-3 text-white text-sm">
                    <div className="hidden md:block items-center gap-3 col-span-1 place-items-center">
                        Tanggal, Waktu
                    </div>
                    <div className="hidden md:flex items-center col-span-1">
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
                {loadingFetch !== 'fetched' && (
                    <div className="flex justify-center w-full items-center gap-5 py-5 text-blue-600/50">
                        <span className="loading loading-spinner loading-md "></span>
                        Sedang mendapatkan data
                    </div>
                )}
                {loadingFetch === 'fetched' && dataRiwayat.length < 1 && (
                    <div className="flex justify-center w-full items-center gap-5 py-5 text-zinc-600/50">
                        <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-inherit" />
                        Data Kosong
                    </div>
                )}
                <div className="divide-y relative overflow-auto w-full max-h-[600px]">                    
                    {filteredDataRiwayat.map((data, index) => (
                        <div key={index} className="grid grid-cols-12 w-full divide-x *:px-2 *:py-3 text-zinc-600 text-sm">
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
                                <button type="button" onClick={() => router.push(`/data/riwayat/detail/${data.id_riwayat}`)}  className="px-2 py-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 flex items-center justify-center gap-3 text-xs rounded-full">
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
                                                <button type="button" onClick={() => router.push(`/data/riwayat/detail/${data.id_riwayat}`)}  className="px-2 py-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 flex items-center justify-center gap-3 text-xs rounded-full">
                                                    <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-inherit" />
                                                    Lihat Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </dialog>
                            </div>
                        </div>
                    )).reverse()}
                </div>
            </div>
        </MainLayoutPage>
    )
}