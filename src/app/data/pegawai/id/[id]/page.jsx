'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, rale } from "@/config/fonts"
import { getSinglePegawai } from "@/lib/model/pegawaiModel"
import { getDataSertifikat } from "@/lib/model/sertifikatModel"
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { faArrowLeft, faCheckCircle, faDownload, faExclamationCircle, faTrash, faUserTag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

const formatDataPribadi = ['nama_pegawai', 'jabatan', 'status_kepegawaian', 'nip', 'nik', 'nuptk', 'tmpt_lahir', 'tgl_lahir', 'pensiun']
const formatDataPendidikan = ['tmt', 'pendidikan_terakhir', 'sekolah_pendidikan', 'sarjana_universitas', 'sarjana_fakultas', 'sarjana_prodi', 'magister_universitas', 'magister_fakultas', 'magister_prodi']
const formatDataSertifikat = ['sertifikat_pendidik', 'sertifikat_teknik', 'sertifikat_magang', 'sertifikat_asesor']

const formattedData = {
    'nama_pegawai': 'Nama',
    'jabatan': 'Jabatan',
    'status_kepegawaian': 'Status Kepegawaian',
    'nip': 'NIP',
    'nik': 'NIK',
    'nuptk': 'NUPTK',
    'tmpt_lahir': 'Tempat Lahir',
    'tgl_lahir': 'Tanggal Lahir',
    'pensiun': 'Sudah Pensiun'
}

export default function PegawaiIDPage({params}) {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [dataSertifikat, setDataSertifikat] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')
    const [showCert, setShowCert] = useState('asesor')

    const getPegawai = async (id) => {
        setLoadingFetch('loading')
        const result = await getSinglePegawai({id_pegawai: id})
        const sertif_result = await getSertifikat(id)
        setDataSertifikat(sertif_result.data)
        setData(result.data)
        setLoadingFetch('fetched')
    }

    const getSertifikat = async (id) => {
        return await getDataSertifikat(id)
    }

    useEffect(() => {
        getPegawai(Number(params.id))
    }, [])

    return (
        <MainLayoutPage>
            <Toaster />
            {loadingFetch !== 'fetched' ? (
                <div className="w-full h-screen flex items-center justify-center gap-5 text-blue-600">
                    <span className="loading loading-spinner loading-md "></span>
                    Sedang mendapatkan data
                </div>
            ) : (
                <div className="mt-3">
                    <div className="flex md:justify-between md:items-center md:flex-row flex-col gap-5 w-full">
                        <div className="flex items-center gap-5 md:gap-5">
                            <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                            </button>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUserTag} className="w-4 h-4 text-blue-600" />
                                <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text">
                                    Informasi Pegawai
                                </h1>
                            </div>
                        </div>
                        <div className={`w-full md:w-1/4 md:flex-row flex-col flex items-center gap-5 ${mont.className}`}>
                            
                            <div className="flex items-center gap-0.5 md:gap-5 w-full md:w-fit">
                                <button type="button" className="px-4 py-2 w-full md:w-fit flex items-center justify-center gap-3 text-zinc-700 bg-zinc-100 rounded-full hover:bg-zinc-200" >
                                    <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit" />
                                    Export
                                </button>
                                <button type="button" onClick={() => router.push(`/data/pegawai/update/${data.id_pegawai}`)} className="px-4 py-2 w-full md:w-fit flex items-center justify-center gap-3 text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200" >
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
                    <hr className="my-3 opacity-0" />
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
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.nama_pegawai || '-'}
                                    </p>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Jabatan</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.jabatan || '-'}
                                    </p>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">NIK</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.nik || '-'}
                                    </p>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">NIP</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.nip || '-'}
                                    </p>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">NUPTK</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.nuptk || '-'}
                                    </p>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Status Kepegawaian</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.status_kepegawaian || '-'}
                                    </p>
                                </div>
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Tanggal Lahir</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.tanggal_lahir || '-'}
                                    </p>
                                </div>

                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Tempat Lahir</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.tempat_lahir || '-'}
                                    </p>
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
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.tmt || '-'}
                                    </p>
                                </div>
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Pendidikan Terakhir</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.pendidikan_terakhir || '-'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-5">
                                    <h1 className="font-bold text-sm text-zinc-500">
                                        Sekolah
                                    </h1>
                                    <hr className="grow" />
                                </div>
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Nama Sekolah Pendidikan</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.sekolah_pendidikan || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-5">
                                    <h1 className="font-bold text-sm text-zinc-500">
                                        Sarjana
                                    </h1>
                                    <hr className="grow" />
                                </div>
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Universitas</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.sarjana_universitas || '-'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                        <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Fakultas</p>
                                        <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                            {data.sarjana_fakultas || '-'}
                                        </p>
                                    </div>
                                    <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                        <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Program Studi</p>
                                        <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                            {data.sarjana_prodi || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <h1 className="font-bold text-sm text-zinc-500">
                                        Magister
                                    </h1>
                                    <hr className="grow" />
                                </div>
                                <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                    <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Universitas</p>
                                    <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                        {data.magister_universitas || '-'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                        <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Fakultas</p>
                                        <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                            {data.magister_fakultas || '-'}
                                        </p>
                                    </div>
                                    <div className="flex md:flex-row flex-col gap-1 md:gap-0 md:items-center">
                                        <p className="text-xs md:text-md font-medium text-zinc-400 w-full md:w-2/5">Program Studi</p>
                                        <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                            {data.magister_prodi || '-'}
                                        </p>
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
                                    {dataSertifikat.map((sertifikat, index) => sertifikat.jenis_sertifikat === showCert && (
                                        <div key={`${index} - ${sertifikat.jenis_sertifikat}`} className="p-5 rounded-xl border space-y-2">
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="text-xs md:text-sm text-zinc-500 w-full md:w-2/5">
                                                    Nama Sertifikat
                                                </p>
                                                <p className="text-sm font-medium text-zinc-700 w-full md:w-3/5">
                                                    {sertifikat.nama_sertifikat || '-'}
                                                </p>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                <p className="text-xs md:text-sm text-zinc-500 w-full md:w-2/5">
                                                    Link Sertifikat
                                                </p>
                                                <a href={sertifikat.fileUrl || '#'} className="text-sm font-medium text-zinc-700 w-full md:w-3/5 hover:text-blue-700">
                                                    Lihat Sertifikat
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {dataSertifikat.length < 1 && (
                                <div className="w-full flex justify-center items-center gap-3 opacity-40">
                                    <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-inherit"/>
                                    Pegawai ini belum punya sertifikat 
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            
        </MainLayoutPage>
    )
}

function Skeleton() {
    return (
        <>
            <div className="w-full p-5 rounded bg-zinc-300 animate-pulse mt-5"></div>
            <hr className="my-3 opacity-0" />
            <div className="w-full p-5 rounded bg-zinc-300 animate-pulse mt-5 h-20"></div>
            <div className="w-full p-5 rounded bg-zinc-300 animate-pulse mt-5"></div>
            <div className="w-full p-5 rounded bg-zinc-300 animate-pulse mt-5 h-80"></div>
            <div className="w-full p-5 rounded bg-zinc-300 animate-pulse mt-5 h-80"></div>
        </>
    )
}