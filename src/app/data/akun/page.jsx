'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta, mont, rale } from "@/config/fonts";
import { downloadCSV } from "@/lib/csvDownload";
import { createAkun, deleteMultipleAkunById, deleteSingleAkunById, getAllAkun, updateSingleAkun } from "@/lib/model/akunModel";
import { getAllPegawai } from "@/lib/model/pegawaiModel";
import { logRiwayat } from "@/lib/model/riwayatModel";
import { faAlignLeft, faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faArrowDown, faArrowUp, faArrowsUpDown, faCheck, faCheckSquare, faClockRotateLeft, faDownload, faEdit, faEllipsis, faEllipsisH, faEye, faFile, faFilter, faInfo, faInfoCircle, faPlus, faPlusSquare, faPrint, faSave, faSpinner, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";
import { Nunito, Quicksand } from "next/font/google";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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

export default function DataAkunPage() {

    const [data, setData] = useState([])
    const [dataPegawai, setDataPegawai] = useState([])
    const [formTambah, setFormTambah] = useState(formatForm)
    const [filteredDataPegawai, setFilteredDataPegawai] = useState([])
    const [searchDataPegawai, setSearchDataPegawai] = useState('')
    const [loadingFetch, setLoadingFetch] = useState({
        data: '', pegawai: ''
    })
    const [filteredData, setFilteredData] = useState([])
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [selectAll, setSelectAll] = useState(false)
    const [filterData, setFilterData] = useState({
        role_akun: []
    })

    const getData = async () => {
        setLoadingFetch(state => ({...state, data: 'loading'}))
        const response = await getAllAkun()
        setData(response)
        setFilteredData(response)
        setLoadingFetch(state => ({...state, data: 'fetched'}))
    }

    const getDataPegawai = async () => {
        setLoadingFetch(state => ({...state, pegawai: 'loading'}))
        const response = await getAllPegawai()
        if(response.success) {
            setDataPegawai(response.data)
            setFilteredDataPegawai(response.data)
        }
        setLoadingFetch(state => ({...state, pegawai: 'fetched'}))
    }

    useEffect(() => {
        getData()
        getDataPegawai()
    }, [])

    const submitFormTambah = async (e, modal) => {
        e.preventDefault()


        if(formTambah['fk_akun_id_pegawai'] === '' || formTambah['nama_akun'] === '') {
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
                const response = await createAkun({
                    fk_akun_id_pegawai: formTambah['fk_akun_id_pegawai'],
                    password_akun: formTambah['password_akun'],
                    role_akun: formTambah['role_akun']
                })

                await logRiwayat({
                    aksi: 'Tambah',
                    kategori: 'Data Akun',
                    keterangan: 'Menambahkan 1 Data',
                    records: JSON.stringify(formTambah)
                })

                if(response) {
                    setSearchDataPegawai('')
                    setFormTambah(formatForm)
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: response.message,
                        timer: 3000,
                        timerProgressBar: true
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: response.message,
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const submitDeleteAkun = async (id_akun) => {
        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                let response

                if(id_akun) {
                    response = await deleteSingleAkunById(id_akun)
                    await logRiwayat({
                        aksi: 'Hapus',
                        kategori: 'Data Akun',
                        keterangan: 'Menghapus 1 Data',
                        records: JSON.stringify({ id_akun })
                    })
                }else{
                    response = await deleteMultipleAkunById(selectedData)
                    await logRiwayat({
                        aksi: 'Hapus',
                        kategori: 'Data Akun',
                        keterangan: `Menghapus ${selectedData.length} Data`,
                        records: JSON.stringify({ id_akun })
                    })
                }

                if(response) {
                    setSelectedData([])
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: response.message
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        icon: 'error',
                        text: response.message
                    })
                }
            }
        })
    }

    useEffect(() => {
        let updatedData = dataPegawai

        if(searchDataPegawai !== '') {
            updatedData = updatedData.filter(value => value['nama_pegawai'].toLowerCase().includes(searchDataPegawai.toLowerCase()))
        }

        setFilteredDataPegawai(updatedData)
    }, [searchDataPegawai])

    const handleSelectData = (id_akun) => {
        setSelectedData(state => {
            if(state.includes(id_akun)) {
                return state.filter(value => value !== id_akun)
            }else{
                return [...state, id_akun]
            }
        })
    }

    const submitEditAkun = (e, modal, id_akun) => {
        e.preventDefault()

        showModal(modal).show('close')

        const payload = {
            password_akun: e.target[0].value,
            role_akun: e.target[1].value
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await updateSingleAkun({...payload, id_akun})

                await logRiwayat({
                    aksi: 'Ubah',
                    kategori: 'Data Akun',
                    keterangan: 'Mengubah 1 Data',
                    records: JSON.stringify({...payload, id_akun})
                })

                if(response) {
                    setSelectedData([])
                    setSelectAll(false)
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: response.message,
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
                value['nama_akun'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['email_akun'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['password_akun'].toLowerCase().includes(searchFilter.toLowerCase())
            )
        }

        if(filterData['role_akun'].length > 0) {
            updatedData = updatedData.filter(value => filterData['role_akun'].includes(value['role_akun']))
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

    const handleSelectAll = () => {
        if(filteredData.length > 0) {
            setSelectAll(state => {
                if(state) {
                    setSelectedData([])
                }else{
                    setSelectedData(state => filteredData.map(value => value['id_akun']))    
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
                        <button type="button" onClick={() => document.getElementById('tambah_akun').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit opacity-70" />
                            Tambah
                        </button>
                        <dialog id="tambah_akun" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded md:max-w-[900px] border dark:border-zinc-800">
                                <form method="dialog">
                                    <button onClick={() => setFormTambah(formatForm)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Tambah Akun</h3>
                                <hr className="my-2 opacity-0" />
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="w-full md:w-1/2 space-y-2">
                                        <label className="input input-bordered input-sm flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800">
                                            <input type="text" value={searchDataPegawai} onChange={e => setSearchDataPegawai(e.target.value)} className="grow" placeholder="Cari pegawai disini" />
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                                        </label>
                                        <div className=" py-2 relative overflow-auto max-h-[300px] space-y-1">
                                            {loadingFetch['pegawai'] !== 'fetched' && (
                                                <div className="w-full flex justify-center items-center">
                                                    <div className="loading loading-sm text-zinc-500 loading-spinner"></div>
                                                </div>
                                            )}
                                            {loadingFetch['pegawai'] === 'fetched' && dataPegawai.length < 1 && (
                                                <div className="w-full flex justify-center items-center text-zinc-500">
                                                    Data Pegawai Kosong!
                                                </div>
                                            )}

                                            {filteredDataPegawai.slice(0, 20).map((value, index) => (
                                                <label key={index} htmlFor={index} className="flex items-center w-full justify-between p-3 border dark:border-zinc-800 hover:border-zinc-700 dark:hover:border-zinc-400 rounded-lg text-xs cursor-pointer ease-out duration-200 has-[:checked]:border-zinc-400">
                                                    <p>
                                                        {value['nama_pegawai']}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="opacity-50">
                                                            {value['jabatan']}
                                                        </p>
                                                        <input type="radio" id={index} value={value['id_pegawai']} checked={formTambah['fk_akun_id_pegawai'] == value['id_pegawai']} onChange={() => setFormTambah(state => ({...state, email_akun: value['email_pegawai'], nama_akun: value['nama_pegawai'], fk_akun_id_pegawai: Number(value['id_pegawai'])}))} name="radio" className="" />
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <form onSubmit={e => submitFormTambah(e, 'tambah_akun')} className="w-full md:w-1/2 divide-y h-fit dark:divide-zinc-800 ">
                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                            <p className="w-full md:w-1/3 opacity-50">
                                                Nama Pegawai
                                            </p>
                                            <p className="w-full md:w-2/3">
                                                {formTambah['nama_akun']}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                            <p className="w-full md:w-1/3 opacity-50">
                                                ID Pegawai
                                            </p>
                                            <p className="w-full md:w-2/3">
                                                {formTambah['fk_akun_id_pegawai']}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                            <p className="w-full md:w-1/3 opacity-50">
                                                Email
                                            </p>
                                            <p className="w-full md:w-2/3">
                                                <label className="input input-bordered flex items-center gap-2 input-sm dark:bg-zinc-800 bg-zinc-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                                    <input type="text" required readOnly className="grow" value={formTambah['email_akun']} onChange={e => setFormTambah(state => ({...state, email_akun: e.target.value}))}  placeholder="Email" />
                                                </label>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                            <p className="w-full md:w-1/3 opacity-50">
                                                Password
                                            </p>
                                            <p className="w-full md:w-2/3">
                                                <label className="input input-bordered flex items-center gap-2 input-sm dark:bg-zinc-800 bg-zinc-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                                    <input type="text" required className="grow" value={formTambah['password_akun']} onChange={e => setFormTambah(state => ({...state, password_akun: e.target.value}))} placeholder="Password" />
                                                </label>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                            <p className="w-full md:w-1/3 opacity-50">
                                                Role
                                            </p>
                                            <p className="w-full md:w-2/3">
                                                <select value={formTambah['role_akun']} required onChange={e => setFormTambah(state => ({...state, role_akun: e.target.value}))} className="select select-bordered w-full select-sm dark:bg-zinc-800 bg-zinc-100">
                                                    <option value={''} disabled >-- Pilih Role --</option>
                                                    <option value="Operator">Operator</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </p>
                                        </div>
                                        <div className="py-3 px-2">
                                            <button type="submit" className="px-3 py-2 rounded bg-green-600 hover:bg-green-400 focus:bg-green-700 flex items-center justify-center w-fit gap-3 text-white">
                                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                Simpan
                                            </button>
                                        </div>
                                    </form>
                                </div>
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
                                    Role Akun
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['role_akun']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('role_akun', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['role_akun'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
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
                                Nama Pegawai
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                ID Pegawai
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Email
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Password
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Role
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
                                Data Akun tidak ada!
                            </div>
                        )}
                        {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                            <div key={index} className="grid grid-cols-12 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 ease-out duration-300">
                                <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                    <input type="checkbox" checked={selectedData.includes(value['id_akun'])} onChange={() => handleSelectData(value['id_akun'])} className="cursor-pointer" />
                                    {value['nama_akun']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    <p className="px-2 py-0.5 rounded-full dark:bg-zinc-700 text-xs bg-zinc-100">
                                        {value['id_pegawai']}
                                    </p>
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['email_akun']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['password_akun']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['role_akun'] === 'Admin' && (
                                        <p className="px-2 py-0.5 rounded-full bg-red-500 text-white dark:bg-red-500/10 dark:text-red-500">
                                            Admin
                                        </p>
                                    )}
                                    {value['role_akun'] === 'Operator' && (
                                        <p className="px-2 py-0.5 rounded-full bg-amber-500 text-white dark:bg-amber-500/10 dark:text-amber-500">
                                            Operator
                                        </p>
                                    )}
                                </div>
                                <div className="col-span-5 md:col-span-2 flex items-center justify-center md:gap-3 gap-1">
                                    <button type="button" onClick={() => document.getElementById(`info_akun_${index}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 md:hidden flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`info_akun_${index}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Informasi Akun</h3>
                                            <hr className="my-2 opacity-0" />
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Pegawai
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_akun']}
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
                                                            {value['email_akun']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Password
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['password_akun']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Role
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['role_akun']}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => document.getElementById(`edit_akun_${index}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`edit_akun_${index}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ubah Akun</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={e => submitEditAkun(e, `edit_akun_${index}`, Number(value['id_akun']))} className="flex flex-col md:flex-row gap-2">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Pegawai
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_akun']}
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
                                                            {value['email_akun']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Password
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            <label className="input input-bordered flex items-center gap-2 input-sm dark:bg-zinc-800 bg-zinc-100">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                                                <input type="text" className="grow" defaultValue={value['password_akun']} placeholder="Password" />
                                                            </label>
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Role
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            <select defaultValue={value['role_akun']} className="select select-bordered w-full select-sm dark:bg-zinc-800 bg-zinc-100">
                                                                <option value={''} disabled >-- Pilih Role --</option>
                                                                <option value="Operator">Operator</option>
                                                                <option value="Admin">Admin</option>
                                                            </select>
                                                        </p>
                                                    </div>
                                                    <div className="py-3 px-2">
                                                        <button type="submit" className="px-3 py-2 rounded bg-green-600 hover:bg-green-400 focus:bg-green-700 flex items-center justify-center w-fit gap-3 text-white">
                                                            <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                            Simpan
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => submitDeleteAkun(value['id_akun'])} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
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
                                    <button type="button" onClick={() => submitDeleteAkun()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
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
