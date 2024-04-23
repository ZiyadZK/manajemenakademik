'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, space } from "@/config/fonts"
import { getSiswaByNIS } from "@/lib/model/siswaModel"
import { faArrowLeft, faCheckCircle, faDownload, faEdit, faPrint, faTrash, faUserCheck, faUserTag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const formatDataPribadi = ['kelas', 'nama_siswa', 'nis', 'nisn', 'nik', 'no_kk', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'status_dalam_keluarga', 'anak_ke', 'alamat', 'no_hp_siswa', 'asal_sekolah', 'kategori', 'tahun_masuk', 'aktif']
const formatDataKeluarga = ['nama_ayah', 'nama_ibu', 'telp_ortu', 'pekerjaan_ayah', 'pekerjaan_ibu']
const formattedData = {
    'kelas': 'Kelas',
    'nama_siswa': 'Nama Siswa',
    'nis': 'NIS',
    'nisn': 'NISN',
    'nik': 'No Induk Keluarga',
    'no_kk': 'No Kartu Keluarga',
    'tempat_lahir': 'Tempat Lahir',
    'tanggal_lahir': 'Tanggal Lahir',
    'jenis_kelamin': 'Jenis Kelamin',
    'agama': 'Agama',
    'status_dalam_keluarga': 'Status Dalam Keluarga',
    'anak_ke': 'Anak Ke',
    'alamat': 'Alamat',
    'no_hp_siswa': 'No Hp Siswa',
    'asal_sekolah': 'Asal Sekolah',
    'kategori': 'Kategori',
    'tahun_masuk': 'Tahun Masuk',
    'aktif': 'Aktif',
    'nama_ayah': 'Nama Ayah',
    'nama_ibu': 'Nama Ibu',
    'telp_ortu': 'No. Telp Orang tua',
    'pekerjaan_ayah': 'Pekerjaan Ayah',
    'pekerjaan_ibu': 'Pekerjaan Ibu'
};
export default function DataSiswaNISPage({params}) {
    const router = useRouter();
    const [dataSiswa, setDataSiswa] = useState()
    const [dataExist, setDataExist] = useState()
    const [loadingState, setLoadingState] = useState('')
    const getSiswa = async (nis) => {
        setLoadingState('loading')
        const result = await getSiswaByNIS(nis)
        if(result.exist) {
            setLoadingState(state => state = 'data exist')
            setDataExist(true)
            setDataSiswa(result.data)
        }else{
            setLoadingState(state => state = 'data not exist')
            setDataExist(false)
        }
    }

    useEffect(() => {
        getSiswa(params.nis)
    }, [])

    return (
        <MainLayoutPage>
            <hr className="my-1 md:my-2 opacity-0" />
            <div className={`${mont.className}`}>
                {loadingState === '' && <Skeleton/>}
                {loadingState === 'data exist' && (
                    <div className="">
                        <div className="flex md:justify-between md:items-center md:flex-row flex-col gap-5">
                            <div className="flex items-center gap-5 md:gap-5">
                                <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUserTag} className="w-4 h-4 text-blue-600" />
                                    <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text">
                                        Informasi Siswa
                                    </h1>
                                </div>
                            </div>
                            <div className={`w-full md:w-1/4 md:flex-row flex-col flex items-center gap-5 ${mont.className}`}>
                                
                                <div className="flex items-center gap-0.5 md:gap-5 w-full md:w-fit">
                                    <button type="button" className="px-4 py-2 w-full md:w-fit flex items-center justify-center gap-3 text-zinc-700 bg-zinc-100 rounded-full hover:bg-zinc-200" >
                                        <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit" />
                                        Export
                                    </button>
                                    <button type="button" className="px-4 py-2 w-full md:w-fit flex items-center justify-center gap-3 text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200" >
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                        Ubah
                                    </button>
                                    <button type="button" className="px-4 py-2 w-full md:w-fit flex items-center justify-center gap-3 text-red-700 bg-red-100 rounded-full hover:bg-red-200" >
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                        <hr className="my-2 opacity-0" />
                        <h1 className="font-medium text-2xl md:text-6xl">
                            {dataSiswa.nama_siswa}
                        </h1>
                        <hr className="my-3 w-full" />
                        <div className="flex gap-5 md:flex-row flex-col md:p-5">
                            <div className="w-full md:w-1/2 space-y-3">
                                {formatDataPribadi.map((format, index) => (
                                    <div key={`${format}-${index}`} className="flex md:flex-row flex-col  w-full md:gap-5">
                                        <div className="flex justify-between w-full md:w-1/4">
                                            <h1 className="flex-grow text-zinc-500 text-xs md:text-lg">
                                                {formattedData[format]}
                                            </h1>
                                            <div className="hidden md:block">:</div>
                                        </div>
                                        <p className="w-full md:w-3/4 font-medium">
                                            {dataSiswa[format]}
                                        </p>
                                    </div>
                                ))}
                                
                            </div>
                            <div className="w-full md:w-1/2 space-y-3">
                                {formatDataKeluarga.map((format, index) => (
                                    <div key={`${format}-${index}`} className="flex md:flex-row flex-col  w-full md:gap-5">
                                        <div className="flex justify-between w-full md:w-1/4">
                                            <h1 className="flex-grow text-zinc-500 text-xs md:text-lg">
                                                {formattedData[format]}
                                            </h1>
                                            <div className="hidden md:block">:</div>
                                        </div>
                                        <p className="w-full md:w-3/4 font-medium">
                                            {dataSiswa[format]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                        
                )}
            </div>
            <hr className="my-3 opacity-0" />
        </MainLayoutPage>
    )
}

function DataNotExist({nis}) {
    return (
        <div className="flex w-full h-screen justify-center items-center">
            Data siswa dengan nis <b>{nis}</b> tidak ditemukan!
        </div>
    )
}



function Skeleton() {
    return (
        <div className="p-5">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-5">
                    <div className="w-8 h-8 rounded bg-zinc-300 animate-pulse"></div>
                    <div className="w-60 h-8 rounded bg-zinc-300 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="w-8 h-8 rounded bg-zinc-300 animate-pulse"></div>
                    <div className="w-8 h-8 rounded bg-zinc-300 animate-pulse"></div>
                    <div className="w-8 h-8 rounded bg-zinc-300 animate-pulse"></div>
                </div>
            </div>
            <div className="my-5">
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-60 h-4 rounded bg-zinc-300 animate-pulse"></div>
                    /
                    <div className="w-60 h-4 rounded bg-zinc-300 animate-pulse"></div>
                </div>
                <div className="w-[700px] h-16 rounded bg-zinc-300 animate-pulse my-3"></div>
                <div className="w-60 h-6 rounded bg-zinc-300 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-dashed">
                <div className="pr-5">
                    <div className="w-full h-screen bg-zinc-300 animate-pulse rounded"></div>
                </div>
                <div className="pl-5">
                    <div className="w-full h-screen bg-zinc-300 animate-pulse rounded"></div>
                </div>
            </div>
        </div>
    )
}

