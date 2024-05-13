'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont } from "@/config/fonts"
import { getKepalaSekolah, getProfilSekolah } from "@/lib/model/profilSekolahModel"
import { faEdit } from "@fortawesome/free-regular-svg-icons"
import { faBookBookmark, faDownload, faIdBadge, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

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

    const getData = async () => {
        const result = await getProfilSekolah()
        if(result.success) {
            let updatedData;
            const kepsek = await getKepalaSekolah()
            if(kepsek.success) {
                updatedData = { ['kepala_sekolah']: kepsek.data.nama_pegawai || '-', ['id_kepala_sekolah']: kepsek.data.id_pegawai || '-', ...result.data}
            }else{
                updatedData = { ['kepala_sekolah']: 'Tidak Ada', ['id_kepala_sekolah']: '0', ...result.data}
            }
            setData(updatedData)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-3">
                <div className="flex items-center w-full gap-5 md:w-1/2">
                    <button type="button" className="px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 focus:bg-zinc-200 text-zinc-700 flex items-center justify-center md:w-fit gap-3 w-1/2 md:text-xl">
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-zinc-600" />
                        Unduh Data
                    </button>
                    <button type="button" onClick={() => router.push('/profilsekolah/ubah')} className="px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 focus:bg-zinc-200 text-zinc-700 flex items-center justify-center md:w-fit gap-3 w-1/2 md:text-xl">
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-zinc-600" />
                        Ubah
                    </button>
                </div>
                <hr className="my-3 opacity-0" />
                <div className="relative overflow-hidden w-full rounded-lg border pb-6">
                    <div className="w-full p-5 bg-gradient-to-r from-blue-500 to-cyan-500">
                        <h1 className="text-white font-medium text-xl md:text-3xl flex items-center gap-5">
                            <FontAwesomeIcon icon={faBookBookmark} className="w-5 h-5 text-inherit" />
                            Data Identitas Sekolah
                        </h1>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className="flex md:flex-row flex-col gap-5 px-3 md:px-8">
                        <div className={`${mont.className} w-full md:w-1/2 bg-white  space-y-6`}>
                            <div className="flex gap-1 md:gap-3 text-xs md:text-sm flex-col md:flex-row w-full">
                                <p className="w-full md:w-2/6 opacity-60">Kepala Sekolah <span className="float-end hidden md:inline">:</span></p>
                                <div className="w-full md:w-4/6">
                                    {data['kepala_sekolah']}
                                    <hr className="my-0.5 opacity-0" />
                                    {data['id_kepala_sekolah'] && (
                                        <button onClick={() => router.push(`/data/pegawai/id/${data['id_kepala_sekolah']}`)} type="button" className="flex items-center justify-center gap-2 text-xs px-3 py-1 font-medium bg-zinc-50 hover:bg-zinc-100 focus:bg-zinc-200 text-zinc-700 rounded-full">
                                            <FontAwesomeIcon icon={faSearch} className="w-2 h-2 text-inherit" />
                                            Lihat Profil
                                        </button>
                                    )}
                                </div>
                            </div>
                            {formatDataArr.slice(0, formatDataArr.length / 2).map((format, index) => (
                                <div key={`${format} - ${index}`} className="flex gap-1 md:gap-3 text-xs md:text-sm flex-col md:flex-row">
                                    <p className="w-full md:w-2/6 opacity-60">{formatData[format]} <span className="float-end hidden md:inline">:</span></p>
                                    <p className="w-full md:w-4/6">
                                        {data[format] ? data[format] : '-'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className={`${mont.className} w-full md:w-1/2 bg-white  space-y-6`}>
                            {formatDataArr.slice(formatDataArr.length / 2, formatDataArr.length).map((format, index) => (
                                <div key={`${format} - ${index}`} className="flex gap-1 md:gap-3 text-xs md:text-sm flex-col md:flex-row">
                                    <p className="w-full md:w-2/6 opacity-60">{formatData[format]} <span className="float-end hidden md:inline">:</span></p>
                                    <p className="w-full md:w-4/6">
                                        {data[format] ? data[format] : '-'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}