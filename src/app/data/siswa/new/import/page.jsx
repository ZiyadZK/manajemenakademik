'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faAngleLeft, faAngleRight, faArrowLeft, faDownload, faEllipsisH, faEllipsisV, faExclamationCircle, faSave, faTrash, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import Papa from 'papaparse'
import { useRouter } from "next/navigation"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { createMultiSiswa } from "@/lib/model/siswaModel"

const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel']
const formatDataSiswa = ['kelas', 'nama_siswa', 'nis', 'nisn', 'nik', 'no_kk', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'status_dalam_keluarga', 'anak_ke', 'alamat', 'no_hp_siswa', 'asal_sekolah', 'kategori', 'tahun_masuk', 'nama_ayah', 'nama_ibu', 'telp_ortu', 'pekerjaan_ayah', 'pekerjaan_ibu', 'aktif']
const mySwal = withReactContent(Swal)

export default function DataSiswaNewImportPage() {
    const router = useRouter()
    const [file, setFile] = useState(null)
    const [data, setData] = useState([])
    const [totalList, setTotalList] = useState(10)
    const [pagination, setPagination] = useState(1);
    const [selectedSiswa, setSelectedSiswa] = useState([])


    const submitFile = async e => {
        e.preventDefault();

        if(!file) {
            return toast.error('Harap masukkan file CSV terlebih dahulu!')
        }

        if(!allowedFileTypes.includes(file.type)) {
            return toast.error('Anda hanya bisa mengupload file CSV saja!')
        }


        Papa.parse(file, {
            worker: true,
            header: true,
            complete: result => {
                if(result.data.length < 1) return toast.error('CSV yang anda upload kosong!');
                const uploadedColumns = Object.keys(result.data[0])
                const missingColumns = formatDataSiswa.filter(col => !uploadedColumns.includes(col))
                if(missingColumns.length > 0) return toast.error('Kolom-kolom yang ada di File CSV anda tidak sesuai dengan data yang sudah ada!');
                setData(result.data)
            }
        })   
    }

    const submitData = async () => {
        mySwal.fire({
            icon: 'question',
            title: 'Apakah anda sudah yakin?',
            text: 'Anda akan menyimpan data import ke dalam data siswa',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    text: 'Harap tunggu dikarenakan proses import memerlukan waktu',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 15000,
                    didOpen: async () => {
                        const response = await createMultiSiswa(data);
                        if(response.success) {
                            mySwal.fire({
                                icon: 'success',
                                title: 'Berhasil memproses data!',
                                text: 'Berhasil mengupload data import ke data siswa!',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => router.push('/data/siswa'));
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                title: 'Gagal memproses data..',
                                text: 'Terdapat kendala disaat anda mengimport data ke data siswa!',
                                timer: 2000,
                                allowOutsideClick: false
                            })
                        }
                        
                    }
                })
            }
        })
    }

    const addSelectedSiswa = (nis) => {
        if(selectedSiswa.includes(nis)) {
            const updatedData = selectedSiswa.filter(siswaNis => siswaNis !== nis);
            setSelectedSiswa(updatedData)
        }else{
            const updatedData = [...selectedSiswa, nis]
            setSelectedSiswa(updatedData)
        }
    }

    const deleteSelectedSiswa = () => {
        const updatedData = data.filter(siswa => !selectedSiswa.includes(siswa.nis));
        setSelectedSiswa([])
        setData(updatedData)
    }

    const cancelImport = () => {
        setData([])
        setPagination(1)
        setTotalList(10)
        setSelectedSiswa([])
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
                
                <div className="flex justify-between items-center w-full my-3">
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
                        <button type="button" onClick={() => submitData()} className="flex items-center gap-2 px-2 py-1 rounded text-sm text-white bg-green-600 hover:bg-green-500 focus:bg-green-700">
                            <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                            Simpan Data
                        </button>
                        <button onClick={() => cancelImport()} type="button" className="flex items-center gap-2 px-2 py-1 rounded text-sm text-zinc-800 bg-red-600 hover:bg-red-500 focus:bg-red-700">
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                            Batalkan
                        </button>
                        
                    </div>}
                </div>
                <div className="overflow-auto relative">
                    <div className=" bg-white w-full">
                        <div className="flex items-center text-sm">
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

                            <div className="flex items-center text-xs font-semibold *:hover:bg-zinc-100 text-zinc-800">
                                <div className="w-full flex-shrink-0 grid grid-cols-12 gap-1 px-3 py-2 ">
                                    <div className="col-span-3 flex items-center gap-2">
                                        <input type="checkbox" checked={selectedSiswa.includes(siswa.nis)} onChange={() => addSelectedSiswa(siswa.nis)} className="cursor-pointer" />
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
                <div className="sticky bottom-0 w-full px-3 py-2 rounded bg-zinc-800 font-bold text-white">
                    <div className="flex w-full justify-between items-center">
                        {data.length > 0 && <div className="flex gap-5 items-center">
                            <p className="text-sm"> {selectedSiswa.length} <span className="font-light">Item Terpilih</span></p>
                            <button type="button" onClick={() => deleteSelectedSiswa()} className="w-6 h-6 bg-red-500 hover:bg-red-400 focus:bg-red-700 text-zinc-800 flex items-center justify-center rounded">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>}
                        {data.length > 0 && <div className="flex items-center gap-3">
                            <p className="text-sm text-zinc-400 font-medium">
                                Menampilkan Data dari Data ke-<span className="text-white">{(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList) + 1}</span> hingga <span className="text-white">{(totalList * pagination) < data.length ? totalList * pagination : data.length}</span> dari <span className="text-white">{data.length}</span>
                            </p>
                            <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white rounded hover:bg-zinc-500/50">
                                <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                            </button>
                            <p className="font-light text-white text-sm">
                                {pagination}
                            </p>
                            <button type="button" onClick={() => setPagination(state => (totalList * pagination) < data.length ? state + 1 : state)} className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white rounded hover:bg-zinc-500/50">
                                <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>}
                    </div>
                </div>
                
            </div>
        </MainLayoutPage>
    )
}