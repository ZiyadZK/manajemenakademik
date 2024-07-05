'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta, mont, rale } from "@/config/fonts"
import { exportToCSV } from "@/lib/csvLibs"
import { date_getDay, date_getMonth, date_getYear, date_integerToDate } from "@/lib/dateConvertes"
import { createMutasiSiswa } from "@/lib/model/mutasiSiswaModel"
import { createMultiPegawai, createSinglePegawai, deleteManyPegawai, deleteSinglePegawai, getAllPegawai, updateSinglePegawai } from "@/lib/model/pegawaiModel"
import { createPendidikan, deletePendidikan, updatePendidikan } from "@/lib/model/pendidikanModel"
import { createSertifikat, deleteSertifikat, updateSertifikat } from "@/lib/model/sertifikatModel"
import { createSingleSiswa, deleteMultiSiswaByNis, deleteSingleSiswaByNis, getAllSiswa, updateSiswaByNIS } from "@/lib/model/siswaModel"
import { exportToXLSX, xlsx_getData, xlsx_getSheets } from "@/lib/xlsxLibs"
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faArrowDown, faArrowRight, faArrowUp, faArrowsUpDown, faCheckSquare, faCircleCheck, faCircleXmark, faDownload, faEdit, faEllipsisH, faEllipsisV, faExclamationCircle, faEye, faFile, faFilter, faInfoCircle, faPlus, faPlusSquare, faPowerOff, faPrint, faSave, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
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

export default function DataSiswaPage() {

    const [data, setData] = useState([])
    const [importFile, setImportFile] = useState(null)
    const [sheetsFile, setSheetsFile] = useState([])
    const [dataPegawai, setDataPegawai] = useState([])
    const [formTambah, setFormTambah] = useState(formatForm)
    const [filteredDataPegawai, setFilteredDataPegawai] = useState([])
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
        kelas: [], jurusan: [], rombel: []
    })

    const [sortData, setSortData] = useState({
        nama_siswa: '', nis: '', nisn: '', tahun_masuk: ''
    })

    const getData = async () => {
        setLoadingFetch(state => ({...state, data: 'loading'}))
        const response = await getAllSiswa()
        setData(response)
        setFilteredData(response)
        setLoadingFetch(state => ({...state, data: 'fetched'}))
    }

    useEffect(() => {
        getData()
    }, [])

    const submitFormTambah = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        const payload = {
            nama_siswa: e.target[0].value,
            nis: e.target[1].value,
            nisn: e.target[5].value,
            kelas: e.target[2].value,
            jurusan: e.target[3].value,
            rombel: e.target[4].value,
            nik: e.target[6].value,
            no_kk: e.target[7].value,
            tempat_lahir: e.target[8].value,
            tanggal_lahir: e.target[9].value,
            jenis_kelamin: e.target[10].value,
            agama: e.target[11].value,
            jumlah_saudara: e.target[12].value,
            anak_ke: e.target[13].value,
            alamat: e.target[14].value,
            no_hp_siswa: e.target[15].value,
            asal_sekolah: e.target[16].value,
            kategori: e.target[17].value,
            tahun_masuk: e.target[18].value,
            nama_ayah: e.target[19].value,
            nama_ibu: e.target[20].value,
            telp_ayah: e.target[21].value,
            telp_ibu: e.target[22].value,
            pekerjaan_ayah: e.target[23].value,
            pekerjaan_ibu: e.target[24].value,
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: async () => {
                const response = await createSingleSiswa(payload)

                if(response) {
                    setSearchDataPegawai('')
                    for(let i = 0; i < 25; i++) {
                        e.target[i].value = ''
                    }

                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menambahkan data siswa',
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
                    response = await deleteSingleSiswaByNis(nis)
                }else{
                    response = await deleteMultiSiswaByNis(selectedData)
                }

                if(response.success) {
                    setSelectedData([])
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menghapus data siswa'
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
            nama_siswa: e.target[0].value,
            nis: e.target[1].value,
            nisn: e.target[5].value,
            kelas: e.target[2].value,
            jurusan: e.target[3].value,
            rombel: e.target[4].value,
            nik: e.target[6].value,
            no_kk: e.target[7].value,
            tempat_lahir: e.target[8].value,
            tanggal_lahir: e.target[9].value,
            jenis_kelamin: e.target[10].value,
            agama: e.target[11].value,
            jumlah_saudara: e.target[12].value,
            anak_ke: e.target[13].value,
            alamat: e.target[14].value,
            no_hp_siswa: e.target[15].value,
            asal_sekolah: e.target[16].value,
            kategori: e.target[17].value,
            tahun_masuk: e.target[18].value,
            nama_ayah: e.target[19].value,
            nama_ibu: e.target[20].value,
            telp_ayah: e.target[21].value,
            telp_ibu: e.target[22].value,
            pekerjaan_ayah: e.target[23].value,
            pekerjaan_ibu: e.target[24].value,
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await updateSiswaByNIS(nis, payload)

                if(response.success) {
                    setSelectedData([])
                    setSelectAll(false)
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah data siswa tersebut',
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
                value['nisn'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['no_kk'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nik'].toLowerCase().includes(searchFilter.toLowerCase())
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
                    ...state,
                    ['tanggal_lahir']: date_integerToDate(state['tanggal_lahir']),
                    ['tmt']: date_integerToDate(state['tmt'])
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

    const submitMutasiSiswa = async (e, modal, nis) => {
        e.preventDefault()

        document.getElementById(modal).close()
        // First get the data
        const dataSiswa = data.find(value => value['nis'] === nis)

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                // Delete the data
                await deleteSingleSiswaByNis(nis).then(async responseDelete => {
                    if(responseDelete.success) {
                        // Insert the data into mutasi
                        const response = await createMutasiSiswa(dataSiswa)
                        if(response.success) {
                            setSelectAll(false)
                            setSelectedData([])
                            await getData()
                            Swal.fire({
                                title: 'Sukses',
                                text: 'Berhasil mutasikan data siswa!',
                                icon: 'success'
                            })
                        }else{
                            Swal.fire({
                                title: 'Gagal',
                                text: 'Terdapat error disaat memproses data, hubungi Administrator!',
                                icon: 'error'
                            }).then(() => {
                                document.getElementById(modal).showModal()
                            })
                        }
                    }else{
                        Swal.fire({
                            title: 'Gagal',
                            text: 'Terdapat error disaat memproses data, hubungi Administrator!',
                            icon: 'error'
                        }).then(() => {
                            document.getElementById(modal).showModal()
                        })
                    }
                })
            }
        })
    }

    return (
        <MainLayoutPage>
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                <div className="text-xs md:text-sm no-scrollbar">
                    <div className="flex items-center gap-5 w-full md:w-fit text-xs md:text-sm">
                        <button type="button" onClick={() => document.getElementById('tambah_siswa').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit opacity-70" />
                            Tambah
                        </button>
                        <dialog id="tambah_siswa" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded md:max-w-[900px] border dark:border-zinc-800">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Tambah Siswa</h3>
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={e => submitFormTambah(e, 'tambah_siswa')} className="space-y-5 md:space-y-3">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Nama Siswa
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            NIS
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NIS" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Kelas
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Kelas --</option>
                                                <option value="X">X</option>
                                                <option value="XI">XI</option>
                                                <option value="XII">XII</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Jurusan
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Jurusan --</option>
                                                <option value="TKJ">TKJ</option>
                                                <option value="TPM">TPM</option>
                                                <option value="TKR">TKR</option>
                                                <option value="GEO">GEO</option>
                                                <option value="TITL">TITL</option>
                                                <option value="DPIB">DPIB</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Rombel
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Rombel" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Induk Siswa Nasional
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Induk Siswa Nasional" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Induk Kependudukan
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Induk Kependudukan" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Kartu Keluarga
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Kartu Keluarga" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tempat Lahir
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tempat Lahir" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tanggal Lahir
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Jenis Kelamin
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Agama
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Agama --</option>
                                                <option value="Islam">Islam</option>
                                                <option value="Protestan">Protestan</option>
                                                <option value="Katolik">Katolik</option>
                                                <option value="Hindu">Hindu</option>
                                                <option value="Buddha">Buddha</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Jumlah Saudara
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Jumlah Saudara" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Anak ke Berapa
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Anak ke Berapa" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Alamat
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Alamat" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Telepon Siswa
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Siswa" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Asal Sekolah
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Asal Sekolah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Kategori
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Kategori" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tahun Masuk
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tahun Masuk" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Nama Ayah
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Nama Ibu
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Telepon Ayah
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Telepon Ibu
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Pekerjaan Ayah
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Pekerjaan Ibu
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Ibu" />
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
                        <button type="button" onClick={() => document.getElementById('import_siswa').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit opacity-70" />
                            Import
                        </button>
                        <dialog id="import_siswa" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded border dark:border-zinc-800">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Import Data</h3>
                                <hr className="my-2 opacity-0" />
                                
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={e => submitImportFile(e, 'import_pegawai')} className="text-xs space-y-2">
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
                                <button type="button" className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={faArrowsUpDown} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Kelas
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                NIS
                                <button type="button" className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={faArrowsUpDown} className="w-3 h-3 text-inherit" />
                                </button> 
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                NISN
                                <button type="button" className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={faArrowsUpDown} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Tahun Masuk
                                <button type="button" className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={faArrowsUpDown} className="w-3 h-3 text-inherit" />
                                </button>
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
                                    <input type="checkbox" checked={selectedData.includes(Number(value['nis']))} onChange={() => handleSelectData(Number(value['nis']))} className="cursor-pointer" />
                                    {value['nama_siswa']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['kelas']} {value['jurusan']} {value['rombel']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['nis']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['nisn']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    <div className="space-y-2">
                                        <p>
                                            {value['nik']}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-5 md:col-span-2 flex items-center justify-center md:gap-3 gap-1">
                                    <button type="button" onClick={() => document.getElementById(`info_siswa_${value['nis']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`info_siswa_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Informasi Siswa</h3>
                                            <hr className="my-2 opacity-0" />
                                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                                <div className="flex items-center w-full gap-3">
                                                    <button type="button" className="w-1/2 md:w-fit px-3 py-2 border rounded-md dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3">
                                                        <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3 text-inherit opacity-60" />
                                                        {value['kelas'] !== 'XII' ? 'Naik Kelas' : 'Luluskan'}
                                                    </button>
                                                    {value['kelas'] !== 'X' && (
                                                        <button type="button" className="w-1/2 md:w-fit px-3 py-2 border rounded-md dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3">
                                                            <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3 text-inherit opacity-60" />
                                                            Turun Kelas
                                                        </button>
                                                    )}
                                                </div>
                                                <button type="button" className="w-full md:w-fit px-3 py-2 border rounded-md dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3">
                                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit opacity-60" />
                                                    Print
                                                </button>
                                            </div>
                                            <hr className="my-2 opacity-0" />
                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3 border-b dark:border-white">
                                                        <p className="w-full md:w-1/3 text-sm font-bold">
                                                            Data Pribadi
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Lengkap
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
                                                            Nomor Induk Siswa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nis']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Induk Siswa Nasional
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nisn']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Induk Kependudukan
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nik']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Kartu Keluarga
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['no_kk']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tempat, Tanggal Lahir
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tempat_lahir']}, {date_getDay(value['tanggal_lahir'])} {date_getMonth('string', value['tanggal_lahir'])} {date_getYear(value['tanggal_lahir'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Jenis Kelamin
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['jenis_kelamin']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Agama
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['agama']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Jumlah Saudara
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['jumlah_saudara']} Saudara
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Anak ke Berapa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            Anak ke {value['anak_ke']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Alamat
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['alamat']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Telepon Siswa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['no_hp_siswa']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Asal Sekolah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['asal_sekolah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Kategori
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['kategori']}
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
                                                </div>
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3 border-b dark:border-white">
                                                        <p className="w-full md:w-1/3 text-sm font-bold">
                                                            Data Orang Tua
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Ayah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_ayah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Pekerjaan Ayah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['pekerjaan_ayah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Telepon Ayah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['telp_ayah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Ibu
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_ibu']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Pekerjaan Ibu
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['pekerjaan_ibu']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Telepon Ibu
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['telp_ibu']}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => document.getElementById(`edit_siswa_${value['nis']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`edit_siswa_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ubah Data Siswa</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={(e) => submitEditData(e, `edit_siswa_${value['nis']}`, value['nis'])} className="space-y-6 md:space-y-3">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Siswa
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nama_siswa']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        NIS
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nis']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NIS" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Kelas
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['kelas']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                            <option value="" disabled>-- Pilih Kelas --</option>
                                                            <option value="X">X</option>
                                                            <option value="XI">XI</option>
                                                            <option value="XII">XII</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Jurusan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['jurusan']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                            <option value="" disabled>-- Pilih Jurusan --</option>
                                                            <option value="TKJ">TKJ</option>
                                                            <option value="TPM">TPM</option>
                                                            <option value="TKR">TKR</option>
                                                            <option value="GEO">GEO</option>
                                                            <option value="TITL">TITL</option>
                                                            <option value="DPIB">DPIB</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Rombel
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['rombel']} type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Rombel" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Induk Siswa Nasional
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nisn']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Induk Siswa Nasional" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Induk Kependudukan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input defaultValue={value['nik']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Induk Kependudukan" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Kartu Keluarga
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input defaultValue={value['no_kk']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Kartu Keluarga" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tempat Lahir
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['tempat_lahir']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tempat Lahir" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tanggal Lahir
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['tanggal_lahir']} type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Jenis Kelamin
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['jurusan']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                            <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                                            <option value="Laki-laki">Laki-laki</option>
                                                            <option value="Perempuan">Perempuan</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Agama
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['jurusan']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                            <option value="" disabled>-- Pilih Agama --</option>
                                                            <option value="Islam">Islam</option>
                                                            <option value="Protestan">Protestan</option>
                                                            <option value="Katolik">Katolik</option>
                                                            <option value="Hindu">Hindu</option>
                                                            <option value="Buddha">Buddha</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Jumlah Saudara
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['jumlah_saudara']} type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Jumlah Saudara" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Anak ke Berapa
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['anak_ke']} type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Anak ke Berapa" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Alamat
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['alamat']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Alamat" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Telepon Siswa
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['no_hp_siswa']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Siswa" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Asal Sekolah
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['asal_sekolah']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Asal Sekolah" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Kategori
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['kategori']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Kategori" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tahun Masuk
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['tahun_masuk']} type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tahun Masuk" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Ayah
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nama_ayah']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ayah" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Ibu
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nama_ibu']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ibu" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Telepon Ayah
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['telp_ayah']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Ayah" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Telepon Ibu
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['telp_ibu']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Ibu" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Pekerjaan Ayah
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['pekerjaan_ayah']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Ayah" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Pekerjaan Ibu
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['pekerjaan_ibu']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Ibu" />
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
                                    <button type="button" onClick={() => document.getElementById(`mutasi_siswa_${value['nis']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`mutasi_siswa_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Mutasi Siswa</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={(e) => submitMutasiSiswa(e, `mutasi_siswa_${value['nis']}`, value['nis'])} className="space-y-6 md:space-y-3">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Siswa
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nama_siswa']} disabled type="text" className="px-3 py-2 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Kelas
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['kelas']} disabled className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800 disabled:bg-zinc-100 dark:disabled:bg-zinc-800">
                                                            <option value="" disabled>-- Pilih Kelas --</option>
                                                            <option value="X">X</option>
                                                            <option value="XI">XI</option>
                                                            <option value="XII">XII</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tahun Masuk
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['tahun_masuk']} disabled type="number" className="px-3 py-2 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tahun Masuk" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tanggal Keluar
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Keterangan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required type="text" className="px-3 py-2 disabled:bg-zinc-800 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ibu" />
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
                                <button type="button" onClick={() => submitDeleteData()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-green-500 dark:hover:border-green-500/50 hover:bg-green-100 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-500 ease-out duration-200">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" onClick={() => submitDeleteData()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-cyan-500 dark:hover:border-cyan-500/50 hover:bg-cyan-100 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-500 ease-out duration-200">
                                    <FontAwesomeIcon icon={faArrowsUpDown} className="w-3 h-3 text-inherit" />
                                </button>
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