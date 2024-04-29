'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, rale } from "@/config/fonts"
import { getSinglePegawai } from "@/lib/model/pegawaiModel"
import { getDataSertifikat } from "@/lib/model/sertifikatModel"
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { faArrowLeft, faUserTag } from "@fortawesome/free-solid-svg-icons"
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
    'pensiun': 'Sudah Pensiun',
}

export default function PegawaiIDPage({params}) {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [dataSertifikat, setDataSertifikat] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')

    const getPegawai = async (id) => {
        setLoadingFetch('loading')
        const result = await getSinglePegawai({id_pegawai: id})
        const sertif_result = await getSertifikat(id)
        console.log(sertif_result.data)
        setData(result.data)
        setDataSertifikat(sertif_result.data)
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
            {loadingFetch !== 'fetched' ? <Skeleton /> : (
                <div className="mt-5">
                    <div className="flex flex-col md:flex-row gap-5 md:justify-between md:items-center">
                        <div className="flex items-center gap-5">
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
                        <div className="flex items-center gap-5">
                            <button type="button" onClick={() => router.push(`/data/pegawai/update/${data.id_pegawai}`)} className="px-4 py-2 w-full md:w-fit flex items-center justify-center gap-3 text-amber-700 bg-amber-100 rounded-full hover:bg-amber-200" >
                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                Ubah
                            </button>
                            <button type="button"  className="px-4 py-2 w-full md:w-fit flex items-center justify-center gap-3 text-red-700 bg-red-100 rounded-full hover:bg-red-200" >
                                <FontAwesomeIcon icon={faTrashCan} className="w-3 h-3 text-inherit" />
                                Hapus
                            </button>
                        </div>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <h1 className={`${rale.className} text-3xl md:text-6xl text-zinc-800 font-medium`}>
                        {data.nama_pegawai}
                    </h1>
                    <div className="flex items-center gap-5 my-3">
                        <p className="px-3 py-1 rounded bg-zinc-50 text-xs md:text-lg">
                            {data.jabatan}
                        </p>
                        <p className={`px-3 py-1 rounded ${data.pensiun ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'} text-xs md:text-lg`}>
                            {data.pensiun ? 'Sudah Pensiun' : 'Aktif'}
                        </p>
                    </div>
                    <hr className="my-2" />
                    <div className={`p-5 bg-zinc-50 rounded-lg ${mont.className}`}>
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
                                            {format === 'pensiun' ? (data[format] === true ? 'Ya' : 'Tidak') : data[format]}
                                        </p>
                                    </div>
                                ))}
                                <hr className="" />
                                {formatDataSertifikat.map((format, index) => (
                                    <div key={`${format} - ${index}`} className="collapse collapse-plus bg-zinc-100">
                                        <input type="checkbox" /> 
                                        <div className="collapse-title text-xl font-medium ">
                                            {format.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </div>
                                        <div className="collapse-content space-y-4"> 
                                            <div className="flex md:flex-row flex-col md:gap-2 md:items-center">
                                                <p className="w-full md:w-2/5 text-xs md:text-md text-zinc-400">
                                                    Nama Sertifikat <span className="float-end md:block hidden">:</span>
                                                </p>
                                                <p className="w-full md:w-3/4 tracking-tighter">
                                                    {data[format] ? data[format] : 'Tidak ada'}
                                                </p>
                                            </div>
                                            <div className="flex md:flex-row flex-col md:gap-2 md:items-center">
                                                <p className="w-full md:w-2/5 text-xs md:text-md text-zinc-400">
                                                    Status Sertifikat <span className="float-end hidden md:block">:</span>
                                                </p>
                                                <p className="w-full md:w-3/4 tracking-tighter">
                                                    {dataSertifikat.filter(sertifikat => sertifikat['jenis_sertifikat'] === format.split('_')[1])}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
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
                                            {format === 'pensiun' ? (data[format] === true ? 'Ya' : 'Tidak') : data[format]}
                                        </p>
                                    </div>
                                ))}
                            </div>
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