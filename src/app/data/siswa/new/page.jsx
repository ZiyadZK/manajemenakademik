'use client'

import MainLayoutPage from "@/components/mainLayout"
import { dateToIso, isoToDate } from "@/lib/dateConvertes"
import { createSingleSiswa } from "@/lib/model/siswaModel"
import { faAngleDown, faArrowLeftLong, faRecycle, faSave, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const siswaFormat = {
    kelas: '',
    nama_siswa: '',
    nis: '',
    nisn: '',
    nik: '',
    no_kk: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    agama: '',
    status_dalam_keluarga: '',
    anak_ke: '',
    alamat: '',
    no_hp_siswa: '',
    asal_sekolah: '',
    kategori: '',
    tahun_masuk: '',
    nama_ayah: '',
    nama_ibu: '',
    telp_ortu: '',
    pekerjaan_ayah: '',
    pekerjaan_ibu: '',
    aktif: ''
}

const mySwal = withReactContent(Swal)

export default function DataSiswaNewPage() {
    const [formData, setFormData] = useState(siswaFormat)
    const [kelasForm, setKelasForm] = useState(['X', 'TKJ', '1'])
    const router = useRouter()

    const submitForm = e => {
        e.preventDefault()

        mySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menambahkan data baru',
            confirmButtonText: 'Ya',
            showCancelButton: true,
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed){
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    allowOutsideClick: false,
                    timer: 10000,
                    showConfirmButton: false,
                    didOpen: async () => {
                        const newFormData = {...formData, kelas: `${kelasForm[0]} ${kelasForm[1]} ${kelasForm[2]}`}
                        const result = await createSingleSiswa(newFormData)
                        if(result.success) {
                            mySwal.fire({
                                title: 'Berhasil memproses data!',
                                text: 'Anda berhasil menambahkan data siswa',
                                timer: 2000,
                                showConfirmButton: false,
                            }).finally(() => {
                                router.push('/data/siswa')
                            })
                        }else{
                            mySwal.fire({
                                title: 'Gagal memproses data!',
                                text: 'Tampaknya ada error disaat menambahkan data, silahkan coba lagi beberapa saat',
                                timer: 2000,
                                showConfirmButton: false
                            })
                        }
                    }
                })
            }
        })
    }

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
                    <form onSubmit={submitForm} className="grid grid-cols-2 divide-x divide-dashed">
                        <div className="w-full pr-5 space-y-3">
                            <h1 className="px-2 py-1 rounded-full text-xs font-bold text-white bg-zinc-800 w-fit">
                                Data Pribadi
                            </h1>
                            <div className="text-sm font-semibold space-y-5">
                                <div className="grid grid-cols-3 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Kelas</h1>
                                        <select onChange={e => setKelasForm(state => [e.target.value, state[1], state[2]])} className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="X" >X</option>
                                            <option value="XI" >XI</option>
                                            <option value="XII" >XII</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Rombel</h1>
                                        <select onChange={e => setKelasForm(state => [state[0], e.target.value, state[2]])} className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Pekerjaan Ayah --</option>
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
                                        <select onChange={e => setKelasForm(state => [state[0], state[1], e.target.value])} className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Pilih Kelas --</option>
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
                                        <input required value={formData.nik} onChange={e => setFormData(state => ({...state, nik: e.target.value}))} type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan No Induk Kependudukan" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">No Kartu Keluarga</h1>
                                        <input required value={formData.no_kk} onChange={e => setFormData(state => ({...state, no_kk: e.target.value}))} type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan No Kartu Keluarga" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xs">Nama Panjang</h1>
                                    <input required value={formData.nama_siswa} onChange={e => setFormData(state => ({...state, nama_siswa: e.target.value}))} type="text" className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Nama Panjang" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Tanggal Lahir</h1>
                                        <input type="date" required value={dateToIso(formData.tanggal_lahir)} onChange={e => setFormData(state => ({...state, tanggal_lahir: isoToDate(e.target.value)}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Tanggal Lahir" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Tempat Lahir</h1>
                                        <input type="text" required value={formData.tempat_lahir} onChange={e => setFormData(state => ({...state, tempat_lahir: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Tempat Lahir" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Jenis Kelamin</h1>
                                        <select required value={formData.jenis_kelamin} onChange={e => setFormData(state => ({...state, jenis_kelamin: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Jenis Kelamin --</option>
                                            <option value="Laki Laki">Laki Laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Agama</h1>
                                        <select required value={formData.agama} onChange={e => setFormData(state => ({...state, agama: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Agama --</option>
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
                                        <select required value={formData.status_dalam_keluarga} onChange={e => setFormData(state => ({...state, status_dalam_keluarga: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="Anak Kandung">Anak Kandung</option>
                                            <option value="Anak Angkat">Anak Angkat</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Anak Ke - </h1>
                                        <select required value={formData.anak_ke} onChange={e => setFormData(state => ({...state, anak_ke: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium">
                                            <option value="" disabled>-- Anak Ke --</option>
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
                                    <input type="text" required value={formData.alamat} onChange={e => setFormData(state => ({...state, alamat: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Alamat" />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xs">No Handphone Siswa</h1>
                                    <input type="text" required value={formData.no_hp_siswa} onChange={e => setFormData(state => ({...state, no_hp_siswa: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan No Handphone Siswa" />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xs">Asal Sekolah</h1>
                                    <input type="text" required value={formData.asal_sekolah} onChange={e => setFormData(state => ({...state, asal_sekolah: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Asal Sekolah" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Tahun Masuk</h1>
                                        <input type="text" required value={formData.tahun_masuk} onChange={e => setFormData(state => ({...state, tahun_masuk: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Tahun Masuk Siswa" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Kategori</h1>
                                        <select required value={formData.kategori} onChange={e => setFormData(state => ({...state, kategori: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium">
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
                                        <input type="text" required value={formData.nisn} onChange={e => setFormData(state => ({...state, nisn: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan NISN" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">NIS</h1>
                                        <input type="text" required value={formData.nis} onChange={e => setFormData(state => ({...state, nis: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan NISN" />
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
                                    <input type="text" required value={formData.telp_ortu} onChange={e => setFormData(state => ({...state, telp_ortu: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Telp Orang Tua" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Nama Ayah</h1>
                                        <input type="text" required value={formData.nama_ayah} onChange={e => setFormData(state => ({...state, nama_ayah: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Nama Ayah" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Pekerjaan Ayah</h1>
                                        <select required value={formData.pekerjaan_ayah} onChange={e => setFormData(state => ({...state, pekerjaan_ayah: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium">
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
                                        <input type="text" required value={formData.nama_ibu} onChange={e => setFormData(state => ({...state, nama_ibu: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium" placeholder="Masukkan Nama Ayah" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs">Pekerjaan Ibu</h1>
                                        <select required value={formData.pekerjaan_ibu} onChange={e => setFormData(state => ({...state, pekerjaan_ibu: e.target.value}))} className="px-2 py-1 rounded border outline-none w-full font-medium">
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
                            <div className="mt-5 flex items-center justify-center gap-5">
                                <button type="submit" className="w-1/3 px-2 py-1 rounded bg-green-400 hover:bg-green-500 focus:bg-green-600 text-white font-bold flex items-center justify-center gap-3 text-sm transition-all duration-300 hover:scale-95 focus:scale-95 hover:shadow-lg focus:shadow-lg">
                                    <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                    Simpan Data
                                </button>
                                <button type="button" onClick={() => setFormData(siswaFormat)} className="w-1/3 px-2 py-1 rounded bg-zinc-400 hover:bg-zinc-500 focus:bg-zinc-600 text-zinc-800 font-bold flex items-center justify-center gap-3 text-sm transition-all duration-300 hover:scale-95 focus:scale-95 hover:shadow-lg focus:shadow-lg">
                                    <FontAwesomeIcon icon={faRecycle} className="w-4 h-4 text-inherit" />
                                    Bersihkan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayoutPage>
    )
}