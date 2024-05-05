'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont } from "@/config/fonts"
import { dateToIso, isoToDate } from "@/lib/dateConvertes"
import { model_getAllAlumni } from "@/lib/model/alumniModel"
import { createMultiIjazah, getAllIjazah } from "@/lib/model/ijazahModel"
import { faArrowLeft, faCircleCheck, faDotCircle, faDownload, faFileCirclePlus, faPlus, faSave, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

export default function DataIjazahNewPage() {
    const router = useRouter()
    const [formData, setFormData] = useState([])
    const [ijazahList, setIjazahList] = useState([])
    const [siswaList, setSiswaList] = useState([])
    const [filteredSiswaList, setFilteredSiswaList] = useState([])
    const [searchValue, setSearchValue] = useState('')


    const getIjazahList = async () => {
        const responseIjazah = await getAllIjazah()
        if(responseIjazah.success){
            setIjazahList(responseIjazah.data)
        }
    }

    const getSiswaList = async () => {
        const responseSiswa = await model_getAllAlumni()
        if(responseSiswa.success){
            setSiswaList(responseSiswa.data)
            setFilteredSiswaList(responseSiswa.data)
        }
    }

    useEffect(() => {
        getIjazahList()
        getSiswaList()
    }, [])

    const handleSearchSiswa = () => {
        const updatedData = siswaList.filter(siswa => 
            siswa['nama_siswa'].toLowerCase().includes(searchValue.toLowerCase()) ||
            siswa['nis'].toLowerCase().includes(searchValue.toLowerCase()) ||
            siswa['nisn'].toLowerCase().includes(searchValue.toLowerCase()) ||
            siswa['kelas'].toLowerCase().includes(searchValue.toLowerCase())
        )
        setFilteredSiswaList(updatedData)
    }

    useEffect(() => {
        handleSearchSiswa()
    }, [searchValue])

    const deleteFormData = (nisn) => {
        const isExist = formData.find(form => form.nisn === nisn)
        if(isExist) {
            let updatedData = formData.filter(form => form.nisn !== nisn)
            setFormData(updatedData)
        }
    }

    const addFormData = (nisn) => {
        // Check if there's an existing data in ijazahList
        const ijazahExist = ijazahList.find(ijazah => ijazah['nisn'] === nisn)
        if(ijazahExist) {
            return toast.error('Data Ijazah Siswa tersebut sudah ada!')
        }

        // Check if there's an existing data in formData
        const formDataExist = formData.find(form => form['nisn'] === nisn)
        if(formDataExist) {
            return toast.error('Anda sudah memilih Data Siswa tersebut!')
        }

        const dataSiswa = siswaList.find(siswa => siswa['nisn'] === nisn)
        const newFormData = {
            no_ijazah: '',
            tgl_diambil: '',
            nama_lulusan: dataSiswa.nama_siswa,
            nisn: dataSiswa.nisn,
            kelas: dataSiswa.kelas,
            rombel: dataSiswa.rombel,
            no_rombel: dataSiswa.no_rombel,
            tahun_lulus: dataSiswa.tahun_keluar,
            status: 'belum diambil',
            nama_pengambil: ''
        }

        let updatedFormData = [...formData, newFormData]
        setFormData(updatedFormData)

    }

    const handleChangeFormData = (nisn, value, field) => {
        const newData = formData.map(form => form.nisn === nisn ? ({...form, [field]: value}) : form)
        setFormData(newData)
    }

    const submitFormData =  () => {
        if(formData.length < 1) {
            return toast.error('Silahkan pilih siswa terlebih dahulu!')
        }

        const isTahunEmpty = formData.filter(form => form['no_ijazah'] === '')
        if(isTahunEmpty.length > 0) {
            return toast.error('Masih terdapat kolom No Ijazah yang kosong, silahkan cek lagi!')
        }

        const isSudahDiAmbilEmpty = formData.filter(form => form['status'] === 'sudah diambil' && form['tgl_diambil'] === '')
        if(isSudahDiAmbilEmpty.length > 0) {
            return toast.error('Masih terdapat kolom Tanggal diambil yang kosong, silahkan cek lagi!')
        }

        const isNamaPengambilEmpty = formData.filter(form => form['status'] === 'sudah diambil' && form['nama_pengambil'] === '')
        if(isNamaPengambilEmpty.length > 0) {
            return toast.error('Masih terdapat kolom Diambil oleh yang kosong, silahkan cek lagi!')
        }

        Swal.fire({
            title: 'Apakah anda sudah yakin?',
            text: 'Anda akan menambahkan beberapa data ijazah',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed){
                Swal.fire({
                    title: 'Sedang memproses data',
                    text: 'Mohon tunggu sebentar',
                    timer: 15000,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: async () => {
                        const response = await createMultiIjazah(formData)
                        if(response.success) {
                            Swal.fire({
                                title: 'Sukses',
                                icon: 'success',
                                text: 'Berhasil menambahkan data ijazah yang baru!'
                            }).then(() => {
                                router.push('/data/ijazah')
                            })
                        }
                    }
                })
            }
        })
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-3">
                <div className={`flex md:items-center md:justify-between w-full md:flex-row flex-col gap-3`}>
                    <div className="flex items-center gap-2 md:gap-5">
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                        </button>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faFileCirclePlus} className="w-4 h-4 text-blue-600" />
                            <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text">
                                Penambahan Data Ijazah
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <button type="button" onClick={() => router.push('/data/ijazah/new/import')} className="w-1/2 md:w-fit px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                            Import 
                        </button>
                        <button type="button" onClick={() => submitFormData()} className="w-1/2 rounded-full py-2 px-4 bg-green-500 hover:bg-green-600 focus:bg-green-700 text-white flex items-center justify-center gap-4">
                            <FontAwesomeIcon icon={faSave} className="w-5 h-5 text-inherit" />
                            Simpan
                        </button>
                    </div>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="flex md:flex-row flex-col gap-5">
                    <div className="w-full md:w-2/6">
                        <div className="relative w-full rounded border py-2 border-zinc-600 peer-has-[:placeholder-shown]:border-zinc-300">
                            <div className="absolute top-0 left-0 w-10 h-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                            </div>
                            <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-full bg-white pl-10  text-sm outline-none peer" placeholder="Cari Data Siswa di sini" />
                        </div>
                        <div className="py-2 relative w-full max-h-[190px] md:max-h-[500px] overflow-auto space-y-2">
                            {filteredSiswaList.slice(0, 30).map((siswa, index) => (
                                <button key={`${siswa.nis} - ${index}`} onClick={() => addFormData(siswa.nisn)} type="button" className={`w-full rounded-lg border p-2 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50/50 focus:border-blue-300 focus:bg-blue-50/50 group`}>
                                    <div className={`${mont.className} flex-grow text-start`}>
                                        <p className="text-sm font-medium tracking-tighter group-hover:text-blue-700 group-focus:text-blue-700">
                                            {siswa.nama_siswa}
                                        </p>
                                        <p className="text-xs tracking-tighter text-zinc-400">{siswa.kelas} - {siswa.nisn}</p>
                                    </div>
                                    <div className="space-y-2 flex flex-col items-end">
                                        {ijazahList.map((ijazah, index) => ijazah['nisn'] === siswa.nisn && ijazah['status'] === 'belum diambil' && (
                                            <p key={`${ijazah.no_ijazah} - ${index}`} className="text-xs w-fit px-2 py-1 rounded bg-blue-50 text-blue-700">
                                                Belum Diambil
                                            </p>
                                        ))}
                                        {ijazahList.map((ijazah, index) => ijazah['nisn'] === siswa.nisn && ijazah['status'] === 'sudah diambil' && (
                                            <p key={`${ijazah.no_ijazah} - ${index}`} className="text-xs w-fit px-2 py-1 rounded bg-amber-50 text-amber-700">
                                                Sudah Diambil
                                            </p>
                                        ))}
                                        {formData.map((form, index) => siswa['nisn'] === form['nisn'] && (
                                            <FontAwesomeIcon key={`form ${index}`} icon={faCircleCheck} className="w-3 h-3 text-blue-600" />
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-4/6  space-y-2 h-fit relative overflow-auto max-h-[500px] md:max-h-[800px]">
                        {formData.map((form, index) => (
                            <div key={`formData-${index}`} className="collapse collapse-arrow bg-zinc-50/50 hover:bg-zinc-50">
                                <input type="checkbox" /> 
                                <div className="collapse-title flex md:flex-row flex-col md:gap-5 md:items-center md:justify-start items-start font-medium">
                                    <p>
                                        {form.nama_lulusan}
                                    </p>
                                    <p className={`${mont.className} opacity-50 text-xs md:text-sm`}>{form.kelas} - {form.nisn}</p>
                                </div>
                            
                                <div className="collapse-content space-y-2"> 
                                    <div className="flex md:items-center md:flex-row flex-col gap-1">
                                        <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                            Tahun Lulus <span className="float-end hidden md:block">:</span>
                                        </div>
                                        <div className="w-full md:w-fit text-sm">
                                            {form['tahun_lulus']}
                                        </div>
                                    </div>
                                    <div className="flex md:items-center md:flex-row flex-col gap-1">
                                        <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                            No Ijazah <span className="float-end hidden md:block">:</span>
                                        </div>
                                        <input type="text" value={form['no_ijazah']} onChange={e => handleChangeFormData(form.nisn, e.target.value, 'no_ijazah')} className="bg-white w-full text-sm md:w-fit px-3 py-1 rounded border" placeholder="Masukkan No Ijazah" />
                                    </div>
                                    <div className="flex md:items-center md:flex-row flex-col gap-1">
                                        <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                            Status <span className="float-end hidden md:block">:</span>
                                        </div>
                                        <select value={form['status']} onChange={e => handleChangeFormData(form.nisn, e.target.value, 'status')} className="bg-white w-full text-sm md:w-fit px-3 py-1 rounded border cursor-pointer">
                                            <option value="" disabled>-- Pilih Status --</option>
                                            <option value="sudah diambil">Sudah di Ambil</option>
                                            <option value="belum diambil">Belum di Ambil</option>
                                        </select>
                                    </div>
                                    {form['status'] === 'sudah diambil' && (
                                        <div className="space-y-2">
                                            <div className="flex md:items-center md:flex-row flex-col gap-1">
                                                <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                                    Tanggal diambil <span className="float-end hidden md:block">:</span>
                                                </div>
                                                <input type="date" value={dateToIso(form['tgl_diambil'])} onChange={e => handleChangeFormData(form.nisn, isoToDate(e.target.value), 'tgl_diambil')} className="bg-white w-full text-sm md:w-fit px-3 py-1 rounded border" />
                                            </div>
                                            <div className="flex md:items-center md:flex-row flex-col gap-1">
                                                <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                                    Diambil Oleh <span className="float-end hidden md:block">:</span>
                                                </div>
                                                <input type="text" value={form['nama_pengambil']} onChange={e => handleChangeFormData(form.nisn, e.target.value, 'nama_pengambil')} className="bg-white w-full text-sm md:w-fit px-3 py-1 rounded border" placeholder="Masukkan Nama" />
                                            </div>
                                        </div>
                                    )}
                                    <button type="button" onClick={() => deleteFormData(form['nisn'])} className="flex items-center gap-3 px-3 py-1 rounded-lg bg-red-400 hover:bg-red-500 focus:bg-red-600 text-white text-sm">
                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                        Batalkan?
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}