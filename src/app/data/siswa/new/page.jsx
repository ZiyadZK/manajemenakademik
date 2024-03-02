'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faAngleDown, faArrowLeftLong, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DataSiswaNewPage() {
    const [formData, setFormData] = useState([])
    const router = useRouter()
    return (
        <MainLayoutPage>
            <div className="p-5">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-5">
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center rounded border border-zinc-600 text-zinc-800 hover:bg-zinc-800 hover:text-white transition-all duration-300 hover:scale-95 focus:bg-zinc-800 focus:text-white focus:scale-95 text-sm w-6 h-6" title="Kembali ke sebelumnya">
                            <FontAwesomeIcon icon={faArrowLeftLong} className="w-3 h-3 text-inherit" />
                        </button>
                        <h1 className="px-2 py-1 rounded-full bg-zinc-800 text-white font-bold text-sm">
                            Pembuatan Data Siswa Baru
                        </h1>
                    </div>
                    <button type="button" className="flex items-center gap-3 justify-center rounded bg-blue-400 hover:bg-blue-500 focus:bg-blue-500 button text-white p-2 font-bold text-xs transition-all duration-300">
                        <FontAwesomeIcon icon={faUpload} className="w-4 h-4 text-inherit" />
                        Import dari CSV
                    </button>
                </div>
                <div className="mt-5">
                    <div className="grid grid-cols-2 divide-x divide-dashed">
                        <div className="w-full pr-5 space-y-3">
                            <h1 className="px-2 py-1 rounded-full text-xs font-bold text-white bg-zinc-800 w-fit">
                                Data Pribadi
                            </h1>
                            <div className="text-sm font-semibold space-y-5">
                                <div className="grid grid-cols-3 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Kelas</h1>
                                        <select  className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="X" >X</option>
                                            <option value="XI" >XI</option>
                                            <option value="XII" >XII</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Rombel</h1>
                                        <select  className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="TKJ" >TKJ</option>
                                            <option value="GEO" >GEO</option>
                                            <option value="DPIB" >DPIB</option>
                                            <option value="TKR" >TKR</option>
                                            <option value="TKRO" >TKRO</option>
                                            <option value="TITL" >TITL</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">No Rombel</h1>
                                        <select className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="1" >1</option>
                                            <option value="2" >2</option>
                                            <option value="3" >3</option>
                                            <option value="4" >4</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">No Induk Kependudukan</h1>
                                        <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan No Induk Kependudukan" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">No Kartu Keluarga</h1>
                                        <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan No Kartu Keluarga" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xs">Nama Panjang</h1>
                                    <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Nama Panjang" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Tanggal Lahir</h1>
                                        <input type="date" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Tanggal Lahir" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Tempat Lahir</h1>
                                        <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Tempat Lahir" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Jenis Kelamin</h1>
                                        <select name="" id="" className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                            <option value="Laki Laki">Laki Laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Agama</h1>
                                        <select name="" id="" className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Pilih Agama --</option>
                                            <option value="Islam">Islam</option>
                                            <option value="Kristen Protestan">Kristen Protestan</option>
                                            <option value="Kristen Katolik">Kristen Katolik</option>
                                            <option value="Hindu">Hindu</option>
                                            <option value="Buddha">Buddha</option>
                                            <option value="Konghucu">Konghucu</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Status dalam Keluarga</h1>
                                        <select name="" id="" className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Pilih Status Keluarga --</option>
                                            <option value="Anak Kandung">Anak Kandung</option>
                                            <option value="Anak Angkat">Anak Angkat</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Anak Ke - </h1>
                                        <select name="" id="" className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Anak ke Berapa --</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6 </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xs">Alamat</h1>
                                    <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Alamat" />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xs">No Handphone Siswa</h1>
                                    <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan No Handphone Siswa" />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xs">Asal Sekolah</h1>
                                    <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Asal Sekolah" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Tahun Masuk</h1>
                                        <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Tahun Masuk Siswa" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Kategori</h1>
                                        <select className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Pilih Kategori --</option>
                                            <option value="PRIORITAS NILAI RAPOR UMUM">Prioritas Nilai Rapor Umum</option>
                                            <option value="PRIORITAS NILAI RAPOR UNGGULAN">Prioritas Nilai Rapor Unggulan</option>
                                            <option value="PRIORITAS JARAK">Prioritas Jarak</option>
                                            <option value="KETM">KETM</option>
                                            <option value="KONDISI TERTENTU">Kondisi Tertentu</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">NISN</h1>
                                        <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan NISN" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">NIS</h1>
                                        <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan NISN" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full pl-5 space-y-3">
                            <h1 className="px-2 py-1 rounded-full text-xs font-bold text-white bg-zinc-800 w-fit">
                                Data Orang Tua
                            </h1>
                            <div className="text-sm font-semibold space-y-5">
                                <div className="space-y-1">
                                    <h1 className="text-xs">Telp Orang Tua</h1>
                                    <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Telp Orang Tua" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Nama Ayah</h1>
                                        <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Nama Ayah" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Pekerjaan Ayah</h1>
                                        <select className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Pekerjaan Ayah --</option>
                                            <option value="Buruh">Buruh</option>
                                            <option value="Buruh Harian Lepas">Buruh Harian Lepas</option>
                                            <option value="Guru">Guru</option>
                                            <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                                            <option value="Karyawan Swasta">Karyawan Swasta</option>
                                            <option value="Mekanik">Mekanik</option>
                                            <option value="Meninggal">Meninggal</option>
                                            <option value="Ojek Online">Ojek Online</option>
                                            <option value="Pedagang">Pedagang</option>
                                            <option value="Pedagang Kecil">Pedagang Kecil</option>
                                            <option value="Pegawai Negeri Sipil">Pegawai Negeri Sipil</option>
                                            <option value="Pensiun">Pensiun</option>
                                            <option value="Satpam">Satpam</option>
                                            <option value="Sopir">Sopir</option>
                                            <option value="Tidak Bekerja">Tidak Bekerja</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Nama Ibu</h1>
                                        <input type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Nama Ayah" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Pekerjaan Ibu</h1>
                                        <select className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Pekerjaan Ayah --</option>
                                            <option value="Buruh">Buruh</option>
                                            <option value="Buruh Harian Lepas">Buruh Harian Lepas</option>
                                            <option value="Guru">Guru</option>
                                            <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                                            <option value="Karyawan Swasta">Karyawan Swasta</option>
                                            <option value="Mekanik">Mekanik</option>
                                            <option value="Meninggal">Meninggal</option>
                                            <option value="Ojek Online">Ojek Online</option>
                                            <option value="Pedagang">Pedagang</option>
                                            <option value="Pedagang Kecil">Pedagang Kecil</option>
                                            <option value="Pegawai Negeri Sipil">Pegawai Negeri Sipil</option>
                                            <option value="Pensiun">Pensiun</option>
                                            <option value="Satpam">Satpam</option>
                                            <option value="Sopir">Sopir</option>
                                            <option value="Tidak Bekerja">Tidak Bekerja</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}