'use client'

import MainLayoutPage from "@/components/mainLayout"
import { deleteMultiSiswaByNis, deleteSingleSiswaByNis, getAllSiswa, naikkanKelasSiswa } from "@/lib/model/siswaModel"
import { faAngleLeft, faAngleRight, faAngleUp, faClockRotateLeft, faEdit, faEllipsis, faInfoCircle, faMale, faPlusSquare, faPrint, faSearch, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const mySwal = withReactContent(Swal)
export default function DataSiswaMainPage() {
    const router = useRouter();
    const [siswaList, setSiswaList] = useState([])
    const [filteredSiswaList, setFilteredSiswaList] = useState([])
    const [loadingFetch, setLoadingFetch] = useState(false)
    const [kelas, setKelas] = useState(0)
    const [rombel, setRombel] = useState('All')
    const [noRombel, setNoRombel] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [searchCriteria, setSearchCriteria] = useState('nama_siswa')
    const [selectedSiswa, setSelectedSiswa] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)

    const getSiswa = async () => {
        setLoadingFetch(state => state = true);
        const data = await getAllSiswa()
        setSiswaList(data)
        setFilteredSiswaList(data)
        setLoadingFetch(state => state = false)
    }

    useEffect(() => {
        getSiswa()
    }, [])

    const handleSelectedSiswa = (nis) => {
        if(!selectedSiswa.includes(nis)){
            const newData = [...selectedSiswa, nis]
            setSelectedSiswa(newData)
        }else{
            const newData = selectedSiswa.filter(item => item !== nis);
            setSelectedSiswa(newData)
        }
    }

    const handleSubmitFilter = () => {
        const valueFilterKelas = `${kelas != 0 ? kelas+' ' : ''}${rombel != 'All' ? rombel+' ' : ''}${noRombel != 0 ? noRombel : ''}`
        if(kelas === 0 && rombel === 'All' && noRombel === 0) {
            const newData = siswaList.filter(siswa => siswa[searchCriteria].toLowerCase().includes(searchValue.toLowerCase()))
            
            return setFilteredSiswaList(newData)
        }
        const newData = siswaList.filter(siswa => siswa['kelas'].includes(valueFilterKelas) && siswa[searchCriteria].toLowerCase().includes(searchValue.toLowerCase()))
        return setFilteredSiswaList(state => state = newData)
        
    }

    const handleSelectAll = () => {
        if(selectAll) {
            setSelectAll(false)
            return setSelectedSiswa([])
        }else{
            setSelectAll(true)
            const filteredSiswa = filteredSiswaList.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map(({nis}) => nis)
            return setSelectedSiswa(filteredSiswa)
        }
    }

    useEffect(() => {
        handleSubmitFilter()
    }, [kelas, rombel, noRombel, searchValue, searchCriteria])

    const deleteSingle = async (nis) => {
        mySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menghapus data tersebut!',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 10000,
                    didOpen: async () => {
                        const response = await deleteSingleSiswaByNis(nis)
                        if(response.success) {
                            await getSiswa()
                            mySwal.fire({
                                icon: 'success',
                                title: 'Berhasil memproses data!',
                                text: 'Anda berhasil menghapus data tersebut',
                                timer: 2000
                            })
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                title: 'Gagal memproses data!',
                                text: 'Tampaknya terdapat error, silahkan coba beberapa saat lagi!',
                                timer: 2000
                            })
                        }
                    }
                })
            }
        })
    }

    const deleteSelectedSiswa = () => {
        mySwal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan menghapus beberapa siswa yang sudah di seleksi',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya',
            allowOutsideClick: false
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 10000,
                    didOpen: async () => {
                        const response = await deleteMultiSiswaByNis(selectedSiswa)
                        if(response.success) {
                            setSelectedSiswa([])
                            mySwal.fire({
                                icon: 'success',
                                title: 'Berhasil memproses data!',
                                timer: 2000,
                            }).finally(async () => {
                                await getSiswa()
                            })
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                title: 'Gagal memproses data!',
                                timer: 2000
                            })
                        }
                    }
                })
            }
        })
    }

    const naikKelasSemua = async () => {
        await naikkanKelasSiswa()
    }

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
                    <select value={kelas} onChange={e => setKelas(e.target.value)} className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm hover:scale-95 transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800">
                        <option value="" disabled>-- Pilih Kelas --</option>
                        <option value={'X'}>Kelas 10</option>
                        <option value={'XI'}>Kelas 11</option>
                        <option value={'XII'}>Kelas 12</option>
                        <option value={0}>Semua Kelas</option>
                    </select>
                    <select value={rombel} onChange={e => setRombel(e.target.value)} className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm hover:scale-95 transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800">
                        <option value="" disabled>-- Pilih Jurusan --</option>
                        <option value="TKJ">TKJ</option>
                        <option value="DPIB">DPIB</option>
                        <option value="GEO">GEO</option>
                        <option value="TKRO">TKRO</option>
                        <option value="TKR">TKR</option>
                        <option value="TITL">TITL</option>
                        <option value="All">Semua Kelas</option>
                    </select>
                    <select value={noRombel} onChange={e => setNoRombel(e.target.value)} className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm hover:scale-95 transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800">
                        <option value="" disabled>-- No Rombel --</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={0}>Semua Rombel</option>
                    </select>
                    <div className="flex col-span-6 w-full items-center justify-end gap-5">
                        <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800" placeholder="Cari data disini" />
                        <select value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)} className="px-3 py-1 rounded border outline-none cursor-pointer col-span-2 text-sm hover:scale-95 transition-all duration-300 hover:border-zinc-600 focus:border-zinc-800">
                            <option value="" disabled>-- Kriteria --</option>
                            <option value="nis">NIS</option>
                            <option value="nisn">NISN</option>
                            <option value="nama_siswa">Nama</option>
                            <option value="nik">NIK</option>
                            <option value="no_hp_siswa">No Telp</option>   
                        </select>    
                    </div>
                </div>
                <div className="grid grid-cols-12 bg-zinc-800 text-white py-2 rounded mt-3 sticky top-0 text-sm">
                    <div className="col-span-3 px-2 flex items-center gap-3">
                        <input type="checkbox" checked={selectAll ? true : false} onChange={() => handleSelectAll()}  className="accent-orange-600 cursor-pointer outline-none" />
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
                    <div className="col-span-2 px-2">
                        No HP
                    </div>
                    <div className=" px-2">
                        Tahun
                    </div>
                    <div className="px-2">
                        Status
                    </div>
                    <div className="col-span-1 px-2 flex justify-center items-center">
                        <FontAwesomeIcon icon={faEllipsis} className="w-4 h-4 text-inherit" />
                    </div>
                </div>
                {loadingFetch === true && (
                    <div className="flex w-full justify-center gap-5 my-3">
                        <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 text-zinc-600 animate-spin" />
                        <p className="text-sm text-zinc-800">
                            Sedang loading..
                        </p>
                    </div>
                )}
                {siswaList.length === 0 && loadingFetch === false && (
                    <div className="flex w-full justify-center gap-5 my-3">
                        <p className="text-sm text-zinc-800">
                            Data kosong
                        </p>
                    </div>
                )}
                <div className="divide-y-2 my-1">
                    {filteredSiswaList.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((siswa) => (
                        <div className="grid grid-cols-12 text-sm transition-all duration-300 hover:bg-zinc-100">
                            <div className="py-2 w-full col-span-3 px-2 flex items-center gap-3">
                                <input type="checkbox" checked={selectedSiswa.includes(siswa.nis) ? true : false} onChange={() => handleSelectedSiswa(siswa.nis)} name="" id="" className="cursor-pointer " />
                                {siswa.nama_siswa}
                            </div>
                            <div className="py-2 w-full col-span-2 px-2">
                                {siswa.nis} / {siswa.nisn}
                            </div>
                            <div className="py-2 w-full  px-2">
                                {siswa.kelas}
                            </div>
                            <div className="p-2 ">
                                {siswa.jenis_kelamin}
                            </div>
                            <div className="p-2 col-span-2">
                                {siswa.no_hp_siswa}
                            </div>
                            <p className="p-2 ">
                                {siswa.tahun_masuk}
                            </p>
                            <p className="p-2">
                                {siswa.aktif === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                            </p>
                            <div className="col-span-1 flex w-full items-center justify-center gap-1">
                                <button type="button" onClick={() => router.push(`/data/siswa/update/${siswa.nis}`)} className="w-6 h-6 text-zinc-800 rounded bg-orange-400 hover:bg-orange-500 flex items-center justify-center" title="Ubah Data">
                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" onClick={() => router.push(`/data/siswa/nis/${siswa.nis}`)} className="w-6 h-6 text-zinc-800 rounded bg-blue-400 hover:bg-blue-500 flex items-center justify-center" title="Lihat lebih detail">
                                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" onClick={() => deleteSingle(siswa.nis)}  className="w-6 h-6 text-zinc-800 rounded bg-red-400 hover:bg-red-500 flex items-center justify-center" title="Hapus data">
                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rounded w-full flex items-center justify-between bg-zinc-800 py-2 text-white px-2 text-sm sticky bottom-0">
                    <div className="flex items-center gap-5">
                        <p>
                            <b>{selectedSiswa.length}</b> Item selected
                        </p>
                        {selectedSiswa.length > 0 && <button onClick={() => deleteSelectedSiswa()} type="button"  className="px-2 py-1 rounded bg-red-400 hover:bg-red-500 text-xs text-zinc-800 font-bold">
                            Hapus
                        </button>}
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-white">
                                Total <b>{siswaList.length}</b> items
                            </p>
                            <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-300">
                                <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                            </button>
                            <p>
                                {pagination}
                            </p>
                            <button type="button" onClick={() => setPagination(state => state = state + 1)}  className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-300">
                                <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                        <select value={totalList} onChange={e => setTotalList(e.target.value)} className="py-1 px-2 rounded outline-none border bg-zinc-700 cursor-pointer">
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
                <hr className="my-2 opacity-0" />
                <h1 className="w-fit px-2 py-1 rounded-full text-xs font-bold text-white bg-zinc-800">
                    Kenaikan Kelas
                </h1>
                <hr className="my-2 opacity-0" />
                <button type="button" onClick={() => naikKelasSemua()} className="px-2 py-1 rounded border border-zinc-800 text-zinc-800 font-bold flex items-center justify-center gap-2 text-sm hover:scale-95 focus:scale-95 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white transition-all duration-300 hover:shadow-lg focus:shadow-lg">
                    <FontAwesomeIcon icon={faAngleUp} className="w-3 h-3 text-inherit" />
                    Naikkan Semua Kelas
                </button>
            </div>
        </MainLayoutPage>
    )
}