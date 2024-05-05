'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, rale } from "@/config/fonts"
import { getAllIjazah } from "@/lib/model/ijazahModel"
import { faAngleLeft, faAngleRight, faArrowDown, faArrowUp, faArrowsUpDown, faCircleCheck, faCircleXmark, faDownload, faEdit, faEllipsisH, faEye, faFile, faFilter, faPlus, faPrint, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

export default function DataIjazahPage() {
    const [filterSearch, setFilterSearch] = useState('')
    const [sorting, setSorting] = useState({nama_siswa: '', tahun_lulus: '', tgl_diambil: ''})
    const router = useRouter()
    const [dataIjazah, setDataIjazah] = useState([])
    const [filteredDataIjazah, setFilteredDataIjazah] = useState([])
    const [selectedDataIjazah, setSelectedDataIjazah] = useState([])
    const [showSelected, setShowSelected] = useState(false)
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)

    const getDataIjazah = async () => {
        const response = await getAllIjazah()
        if(response.success) {
            setDataIjazah(response.data)
            setFilteredDataIjazah(response.data)
        }
    }

    useEffect(() => {
        getDataIjazah()
    }, [])

    const handleTotalList = (value) => {
        // Cek kalau totalList melebihi Math Ceil
        const maxPagination = Math.ceil(dataIjazah.length / value)
        if(pagination > maxPagination) {
            setPagination(state => state = maxPagination)
        }
        setTotalList(value)
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-3">
                <div className="flex items-center md:gap-5 w-full justify-center md:justify-start gap-2">
                    <button type="button" onClick={() => router.push('/data/ijazah/new')} className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-inherit" />
                        Tambah Data
                    </button>
                    <button type="button" onClick={() => router.push('/data/ijazah/new/import')} className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                        Import Data
                    </button>
                </div>
                <hr className="my-3 opacity-0" />
                <div className="p-5 rounded-2xl bg-zinc-50  text-zinc-800">
                    <div className="flex items-center gap-2 md:gap-5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-inherit" />
                        </div>
                        <h1 className="font-medium text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-900 to-zinc-800">Filterisasi Data</h1>
                    </div>
                    <hr className="my-1 opacity-0" />
                    <div className="flex md:flex-row flex-col gap-5">
                        
                    </div>
                </div>
            </div>
            <hr className="my-2 opacity-0" />
            <input type="text" onChange={e => setFilterSearch(e.target.value)} className="bg-white w-full px-3 py-2 rounded-lg border transition-all duration-300 my-3 block md:hidden" placeholder="Cari data disini" />
            <div className="grid grid-cols-12 w-full mt-0 md:mt-3 bg-blue-500 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-3 place-items-center">
                    <input type="checkbox" name="" id="" />
                    Nama
                    <button type="button" className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting['nama_siswa'] === '' ? faArrowsUpDown : (sorting['nama_siswa'] === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center ">
                    Kelas
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Tanggal di Ambil
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Tahun Lulus
                    <button type="button" className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting['tahun_lulus'] === '' ? faArrowsUpDown : (sorting['tahun_lulus'] === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Sudah di Ambil
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <input type="text" onChange={e => setFilterSearch(e.target.value)} className="w-full md:block hidden px-3 py-2 rounded-lg border transition-all duration-300 text-zinc-800 bg-white outline-none" placeholder="Cari data disini" />
                    <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit block md:hidden" />
                </div>
            </div>
            <div className={`divide-y relative w-full max-h-[300px] overflow-auto ${mont.className}`}>
                {filteredDataIjazah.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((ijazah, index) => (
                    <div key={`${ijazah.nisn} - ${index}`} className="grid grid-cols-12 w-full  hover:bg-zinc-100 *:px-2 *:py-3 text-zinc-800 font-medium text-xs divide-x">
                        <div className="flex items-center gap-3 col-span-8 md:col-span-3">
                            <input type="checkbox" />
                            {ijazah.nama_lulusan}
                        </div>
                        <div className="hidden md:flex items-center">
                            {ijazah.kelas} {ijazah.rombel} {ijazah.no_rombel}
                        </div>
                        <div className="hidden md:flex items-center col-span-2 gap-3">
                            {ijazah.tgl_diambil || '-'}
                        </div>
                        <div className="hidden md:flex items-center col-span-2 gap-3">
                            {ijazah.tahun_lulus}
                        </div>
                        <div className="hidden md:flex items-center col-span-2 gap-2">
                            <button type="button" disabled={ijazah.status === 'sudah diambil'} className={`px-2  py-1 rounded-full ${ijazah.status === 'sudah diambil' ? 'bg-green-600' : 'bg-green-600/50 hover:bg-green-600'}  text-white flex items-center gap-2 w-fit`}>
                                <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                Ya
                            </button>
                            <button type="button" disabled={ijazah.status === 'belum diambil'} className={`px-2 py-1 rounded-full ${ijazah.status === 'belum diambil' ? 'bg-red-500' : 'bg-red-500/50 hover:bg-red-500'} text-white flex items-center gap-2 w-fit`}>
                                <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                Belum
                            </button>
                        </div>
                        <div className="flex justify-center items-center col-span-4 md:col-span-2 gap-2">
                            <a href={`/data/siswa/nis/`} className="w-6 h-6 flex items-center justify-center  text-white bg-blue-600 hover:bg-blue-800" title="Informasi lebih lanjut">
                                <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            </a>
                            <button type="button" className="w-6 h-6 flex items-center justify-center  text-white bg-red-600 hover:bg-red-800" title="Hapus data ini?">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                            <a href={`/data/siswa/update/`} className="w-6 h-6 flex items-center justify-center  text-white bg-amber-600 hover:bg-amber-800" title="Ubah data ini">
                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex md:items-center md:justify-between px-2 py-1 flex-col md:flex-row border-y border-zinc-300">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">
                            {selectedDataIjazah.length} Data terpilih
                        </p>
                        <button type="button" className={`w-7 h-7 ${selectedDataIjazah && selectedDataIjazah.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 focus:bg-red-200 focus:text-red-700`}>
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                        </button>
                        <button type="button" onClick={() => setShowSelected(state => !state)} className={`w-7 h-7 flex items-center justify-center rounded-lg   ${showSelected ? 'bg-blue-200 text-blue-700 hover:bg-blue-300' : 'text-zinc-500 bg-zinc-100 hover:bg-zinc-200'} group transition-all duration-300`}>
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                        <button type="button" onClick={() => setSelectedDataIjazah([])} className={`w-7 h-7 ${selectedDataIjazah && selectedDataIjazah.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg  group transition-all duration-300 bg-zinc-100 hover:bg-zinc-200`}>
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                    </div>
                    <div className=" dropdown dropdown-hover dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="px-3 py-1 rounded bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center text-xs gap-2">
                            <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                            Export
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-fit">
                            <li>
                                <button type="button" className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-red-600" />
                                    PDF
                                </button>
                                <button type="button" className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    XLSX
                                </button>
                                <button type="button" className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    CSV
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-full md:w-fit flex items-center justify-center divide-x mt-2 md:mt-0">
                    <p className={`${mont.className} px-2 text-xs`}>
                        {(totalList * pagination) - totalList + 1} - {(totalList * pagination) > dataIjazah.length ? dataIjazah.length : totalList * pagination} dari {dataIjazah.length} data
                    </p>
                    <div className={`${mont.className} px-2 text-xs flex items-center justify-center gap-3`}>
                        <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                        </button>
                        <p className="font-medium text-zinc-600">
                            {pagination}
                        </p>
                        <button type="button" onClick={() => setPagination(state => state < Math.ceil(dataIjazah.length / totalList) ? state + 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>
                    <div className={`${mont.className} px-2 text-xs`}>
                        <select  value={totalList} onChange={e => handleTotalList(e.target.value)} className="cursor-pointer px-2 py-1 hover:bg-zinc-100 rounded bg-transparent">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}