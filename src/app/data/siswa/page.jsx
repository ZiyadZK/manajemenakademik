'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faAngleLeft, faAngleRight, faClockRotateLeft, faEdit, faEllipsis, faInfoCircle, faMale, faPlusSquare, faPrint, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"


export default function DataSiswaMainPage() {
    const router = useRouter();
    return (
        <MainLayoutPage>
            <Toaster />
            <div className="p-5">
                <div className="p-5 rounded bg-zinc-100">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-5">
                            <h1 className="font-bold text-white bg-zinc-700 px-2 py-1 w-fit rounded-full text-xs">
                                Bagan Data Baru
                            </h1>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-zinc-700" />
                                <p className="text-sm">
                                    Halaman ini hanya menampilkan data-data saja.
                                </p>
                            </div>
                        </div>
                        <button type="button" onClick={() => router.push('/data/siswa/new')} className="bg-zinc-800 font-semibold focus:bg-green-700 text-white rounded text-sm py-1 px-2 hover:bg-green-600 flex items-center gap-2 tracking-tighter transition-all duration-300">
                            <FontAwesomeIcon icon={faPlusSquare} className="text-inherit w-3 h-3" />
                            Tambah Data Baru
                        </button>
                    </div>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-5">
                        <h1 className="text-xs text-white bg-zinc-800 font-bold rounded-full w-fit px-2 py-1">
                            Daftar Data Tersedia
                        </h1>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClockRotateLeft} className="w-4 h-4 text-zinc-500" />
                            <p className="text-sm">
                                Terakhir di update: <b>--/--/---- </b>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-5 my-2">
                    <select className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm hover:scale-95 transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800">
                        <option value="" disabled>-- Pilih Kelas --</option>
                        <option value="10">Kelas 10</option>
                        <option value="11">Kelas 11</option>
                        <option value="12">Kelas 12</option>
                        <option value="All">Semua Kelas</option>
                    </select>
                    <select className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm hover:scale-95 transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800">
                        <option value="" disabled>-- Pilih Jurusan --</option>
                        <option value="TKJ">TKJ</option>
                        <option value="DPIB">DPIB</option>
                        <option value="GEO">GEO</option>
                        <option value="TKRO">TKRO</option>
                        <option value="TKR">TKR</option>
                        <option value="TITL">TITL</option>
                        <option value="All">Semua Kelas</option>
                    </select>
                    <select className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm hover:scale-95 transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800">
                        <option value="" disabled>-- No Rombel --</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <div className="flex col-span-6 w-full items-center justify-end gap-5">
                        <input type="text" className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800" placeholder="Cari data disini" />
                        <select className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm hover:scale-95 transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800">
                            <option value="" disabled>-- Kriteria --</option>
                            <option value="nis">NIS</option>
                            <option value="nisn">NISN</option>
                            <option value="nama">Nama</option>
                            <option value="nik">NIK</option>
                            <option value="no_hp_siswa">No Telp</option>   
                        </select>    
                    </div>
                </div>
                <div className="grid grid-cols-12 bg-zinc-800 text-white py-2 rounded mt-3 sticky top-0 text-sm">
                    <div className="col-span-3 px-2 flex items-center gap-3">
                        <input type="checkbox"  className="accent-orange-600 cursor-pointer outline-none" />
                        Nama
                    </div>
                    <div className="col-span-2 px-2">
                        NIS / NISN
                    </div>
                    <div className=" px-2">
                        Jurusan
                    </div>
                    <div className=" px-2">
                        Gender
                    </div>
                    <div className=" px-2">
                        No HP
                    </div>
                    <div className="col-span-2 px-2">
                        Tahun Masuk
                    </div>
                    <div className="px-2">
                        Status
                    </div>
                    <div className="col-span-1 px-2 flex justify-center items-center">
                        <FontAwesomeIcon icon={faEllipsis} className="w-4 h-4 text-inherit" />
                    </div>
                </div>
                <div className="divide-y-2 my-1">
                    <div className="grid grid-cols-12 text-sm transition-all duration-300 hover:bg-zinc-100">
                        <div className="py-2 w-full col-span-3 px-2 flex items-center gap-3">
                            <input type="checkbox" name="" id="" />
                            Ziyad Jahizh Kartiwa
                        </div>
                        <div className="py-2 w-full col-span-2 px-2">
                            10211615 / 0061085056
                        </div>
                        <div className="py-2 w-full  px-2">
                            XII DPIB 1
                        </div>
                        <div className="p-2 flex items-center gap-2">
                            Laki-laki
                        </div>
                        <div className="p-2 ">
                            0831127251
                        </div>
                        <p className="p-2 col-span-2">
                            2021
                        </p>
                        <p className="p-2">
                            Aktif
                        </p>
                        <div className="col-span-1 flex w-full items-center justify-center gap-1">
                            <button type="button" className="w-6 h-6 text-zinc-800 rounded bg-orange-400 hover:bg-orange-500 flex items-center justify-center" title="Ubah Data">
                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" className="w-6 h-6 text-zinc-800 rounded bg-blue-400 hover:bg-blue-500 flex items-center justify-center" title="Lihat lebih detail">
                                <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button"  className="w-6 h-6 text-zinc-800 rounded bg-red-400 hover:bg-red-500 flex items-center justify-center">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 text-sm transition-all duration-300 hover:bg-zinc-100">
                        <div className="py-2 w-full col-span-3 px-2 flex items-center gap-3">
                            <input type="checkbox" name="" id="" />
                            Ziyad Jahizh Kartiwa
                        </div>
                        <div className="py-2 w-full col-span-2 px-2">
                            10211615 / 0061085056
                        </div>
                        <div className="py-2 w-full  px-2">
                            XII DPIB 1
                        </div>
                        <div className="p-2 flex items-center gap-2">
                            Laki-laki
                        </div>
                        <div className="p-2 ">
                            0831127251
                        </div>
                        <p className="p-2 col-span-2">
                            2021
                        </p>
                        <p className="p-2">
                            Aktif
                        </p>
                        <div className="col-span-1 flex w-full items-center justify-center gap-1">
                            <button type="button" className="w-6 h-6 text-zinc-800 rounded bg-orange-400 hover:bg-orange-500 flex items-center justify-center" title="Ubah Data">
                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" className="w-6 h-6 text-zinc-800 rounded bg-blue-400 hover:bg-blue-500 flex items-center justify-center" title="Lihat lebih detail">
                                <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button"  className="w-6 h-6 text-zinc-800 rounded bg-red-400 hover:bg-red-500 flex items-center justify-center">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="rounded w-full flex items-center justify-between bg-zinc-800 py-2 text-white px-2 text-sm sticky bottom-0">
                    <div className="flex items-center gap-5">
                        <p>
                            <b>0</b> Item selected
                        </p>
                        <button type="button"  className="px-2 py-1 rounded bg-red-400 hover:bg-red-500 text-xs text-zinc-800 font-bold">
                            Hapus
                        </button>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-white">
                                Total <b>1</b> items
                            </p>
                            <button type="button" className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-300">
                                <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                            </button>
                            <p>
                                1
                            </p>
                            <button type="button"  className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-300">
                                <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                        <select className="py-1 px-2 rounded outline-none border bg-zinc-700 cursor-pointer">
                            <option value={10}>10 Data</option>
                            <option value={30}>30 Data</option>
                            <option value={50}>50 Data</option>
                            <option value={100}>100 Data</option>
                            <option value={9000}>Semua Data</option>
                        </select>
                        <div className="relative">
                            <button type="button" className="px-2 py-1 rounded bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 font-bold peer flex items-center justify-center text-xs gap-3">
                                <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                Export as CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}