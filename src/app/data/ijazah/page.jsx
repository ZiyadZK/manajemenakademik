'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta } from "@/config/fonts"
import { date_getDay, date_getMonth, date_getYear, date_integerToDate } from "@/lib/dateConvertes"
import { model_createAlumni, model_deleteAlumni, model_getAllAlumni, model_updateAlumni } from "@/lib/model/alumniModel"
import { createMultiIjazah, deleteMultiIjazah, getAllIjazah, updateMultiIjazah } from "@/lib/model/ijazahModel"
import { createMutasiSiswa } from "@/lib/model/mutasiSiswaModel"
import { logRiwayat } from "@/lib/model/riwayatModel"
import { createMultiSiswa, createSingleSiswa } from "@/lib/model/siswaModel"
import { exportToXLSX,  xlsx_getData, xlsx_getSheets } from "@/lib/xlsxLibs"
import {  faAnglesLeft, faAnglesRight, faArrowDown,  faArrowUp, faArrowsUpDown, faCheck, faCheckDouble, faCheckSquare,  faDownload, faEdit, faFile, faPlus, faPowerOff, faPrint, faSave, faTrash, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import Image from "next/image"
import { createRef, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"

const mmToPx = mm => mm * (96 / 25.4)

const allowedMIMEType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
]

const exportFormatKolom = {
    no: 'Nomor',
    tanggal_diambil: 'Tanggal di Ambil',
    no_ijazah: 'Nomor Ijazah',
    fk_ijazah_nis: 'NIS Siswa',
    nama_pengambil: 'Nama Pengambil',
    status: 'Status',
    kelas: 'Kelas',
    jurusan: 'Jurusan',
    rombel: 'Rombel',
    nama_siswa: 'Nama Siswa',
    nis: 'NIS',
    nisn: 'NISN',
    tahun_masuk: 'Tahun Masuk',
    tanggal_keluar: 'Tanggal Keluar',
    tanggal_diambil: 'Tanggal diambil',
    no_ijazah: 'Nomor Ijazah',
    nama_pengambil: 'Nama Pengambil',
    status: 'Status diambil'
}

const formatKolom = {
    tanggal_diambil: 'Tanggal di Ambil',
    no_ijazah: 'Nomor Ijazah',
    fk_ijazah_nis: 'NIS Siswa',
    nama_pengambil: 'Nama Pengambil',
    status: 'Status'
}

const formatTambahForm = {
    tanggal_diambil: '',
    no_ijazah: '',
    fk_ijazah_nis: '',
    nama_pengambil: '',
    status: ''
}

const showModal = (id) => {
    return {
        show: (type) => {
            if(type === 'show') {
                document.getElementById(id).showModal()
            }else{
                document.getElementById(id).close()
            }
        }
    }
}

const formatSort = {
    nama_siswa: '', nis: '', nisn: '', tahun_masuk: ''
}

export default function DataIjazahPage() {

    const [data, setData] = useState([])
    const [importFile, setImportFile] = useState(null)
    const [sheetsFile, setSheetsFile] = useState([])
    const [loadingFetch, setLoadingFetch] = useState({
        data: '', alumni: ''
    })
    const [filteredData, setFilteredData] = useState([])
    const [dataAlumni, setDataAlumni] = useState([])
    const [filteredDataAlumni, setFilteredDataAlumni] = useState([])
    const [searchDataAlumni, setSearchDataAlumni] = useState('')
    const [formTambah, setFormTambah] = useState(formatTambahForm)
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [selectAll, setSelectAll] = useState(false)
    const [filterData, setFilterData] = useState({
        kelas: [], jurusan: [], rombel: []
    })

    const [sortData, setSortData] = useState(formatSort)

    const getData = async () => {
        setLoadingFetch(state => ({...state, data: 'loading'}))
        const response = await getAllIjazah()
        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)
        }
        setLoadingFetch(state => ({...state, data: 'fetched'}))
    }

    const getDataAlumni = async () => {
        setLoadingFetch(state => ({...state, alumni: 'loading'}))
        const response = await model_getAllAlumni()
        if(response.success) {
            setDataAlumni(response.data)
            setFilteredDataAlumni(response.data)
        }
        setLoadingFetch(state => ({...state, alumni: 'fetched'}))
    }

    useEffect(() => {
        getData()
        getDataAlumni()
    }, [])

    const submitFormTambah = async (e, modal) => {
        e.preventDefault()
        
        if(formTambah['fk_ijazah_nis'] === '') {
            return
        }

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: async () => {
                const response = await createMultiIjazah([formTambah])
                if(response.success) {
                    await logRiwayat({
                        aksi: 'Tambah',
                        kategori: 'Data Ijazah',
                        keterangan: `Menambahkan 1 Data`,
                        records: JSON.stringify({...formTambah})
                    })

                    setFormTambah(formatTambahForm)

                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menambahkan data ijazah ',
                        timer: 3000,
                        timerProgressBar: true
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan saat memproses data, hubungi Administrator!',
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const submitDeleteData = async (nis) => {
        console.log(nis)
        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                let response

                if(nis) {
                    response = await deleteMultiIjazah([nis])
                }else{
                    response = await deleteMultiIjazah(selectedData)
                }

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Hapus',
                        kategori: 'Data Ijazah',
                        keterangan: `Menghapus ${nis ? '1' : selectedData.length} Data`,
                        records: JSON.stringify(nis ? {nis} : {nis: selectedData})
                    })
                    setSelectedData([])
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menghapus data ijazah'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        icon: 'error',
                        text: 'Terjadi kesalahan saat memproses data, hubungi administrator!'
                    })
                }
            }
        })
    }

    const handleSelectData = (nis) => {
        setSelectedData(state => {
            if(state.includes(nis)) {
                return state.filter(value => value !== nis)
            }else{
                return [...state, nis]
            }
        })
    }

    const submitEditData = (e, modal, nis) => {
        e.preventDefault()

        showModal(modal).show('close')

        const payload = {
            no_ijazah: e.target[0].value,
            nama_pengambil: e.target[1].value,
            tanggal_diambil: e.target[2].value,
            status: e.target[3].value
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await updateMultiIjazah([nis], payload)

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Ubah',
                        kategori: 'Data Ijazah',
                        keterangan: `Mengubah 1 Data`,
                        records: JSON.stringify({nis, data: payload})
                    })
                    setSelectedData([])
                    setSelectAll(false)
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah data ijazah tersebut',
                        icon: 'success'
                    })
                }else{
                    showModal(modal).show('show')
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat error disaat memproses data, hubungi Administrator!',
                        icon: 'error'
                    })
                }
            }
        })
    }

    useEffect(() => {
        let updatedData = data

        if(searchFilter !== '') {
            updatedData = updatedData.filter(value =>
                value['nama_siswa'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nis'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nisn'].toLowerCase().includes(searchFilter.toLowerCase())
            )
        }

        if(filterData['kelas'].length > 0) {
            updatedData = updatedData.filter(value => filterData['kelas'].includes(value['kelas']))
        }

        if(filterData['jurusan'].length > 0) {
            updatedData = updatedData.filter(value => filterData['jurusan'].includes(value['jurusan']))
        }

        if(filterData['rombel'].length > 0) {
            updatedData = updatedData.filter(value => filterData['rombel'].includes(value['rombel']))
        }

        let sortedData = []

        Object.keys(sortData).forEach(kolom => {
            if(sortData[kolom] !== '') {
                sortedData = updatedData.sort((a, b) => {
                    if(sortData[kolom] === 'asc') {
                        if(a[kolom] < b[kolom]) return -1;
                        if(a[kolom] > b[kolom]) return 1;
                        return 0
                    }

                    if(sortData[kolom] === 'dsc') {
                        if(a[kolom] < b[kolom]) return 1;
                        if(a[kolom] > b[kolom]) return -1;
                        return 0
                    }
                })
            }
        })

        setFilteredData(sortedData.length < 1 ? updatedData : sortedData)
    }, [searchFilter, filterData, sortData, data])

    const handleFilterData = (kolom, value) => {
        setFilterData(state => {
            let updatedState
            let updatedFilter

            if(state[kolom].includes(value)) {
                updatedFilter = state[kolom].filter(v => v !== value)
                updatedState = {...state, [kolom]: updatedFilter}
            }else{
                updatedState = {...state, [kolom]: [...state[kolom], value]}
            }

            return updatedState
        })
    }

    const submitImportFile = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        const namaSheet = e.target[1].value

        const response = await xlsx_getData(importFile, namaSheet)
        if(response.success) {
            const headersImportFile = Object.keys(response.data[0])
            const headersDatabase = Object.keys(formatKolom)

            if(headersDatabase.length > headersImportFile.length) {
                return Swal.fire({
                    title: 'Gagal',
                    text: 'Kolom data tidak sesuai dengan yang ada di database!',
                    icon: 'error'
                }).then(() => {
                    document.getElementById(modal).showModal()
                })
            }

            if(headersImportFile.map(value => headersDatabase.includes(value) ? true : false).includes(false)) {
                return Swal.fire({
                    title: 'Gagal',
                    text: 'Terdapat kolom data yang tidak sesuai dengan yang ada di database, silahkan cek kembali!',
                    icon: 'error'
                }).then(() => {
                    document.getElementById(modal).showModal()
                })
            }

            const dataImport = response.data

            Swal.fire({
                title: 'Sedang memproses data',
                timer: 60000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                didOpen: async () => {
                    const response = await createMultiIjazah(dataImport)

                    if(response.success) {
                        await logRiwayat({
                            aksi: 'Import',
                            kategori: 'Data Ijazah',
                            keterangan: `Mengimport ${dataImport.length} Data`,
                            records: JSON.stringify({...dataImport})
                        })
                        await getData()
                        Swal.fire({
                            title: 'Sukses',
                            text: `Berhasil mengimport data Ijazah!`,
                            icon: 'success'
                        }).then(() => {
                            e.target[0].value = ''
                            e.target[1].value = ''
                            setImportFile(null)
                            setSheetsFile([])
                            document.getElementById(modal).showModal()
                        })
                    }else{
                        Swal.fire({
                            title: 'Gagal',
                            text: `Gagal mengimport data Ijazah!`,
                            icon: 'error'
                        }).then(() => {
                            document.getElementById(modal).showModal()
                        })
                    }
                }
            })

        }

    }

    const handleImportFile = async () => {
        if(importFile !== null) {
            const file = importFile
            if(!allowedMIMEType.includes(file.type)) {
                console.log('salah file')
                return setImportFile(null)
            }
            
            // Get sheets
            if(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const sheets = await xlsx_getSheets(importFile)
                setSheetsFile(Object.keys(sheets))
            }
        }
    }

    useEffect(() => {
        handleImportFile()
    }, [importFile])


    const handleSortData = (key) => {
        setSortData(state => {
            if(state[key] === '') {
                return {...formatSort, [key]: 'dsc'}
            }else if(state[key] === 'asc') {
                return {...formatSort, [key]: ''}
            }else if(state[key] === 'dsc') {
                return {...formatSort, [key]: 'asc'}
            }
        })
    }

    const submitExportData = async (e, modal) => {
        e.preventDefault()

        const exportAll = e.target[0].checked

        const exportKolomChecked = Object.keys(data[0]).filter((value, index) => e.target[index + 1].checked).map((value, index) => value)

        if(!exportAll && exportKolomChecked.length < 1) {
            return
        }

        if(exportAll) {
            if(selectedData.length < 1) {
                await logRiwayat({
                    aksi: 'Export',
                    kategori: 'Data Ijazah',
                    keterangan: `Mengexport ${data.length} Data sebagai EXCEL`,
                    records: JSON.stringify({nis: data.map(value => value['nis'])})
                })
                return await exportToXLSX(data, 'SIMAK - Data Ijazah', {
                    header: Object.keys(data[0]),
                    sheetName: 'DATA IJAZAH'
                })
            }else{
                const dataImport = data.filter(value => selectedData.includes(value['nis']))

                await logRiwayat({
                    aksi: 'Export',
                    kategori: 'Data Ijazah',
                    keterangan: `Mengexport ${dataImport.length} Data sebagai EXCEL`,
                    records: JSON.stringify({nis: dataImport.map(value => value['nis'])})
                })

                return await exportToXLSX(dataImport, 'SIMAK - Data Ijazah', {
                    header: Object.keys(dataImport[0]),
                    sheetName: 'DATA IJAZAH'
                })
            }
        }else{
            let dataImport = data.map(value => {
                let obj = {}
                Object.keys(value).map(kolom => {
                    if(exportKolomChecked.includes(kolom)) {
                        obj[kolom] = value[kolom]
                    }
                })
                return obj
            })
            if(selectedData.length < 1) {
                await logRiwayat({
                    aksi: 'Export',
                    kategori: 'Data Ijazah',
                    keterangan: `Mengexport ${dataImport.length} Data sebagai EXCEL`,
                    records: JSON.stringify({nis: dataImport.map(value => value['nis'])})
                })

                return await exportToXLSX(dataImport, 'SIMAK - Data Ijazah', {
                    header: Object.keys(dataImport[0]),
                    sheetName: 'DATA IJAZAH'
                })
            }else{
                let dataImport = data.filter(value => selectedData.includes(value['nis'])).map(value => {
                    let obj = {}
                    Object.keys(value).map(kolom => {
                        if(exportKolomChecked.includes(kolom)) {
                            obj[kolom] = value[kolom]
                        }
                    })
                    return obj
                })
                await logRiwayat({
                    aksi: 'Export',
                    kategori: 'Data Ijazah',
                    keterangan: `Mengexport ${dataImport.length} Data sebagai EXCEL`,
                    records: JSON.stringify({nis: dataImport.map(value => value['nis'])})
                })

                return await exportToXLSX(dataImport, 'SIMAK - Data Ijazah', {
                    header: Object.keys(dataImport[0]),
                    sheetName: 'DATA IJAZAH'
                })
            }
        }
    }

    const submitUbahStatusIjazah = async (e, modal, type, nis) => {
        if(e) {
            e.preventDefault()
        }

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Sedang memproses data',
            showConfirmButton: false,
            timer: 60000,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                let payload = {}
                if(type === 'SUDAH DIAMBIL') {
                    payload = {
                        nama_pengambil: e.target[0].value === '' ? 'Sendiri' : e.target[0].value,
                        tanggal_diambil: e.target[1].value === '' ? `${date_getYear()}-${date_getMonth()}-${date_getDay()}` : e.target[1].value,
                        status: 'SUDAH DIAMBIL'
                    }
                }else{
                    payload = {
                        nama_pengambil: '',
                        tanggal_diambil: '',
                        status: 'BELUM DIAMBIL'
                    }
                }

                const response = await updateMultiIjazah(nis ? [nis] : selectedData, payload)
                await logRiwayat({
                    aksi: 'Ubah',
                    kategori: 'Data Ijazah',
                    keterangan: `Mengubah ${nis ? '1' : selectedData.length} Status Data`,
                    records: JSON.stringify(nis ? {nis, payload} : {nis: selectedData, payload})
                })

                if(response.success) {
                    setSelectedData([])
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah status ijazah siswa tersebut',
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan disaat sedang memproses data, hubungi Administrator!',
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }

            }
        })

    }

    useEffect(() => {
        setFilteredDataAlumni(state => {
            let updatedData = dataAlumni

            if(searchDataAlumni !== '') {
                updatedData = updatedData.filter(value => 
                    value['nama_siswa'].toLowerCase().includes(searchDataAlumni.toLowerCase()) ||
                    value['nis'].toLowerCase().includes(searchDataAlumni.toLowerCase()) ||
                    value['nisn'].toLowerCase().includes(searchDataAlumni.toLowerCase()) ||
                    value['nik'].toLowerCase().includes(searchDataAlumni.toLowerCase()) 
                )
            }

            return updatedData
        })
    }, [searchDataAlumni])

    return (
        <MainLayoutPage>
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                <div className="text-xs md:text-sm no-scrollbar">
                    <div className="flex items-center gap-5 w-full md:w-fit text-xs md:text-sm">
                        <button type="button" onClick={() => document.getElementById('tambah_ijazah').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit opacity-70" />
                            Tambah
                        </button>
                        <dialog id="tambah_ijazah" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded md:max-w-[1000px] border dark:border-zinc-800">
                                <form method="dialog">
                                    <button onClick={() => setFormTambah(formatTambahForm)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Tambah Ijazah</h3>
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={e => submitFormTambah(e, `tambah_ijazah`)} className="flex gap-5 flex-col md:flex-row">
                                    <div className="w-full md:w-1/2 space-y-2">
                                        <label className="input input-bordered flex items-center gap-2 input-sm dark:bg-zinc-800">
                                            <input type="text" className="grow" value={searchDataAlumni} onChange={e => setSearchDataAlumni(e.target.value)} placeholder="Cari data alumni disini" />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                                className="h-4 w-4 opacity-70">
                                                <path
                                                fillRule="evenodd"
                                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                                clipRule="evenodd" />
                                            </svg>
                                        </label>
                                        <div className="relative w-full overflow-auto space-y-2 max-h-[300px]">
                                            {loadingFetch['alumni'] !== 'fetched' && (
                                                <div className="w-full flex justify-center items-center">
                                                    <div className="loading loading-sm text-zinc-500 loading-spinner"></div>
                                                </div>
                                            )}
                                            {loadingFetch['alumni'] === 'fetched' && dataAlumni.length < 1 && (
                                                <div className="w-full flex justify-center items-center text-zinc-500">
                                                    Data Alumni Kosong!
                                                </div>
                                            )}
                                            {filteredDataAlumni.slice(0, 20).map((value, index) => (
                                                <label key={index} htmlFor={index} className="flex items-center w-full justify-between p-3 border dark:border-zinc-800 hover:border-zinc-700 dark:hover:border-zinc-400 rounded-lg text-xs cursor-pointer ease-out duration-200 has-[:checked]:border-zinc-400">
                                                    <p>
                                                        {value['nama_siswa']}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="opacity-50">
                                                            {value['kelas']} {value['jurusan']} {value['rombel']}
                                                         </p>
                                                        <input type="radio" id={index} value={value['nis']} checked={formTambah['fk_ijazah_nis'] === value['nis']} onChange={() => setFormTambah(state => ({...state, fk_ijazah_nis: value['nis']}))} name="radio" className="" />
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 divide-y dark:divide-zinc-800">
                                        <div className="flex py-3 flex-col md:flex-row gap-1 md:items-center">
                                            <div className="w-full md:w-1/3 opacity-60">
                                                NIS
                                            </div>
                                            <div className="w-full md:w-2/3">
                                                {formTambah['fk_ijazah_nis']}
                                            </div>
                                        </div>
                                        <div className="flex py-3 flex-col md:flex-row gap-1 md:items-center">
                                            <div className="w-full md:w-1/3 opacity-60">
                                                No Ijazah
                                            </div>
                                            <div className="w-full md:w-2/3">
                                                <input required type="text" value={formTambah['no_ijazah']} onChange={e => setFormTambah(state => ({...state, no_ijazah: e.target.value}))} className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Nomor Ijazah" />
                                            </div>
                                        </div>
                                        <div className="flex py-3 flex-col md:flex-row gap-1 md:items-center">
                                            <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md flex justify-center items-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit opacity-50" />
                                                Simpan
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                
                            </div>
                        </dialog>
                        <button type="button" onClick={() => document.getElementById('import_ijazah').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit opacity-70" />
                            Import
                        </button>
                        <dialog id="import_ijazah" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded border dark:border-zinc-800">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Import Data</h3>
                                <hr className="my-2 opacity-0" />
                                
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={e => submitImportFile(e, 'import_ijazah')} className="text-xs space-y-2">
                                    <p className="opacity-60">
                                        File harus berupa .xlsx atau .csv
                                    </p>
                                    <input type="file" id="input_import_file" onChange={e => setImportFile(e.target.files[0])} className="text-sm cursor-pointer w-full" />
                                    <p className="opacity-60">
                                        Pilih Sheet jika anda menggunakan .xlsx
                                    </p>
                                    <select id="select_sheet" className="px-3 py-2 w-full rounded-md border dark:border-zinc-800 dark:bg-zinc-900">
                                        <option value="" disabled>-- Pilih Sheet --</option>
                                        {sheetsFile.map((value, index) => (
                                            <option key={index} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                    <button type="submit" className="w-full md:w-fit px-3 py-2 text-sm rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3">
                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </dialog>
                    </div>
                    <hr className="my-5 dark:opacity-10" />
                    
                    {loadingFetch['data'] !== 'fetched' && (
                        <div className="loading loading-spinner loading-sm opacity-50"></div>
                    )}
                    {loadingFetch['data'] === 'fetched' && data.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="opacity-70 w-full md:w-1/6">
                                    Kelas
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['kelas']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('kelas', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['kelas'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="opacity-70 w-full md:w-1/6">
                                    Jurusan
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['jurusan']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('jurusan', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['jurusan'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="opacity-70 w-full md:w-1/6">
                                    Rombel
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['rombel']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('rombel', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['rombel'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                        </div>
                    )}

                    <hr className="my-5 dark:opacity-10" />
                    
                    <div className="relative overflow-auto w-full max-h-[400px]">
                        <div className="grid grid-cols-12 p-3 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 sticky top-0 mb-2">
                            <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                <input type="checkbox" className="cursor-pointer" />
                                Nama Siswa
                                <button type="button" onClick={() => handleSortData('nama_siswa')} className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={sortData['nama_siswa'] === '' ? faArrowsUpDown : (sortData['nama_siswa'] === 'asc' ? faArrowUp : faArrowDown)} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Kelas
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                NIS
                                <button type="button" onClick={() => handleSortData('nis')} className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={sortData['nis'] === '' ? faArrowsUpDown : (sortData['nis'] === 'asc' ? faArrowUp : faArrowDown)} className="w-3 h-3 text-inherit" />
                                </button> 
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Nomor Ijazah
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Sudah diambil
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center gap-3">
                                <input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="w-full dark:bg-zinc-900 bg-white px-2 py-1 rounded border dark:border-zinc-700" placeholder="Cari disini" />
                            </div>
                        </div>
                        {loadingFetch['data'] !== 'fetched' && (
                            <div className="w-full flex items-center justify-center">
                                <div className="loading loading-spinner loading-sm text-zinc-500"></div>
                            </div>
                        )}
                        {loadingFetch['data'] === 'fetched' && data.length < 1 && (
                            <div className="w-full flex items-center justify-center text-zinc-500">
                                Data Siswa tidak ada!
                            </div>
                        )}
                        {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                            <div key={`${value['nis']}`} className="grid grid-cols-12 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 ease-out duration-300 text-xs">
                                <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                    <input type="checkbox" checked={selectedData.includes(value['nis'])} onChange={() => handleSelectData(value['nis'])} className="cursor-pointer" />
                                    {value['nama_siswa']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['kelas']} {value['jurusan']} {value['rombel']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['nis']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['no_ijazah']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    <button type="button" disabled={value['status'] === 'SUDAH DIAMBIL'} onClick={() => document.getElementById(`ubah_status_sudah_${value['nis']}`).showModal()} className={`px-2 py-1 group rounded-md ${value['status'] === 'SUDAH DIAMBIL' ? 'bg-green-500 dark:bg-green-500/10 border border-green-500 text-white dark:text-green-500' : 'bg-zinc-200 dark:bg-zinc-800 border dark:border-zinc-700 hover:bg-green-500 dark:hover:border-green-500 dark:hover:text-green-500 hover:text-white dark:hover:bg-green-500/10'} flex items-center justify-center w-fit gap-2`}>
                                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit opacity-50" />
                                        <span className={`${value['status'] === 'SUDAH DIAMBIL' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                            Ya
                                        </span>
                                    </button>
                                    <button type="button" disabled={value['status'] === 'BELUM DIAMBIL'} onClick={() => document.getElementById(`ubah_status_belum_${value['nis']}`).showModal()} className={`px-2 py-1 group rounded-md ${value['status'] === 'BELUM DIAMBIL' ? 'bg-red-500 dark:bg-red-500/10 border border-red-500 text-white dark:text-red-500' : 'bg-zinc-200 dark:bg-zinc-800 border dark:border-zinc-700 hover:bg-red-500 dark:hover:border-red-500 dark:hover:text-red-500 hover:text-white dark:hover:bg-red-500/10'} flex items-center justify-center w-fit gap-2`}>
                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit opacity-50" />
                                        <span className={`${value['status'] === 'BELUM DIAMBIL' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                            Tidak
                                        </span>
                                    </button> 
                                </div>
                                <div className="col-span-5 md:col-span-2 flex items-center justify-center md:gap-3 gap-1">
                                    <dialog id={`ubah_status_sudah_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ijazah Sudah diambil?</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={(e) => submitUbahStatusIjazah(e, `ubah_status_sudah_${value['nis']}`, 'SUDAH DIAMBIL', value['nis'])} className="space-y-6 md:space-y-3">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Siswa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_siswa']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Kelas
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['kelas']} {value['jurusan']} {value['rombel']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NIS
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nis']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NISN
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nisn']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tahun Masuk
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tahun_masuk']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal Lulus
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {date_getDay(value['tanggal_keluar'])} {date_getMonth('string', value['tanggal_keluar'])} {date_getYear(value['tanggal_keluar'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nomor Ijazah
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            {value['no_ijazah']}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Pengambil
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input type="text" defaultValue={value['nama_pengambil']} className="w-full bg-transparent rounded-md border px-3 py-2 dark:border-zinc-800" placeholder="Nama Pengambil" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal diambil
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input type="date" defaultValue={value['tanggal_diambil']} className="w-full bg-transparent rounded-md border px-3 py-2 dark:border-zinc-800" placeholder="Nama Pengambil" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="md:text-end">
                                                    Apakah anda sudah yakin?
                                                </p>
                                                <div className="flex md:justify-end">
                                                    <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                        Ya, Saya yakin
                                                    </button>
                                                </div>
                                            </form>
                                            <hr className="my-2 opacity-0" />
                                        </div>
                                    </dialog>
                                    <dialog id={`ubah_status_belum_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ijazah Belum diambil?</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={(e) => submitUbahStatusIjazah(e, `ubah_status_belum_${value['nis']}`, 'BELUM DIAMBIL', value['nis'])} className="space-y-6 md:space-y-3">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Siswa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_siswa']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Kelas
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['kelas']} {value['jurusan']} {value['rombel']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NIS
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nis']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NISN
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nisn']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tahun Masuk
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tahun_masuk']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal Lulus
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {date_getDay(value['tanggal_keluar'])} {date_getMonth('string', value['tanggal_keluar'])} {date_getYear(value['tanggal_keluar'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nomor Ijazah
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            {value['no_ijazah']}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="md:text-end">
                                                    Apakah anda sudah yakin?
                                                </p>
                                                <div className="flex md:justify-end">
                                                    <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                        Ya, Saya yakin
                                                    </button>
                                                </div>
                                            </form>
                                            <hr className="my-2 opacity-0" />
                                            
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => document.getElementById(`info_ijazah_${value['nis']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`info_ijazah_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Informasi Ijazah</h3>
                                            <hr className="my-2 opacity-0" />
                                            
                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Siswa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_siswa']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Kelas
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['kelas']} {value['jurusan']} {value['rombel']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NIS
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nis']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NISN
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nisn']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tahun Masuk
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tahun_masuk']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal Lulus
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {date_getDay(value['tanggal_keluar'])} {date_getMonth('string', value['tanggal_keluar'])} {date_getYear(value['tanggal_keluar'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nomor Ijazah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['no_ijazah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Pengambil
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_pengambil']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal di ambil
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tanggal_diambil'] !== '' && (
                                                                <>
                                                                    {date_getDay(value['tanggal_diambil'])} {date_getMonth('string', value['tanggal_diambil'])} {date_getYear(value['tanggal_diambil'])}
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Sudah diambil
                                                        </p>
                                                        <div className="w-full md:w-2/3 flex items-center gap-3">
                                                            <button type="button" onClick={() => document.getElementById(`ubah_status_sudah_${value['nis']}`).showModal()} disabled={value['status'] === 'SUDAH DIAMBIL'} className={`px-2 py-1 group rounded-md ${value['status'] === 'SUDAH DIAMBIL' ? 'bg-green-500 dark:bg-green-500/10 border border-green-500 text-white dark:text-green-500' : 'bg-zinc-200 dark:bg-zinc-800 border dark:border-zinc-700 hover:bg-green-500 dark:hover:border-green-500 dark:hover:text-green-500 hover:text-white dark:hover:bg-green-500/10'} flex items-center justify-center w-fit gap-2`}>
                                                                <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit opacity-50" />
                                                                <span className={`${value['status'] === 'SUDAH DIAMBIL' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                                                    Ya
                                                                </span>
                                                            </button>
                                                            <button type="button" onClick={() => document.getElementById(`ubah_status_belum_${value['nis']}`).showModal()} disabled={value['status'] === 'BELUM DIAMBIL'} className={`px-2 py-1 group rounded-md ${value['status'] === 'BELUM DIAMBIL' ? 'bg-red-500 dark:bg-red-500/10 border border-red-500 text-white dark:text-red-500' : 'bg-zinc-200 dark:bg-zinc-800 border dark:border-zinc-700 hover:bg-red-500 dark:hover:border-red-500 dark:hover:text-red-500 hover:text-white dark:hover:bg-red-500/10'} flex items-center justify-center w-fit gap-2`}>
                                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit opacity-50" />
                                                                <span className={`${value['status'] === 'BELUM DIAMBIL' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                                                    Tidak
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => document.getElementById(`edit_ijazah_${value['nis']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`edit_ijazah_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ubah Ijazah</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={(e) => submitEditData(e, `edit_ijazah_${value['nis']}`, value['nis'])} className="space-y-6 md:space-y-3">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Siswa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_siswa']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Kelas
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['kelas']} {value['jurusan']} {value['rombel']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NIS
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nis']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NISN
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nisn']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tahun Masuk
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tahun_masuk']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal Lulus
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {date_getDay(value['tanggal_keluar'])} {date_getMonth('string', value['tanggal_keluar'])} {date_getYear(value['tanggal_keluar'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nomor Ijazah
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input type="text" defaultValue={value['no_ijazah']} className="w-full bg-transparent rounded-md border px-3 py-2 dark:border-zinc-800" placeholder="No Ijazah" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Pengambil
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input type="text" required defaultValue={value['nama_pengambil']} className="w-full bg-transparent rounded-md border px-3 py-2 dark:border-zinc-800" placeholder="Nama Pengambil" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal diambil
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input type="date" required defaultValue={value['tanggal_diambil']} className="w-full bg-transparent rounded-md border px-3 py-2 dark:border-zinc-800" placeholder="Nama Pengambil" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Sudah diambil
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <select required defaultValue={value['status']} className="w-full dark:bg-zinc-900 rounded-md border px-3 py-2 dark:border-zinc-800">
                                                                <option value="" disabled>-- Pilih --</option>
                                                                <option value="BELUM DIAMBIL">TIDAK</option>
                                                                <option value="SUDAH DIAMBIL">YA</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <div className="flex md:justify-end">
                                                    <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                        Simpan
                                                    </button>
                                                </div>
                                            </form>
                                            <hr className="my-2 opacity-0" />
                                            
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => submitDeleteData(value['nis'])} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            {selectedData.length > 0 && (
                                <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                    <FontAwesomeIcon icon={faCheckSquare} className="w-3 h-3 text-inherit" />
                                    {selectedData.length} Data
                                </div>
                            )}
                            <div className="flex items-center justify-center w-full md:w-fit gap-1 md:gap-3 px-3">
                                {loadingFetch['data'] !== 'fetched' && (
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <div className="loading loading-xs loading-spinner opacity-50"></div>
                                    </div>
                                )}
                                {loadingFetch['data'] === 'fetched' && data.length > 0 && (
                                    <button type="button" onClick={() => document.getElementById(`export`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-green-500 dark:hover:border-green-500/50 hover:bg-green-100 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faUpload} className="w-3 h-3 text-inherit" />
                                    </button>
                                )}
                                <dialog id={`export`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                    <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 md:max-w-[800px]">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Export Data Siswa</h3>
                                        <hr className="my-2 opacity-0" />
                                        <form onSubmit={e => submitExportData(e, 'export')}>

                                            <label  htmlFor={`cb_export_allData`} className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ease-out duration-200 flex items-center gap-3 cursor-pointer w-fit">
                                                <input type="checkbox" defaultChecked id={`cb_export_allData`} />
                                                Export semua kolom
                                            </label>
                                            <hr className="my-2 opacity-0" />
                                            <p>
                                                Silahkan pilih kolom di bawah ini jika ingin export kolom tertentu
                                            </p>
                                            <hr className="my-2 opacity-0" />
                                            {loadingFetch['data'] !== 'fetched' && (
                                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                                            )}
                                            {loadingFetch['data'] === 'fetched' && data.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs w-full overflow-auto max-h-[200px]">
                                                    {Object.keys(data[0]).map((kolom, index) => (
                                                        <label key={index} htmlFor={`cb_export_${index}`} className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ease-out duration-200 flex items-center gap-3 cursor-pointer">
                                                            <input type="checkbox" value={kolom} id={`cb_export_${index}`} />
                                                            {exportFormatKolom[kolom]}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                            <hr className="my-2 dark:opacity-10" />
                                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                <button type="submit" className="px-3 py-2 rounded-md w-full md:w-fit flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                    Export
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </dialog>
                                {selectedData.length > 0 && (
                                    <>
                                        <button type="button" onClick={() => submitDeleteData()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                        </button>
                                    </>
                                )}
                            </div>
                            <p className="pl-3  w-full md:w-fit">
                                Total {data.length} Data
                            </p>
                        </div>
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesLeft} className="w-3 h-3 text-inherit" />
                                </button>
                                {pagination}
                                <button type="button" onClick={() => setPagination(state => state < Math.ceil(data.length / totalList) ? state + 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesRight} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 pl-3  w-full md:w-fit">
                                <select value={totalList} onChange={e => setTotalList(e.target.value)} className="select select-bordered w-full select-sm dark:bg-zinc-800 bg-zinc-100">
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}