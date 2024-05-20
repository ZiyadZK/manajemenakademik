'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta, mont, rale } from "@/config/fonts"
import { exportToCSV } from "@/lib/csvLibs"
import { ioServer } from "@/lib/io"
import { deleteManyPegawai, deleteSinglePegawai, getAllPegawai } from "@/lib/model/pegawaiModel"
import { exportToXLSX } from "@/lib/xlsxLibs"
import { faAngleLeft, faAngleRight, faArrowDown, faArrowUp, faArrowsUpDown, faCircleCheck, faCircleXmark, faDownload, faEdit, faEllipsisH, faEllipsisV, faExclamationCircle, faEye, faFile, faFilter, faInfoCircle, faPlus, faPlusSquare, faPrint, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const exportKolom = {
    nama_pegawai: 'Nama Pegawai',
    jabatan: 'Jabatan',
    status_kepegawaian: 'Status Kepegawaian',
    nik: 'NIK',
    nip: 'NIP',
    nuptk: 'NUPTK',
    tmpt_lahir: 'Tempat Lahir',
    tgl_lahir: 'Tanggal Lahir',
    tmt: 'Tamat Pendidikan',
    pendidikan_terakhir: 'Pendidikan Terakhir',
    sekolah_pendidikan: 'Sekolah Pendidikan',
    sarjana_universitas: 'Sarjana Universitas',
    sarjana_fakultas: 'Sarjana Fakultas',
    sarjana_prodi: 'Sarjana Program Studi',
    magister_universitas: 'Magister Universitas',
    magister_fakultas: 'Magister Fakultas',
    magister_prodi: 'Magister Program Studi',
    pensiun: 'Pensiun'
  }

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
    const [filterPensiun, setFilterPensiun] = useState('')
    const [selectedPegawai, setSelectedPegawai] = useState([])
    const [filterSearch, setFilterSearch] = useState('')
    const [listJabatan, setListJabatan] = useState([])
    const [listStatusPegawai, setListStatusPegawai] = useState([])
    const [listPendidikanTerakhir, setListPendidikanTerakhir] = useState([])
    const [sortingNama, setSortingNama] = useState('');
    const [showSelected, setShowSelected] = useState(false)

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

        ioServer.on('SIMAK_PEGAWAI', (data) => {
            setDataPegawai(data);

            filterDataPegawai(data)
            
        })
    }, [])

    const getPegawai = async () => {
        setLoadingFetch('loading');
        const response = await getAllPegawai()
        if(response.success) {
            setDataPegawai(response.data)
            setFilteredDataPegawai(response.data)
            getListFilter(response.data)
        }
        setLoadingFetch('fetched')
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

    const filterDataPegawai = (data) => {

        let updatedData
        if(!data || typeof(data) === 'undefined' || data === null || data.length < 1) {
            updatedData = dataPegawai
        }else{
            updatedData = data
        }

        // Cek filter jabatan
        updatedData = updatedData.filter(({jabatan}) => jabatan.toLowerCase().includes(filterJabatan.toLowerCase()))

        // Cek filter status kepegawaian
        updatedData = updatedData.filter(({status_kepegawaian}) => status_kepegawaian.toLowerCase().includes(filterKepegawaian.toLowerCase()))

        // Cek filter pendidikan terakhir
        updatedData = updatedData.filter(({pendidikan_terakhir}) => pendidikan_terakhir.toLowerCase().includes(filterPendidikan.toLowerCase()))

        // Cek filter pensiun
        if(filterPensiun === 'pensiun') {
            updatedData = updatedData.filter(({pensiun}) => Boolean(pensiun) === true)
        }
        
        if(filterPensiun === 'aktif') {
            updatedData = updatedData.filter(({pensiun}) => Boolean(pensiun) === false)
        }

        // Search Filter
        updatedData = updatedData.filter(pegawai =>     
            pegawai['nama_pegawai'].toLowerCase().includes(filterSearch.toLowerCase()) ||
            pegawai['jabatan'].toLowerCase().includes(filterSearch.toLowerCase()) ||
            pegawai['nip'].toLowerCase().includes(filterSearch.toLowerCase()) ||
            pegawai['status_kepegawaian'].toLowerCase().includes(filterSearch.toLowerCase())
        )
        
        setFilteredDataPegawai(updatedData)
    }

    useEffect(() => {
        filterDataPegawai()
    }, [filterJabatan, filterKepegawaian, filterPendidikan, filterPensiun, filterSearch])

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
                        if(statusSocket !== 'online') {
                            await getPegawai()
                        }
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
                        if(statusSocket !== 'online') {
                            await getPegawai()
                        }
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

    const handleTotalList = (value) => {
        // Cek kalau totalList melebihi Math Ceil
        const maxPagination = Math.ceil(filteredDataPegawai.length / value)
        if(pagination > maxPagination) {
            setPagination(state => state = maxPagination)
        }
        setTotalList(value)
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
        console.log(selectedPegawai)
        if(!exportExcel['allKolom'] && exportExcel['kolomDataArr'].length < 1 === true) {
            return toast.error('Anda harus memilih kolom data terlebih dahulu!')
        }
        
        document.getElementById(modal).close()
        
        let updatedData
        if(exportExcel['allKolom']) {
            if(type === 'xlsx') {
                if(selectedPegawai.length < 1) {
                    return await exportToXLSX(dataPegawai, 'Data Pegawai', {
                        header: Object.keys(dataPegawai[0]),
                        sheetName: 'Sheet 1'
                    })
                }

                updatedData = dataPegawai.filter(pegawai => selectedPegawai.includes(pegawai.id_pegawai))
                return await exportToXLSX(updatedData, 'Data Pegawai', {
                    header: Object.keys(updatedData[0]),
                    sheetName: 'Sheet 1'
                })
            }else{
                if(selectedPegawai.length < 1) {
                    return await exportToCSV(dataPegawai, 'Data Pegawai', {
                        header: Object.keys(dataPegawai[0]),
                        sheetName: 'Sheet 1'
                    })
                }

                updatedData = dataPegawai.filter(pegawai => selectedPegawai.includes(pegawai.id_pegawai))
                return await exportToCSV(updatedData, 'Data Pegawai', {
                    header: Object.keys(updatedData[0]),
                    sheetName: 'Sheet 1'
                })
            }
        }else{
            if(type === 'xlsx') {
                console.log(selectedPegawai.length)
                if(selectedPegawai.length < 1) {
                    updatedData = dataPegawai.map(obj => {
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
                    updatedData = dataPegawai.filter(pegawai => selectedPegawai.includes(pegawai.id_pegawai))
    
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
                if(selectedPegawai.length < 1) {
                    updatedData = dataPegawai.map(obj => {
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

                updatedData = dataPegawai.filter(pegawai => selectedPegawai.includes(pegawai.id_pegawai))
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
                            <select value={filterJabatan} onChange={e => setFilterJabatan(e.target.value)}  className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                                {listJabatan.map((jabatan, index) => (
                                    <option key={`${jabatan} - ${index}`} value={`${jabatan}`}>{jabatan}</option>
                                ))}
                                <option value="">Semua Jabatan</option>
                            </select>
                            <select value={filterKepegawaian} onChange={e => setFilterKepegawaian(e.target.value)}  className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                                {listStatusPegawai.map((statusPegawai, index) => (
                                    <option key={`${statusPegawai} - ${index}`} value={`${statusPegawai}`}>{statusPegawai}</option>
                                ))}
                                <option value="">Semua Kepegawaian</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 flex gap-2">
                            <select value={filterPendidikan} onChange={e => setFilterPendidikan(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                                {listPendidikanTerakhir.map((pendidikan, index) => (
                                    <option key={`${pendidikan} - ${index}`} value={`${pendidikan}`}>{pendidikan}</option>
                                ))}
                                <option value="">Semua Pendidikan</option>
                            </select>
                            <select value={filterPensiun} onChange={e => setFilterPensiun(e.target.value)}  className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                                <option value="pensiun">Sudah Pensiun</option>
                                <option value="aktif">Masih Aktif</option>
                                <option value="">Semua Status</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <input type="text" onChange={e => setFilterSearch(e.target.value)} className="bg-white w-full px-3 py-2 rounded-lg border transition-all duration-300 my-3 block md:hidden" placeholder="Cari data disini" />
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
                    NIP
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <input type="text" onChange={e => setFilterSearch(e.target.value)} className="w-full md:block hidden px-3 py-2 rounded-lg border transition-all duration-300 text-zinc-800 bg-white outline-none" placeholder="Cari data disini" />
                    <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit block md:hidden" />
                </div>
            </div>
            {loadingFetch !== 'fetched' && (
                <div className="flex justify-center w-full items-center gap-5 py-5 text-blue-600/50">
                    <span className="loading loading-spinner loading-md "></span>
                    Sedang mendapatkan data
                </div>
            )}
            {loadingFetch === 'fetched' && filteredDataPegawai.length < 1 && (
                <div className="flex justify-center w-full items-center gap-5 py-5 text-zinc-600/50">
                    <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-inherit" />
                    Data Kosong
                </div>
            )}
            <div className={`${mont.className} divide-y relative w-full overflow-auto max-h-[350px] h-fit`}>
                {filteredDataPegawai.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((pegawai, index) => (
                    <div key={`${pegawai.id_pegawai} - ${index}`} className="grid grid-cols-12 w-full  *:px-2 *:py-3 text-zinc-700 text-xs hover:bg-zinc-50 ">
                        <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                            <input type="checkbox" name="" id="" checked={selectedPegawai.includes(pegawai.id_pegawai)} onChange={() => handleSelectedPegawai(pegawai.id_pegawai)} />
                            {pegawai.nama_pegawai}
                        </div>
                        <div className="hidden md:flex items-center col-span-2">
                            {pegawai.jabatan}
                        </div>
                        <div className="hidden md:flex items-center col-span-2 gap-3">
                            {pegawai.status_kepegawaian}
                        </div>
                        <div className="hidden md:flex items-center col-span-2">
                            {pegawai.nip}
                        </div>
                        <div className="flex justify-center items-center col-span-4 md:col-span-2 gap-1 md:gap-3">
                            <button type="button" onClick={() => router.push(`/data/pegawai/id/${pegawai.id_pegawai}`)}  className="w-6 h-6 bg-blue-400 hover:bg-blue-500 text-white flex  items-center justify-center">
                                <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" onClick={() => deletePegawai(pegawai.id_pegawai)} className="w-6 h-6 bg-red-400 hover:bg-red-500 text-white flex  items-center justify-center">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" onClick={() => router.push(`/data/pegawai/update/${pegawai.id_pegawai}`)} className="w-6 h-6 bg-amber-400 hover:bg-amber-500 text-white flex  items-center justify-center">
                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex md:items-center md:justify-between px-2 py-1 flex-col md:flex-row border-y border-zinc-300">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">
                            {selectedPegawai.length} Data terpilih
                        </p>
                        <button type="button" onClick={() => deleteSelectedPegawai()} className={`w-7 h-7 ${selectedPegawai && selectedPegawai.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 focus:bg-red-200 focus:text-red-700`}>
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                        </button>
                        <button type="button" onClick={() => setShowSelected(state => !state)} className={`w-7 h-7 flex items-center justify-center rounded-lg   ${showSelected ? 'bg-blue-200 text-blue-700 hover:bg-blue-300' : 'text-zinc-500 bg-zinc-100 hover:bg-zinc-200'} group transition-all duration-300`}>
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                        <button type="button" onClick={() => setSelectedPegawai([])} className={`w-7 h-7 ${selectedPegawai && selectedPegawai.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg  group transition-all duration-300 bg-zinc-100 hover:bg-zinc-200`}>
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
                                <button type="button" onClick={() => document.getElementById('export_xlsx').showModal()} className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    XLSX
                                </button>
                                <button type="button" onClick={() => document.getElementById('export_csv').showModal()} className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    CSV
                                </button>
                            </li>
                        </ul>
                        <dialog id="export_csv" className="modal">
                            <div className="modal-box">
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
                                            <select onChange={e => handleChangeExportExcel('kolomDataArr', e.target.value)} className="w-full text-sm md:w-3/5 py-2 px-3 border rounded-lg cursor-pointer focus:border-zinc-500 hover:border-zinc-500 max-h-[100px]">
                                                {Object.keys(exportKolom).map((kolom, index) => (
                                                    <option key={index} value={kolom}>{exportKolom[kolom]}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <hr className="my-1 opacity-0" />
                                        <p className="text-sm opacity-70">
                                            Daftar Kolom Data
                                        </p>
                                        <div className="p-3 rounded-lg border w-full flex flex-wrap gap-1">
                                            {exportExcel.kolomDataArr.map((kolomData, index) => (
                                                <div key={`${index} - ${index}`} className="p-2 rounded bg-zinc-100 text-xs flex items-center justify-center gap-2 font-medium">
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
                            <div className="modal-box">
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
                                            <select onChange={e => handleChangeExportExcel('kolomDataArr', e.target.value)} className="w-full text-sm md:w-3/5 py-2 px-3 border rounded-lg cursor-pointer focus:border-zinc-500 hover:border-zinc-500 max-h-[100px]">
                                                {Object.keys(exportKolom).map((kolom, index) => (
                                                    <option key={index} value={kolom}>{exportKolom[kolom]}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <hr className="my-1 opacity-0" />
                                        <p className="text-sm opacity-70">
                                            Daftar Kolom Data
                                        </p>
                                        <div className="p-3 rounded-lg border w-full flex flex-wrap gap-1">
                                            {exportExcel.kolomDataArr.map((kolomData, index) => (
                                                <div key={`${index} - ${index}`} className="p-2 rounded bg-zinc-100 text-xs flex items-center justify-center gap-2 font-medium">
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
                        {(totalList * pagination) - totalList + 1} - {(totalList * pagination) > dataPegawai.length ? dataPegawai.length : totalList * pagination} dari {dataPegawai.length} data
                    </p>
                    <div className={`${mont.className} px-2 text-xs flex items-center justify-center gap-3`}>
                        <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                        </button>
                        <p className="font-medium text-zinc-600">
                            {pagination}
                        </p>
                        <button type="button" onClick={() => setPagination(state => state < Math.ceil(dataPegawai.length / totalList) ? state + 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
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
            <hr className="my-3 opacity-0" />
        </MainLayoutPage>
    )
}