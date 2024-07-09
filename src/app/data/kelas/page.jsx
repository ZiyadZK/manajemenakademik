'use client'

import MainLayoutPage from "@/components/mainLayout"
import { deleteRoleKelas, getAllKelas, setGuruBK, setWaliKelas } from "@/lib/model/kelasModel"
import { getAllPegawai } from "@/lib/model/pegawaiModel"
import { getAllSiswa } from "@/lib/model/siswaModel"
import { faEdit, faSave, faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

const formatFormUbahWaliKelas = {
    kelas: '',
    jurusan: '',
    rombel: '',
    fk_walikelas_id_pegawai: '',
    nama_wali_kelas: ''
}

const formatFormUbahGuruBK = {
    kelas: '',
    jurusan: '',
    rombel: '',
    fk_gurubk_id_pegawai: '',
    nama_gurubk_kelas: ''
}

export default function DataKelasPage() {

    const [formUbahWaliKelas, setFormUbahWaliKelas] = useState(formatFormUbahWaliKelas)
    const [formUbahGuruBK, setFormUbahGuruBK] = useState(formatFormUbahGuruBK)

    const [kelasList, setKelasList] = useState([])
    const [dataKelas, setDataKelas] = useState([])
    const [siswaList, setSiswaList] = useState([])
    const [filteredKelasList, setFilteredKelasList] = useState([])
    const [loadingFetch, setLoadingFetch] = useState({
        kelas: '', pegawai: '', dataKelas: ''
    })
    const [filterData, setFilterData] = useState({
        kelas: [], jurusan: [], rombel: [], nama_wali_kelas: '', nama_gurubk_kelas: ''
    })
    const [pegawaiList, setPegawaiList] = useState([])
    const [filteredPegawaiList, setFilteredPegawaiList] = useState([])
    const [searchPegawaiList, setSearchPegawaiList] = useState('')

    useEffect(() => {
        setFilteredPegawaiList(state => {
            let updatedData = pegawaiList

            if(searchPegawaiList !== '') {
                updatedData = updatedData.filter(value => 
                    value['nama_pegawai'].toLowerCase().includes(searchPegawaiList.toLowerCase())
                )
            }

            return updatedData
        })
    }, [searchPegawaiList])

    const getKelasList = async () => {
        setLoadingFetch(state => ({...state, kelas: 'loading'}))
        const response = await getAllSiswa()
        const data = Array.from(new Set(response.map(value => `${value['kelas']} ${value['jurusan']} ${value['rombel']}`))).map(value => value)
        setKelasList(data)
        setFilteredKelasList(data)
        setSiswaList(response)
        setLoadingFetch(state => ({...state, kelas: 'fetched'}))   
    }
    
    const getPegawai = async () => {
        setLoadingFetch(state => ({...state, pegawai: 'loading'}))
        const response = await getAllPegawai()
        if(response.success) {
            setPegawaiList(response.data)
            setFilteredPegawaiList(response.data)
        }
        setLoadingFetch(state => ({...state, pegawai: 'fetched'}))
    }

    const getDataKelas = async () => {
        setLoadingFetch(state => ({...state, dataKelas: 'loading'}))
        const response = await getAllKelas()
        if(response.success) {
            setDataKelas(response.data)
        }
        setLoadingFetch(state => ({...state, dataKelas: 'fetched'}))
    }

    const countSiswaFromKelas = (kelas, jurusan, rombel) => {
        return siswaList.filter(value => value['kelas'] === kelas).filter(value => value['jurusan'] === jurusan).filter(value => value['rombel'] === rombel).length
    }

    const getPegawaiFromDataKelas = (kelas, jurusan, rombel) => {
        return dataKelas.find(value => value['kelas'] === kelas && value['jurusan'] === jurusan && value['rombel'] === rombel)
    }

    useEffect(() => {
        getKelasList()
        getPegawai()
        getDataKelas()
    }, [])

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

    const handleEditKelas = (kelas, jurusan, rombel, type) => {
        if(type == 'wali_kelas') {
            setFormUbahWaliKelas(state => ({
                ...state,
                kelas,
                jurusan,
                rombel
            }))
            
            document.getElementById('ubah_wali_kelas').showModal()
        }else{
            setFormUbahGuruBK(state => ({
                ...state,
                kelas,
                jurusan,
                rombel
            }))
            document.getElementById('ubah_gurubk_kelas').showModal()
        }
    }

    const submitEditKelas = async (e, modal, type) => {
        e.preventDefault()

        if(type === 'wali_kelas') {
            if(formUbahWaliKelas['fk_walikelas_id_pegawai'] === '') {
                return
            }
        }else{
            if(formUbahGuruBK['fk_gurubk_id_pegawai'] === '') {
                return
            }
        }

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Sedang memproses data',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            timer: 60000,
            timerProgressBar: true,
            didOpen: async () => {
                let response

                if(type === 'wali_kelas') {
                    const {nama_pegawai, ...payload} = formUbahWaliKelas
                    response = await setWaliKelas(payload['kelas'], payload['jurusan'], payload['rombel'], payload)
                }else{
                    const {nama_pegawai, ...payload} = formUbahGuruBK
                    response = await setGuruBK(payload['kelas'], payload['jurusan'], payload['rombel'], payload)
                }

                if(response.success) {
                    await getDataKelas()
                    if(type === 'wali_kelas') {
                        setFormUbahWaliKelas(formatFormUbahWaliKelas)
                    }else{
                        setFormUbahGuruBK(formatFormUbahGuruBK)
                    }
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah data kelas tersebut',
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: "Terdapat kesalahan disaat memproses data, hubungi Administrator",
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const submitDeleteKelas = async (kelas, jurusan, rombel, type) => {
        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await deleteRoleKelas({ kelas, jurusan, rombel }, type)

                if(response.success) {
                    await getDataKelas()
                    Swal.fire({
                        title: 'Sukses',
                        text: `Berhasil menghapus Data ${type} dari kelas tersebut`,
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan disaat memproses data, hubungi Administrator!',
                        icon: 'error'
                    })
                }
            }
        })
    }

    useEffect(() => {
        let updatedData = kelasList

        if(filterData['kelas'].length > 0) {
            updatedData = updatedData.filter(value =>
                filterData['kelas'].includes(value.split(' ')[0]) 
            )
        }

        if(filterData['jurusan'].length > 0) {
            updatedData = updatedData.filter(value =>
                filterData['jurusan'].includes(value.split(' ')[1]) 
            )
        }

        if(filterData['rombel'].length > 0) {
            updatedData = updatedData.filter(value =>
                filterData['rombel'].includes(value.split(' ')[2]) 
            )
        }
        
        setFilteredKelasList(updatedData)
    }, [filterData])

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                {loadingFetch['kelas'] !== 'fetched' && (
                    <div className="loading loading-spinner loading-sm opacity-50"></div>
                )}
                {loadingFetch['kelas'] === 'fetched' && siswaList.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex md:items-center flex-col md:flex-row gap-1">
                            <p className="opacity-70 w-full md:w-1/6">
                                Kelas
                            </p>
                            <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                {Array.from(new Set(siswaList.map(value => value['kelas']))).map((value, index) => (
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
                                {Array.from(new Set(siswaList.map(value => value['jurusan']))).map((value, index) => (
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
                                {Array.from(new Set(siswaList.map(value => value['rombel']))).map((value, index) => (
                                    <button key={index} onClick={() => handleFilterData('rombel', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['rombel'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                        {value}
                                    </button>
                                ))}      
                            </div>
                        </div>
                    </div>
                )}

                <hr className="my-5 dark:opacity-10" />

                <div className="grid md:grid-cols-3 gap-2 grid-cols-1">
                    {filteredKelasList.map(value => (
                        <div className="w-full p-2 rounded-md border dark:border-zinc-700">
                            <div className="flex justify-between items-center p-2 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                <h1 className="text-lg md:text-2xl font-extrabold dark:text-zinc-300 text-zinc-600">
                                    {value}
                                </h1>
                                <div className="px-2 py-1 flex items-center gap-3 justify-center w-fit rounded-full bg-white text-zinc-800 dark:bg-zinc-950 dark:text-amber-200">
                                    <FontAwesomeIcon icon={faUser} className="w-2 h-2 text-inherit opacity-70" />
                                    {countSiswaFromKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2])}
                                </div>
                            </div>
                            <hr className="my-1 opacity-0" />
                            <div className="space-y-0">
                                <div className="flex flex-col md:flex-row gap-1 md:items-center px-2 py-3 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 rounded-md ease-out duration-200">
                                    <div className="w-full md:w-1/5 flex justify-between items-center">
                                        <div className="w-full opacity-60">
                                            Wali Kelas
                                        </div>
                                        <div className="flex md:hidden items-center gap-2">
                                            <button type="button" onClick={() => handleEditKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2], 'wali_kelas', '')} className="opacity-50 hover:opacity-100">
                                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                            </button>
                                            <button type="button" onClick={() => submitDeleteKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2], 'Wali Kelas')} className="opacity-50 hover:opacity-100">
                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-4/5 flex justify-between items-center">
                                        <p className="w-full">
                                            {loadingFetch['dataKelas'] !== 'fetched' && (
                                                <div className="loading loading-dots loading-xs opacity-50"></div>
                                            )}
                                            {getPegawaiFromDataKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2])?.nama_wali_kelas}
                                        </p>
                                        <div className="hidden md:flex items-center gap-1">
                                            <button type="button" onClick={() => handleEditKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2], 'wali_kelas', '')} className="opacity-50 hover:opacity-100">
                                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                            </button>
                                            <button type="button" onClick={() => submitDeleteKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2], 'Wali Kelas')} className="opacity-50 hover:opacity-100">
                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-1 md:items-center px-2 py-3 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 rounded-md ease-out duration-200">
                                    <div className="w-full md:w-1/5 flex justify-between items-center">
                                        <div className="w-full opacity-60">
                                            Guru BK
                                        </div>
                                        <div className="flex md:hidden items-center gap-2">
                                            <button type="button" onClick={() => handleEditKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2], 'gurubk_kelas', '')} className="opacity-50 hover:opacity-100">
                                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                            </button>
                                            <button type="button" onClick={() => submitDeleteKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2], 'Guru BK')} className="opacity-50 hover:opacity-100">
                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-4/5 flex justify-between items-center">
                                        <p className="w-full">
                                            {loadingFetch['dataKelas'] !== 'fetched' && (
                                                <div className="loading loading-dots loading-xs opacity-50"></div>
                                            )}
                                            {getPegawaiFromDataKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2])?.nama_gurubk_kelas}
                                        </p>
                                        <div className="hidden md:flex items-center gap-1">
                                            <button type="button"  onClick={() => handleEditKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2], 'gurubk_kelas', '')} className="opacity-50 hover:opacity-100">
                                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                            </button>
                                            <button type="button" onClick={() => submitDeleteKelas(value.split(' ')[0], value.split(' ')[1], value.split(' ')[2], 'Guru BK')} className="opacity-50 hover:opacity-100">
                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
                <dialog id="ubah_wali_kelas" className="modal backdrop-blur bg-gradient-to-t from-white dark:from-black">
                    <div className="modal-box dark:bg-zinc-900 border dark:border-zinc-700 rounded-md md:max-w-[800px]">
                        <form method="dialog">
                            <button onClick={() => setFormUbahWaliKelas(formatFormUbahWaliKelas)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Ubah Wali Kelas</h3>
                        <hr className="my-2 opacity-0" />
                        <div className="flex flex-col md:flex-row gap-1">
                            <div className="w-full md:w-1/2">
                                <input type="text" value={searchPegawaiList} onChange={e => setSearchPegawaiList(e.target.value)} className="w-full border bg-transparent dark:border-zinc-700 px-2 py-1 rounded-md" placeholder="Cari data pegawai disini" />
                                <hr className="my-2 opacity-0" />
                                <div className="relative overflow-auto max-h-[300px] space-y-2">
                                    {loadingFetch['pegawai'] !== 'fetched' && (
                                        <div className="w-full flex justify-center items-center">
                                            <div className="loading loading-sm text-zinc-500 loading-spinner"></div>
                                        </div>
                                    )}
                                    {loadingFetch['pegawai'] === 'fetched' && pegawaiList.length < 1 && (
                                        <div className="w-full flex justify-center items-center text-zinc-500">
                                            Data Pegawai Kosong!
                                        </div>
                                    )}

                                    {filteredPegawaiList.slice(0, 20).map((value, index) => (
                                        <label key={index} htmlFor={index} className="flex items-center w-full justify-between p-3 border dark:border-zinc-800 hover:border-zinc-700 dark:hover:border-zinc-400 rounded-lg text-xs cursor-pointer ease-out duration-200 has-[:checked]:border-zinc-400">
                                            <p>
                                                {value['nama_pegawai']}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="opacity-50">
                                                    {value['jabatan']}
                                                </p>
                                                <input type="radio" id={index} value={value['id_pegawai']} checked={formUbahWaliKelas['fk_walikelas_id_pegawai'] == value['id_pegawai']} onChange={() => setFormUbahWaliKelas(state => ({...state, nama_wali_kelas: value['nama_pegawai'], fk_walikelas_id_pegawai: Number(value['id_pegawai'])}))} name="radio" className="" />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <form onSubmit={(e) => submitEditKelas(e, 'ubah_wali_kelas', 'wali_kelas')} className="w-full md:w-1/2">
                                <div className="px-2 divide-y dark:divide-zinc-800">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            Kelas
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" value={formUbahWaliKelas['kelas']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            Jurusan
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" value={formUbahWaliKelas['jurusan']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            Rombel
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" value={formUbahWaliKelas['rombel']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            ID Pegawai
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" value={formUbahWaliKelas['fk_walikelas_id_pegawai']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            Nama Pegawai
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" defaultValue={formUbahWaliKelas['nama_wali_kelas']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3 text-white">
                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit opacity-60" />
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </dialog>
                <dialog id="ubah_gurubk_kelas" className="modal backdrop-blur bg-gradient-to-t from-white dark:from-black">
                    <div className="modal-box dark:bg-zinc-900 border dark:border-zinc-700 rounded-md md:max-w-[800px]">
                        <form method="dialog">
                            <button onClick={() => setFormUbahGuruBK(formatFormUbahGuruBK)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Ubah Guru BK Kelas</h3>
                        <hr className="my-2 opacity-0" />
                        <div className="flex flex-col md:flex-row gap-1">
                            <div className="w-full md:w-1/2">
                                <input type="text" value={searchPegawaiList} onChange={e => setSearchPegawaiList(e.target.value)} className="w-full border bg-transparent dark:border-zinc-700 px-2 py-1 rounded-md" placeholder="Cari data pegawai disini" />
                                <hr className="my-2 opacity-0" />
                                <div className="relative overflow-auto max-h-[300px] space-y-2">
                                    {loadingFetch['pegawai'] !== 'fetched' && (
                                        <div className="w-full flex justify-center items-center">
                                            <div className="loading loading-sm text-zinc-500 loading-spinner"></div>
                                        </div>
                                    )}
                                    {loadingFetch['pegawai'] === 'fetched' && pegawaiList.length < 1 && (
                                        <div className="w-full flex justify-center items-center text-zinc-500">
                                            Data Pegawai Kosong!
                                        </div>
                                    )}

                                    {filteredPegawaiList.slice(0, 20).map((value, index) => (
                                        <label key={index} htmlFor={`cb_gurubk_${index}`} className="flex items-center w-full justify-between p-3 border dark:border-zinc-800 hover:border-zinc-700 dark:hover:border-zinc-400 rounded-lg text-xs cursor-pointer ease-out duration-200 has-[:checked]:border-zinc-400">
                                            <p>
                                                {value['nama_pegawai']}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="opacity-50">
                                                    {value['jabatan']}
                                                </p>
                                                <input type="radio" id={`cb_gurubk_${index}`} value={value['id_pegawai']} checked={formUbahGuruBK['fk_gurubk_id_pegawai'] == value['id_pegawai']} onChange={() => setFormUbahGuruBK(state => ({...state, nama_gurubk_kelas: value['nama_pegawai'], fk_gurubk_id_pegawai: Number(value['id_pegawai'])}))} name="radio_gurubk" className="" />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <form onSubmit={(e) => submitEditKelas(e, 'ubah_gurubk_kelas', 'gurubk')} className="w-full md:w-1/2">
                                <div className="px-2 divide-y dark:divide-zinc-800">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            Kelas
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" value={formUbahGuruBK['kelas']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            Jurusan
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" value={formUbahGuruBK['jurusan']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            Rombel
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" value={formUbahGuruBK['rombel']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            ID Pegawai
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" value={formUbahGuruBK['fk_gurubk_id_pegawai']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 py-2">
                                        <div className="w-full md:w-1/3 opacity-60">
                                            Nama Pegawai
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <input required readOnly type="text" defaultValue={formUbahGuruBK['nama_gurubk_kelas']} className="w-full px-3 py-2 border bg-transparent dark:border-zinc-800 rounded-md" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3 text-white">
                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit opacity-60" />
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </MainLayoutPage>
    )
}