'use client'

import MainLayoutPage from "@/components/mainLayout"
import { model_getAllAlumni } from "@/lib/model/alumniModel"
import { M_MataPelajaran_getAll } from "@/lib/model/mataPelajaranModel"
import { getAllMutasiSiswa } from "@/lib/model/mutasiSiswaModel"
import { M_Nilai_create, M_Nilai_getAll } from "@/lib/model/nilaiModel"
import { getAllSiswa } from "@/lib/model/siswaModel"
import { faAnglesLeft, faAnglesRight, faCheckSquare, faDownload, faEdit, faExclamationTriangle, faFile, faFilter, faHandPointUp, faHandPointer, faPlus, faPowerOff, faPrint, faSave, faSearch, faTrash, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"

const formatFormTambah = {
    fk_id_mapel: '',
    nama_mapel: '',
    kategori_mapel: '',
    semester_1: null,
    semester_2: null,
    semester_3: null,
    semester_4: null,
    semester_5: null,
    semester_6: null,
    nilai_ujian: null
}

export default function NilaiPage() {

    const ref_modal_tambah = useRef(null)
    const [loadingFetch, setLoadingFetch] = useState({
        siswa: '', mata_pelajaran: '', nilai: ''
    })
    const [dataSiswa, setDataSiswa] = useState([])
    const [dataMapel, setDataMapel] = useState([])
    const [dataNilai, setDataNilai] = useState([])

    const [formTambah, setFormTambah] = useState(formatFormTambah)

    const [filteredDataMapel, setFilteredDataMapel] = useState([])

    const [searchDataMapel, setSearchDataMapel] = useState('')

    const [filteredDataSiswa, setFilteredDataSiswa] = useState([])
    const [filterDataSiswa, setFilterDataSiswa] = useState({
        kelas: [], jurusan: [], rombel: [], tahun_masuk: [], tahun_keluar: [], kategori: []
    })
    const [searchDataSiswa, setSearchDataSiswa] = useState('')
    const [selectAll, setSelectAll] = useState(false)

    const [selectedDataSiswa, setSelectedDataSiswa] = useState([])
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [detailSiswa, setDetailSiswa] = useState(null)

    const getDataSiswa = async () => {
        setLoadingFetch(state => ({...state, siswa: 'loading'}))
        let dataSiswa = await getAllSiswa()
        dataSiswa = dataSiswa.map(value => ({
            ...value,
            kategori: 'DATA SISWA'
        }))
        let dataAlumni = []
        let dataMutasiSiswa = []
        const responseAlumni = await model_getAllAlumni() 
        if(responseAlumni.success) {
            dataAlumni = responseAlumni.data.map(value => ({...value,
                kategori: 'DATA ALUMNI'
            }))
        }

        const responseMutasiSiswa = await getAllMutasiSiswa()
        if(responseMutasiSiswa.success) {
            dataMutasiSiswa = responseMutasiSiswa.data.map(value => ({...value,
                kategori: 'DATA MUTASI SISWA'
            }))
        }

        const updatedData = [...dataSiswa, ...dataAlumni, ...dataMutasiSiswa]

        setDataSiswa(updatedData)
        setFilteredDataSiswa(updatedData)

        setLoadingFetch(state => ({...state, siswa: 'fetched'}))
    }

    const getDataMapel = async () => {
        setLoadingFetch(state => ({...state, mata_pelajaran: 'loading'}))
        const response = await M_MataPelajaran_getAll()
        if(response.success) {
            const updatedData = response.data.filter(value => value['is_parent'] === 1).filter(value => value['is_mapel'] === 1).filter(value => value['aktif'] === 1)
            setDataMapel(updatedData)
            setFilteredDataMapel(updatedData)
        }
        setLoadingFetch(state => ({...state, mata_pelajaran: 'fetched'}))
    }

    useEffect(() => {
        getDataSiswa()
        getDataMapel()
    }, [])

    const getDataNilai = async () => {
        setLoadingFetch(state => ({...state, nilai: 'loading'}))
        const response = await M_Nilai_getAll(detailSiswa.nis)
        if(response.success) {
            setDataNilai(response.data)
        }
        setLoadingFetch(state => ({...state, nilai: 'fetched'}))
    }

    useEffect(() => {
        if(detailSiswa !== null) {
            getDataNilai()
        }else{
            setDataNilai([])
        }
    }, [detailSiswa])

    const handleTotalList = value => {
        const maxPagination = Math.ceil(dataSiswa.length / value)
        if(pagination > maxPagination) {
            setPagination(state => state = maxPagination)
        }
        setTotalList(value)
    }

    const handleFilterDataSiswa = (key, value) => {
        setFilterDataSiswa(state => {
            if(state[key].includes(value)) {
                return {...state, [key]: state[key].filter(v => v !== value)}
            }else{
                return {...state, [key]: [...state[key], value]}
            }
        })
    }

    const handleSelectDataSiswa = (nis) => {
        setSelectedDataSiswa(state => {
            if(state.includes(nis)) {
                return state.filter(value => value !== nis)
            }else{
                return [...state, nis]
            }
        })
    }

    useEffect(() => {
        let updatedData = dataSiswa

        if(filterDataSiswa['kelas'].length > 0) {
            updatedData = updatedData.filter(value => filterDataSiswa['kelas'].includes(value['kelas']))
        }

        if(filterDataSiswa['jurusan'].length > 0) {
            updatedData = updatedData.filter(value => filterDataSiswa['jurusan'].includes(value['jurusan']))
        }
        
        if(filterDataSiswa['rombel'].length > 0) {
            updatedData = updatedData.filter(value => filterDataSiswa['rombel'].includes(value['rombel']))
        }

        if(filterDataSiswa['tahun_masuk'].length > 0) {
            updatedData = updatedData.filter(value => filterDataSiswa['tahun_masuk'].includes(value['tahun_masuk']))
        }

        if(filterDataSiswa['tahun_keluar'].length > 0) {
            updatedData = updatedData.filter(value => filterDataSiswa['tahun_keluar'].includes(value['tahun_keluar']))
        }

        if(filterDataSiswa['kategori'].length > 0) {
            updatedData = updatedData.filter(value => filterDataSiswa['kategori'].includes(value['kategori']))
        }

        if(searchDataSiswa !== '') {
            updatedData = updatedData.filter(value => 
                value['nama_siswa'].toLowerCase().includes(searchDataSiswa.toLowerCase()) ||
                value['nis'].toLowerCase().includes(searchDataSiswa.toLowerCase()) ||
                value['nisn'].toLowerCase().includes(searchDataSiswa.toLowerCase())
            )
        }

        setFilteredDataSiswa(updatedData)

    }, [filterDataSiswa, searchDataSiswa])

    const handleSelectAll = () => {
        if(filteredDataSiswa.length > 0) {
            setSelectAll(state => {
                if(state) {
                    setSelectedDataSiswa([])
                }else{
                    setSelectedDataSiswa(filteredDataSiswa.map(value => value['nis']))
                }
                return !state
            })
        }
    }

    useEffect(() => {
        if(dataSiswa.length > 0) {
            if(selectedDataSiswa.length === filteredDataSiswa.length || selectedDataSiswa.length >= filteredDataSiswa.length) {
                setSelectAll(true)
            }else{
                setSelectAll(false)
            }
        }
    }, [selectedDataSiswa, filteredDataSiswa, dataSiswa])

    useEffect(() => {
        let updatedData = dataMapel

        if(searchDataMapel !== '') {
            updatedData = updatedData.filter(value => value['nama_mapel'].toLowerCase().includes(searchDataMapel.toLowerCase()))
        }

        setFilteredDataMapel(updatedData)
    }, [searchDataMapel])

    const hitungNilaiRapotRataRata = (value) => {
        return ((Number(value['semester_1']) + Number(value['semester_2']) + Number(value['semester_3']) + Number(value['semester_4']) + Number(value['semester_5']) + Number(value['semester_6'])) / 6).toFixed(1)
    }

    const submitFormTambah = () => {
        console.log(formTambah)
        if(formTambah['fk_id_mapel'] === '') {
            return
        }

        document.getElementById('tambah_nilai').close()

        const {nama_mapel, kategori_mapel, ...payload} = formTambah
        
        Swal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan menambahkan nilai mata pelajaran baru',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
        }).then((answer) => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: "Sedang memproses data",
                    timer: 60000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    didOpen: async () => {
                        const response = await M_Nilai_create({
                            ...payload,
                            fk_nilai_nis_siswa: detailSiswa['kategori'] === 'DATA SISWA' ? detailSiswa['nis'] : null,
                            fk_nilai_nis_mutasi_siswa: detailSiswa['kategori'] === 'DATA MUTASI SISWA' ? detailSiswa['nis'] : null,
                            fk_nilai_nis_alumni: detailSiswa['kategori'] === 'DATA ALUMNI' ? detailSiswa['nis'] : null,
                        })

                        if(response.success) {
                            await getDataNilai()
                            setFormTambah(formatFormTambah)
                            Swal.fire({
                                title: 'Sukses',
                                text: 'Berhasil menambahkan nilai mata pelajaran yang baru',
                                icon: 'success'
                            })
                        }else{
                            Swal.fire({
                                title: 'Gagal',
                                text: 'Terdapat kesalahan disaat memproses data, hubungi Administrator',
                                icon: 'error'
                            }).then(() => {
                                document.getElementById('tambah_nilai').showModal()
                            })
                        }
                    }
                })
            }
        })
    }

    return (
        <MainLayoutPage>
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md">
                <div className="text-xs">
                    <button type="button" className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                        <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit opacity-70" />
                        Import
                    </button>
                    <hr className="my-5 dark:opacity-10" />
                    {loadingFetch['siswa'] !== 'fetched' && (
                        <div className="loading loading-sm loading-spinner opacity-50 mb-5"></div>
                    )}
                    {loadingFetch['siswa'] === 'fetched' && dataSiswa.length > 0 && (
                        <>
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faFilter} className="w-3 h-3 text-inherit" />
                                Filter Data
                            </div>
                            <hr className="my-1 opacity-0" />
                            <div className="flex md:flex-row flex-col gap-3">
                                <FontAwesomeIcon icon={faFilter} className="w-3 h-3 text-inherit opacity-0 hidden md:block" />
                                <div className="space-y-3 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                        <div className="w-full md:w-1/6 opacity-60">
                                            Kelas
                                        </div>
                                        <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                            {Array.from(new Set(dataSiswa.map(value => value['kelas']))).map((kelas, index) => (
                                                <button key={index} type="button" onClick={() => handleFilterDataSiswa('kelas', kelas)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataSiswa.kelas.includes(kelas) ? 'bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-200' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    {kelas}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                        <div className="w-full md:w-1/6 opacity-60">
                                            Jurusan
                                        </div>
                                        <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                            {Array.from(new Set(dataSiswa.map(value => value['jurusan']))).map((jurusan, index) => (
                                                <button key={index} type="button"  onClick={() => handleFilterDataSiswa('jurusan', jurusan)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataSiswa.jurusan.includes(jurusan) ? 'bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-200' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    {jurusan}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                        <div className="w-full md:w-1/6 opacity-60">
                                            Rombel
                                        </div>
                                        <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                            {Array.from(new Set(dataSiswa.map(value => value['rombel']))).map((rombel, index) => (
                                                <button key={index} type="button"  onClick={() => handleFilterDataSiswa('rombel', rombel)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataSiswa.rombel.includes(rombel) ? 'bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-200' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    {rombel}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                        <div className="w-full md:w-1/6 opacity-60">
                                            Tahun Masuk
                                        </div>
                                        <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                            {Array.from(new Set(dataSiswa.map(value => value['tahun_masuk']))).map((tahun_masuk, index) => (
                                                <button key={index} type="button"  onClick={() => handleFilterDataSiswa('tahun_masuk', tahun_masuk)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataSiswa.tahun_masuk.includes(tahun_masuk) ? 'bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-200' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    {tahun_masuk || 'Tidak ada'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                        <div className="w-full md:w-1/6 opacity-60">
                                            Tahun Keluar
                                        </div>
                                        <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                            {Array.from(new Set(dataSiswa.map(value => value['tahun_keluar']))).map((tahun_keluar, index) => (
                                                <button key={index} type="button"  onClick={() => handleFilterDataSiswa('tahun_keluar', tahun_keluar)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataSiswa.tahun_keluar.includes(tahun_keluar) ? 'bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-200' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    {tahun_keluar || 'Tidak ada'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                        <div className="w-full md:w-1/6 opacity-60">
                                            Kategori Data
                                        </div>
                                        <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                            {Array.from(new Set(dataSiswa.map(value => value['kategori']))).map((kategori, index) => (
                                                <button key={index} type="button"  onClick={() => handleFilterDataSiswa('kategori', kategori)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataSiswa.kategori.includes(kategori) ? 'bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-200' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                                    {kategori || 'Tidak ada'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <hr className="my-3 dark:opacity-10" />
                            <p>
                                Hasil data ditemukan sebanyak {filteredDataSiswa.length} data
                            </p>
                            <hr className="my-3 dark:opacity-10" />
                        </>
                    )}
                    <div className="p-3 rounded-lg border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                        
                        <div className="grid grid-cols-12">
                            <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                <input type="checkbox" checked={selectAll} onChange={() => handleSelectAll()} />
                                Nama Siswa
                            </div>
                            <div className="col-span-2 hidden md:flex items-center">
                                Kategori Data
                            </div>
                            <div className="col-span-2 hidden md:flex items-center">
                                NISN / NIS
                            </div>
                            <div className="hidden md:flex items-center col-span-2">
                                Kelas
                            </div>
                            <div className="hidden md:flex items-center col-span-2">
                                Tahun Masuk
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center">
                                <input type="text" value={searchDataSiswa} onChange={e => setSearchDataSiswa(e.target.value)} className="w-full px-2 py-1 rounded dark:bg-zinc-700 bg-white border dark:border-zinc-600" placeholder="Cari" />
                            </div>
                        </div>
                    </div>
                    {loadingFetch['siswa'] !== 'fetched' && (
                        <div className="flex justify-center items-center py-3">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    )}
                    {loadingFetch['siswa'] === 'fetched' && dataSiswa.length < 1 && (
                        <div className="flex justify-center items-center py-3 gap-3 opacity-50">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 text-inherit" />
                            Data Siswa kosong
                        </div>
                    )}
                    {loadingFetch['siswa'] === 'fetched' && dataSiswa.length > 0 && (
                        <div className="py-3 relative w-full overflow-auto max-h-[500px]">
                            {filteredDataSiswa.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                                <div key={index} className="grid grid-cols-12 p-3 w-full dark:hover:bg-zinc-800 hover:bg-zinc-100 rounded group">
                                    <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                        <input type="checkbox" checked={selectedDataSiswa.includes(value['nis'])} onChange={() => handleSelectDataSiswa(value['nis'])} className="cursor-pointer" />
                                        {value['nama_siswa']}
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        {value['kategori']}
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        {value['nis']} / {value['nisn']}
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        {value['kelas']} {value['jurusan']} {value['rombel']}
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        {value['tahun_masuk']}
                                    </div>
                                    <div className="col-span-5 md:col-span-2 flex items-center justify-center gap-1 md:gap-3">
                                        <button type="button" className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex md:hidden items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                            <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                        </button>
                                        <button type="button" onClick={() => setDetailSiswa(value)} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-teal-500 dark:hover:border-teal-500/50 hover:bg-teal-100 dark:hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-500 ease-out duration-200">
                                            <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                        </button>
                                        <button type="button" className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                            <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <hr className="my-2 opacity-0" />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-xs">
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                <FontAwesomeIcon icon={faCheckSquare} className="w-3 h-3 text-inherit" />
                                {selectedDataSiswa.length} Data
                            </div>
                            <div className="flex items-center justify-center w-full md:w-fit gap-3 px-3">
                                <button type="button" className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <p className="pl-3  w-full md:w-fit">
                                Total {dataSiswa.length} Data
                            </p>
                        </div>
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesLeft} className="w-3 h-3 text-inherit" />
                                </button>
                                    {pagination}
                                <button type="button" onClick={() => setPagination(state => state < Math.ceil(dataSiswa.length / totalList) ? state + 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesRight} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 pl-3  w-full md:w-fit">
                                <select value={totalList} onChange={e => handleTotalList(e.target.value)} className="select select-bordered w-full select-sm dark:bg-zinc-800 bg-zinc-100">
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
            {detailSiswa === null && (
                <>
                    <hr className="my-3 opacity-0" />
                    <div className="flex gap-5 items-center p-3 border rounded-lg dark:border-zinc-700 w-fit text-xs shadow-md dark:shadow-white/20 shadow-black/20 bg-white dark:bg-transparent">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4 text-inherit" />
                        <p>
                            Anda harus memilih <b>Data Siswa</b> terlebih dahulu untuk melihat Rekapan Nilai
                        </p>
                    </div>
                    <hr className="my-3 opacity-0" />
                </>
            )}
            

            {detailSiswa !== null && (
                <>
                    <hr className="my-3 opacity-0" />
                    <div className="p-5 border relative dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                        <h1 className="text-xl md:text-3xl font-medium">
                            {detailSiswa['nama_siswa']}
                        </h1>
                        <hr className="my-3 dark:opacity-10" />
                        <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-2">
                            <div className="flex items-center gap-2 w-full">
                                <button type="button" onClick={() => document.getElementById('tambah_nilai').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit opacity-70" />
                                    Tambah Nilai
                                </button>
                                <dialog ref={ref_modal_tambah} id="tambah_nilai" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                    <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 md:max-w-[900px]">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Tambah Nilai</h3>
                                        <hr className="my-1 opacity-0" />
                                        <p className="opacity-70">
                                            Nilai dibawah ini ditujukan untuk <span className="font-bold opacity-100">{detailSiswa['nama_siswa']}</span>
                                        </p>
                                        <hr className="my-3 dark:opacity-10" />
                                        <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                                            <div className="w-full md:w-1/3">
                                                <input type="text" value={searchDataMapel} onChange={e => setSearchDataMapel(e.target.value)} className="w-full px-2 py-1 rounded-md border dark:border-zinc-700 dark:bg-zinc-800" placeholder="Cari dan Pilih Mata Pelajaran" />
                                                <hr className="my-1 opacity-0" />
                                                <div className="relative w-full space-y-1 max-h-[200px] overflow-auto">
                                                    {filteredDataMapel.map((value, index) => !dataNilai.map(v => v['nama_mapel']).includes(value['nama_mapel']) && (
                                                        <div key={index} className="p-3 rounded-md border dark:border-zinc-700 hover:border-zinc-700 dark:hover:border-zinc-400 ease-out duration-300 flex items-center justify-between">
                                                            <p>
                                                                {value['nama_mapel']}
                                                            </p>
                                                            <input type="radio" value={value['id_mapel']} checked={value['id_mapel'] === formTambah.fk_id_mapel} onChange={() => setFormTambah(state => ({...state, fk_id_mapel: value['id_mapel'], kategori_mapel: value['kategori_mapel'], nama_mapel: value['nama_mapel']}))} name="radio_tambah_nilai_mapel" className="cursor-pointer radio radio-xs border dark:border-zinc-100" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-full md:w-2/3">
                                                <div className="divide-y divide-zinc-300 dark:divide-zinc-700 w-full">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 w-full pt-1 pb-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            ID Mata Pelajaran
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {formTambah['fk_id_mapel']}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 w-full  py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Nama Mata Pelajaran
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {formTambah['nama_mapel']}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 w-full  py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Kategori Mata Pelajaran
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {formTambah['kategori_mapel']}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 w-full  py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Nilai Ujian Sekolah
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input type="number" value={formTambah['nilai_ujian']} onChange={e => setFormTambah(state => ({...state, nilai_ujian: e.target.value}))} className="w-full px-3 py-2 border dark:border-zinc-800 rounded-md bg-transparent" placeholder="Masukkan nilai" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-6 *:p-2 border dark:border-zinc-700 divide-y dark:divide-zinc-700">
                                                    <div className="col-span-6 flex justify-center items-center font-bold">
                                                        Semester
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                        1
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                        2
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                        3
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                        4
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                        5
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                        6
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-6 divide-x dark:divide-zinc-700 border-x border-b dark:border-zinc-700">
                                                    <div className="col-span-1 flex justify-center items-center">
                                                        <input type="number" value={formTambah['semester_1']} onChange={e => setFormTambah(state => ({...state, semester_1: e.target.value}))} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center">
                                                        <input type="number" value={formTambah['semester_2']} onChange={e => setFormTambah(state => ({...state, semester_2: e.target.value}))} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center">
                                                        <input type="number" value={formTambah['semester_3']} onChange={e => setFormTambah(state => ({...state, semester_3: e.target.value}))} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center">
                                                        <input type="number" value={formTambah['semester_4']} onChange={e => setFormTambah(state => ({...state, semester_4: e.target.value}))} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center">
                                                        <input type="number" value={formTambah['semester_5']} onChange={e => setFormTambah(state => ({...state, semester_5: e.target.value}))} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                    </div>
                                                    <div className="col-span-1 flex justify-center items-center">
                                                        <input type="number" value={formTambah['semester_6']} onChange={e => setFormTambah(state => ({...state, semester_6: e.target.value}))} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                    </div>
                                                </div>
                                                <hr className="my-1 opacity-0" />

                                                <hr className="my-1 opacity-0" />
                                                <button type="button" onClick={() => submitFormTambah()} className="px-3 py-2 rounded-md flex items-center gap-3 w-full md:w-fit justify-center bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                    Simpan
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </dialog>
                                <button type="button" className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit opacity-70" />
                                    Print
                                </button>
                            </div>
                            <button type="button" onClick={() => setDetailSiswa(null)} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit opacity-70" />
                                Batal
                            </button>
                        </div>
                        <hr className="my-3 opacity-0" />
                        <div className="hidden md:grid grid-cols-12 border-b dark:border-zinc-700 *:px-3 *:py-2 divide-x dark:divide-zinc-700">
                            <div className="col-span-3"></div>
                            <div className="col-span-6 flex items-center justify-center font-extrabold">
                                SEMESTER
                            </div>
                            <div className="col-span-3"></div>
                        </div>
                        <div className="grid grid-cols-12 divide-x dark:divide-zinc-700 border-b dark:border-zinc-700 border-t md:border-t-0">
                            <div className="col-span-7 md:col-span-3 font-bold px-3 py-2 flex items-center">
                                MATA PELAJARAN
                            </div>
                            <div className="col-span-1 hidden md:flex items-center justify-center font-extrabold px-3 py-2">
                                1
                            </div>
                            <div className="col-span-1 hidden md:flex items-center justify-center font-extrabold px-3 py-2">
                                2
                            </div>
                            <div className="col-span-1 hidden md:flex items-center justify-center font-extrabold px-3 py-2">
                                3
                            </div>
                            <div className="col-span-1 hidden md:flex items-center justify-center font-extrabold px-3 py-2">
                                4
                            </div>
                            <div className="col-span-1 hidden md:flex items-center justify-center font-extrabold px-3 py-2">
                                5
                            </div>
                            <div className="col-span-1 hidden md:flex items-center justify-center font-extrabold px-3 py-2">
                                6
                            </div>
                            <div className="col-span-1 hidden md:flex items-center justify-center font-extrabold px-3 py-2 text-center">
                                Nilai Rata - rata Rapor
                            </div>
                            <div className="col-span-1 hidden md:flex items-center justify-center font-extrabold px-3 py-2 text-center">
                                Nilai Ujian Sekolah
                            </div>
                            <div className="col-span-5 md:col-span-1 flex items-center justify-center font-extrabold px-3 py-2"></div>
                        </div>
                        {loadingFetch['nilai'] !== 'fetched' && (
                            <div className="flex items-center justify-center py-5">
                                <div className="loading loading-spinner loading-sm opacity-50"></div>
                            </div>
                        )}
                        {loadingFetch['nilai'] === 'fetched' && dataNilai.length < 1 && (
                            <div className="flex items-center justify-center py-5 gap-3 italic opacity-60">
                                Siswa ini belum memiliki nilai
                            </div>
                        )}
                        {loadingFetch['nilai'] === 'fetched' && (
                            <>
                                <div className="divide-y dark:divide-zinc-700 border-b dark:border-zinc-700">
                                    {dataNilai.map((value, index) => (
                                        <div key={index} className="grid grid-cols-12  *:px-3 *:py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                            <div className="col-span-7 md:col-span-3 flex items-center">
                                                {value['nama_mapel']}
                                            </div>
                                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                                <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-black font-medium">
                                                    {value['semester_1']}
                                                </p>
                                            </div>
                                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                                <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-black font-medium">
                                                    {value['semester_2']}
                                                </p>
                                            </div>
                                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                                <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-black font-medium">
                                                    {value['semester_3']}
                                                </p>
                                            </div>
                                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                                <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-black font-medium">
                                                    {value['semester_4']}
                                                </p>
                                            </div>
                                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                                <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-black font-medium">
                                                    {value['semester_5']}
                                                </p>
                                            </div>
                                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                                <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-black font-medium">
                                                    {value['semester_6']}
                                                </p>
                                            </div>
                                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                                <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-black font-medium">
                                                    {hitungNilaiRapotRataRata(value)}
                                                </p>
                                            </div>
                                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                                <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-black font-medium">
                                                    {value['nilai_ujian']}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-center gap-1 md:gap-3 col-span-5 md:col-span-1">
                                                <button type="button" className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex md:hidden items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                                </button>
                                                <button type="button" onClick={() => document.getElementById(`ubah_nilai_${index}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                                </button>
                                                <dialog id={`ubah_nilai_${index}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                                    <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 md:max-w-[700px]">
                                                        <form method="dialog">
                                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                        </form>
                                                        <h3 className="font-bold text-lg">Ubah Nilai</h3>
                                                        <hr className="my-1 opacity-0" />
                                                        <p className="opacity-70">
                                                            Nilai dibawah ini ditujukan untuk <span className="font-bold opacity-100">Ziyad Jahizh K</span>
                                                        </p>
                                                        <hr className="my-3 dark:opacity-10" />
                                                        <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                                                            <div className="w-full">
                                                                <div className="divide-y divide-zinc-300 dark:divide-zinc-700 w-full">
                                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 w-full pt-1 pb-3">
                                                                        <p className="w-full md:w-1/3 opacity-70">
                                                                            ID Mata Pelajaran
                                                                        </p>
                                                                        <p className="w-full md:w-2/3">
                                                                            {value['fk_id_mapel']}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 w-full  py-3">
                                                                        <p className="w-full md:w-1/3 opacity-70">
                                                                            Nama Mata Pelajaran
                                                                        </p>
                                                                        <p className="w-full md:w-2/3">
                                                                            {value['nama_mapel']}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 w-full  py-3">
                                                                        <p className="w-full md:w-1/3 opacity-70">
                                                                            Kategori Mata Pelajaran
                                                                        </p>
                                                                        <p className="w-full md:w-2/3">
                                                                            {value['kategori_mapel']}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 w-full  py-3">
                                                                        <p className="w-full md:w-1/3 opacity-70">
                                                                            Nilai Ujian Sekolah
                                                                        </p>
                                                                        <div className="w-full md:w-2/3">
                                                                            <input type="number" defaultValue={value['nilai_ujian']} className="w-full px-3 py-2 border dark:border-zinc-800 rounded-md bg-transparent" placeholder="Masukkan nilai" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-6 *:p-2 border dark:border-zinc-700 divide-y dark:divide-zinc-700">
                                                                    <div className="col-span-6 flex justify-center items-center font-bold">
                                                                        Semester
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                                        1
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                                        2
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                                        3
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                                        4
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                                        5
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center font-bold">
                                                                        6
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-6 divide-x dark:divide-zinc-700 border-x border-b dark:border-zinc-700">
                                                                    <div className="col-span-1 flex justify-center items-center">
                                                                        <input type="number" defaultValue={value['semester_1']} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center">
                                                                        <input type="number" defaultValue={value['semester_2']}  className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center">
                                                                        <input type="number" defaultValue={value['semester_3']} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center">
                                                                        <input type="number" defaultValue={value['semester_4']} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center">
                                                                        <input type="number" defaultValue={value['semester_5']} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-center items-center">
                                                                        <input type="number" defaultValue={value['semester_6']} className="w-full text-center p-2 bg-transparent" placeholder="...." />
                                                                    </div>
                                                                </div>
                                                                <hr className="my-1 opacity-0" />
                                                                <button type="button" className="px-3 py-2 rounded-md flex items-center gap-3 w-full md:w-fit justify-center bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                                    Simpan
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </dialog>
                                                <button type="button" className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="hidden md:grid grid-cols-12 *:px-3 *:py-4 divide-x dark:divide-zinc-700 border-b dark:border-zinc-700">
                                    <div className="col-span-9 flex items-center justify-end font-medium">
                                        Rata - rata
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center">
                                        <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 font-medium">
                                            87.9
                                        </p>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center">
                                        <p className="p-1 rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 font-medium">
                                            87.9
                                        </p>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center"></div>
                                </div>
                                <div className="flex md:hidden justify-end items-center px-3 py-4">
                                    <button type="button" className="w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                                        <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit opacity-70" />
                                        Cek Total Rata - rata
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
               
            )}
        </MainLayoutPage>
    )
}