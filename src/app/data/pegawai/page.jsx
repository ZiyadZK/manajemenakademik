'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta, mont, rale } from "@/config/fonts"
import { exportToCSV } from "@/lib/csvLibs"
import { date_getDay, date_getMonth, date_getYear, date_integerToDate } from "@/lib/dateConvertes"
import { createMultiPegawai, createSinglePegawai, deleteManyPegawai, deleteSinglePegawai, getAllPegawai, updateSinglePegawai } from "@/lib/model/pegawaiModel"
import { createPendidikan, deletePendidikan, updatePendidikan } from "@/lib/model/pendidikanModel"
import { logRiwayat } from "@/lib/model/riwayatModel"
import { createSertifikat, deleteSertifikat, updateSertifikat } from "@/lib/model/sertifikatModel"
import { exportToXLSX, xlsx_getData, xlsx_getSheets } from "@/lib/xlsxLibs"
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faArrowDown, faArrowRight, faArrowUp, faArrowsUpDown, faCheckSquare, faCircleCheck, faCircleXmark, faDownload, faEdit, faEllipsisH, faEllipsisV, faExclamationCircle, faEye, faFile, faFilter, faInfoCircle, faPlus, faPlusSquare, faPrint, faSave, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
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

const allowedMIMEType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
]

const formatKolom = {
    pegawai: {
        nama_pegawai: 'Nama Pegawai',
        email_pegawai: 'Email Pegawai',
        jabatan: 'Jabatan',
        status_kepegawaian: 'Status Kepegawaian',
        nik: 'NIK',
        nip: 'NIP',
        nuptk: 'NUPTK',
        tmpt_lahir: 'Tempat Lahir',
        tanggal_lahir: 'Tanggal Lahir',
        tmt: 'Tamat Kepegawaian',
        pensiun: 'Pensiun',
        keterangan: 'Keterangan'
    },
    sertifikat: {
        fk_sertifikat_id_pegawai: 'ID Pegawai',
        nama_sertifikat: 'Nama Sertifikat',
        jenis_sertifikat: 'Jenis Sertifikat',
        fileUrl: 'Link Sertifikat'
    },
    pendidikan: {
        fk_pendidikan_id_pegawai: 'ID Pegawai',
        tingkat_pendidikan: 'Tingkat Pendidikan',
        sekolah: 'Sekolah Pendidikan',
        universitas: 'Universitas',
        fakultas: 'Fakultas',
        program_studi: 'Program studi'
    }
}

const mySwal = withReactContent(Swal)

const formatForm = {
    fk_akun_id_pegawai: '',
    nama_akun: '',
    email_akun: '',
    password_akun: '',
    role_akun: ''
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

export default function DataPegawaiPage() {

    const [data, setData] = useState([])
    const [importFile, setImportFile] = useState({
        pegawai: null, sertifikat: null, pendidikan: null
    })
    const [sheetsFile, setSheetsFile] = useState({
        pegawai: [], sertifikat: [], pendidikan: []
    })
    const [formTambah, setFormTambah] = useState(formatForm)
    const [searchDataPegawai, setSearchDataPegawai] = useState('')
    const [loadingFetch, setLoadingFetch] = useState({
        data: '', pegawai: ''
    })
    const [importTab, setImportTab] = useState('pegawai')
    const [tabEdit, setTabEdit] = useState('pribadi')
    const [filteredData, setFilteredData] = useState([])
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [selectAll, setSelectAll] = useState(false)
    const [filterData, setFilterData] = useState({
        jabatan: [], status_kepegawaian: [], pensiun: []
    })

    const getData = async () => {
        setLoadingFetch(state => ({...state, data: 'loading'}))
        const response = await getAllPegawai()
        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)
        }
        setLoadingFetch(state => ({...state, data: 'fetched'}))
    }

    useEffect(() => {
        getData()
    }, [])

    const submitFormTambah = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        const payload = {
            nama_pegawai: e.target[0].value,
            email_pegawai: e.target[1].value,
            jabatan: e.target[2].value,
            status_kepegawaian: e.target[3].value,
            nik: e.target[4].value,
            nip: e.target[5].value,
            nuptk: e.target[6].value,
            tmpt_lahir: e.target[7].value,
            tanggal_lahir: e.target[8].value,
            tmt: e.target[9].value,
            keterangan: e.target[10].value
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: async () => {
                const response = await createSinglePegawai(payload)

                if(response) {
                    setSearchDataPegawai('')
                    await logRiwayat({
                        aksi: 'Tambah',
                        kategori: 'Data Pegawai',
                        keterangan: `Menambahkan 1 data`,
                        records: JSON.stringify({...payload})
                    })
                    for(let i = 0; i < 10; i++) {
                        e.target[i].value = ''
                    }

                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menambahkan data pegawai',
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

    const submitDeleteData = async (id_pegawai) => {
        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                let response

                if(id_pegawai) {
                    response = await deleteSinglePegawai(id_pegawai)
                }else{
                    response = await deleteManyPegawai(selectedData)
                }

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Hapus',
                        kategori: 'Data Pegawai',
                        keterangan: `Menghapus ${id_pegawai ? '1' : selectedData.length} data`,
                        records: JSON.stringify(id_pegawai ? {id_pegawai} : {id_pegawai: selectedData})
                    })
                    setSelectedData([])
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menghapus data pegawai'
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

    const handleSelectData = (id_pegawai) => {
        setSelectedData(state => {
            if(state.includes(id_pegawai)) {
                return state.filter(value => value !== id_pegawai)
            }else{
                return [...state, id_pegawai]
            }
        })
    }

    const submitEditData = (e, modal, id_pegawai) => {
        e.preventDefault()

        showModal(modal).show('close')

        const payload = {
            nama_pegawai: e.target[0].value,
            email_pegawai: e.target[1].value,
            jabatan: e.target[2].value,
            status_kepegawaian: e.target[3].value,
            nik: e.target[4].value,
            nip: e.target[5].value,
            nuptk: e.target[6].value,
            tmpt_lahir: e.target[7].value,
            tanggal_lahir: e.target[8].value,
            tmt: e.target[9].value,
            keterangan: e.target[10].value,
            pensiun: e.target[11].value
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await updateSinglePegawai(id_pegawai, payload)

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Ubah',
                        kategori: 'Data Pegawai',
                        keterangan: `Mengubah 1 data`,
                        records: JSON.stringify({id_pegawai, payload})
                    })
                    setSelectedData([])
                    setSelectAll(false)
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah data pegawai tersebut',
                        icon: 'success'
                    })
                }else{
                    showModal(modal).show('show')
                    Swal.fire({
                        title: 'Gagal',
                        text: response.message,
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
                value['nama_pegawai'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nip'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nik'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nuptk'].toLowerCase().includes(searchFilter.toLowerCase())
            )
        }

        if(filterData['jabatan'].length > 0) {
            updatedData = updatedData.filter(value => filterData['jabatan'].includes(value['jabatan']))
        }

        if(filterData['status_kepegawaian'].length > 0) {
            updatedData = updatedData.filter(value => filterData['status_kepegawaian'].includes(value['status_kepegawaian']))
        }

        if(filterData['pensiun'].length > 0) {
            updatedData = updatedData.filter(value => filterData['pensiun'].includes(value['pensiun']))
        }

        setFilteredData(updatedData)
    }, [searchFilter, filterData])

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

    const submitEditSertifikat = (e, modalArr = [], no_sertifikat) => {
        e.preventDefault()

        const payload = {
            nama_sertifikat: e.target[0].value,
            jenis_sertifikat: e.target[1].value,
            fileUrl: e.target[2].value
        }

        console.log(payload)

        modalArr.forEach(value => {
            document.getElementById(value).close()
        })

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await updateSertifikat(payload, Number(no_sertifikat))

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Ubah',
                        kategori: 'Data Pegawai - Sertifikat',
                        keterangan: `Mengubah 1 data`,
                        records: JSON.stringify({id_pegawai, no_sertifikat, payload})
                    })
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah sertifikat!',
                        icon: 'success',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        modalArr.forEach(value => {
                            document.getElementById(value).showModal()
                        })
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan saat memproses data, hubungi Administrator!',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        modalArr.forEach(value => {
                            document.getElementById(value).showModal()
                        })
                    })
                }
            }
        })

        
    }

    const submitDeleteSertifikat = (modal, no_sertifikat) => {
        document.getElementById(modal).close()

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await deleteSertifikat(Number(no_sertifikat))

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Hapus',
                        kategori: 'Data Pegawai - Sertifikat',
                        keterangan: `Menghapus 1 data`,
                        records: JSON.stringify({no_sertifikat})
                    })
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil menghapus sertifikat!',
                        icon: 'success',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan saat memproses data, hubungi Administrator!',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const submitEditPendidikanPegawai = (e, modalArr = [], no_pendidikan) => {
        e.preventDefault()

        const payload = {
            tingkat_pendidikan: e.target[0].value,
            sekolah: e.target[1].value,
            universitas: e.target[2].value,
            fakultas: e.target[3].value,
            program_studi: e.target[4].value,
        }

        modalArr.forEach(value => {
            document.getElementById(value).close()
        })

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await updatePendidikan(payload, Number(no_pendidikan))

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Ubah',
                        kategori: 'Data Pegawai - Pendidikan',
                        keterangan: `Mengubah 1 data`,
                        records: JSON.stringify({no_pendidikan, payload})
                    })
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah data pendidikan pegawai!',
                        icon: 'success',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        modalArr.forEach(value => {
                            document.getElementById(value).showModal()
                        })
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan saat memproses data, hubungi Administrator!',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        modalArr.forEach(value => {
                            document.getElementById(value).showModal()
                        })
                    })
                }
            }
        })
    }

    const submitTambahSertifikat = (e, modalArr = [], fk_sertifikat_id_pegawai) => {
        e.preventDefault()

        modalArr.forEach(value => {
            document.getElementById(value).close()
        })

        const payload = {
            fk_sertifikat_id_pegawai,
            nama_sertifikat: e.target[0].value,
            jenis_sertifikat: e.target[1].value,
            fileUrl: e.target[2].value
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await createSertifikat(payload)

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Tambah',
                        kategori: 'Data Pegawai - Sertifikat',
                        keterangan: `Menambah 1 data`,
                        records: JSON.stringify({...payload})
                    })
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil menambahkan sertifikat baru!',
                        icon: 'success',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        for(let i = 0; i < 4; i++) {
                            e.target[i].value = ''
                        }
                        modalArr.forEach(value => {
                            document.getElementById(value).showModal()
                        })
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan saat memproses data, hubungi Administrator!',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        modalArr.forEach(value => {
                            document.getElementById(value).showModal()
                        })
                    })
                }
            }
        })
    }

    const submitTambahPendidikan = (e, modalArr = [], fk_pendidikan_id_pegawai) => {
        e.preventDefault()

        modalArr.forEach(value => {
            document.getElementById(value).close()
        })

        const payload = {
            fk_pendidikan_id_pegawai,
            tingkat_pendidikan: e.target[0].value,
            sekolah: e.target[1].value,
            universitas: e.target[2].value,
            fakultas: e.target[3].value,
            program_studi: e.target[4].value,
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await createPendidikan(payload)

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Tambah',
                        kategori: 'Data Pegawai - Pendidikan',
                        keterangan: `Menambah 1 data`,
                        records: JSON.stringify({...payload})
                    })
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil menambahkan pendidikan baru!',
                        icon: 'success',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        for(let i = 0; i < 5; i++) {
                            e.target[i].value = ''
                        }
                        modalArr.forEach(value => {
                            document.getElementById(value).showModal()
                        })
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan saat memproses data, hubungi Administrator!',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        modalArr.forEach(value => {
                            document.getElementById(value).showModal()
                        })
                    })
                }
            }
        })
    }

    const submitDeletePendidikan = (modal, no_pendidikan) => {
        document.getElementById(modal).close()

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await deletePendidikan(Number(no_pendidikan))

                if(response.success) {
                    await logRiwayat({
                        aksi: 'Hapus',
                        kategori: 'Data Pegawai - Pendidikan',
                        keterangan: `Menghapus 1 data`,
                        records: JSON.stringify({no_pendidikan})
                    })
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil menghapus data pendidikan pegawai!',
                        icon: 'success',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan saat memproses data, hubungi Administrator!',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const submitImportFile = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        const namaSheet = e.target[1].value

        const response = await xlsx_getData(importFile[importTab], namaSheet)
        if(response.success) {
            const headersImportFile = Object.keys(response.data[0])
            const headersDatabase = Object.keys(formatKolom[importTab])

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
            let dataImport = response.data

            if(importTab === 'pegawai') {
                dataImport = dataImport.map(state => ({
                    ...state
                }))
            }

            Swal.fire({
                title: 'Sedang memproses data',
                timer: 60000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                didOpen: async () => {
                    let response
                    if(importTab === 'pegawai') {
                        response = await createMultiPegawai(dataImport)
                    }

                    if(importTab === 'sertifikat') {
                        response = await createSertifikat(dataImport)
                    }

                    if(importTab === 'pendidikan') {
                        response = await createPendidikan(dataImport)
                    }
                    
                    if(response.success) {
                        if(importTab === 'pegawai') {
                            await logRiwayat({
                                aksi: 'Import',
                                kategori: 'Data Pegawai',
                                keterangan: `Mengimport ${dataImport.length} data`,
                                records: JSON.stringify(dataImport)
                            })
                        }
    
                        if(importTab === 'sertifikat') {
                            await logRiwayat({
                                aksi: 'Import',
                                kategori: 'Data Pegawai - Sertifikat',
                                keterangan: `Mengimport ${dataImport.length} data`,
                                records: JSON.stringify(dataImport)
                            })
                        }
    
                        if(importTab === 'pendidikan') {
                            await logRiwayat({
                                aksi: 'Import',
                                kategori: 'Data Pegawai - Pendidikan',
                                keterangan: `Mengimport ${dataImport.length} data`,
                                records: JSON.stringify(dataImport)
                            })
                        }

                        await getData()
                        Swal.fire({
                            title: 'Sukses',
                            text: `Berhasil mengimport data ${importTab}!`,
                            icon: 'success'
                        }).then(() => {
                            e.target[0].value = ''
                            e.target[1].value = ''
                            setImportFile(state => ({...state, 
                                [importTab]: null
                            }))
                            setSheetsFile(state => ({...state,
                                [importTab]: []
                            }))
                            document.getElementById(modal).showModal()
                        })
                    }else{
                        Swal.fire({
                            title: 'Gagal',
                            text: `Gagal mengimport data ${importTab}!`,
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
        if(importFile[importTab] !== null) {
            const file = importFile[importTab]
            if(!allowedMIMEType.includes(file.type)) {
                console.log('salah file')
                return setImportFile(state => ({...state, [importTab]: null}))
            }
            
            // Get sheets
            if(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const sheets = await xlsx_getSheets(importFile[importTab])
                setSheetsFile(state => ({...state, [importTab]: Object.keys(sheets)}))
            }
        }
    }

    useEffect(() => {
        handleImportFile()
    }, [importFile])

    const handleSelectAll = () => {
        if(filteredData.length > 0) {
            setSelectAll(state => {
                if(state) {
                    setSelectedData([])
                }else{
                    setSelectedData(filteredData.map(value => Number(value['id_pegawai'])))
                }
                return !state
            })
        }
    }

    useEffect(() => {
        if(data.length > 0) {
            if(selectedData.length === filteredData.length || selectedData.length >= filteredData.length) {
                setSelectAll(true)
            }else{
                setSelectAll(false)
            }
        }
    }, [selectedData, filteredData, data])

    return (
        <MainLayoutPage>
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                <div className="text-xs md:text-sm no-scrollbar">
                    <div className="flex items-center gap-5 w-full md:w-fit text-xs md:text-sm">
                        <button type="button" onClick={() => document.getElementById('tambah_pegawai').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit opacity-70" />
                            Tambah
                        </button>
                        <dialog id="tambah_pegawai" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded md:max-w-[900px] border dark:border-zinc-800">
                                <form method="dialog">
                                    <button onClick={() => setFormTambah(formatForm)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Tambah Pegawai</h3>
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={(e) => submitFormTambah(e, `tambah_pegawai`)} className="space-y-6 md:space-y-3">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Nama Pegawai
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Pegawai" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Email Pegawai
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Email Pegawai" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Jabatan Pegawai
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Jabatan --</option>
                                                <option value="Karyawan">Karyawan</option>
                                                <option value="Magang">Magang</option>
                                                <option value="Guru">Guru</option>
                                                <option value="Kepala Sekolah">Kepala Sekolah</option>
                                                <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Status Kepegawaian
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Status --</option>
                                                <option value="HONDA">HONDA</option>
                                                <option value="HONKOM">HONKOM</option>
                                                <option value="PNS">PNS</option>
                                                <option value="PPPK">PPPK</option>
                                                <option value="TIDAK ADA">Tidak Ada</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            NIK
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NIK Pegawai" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            NIP
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NIP Pegawai" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            NUPTK
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NUPTK Pegawai" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tempat Lahir
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tempat Lahir Pegawai" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tanggal Lahir
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Email Pegawai" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tamat Kepegawaian
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Email Pegawai" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Keterangan
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Keterangan" />
                                        </div>
                                    </div>
                                    <div className="flex md:justify-end">
                                        <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                            <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                            Simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </dialog>
                        <button type="button" onClick={() => document.getElementById('import_pegawai').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit opacity-70" />
                            Import
                        </button>
                        <dialog id="import_pegawai" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded border dark:border-zinc-800">
                                <form method="dialog">
                                    <button onClick={() => setFormTambah(formatForm)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Import Data</h3>
                                <hr className="my-2 opacity-0" />
                                <div className="flex items-center gap-2">
                                    <button type="button" disabled={importTab === 'pegawai'} onClick={() => setImportTab('pegawai')} className={`w-1/3 md:w-fit px-3 py-2 ease-out duration-200 ${importTab === 'pegawai' ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} rounded-md`}>
                                        Pegawai
                                    </button>
                                    <button type="button" disabled={importTab === 'sertifikat'} onClick={() => setImportTab('sertifikat')} className={`w-1/3 md:w-fit px-3 py-2 ease-out duration-200 ${importTab === 'sertifikat' ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} rounded-md`}>
                                        Sertifikat
                                    </button>
                                    <button type="button" disabled={importTab === 'pendidikan'} onClick={() => setImportTab('pendidikan')} className={`w-1/3 md:w-fit px-3 py-2 ease-out duration-200 ${importTab === 'pendidikan' ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} rounded-md`}>
                                        Pendidikan
                                    </button>
                                </div>
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={e => submitImportFile(e, 'import_pegawai')} className="text-xs space-y-2">
                                    <p className="opacity-60">
                                        File harus berupa .xlsx atau .csv
                                    </p>
                                    <input type="file" id="input_import_file" onChange={e => setImportFile(state => ({...state, [importTab]: e.target.files[0]}))} className="text-sm cursor-pointer w-full" />
                                    <p className="opacity-60">
                                        Pilih Sheet jika anda menggunakan .xlsx
                                    </p>
                                    <select id="select_sheet" className="px-3 py-2 w-full rounded-md border dark:border-zinc-800 dark:bg-zinc-900">
                                        <option value="" disabled>-- Pilih Sheet --</option>
                                        {sheetsFile[importTab].map((value, index) => (
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
                                    Jabatan
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['jabatan']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('jabatan', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['jabatan'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="opacity-70 w-full md:w-1/6">
                                    Status
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['status_kepegawaian']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('status_kepegawaian', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['status_kepegawaian'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="opacity-70 w-full md:w-1/6">
                                    Pensiun
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['pensiun']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('pensiun', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['pensiun'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value ? 'Ya' : 'Tidak'}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                        </div>
                    )}

                    <hr className="my-5 dark:opacity-10" />
                    <p>
                        Hasil pencarian ditemukan {filteredData.length} data
                    </p>
                    <hr className="my-1 opacity-0" />  
                    <div className="relative overflow-auto w-full max-h-[400px]">
                        <div className="grid grid-cols-12 p-3 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 sticky top-0 mb-2">
                            <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                <input type="checkbox" checked={selectAll} onChange={() => handleSelectAll()} className="cursor-pointer" />
                                Nama
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Email
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Jabatan
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Status Kepegawaian
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                NIK
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
                                Data Pegawai tidak ada!
                            </div>
                        )}
                        {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                            <div key={`${value['id_pegawai']}`} className="grid grid-cols-12 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 ease-out duration-300 text-xs">
                                <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                    <input type="checkbox" checked={selectedData.includes(Number(value['id_pegawai']))} onChange={() => handleSelectData(Number(value['id_pegawai']))} className="cursor-pointer" />
                                    {value['nama_pegawai']}
                                    <p className="font-extrabold">
                                        {value['id_pegawai']}
                                    </p>
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['email_pegawai']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['jabatan']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['status_kepegawaian']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    <div className="space-y-2">
                                        <p>
                                            {value['nik']}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-5 md:col-span-2 flex items-center justify-center md:gap-3 gap-1">
                                    <button type="button" onClick={() => document.getElementById(`info_pegawai_${value['id_pegawai']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`info_pegawai_${value['id_pegawai']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Informasi Pegawai</h3>
                                            <hr className="my-2 opacity-0" />
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Pegawai
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_pegawai']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            ID Pegawai
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['id_pegawai']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Email
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['email_pegawai']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Jabatan
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['jabatan']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Status Kepegawaian
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['status_kepegawaian']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NIK
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nik']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NIP
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nip']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            NUPTK
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nuptk']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tempat Lahir
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tmpt_lahir']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal Lahir
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {date_getDay(value['tanggal_lahir'])} {date_getMonth('string', value['tanggal_lahir'])} {date_getYear(value['tanggal_lahir'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tamat Kepegawaian
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {date_getDay(value['tmt'])} {date_getMonth('string', value['tmt'])} {date_getYear(value['tmt'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Pensiun
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['pensiun'] ? 'Ya' : 'Tidak'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Keterangan
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['keterangan']}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => document.getElementById(`edit_pegawai_${value['id_pegawai']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`edit_pegawai_${value['id_pegawai']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ubah Data Pegawai</h3>
                                            <hr className="my-2 opacity-0" />
                                            <div className="flex items-center gap-2 w-full text-sm">
                                                <button type="button" disabled={tabEdit === 'pribadi'} onClick={() => setTabEdit('pribadi')} className={`w-1/3 md:w-fit px-3 py-2 rounded-md ${tabEdit === 'pribadi' ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    Pribadi
                                                </button>
                                                <button type="button" disabled={tabEdit === 'sertifikat'} onClick={() => setTabEdit('sertifikat')} className={`w-1/3 md:w-fit px-3 py-2 rounded-md ${tabEdit === 'sertifikat' ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    Sertifikat
                                                </button>
                                                <button type="button" disabled={tabEdit === 'pendidikan'} onClick={() => setTabEdit('pendidikan')} className={`w-1/3 md:w-fit px-3 py-2 rounded-md ${tabEdit === 'pendidikan' ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    Pendidikan
                                                </button>
                                            </div>
                                            <hr className="my-2 opacity-0" />
                                            {tabEdit === 'pribadi' && (
                                                <form onSubmit={(e) => submitEditData(e, `edit_pegawai_${value['id_pegawai']}`, Number(value['id_pegawai']))} className="space-y-6 md:space-y-3">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Nama Pegawai
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input required defaultValue={value['nama_pegawai']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Pegawai" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Email Pegawai
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input required defaultValue={value['email_pegawai']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Email Pegawai" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Jabatan Pegawai
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <select required defaultValue={value['jabatan']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                                <option value="" disabled>-- Pilih Jabatan --</option>
                                                                <option value="Karyawan">Karyawan</option>
                                                                <option value="Magang">Magang</option>
                                                                <option value="Guru">Guru</option>
                                                                <option value="Kepala Sekolah">Kepala Sekolah</option>
                                                                <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Status Kepegawaian
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <select required defaultValue={value['status_kepegawaian']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                                <option value="" disabled>-- Pilih Status --</option>
                                                                <option value="HONDA">HONDA</option>
                                                                <option value="HONKOM">HONKOM</option>
                                                                <option value="PNS">PNS</option>
                                                                <option value="PPPK">PPPK</option>
                                                                <option value="TIDAK ADA">Tidak Ada</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            NIK
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input required defaultValue={value['nik']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NIK Pegawai" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            NIP
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input required defaultValue={value['nip']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NIP Pegawai" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            NUPTK
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input defaultValue={value['nuptk']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NUPTK Pegawai" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Tempat Lahir
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input required defaultValue={value['tmpt_lahir']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tempat Lahir Pegawai" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Tanggal Lahir
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input required defaultValue={value['tanggal_lahir']} type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Email Pegawai" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Tamat Kepegawaian
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input required defaultValue={value['tmt']} type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Email Pegawai" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Keterangan
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input defaultValue={value['keterangan']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Keterangan" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <p className="opacity-60 w-full md:w-1/3">
                                                            Pensiun
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <select required defaultValue={value['pensiun']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                                <option value="" disabled>-- Pilih Status --</option>
                                                                <option value={true}>Ya</option>
                                                                <option value={false}>Tidak</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex md:justify-end">
                                                        <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                            <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                            Simpan
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                            {tabEdit === 'sertifikat' && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <button type="button" onClick={() => document.getElementById(`tambah_sertifikat_${value['id_pegawai']}`).showModal()} className="w-full md:w-fit px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3">
                                                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit" />
                                                            Tambah
                                                        </button>
                                                        <dialog id={`tambah_sertifikat_${value['id_pegawai']}`} className="modal backdrop-blur-sm">
                                                            <div className="modal-box rounded dark:bg-zinc-900">
                                                                <form method="dialog">
                                                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                                </form>
                                                                <h3 className="font-bold text-lg">Tambah Sertifikat</h3>
                                                                <hr className="my-2 opacity-0" />
                                                                <form onSubmit={(e) => submitTambahSertifikat(e, [`edit_pegawai_${value['id_pegawai']}`, `tambah_sertifikat_${value['id_pegawai']}_${sertifikat['no']}`], Number(value['id_pegawai']))}>
                                                                    <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                        <p className="opacity-60 w-full md:w-1/3">
                                                                            Nama Sertifikat
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <input required type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Nama Sertifikat" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                        <p className="opacity-60 w-full md:w-1/3">
                                                                            Jenis Sertifikat
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <select required className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800 dark:bg-zinc-900">
                                                                                <option value="" disabled>-- Pilih Jenis --</option>
                                                                                <option value="Magang">Magang</option>
                                                                                <option value="Asesor">Asesor</option>
                                                                                <option value="Pendidik">Pendidik</option>
                                                                                <option value="Teknik">Teknik</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                        <p className="opacity-60 w-full md:w-1/3">
                                                                            Link Sertifikat
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Link Sertifikat" />
                                                                        </div>
                                                                    </div>
                                                                    <hr className="my-3 opacity-0" />
                                                                    <div className="flex md:justify-end w-full">
                                                                        <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3 text-white">
                                                                            <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                                            Simpan
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </dialog>
                                                        
                                                    </div>
                                                    <div className="grid grid-cols-12 p-3 rounded-md border dark:border-zinc-800 gap-5">
                                                        <div className="col-span-7 md:col-span-3 flex items-center">
                                                            Nama
                                                        </div>
                                                        <div className="col-span-3 hidden md:flex items-center">
                                                            Jenis
                                                        </div>
                                                        <div className="col-span-3 hidden md:flex items-center">
                                                            Link
                                                        </div>
                                                        <div className="col-span-5 md:col-span-3 flex items-center justify-center">
                                                            <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit" />
                                                        </div>
                                                    </div>
                                                    <div className="relative overflow-auto w-full max-h-[400px] space-y-4">
                                                        {value['daftar_sertifikat'].map((sertifikat, index2) => (
                                                            <div key={`sertifikat_${sertifikat['no']}`} className="grid grid-cols-12 p-3 rounded-md gap-5">
                                                                <div className="col-span-7 md:col-span-3 flex items-center">
                                                                    {sertifikat['nama_sertifikat']}
                                                                </div>
                                                                <div className="col-span-3 hidden md:flex items-center">
                                                                    {sertifikat['jenis_sertifikat']}
                                                                </div>
                                                                <div className="col-span-3 hidden md:flex items-center">
                                                                    <a href={sertifikat['fileUrl']}  target="_blank" className="hover:underline">
                                                                        Link Sertifikat
                                                                    </a>
                                                                </div>
                                                                <div className="col-span-5 md:col-span-3 flex items-center justify-center gap-1">
                                                                    <button type="button" onClick={() => document.getElementById(`info_sertifikat_${value['id_pegawai']}_${sertifikat['no']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 md:hidden flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                                                    </button>
                                                                    <dialog id={`info_sertifikat_${value['id_pegawai']}_${sertifikat['no']}`} className="modal backdrop-blur-sm">
                                                                        <div className="modal-box rounded dark:bg-zinc-900">
                                                                            <form method="dialog">
                                                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                                            </form>
                                                                            <h3 className="font-bold text-lg">Informasi Sertifikat</h3>
                                                                            <hr className="my-2 opacity-0" />
                                                                            <div className="divide-y dark:divide-zinc-800">
                                                                                <div className="flex flex-col py-3 gap-1">
                                                                                    <p className="opacity-60">
                                                                                        Nama Sertifikat
                                                                                    </p>
                                                                                    <p>
                                                                                        {sertifikat['nama_sertifikat']}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col py-3 gap-1">
                                                                                    <p className="opacity-60">
                                                                                        Jenis Sertifikat
                                                                                    </p>
                                                                                    <p>
                                                                                        {sertifikat['jenis_sertifikat']}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col py-3 gap-1">
                                                                                    <p className="opacity-60">
                                                                                        Link Sertifikat
                                                                                    </p>
                                                                                    <a href={sertifikat['fileUrl']} target="_blank" className="hover:underline">Klik disini</a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </dialog>
                                                                    <button type="button"  onClick={() => document.getElementById(`edit_sertifikat_${value['id_pegawai']}_${sertifikat['no']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                                                    </button>
                                                                    <dialog id={`edit_sertifikat_${value['id_pegawai']}_${sertifikat['no']}`} className="modal backdrop-blur-sm">
                                                                        <div className="modal-box rounded dark:bg-zinc-900">
                                                                            <form method="dialog">
                                                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                                            </form>
                                                                            <h3 className="font-bold text-lg">Ubah Sertifikat</h3>
                                                                            <hr className="my-2 opacity-0" />
                                                                            <form onSubmit={(e) => submitEditSertifikat(e, [`edit_pegawai_${index}`, `edit_sertifikat_${value['id_pegawai']}_${sertifikat['no']}`], Number(sertifikat['no']))}>
                                                                                <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                                    <p className="opacity-60 w-full md:w-1/3">
                                                                                        Nama Sertifikat
                                                                                    </p>
                                                                                    <div className="w-full md:w-2/3">
                                                                                        <input required defaultValue={sertifikat['nama_sertifikat']} type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Nama Sertifikat" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                                    <p className="opacity-60 w-full md:w-1/3">
                                                                                        Jenis Sertifikat
                                                                                    </p>
                                                                                    <div className="w-full md:w-2/3">
                                                                                        <select required defaultValue={sertifikat['jenis_sertifikat']} className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800 dark:bg-zinc-900">
                                                                                            <option value="" disabled>-- Pilih Jenis --</option>
                                                                                            <option value="Magang">Magang</option>
                                                                                            <option value="Asesor">Asesor</option>
                                                                                            <option value="Pendidik">Pendidik</option>
                                                                                            <option value="Teknik">Teknik</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                                    <p className="opacity-60 w-full md:w-1/3">
                                                                                        Link Sertifikat
                                                                                    </p>
                                                                                    <div className="w-full md:w-2/3">
                                                                                        <input type="text" defaultValue={sertifikat['fileUrl']} className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Link Sertifikat" />
                                                                                    </div>
                                                                                </div>
                                                                                <hr className="my-3 opacity-0" />
                                                                                <div className="flex md:justify-end w-full">
                                                                                    <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3 text-white">
                                                                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                                                        Simpan
                                                                                    </button>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </dialog>
                                                                    <button type="button" onClick={() => submitDeleteSertifikat(`edit_pegawai_${value['id_pegawai']}`, sertifikat['no'])} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {tabEdit === 'pendidikan' && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <button type="button" onClick={() => document.getElementById(`tambah_pendidikan_${value['id_pegawai']}`).showModal()} className="w-1/2 md:w-fit px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3">
                                                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit" />
                                                            Tambah
                                                        </button>
                                                        <dialog id={`tambah_pendidikan_${value['id_pegawai']}`} className="modal backdrop-blur-sm">
                                                            <div className="modal-box rounded dark:bg-zinc-900">
                                                                <form method="dialog">
                                                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                                </form>
                                                                <h3 className="font-bold text-lg">Tambah Pendidikan</h3>
                                                                <hr className="my-2 opacity-0" />
                                                                <form onSubmit={e => submitTambahPendidikan(e, [`edit_pegawai_${value['id_pegawai']}`, `tambah_pendidikan_${value['id_pegawai']}`], Number(value['id_pegawai']))}>
                                                                    <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                        <p className="opacity-60 w-full md:w-1/3">
                                                                            Tingkat Pendidikan
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <select required className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800 dark:bg-zinc-900">
                                                                                <option value="" disabled>-- Pilih Tingkat --</option>
                                                                                <option value="SD">SD</option>
                                                                                <option value="SMP/SLTA/MTS">SMP/SLTA/MTS</option>
                                                                                <option value="SMA/MA/SMK/MK">SMA/MA/SMK/MK</option>
                                                                                <option value="D1/D2/D3">D1/D2/D3</option>
                                                                                <option value="D4/S1">D4/S1</option>
                                                                                <option value="S2">S2</option>
                                                                                <option value="S3">S3</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                        <p className="opacity-60 w-full md:w-1/3">
                                                                            Sekolah
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Sekolah" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                        <p className="opacity-60 w-full md:w-1/3">
                                                                            Universitas
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Universitas" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                        <p className="opacity-60 w-full md:w-1/3">
                                                                            Fakultas
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Fakultas" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                        <p className="opacity-60 w-full md:w-1/3">
                                                                            Program Studi
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <input type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Program Studi" />
                                                                        </div>
                                                                    </div>
                                                                    <hr className="my-3 opacity-0" />
                                                                    <div className="flex md:justify-end w-full">
                                                                        <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3 text-white">
                                                                            <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                                            Simpan
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </dialog>
                                                        
                                                    </div>
                                                    <div className="grid grid-cols-12 p-3 rounded-md border dark:border-zinc-800 gap-5">
                                                        <div className="col-span-7 md:col-span-2 flex items-center">
                                                            Tingkat
                                                        </div>
                                                        <div className="col-span-2 hidden md:flex items-center">
                                                            Sekolah
                                                        </div>
                                                        <div className="col-span-2 hidden md:flex items-center">
                                                            Universitas
                                                        </div>
                                                        <div className="col-span-2 hidden md:flex items-center">
                                                            Fakultas
                                                        </div>
                                                        <div className="col-span-2 hidden md:flex items-center">
                                                            Program Studi
                                                        </div>
                                                        <div className="col-span-5 md:col-span-2 flex items-center justify-center">
                                                            <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit" />
                                                        </div>
                                                    </div>
                                                    <div className="relative overflow-auto w-full max-h-[400px] space-y-4">
                                                        {value['daftar_pendidikan'].map((pendidikan, index2) => (
                                                            <div key={pendidikan['no']} className="grid grid-cols-12 p-3 rounded-md gap-5">
                                                                <div className="col-span-7 md:col-span-2 flex items-center">
                                                                    {pendidikan['tingkat_pendidikan']}
                                                                </div>
                                                                <div className="col-span-2 hidden md:flex items-center">
                                                                    {pendidikan['sekolah']}
                                                                </div>
                                                                <div className="col-span-2 hidden md:flex items-center">
                                                                    {pendidikan['universitas']}
                                                                </div>
                                                                <div className="col-span-2 hidden md:flex items-center">
                                                                    {pendidikan['fakultas']}
                                                                </div>
                                                                <div className="col-span-2 hidden md:flex items-center">
                                                                    {pendidikan['program_studi']}
                                                                </div>
                                                                <div className="col-span-5 md:col-span-2 flex items-center justify-center gap-1">
                                                                    <button type="button" onClick={() => document.getElementById(`info_pendidikan_${value['id_pegawai']}_${pendidikan['no']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 md:hidden flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                                                    </button>
                                                                    <dialog id={`info_pendidikan_${value['id_pegawai']}_${pendidikan['no']}`} className="modal backdrop-blur-sm">
                                                                        <div className="modal-box rounded dark:bg-zinc-900">
                                                                            <form method="dialog">
                                                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                                            </form>
                                                                            <h3 className="font-bold text-lg">Informasi Pendidikan</h3>
                                                                            <hr className="my-2 opacity-0" />
                                                                            <div className="divide-y dark:divide-zinc-800">
                                                                                <div className="flex flex-col py-3 gap-1">
                                                                                    <p className="opacity-60">
                                                                                        Tingkat Pendidikan
                                                                                    </p>
                                                                                    <p>
                                                                                        {pendidikan['tingkat_pendidikan']}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col py-3 gap-1">
                                                                                    <p className="opacity-60">
                                                                                        Sekolah
                                                                                    </p>
                                                                                    <p>
                                                                                        {pendidikan['sekolah']}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col py-3 gap-1">
                                                                                    <p className="opacity-60">
                                                                                        Universitas
                                                                                    </p>
                                                                                    <p>
                                                                                        {pendidikan['universitas']}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col py-3 gap-1">
                                                                                    <p className="opacity-60">
                                                                                        Fakultas
                                                                                    </p>
                                                                                    <p>
                                                                                        {pendidikan['fakultas']}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col py-3 gap-1">
                                                                                    <p className="opacity-60">
                                                                                        Program Studi
                                                                                    </p>
                                                                                    <p>
                                                                                        {pendidikan['program_studi']}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </dialog>
                                                                    <button type="button"  onClick={() => document.getElementById(`edit_pendidikan_${value['id_pegawai']}_${pendidikan['no']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                                                    </button>
                                                                    <dialog id={`edit_pendidikan_${value['id_pegawai']}_${pendidikan['no']}`} className="modal backdrop-blur-sm">
                                                                        <div className="modal-box rounded dark:bg-zinc-900">
                                                                            <form method="dialog">
                                                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                                            </form>
                                                                            <h3 className="font-bold text-lg">Ubah Sertifikat</h3>
                                                                            <hr className="my-2 opacity-0" />

                                                                            <form onSubmit={ev => submitEditPendidikanPegawai(ev, [`edit_pegawai_${index}`, `edit_pendidikan_${value['id_pegawai']}_${pendidikan['no']}`], Number(pendidikan['no']))}>
                                                                                <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                                    <p className="opacity-60 w-full md:w-1/3">
                                                                                        Tingkat Pendidikan
                                                                                    </p>
                                                                                    <div className="w-full md:w-2/3">
                                                                                        <select required defaultValue={pendidikan['tingkat_pendidikan']} className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800 dark:bg-zinc-900">
                                                                                            <option value="" disabled>-- Pilih Tingkat --</option>
                                                                                            <option value="SD">SD</option>
                                                                                            <option value="SMP/SLTA/MTS">SMP/MTs</option>
                                                                                            <option value="SMA/MA/SMK/MK">SMA/MA/SMK/MK</option>
                                                                                            <option value="D1/D2/D3">D1/D2/D3</option>
                                                                                            <option value="D4/S1">D4/S1</option>
                                                                                            <option value="S2">S2</option>
                                                                                            <option value="S3">S3</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                                    <p className="opacity-60 w-full md:w-1/3">
                                                                                        Sekolah
                                                                                    </p>
                                                                                    <div className="w-full md:w-2/3">
                                                                                        <input defaultValue={pendidikan['sekolah']} type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Sekolah" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                                    <p className="opacity-60 w-full md:w-1/3">
                                                                                        Universitas
                                                                                    </p>
                                                                                    <div className="w-full md:w-2/3">
                                                                                        <input defaultValue={pendidikan['universitas']} type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Universitas" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                                    <p className="opacity-60 w-full md:w-1/3">
                                                                                        Fakultas
                                                                                    </p>
                                                                                    <div className="w-full md:w-2/3">
                                                                                        <input defaultValue={pendidikan['fakultas']} type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Fakultas" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col md:flex-row md:items-center py-3 gap-1">
                                                                                    <p className="opacity-60 w-full md:w-1/3">
                                                                                        Program Studi
                                                                                    </p>
                                                                                    <div className="w-full md:w-2/3">
                                                                                        <input defaultValue={pendidikan['program_studi']} type="text" className="w-full px-3 py-2 rounded-md bg-transparent border dark:border-zinc-800" placeholder="Program Studi" />
                                                                                    </div>
                                                                                </div>
                                                                                <hr className="my-3 opacity-0" />
                                                                                <div className="flex md:justify-end w-full">
                                                                                    <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3 text-white">
                                                                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                                                        Simpan
                                                                                    </button>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </dialog>
                                                                    <button type="button" onClick={() => submitDeletePendidikan(`edit_pegawai_${value['id_pegawai']}`, Number(pendidikan['no']))} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <hr className="my-2 opacity-0" />
                                            
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => submitDeleteData(Number(value['id_pegawai']))} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
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
                            {selectedData.length > 0 && (
                                <div className="flex items-center justify-center w-full md:w-fit gap-3 px-3">
                                    <button type="button" onClick={() => submitDeleteData()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            )}
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