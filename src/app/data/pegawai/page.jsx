'use client'

import MainLayoutPage from "@/components/mainLayout"
import { deleteManyPegawai, deleteSinglePegawai, getAllPegawai } from "@/lib/model/pegawaiModel"
import { faAngleLeft, faAngleRight, faEdit, faEllipsisH, faEllipsisV, faExclamationCircle, faPlusSquare, faPrint, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
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

    const getPegawai = async () => {
        setLoadingFetch('loading');
        const response = await getAllPegawai()
        if(response.success) {
            setDataPegawai(response.data)
            setFilteredDataPegawai(response.data)
        }
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
            <div className="p-5">
                <div className="p-5 rounded flex items-center justify-between w-full bg-zinc-100">
                    <div className="flex items-center gap-5">
                        <h1 className="text-xs text-white font-bold bg-zinc-800 rounded-full px-2 py-1">
                            Bagan Data Baru
                        </h1>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-zinc-600" />
                            <p className="text-xs">
                                Halaman ini hanya menampilkan data-data saja
                            </p>
                        </div>
                    </div>
                    <button type="button" onClick={() => router.push('/data/pegawai/new')} className="px-2 py-1 rounded bg-zinc-800 text-xs font-bold text-white flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-300">
                        <FontAwesomeIcon icon={faPlusSquare} className="w-3 h-3 text-inherit" />
                        Tambah Pegawai Baru
                    </button>
                </div>
                <div className="mt-3">
                    <h1 className="text-xs text-white font-bold bg-zinc-800 rounded-full px-2 py-1 w-fit">
                        Daftar Pegawai Tersedia
                    </h1>
                    <div className="flex justify-between items-center mt-3 w-full">
                        <div className="flex items-center gap-3">
                            <select value={filterJabatan} onChange={e => setFilterJabatan(e.target.value)} className="border rounded font-medium outline-none text-xs hover:border-zinc-800 focus:border-zinc-800 px-2 py-0.5 text-zinc-800 cursor-pointer">
                                <option value="" disabled>-- Jabatan --</option>
                                <option value="Kepala Sekolah">Kepala Sekolah</option>
                                <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                                <option value="Guru">Guru</option>
                                <option value="Karyawan">Karyawan</option>
                                <option value="">Semua</option>
                            </select>
                            <select value={filterKepegawaian} onChange={e => setFilterKepegawaian(e.target.value)} className="border rounded font-medium outline-none text-xs hover:border-zinc-800 focus:border-zinc-800 px-2 py-0.5 text-zinc-800 cursor-pointer">
                                <option value="" disabled>-- Kepegawaian --</option>
                                <option value="PNS">PNS</option>
                                <option value="PPPK">PPPK</option>
                                <option value="HONDA">HONDA</option>
                                <option value="HONKOM">HONKOM</option>
                                <option value="">Semua</option>
                            </select>
                            <select value={filterPendidikan} onChange={e => setFilterPendidikan(e.target.value)} className="border rounded font-medium outline-none text-xs hover:border-zinc-800 focus:border-zinc-800 px-2 py-0.5 text-zinc-800 cursor-pointer">
                                <option value="" disabled>-- Pendidikan Terakhir --</option>
                                <option value="SMP/SLTA/MTS">SMP/SLTA/MTS</option>
                                <option value="SMA/MA/SMK/MK">SMA/MA/SMK/MK</option>
                                <option value="D2">D2</option>
                                <option value="D3">D3</option>
                                <option value="D4">D4</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="">Semua</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <input onChange={e => setFilterSearch(e.target.value)} type="text" className="border rounded font-medium outline-none text-xs hover:border-zinc-800 focus:border-zinc-800 px-2 py-0.5 text-zinc-800" placeholder="Cari data di sini" />
                            <select value={filterKriteria} onChange={e => setFilterKriteria(e.target.value)} className="border rounded font-medium outline-none text-xs hover:border-zinc-800 focus:border-zinc-800 px-2 py-0.5 text-zinc-800 cursor-pointer">
                                <option value="" disabled>-- Kriteria --</option>
                                <option value="nama_pegawai">Nama</option>
                                <option value="nip">NIP</option>
                                <option value="nuptk">NUPTK</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 px-3 py-2 rounded bg-zinc-800 text-sm font-bold text-white mt-3 sticky top-0">
                        <div className="col-span-3 flex items-center gap-2">
                            <input type="checkbox" name="" id="" />
                            Nama
                        </div>
                        <div className="col-span-2">
                            Jabatan
                        </div>
                        <div className="col-span-2">
                            Kepegawaian
                        </div>
                        <div className="col-span-2">
                            NIP
                        </div>
                        <div className="col-span-2">
                            NUPTK
                        </div>
                        <div className="col-span-1 flex justify-center items-center">
                            <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="divide-y-2 my-0.5">
                        {filteredDataPegawai.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((pegawai, index) => (
                            <div key={index} className="grid grid-cols-12 px-3 py-2 hover:bg-zinc-50 text-xs font-medium text-zinc-800 odd:bg-zinc-100">
                                <div className="col-span-3 flex items-center gap-2">
                                    <input type="checkbox" checked={selectedPegawai.includes(pegawai.id_pegawai)} onChange={() => handleSelectedPegawai(pegawai.id_pegawai)} className="cursor-pointer" />
                                    {pegawai.nama_pegawai}
                                </div>
                                <div className="col-span-2">
                                    {pegawai.jabatan}
                                </div>
                                <div className="col-span-2">
                                    {pegawai.status_kepegawaian}
                                </div>
                                <div className="col-span-2">
                                    {pegawai.nip}
                                </div>
                                <div className="col-span-2">
                                    {pegawai.nuptk}
                                </div>
                                <div className="col-span-1 flex justify-center items-center gap-1">
                                    <button type="button" className="w-5 h-5 flex items-center justify-center rounded bg-blue-500 hover:bg-blue-400 focus:bg-blue-700 text-zinc-800">
                                        <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <button type="button" className="w-5 h-5 flex items-center justify-center rounded bg-orange-500 hover:bg-orange-400 focus:bg-orange-700 text-zinc-800">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <button type="button" onClick={() => deletePegawai(pegawai.id_pegawai)} className="w-5 h-5 flex items-center justify-center rounded bg-red-500 hover:bg-red-400 focus:bg-red-700 text-zinc-800">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-3 py-2 rounded bg-zinc-800 flex w-full justify-between items-center sticky bottom-0 text-xs">
                        <div className="flex items-center gap-5">
                            <p className="text-white"><b>{selectedPegawai.length}</b> Item terpilih</p>
                            {selectedPegawai.length > 0 && (
                                <button type="button" onClick={() => deleteSelectedPegawai()} className="w-6 h-6 bg-red-600 rounded text-zinc-800 hover:bg-red-400 focus:bg-red-700 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2 text-white">
                            <div className="flex items-center gap-5">
                                <p className="text-xs text-white">
                                    Total <b>{dataPegawai.length}</b> items
                                </p>
                                <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-300">
                                    <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                                </button>
                                <p>
                                    {pagination}
                                </p>
                                <button type="button" onClick={() => setPagination(state => state = state + 1)}  className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-300">
                                    <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <select value={totalList} onChange={e => setTotalList(e.target.value)} className="py-1 px-2 rounded outline-none border bg-zinc-700 cursor-pointer">
                                <option value={10}>10 Data</option>
                                <option value={30}>30 Data</option>
                                <option value={50}>50 Data</option>
                                <option value={100}>100 Data</option>
                                <option value={dataPegawai.length}>Semua Data</option>
                            </select>
                            <div className="relative">
                                <button type="button" className="px-2 py-1 rounded bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 font-bold peer flex items-center justify-center text-xs gap-3">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                    Export as CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}