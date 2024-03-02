'use client'

import MainLayoutPage from "@/components/mainLayout"
import { space } from "@/config/fonts"
import { getSiswaByNIS } from "@/lib/model/siswaModel"
import { faArrowLeft, faCheckCircle, faEdit, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
            <div className="">
                {loadingState === '' && <Skeleton/>}
                {loadingState === 'data exist' && (
                    <div className="p-5">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-5">
                                <button type="button" onClick={() => router.back()} className="w-8 h-8 rounded border border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white hover:scale-95 focus:scale-95 focus:text-white focus:bg-zinc-800 flex items-center justify-center transition-all duration-300">
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 text-inherit" />
                                </button>
                                <h1 className="py-1 px-2 rounded bg-zinc-100 text-zinc-800 font-bold">
                                    Data Informasi Siswa
                                </h1>
                            </div>
                            <div className="flex items-center gap-5">
                                <button type="button" onClick={() => router.push(`/data/siswa/update/${params.nis}`)} className="w-8 h-8 rounded flex items-center justify-center bg-orange-400 hover:bg-orange-500 focus:bg-orange-600 text-zinc-800" title="Ubah data ini">
                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                </button>
                                <button className="w-8 h-8 rounded flex items-center justify-center bg-red-400 hover:bg-red-500 focus:bg-red-600 text-zinc-800" title="Hapus data ini">
                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                </button>
                                <button className="w-8 h-8 rounded flex items-center justify-center bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 text-zinc-800" title="Export data ini sebagai PDF">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                        </div>
                        <div className="my-5">
                            <div className="flex items-center gap-1 text-sm">
                                <p className="text-xs">
                                    {dataSiswa.nis}
                                </p>
                                /
                                <p className="text-xs">
                                    {dataSiswa.nisn}
                                </p>
                            </div>
                            <div className="flex items-center gap-5 mb-3">
                                <h1 className="font-bold text-5xl tracking-tighter">
                                    {dataSiswa.nama_siswa}
                                </h1>
                                <div className="flex items-center gap-2 p-1 rounded-full bg-green-600/10">
                                    <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-green-600" />
                                    <p className="text-xs text-green-600 font-bold">Siswa Aktif</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-bold text-sm">
                                    {dataSiswa.kelas}
                                </p>
                                <p className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-bold text-sm">
                                    {dataSiswa.tahun_masuk}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-dashed">
                            <div className="pr-5">
                                <h1 className="bg-zinc-800 text-white font-bold px-2 py-1 rounded-full text-xs w-fit">
                                    Data Pribadi
                                </h1>
                                <hr className="my-2 opacity-0" />
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                No Induk Kependudukan
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.nik}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                No Kartu Keluarga
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.no_kk}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Tanggal Lahir
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.tanggal_lahir}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Tempat Lahir
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.tempat_lahir}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Jenis Kelamin
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.jenis_kelamin}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Agama
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.agama}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Status dalam Keluarga
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.status_dalam_keluarga}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Anak ke -
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.anak_ke}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-xs">
                                            Alamat
                                        </p>
                                        <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                            {dataSiswa.alamat}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-xs">
                                            Asal Sekolah
                                        </p>
                                        <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                            {dataSiswa.asal_sekolah}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                No Handphone
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                0{dataSiswa.no_hp_siswa}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Kategori
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.kategori}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pl-5">
                                <h1 className="bg-zinc-800 text-white font-bold px-2 py-1 rounded-full text-xs w-fit">
                                    Data Orang Tua
                                </h1>
                                <hr className="my-2 opacity-0" />
                                <div className="space-y-3">
                                    
                                    <div className="space-y-1">
                                        <p className="font-bold text-xs">
                                            No Telepon Orang Tua
                                        </p>
                                        <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                            0{dataSiswa.telp_ortu}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Nama Ayah
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.nama_ayah}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Pekerjaan Ayah
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.pekerjaan_ayah}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Nama Ibu
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.nama_ibu}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">
                                                Pekerjaan Ibu
                                            </p>
                                            <p className={`${space.className} font-extralight px-2 py-0.5 rounded bg-zinc-100 text-sm`}>
                                                {dataSiswa.pekerjaan_ibu}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
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

