'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, space } from "@/config/fonts"
import { createSinglePegawai } from "@/lib/model/pegawaiModel"
import { faAngleLeft, faArrowLeft, faDownload, faPlus, faSave, faUserPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const formatPegawai = {  nama_pegawai: "", jabatan: "", status_kepegawaian: "", nik: '', nip: "", nuptk: "", tmpt_lahir: "", tgl_lahir: "", tmt: "", pendidikan_terakhir: "", sekolah_pendidikan: "", sarjana_universitas: "", sarjana_fakultas: "", sarjana_prodi: "", magister_universitas: "", magister_fakultas: "", magister_prodi: "", keterangan: "", pensiun: "", sertifikat: [], pensiun: false };

const mySwal = withReactContent(Swal)
export default function DataPegawaiNewPage() {

    const router = useRouter()
    const [showCert, setShowCert] = useState('')

    const [formPegawai, setFormPegawai] = useState({...formatPegawai})

    const submitFormPegawai = async (e) => {
        e.preventDefault()

        console.log(formPegawai)


        mySwal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan menambahkan data pegawai',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    text: 'Mohon tunggu sebentar',
                    timer: 30000,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: async () => {
                        const response = await createSinglePegawai(formPegawai)
                        if(response.success) {
                            Swal.fire({
                                title: 'Sukses',
                                text: 'Berhasil menambahkan data pegawai tersebut!',
                                icon: 'success'
                            }).then(() => {
                                router.push('/data/pegawai')
                            })
                        }else{
                            Swal.fire({
                                title: 'Error',
                                text: 'Gagal menambahkan data pegawai tersebut!',
                                icon: 'error'
                            })
                        }
                    }
                })
            }
        })
    }

    const addSertifikat = (jenis_sertifikat) => {
        let formatSertifikat = {
            sertifikat_id: `${nanoid(8)}`,
            nama_sertifikat: '',
            jenis_sertifikat,
            fileUrl: ''
        }

        let updatedFormPegawai = {...formPegawai, sertifikat: [...formPegawai.sertifikat, formatSertifikat]}
        setFormPegawai(updatedFormPegawai)
    }

    const updateSertifikat = async (sertifikat_id, payload) => {
        // Find the index of the certificate in the array
        const sertifikatIndex = formPegawai.sertifikat.findIndex(sertifikat => sertifikat.sertifikat_id === sertifikat_id);
        console.log(payload)
    
        // If the certificate is found, update it
        if (sertifikatIndex !== -1) {
    
            // Update the certificate with the payload
            const updatedSertifikat = {
                ...formPegawai.sertifikat[sertifikatIndex],
                ...payload
            };
    
            // Create a new array with the updated certificate
            const updatedSertifikatArray = [...formPegawai.sertifikat];
            updatedSertifikatArray[sertifikatIndex] = updatedSertifikat;

            console.log(updatedSertifikatArray)
    
            // Update the state with the new array
            setFormPegawai({
                ...formPegawai,
                sertifikat: updatedSertifikatArray
            });
        }
    };

    const deleteSertifikat = (index) => {
        const updatedFormPegawai = {
            ...formPegawai,
            sertifikat: [
                ...formPegawai.sertifikat.slice(0, index),
                ...formPegawai.sertifikat.slice(index + 1)
            ]
        };

        // Set the state with the updated formPegawai object
        setFormPegawai(updatedFormPegawai);
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
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">NIK</p>
                                    <div className="w-full md:w-3/5">
                                        <input onChange={e => setFormPegawai(state => ({...state, nik: e.target.value}))} type="text" className={" bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="NIP" />
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

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Status Kepegawaian</p>
                                    <div className="flex items-end flex-col w-full md:w-3/5 gap-1">
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
                                </div>
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Tanggal Lahir</p>
                                    <input onChange={e => setFormPegawai(state => ({...state, tgl_lahir: e.target.value}))} type="date" className={`${mont.className} bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer md:w-3/5`} />
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Tempat Lahir</p>
                                    <div className="w-full md:w-3/5">
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, tmpt_lahir: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Tempat Lahir" />
                                    </div>
                                </div>
                            </div>
                            <hr className="my-3 opacity-0" />
                            <div className="flex items-center gap-2">
                                <h1 className=" rounded-full  text-zinc-600 w-fit text-xl md:text-3xl font-medium">
                                    Data Pendidikan
                                </h1>
                                <hr className="flex-grow" />
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Tahun Tamat</p>
                                    <div className="w-full md:w-3/5">
                                        <input type="text" onChange={e => setFormPegawai(state => ({...state, tmt: e.target.value}))} className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none" + mont.className} placeholder="Tahun Tamat" />
                                    </div>
                                </div>
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Pendidikan Terakhir</p>
                                    <select onChange={e => setFormPegawai(state => ({...state, pendidikan_terakhir: e.target.value}))} className={`${mont.className} bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none cursor-pointer md:w-3/5`}>
                                            <option value="" disabled>-- Pendidikan Terakhir --</option>
                                            <option value="SMP/SLTA/MTS">SMP/SLTA/MTS</option>
                                            <option value="SMA/MA/SMK/MK">SMA/MA/SMK/MK</option>
                                            <option value="D2">D2</option>
                                            <option value="D3">D3</option>
                                            <option value="D4">D4</option>
                                            <option value="S1">S1</option>
                                            <option value="S2">S2</option>
                                        </select>
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
                            <hr className="my-3 opacity-0" />
                        </div>
                        <div className="w-full md:w-1/2 md:pl-5">
                            <div className="flex items-center gap-2">
                                <h1 className=" rounded-full  text-zinc-600 w-fit text-xl md:text-3xl font-medium">
                                    Data Sertifikat
                                </h1>
                                <hr className="flex-grow" />
                            </div>
                            <hr className="my-2 opacity-0" />
                            <div className="flex flex-col md:flex-row gap-5 items-center">
                                <div className="w-full md:w-1/2 flex items-center gap-5">
                                    <button type="button" disabled={showCert === 'asesor'} onClick={() => setShowCert('asesor')} className={`w-1/2 py-2 rounded-full ${showCert !== 'asesor' ? 'bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 text-zinc-600 hover:text-zinc-700': 'bg-zinc-200 text-zinc-700'} flex justify-center items-center gap-2 md:text-2xl `}>
                                        Asesor
                                    </button>
                                    <button type="button" disabled={showCert === 'magang'} onClick={() => setShowCert('magang')} className={`w-1/2 py-2 rounded-full ${showCert !== 'magang' ? 'bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 text-zinc-600 hover:text-zinc-700': 'bg-zinc-200 text-zinc-700'} flex justify-center items-center gap-2 md:text-2xl `}>
                                        Magang
                                    </button>
                                </div>
                                <div className="w-full md:w-1/2 flex items-center gap-5">
                                    <button type="button" disabled={showCert === 'pendidik'} onClick={() => setShowCert('pendidik')} className={`w-1/2 py-2 rounded-full ${showCert !== 'pendidik' ? 'bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 text-zinc-600 hover:text-zinc-700': 'bg-zinc-200 text-zinc-700'} flex justify-center items-center gap-2 md:text-2xl `}>
                                        Pendidik
                                    </button>
                                    <button type="button" disabled={showCert === 'teknik'} onClick={() => setShowCert('teknik')} className={`w-1/2 py-2 rounded-full ${showCert !== 'teknik' ? 'bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 text-zinc-600 hover:text-zinc-700': 'bg-zinc-200 text-zinc-700'} flex justify-center items-center gap-2 md:text-2xl `}>
                                        Teknik
                                    </button>
                                </div>
                            </div>
                            <hr className="my-2 opacity-0" />
                            {showCert && (
                                <div className="space-y-2">
                                    {formPegawai['sertifikat'].map((sertifikat, index) => sertifikat.jenis_sertifikat === showCert && (
                                        <div key={`${index} - ${sertifikat.jenis_sertifikat}`} className="p-5 rounded-xl border space-y-2">
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="text-xs md:text-sm text-zinc-500 w-full md:w-2/5">
                                                    Nama Sertifikat
                                                </p>
                                                <input type="text" required value={sertifikat.nama_sertifikat}  onChange={e => updateSertifikat(sertifikat.sertifikat_id, {nama_sertifikat: e.target.value})}  className={"bg-white hover:outline-zinc-200 focus:outline-zinc-400 border px-2 py-1 rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="text-xs md:text-sm text-zinc-500 w-full md:w-2/5">
                                                    Link File Sertifikat
                                                </p>
                                                <input type="text" required onChange={e => updateSertifikat(sertifikat.sertifikat_id, {fileUrl: e.target.value})} className={"bg-white px-2 py-1 hover:outline-zinc-200 focus:outline-zinc-400 border  rounded w-full text-sm outline-none " + mont.className} placeholder="Isi Jika Ada" />
                                            </div>
                                            <div className="flex justify-end">
                                                <p className="opacity-60 text-xs">
                                                    File harus berupa <span className="opacity-100 font-medium">.pdf, .jpg</span>
                                                </p>
                                            </div>
                                            <button type="button" onClick={() => deleteSertifikat(index)} className="flex items-center gap-3 text-sm text-red-400 hover:text-red-500 focus:text-red-600">
                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                                Batalkan?
                                            </button> 
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addSertifikat(showCert)} className="flex items-center gap-3 text-sm text-blue-400 hover:text-blue-500 focus:text-blue-600">
                                        <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit" />
                                        Tambah Baru
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <hr className="my-3 opacity-0" />
                </div>
            </form>
        </MainLayoutPage>
    )
}