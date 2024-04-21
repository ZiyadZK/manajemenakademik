'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faAngleLeft, faAngleRight, faArrowLeft, faCheck, faDownload, faEllipsisH, faEllipsisV, faExclamation, faExclamationCircle, faFileCircleCheck, faSave, faSpinner, faTrash, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import Papa from 'papaparse'
import { useRouter } from "next/navigation"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { createMultiSiswa } from "@/lib/model/siswaModel"
import { mont } from "@/config/fonts"

const formatInputFile = {
    kelas: 'tidak cocok',
    nama_siswa: 'tidak cocok',
    nis: 'tidak cocok',
    nisn: 'tidak cocok',
    nik: 'tidak cocok',
    no_kk: 'tidak cocok',
    tempat_lahir: 'tidak ada',
    tanggal_lahir: 'tidak cocok',
    jenis_kelamin: 'cocok',
    agama: 'tidak cocok',
    status_dalam_keluarga: 'tidak cocok',
    anak_ke: 'tidak cocok',
    alamat: 'tidak cocok',
    no_hp_siswa: 'tidak cocok',
    asal_sekolah: 'cocok',
    kategori: 'tidak cocok',
    tahun_masuk: 'tidak cocok',
    nama_ayah: 'tidak cocok',
    nama_ibu: 'tidak cocok',
    telp_ortu: 'tidak cocok',
    pekerjaan_ayah: 'tidak cocok',
    pekerjaan_ibu: 'tidak cocok',
    aktif: 'tidak cocok',
  }

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
            <hr className="my-1 md:my-2 opacity-0" />
            <div className={`flex md:items-center md:justify-between w-full md:flex-row flex-col gap-5`}>
                <div className="flex items-center gap-5 md:gap-5">
                    <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                    </button>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-blue-600" />
                        <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text">
                            Import Data Siswa
                        </h1>
                    </div>
                </div>
            </div>
            <hr className="my-3 opacity-0" />
            <div className="flex md:items-center md:justify-between md:flex-row flex-col gap-5 md:gap-0">
                <p className="text-sm md:w-1/2 w-full">
                    Anda bisa melakukan <span className=" text-blue-600 font-medium">import data</span> menggunakan file <span className="font-medium">Excel (.xlsx)</span> ataupun menggunakan <span className="font-medium">CSV</span> yang berisi data-data sesuai dengan ketentuan yang sudah disiapkan. <br /> <br />
                    Sebelum melakukan Import, anda bisa terlebih dahulu mengecek apa saja kolom-kolom yang diperlukan sebelum melakukan import data di <span className=" inline md:hidden font-medium">bawah</span> <span className="md:inline hidden font-medium">pinggir</span> ini. <br /> <br />
                    Jika anda mengalami kesulitan untuk menyesuaikan data yang anda miliki, anda bisa menghubungi <span className="font-medium">Administrator</span> agar bisa disesuaikan oleh mereka.
                </p>
                <div className="p-3 rounded bg-zinc-50 w-full md:w-1/3">
                    <p>
                        <span className="text-zinc-300 font-bold">#</span> Contoh File Excel
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-2 rounded-full bg-zinc-200 flex items-center justify-center gap-2 text-sm text-zinc-600 hover:bg-blue-100 hover:text-blue-600">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit" />
                            Unduh
                        </button>
                        <p className="italic text-xs">
                            Format: .xlsx
                        </p>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <p>
                        <span className="text-zinc-300 font-bold">#</span> Contoh File CSV
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-2 rounded-full bg-zinc-200 flex items-center justify-center gap-2 text-sm text-zinc-600 hover:bg-blue-100 hover:text-blue-600">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit" />
                            Unduh
                        </button>
                        <p className="italic text-xs">
                            Format: .csv
                        </p>
                    </div>
                </div>
            </div>
            <hr className="my-3 w-full" />
            <div className="flex items-center gap-5 flex-col md:flex-row">

                <form className="flex items-center gap-5 flex-col md:flex-row">
                    <input type="file" className=" rounded-l-xl border rounded-r-xl" />
                    <button type="button" className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-teal-100 w-full md:w-fit text-teal-600 hover:bg-teal-200 hover:text-teal-800">
                        <FontAwesomeIcon icon={faUpload} className="w-3 h-3 text-inherit" />
                        Upload
                    </button>
                </form>
                <div className="flex items-center gap-5 w-full">
                    <button type="button" onClick={() => document.getElementById('informasi_file').showModal()} className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-zinc-100 w-full md:w-fit text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800">
                        <FontAwesomeIcon icon={faFileCircleCheck} className="w-3 h-3 text-inherit" />
                        Cek File
                    </button>
                        <dialog id="informasi_file" className="modal">
                        <div className="modal-box bg-white">
                            <h3 className="font-bold text-lg">Informasi File</h3>
                            <article className={`${mont.className}  mt-3 flex gap-3`}>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Ekstensi
                                    </p>
                                    <p className="font-medium">
                                        .xlsx
                                    </p>
                                </div>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Ukuran
                                    </p>
                                    <p className="font-medium">
                                        20 kb
                                    </p>
                                </div>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Jumlah data
                                    </p>
                                    <p className="font-medium">
                                        1.000 baris
                                    </p>
                                </div>
                            </article>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                    <button type="button" onClick={() => document.getElementById('informasi_kolom').showModal()} className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-zinc-100 w-full md:w-fit text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800">
                        <FontAwesomeIcon icon={faFileCircleCheck} className="w-3 h-3 text-inherit" />
                        Cek Kolom
                    </button>
                    <dialog id="informasi_kolom" className="modal">
                        <div className="modal-box bg-white">
                            <h3 className="font-bold text-lg">Informasi Kolom</h3>
                            <div className="divide-y mt-3">    
                                <div className=" grid grid-cols-7 divide-x">
                                    <div className="col-span-4">
                                        <div className="flex items-center">
                                            <p className="text-xs md:text-sm text-zinc-400 text-center w-full">
                                                Nama Kolom
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex items-center">
                                            <p className="text-xs md:text-sm text-zinc-400 text-center w-full">
                                                Status
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {formatDataSiswa.map((format) => (
                                    <div key={format} className=" grid grid-cols-7 py-1">
                                        <div className="col-span-4">
                                            <div className="flex items-center h-full">
                                                <p className="text-xs md:text-sm text-zinc-700 font-medium text-center w-full align-middle">
                                                    {format}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            {formatInputFile[format] === 'cocok' && (
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-between px-3 py-1 text-xs text-green-700 bg-green-50 gap-3 rounded-full">
                                                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-700" />
                                                        Cocok
                                                    </div>
                                                </div>
                                            )}
                                            {formatInputFile[format] === 'tidak cocok' && (
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-between px-3 py-1 text-xs text-red-700 bg-red-50 gap-3 rounded-full">
                                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-red-700" />
                                                        Tidak Cocok
                                                    </div>
                                                </div>
                                            )}
                                           {formatInputFile[format] === 'tidak ada' && (
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-between px-3 py-1 text-xs text-red-700 bg-red-50 gap-3 rounded-full">
                                                        <FontAwesomeIcon icon={faExclamation} className="w-3 h-3 text-red-700" />
                                                        Tidak Ada Kolom
                                                    </div>
                                                </div>
                                           )}
                                        </div>
                                    </div>
                                ))}

                                
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
            </div>
            <hr className="my-3 w-full opacity-0" />
            

        </MainLayoutPage>
    )
}