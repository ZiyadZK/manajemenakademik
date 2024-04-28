'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, space } from "@/config/fonts"
import { faAngleLeft, faArrowLeft, faDownload, faPlus, faSave, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const formatPegawai = { id_pegawai: "", nama_pegawai: "", jabatan: "", status_kepegawaian: "", nip: "", nuptk: "", tmpt_lahir: "", tgl_lahir: "", tmt: "", pendidikan_terakhir: "", sekolah_pendidikan: "", sarjana_universitas: "", sarjana_fakultas: "", sarjana_prodi: "", magister_universitas: "", magister_fakultas: "", magister_prodi: "", sertifikat_pendidik: "", sertifikat_teknik: "", sertifikat_magang: "", sertifikat_asesor: "", keterangan: "", pensiun: "" };

const mySwal = withReactContent(Swal)
export default function DataPegawaiNewPage() {

    const router = useRouter()

    const [formPegawai, setFormPegawai] = useState({...formatPegawai})

    const submitFormPegawai = async () => {
        mySwal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan menambahkan data pegawai',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        })
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <form onSubmit={submitFormPegawai} className="mt-3">
                <div className={`flex md:items-center md:justify-between w-full md:flex-row flex-col gap-3`}>
                    <div className="flex items-center gap-2 md:gap-5">
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                        </button>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 text-blue-600" />
                            <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text">
                                Penambahan Data Pegawai
                            </h1>
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col md:items-center gap-5">
                        <button type="button" onClick={() => router.push('/data/pegawai/new/import')} className="px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                            Import Data
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                            Simpan Data
                        </button>
                    </div>
                </div>
                <div className="mt-4 ">
                    <div className="flex md:flex-row flex-col md:divide-x md:divide-dashed">
                        <div className="w-full md:w-1/2 md:pr-5">
                            <div className="flex items-center gap-2">
                                <h1 className=" rounded-full  text-zinc-600 w-fit text-xl md:text-3xl font-medium">
                                    Data Pribadi
                                </h1>
                                <hr className="flex-grow" />
                            </div>
                            <hr className="my-2 opacity-0" />
                            <div className="space-y-3 mt-2">
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Nama</p>
                                    <input required type="text" onChange={e => setFormPegawai(state => ({...state, nama_pegawai: e.target.value}))} className={" bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full md:w-3/5 text-sm outline-none " + mont.className} placeholder="Nama Panjang " />
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Jabatan</p>
                                    <div className="w-full md:w-3/5 space-y-2 md:space-y-1">
                                        <select onChange={e => setFormPegawai(state => ({...state, jabatan: e.target.value}))} className={`${mont.className} border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer bg-white hover:outline-zinc-200 focus:outline-zinc-400`}>
                                            <option value="" disabled>-- Pilih Jabatan --</option>
                                            <option value="Kepala Sekolah">Kepala Sekolah</option>
                                            <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                                            <option value="Guru">Guru</option>
                                            <option value="Karyawan">Karyawan</option>
                                        </select>
                                        <div className="flex md:justify-end justify-start items-center">
                                            <Link href={'/data/konfigurasi/jabatan'} className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-600" >
                                                <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit" />
                                                Buat Baru
                                            </Link>   
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">NIP</p>
                                    <div className="w-full md:w-3/5">
                                        <input onChange={e => setFormPegawai(state => ({...state, nip: e.target.value}))} type="text" className={" bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="NIP" />
                                    </div>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">NUPTK</p>
                                    <div className="w-full md:w-3/5">
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, nuptk: e.target.value}))} className={" bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="NUPTK" />
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="space-y-1 md:space-y-2 w-1/2">
                                        <p className="text-xs md:text-md font-medium text-zinc-400">Status Kepegawaian</p>
                                        <select onChange={e => setFormPegawai(state => ({...state, status_kepegawaian: e.target.value}))} className={`bg-white hover:outline-zinc-200 focus:outline-zinc-400 ${mont.className} border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer`}>
                                            <option value="" disabled>-- Pilih Status Kepegawaian --</option>
                                            <option value="PNS">PNS</option>
                                            <option value="PPPK">PPPK</option>
                                            <option value="HONDA">HONDA</option>
                                            <option value="HONKOM">HONKOM</option>
                                        </select>
                                        <div className="flex md:justify-end justify-start items-center">
                                            <Link href={'/data/konfigurasi/jabatan'} className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-600" >
                                                <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit" />
                                                Buat Baru
                                            </Link>   
                                        </div>
                                    </div>
                                    <div className="space-y-1 md:space-y-2 w-1/2">
                                        <p className="text-xs md:text-md font-medium text-zinc-400">Tanggal Lahir</p>
                                        <input onChange={e => setFormPegawai(state => ({...state, tgl_lahir: e.target.value}))} type="date" className={`${mont.className} bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer`} />
                                    </div>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Tempat Lahir</p>
                                    <div className="w-full md:w-3/5">
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, tmpt_lahir: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Tempat Lahir" />
                                    </div>
                                </div>

                                <hr className="my-2 opacity-0" />
                                <div className="flex items-center gap-2">
                                    <h1 className=" rounded-full  text-zinc-600 w-fit text-xl md:text-3xl font-medium">
                                        Data Sertifikat
                                    </h1>
                                    <hr className="flex-grow" />
                                </div>
                                <div tabIndex={0} className="collapse collapse-arrow bg-white border">
                                    <input type="checkbox" /> 
                                    <div className="collapse-title font-medium">
                                        <h1 className="flex-shrink-0 flex-grow-0">Pendidik</h1>
                                    </div>
                                    <div className="collapse-content"> 
                                        <p className="text-xs">Silahkan Upload File Sertifikat di bawah ini, file yang harus di upload berupa PDF</p>
                                        <input type="file" name="" id="" className="my-1 text-xs md:text-sm w-full" />
                                        <div className="">
                                            <input type="text" name="" id="" className="px-2 py-1 rounded border bg-white text-xs md:text-sm w-5/6" placeholder="Masukkan Nama Sertifikat Tersebut" />
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-2 opacity-0" />
                                <div tabIndex={0} className="collapse collapse-arrow bg-white border">
                                    <input type="checkbox" /> 
                                    <div className="collapse-title font-medium">
                                        <h1 className="flex-shrink-0 flex-grow-0">Teknik</h1>
                                    </div>
                                    <div className="collapse-content"> 
                                        <p className="text-xs">Silahkan Upload File Sertifikat di bawah ini, file yang harus di upload berupa PDF</p>
                                        <input type="file" name="" id="" className="my-1 text-xs md:text-sm w-full" />
                                        <div className="">
                                            <input type="text" name="" id="" className="px-2 py-1 rounded border bg-white text-xs md:text-sm w-5/6" placeholder="Masukkan Nama Sertifikat Tersebut" />
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-2 opacity-0" />
                                <div tabIndex={0} className="collapse collapse-arrow bg-white border">
                                    <input type="checkbox" /> 
                                    <div className="collapse-title font-medium ">
                                        <h1 className="flex-shrink-0 flex-grow-0">Magang</h1>
                                    </div>
                                    <div className="collapse-content"> 
                                        <p className="text-xs">Silahkan Upload File Sertifikat di bawah ini, file yang harus di upload berupa PDF</p>
                                        <input type="file" name="" id="" className="my-1 text-xs md:text-sm w-full" />
                                        <div className="">
                                            <input type="text" name="" id="" className="px-2 py-1 rounded border bg-white text-xs md:text-sm w-5/6" placeholder="Masukkan Nama Sertifikat Tersebut" />
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-2 opacity-0" />
                                <div tabIndex={0} className="collapse collapse-arrow bg-white border">
                                    <input type="checkbox" /> 
                                    <div className="collapse-title font-medium">
                                        <h1 className="">Asesor</h1>
                                    </div>
                                    <div className="collapse-content"> 
                                        <p className="text-xs">Silahkan Upload File Sertifikat di bawah ini, file yang harus di upload berupa PDF</p>
                                        <input type="file" name="" id="" className="my-1 text-xs md:text-sm w-full" />
                                        <div className="">
                                            <input type="text" name="" id="" className="px-2 py-1 rounded border bg-white text-xs md:text-sm w-5/6" placeholder="Masukkan Nama Sertifikat Tersebut" />
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-2 opacity-0" />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 md:pl-5">
                            <div className="flex items-center gap-2">
                                <h1 className=" rounded-full  text-zinc-600 w-fit text-xl md:text-3xl font-medium">
                                    Data Pendidikan
                                </h1>
                                <hr className="flex-grow" />
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Tahun Tamat</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, tmt: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Tahun Tamat" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Status Kepegawaian</p>
                                        <select onChange={e => setFormPegawai(state => ({...state, pendidikan_terakhir: e.target.value}))} className={`${mont.className} bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer`}>
                                            <option value="" disabled>-- Pilih Status Kepegawaian --</option>
                                            <option value="SMP/SLTA/MTS">SMP/SLTA/MTS</option>
                                            <option value="SMA/MA/SMK/MK">SMA/MA/SMK/MK</option>
                                            <option value="D2">D2</option>
                                            <option value="D3">D3</option>
                                            <option value="D4">D4</option>
                                            <option value="S1">S1</option>
                                            <option value="S2">S2</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <h1 className="font-bold text-sm text-zinc-500">
                                        Sekolah
                                    </h1>
                                    <hr className="grow" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">Nama Sekolah Pendidikan</p>
                                    <input type="text" onChange={e => setFormPegawai(state => ({...state, sekolah_pendidikan: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                </div>
                                <div className="flex items-center gap-5">
                                    <h1 className="font-bold text-sm text-zinc-500">
                                        Sarjana
                                    </h1>
                                    <hr className="grow" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">Nama Universitas</p>
                                    <input type="text" onChange={e => setFormPegawai(state => ({...state, sarjana_universitas: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Fakultas</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, sarjana_fakultas: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Program Studi</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, sarjana_prodi: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <h1 className="font-bold text-sm text-zinc-500">
                                        Magister
                                    </h1>
                                    <hr className="grow" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">Nama Universitas</p>
                                    <input type="text" onChange={e => setFormPegawai(state => ({...state, magister_universitas: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Fakultas</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, magister_fakultas: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Program Studi</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, magister_prodi: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayoutPage>
    )
}