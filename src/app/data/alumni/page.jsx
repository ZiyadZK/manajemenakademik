'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, open, rale } from "@/config/fonts"
import { model_deleteAlumni, model_getAllAlumni, model_updateAlumni } from "@/lib/model/alumniModel"
import { faAngleDoubleUp, faAngleLeft, faAngleRight, faAngleUp, faAnglesUp, faArrowDown, faArrowUp, faArrowsUpDown, faCircle, faCircleArrowDown, faCircleArrowUp, faCircleCheck, faClockRotateLeft, faDownload, faEdit, faEllipsis, faEllipsisH, faExclamationCircle, faEye, faFile, faFilter, faInfoCircle, faMale, faPlus, faPlusSquare, faPrint, faSave, faSearch, faSpinner, faTrash, faUpload, faWandMagicSparkles, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

let listNoRombel = [];
let listKelas = []
let listRombel = []

const mySwal = withReactContent(Swal)
export default function DataAlumniMainPage() {
    const router = useRouter();
    const [siswaList, setSiswaList] = useState([])
    const [filteredSiswaList, setFilteredSiswaList] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')
    const [kelas, setKelas] = useState('')
    const [rombel, setRombel] = useState('')
    const [noRombel, setNoRombel] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [searchCriteria, setSearchCriteria] = useState('nama_siswa')
    const [selectedSiswa, setSelectedSiswa] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [showSelected, setShowSelected] = useState(false)
    const [sorting, setSorting] = useState({nama_siswa: '', tahun_masuk: ''})

    const getSiswa = async () => {
        setLoadingFetch('loading');
        const response = await model_getAllAlumni()
        if(response.success) {

            setSiswaList(response.data)
            setFilteredSiswaList(response.data)
            
            // Get all No Rombel
            response.data.filter(({no_rombel}) => {
                if(!listNoRombel.includes(no_rombel)) {
                    listNoRombel.push(no_rombel)
                }
            })
    
            // Get all Kelas
            response.data.filter(({kelas}) => {
                if(!listKelas.includes(kelas)) {
                    listKelas.push(kelas)
                }
            })
    
            // Get all rombel
            response.data.filter(({rombel}) => {
                if(!listRombel.includes(rombel)) {
                    listRombel.push(rombel)
                }
            })
        }

        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getSiswa()
    }, [])

    const handleSelectedSiswa = (nis) => {
        if(!selectedSiswa.includes(nis)){
            const newData = [...selectedSiswa, nis]
            setSelectedSiswa(newData)
        }else{
            const newData = selectedSiswa.filter(item => item !== nis);
            setSelectedSiswa(newData)
        }
    }

    const handleSubmitFilter = () => {
        let updatedFilter = siswaList
        
        // Search Kelas
        if(kelas !== '') {
            updatedFilter = updatedFilter.filter(siswa => siswa.kelas == kelas)
        }

        // Search Rombel
        updatedFilter = updatedFilter.filter(siswa => siswa.rombel.toLowerCase().includes(rombel.toLowerCase()))

        // Search NO Rombel
        updatedFilter = updatedFilter.filter(siswa => siswa.no_rombel.toLowerCase().includes(noRombel.toLowerCase()))
        
        
        // Search Value and Kriteria
        updatedFilter = updatedFilter.filter(siswa => siswa[searchCriteria].toLowerCase().includes(searchValue.toLowerCase()))

        // Search Only Selected
        if(showSelected) {
            updatedFilter = updatedFilter.filter(siswa => selectedSiswa.includes(siswa.nis))
            const maxPagination = Math.ceil(updatedFilter.length / totalList)
            setPagination(maxPagination > 0 ? maxPagination - maxPagination + 1 : 1)
        }
        
        let sortedFilter = [];
        // Sorting
        if(sorting.nama_siswa !== '') {
            sortedFilter = updatedFilter.sort((a, b) => {
                if(sorting.nama_siswa === 'asc') {
                    if (a.nama_siswa < b.nama_siswa) return -1;
                    if (a.nama_siswa > b.nama_siswa) return 1;
                    return 0;
                }
                
                if(sorting.nama_siswa === 'dsc') {
                    if (a.nama_siswa < b.nama_siswa) return 1;
                    if (a.nama_siswa > b.nama_siswa) return -1;
                    return 0;
                }
            })
        }

        if(sorting.tahun_masuk !== '') {
            sortedFilter = updatedFilter.sort((a, b) => {
                if(sorting.tahun_masuk === 'asc') {
                    if (a.tahun_masuk < b.tahun_masuk) return -1;
                    if (a.tahun_masuk > b.tahun_masuk) return 1;
                    return 0;
                }
                
                if(sorting.tahun_masuk === 'dsc') {
                    if (a.tahun_masuk < b.tahun_masuk) return 1;
                    if (a.tahun_masuk > b.tahun_masuk) return -1;
                    return 0;
                }
            })
        }

        updatedFilter = sortedFilter.length > 0 ? sortedFilter : updatedFilter

        setFilteredSiswaList(updatedFilter)
    }

    const handleSelectAll = () => {
        if(selectAll) {
            setSelectAll(false)
            return setSelectedSiswa([])
        }else{
            setSelectAll(true)
            const filteredSiswa = filteredSiswaList.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map(({nis}) => nis)
            return setSelectedSiswa(filteredSiswa)
        }
    }

    

    useEffect(() => {
        handleSubmitFilter()
    }, [kelas, rombel, noRombel, searchValue, searchCriteria, showSelected, sorting])

    const deleteSingle = async (nis) => {
        mySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menghapus data tersebut!',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 10000,
                    didOpen: async () => {
                        const response = await model_deleteAlumni([nis])
                        if(response.success) {
                            await getSiswa()
                            mySwal.fire({
                                icon: 'success',
                                title: 'Berhasil memproses data!',
                                text: 'Anda berhasil menghapus data tersebut',
                                timer: 2000
                            })
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                title: 'Gagal memproses data!',
                                text: 'Tampaknya terdapat error, silahkan coba beberapa saat lagi!',
                                timer: 2000
                            })
                        }
                    }
                })
            }
        })
    }

    const deleteSelectedSiswa = () => {
        mySwal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan menghapus beberapa siswa yang sudah di seleksi',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya',
            allowOutsideClick: false
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 10000,
                    didOpen: async () => {
                        const response = await model_deleteAlumni(selectedSiswa)
                        if(response.success) {
                            setSelectedSiswa(state => ([]))
                            mySwal.fire({
                                icon: 'success',
                                title: 'Berhasil memproses data!',
                                timer: 2000,
                            }).finally(async () => {
                                await getSiswa()
                            })
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                title: 'Gagal memproses data!',
                                timer: 2000
                            })
                        }
                    }
                })
            }
        })
    }

    const handleTotalList = (value) => {
        // Cek kalau totalList melebihi Math Ceil
        const maxPagination = Math.ceil(siswaList.length / value)
        if(pagination > maxPagination) {
            setPagination(state => state = maxPagination)
        }
        setTotalList(value)
    }

    const submitUpdateBersama = (e) => {
        e.preventDefault()

        const data = {
            kelas: e.target[0].value,
            no_rombel: e.target[1].value,
            tahun_masuk: e.target[2].value,
            rombel: e.target[3].value,
            status: e.target[4].value
        }
        
        const dataKeys = Object.keys(data)
        const newData = {}
        dataKeys.map(key => {
            if(data[key] !== '') {
                newData[key] = data[key]
            }
        })
        console.log(newData)

        mySwal.fire({
            title: 'Apakah anda yakin?',
            text: `Anda akan mengubah data sebanyak ${selectedSiswa.length} dengan data yang sama`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    text: 'Mohon tunggu sebentar lagi',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 15000,
                    didOpen: async () => {
                        const response = await model_updateAlumni(selectedSiswa, newData)
                        if(response.success) {
                            mySwal.fire({
                                icon: 'success',
                                text: 'Berhasil mengubah data tersebut!',
                                title: 'Sukses'
                            }).then(() => {
                                setSelectedSiswa([])
                                getSiswa()
                            })
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                text: 'Gagal mengubah data tersebut, terdapat error!',
                                title: 'Error'
                            })
                        }
                    }
                })
            }
        })
        
    }

    const handleSorting = (key, otherKey) => {
        if(sorting[key] === '') {  
            return setSorting(state => ({...state, [key]: 'asc', [otherKey]: ''}))
        }
        if(sorting[key] === 'asc') {
            return setSorting(state => ({...state, [key]: 'dsc', [otherKey]: ''}))
        }
        if(sorting[key] === 'dsc') {
            return setSorting(state => ({...state, [key]: '', [otherKey]: ''}))
        }
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <hr className="my-1 md:my-2 opacity-0" />
            <div className="flex items-center md:gap-5 w-full justify-center md:justify-start gap-2">
                <a href="/data/alumni/new" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-inherit" />
                    Tambah Data
                </a>
                <a href="/data/alumni/new/import" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                    <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                    Import Data
                </a>
            </div>
            <hr className="my-1 md:my-2 opacity-0" />
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
                        <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                            {listKelas.map((kelasItem, index) => (
                                <option key={index} value={kelasItem}>{kelasItem}</option>
                            ))}
                            <option value="">Semua Kelas</option>
                        </select>
                        <select value={rombel} onChange={e => setRombel(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                            {listRombel.map((namaRombel, index) => (
                                <option key={index} value={namaRombel}>{namaRombel}</option>
                            ))}
                            <option value="">Semua Rombel</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/2 flex gap-2">
                        <select value={noRombel} onChange={e => setNoRombel(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                            {listNoRombel.map((no_rombel, index) => (
                                <option key={index} value={no_rombel}>{no_rombel}</option>
                            ))}
                            <option value="">Semua No Rombel</option>
                        </select>
                        
                    </div>
                </div>
            </div>
            <hr className="my-2 opacity-0" />
            <div className="flex items-center gap-5 w-full">
                <input type="text" onChange={e => setSearchValue(e.target.value)} className=" bg-zinc-100 flex-grow md:flex-grow-0 md:w-80 px-3 py-2 text-xs md:text-lg rounded-xl border bg-transparent" placeholder="Cari data anda disini" />
                <select value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)}  className=" px-3 py-2 rounded-xl border text-xs md:text-lg bg-white  cursor-pointer">
                    <option disabled>-- Kriteria --</option>
                    <option value="nama_siswa">Nama</option>
                    <option value="nisn">NISN</option>
                    <option value="nis">NIS</option>
                </select>
            </div>
            <hr className="my-2 opacity-0" />

            <div className="grid grid-cols-12 w-full  bg-blue-500 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                    <input type="checkbox" name="" id="" />
                    Nama
                    <button type="button" onClick={() => handleSorting('nama_siswa', 'tahun_masuk')} className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting.nama_siswa === '' ? faArrowsUpDown : (sorting.nama_siswa === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Kelas
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Tahun Masuk
                    <button type="button" onClick={() => handleSorting('tahun_masuk', 'nama_siswa')} className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting.tahun_masuk === '' ? faArrowsUpDown : (sorting.tahun_masuk === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    NIS/NISN
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit" />
                </div>
            </div>
            
            {loadingFetch === '' && <LoadingFetchSkeleton />}
            {loadingFetch === 'loading' && (
                <div className="flex w-full justify-center items-center gap-2 my-3">
                    <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 text-zinc-400 animate-spin" />
                    <h1 className="text-zinc-400">Sedang mendapatkan data..</h1>
                </div>
            )}

            {loadingFetch === 'fetched' && (siswaList.length > 0 ? (
                <div className="relative w-full h-fit max-h-[300px] overflow-auto">
                    <div className="divide-y">
                        {filteredSiswaList.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((siswa) => (
                            <div key={siswa.nis} className="grid grid-cols-12 w-full  hover:bg-zinc-100 *:px-2 *:py-3 text-zinc-800 font-medium text-xs divide-x">
                                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                                    <div className="flex-grow flex items-center gap-2">
                                        <input type="checkbox" checked={selectedSiswa.includes(siswa.nis) ? true : false} onChange={() => handleSelectedSiswa(siswa.nis)} />
                                        {siswa.nama_siswa}
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center col-span-2">
                                    {siswa.kelas} {siswa.rombel} {siswa.no_rombel}
                                </div>
                                <div className="hidden md:flex items-center col-span-2 gap-3">
                                    {siswa.tahun_masuk}
                                </div>
                                <div className={`${mont.className} hidden md:flex items-center col-span-2 gap-1`}>
                                    <p className="px-2 py-1 rounded-full bg-zinc-100">
                                        {siswa.nis}
                                    </p>
                                    <p className="px-2 py-1 rounded-full bg-zinc-100">
                                        {siswa.nisn}
                                    </p>
                                </div>
                                <div className="flex justify-center items-center  col-span-4 md:col-span-2 gap-1 md:gap-2">
                                    <a href={`/data/alumni/nis/${siswa.nis}`} className="w-6 h-6 flex items-center justify-center  text-white bg-blue-600 hover:bg-blue-800" title="Informasi lebih lanjut">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </a>
                                    <button type="button" onClick={() => deleteSingle(siswa.nis)} className="w-6 h-6 flex items-center justify-center  text-white bg-red-600 hover:bg-red-800" title="Hapus data siswa ini?">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <a href={`/data/alumni/update/${siswa.nis}`} className="w-6 h-6 flex items-center justify-center  text-white bg-amber-600 hover:bg-amber-800" title="Ubah data siswa ini">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full flex justify-center items-center gap-2 my-3">
                    <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-zinc-400" />
                    <h1 className="text-zinc-400">Data kosong</h1>
                </div>
            ))}

            <div className="w-full flex md:items-center md:justify-between px-2 py-1 flex-col md:flex-row border-y border-zinc-300">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">
                            {selectedSiswa.length} Data terpilih
                        </p>
                        <button type="button" onClick={() => deleteSelectedSiswa()} className={`w-7 h-7 ${selectedSiswa && selectedSiswa.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 focus:bg-red-200 focus:text-red-700`}>
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                        </button>
                        <button type="button" onClick={() => setShowSelected(state => !state)} className={`w-7 h-7 flex items-center justify-center rounded-lg   ${showSelected ? 'bg-blue-200 text-blue-700 hover:bg-blue-300' : 'text-zinc-500 bg-zinc-100 hover:bg-zinc-200'} group transition-all duration-300`}>
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                        <button type="button" onClick={() => setSelectedSiswa([])} className={`w-7 h-7 ${selectedSiswa && selectedSiswa.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg  group transition-all duration-300 bg-zinc-100 hover:bg-zinc-200`}>
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
                        {(totalList * pagination) - totalList + 1} - {(totalList * pagination) > siswaList.length ? siswaList.length : totalList * pagination} dari {siswaList.length} data
                    </p>
                    <div className={`${mont.className} px-2 text-xs flex items-center justify-center gap-3`}>
                        <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                        </button>
                        <p className="font-medium text-zinc-600">
                            {pagination}
                        </p>
                        <button type="button" onClick={() => setPagination(state => state < Math.ceil(siswaList.length / totalList) ? state + 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
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
            <hr className="my-3 opacity-0" />
            <div className="md:p-5 mb-10 rounded-xl md:border border-zinc-400 flex flex-col md:flex-row gap-5 transition-all duration-300">
                
                <form onSubmit={submitUpdateBersama} className="w-full md:w-1/2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-inherit" />
                        </div>
                        <h1 className={`${mont.className} font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-zinc-800`}>
                            Ubah Data Bersamaan
                        </h1>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className={`${selectedSiswa && selectedSiswa.length < 1 ? 'flex' : 'hidden'} items-center gap-3`}>
                        <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-zinc-300" />
                        <h1 className="text-zinc-500">Silahkan pilih data diatas terlebih dahulu.</h1>
                    </div>
                    <div className={`${selectedSiswa && selectedSiswa.length > 0 ? 'flex' : 'hidden'} gap-3 flex-col md:flex-row w-full`}>
                        <div className="w-full md:w-1/2 space-y-3">
                            <select defaultValue={''} name="kelas" className="w-full border px-3 py-1 rounded-full cursor-pointer bg-transparent">
                                <option value="" disabled>-- Pilih Kelas --</option>
                                <option value="X">X</option>
                                <option value="XI">XI</option>
                                <option value="XII">XII</option>
                            </select>
                            <select defaultValue={''} name="no_rombel" className="w-full border px-3 py-1 rounded-full cursor-pointer bg-transparent">
                                <option value="" disabled>-- Pilih No Rombel --</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                            <input type="number" name="tahun_masuk" className="w-full border px-3 py-1 rounded-full bg-transparent" placeholder="Tahun Masuk" />
                            <div className="flex w-full items-center gap-2">
                                <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-zinc-300" />
                                <h1 className="text-zinc-500 text-xs">Jangan di isi jika tidak ingin mengubah tahun masuk</h1>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-3">
                            <select defaultValue={''} name="rombel" className="w-full border px-3 py-1 rounded-full cursor-pointer bg-transparent">
                                <option value="" disabled>-- Pilih Rombel --</option>
                                <option value="TKJ">TKJ</option>
                                <option value="TITL">TITL</option>
                                <option value="GEO">GEO</option>
                                <option value="DPIB">DPIB</option>
                                <option value="TKR">TKR</option>
                                <option value="TPM">TPM</option>
                            </select>
                            <select defaultValue={''} name="status" className="w-full border px-3 py-1 rounded-full cursor-pointer bg-transparent">
                                <option value="" disabled>-- Pilih Status --</option>
                                <option value="aktif">Aktif</option>
                                <option value="tidak">Tidak Aktif</option>
                            </select>
                        </div>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className={`${selectedSiswa && selectedSiswa.length > 0 ? 'flex' : 'hidden'} items-center gap-3`}>
                        <button type="submit"  className="px-3 py-2 rounded-full bg-green-100 text-green-700 font-medium flex items-center justify-center gap-3 text-sm hover:bg-green-600 hover:text-white">
                            <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                            Simpan Perubahan
                        </button>
                        <button type="button" onClick={() => setSelectedSiswa([])}  className="px-3 py-2 rounded-full bg-zinc-100 text-zinc-700 font-medium md:hidden flex items-center justify-center gap-3 text-sm hover:bg-zinc-200 hover:text-zinc-800">
                            <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-inherit" />
                            Batalkan
                        </button>
                    </div>
                </form>
            </div>

        </MainLayoutPage>
    )
}

function LoadingFetchSkeleton() {
    return (
        <div className="grid grid-cols-12 w-full  hover:bg-zinc-100 *:px-2 *:py-3 text-zinc-800 font-medium text-xs divide-x my-2">
            <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center bg-zinc-600 rounded animate-pulse"></div>
            <div className="hidden md:flex items-center col-span-2 bg-zinc-600 rounded animate-pulse"></div>
            <div className="hidden md:flex items-center col-span-2 gap-3 bg-zinc-600 rounded animate-pulse"></div>
            <div className="hidden md:flex items-center col-span-2 bg-zinc-600 rounded animate-pulse"></div>
            <div className="flex justify-center items-center  col-span-4 md:col-span-2 gap-1 md:gap-2 bg-zinc-600 rounded animate-pulse"></div>
        </div>
    )
}