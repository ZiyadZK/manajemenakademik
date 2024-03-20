'use client'

import MainLayoutPage from "@/components/mainLayout"
import { space } from "@/config/fonts"
import { faAngleLeft, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
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
            <div className="p-5">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => router.back()} className="w-6 h-6 rounded border flex items-center justify-center border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white focus:scale-95 transition-all duration-300">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit " />
                        </button>
                        <h1 className="text-sm font-bold rounded-full px-2 py-1 bg-zinc-800 text-white">
                            Buat Data Pegawai Baru
                        </h1>
                    </div>
                    <button type="button" onClick={() => submitFormPegawai()} className="flex items-center gap-3 justify-center rounded bg-green-400 hover:bg-green-500 focus:bg-green-500 button text-white p-2 font-bold text-xs transition-all duration-300">
                        <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                        Simpan Data
                    </button>
                </div>
                <div className="mt-4 ">
                    <div className="grid grid-cols-2 divide-x divide-dashed">
                        <div className="w-full pr-2">
                            <h1 className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded-full text-white w-fit">
                                Data Pribadi
                            </h1>
                            <div className="space-y-2 mt-2">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Nama</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, nama_pegawai: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Nama Panjang " />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Jabatan</p>
                                        <select onChange={e => setFormPegawai(state => ({...state, jabatan: e.target.value}))} className={`${space.className} border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer`}>
                                            <option value="" disabled>-- Pilih Jabatan --</option>
                                            <option value="Kepala Sekolah">Kepala Sekolah</option>
                                            <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">NIP</p>
                                        <input onChange={e => setFormPegawai(state => ({...state, nip: e.target.value}))} type="text" className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="NIP" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">NUPTK</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, nuptk: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="NUPTK" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Status Kepegawaian</p>
                                        <select onChange={e => setFormPegawai(state => ({...state, status_kepegawaian: e.target.value}))} className={`${space.className} border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer`}>
                                            <option value="" disabled>-- Pilih Status Kepegawaian --</option>
                                            <option value="PNS">PNS</option>
                                            <option value="PPPK">PPPK</option>
                                            <option value="HONDA">HONDA</option>
                                            <option value="HONKOM">HONKOM</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Tanggal Lahir</p>
                                        <input onChange={e => setFormPegawai(state => ({...state, tgl_lahir: e.target.value}))} type="date" className={`${space.className} border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer`} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">Tempat Lahir</p>
                                    <input type="text" onChange={e => setFormPegawai(state => ({...state, tmpt_lahir: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Tempat Lahir" />
                                </div>
                                <h1 className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded-full text-white w-fit">
                                    Data Sertifikat
                                </h1>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Pendidik</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, sertifikat_pendidik: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Sertifikat Pendidik" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Magang</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, sertifikat_magang: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Sertifikat Magang" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Teknik</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, sertifikat_teknik: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Sertifikat Teknik" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Asesor</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, sertifikat_asesor: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Sertifikat Asesor" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">Keterangan</p>
                                    <input type="text" onChange={e => setFormPegawai(state => ({...state, keterangan: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Keterangan" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full pl-2">
                            <h1 className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded-full text-white w-fit">
                                Data Pendidikan Terakhir
                            </h1>
                            <div className="space-y-2 mt-2">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Tahun Tamat</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, tmt: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Tahun Tamat" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Status Kepegawaian</p>
                                        <select onChange={e => setFormPegawai(state => ({...state, pendidikan_terakhir: e.target.value}))} className={`${space.className} border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer`}>
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
                                    <input type="text" onChange={e => setFormPegawai(state => ({...state, sekolah_pendidikan: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Isi Jika Ada" />
                                </div>
                                <div className="flex items-center gap-5">
                                    <h1 className="font-bold text-sm text-zinc-500">
                                        Sarjana
                                    </h1>
                                    <hr className="grow" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">Nama Universitas</p>
                                    <input type="text" onChange={e => setFormPegawai(state => ({...state, sarjana_universitas: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Isi Jika Ada" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Fakultas</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, sarjana_fakultas: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Isi Jika Ada" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Program Studi</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, sarjana_prodi: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Isi Jika Ada" />
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
                                    <input type="text" onChange={e => setFormPegawai(state => ({...state, magister_universitas: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Isi Jika Ada" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Fakultas</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, magister_fakultas: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Isi Jika Ada" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Program Studi</p>
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, magister_prodi: e.target.value}))} className={"border px-2 py-1 rounded w-full text-sm outline-none " + space.className} placeholder="Isi Jika Ada" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}