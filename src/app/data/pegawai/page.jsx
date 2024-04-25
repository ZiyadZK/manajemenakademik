'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, rale } from "@/config/fonts"
import { deleteManyPegawai, deleteSinglePegawai, getAllPegawai } from "@/lib/model/pegawaiModel"
import { faAngleLeft, faAngleRight, faArrowDown, faArrowUp, faArrowsUpDown, faDownload, faEdit, faEllipsisH, faEllipsisV, faExclamationCircle, faFile, faFilter, faPlus, faPlusSquare, faPrint, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const mySwal = withReactContent(Swal)

export default function DataPegawaiPage () {

    const router = useRouter()

    const [dataPegawai, setDataPegawai] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')
    const [filteredDataPegawai, setFilteredDataPegawai] = useState([])
    const [totalList, setTotalList] = useState(10)
    const [pagination, setPagination] = useState(1)
    const [filterJabatan, setFilterJabatan] = useState('')
    const [filterKepegawaian, setFilterKepegawaian] = useState('')
    const [filterPendidikan, setFilterPendidikan] = useState('')
    const [selectedPegawai, setSelectedPegawai] = useState([])
    const [filterSearch, setFilterSearch] = useState('')
    const [filterKriteria, setFilterKriteria] = useState('nama_pegawai')
    const [listJabatan, setListJabatan] = useState([])
    const [listStatusPegawai, setListStatusPegawai] = useState([])
    const [listPendidikanTerakhir, setListPendidikanTerakhir] = useState([])
    const [sortingNama, setSortingNama] = useState('');

    const getPegawai = async () => {
        setLoadingFetch('loading');
        const response = await getAllPegawai()
        if(response.success) {
            setDataPegawai(response.data)
            setFilteredDataPegawai(response.data)
            getListFilter(response.data)
        }
    }

    const getListFilter = dataArr => {
        // Jabatan
        let tempData = []
        dataArr.map(({jabatan}) => {
            if(!tempData.includes(jabatan)) {
                tempData.push(jabatan)
            }
        })
        setListJabatan(tempData)

        tempData = []
        dataArr.map(({status_kepegawaian}) => {
            if(!tempData.includes(status_kepegawaian)) {
                tempData.push(status_kepegawaian)
            }
        })
        setListStatusPegawai(tempData)

        tempData = []
        dataArr.map(({pendidikan_terakhir}) => {
            if(!tempData.includes(pendidikan_terakhir)) {
                tempData.push(pendidikan_terakhir)
            }
        })
        setListPendidikanTerakhir(tempData)
    }

    useEffect(() => { 
        getPegawai()
    }, [])

    const filterDataPegawai = () => {
        const updatedData = dataPegawai.filter(({jabatan, status_kepegawaian, pendidikan_terakhir, pensiun, nama_pegawai, nip, nuptk}) => 
            jabatan.includes(filterJabatan) && status_kepegawaian.includes(filterKepegawaian) && pendidikan_terakhir.includes(filterPendidikan)
            
        )
        setFilteredDataPegawai(updatedData)
    }

    useEffect(() => {
        filterDataPegawai()
    }, [filterJabatan, filterKepegawaian, filterPendidikan])

    const handleSelectedPegawai = (id_pegawai) => {
        if(selectedPegawai.includes(id_pegawai)) {
            const updatedData = selectedPegawai.filter(id => id !== id_pegawai)
            setSelectedPegawai(updatedData)
        }else{
            const updatedData = [...selectedPegawai, id_pegawai]
            setSelectedPegawai(updatedData)
        }
    }



    const deletePegawai = async id_pegawai => {
        mySwal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan menghapus data pegawai tersebut',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    text: 'Mohon tunggu sebentar',
                    allowOutsideClick: false,
                    timer: 1000
                })
                const response = await deleteSinglePegawai(id_pegawai);
                if(response.success) {
                    mySwal.fire({
                        title: 'Berhasil',
                        icon: 'success',
                        text: "Berhasil menghapus data pegawai tersebut!",
                        timer: 3000
                    }).then(async () => {
                        await getPegawai()
                    })
                }else{
                    mySwal.fire({
                        title: 'Gagal',
                        icon: 'error',
                        text: 'Tampaknya ada error disaat menghapus data pegawai tersebut!',
                        timer: 3000
                    })
                }
            }
        })
    }

    const deleteSelectedPegawai = async () => {
        mySwal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan menghapus data pegawai yang sudah dipilih',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    text: 'Mohon tunggu sebentar',
                    allowOutsideClick: false,
                    timer: 1000
                })
                const response = await deleteManyPegawai(selectedPegawai);
                if(response.success) {
                    mySwal.fire({
                        title: 'Berhasil',
                        icon: 'success',
                        text: "Berhasil menghapus data pegawai tersebut!",
                        timer: 3000
                    }).then(async () => {
                        setSelectedPegawai([])
                        await getPegawai()
                    })
                }else{
                    mySwal.fire({
                        title: 'Gagal',
                        icon: 'error',
                        text: 'Tampaknya ada error disaat menghapus data pegawai tersebut!',
                        timer: 3000
                    })
                }
            }
        })
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-3">
                <div className="flex items-center md:gap-5 w-full justify-center md:justify-start gap-2">
                    <a href="/data/pegawai/new" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-inherit" />
                        Tambah Data
                    </a>
                    <a href="/data/pegawai/new/import" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                        Import Data
                    </a>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="p-5 rounded-2xl bg-zinc-50 md:bg-zinc-100 text-zinc-800">
                    <div className="flex items-center gap-2 md:gap-5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-inherit" />
                        </div>
                        <h1 className="font-medium text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-900 to-zinc-800">Filterisasi Data</h1>
                    </div>
                    <hr className="my-1 opacity-0" />
                    <div className="flex md:flex-row flex-col gap-5">
                        <div className="w-full md:w-1/2 flex gap-2">
                            <select  className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                                <option value="" disabled >-- Jabatan --</option>
                                {listJabatan.map((jabatan, index) => (
                                    <option key={`${jabatan} - ${index}`} value={`${jabatan}`}>{jabatan}</option>
                                ))}
                                <option value="All">Semua</option>
                            </select>
                            <select  className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                                <option disabled>-- Status --</option>
                                {listStatusPegawai.map((statusPegawai, index) => (
                                    <option key={`${statusPegawai} - ${index}`} value={`${statusPegawai}`}>{statusPegawai}</option>
                                ))}
                                <option value="All">Semua</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 flex gap-2">
                            <select  className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                                <option disabled>-- Pendidikan --</option>
                                {listPendidikanTerakhir.map((pendidikan, index) => (
                                    <option key={`${pendidikan} - ${index}`} value={`${pendidikan}`}>{pendidikan}</option>
                                ))}
                                <option value="0">Semua</option>
                            </select>
                            <select  className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                                <option disabled>-- Status --</option>
                                <option value="aktif">Aktif</option>
                                <option value="tidak">Tidak Aktif</option>
                                <option value="">Semua</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <input type="text" className="w-full px-3 py-2 rounded-lg border transition-all duration-300 my-3 block md:hidden" placeholder="Cari data disini" />
            <div className="grid grid-cols-12 w-full mt-0 md:mt-3 bg-blue-500 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                    <input type="checkbox" name="" id="" />
                    Nama
                    <button type="button" className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sortingNama === '' ? faArrowsUpDown : (sortingNama === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Jabatan
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Status Kepegawaian
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    NIP / NUPTK
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <input type="text" className="w-full md:block hidden px-3 py-2 rounded-lg border transition-all duration-300 text-zinc-800 bg-white outline-none" placeholder="Cari data disini" />
                    <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit block md:hidden" />
                </div>
            </div>
            <div className={`${mont.className} divide-y relative w-full overflow-auto max-h-[400px] h-fit`}>
                {filteredDataPegawai.map((pegawai, index) => (
                    <div key={`${pegawai.id_pegawai} - ${index}`} className="grid grid-cols-12 w-full  *:px-2 *:py-3 text-zinc-700 text-xs hover:bg-zinc-50 ">
                        <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                            <input type="checkbox" name="" id="" />
                            {pegawai.nama_pegawai}
                        </div>
                        <div className="hidden md:flex items-center col-span-2">
                            {pegawai.jabatan}
                        </div>
                        <div className="hidden md:flex items-center col-span-2 gap-3">
                            {pegawai.status_kepegawaian}
                        </div>
                        <div className="hidden md:flex items-center col-span-2">
                            {pegawai.nip} / {pegawai.nuptk}
                        </div>
                        <div className="flex justify-center items-center col-span-4 md:col-span-2 gap-1 md:gap-3">
                            <button type="button"  className="w-6 h-6 bg-blue-400 hover:bg-blue-500 text-white flex  items-center justify-center">
                                <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button"  className="w-6 h-6 bg-red-400 hover:bg-red-500 text-white flex  items-center justify-center">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button"  className="w-6 h-6 bg-amber-400 hover:bg-amber-500 text-white flex  items-center justify-center">
                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </MainLayoutPage>
    )
}