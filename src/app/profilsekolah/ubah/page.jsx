'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont } from "@/config/fonts"
import { getAllPegawai } from "@/lib/model/pegawaiModel"
import { getKepalaSekolah, getProfilSekolah, updateProfilSekolah } from "@/lib/model/profilSekolahModel"
import { faEdit } from "@fortawesome/free-regular-svg-icons"
import { faAngleLeft, faBookBookmark, faCheck, faDownload, faIdBadge, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

const formatDataArr = ['npsn', 'status', 'bentuk_pendidikan', 'status_kepemilikan', 'sk_pendirian_sekolah', 'tanggal_sk_pendirian', 'sk_izin_operasional', 'tanggal_sk_izin_operasional', 'operator', 'akreditasi', 'kurikulum', 'waktu']
const formatData = {
    'npsn': 'NPSN',
    'status': 'Status',
    'bentuk_pendidikan': 'Bentuk Pendidikan',
    'status_kepemilikan': 'Status Kepemilikan',
    'sk_pendirian_sekolah': 'SK Pendirian Sekolah',
    'tanggal_sk_pendirian': 'Tanggal SK Pendirian',
    'sk_izin_operasional': 'SK Izin Operasional',
    'tanggal_sk_izin_operasional': 'Tanggal SK Izin Operasional',
    'operator': 'Operator',
    'akreditasi': 'Akreditasi',
    'kurikulum': 'Kurikulum',
    'waktu': 'Waktu'
}

export default function ProfilSekolahPage() {
    const router = useRouter()
    const [data, setData] = useState({})
    const [newData, setNewData] = useState({})
    const [dataPegawai, setDataPegawai] = useState([])
    const [filteredDataPegawai, setFilteredDataPegawai] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const getData = async () => {
        const result = await getProfilSekolah()
        if(result.success) {
            let updatedData;
            const kepsek = await getKepalaSekolah()
            if(kepsek.success) {
                updatedData = { ['kepala_sekolah']: kepsek.data.nama_pegawai, ['id_kepala_sekolah']: kepsek.data.id_pegawai, ...result.data}
            }else{
                updatedData = { ['kepala_sekolah']: 'Tidak Ada', ['id_kepala_sekolah']: '0', ...result.data}
            }
            setData(updatedData)
            setNewData(updatedData)
        }

        const resultPegawai = await getAllPegawai()
        setDataPegawai(resultPegawai.data)
        setFilteredDataPegawai(resultPegawai.data)
    }

    useEffect(() => {
        getData()
    }, [])

    const handleFilter = () => {
        let updatedData = dataPegawai.filter(pegawai => 
            pegawai['nama_pegawai'].toLowerCase().includes(searchValue.toLowerCase()) ||
            pegawai['nik'].toLowerCase().includes(searchValue.toLowerCase()) ||
            pegawai['jabatan'].toLowerCase().includes(searchValue.toLowerCase()) ||
            pegawai['nip'].toLowerCase().includes(searchValue.toLowerCase())
        )

        setFilteredDataPegawai(updatedData)
    }

    useEffect(() => {
        handleFilter()
    }, [searchValue])

    const handleChangeKepsek = (id_pegawai) => {
        if(id_pegawai === newData['id_kepala_sekolah']) {
            return;
        }

        const selectedPegawai = dataPegawai.find((pegawai) => pegawai.id_pegawai === id_pegawai)

        let updatedData = {...newData, id_kepala_sekolah: selectedPegawai.id_pegawai, kepala_sekolah: selectedPegawai.nama_pegawai}
        setNewData(updatedData)
    }

    const handleSubmit = async () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan mengubah data Profil Sekolah',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    text: 'Silahkan tunggu sebentar',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        const response = await updateProfilSekolah(data, newData)
                        if(response.success) {
                            return Swal.fire({
                                title: 'Sukses',
                                icon: 'success',
                                text: 'Berhasil mengubah data profil sekolah!',
                                didOpen: async () => {
                                    await getData()
                                }
                            })
                        }else{
                            return Swal.fire({
                                title: 'Error',
                                icon: 'error',
                                text: 'Gagal mengubah profil sekolah, silahkan Cek Logs atau Hubungi Administrator'
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
                <div className="flex items-center w-full gap-5 md:w-1/2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 focus:bg-zinc-200 text-zinc-700 flex items-center justify-center md:w-fit gap-3 w-1/2 md:text-xl">
                        <FontAwesomeIcon icon={faAngleLeft} className="w-4 h-4 text-zinc-600" />
                        Kembali
                    </button>
                    <button type="button" onClick={() => handleSubmit()} className="px-4 py-2 rounded-full bg-green-50 hover:bg-green-100 focus:bg-green-200 text-green-700 flex items-center justify-center md:w-fit gap-3 w-1/2 md:text-xl">
                        <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-600" />
                        Simpan
                    </button>
                </div>
                <hr className="my-3 opacity-0" />
                <div className="relative overflow-hidden w-full rounded-lg border pb-6">
                    <div className="w-full p-5 bg-gradient-to-r from-blue-500 to-cyan-500">
                        <h1 className="text-white font-medium text-xl md:text-3xl flex items-center gap-5">
                            <FontAwesomeIcon icon={faBookBookmark} className="w-5 h-5 text-inherit" />
                            Ubah Data Identitas Sekolah
                        </h1>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className="flex md:flex-row flex-col gap-5 px-3 md:px-8">
                        <div className={`${mont.className} w-full md:w-1/2 bg-white  space-y-6`}>
                            <div className="flex gap-1 md:gap-3 text-xs md:text-sm flex-col md:flex-row w-full">
                                <p className="w-full md:w-2/6 opacity-60 md:pt-2">Kepala Sekolah <span className="float-end hidden md:inline">:</span></p>
                                <div className="w-full md:w-4/6">
                                    <input type="text" readOnly required className="w-full px-3 rounded bg-white py-2 border" placeholder="Masukkan nama di sini" defaultValue={newData['kepala_sekolah']} />
                                    <hr className="my-1 opacity-0" />
                                    <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-full px-2 rounded bg-white py-2 border md:hidden" placeholder="Cari di sini" />
                                    <hr className="my-1 opacity-0" />
                                    <div className="grid grid-cols-6 px-2 py-1 border-y border-blue-200 bg-blue-50/50">
                                        <div className="col-span-6 md:col-span-4 text-blue-700 flex items-center">
                                            Nama
                                        </div>
                                        <div className="hidden md:flex md:col-span-2">
                                            <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="bg-white rounded w-full px-2 py-1 border" placeholder="Cari di sini" />
                                        </div>
                                    </div>
                                    <div className="py-2 space-y-1 relative overflow-auto max-h-60">
                                        {filteredDataPegawai.map((pegawai, index) => (
                                            <div key={`${pegawai.id_pegawai} - ${index}`} className="flex px-3 py-1 rounded border bg-white items-center hover:border-blue-300 has-[:checked]:bg-blue-50/50 has-[:checked]:text-blue-700 has-[:checked]:border-blue-300">
                                                <div className="flex-grow">
                                                    <p className="text-xs font-medium ">
                                                        {pegawai.nama_pegawai}
                                                    </p>
                                                    <p className="text-xs opacity-30">
                                                        {pegawai.nik}
                                                    </p>
                                                    <p className="text-xs opacity-30">
                                                        {pegawai.status_kepegawaian}
                                                    </p>
                                                </div>
                                                <input type="radio" name="select_pegawai" onChange={() => handleChangeKepsek(pegawai.id_pegawai)} className="cursor-pointer" defaultChecked={data.id_kepala_sekolah === pegawai.id_pegawai}  />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end items-center mt-2">
                                        <button type="button" onClick={() => router.push('/data/pegawai/new')} className="flex items-center gap-2 text-blue-400 hover:text-blue-500 focus:text-blue-600 text-sm">
                                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit" />
                                            Tambah Pegawai Baru
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {formatDataArr.slice(0, formatDataArr.length / 2).map((format, index) => (
                                <div key={`${format} - ${index}`} className="flex gap-1 md:gap-3 text-xs md:text-sm flex-col md:flex-row">
                                    <p className="w-full md:w-2/6 opacity-60 md:mt-2">{formatData[format]} <span className="float-end hidden md:inline">:</span></p>
                                    <div className="w-full md:w-4/6">
                                        <input type="text" required className="w-full px-3 rounded bg-white py-2 border" placeholder={`Masukkan ${formatData[format]} di sini`} value={newData[format]} onChange={e => setNewData(state => ({...state, [format]: e.target.value}))} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={`${mont.className} w-full md:w-1/2 bg-white  space-y-6`}>
                            {formatDataArr.slice(formatDataArr.length / 2, formatDataArr.length).map((format, index) => (
                                <div key={`${format} - ${index}`} className="flex gap-1 md:gap-3 text-xs md:text-sm flex-col md:flex-row">
                                    <p className="w-full md:w-2/6 opacity-60 md:mt-2">{formatData[format]} <span className="float-end hidden md:inline">:</span></p>
                                    <div className="w-full md:w-4/6">
                                        <input type="text" required className="w-full px-3 rounded bg-white py-2 border" placeholder={`Masukkan ${formatData[format]} di sini`} value={newData[format]} onChange={e => setNewData(state => ({...state, [format]: e.target.value}))} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}