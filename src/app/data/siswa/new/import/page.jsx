'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faArrowLeft, faDownload, faEllipsisH, faEllipsisV, faExclamationCircle, faSave, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import Papa from 'papaparse'
import { useRouter } from "next/navigation"

const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel']
const formatDataSiswa = ['kelas', 'nama_siswa', 'nis', 'nisn', 'nik', 'no_kk', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'status_dalam_keluarga', 'anak_ke', 'alamat', 'no_hp_siswa', 'asal_sekolah', 'kategori', 'tahun_masuk', 'nama_ayah', 'nama_ibu', 'telp_ortu', 'pekerjaan_ayah', 'pekerjaan_ibu', 'aktif']
export default function DataSiswaNewImportPage() {
    const router = useRouter()
    const [file, setFile] = useState(null)
    const [data, setData] = useState([])
    const [totalList, setTotalList] = useState(10)
    const [pagination, setPagination] = useState(1);

    const submitFile = async e => {
        e.preventDefault();

        if(!file) {
            return toast.error('Harap masukkan file CSV terlebih dahulu!')
        }

        if(!allowedFileTypes.includes(file.type)) {
            return toast.error('Anda hanya bisa mengupload file CSV saja!')
        }


        Papa.parse(file, {
            dynamicTyping: true,
            worker: true,
            header: true,
            complete: result => {
                if(result.data.length < 1) return toast.error('CSV yang anda upload kosong!');
                const fileObjectKeys = Object.keys(result.data[0])
                if(formatDataSiswa.includes(fileObjectKeys) === false) return toast.error('File tersebut tidak sama dengan kolom data yang sudah ada!')
                console.log(kolomDataSiswa)
                setData(result.data)
            }
        })
        
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="p-5">
                <div className="flex justify-between items-center w-full">
                    <div className="flex gap-5">
                        <button type="button" onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded border border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white hover:scale-95 focus:text-white foucs:bg-zinc-800 focus:scale-95 transition-all duration-300">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                        </button>
                        <h1 className="py-1 px-2 rounded-full bg-zinc-600 text-white font-bold text-sm">
                            Import Data Siswa
                        </h1>
                    </div>
                </div>
                <div className="p-3 bg-zinc-100 flex gap-5 rounded w-fit mt-5">
                    <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                    <p className="text-sm">
                        Sebelum mengupload File <b>CSV</b>, Pastikan bahwa header/kolom sudah sesuai dengan data yang sudah ada sebelumnya.
                    </p>
                </div>
                <hr className="my-3 opacity-0" />
                <form action="" onSubmit={submitFile} className="flex flex-col gap-3 ">
                    <input type="file" onChange={e => setFile(e.target.files[0])} className="text-sm  border rounded relative overflow-hidden w-fit cursor-pointer"  />
                    {file === null && (
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3 text-zinc-500" />
                            <p className="text-xs font-medium">
                                Silahkan pilih file terlebih dahulu
                            </p>
                        </div>
                    )}
                    {file !== null && (
                        <button type="submit" className="flex items-center gap-3 w-fit px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-500 focus:bg-blue-700">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit" />
                            Import
                        </button>
                    )}
                </form>
                
                
                <div className=" sticky top-0 bg-white w-full pt-5">
                    <div className="flex justify-between items-center w-full mb-2">
                        <div className="flex gap-2 items-center">
                            <select value={totalList} onChange={e => setTotalList(e.target.value)} className="text-sm px-2 py-1 rounded border outline-none bg-zinc-100 cursor-pointer">
                                <option value="10">10</option>
                                <option value="30">30</option>
                                <option value="100">100</option>
                                <option value={`${data.length}`}>Semua</option>
                            </select>
                            <p className="text-sm">
                                Menampilkan <b>{totalList}</b> Data dari {data.length} Data
                            </p>
                        </div>
                        {data.length > 0 && <div className="flex items-center gap-2">
                            <button type="button" className="flex items-center gap-2 px-2 py-1 rounded text-sm text-white bg-green-600 hover:bg-green-500 focus:bg-green-700">
                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                Simpan Data
                            </button>
                            <button type="button" className="flex items-center gap-2 px-2 py-1 rounded text-sm text-zinc-800 bg-red-600 hover:bg-red-500 focus:bg-red-700">
                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                Batalkan
                            </button>
                            
                        </div>}
                    </div>
                    <div className="flex gap-2 items-center text-sm">
                        <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 bg-zinc-800 text-white font-bold">
                            <div className="col-span-3 flex items-center gap-2">
                                <input type="checkbox" name="" id="" />
                                <p>Nama</p>
                            </div>
                            <div className="col-span-1">
                                <p>Kelas</p>
                            </div>
                            <div className="col-span-2">
                                <p>NIS/NISN</p>
                            </div>
                            <div className="col-span-2">
                                <p>NIK</p>
                            </div>
                            <div className="col-span-2">
                                <p>No KK</p>
                            </div>
                            <div className="col-span-2">
                                <p>Tempat Lahir</p>
                            </div>
                        </div>
                        <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 bg-zinc-800 text-white font-bold">
                            <div className="col-span-2">
                                <p>Tanggal Lahir</p>
                            </div>
                            <div className=" col-span-1">
                                <p>Gender</p>
                            </div>
                            <div className="col-span-2">
                                Agama
                            </div>
                            <div className="col-span-2">
                                Status dalam Keluarga
                            </div>
                            <div className=" col-span-1">
                                Anak ke
                            </div>
                            <div className=" col-span-4">
                                Alamat
                            </div>
                        </div>
                        <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 bg-zinc-800 text-white font-bold">
                            <div className=" col-span-3">
                                No HP
                            </div>
                            <div className=" col-span-4">
                                Asal Sekolah
                            </div>
                            <div className=" col-span-4">
                                Kategori
                            </div>
                            <div className=" col-span-1">
                                Tahun Masuk
                            </div>
                        </div>
                        <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 bg-zinc-800 text-white font-bold">
                            <div className=" col-span-3">
                                Nama Ayah
                            </div>
                            <div className=" col-span-3">
                                Pekerjaan Ayah
                            </div>
                            <div className=" col-span-3">
                                Nama Ibu
                            </div>
                            <div className=" col-span-3">
                                Pekerjaan Ibu
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-1.5 divide-y-2">
                    {data.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map(siswa => (

                        <div className="flex gap-2 items-center text-xs font-semibold *:hover:bg-zinc-100 text-zinc-800">
                            <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 ">
                                <div className="col-span-3 flex items-center gap-2">
                                    <input type="checkbox" name="" id="" />
                                    <p>{siswa.nama_siswa}</p>
                                </div>
                                <div className="col-span-1">
                                    <p>{siswa.kelas}</p>
                                </div>
                                <div className="col-span-2">
                                    <p>{siswa.nis}/{siswa.nisn}</p>
                                </div>
                                <div className="col-span-2">
                                    <p>{siswa.nik}</p>
                                </div>
                                <div className="col-span-2">
                                    <p>{siswa.no_kk}</p>
                                </div>
                                <div className="col-span-2">
                                    <p>{siswa.tempat_lahir}</p>
                                </div>
                            </div>
                            <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 ">
                                <div className="col-span-2">
                                    <p>{siswa.tanggal_lahir}</p>
                                </div>
                                <div className=" col-span-1">
                                    <p>{siswa.jenis_kelamin}</p>
                                </div>
                                <div className="col-span-2">
                                    {siswa.agama}
                                </div>
                                <div className="col-span-2">
                                    {siswa.status_dalam_keluarga}
                                </div>
                                <div className=" col-span-1">
                                    {siswa.anak_ke}
                                </div>
                                <div className=" col-span-4">
                                    {siswa.alamat}
                                </div>
                            </div>
                            <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 ">
                                <div className=" col-span-3">
                                    {siswa.no_hp}
                                </div>
                                <div className=" col-span-4">
                                    {siswa.asal_sekolah}
                                </div>
                                <div className=" col-span-4">
                                    {siswa.kategori}
                                </div>
                                <div className=" col-span-1">
                                    {siswa.tahun_masuk}
                                </div>
                            </div>
                            <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 ">
                                <div className=" col-span-3">
                                    {siswa.nama_ayah}
                                </div>
                                <div className=" col-span-3">
                                    {siswa.pekerjaan_ayah}
                                </div>
                                <div className=" col-span-3">
                                    {siswa.nama_ibu}
                                </div>
                                <div className=" col-span-3">
                                    {siswa.pekerjaan_ibu}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </MainLayoutPage>
    )
}