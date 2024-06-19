'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont } from "@/config/fonts"
import { model_getAlumniByNis, model_updateAlumni } from "@/lib/model/alumniModel"
import { getMutasiSiswa, updateMutasiSiswa } from "@/lib/model/mutasiSiswaModel"
import { getSiswaByNIS, updateSiswaByNIS } from "@/lib/model/siswaModel"
import { faAngleDown, faArrowLeft, faArrowLeftLong, faSave, faSpinner, faUpload, faUserEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const mySwal = withReactContent(Swal)

export default function DataMutasiSiswaEditPage({params}) {
    const [dataSiswa, setDataSiswa] = useState()
    const [formData, setFormData] = useState({});
    const [loadingState, setLoadingState] = useState('')
    const router = useRouter()

    const getDataSiswa = async (nis) => {
        setLoadingState('loading');
        const result = await getMutasiSiswa(nis);
        if(result.success) {
            setDataSiswa(result.data);
            setFormData(result.data)
            setLoadingState(state => state = 'data exist')
        }else{
            setLoadingState(state => state = 'data not exist')
        }
    }

    useEffect(() => {
        getDataSiswa(params.nis)
    }, [])

    const submitUpdate = (e) => {
        e.preventDefault()

        mySwal.fire({
            icon: 'question',
            title: 'Apakah anda yakin?',
            text: 'Anda akan menyimpan perubahan data tersebut.',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya'
        }).then(result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    allowOutsideClick: false,
                    timer: 10000,
                    didOpen: async () => {
                        const result = await updateMutasiSiswa(params.nis, formData);
                        if(result.success) {
                            mySwal.fire({
                                icon: 'success',
                                title: 'Proses data berhasil!',
                                text: 'Anda berhasil mengubah data tersebut!',
                                allowOutsideClick: false,
                                timer: 2000,
                                showConfirmButton: false
                            }).finally(async () => {
                                await getDataSiswa(params.nis)
                            })
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                title: 'Gagal memproses data!',
                                text: 'Tampaknya terdapat error, silahkan coba lagi!',
                                allowOutsideClick: false,
                                timer: 3000,
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
            <div className="">
                {loadingState === '' && (<Skeleton />)}
                {loadingState === 'loading' && (<LoadingFetch />)}
                {loadingState === 'data exist' && (
                    <form onSubmit={submitUpdate} className="mt-5">
                        <div className="flex md:justify-between md:items-center md:flex-row flex-col gap-5">
                            <div className="flex items-center gap-5 md:gap-5">
                                <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200">
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUserEdit} className="w-4 h-4 text-blue-600" />
                                    <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text dark:to-white">
                                        Ubah Informasi Siswa
                                    </h1>
                                </div>
                            </div>
                            <div className={`md:flex-row flex-col flex items-center gap-5 ${mont.className}`}>
                                <button type="submit" className="px-4 py-2 w-full md:w-fit flex items-center justify-center gap-3 text-green-700 bg-green-100 rounded-full hover:bg-green-200 dark:bg-green-500/10 dark:hover:bg-green-500/20" >
                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                        <hr className="my-3 opacity-0" />
                        <h1 className="text-3xl md:text-6xl dark:text-zinc-200">
                            {formData.nama_siswa}
                        </h1>
                        <hr className="my-3 opacity-0" />
                        <div className="flex gap-5 md:flex-row flex-col">
                            <div className="w-full space-y-3">
                                <h1 className="px-2 py-1 rounded-full text-xs font-bold text-white bg-zinc-800 w-fit">
                                    Data Pribadi
                                </h1>
                                <div className="text-sm font-semibold space-y-5">
                                    <div className="grid grid-cols-3 gap-5">
                                        <div className="space-y-1">
                                            <h1 className="text-xs  dark:text-zinc-500">Kelas</h1>
                                            <select value={formData['kelas']} onChange={e => setFormData(state => state = {...state, kelas: e.target.value})} className="px-2 py-1 rounded border w-full font-medium bg-white dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200 ">
                                                <option value="X" >X</option>
                                                <option value="XI" >XI</option>
                                                <option value="XII" >XII</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Rombel</h1>
                                            <select value={formData['rombel']} onChange={e => setFormData(state => state = {...state, rombel: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                                <option value="TKJ" >TKJ</option>
                                                <option value="GEO" >GEO</option>
                                                <option value="DPIB" >DPIB</option>
                                                <option value="TKR" >TKR</option>
                                                <option value="TKRO" >TKRO</option>
                                                <option value="TITL" >TITL</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">No Rombel</h1>
                                            <select value={formData['no_rombel']} onChange={e => setFormData(state => state = {...state, no_rombel: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                                <option value="1" >1</option>
                                                <option value="2" >2</option>
                                                <option value="3" >3</option>
                                                <option value="4" >4</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">No Induk Kependudukan</h1>
                                            <input type="text" value={formData.nik} onChange={e => setFormData(state => state = {...state, nik: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan No Induk Kependudukan" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">No Kartu Keluarga</h1>
                                            <input type="text" value={formData.no_kk} onChange={e => setFormData(state => state = {...state, no_kk: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan No Kartu Keluarga" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs dark:text-zinc-500">Nama Panjang</h1>
                                        <input type="text" value={formData.nama_siswa} onChange={e => setFormData(state => state = {...state, nama_siswa: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Nama Panjang" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Tanggal Lahir</h1>
                                            <input type="date" value={formData.tanggal_lahir} onChange={e => setFormData(state => state = {...state, tanggal_lahir: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Tanggal Lahir" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Tempat Lahir</h1>
                                            <input type="text" value={formData.tempat_lahir} onChange={e => setFormData(state => state = {...state, tempat_lahir: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Tempat Lahir" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Jenis Kelamin</h1>
                                            <select value={formData.jenis_kelamin} onChange={e => setFormData(state => state = {...state, jenis_kelamin: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                                <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                                <option value="Laki-Laki" >Laki Laki</option>
                                                <option value="Perempuan" >Perempuan</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Agama</h1>
                                            <select value={formData.agama} onChange={e => setFormData(state => state = {...state, agama: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
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
                                            <h1 className="text-xs dark:text-zinc-500">Status dalam Keluarga</h1>
                                            <select value={formData.status_dalam_keluarga} onChange={e => setFormData(state => state = {...state, status_dalam_keluarga: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                                <option value="" disabled>-- Pilih Status Keluarga --</option>
                                                <option value="Anak Kandung">Anak Kandung</option>
                                                <option value="Anak Angkat">Anak Angkat</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Anak Ke - </h1>
                                            <select value={formData.anak_ke} onChange={e => setFormData(state => state = {...state, anak_ke: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
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
                                        <h1 className="text-xs dark:text-zinc-500">Alamat</h1>
                                        <input type="text" value={formData.alamat} onChange={e => setFormData(state => state = {...state, alamat: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Alamat" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs dark:text-zinc-500">No Handphone Siswa</h1>
                                        <input type="text" value={formData.no_hp_siswa} onChange={e => setFormData(state => state = {...state, no_hp_siswa: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan No Handphone Siswa" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs dark:text-zinc-500">Asal Sekolah</h1>
                                        <input type="text" value={formData.asal_sekolah} onChange={e => setFormData(state => state = {...state, asal_sekolah: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Asal Sekolah" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Tahun Masuk</h1>
                                            <input type="text" value={formData.tahun_masuk} onChange={e => setFormData(state => state = {...state, tahun_masuk: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Tahun Masuk Siswa" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Kategori</h1>
                                            <select value={formData.kategori} onChange={e => setFormData(state => state = {...state, kategori: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
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
                                            <h1 className="text-xs dark:text-zinc-500">NISN</h1>
                                            <input type="text" value={formData.nisn} onChange={e => setFormData(state => state = {...state, nisn: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan NISN" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">NIS</h1>
                                            <input type="text" value={formData.nis} onChange={e => setFormData(state => state = {...state, nis: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan NISN" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Tahun Keluar</h1>
                                            <input type="text" value={formData.tahun_keluar} onChange={e => setFormData(state => state = {...state, tahun_keluar: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Tahun Keluar" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Tanggal Keluar</h1>
                                            <input type="date" value={formData.tanggal_keluar} onChange={e => setFormData(state => state = {...state, tanggal_keluar: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Tanggal Keluar" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-xs dark:text-zinc-500">Keterangan</h1>
                                        <input type="text" value={formData.keterangan} onChange={e => setFormData(state => state = {...state, keterangan: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Tahun Keluar" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full space-y-3">
                                <h1 className="px-2 py-1 rounded-full text-xs dark:text-zinc-500 font-bold text-white bg-zinc-800 w-fit">
                                    Data Orang Tua
                                </h1>
                                <div className="text-sm font-semibold space-y-5">
                                    <div className="space-y-1">
                                        <h1 className="text-xs dark:text-zinc-500">Telp Orang Tua</h1>
                                        <input type="text" value={formData.telp_ortu} onChange={e => setFormData(state => state = {...state, telp_ortu: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Telp Orang Tua" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Nama Ayah</h1>
                                            <input type="text" value={formData.nama_ayah} onChange={e => setFormData(state => state = {...state, nama_ayah: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Nama Ayah" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Pekerjaan Ayah</h1>
                                            <select value={formData.pekerjaan_ayah} onChange={e => setFormData(state => state = {...state, pekerjaan_ayah: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
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
                                            <h1 className="text-xs dark:text-zinc-500">Nama Ibu</h1>
                                            <input type="text" value={formData.nama_ibu} onChange={e => setFormData(state => state = {...state, nama_ibu: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Masukkan Nama Ayah" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs dark:text-zinc-500">Pekerjaan Ibu</h1>
                                            <select value={formData.pekerjaan_ibu} onChange={e => setFormData(state => state = {...state, pekerjaan_ibu: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
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
                    </form>
                )}
            </div>
            <hr className="my-3 opacity-0" />
        </MainLayoutPage>
    )
}

function oldSection() {
    return (
        <form onSubmit={submitUpdate} className="md:p-5">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-5">
                                <button type="button" onClick={() => router.back()} className="flex items-center justify-center rounded border border-zinc-600 text-zinc-800 hover:bg-zinc-800 hover:text-white transition-all duration-300 hover:scale-95 focus:bg-zinc-800 focus:text-white focus:scale-95 text-sm w-6 h-6" title="Kembali ke sebelumnya">
                                    <FontAwesomeIcon icon={faArrowLeftLong} className="w-3 h-3 text-inherit" />
                                </button>
                                <h1 className="px-2 py-1 rounded-full bg-zinc-800 text-white font-bold text-sm">
                                    Mengubah Data Siswa
                                </h1>
                            </div>
                            <button type="submit" className="flex items-center gap-3 rounded px-2 py-1 bg-green-400 hover:bg-green-500 focus:bg-green-600 text-white font-bold text-sm">
                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                Simpan Data
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
                                                <select value={kelas[0]} onChange={e => setKelas(state => [e.target.value, state[1], state[2]])} className="px-2 py-1 rounded border bg-white w-full font-medium">
                                                    <option value="X" >X</option>
                                                    <option value="XI" >XI</option>
                                                    <option value="XII" >XII</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Rombel</h1>
                                                <select value={kelas[1]} onChange={e => setKelas(state => [state[0], e.target.value, state[2]])} className="px-2 py-1 rounded border bg-white w-full font-medium">
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
                                                <select value={kelas[2]} onChange={e => setKelas(state => [state[0], state[1], e.target.value])} className="px-2 py-1 rounded border bg-white w-full font-medium">
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
                                                <input type="text" value={formData.nik} onChange={e => setFormData(state => state = {...state, nik: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan No Induk Kependudukan" />
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">No Kartu Keluarga</h1>
                                                <input type="text" value={formData.no_kk} onChange={e => setFormData(state => state = {...state, no_kk: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan No Kartu Keluarga" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs">Nama Panjang</h1>
                                            <input type="text" value={formData.nama_siswa} onChange={e => setFormData(state => state = {...state, nama_siswa: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan Nama Panjang" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Tanggal Lahir</h1>
                                                <input type="date" value={formData.tanggal_lahir} onChange={e => setFormData(state => state = {...state, tanggal_lahir: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan Tanggal Lahir" />
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Tempat Lahir</h1>
                                                <input type="text" value={formData.tempat_lahir} onChange={e => setFormData(state => state = {...state, tempat_lahir: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan Tempat Lahir" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Jenis Kelamin</h1>
                                                <select value={formData.jenis_kelamin} onChange={e => setFormData(state => state = {...state, jenis_kelamin: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium">
                                                    <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                                    <option value="Laki-Laki" >Laki Laki</option>
                                                    <option value="Perempuan" >Perempuan</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Agama</h1>
                                                <select value={formData.agama} onChange={e => setFormData(state => state = {...state, agama: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium">
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
                                                <select value={formData.status_dalam_keluarga} onChange={e => setFormData(state => state = {...state, status_dalam_keluarga: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium">
                                                    <option value="" disabled>-- Pilih Status Keluarga --</option>
                                                    <option value="Anak Kandung">Anak Kandung</option>
                                                    <option value="Anak Angkat">Anak Angkat</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Anak Ke - </h1>
                                                <select value={formData.anak_ke} onChange={e => setFormData(state => state = {...state, anak_ke: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium">
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
                                            <input type="text" value={formData.alamat} onChange={e => setFormData(state => state = {...state, alamat: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan Alamat" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs">No Handphone Siswa</h1>
                                            <input type="text" value={formData.no_hp_siswa} onChange={e => setFormData(state => state = {...state, no_hp_siswa: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan No Handphone Siswa" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-xs">Asal Sekolah</h1>
                                            <input type="text" value={formData.asal_sekolah} onChange={e => setFormData(state => state = {...state, asal_sekolah: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Asal Sekolah" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Tahun Masuk</h1>
                                                <input type="text" value={formData.tahun_masuk} onChange={e => setFormData(state => state = {...state, tahun_masuk: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Tahun Masuk Siswa" />
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Kategori</h1>
                                                <select value={formData.kategori} onChange={e => setFormData(state => state = {...state, kategori: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium">
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
                                                <input type="text" value={formData.nisn} onChange={e => setFormData(state => state = {...state, nisn: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan NISN" />
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">NIS</h1>
                                                <input type="text" value={formData.nis} onChange={e => setFormData(state => state = {...state, nis: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan NISN" />
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
                                            <input type="text" value={formData.telp_ortu} onChange={e => setFormData(state => state = {...state, telp_ortu: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan Telp Orang Tua" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Nama Ayah</h1>
                                                <input type="text" value={formData.nama_ayah} onChange={e => setFormData(state => state = {...state, nama_ayah: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan Nama Ayah" />
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Pekerjaan Ayah</h1>
                                                <select value={formData.pekerjaan_ayah} onChange={e => setFormData(state => state = {...state, pekerjaan_ayah: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium">
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
                                                <input type="text" value={formData.nama_ibu} onChange={e => setFormData(state => state = {...state, nama_ibu: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium" placeholder="Masukkan Nama Ayah" />
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xs">Pekerjaan Ibu</h1>
                                                <select value={formData.pekerjaan_ibu} onChange={e => setFormData(state => state = {...state, pekerjaan_ibu: e.target.value})} className="px-2 py-1 rounded border bg-white w-full font-medium">
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
                    </form>
    )
}
function LoadingFetch() {
    return (
        <div className="mt-5">
            <div className="flex md:justify-between md:items-center md:flex-row flex-col gap-5">
                <div className="flex items-center gap-5 md:gap-5">
                    <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                    </button>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUserEdit} className="w-4 h-4 text-blue-600" />
                        <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text">
                            Ubah Informasi Siswa
                        </h1>
                    </div>
                </div>
                <div className={`md:flex-row flex-col flex items-center gap-5 ${mont.className}`}>
                    Loading..
                </div>
            </div>
        </div>
    )
}

function Skeleton() {
    return (
        <div className="p-5">
            <div className="flex items-center justify-between w-full">
                <div className="w-60 h-8 rounded bg-zinc-300 animate-pulse"></div>
                <div className="w-40 h-8 rounded bg-zinc-300 animate-pulse"></div>
            </div>
            <div className="mt-5">
                <div className="grid grid-cols-2 divide-x divide-x-dashed">
                    <div className="pr-5">
                        <div className="w-full h-screen bg-zinc-300 animate-pulse rounded"></div>
                    </div>
                    <div className="pl-5">
                        <div className="w-full h-screen bg-zinc-300 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
