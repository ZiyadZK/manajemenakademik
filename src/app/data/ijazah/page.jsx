'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta, mont, rale } from "@/config/fonts"
import { exportToCSV } from "@/lib/csvLibs"
import { dateToIso, isoToDate } from "@/lib/dateConvertes"
import { ioServer } from "@/lib/io"
import { deleteMultiIjazah, getAllIjazah, updateMultiIjazah } from "@/lib/model/ijazahModel"
import { exportToXLSX } from "@/lib/xlsxLibs"
import { faAngleLeft, faAngleRight, faArrowDown, faArrowUp, faArrowsUpDown, faCheck, faCheckCircle, faCircleCheck, faCircleXmark, faDownload, faEdit, faEllipsisH, faExclamationCircle, faEye, faFile, faFilter, faInfoCircle, faPlus, faPrint, faTrash, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

const exportKolom = {
    tgl_diambil: 'Tanggal di Ambil',
    nama_lulusan: 'Nama Lulusan',
    nisn: 'NISN',
    nama_pengambil: 'Nama Pengambil',
    kelas: 'Kelas',
    rombel: 'Jurusan',
    no_rombel: 'Rombel',
    tahun_lulus: 'Tahun Lulus',
    status: 'Status'
  }

export default function DataIjazahPage() {
    const [sorting, setSorting] = useState({nama_lulusan: '', tahun_lulus: ''})
    const router = useRouter()
    const [kelas, setKelas] = useState('')
    const [rombel, setRombel] = useState('')
    const [noRombel, setNoRombel] = useState('')
    const [status, setStatus] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [dataIjazah, setDataIjazah] = useState([])
    const [filteredDataIjazah, setFilteredDataIjazah] = useState([])
    const [selectedDataIjazah, setSelectedDataIjazah] = useState([])
    const [showSelected, setShowSelected] = useState(false)
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [editFormData, setEditFormData] = useState({})
    const [loadingFetch, setLoadingFetch] = useState('')

    const [exportExcel, setExportExcel] = useState({
        allKolom: true, kolomDataArr: []
    })

    const [statusSocket, setStatusSocket] = useState('')

    useEffect(() => {

        if(ioServer.connected) {
            setStatusSocket('online')
        }else{
            console.log('Socket Server is offline!')
            setStatusSocket('offline')
        }

        ioServer.on('SIMAK_IJAZAH', (data) => {
            setDataIjazah(data)
            handleSubmitFilter(data)
        })

    }, [])
    

    const getDataIjazah = async () => {
        setLoadingFetch('loading')
        const response = await getAllIjazah()
        if(response.success) {
            setDataIjazah(response.data)
            setFilteredDataIjazah(response.data)
        }
        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getDataIjazah()
    }, [])

    const handleSubmitFilter = (data) => {
        let updatedFilter
        if(!data || typeof(data) === 'undefined' || data === null || data.length < 1) {
            updatedFilter = dataIjazah
        }else{
            updatedFilter = data
        }
        
        // Search Kelas
        if(kelas !== '') {
            updatedFilter = updatedFilter.filter(siswa => siswa.kelas == kelas)
        }

        // Search Rombel
        updatedFilter = updatedFilter.filter(siswa => siswa.rombel.toLowerCase().includes(rombel.toLowerCase()))

        // Search NO Rombel
        updatedFilter = updatedFilter.filter(siswa => siswa.no_rombel.toLowerCase().includes(noRombel.toLowerCase()))
        
        // Search Status
        updatedFilter = updatedFilter.filter(siswa => siswa['status'].includes(status))
        
        // Search Value and Kriteria
        updatedFilter = updatedFilter.filter(siswa => siswa['nama_lulusan'].toLowerCase().includes(searchValue.toLowerCase()) || siswa['nisn'].toLowerCase().includes(searchValue.toLowerCase()))

        // Search Only Selected
        if(showSelected) {
            updatedFilter = updatedFilter.filter(siswa => selectedDataIjazah.includes(siswa.nisn))
            const maxPagination = Math.ceil(updatedFilter.length / totalList)
            setPagination(maxPagination > 0 ? maxPagination - maxPagination + 1 : 1)
        }
        
        let sortedFilter = [];
        // Sorting
        if(sorting.nama_lulusan !== '') {
            sortedFilter = updatedFilter.sort((a, b) => {
                if(sorting.nama_lulusan === 'asc') {
                    if (a.nama_lulusan < b.nama_lulusan) return -1;
                    if (a.nama_lulusan > b.nama_lulusan) return 1;
                    return 0;
                }
                
                if(sorting.nama_lulusan === 'dsc') {
                    if (a.nama_lulusan < b.nama_lulusan) return 1;
                    if (a.nama_lulusan > b.nama_lulusan) return -1;
                    return 0;
                }
            })
        }

        if(sorting.tahun_lulus !== '') {
            sortedFilter = updatedFilter.sort((a, b) => {
                if(sorting.tahun_lulus === 'asc') {
                    if (a.tahun_lulus < b.tahun_lulus) return -1;
                    if (a.tahun_lulus > b.tahun_lulus) return 1;
                    return 0;
                }
                
                if(sorting.tahun_lulus === 'dsc') {
                    if (a.tahun_lulus < b.tahun_lulus) return 1;
                    if (a.tahun_lulus > b.tahun_lulus) return -1;
                    return 0;
                }
            })
        }

        updatedFilter = sortedFilter.length > 0 ? sortedFilter : updatedFilter

        setFilteredDataIjazah(updatedFilter)
    }

    useEffect(() => {
        handleSubmitFilter()
    }, [kelas, rombel, noRombel, searchValue,  status, showSelected, sorting])

    const handleTotalList = (value) => {
        // Cek kalau totalList melebihi Math Ceil
        const maxPagination = Math.ceil(dataIjazah.length / value)
        if(pagination > maxPagination) {
            setPagination(state => state = maxPagination)
        }
        setTotalList(value)
    }

    const changeStatusIjazah = async (event, modal_no_ijazah, nisn, nama_lulusan, status) => {
        event.preventDefault()
        document.getElementById(modal_no_ijazah).close()

        Swal.fire({
            title: 'Sedang memproses data',
            text: 'Harap tunggu sebentar',
            showConfirmButton: false,
            timer: 5000,
            allowOutsideClick: false,
            didOpen: async () => {
                const payload = {
                    status,
                    nama_pengambil: status === 'sudah diambil' ? (event.target[0].value === '' ? nama_lulusan : event.target[0].value) : '',
                    tgl_diambil: status === 'sudah diambil' ? (event.target[1].value === '' ? `${new Date().toLocaleDateString('en-GB')}` : isoToDate(event.target[1].value)) : ''
                }

                event.target[0].value = ''
                event.target[1].value = ''

                const response = await updateMultiIjazah([nisn], payload)
                if(response.success) {
                    Swal.close()
                    if(statusSocket !== 'online') {
                        await getDataIjazah()
                    }
                    return toast.success(`Berhasil mengubah data ijazah untuk ${nama_lulusan}`)
                }else{
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Gagal mengubah data ijazah, terdapat error!'
                    })
                }
            }
        })
    }

    const handleDeleteIjazah = async (nisn) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan menghapus data ijazah tersebut!',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    text: 'Harap tunggu sebentar',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    timer: 6000,
                    didOpen: async () => {
                        let response;
                        if(nisn === '' || !nisn || typeof(nisn) === 'undefined') {
                            response = await deleteMultiIjazah(selectedDataIjazah)
                        }else{
                            response = await deleteMultiIjazah([nisn])
                        }
                        if(response.success){
                            Swal.close()
                            if(statusSocket !== 'online') {
                                await getDataIjazah()
                            }
                            return toast.success('Berhasil menghapus data ijazah tersebut!')
                        }else{
                            Swal.fire({
                                title: 'Error!',
                                icon: 'error',
                                text: "Gagal menghapus data ijazah tersebut, terdapat Error!"
                            })
                        }
                    }
                })
            }
        })
    }

    const handleEditFormData = async (modal, payload) => {
        document.getElementById(modal).showModal()

        setEditFormData(payload)
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

    const submitUpdateIjazah = async (event, modal, nisn) => {
        event.preventDefault()
        Swal.fire({
            title: 'Sedang memproses data',
            text: 'Mohon tunggu sebentar',
            timer: 5000,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: async () => {
                Swal.close()
                const response = await updateMultiIjazah([nisn], editFormData)
                document.getElementById(modal).close()
                if(response.success) {
                    if(statusSocket !== 'online') {
                        await getDataIjazah()
                    }
                    return toast.success('Berhasil mengubah data tersebut!')
                }else{
                    Swal.fire({
                        title: 'Error!',
                        text: 'Gagal mengubah data tersebut, terdapat Error!',
                        icon: 'error'
                    })
                }
            }
        })
    }

    const handleSelectedSiswa = (nisn) => {
        if(!selectedDataIjazah.includes(nisn)){
            const newData = [...selectedDataIjazah, nisn]
            setSelectedDataIjazah(newData)
        }else{
            const newData = selectedDataIjazah.filter(item => item !== nisn);
            setSelectedDataIjazah(newData)
        }
    }

    const handleChangeExportExcel = (field, value) => {
        setExportExcel(prevState => {
            let updatedData = { ...prevState };

            if (Array.isArray(prevState[field])) {
                if (updatedData[field].some(kolom => kolom.key === value)) {
                    updatedData[field] = updatedData[field].filter(kolom => kolom.key !== value);
                } else {
                    updatedData[field] = [...updatedData[field], { key: value, keyName: exportKolom[value] }];
                }
            } else {
                updatedData[field] = value;
            }

            return updatedData;
        });
    }

    const submitExportExcel = async (type, modal) => {
        if(!exportExcel['allKolom'] && exportExcel['kolomDataArr'].length < 1 === true) {
            return toast.error('Anda harus memilih kolom data terlebih dahulu!')
        }
        
        document.getElementById(modal).close()
        
        let updatedData
        if(exportExcel['allKolom']) {
            if(type === 'xlsx') {
                if(selectedDataIjazah.length < 1) {
                    return await exportToXLSX(dataIjazah, 'Data Ijazah', {
                        header: Object.keys(dataIjazah[0]),
                        sheetName: 'Sheet 1'
                    })
                }

                updatedData = dataIjazah.filter(ijazah => selectedDataIjazah.includes(ijazah.nisn))
                return await exportToXLSX(updatedData, 'Data Pegawai', {
                    header: Object.keys(updatedData[0]),
                    sheetName: 'Sheet 1'
                })
            }else{
                if(selectedDataIjazah.length < 1) {
                    return await exportToCSV(dataIjazah, 'Data Pegawai', {
                        header: Object.keys(dataIjazah[0]),
                        sheetName: 'Sheet 1'
                    })
                }

                updatedData = dataIjazah.filter(ijazah => selectedDataIjazah.includes(ijazah.nisn))
                return await exportToCSV(updatedData, 'Data Pegawai', {
                    header: Object.keys(updatedData[0]),
                    sheetName: 'Sheet 1'
                })
            }
        }else{
            if(type === 'xlsx') {
                console.log(selectedDataIjazah.length)
                if(selectedDataIjazah.length < 1) {
                    updatedData = dataIjazah.map(obj => {
                        let newObj = {}
                        exportExcel['kolomDataArr'].forEach(({key}) => {
                            if(obj.hasOwnProperty(key)) {
                                newObj[key] = obj[key]
                            }
                        })
                        return newObj
                    })

                    return await exportToXLSX(updatedData, 'Data Pegawai', {
                        header: Object.keys(updatedData[0]),
                        sheetName: 'Sheet 1'
                    })
                }else{
                    updatedData = dataIjazah.filter(ijazah => selectedDataIjazah.includes(ijazah.nisn))
    
                    updatedData = updatedData.map(obj => {
                        let newObj = {}
                        exportExcel['kolomDataArr'].forEach(({key}) => {
                            if(obj.hasOwnProperty(key)) {
                                newObj[key] = obj[key]
                            }
                        })
                        return newObj
                    }) 
    
                    return await exportToXLSX(updatedData, 'Data Pegawai', {
                        header: Object.keys(updatedData[0]),
                        sheetName: 'Sheet 1'
                    })
                }

            }else{
                if(selectedDataIjazah.length < 1) {
                    updatedData = dataIjazah.map(obj => {
                        let newObj = {}
                        exportExcel['kolomDataArr'].forEach(({key}) => {
                            if(obj.hasOwnProperty(key)) {
                                newObj[key] = obj[key]
                            }
                        })
                        return newObj
                    })

                    return await exportToCSV(updatedData, 'Data Pegawai', {
                        header: Object.keys(updatedData[0]),
                        sheetName: 'Sheet 1'
                    })
                }

                updatedData = dataIjazah.filter(ijazah => selectedDataIjazah.includes(ijazah.nisn))
                console.log(updatedData)

                updatedData = updatedData.map(obj => {
                    let newObj = {}
                    exportExcel['kolomDataArr'].forEach(({key}) => {
                        if(obj.hasOwnProperty(key)) {
                            newObj[key] = obj[key]
                        }
                    })
                    return newObj
                }) 

                return await exportToCSV(updatedData, 'Data Pegawai', {
                    header: Object.keys(updatedData[0]),
                    sheetName: 'Sheet 1'
                })
            }
        }
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-3">
                <div className="flex items-center md:gap-5 w-full justify-center md:justify-start gap-2">
                    <button type="button" onClick={() => router.push('/data/ijazah/new')} className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200`}>
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-inherit" />
                        Tambah Data
                    </button>
                    <button type="button" onClick={() => router.push('/data/ijazah/new/import')} className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200`}>
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                        Import Data
                    </button>
                </div>
                <hr className="my-3 opacity-0" />
                <div className="p-5 rounded-2xl bg-zinc-50  text-zinc-800 dark:bg-zinc-700/20 dark:text-zinc-200">
                    <div className="flex items-center gap-2 md:gap-5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 dark:bg-orange-500/10">
                            <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-inherit" />
                        </div>
                        <h1 className="font-medium text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-900 to-zinc-800 dark:from-orange-500 dark:to-white">Filterisasi Data</h1>
                    </div>
                    <hr className="my-1 opacity-0" />
                    <div className="flex md:flex-row flex-col gap-5">
                    <div className="w-full md:w-1/2 flex gap-2">
                        <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer dark:bg-zinc-700 dark:border-zinc-700">
                            <option value="X">X</option>
                            <option value="XI">XI</option>
                            <option value="XII">XII</option>
                            <option value="">Semua Kelas</option>
                        </select>
                        <select value={rombel} onChange={e => setRombel(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer dark:bg-zinc-700 dark:border-zinc-700">
                            <option value="TKJ">TKJ</option>
                            <option value="DPIB">DPIB</option>
                            <option value="TKR">TKR</option>
                            <option value="GEO">GEO</option>
                            <option value="TPM">TPM</option>
                            <option value="TITL">TITL</option>
                            <option value="">Semua Rombel</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/2 flex gap-2">
                        <select value={noRombel} onChange={e => setNoRombel(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer dark:bg-zinc-700 dark:border-zinc-700">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="">Semua No Rombel</option>
                        </select>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer dark:bg-zinc-700 dark:border-zinc-700">
                            <option value="sudah diambil">Sudah di Ambil</option>
                            <option value="belum diambil">Belum di Ambil</option>
                            <option value="">Semua Status</option>
                        </select>
                    </div>
                    </div>
                </div>
            </div>
            <hr className="my-2 opacity-0" />
            <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="bg-white w-full px-3 py-2 rounded-lg border transition-all duration-300 my-3 block md:hidden dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Cari data disini" />
            <div className="grid grid-cols-12 w-full mt-0 md:mt-3 bg-blue-500 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-3 place-items-center">
                    <input type="checkbox"  />
                    Nama
                    <button type="button" onClick={() => handleSorting('nama_lulusan', 'tahun_lulus')} className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting['nama_lulusan'] === '' ? faArrowsUpDown : (sorting['nama_lulusan'] === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
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
                    <button type="button" onClick={() => handleSorting('tahun_lulus', 'nama_lulusan')} className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting['tahun_lulus'] === '' ? faArrowsUpDown : (sorting['tahun_lulus'] === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Sudah di Ambil
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-full md:block hidden px-3 py-2 rounded-lg border transition-all duration-300 text-zinc-800 bg-white outline-none" placeholder="Cari data disini" />
                    <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit block md:hidden" />
                </div>
            </div>
            {loadingFetch !== 'fetched' && (
                <div className="flex items-center justify-center gap-4 py-5 text-blue-600/50">
                    <div className="loading loading-spinner loading-md text-inherit"></div>
                    Sedang mendapatkan data
                </div>
            )}
            {loadingFetch === 'fetched' && dataIjazah.length < 1 && (
                <div className="flex items-center justify-center gap-4 py-5 text-blue-600/50">
                    <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-inherit" />
                    Data kosong
                </div>
            )}
            <div className={`divide-y relative w-full max-h-[300px] overflow-auto dark:divide-zinc-700 ${mont.className}`}>
                {filteredDataIjazah.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((ijazah, index) => (
                    <div key={`${ijazah.nisn} - ${index}`} className="grid grid-cols-12 w-full dark:divide-zinc-700 hover:bg-zinc-100 *:px-2 *:py-3 text-zinc-800 font-medium text-xs divide-x dark:hover:bg-zinc-800 dark:text-zinc-200">
                        <div className={`flex items-center gap-3 col-span-8 md:col-span-3 ${ijazah.status === 'sudah diambil' && 'text-blue-700 md:text-inherit dark:text-blue-400 dark:md:text-inherit'}  `}>
                            <input type="checkbox" checked={selectedDataIjazah.includes(ijazah.nisn)} onChange={() => handleSelectedSiswa(ijazah.nisn)} />
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
                            <button type="button" onClick={() => document.getElementById(`modal_change_sudah_${ijazah.no}`).showModal()} disabled={ijazah.status === 'sudah diambil'} className={`px-2  py-1 rounded-full ${ijazah.status === 'sudah diambil' ? 'bg-green-600 dark:bg-green-500/50 dark:text-green-300' : 'bg-green-600/50 dark:bg-green-500/10 hover:bg-green-600 dark:hover:bg-green-500/20 dark:text-green-500'}  text-white flex items-center gap-2 w-fit`}>
                                <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                Ya
                            </button>
                            <button type="button" disabled={ijazah.status === 'belum diambil'} onClick={() => document.getElementById(`modal_change_belum_${ijazah.no}`).showModal()} className={`px-2 py-1 rounded-full ${ijazah.status === 'belum diambil' ? 'bg-red-500 dark:bg-red-500/50 dark:text-red-300' : 'bg-red-500/50 hover:bg-red-500 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-500'} text-white flex items-center gap-2 w-fit`}>
                                <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                Belum
                            </button>
                        </div>
                        <div className="flex justify-center items-center col-span-4 md:col-span-2 gap-2">
                            <button type="button" onClick={() => document.getElementById(`modal_info_${ijazah.no}`).showModal()} className="w-6 h-6 flex items-center justify-center  text-white bg-blue-600 hover:bg-blue-800" title="Informasi lebih lanjut">
                                <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            </button>
                            <dialog id={`modal_info_${ijazah.no}`} className="modal w-full">
                                <div className="modal-box bg-white dark:bg-zinc-800">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className={`font-bold md:text-lg flex items-center gap-3`}>
                                       {ijazah.nama_lulusan}
                                       
                                    </h3>
                                    <hr className="my-1 opacity-0" />
                                    <div className="space-y-2">
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Kelas
                                            </p>
                                            <p className="w-full md:w-3/5 text-xs">
                                                {ijazah.kelas} {ijazah.rombel} {ijazah.no_rombel}
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                NISN
                                            </p>
                                            <p className="w-full md:w-3/5 text-xs">
                                                {ijazah.nisn} 
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Tahun Lulus
                                            </p>
                                            <p className="w-full md:w-3/5 text-xs">
                                                {ijazah.tahun_lulus} 
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Tanggal di Ambil
                                            </p>
                                            <p className="w-full md:w-3/5 text-xs">
                                                {ijazah.tgl_diambil || '-'} 
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Nama Pengambil
                                            </p>
                                            <p className="w-full md:w-3/5 text-xs">
                                                {ijazah.nama_pengambil || '-'} 
                                            </p>
                                        </div>
                                        <div className="flex md:hidden flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Sudah di Ambil
                                            </p>
                                            <div className="md:hidden flex items-center col-span-2 gap-2">
                                                <button type="button" onClick={() => document.getElementById(`modal_change_sudah_${ijazah.no}`).showModal()} disabled={ijazah.status === 'sudah diambil'} className={`px-2  py-1 rounded-full ${ijazah.status === 'sudah diambil' ? 'bg-green-600 dark:bg-green-500/50 dark:text-green-300' : 'bg-green-600/50 hover:bg-green-600 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-500'}  text-white flex items-center gap-2 w-fit`}>
                                                    <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                                    Ya
                                                </button>
                                                <button type="button" disabled={ijazah.status === 'belum diambil'} onClick={() => document.getElementById(`modal_change_belum_${ijazah.no}`).showModal()} className={`px-2 py-1 rounded-full ${ijazah.status === 'belum diambil' ? 'bg-red-500 dark:bg-red-500/50 dark:text-red-300' : 'bg-red-500/50 hover:bg-red-500 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-500'} text-white flex items-center gap-2 w-fit`}>
                                                    <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                                    Belum
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </dialog>
                            <button type="button" onClick={() => handleDeleteIjazah(ijazah.nisn)} className="w-6 h-6 flex items-center justify-center  text-white bg-red-600 hover:bg-red-800" title="Hapus data ini?">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" onClick={() => handleEditFormData(`modal_update_${ijazah.no}`, ijazah)} className="w-6 h-6 flex items-center justify-center  text-white bg-amber-600 hover:bg-amber-800" title="Ubah data ini">
                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                            </button>
                            <dialog id={`modal_change_sudah_${ijazah.no}`} className="modal">
                                <div className="modal-box bg-white dark:bg-zinc-800">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className="font-bold md:text-lg flex items-center gap-3">
                                        Ubah menjadi <span className="px-2 py-1 font-normal rounded-full bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-500">
                                            Sudah di Ambil
                                        </span>?
                                    </h3>
                                    <hr className="my-2 opacity-0" />
                                    <form onSubmit={e => changeStatusIjazah(e, `modal_change_sudah_${ijazah.no}`, ijazah.nisn, ijazah.nama_lulusan, 'sudah diambil')}>
                                        <div className="space-y-2">
                                            <div className="flex md:items-center md:gap-0 gap-1 flex-col md:flex-row">
                                                <p className="text-xs opacity-50 w-full md:w-2/5">
                                                    Nama Pengambil
                                                </p>
                                                <div className="w-full md:w-3/5">
                                                    <input type="text" className="bg-white px-3 py-2 rounded-lg border w-full dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700" placeholder="Masukkan nama pengambil" />
                                                </div>
                                            </div>
                                            <div className="flex md:items-center md:gap-0 gap-1 flex-col md:flex-row">
                                                <p className="text-xs opacity-50 w-full md:w-2/5">
                                                    Tanggal di Ambil
                                                </p>
                                                <div className="w-full md:w-3/5">
                                                    <input type="date" className="bg-white px-3 py-2 rounded-lg border w-full dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700" placeholder="Masukkan nama pengambil" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="py-4">Jika anda mengubahnya menjadi status <span className="px-2 rounded-full bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-500">Sudah di Ambil</span>, Nama Pengambil dan Tanggal Pengambil akan di <span className="text-green-700">Isi secara Otomatis</span> untuk data ijazah milik <span className="text-blue-600">{ijazah.nama_lulusan}</span> jika anda tidak mengisi keduanya.
                                            <br /> <br />
                                            Apakah anda yakin?
                                        </p>
                                        <div className="flex items-center gap-5 w-full md:w-fit">
                                            <button type="submit" className="w-1/2 md:w-fit px-3 py-2 rounded-full bg-green-400 hover:bg-green-500 focus:bg-green-600 text-white flex items-center justify-center gap-3">
                                                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-inherit" />
                                                Iya
                                            </button>
                                            <button type="button" onClick={() => document.getElementById(`modal_change_sudah_${ijazah.no}`).close()} className="w-1/2 md:w-fit px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 text-zinc-800 flex items-center justify-center gap-3">
                                                <FontAwesomeIcon icon={faXmarkCircle} className="w-3 h-3 text-inherit" />
                                                Tidak
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                            <dialog id={`modal_change_belum_${ijazah.no}`} className="modal">
                                <div className="modal-box bg-white dark:bg-zinc-800">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className="font-bold md:text-lg flex items-center gap-3">
                                        Ubah menjadi <span className="px-2 py-1 font-normal rounded-full bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-500">
                                            Belum di Ambil
                                        </span>?
                                    </h3>
                                    <form onSubmit={e => changeStatusIjazah(e, `modal_change_belum_${ijazah.no}`, ijazah.nisn, ijazah.nama_lulusan, 'belum diambil')}>
                                        <p className="py-4">Jika anda mengubahnya menjadi status <span className="px-2 rounded-full bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-500">Belum di Ambil</span>, maka Nama Pengambil dan Tanggal Pengambil akan di <span className="text-red-700">di Hapus</span> untuk data ijazah milik <span className="text-blue-600">{ijazah.nama_lulusan}</span>
                                            <br /> <br />
                                            Apakah anda yakin?
                                        </p>
                                        <div className="flex items-center gap-5 w-full md:w-fit">
                                            <button type="submit" className="w-1/2 md:w-fit px-3 py-2 rounded-full bg-green-400 hover:bg-green-500 focus:bg-green-600 text-white flex items-center justify-center gap-3">
                                                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-inherit" />
                                                Iya
                                            </button>
                                            <button type="button" onClick={() => document.getElementById(`modal_change_belum_${ijazah.no}`).close()} className="w-1/2 md:w-fit px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 text-zinc-800 flex items-center justify-center gap-3">
                                                <FontAwesomeIcon icon={faXmarkCircle} className="w-3 h-3 text-inherit" />
                                                Tidak
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                            <dialog id={`modal_update_${ijazah.no}`} className="modal">
                                <div className="modal-box bg-white">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className="font-bold md:text-lg flex items-center gap-3">
                                        Ubah Data <span className="px-2 py-1 font-normal rounded-full bg-green-50 text-green-700">
                                            {ijazah.nama_lulusan}
                                        </span>
                                    </h3>
                                    <hr className="my-2 opacity-0" />
                                    <form onSubmit={e => submitUpdateIjazah(e, `modal_update_${ijazah.no}`, ijazah.nisn)} className="space-y-2">
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Nama Lulusan
                                            </p>
                                            <div className="w-full md:w-3/5 text-xs">
                                                <input type="text" value={editFormData['nama_lulusan']} onChange={e => setEditFormData(state => ({...state, nama_lulusan: e.target.value}))} className="px-3 py-2 rounded bg-white w-full border" placeholder="Masukkan Nama" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                NISN
                                            </p>
                                            <div className="w-full md:w-3/5 text-xs">
                                                <input type="text" value={editFormData['nisn']} onChange={e => setEditFormData(state => ({...state, nisn: e.target.value}))} className="px-3 py-2 rounded bg-white w-full border" placeholder="Masukkan NISN" /> 
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Tahun Lulus
                                            </p>
                                            <div className="w-full md:w-3/5 text-xs">
                                                <input type="text" value={editFormData['tahun_lulus']} onChange={e => setEditFormData(state => ({...state, tahun_lulus: e.target.value}))} className="px-3 py-2 rounded bg-white w-full border" placeholder="Masukkan Tahun Lulus" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Tanggal di Ambil
                                            </p>
                                            <p className="w-full md:w-3/5 text-xs">
                                                <input type="date" value={editFormData['tgl_diambil'] ? dateToIso(editFormData['tgl_diambil']) : ''} onChange={e => setEditFormData(state => ({...state, tgl_diambil: isoToDate(e.target.value)}))} className="px-3 py-2 rounded bg-white w-full border" placeholder="Masukkan Nama" /> 
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                                            <p className="w-full md:w-2/5 text-xs opacity-50">
                                                Nama Pengambil
                                            </p>
                                            <p className="w-full md:w-3/5 text-xs">
                                                <input type="text" value={editFormData['nama_pengambil']} onChange={e => setEditFormData(state => ({...state, nama_pengambil: e.target.value}))} className="px-3 py-2 rounded bg-white w-full border" placeholder="Masukkan Nama" /> 
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-5 w-full md:w-fit">
                                            <button type="submit" className="w-1/2 md:w-fit px-3 py-2 rounded-full bg-green-400 hover:bg-green-500 focus:bg-green-600 text-white flex items-center justify-center gap-3">
                                                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-inherit" />
                                                Simpan
                                            </button>
                                            <button type="button" onClick={() => document.getElementById(`modal_update_${ijazah.no}`).close()} className="w-1/2 md:w-fit px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 text-zinc-800 flex items-center justify-center gap-3">
                                                <FontAwesomeIcon icon={faXmarkCircle} className="w-3 h-3 text-inherit" />
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex md:items-center md:justify-between px-2 py-1 flex-col md:flex-row border-y border-zinc-300 dark:border-zinc-700 dark:text-zinc-500">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">
                            {selectedDataIjazah.length} Data terpilih
                        </p>
                        <button type="button" onClick={() => handleDeleteIjazah()} className={`w-7 h-7 ${selectedDataIjazah && selectedDataIjazah.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 focus:bg-red-200 focus:text-red-700 dark:bg-zinc-700/50 dark:hover:bg-zinc-700`}>
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                        </button>
                        <button type="button" onClick={() => setShowSelected(state => !state)} className={`w-7 h-7 flex items-center justify-center rounded-lg   ${showSelected ? 'bg-blue-200 text-blue-700 hover:bg-blue-300' : 'text-zinc-500 bg-zinc-100 hover:bg-zinc-200'} group transition-all duration-300 dark:bg-zinc-700/50 dark:hover:bg-zinc-700`}>
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                        <button type="button" onClick={() => setSelectedDataIjazah([])} className={`w-7 h-7 ${selectedDataIjazah && selectedDataIjazah.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg  group transition-all duration-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700/50 dark:hover:bg-zinc-700`}>
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                    </div>
                    <div className=" dropdown dropdown-hover dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="px-3 py-1 rounded bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center text-xs gap-2 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300">
                            <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                            Export
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-fit dark:bg-zinc-800">
                            <li>
                                <button type="button" onClick={() => document.getElementById('export_xlsx').showModal()} className="flex items-center justify-start gap-2 dark:hover:bg-zinc-900 dark:focus:text-zinc-200">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    XLSX
                                </button>
                                <button type="button" onClick={() => document.getElementById('export_csv').showModal()} className="flex items-center justify-start gap-2 dark:hover:bg-zinc-900 dark:focus:text-zinc-200">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    CSV
                                </button>
                            </li>
                        </ul>
                        <dialog id="export_csv" className="modal">
                            <div className="modal-box dark:bg-zinc-800 dark:text-zinc-200">
                                <form method="dialog">
                                    <button onClick={() => setExportExcel({allKolom: true, kolomDataArr: []})} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Export Data Excel CSV</h3>
                                <hr className="my-2 opacity-0" />
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <p className="w-full text-sm opacity-70 md:w-2/5">
                                        Semua Kolom Data?
                                    </p>
                                    <div className="flex w-full items-center gap-5 md:w-3/5">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={exportExcel['allKolom']} onChange={() => setExportExcel(state => ({...state, ['allKolom']: !state['allKolom']}))} className="cursor-pointer" id="export_csv_semua_kolom" />
                                             <label htmlFor="export_csv_semua_kolom" className="text-sm cursor-pointer">Ya</label>
                                        </div>
                                    </div>
                                </div>
                                {exportExcel.allKolom === false && (
                                    <div className="">
                                        <hr className="my-1 opacity-0" />
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <p className="w-full text-sm opacity-70 md:w-2/5">
                                                Kolom
                                            </p>
                                            <select onChange={e => handleChangeExportExcel('kolomDataArr', e.target.value)} className="w-full text-sm md:w-3/5 py-2 px-3 border rounded-lg cursor-pointer focus:border-zinc-500 hover:border-zinc-500 max-h-[100px] dark:bg-zinc-700 dark:border-zinc-700">
                                                {Object.keys(exportKolom).map((kolom, index) => (
                                                    <option key={index} value={kolom}>{exportKolom[kolom]}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <hr className="my-1 opacity-0" />
                                        <p className="text-sm opacity-70">
                                            Daftar Kolom Data
                                        </p>
                                        <div className="p-3 rounded-lg border w-full flex flex-wrap gap-1 dark:border-zinc-700">
                                            {exportExcel.kolomDataArr.map((kolomData, index) => (
                                                <div key={`${index} - ${index}`} className="p-2 rounded bg-zinc-100 text-xs flex items-center justify-center gap-2 font-medium dark:bg-zinc-700">
                                                    {kolomData['keyName']}
                                                    <button type="button" onClick={() => handleChangeExportExcel('kolomDataArr', kolomData.key)} className="flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-zinc-500 hover:text-zinc-700 focus:text-zinc-700" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <hr className="my-2 opacity-0" />
                                <p className={`${jakarta.className} text-sm`}>Apakah anda sudah yakin?</p>
                                <hr className="my-1 opacity-0" />
                                <div className="flex w-full md:w-fit gap-2 md:items-center md:justify-start">
                                    <button type="button" onClick={() => submitExportExcel('csv', 'export_csv')} className="p-2 rounded-full bg-green-700 hover:shadow-lg hover:bg-green-600 text-white flex items-center justify-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                        Ya, Saya Yakin
                                    </button>
                                    <button type="button" onClick={() => {document.getElementById(`export_csv`).close(); setExportExcel({allKolom: true, kolomDataArr: []})}} className="p-2 rounded-full bg-red-700 hover:shadow-lg hover:bg-red-600 text-white flex items-center justify-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                        Tidak
                                    </button>
                                </div>
                            </div>
                        </dialog>
                        <dialog id="export_xlsx" className="modal">
                            <div className="modal-box dark:bg-zinc-800 dark:text-zinc-200">
                                <form method="dialog">
                                    <button onClick={() => setExportExcel({allKolom: true, kolomDataArr: []})} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Export Data Excel</h3>
                                <hr className="my-2 opacity-0" />
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <p className="w-full text-sm opacity-70 md:w-2/5">
                                        Semua Kolom Data?
                                    </p>
                                    <div className="flex w-full items-center gap-5 md:w-3/5">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={exportExcel['allKolom']} onChange={() => setExportExcel(state => ({...state, ['allKolom']: !state['allKolom']}))} className="cursor-pointer" id="export_xlsx_semua_kolom" />
                                             <label htmlFor="export_xlsx_semua_kolom" className="text-sm cursor-pointer">Ya</label>
                                        </div>
                                    </div>
                                </div>
                                {exportExcel.allKolom === false && (
                                    <div className="">
                                        <hr className="my-1 opacity-0" />
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <p className="w-full text-sm opacity-70 md:w-2/5">
                                                Kolom
                                            </p>
                                            <select onChange={e => handleChangeExportExcel('kolomDataArr', e.target.value)} className="w-full text-sm md:w-3/5 py-2 px-3 border rounded-lg cursor-pointer focus:border-zinc-500 hover:border-zinc-500 max-h-[100px] dark:bg-zinc-700 dark:border-zinc-700">
                                                {Object.keys(exportKolom).map((kolom, index) => (
                                                    <option key={index} value={kolom}>{exportKolom[kolom]}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <hr className="my-1 opacity-0" />
                                        <p className="text-sm opacity-70">
                                            Daftar Kolom Data
                                        </p>
                                        <div className="p-3 rounded-lg border w-full flex flex-wrap gap-1 dark:border-zinc-700">
                                            {exportExcel.kolomDataArr.map((kolomData, index) => (
                                                <div key={`${index} - ${index}`} className="p-2 rounded bg-zinc-100 text-xs flex items-center justify-center gap-2 font-medium dark:bg-zinc-700">
                                                    {kolomData['keyName']}
                                                    <button type="button" onClick={() => handleChangeExportExcel('kolomDataArr', kolomData.key)} className="flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-zinc-500 hover:text-zinc-700 focus:text-zinc-700" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <hr className="my-2 opacity-0" />
                                <p className={`${jakarta.className} text-sm`}>Apakah anda sudah yakin?</p>
                                <hr className="my-1 opacity-0" />
                                <div className="flex w-full md:w-fit gap-2 md:items-center md:justify-start">
                                    <button type="button" onClick={() => submitExportExcel('xlsx', 'export_xlsx')} className="p-2 rounded-full bg-green-700 hover:shadow-lg hover:bg-green-600 text-white flex items-center justify-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                        Ya, Saya Yakin
                                    </button>
                                    <button type="button" onClick={() => {document.getElementById(`export_xlsx`).close(); setExportExcel({allKolom: true, kolomDataArr: []})}} className="p-2 rounded-full bg-red-700 hover:shadow-lg hover:bg-red-600 text-white flex items-center justify-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                        Tidak
                                    </button>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>
                <div className="w-full md:w-fit flex items-center justify-center divide-x mt-2 md:mt-0">
                    <p className={`${mont.className} px-2 text-xs`}>
                        {(totalList * pagination) - totalList + 1} - {(totalList * pagination) > dataIjazah.length ? dataIjazah.length : totalList * pagination} dari {dataIjazah.length} data
                    </p>
                    <div className={`${mont.className} px-2 text-xs flex items-center justify-center gap-3`}>
                        <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:hover:text-orange-500">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                        </button>
                        <p className="font-medium text-zinc-600 dark:text-orange-500">
                            {pagination}
                        </p>
                        <button type="button" onClick={() => setPagination(state => state < Math.ceil(dataIjazah.length / totalList) ? state + 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:hover:text-orange-500">
                            <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>
                    <div className={`${mont.className} px-2 text-xs`}>
                        <select  value={totalList} onChange={e => handleTotalList(e.target.value)} className="cursor-pointer px-2 py-1 hover:bg-zinc-100 rounded bg-transparent dark:hover:bg-zinc-800 dark:text-zinc-200">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
            <hr className="my-2 opacity-0" />
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-3">
                    <p className="text-xs opacity-70">
                        Socket Server:
                    </p>
                    {statusSocket === '' && (
                        <div className="loading loading-spinner loading-sm text-zinc-500"></div>
                    )}
                    {statusSocket === 'online' && (
                        <div className="flex items-center gap-2 p-2 rounded-full bg-green-500/10 text-green-600 text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Online
                        </div>
                    )}
                    {statusSocket === 'offline' && (
                        <div className="flex items-center gap-2 p-2 rounded-full bg-red-500/10 text-red-600 text-xs">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Offline
                        </div>
                    )}
                </div>
                <button type="button" onClick={() => document.getElementById('info_socket').showModal()}>
                    <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-zinc-500" />
                </button>
            </div>
            <dialog id="info_socket" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click on ✕ button to close</p>
                </div>
            </dialog>
        </MainLayoutPage>
    )
}