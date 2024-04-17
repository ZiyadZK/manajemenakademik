'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, open, rale } from "@/config/fonts"
import { deleteMultiSiswaByNis, deleteSingleSiswaByNis, getAllSiswa, naikkanKelasSiswa } from "@/lib/model/siswaModel"
import { faAngleDoubleUp, faAngleLeft, faAngleRight, faAngleUp, faAnglesUp, faArrowDown, faArrowUp, faArrowsUpDown, faCircle, faCircleArrowDown, faCircleArrowUp, faCircleCheck, faClockRotateLeft, faDownload, faEdit, faEllipsis, faEllipsisH, faExclamationCircle, faFile, faFilter, faInfoCircle, faMale, faPlus, faPlusSquare, faPrint, faSave, faSearch, faSpinner, faTrash, faUpload, faWandMagicSparkles, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"


const mySwal = withReactContent(Swal)
export default function DataSiswaMainPage() {
    const router = useRouter();
    const [siswaList, setSiswaList] = useState([])
    const [filteredSiswaList, setFilteredSiswaList] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')
    const [kelas, setKelas] = useState(0)
    const [rombel, setRombel] = useState('All')
    const [noRombel, setNoRombel] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [searchCriteria, setSearchCriteria] = useState('nama_siswa')
    const [selectedSiswa, setSelectedSiswa] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [kriteriaNaikKelas, setKriteriaNaiKelas] = useState('');
    const [siswaTidakNaikKelas, setSiswaTidakNaikKelas] = useState([])

    const getSiswa = async () => {
        setLoadingFetch('loading');
        const data = await getAllSiswa()
        setSiswaList(data)
        setFilteredSiswaList(data)
        setLoadingFetch('fetched')
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
                            setSelectedSiswa(state => ([]))
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
        mySwal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: siswaTidakNaikKelas && siswaTidakNaikKelas.length > 0 ? 'Anda akan menaikkan semua kelas kecuali siswa yang terpilih' : 'Anda akan menaikkan semua kelas',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed){
                mySwal.fire({
                    title: 'Sedang memproses data',
                    allowOutsideClick: false,
                    timer: 20000,
                    showConfirmButton: false,
                    didOpen: async () => {
                        const response = await naikkanKelasSiswa(siswaTidakNaikKelas)
                        if(response.success) {
                            mySwal.fire({
                                icon: 'success',
                                title: 'Berhasil memproses data!',
                                text: 'Anda berhasil menaikkan semua kelas',
                                confirmButtonText: 'Baik',
                                timer: 5000
                            }).then(async () => {
                                await getSiswa()
                                setSiswaTidakNaikKelas([])
                            })
                        }else{
                            mySwal.fire({
                                title: 'Gagal memproses data!',
                                text: 'Tampaknya terdapat error disaat anda memproses data',
                                icon: 'error',
                                timer: 5000
                            })
                        }
                    }
                })
            }
        })
    }

    const addSiswaTidakNaikKelas = (nama_siswa, kelas, nis) => {
        // Cari udah ada atau belum
        const isExist = siswaTidakNaikKelas.find(siswa => siswa.nis === nis);
        if(typeof(isExist) === 'undefined') {
            const newData = { nama_siswa, kelas, nis}
            const updatedData = [...siswaTidakNaikKelas, newData]
            setSiswaTidakNaikKelas(updatedData)
            setKriteriaNaiKelas('beberapa')
        }else{
            toast.error(`Anda sudah menambahkan ${nama_siswa}!`);
        }

    }

    const removeSiswaTidakNaikKelas = (nis) => {
        const updatedData = siswaTidakNaikKelas.filter(siswa => siswa.nis !== nis);
        setSiswaTidakNaikKelas(updatedData)
    }

    useEffect(() => {
        if(kriteriaNaikKelas === 'semua') {
            setSiswaTidakNaikKelas([])
        }
    }, [kriteriaNaikKelas])

    const batalNaikKelas = () => {
        if(siswaTidakNaikKelas.length > 0) setSiswaTidakNaikKelas([])
        setKriteriaNaiKelas('') 
    }

    const handleTotalList = (value) => {
        // Cek kalau totalList melebihi Math Ceil
        const maxPagination = Math.ceil(siswaList.length / value)
        if(pagination > maxPagination) {
            setPagination(state => state = maxPagination)
        }
        setTotalList(value)

    }

    return (
        <MainLayoutPage>
            <Toaster />
            <hr className="my-1 md:my-2 opacity-0" />
            <div className="flex items-center md:gap-5 w-full justify-center md:justify-start gap-2">
                <a href="/data/siswa/new" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-inherit" />
                    Tambah Data
                </a>
                <a href="/data/siswa/new/import" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                    <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                    Import Data
                </a>
            </div>
            <hr className="my-1 md:my-2 opacity-0" />
            <div className="p-5 rounded-2xl bg-zinc-50 md:bg-zinc-100 text-zinc-800">
                <div className="flex items-center gap-2 md:gap-5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-inherit" />
                    </div>
                    <h1 className="font-medium text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-900 to-zinc-800">Filterisasi Data</h1>
                </div>
                <hr className="my-1 opacity-0" />
                <div className="flex md:flex-row flex-col gap-5">
                    <div className="w-full md:w-1/2 flex gap-2">
                        <select className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                            <option disabled>-- Kelas --</option>
                            <option value="X">10</option>
                            <option value="XI">11</option>
                            <option value="XII">12</option>
                        </select>
                        <select className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                            <option disabled>-- Rombel --</option>
                            <option value="TKJ">TKJ</option>
                            <option value="TITL">TITL</option>
                            <option value="GEO">GEO</option>
                            <option value="DPIB">DPIB</option>
                            <option value="TKR">TKR</option>
                            <option value="TPM">TPM</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/2 flex gap-2">
                        <select className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                            <option disabled>-- No Rombel --</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        <select className="w-1/2 px-2 py-1 rounded-xl border bg-white text-xs md:text-sm cursor-pointer">
                            <option disabled>-- Status --</option>
                            <option value="aktif">Aktif</option>
                            <option value="tidak aktif">Tidak Aktif</option>
                        </select>
                    </div>
                </div>
            </div>
            <hr className="my-2 opacity-0" />
            <div className="flex items-center gap-5 w-full">
                <input type="text" className=" bg-zinc-100 flex-grow md:flex-grow-0 md:w-80 px-3 py-2 text-xs md:text-lg rounded-xl border bg-transparent" placeholder="Cari data anda disini" />
                <select className=" px-3 py-2 rounded-xl border text-xs md:text-lg bg-white  cursor-pointer">
                    <option disabled>-- Kriteria --</option>
                    <option value="aktif">Nama</option>
                    <option value="tidak aktif">NISN</option>
                    <option value="tidak aktif">NIS</option>
                </select>
            </div>
            <hr className="my-2 opacity-0" />

            <div className="grid grid-cols-12 w-full  bg-blue-500 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                    <input type="checkbox" name="" id="" />
                    Nama
                    <button type="button" className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Kelas
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Tahun Masuk
                    <button type="button" className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    NIS/NISN
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit" />
                </div>
            </div>
            
            {loadingFetch === '' && <LoadingFetchSkeleton />}
            {loadingFetch === 'loading' && (
                <div className="flex w-full justify-center items-center gap-2 my-3">
                    <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 text-zinc-400 animate-spin" />
                    <h1 className="text-zinc-400">Sedang mendapatkan data..</h1>
                </div>
            )}

            {loadingFetch === 'fetched' && (siswaList.length > 0 ? (
                <div className="relative w-full h-fit max-h-[300px] overflow-auto">
                    <div className="divide-y">
                        {filteredSiswaList.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((siswa) => (
                            <div className="grid grid-cols-12 w-full  hover:bg-zinc-100 *:px-2 *:py-3 text-zinc-800 font-medium text-xs divide-x">
                                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                                    <div className="flex-grow flex items-center gap-2">
                                        <input type="checkbox" checked={selectedSiswa.includes(siswa.nis) ? true : false} onChange={() => handleSelectedSiswa(siswa.nis)} />
                                        <button type="button" onClick={() => addSiswaTidakNaikKelas(siswa.nama_siswa, siswa.kelas, siswa.nis)} className="opacity-40 hover:opacity-100 w-4 h-4 flex-shrink-0 bg-zinc-800 text-white rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faArrowDown} className="w-2 h-2 text-inherit" />
                                        </button>
                                        {siswa.nama_siswa}
                                    </div>
                                    <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 flex-shrink-0 text-green-600/50" />
                                </div>
                                <div className="hidden md:flex items-center col-span-2">
                                    {siswa.kelas}
                                </div>
                                <div className="hidden md:flex items-center col-span-2 gap-3">
                                    2024
                                </div>
                                <div className="hidden md:flex items-center col-span-2">
                                    12100065 / 12100065
                                </div>
                                <div className="flex justify-center items-center  col-span-4 md:col-span-2 gap-1 md:gap-2">
                                    <a href={`/data/siswa/nis/${siswa.nis}`} className="w-6 h-6 flex items-center justify-center rounded md:rounded-lg text-white bg-blue-600 hover:bg-blue-800" title="Informasi lebih lanjut">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </a>
                                    <button type="button" onClick={() => deleteSingle(siswa.nis)} className="w-6 h-6 flex items-center justify-center rounded md:rounded-lg text-white bg-red-600 hover:bg-red-800" title="Hapus data siswa ini?">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <a href={`/data/siswa/update/${siswa.nis}`} className="w-6 h-6 flex items-center justify-center rounded md:rounded-lg text-white bg-amber-600 hover:bg-amber-800" title="Ubah data siswa ini">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full flex justify-center items-center gap-2 my-3">
                    <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-zinc-400" />
                    <h1 className="text-zinc-400">Data kosong</h1>
                </div>
            ))}

            <div className="w-full flex md:items-center md:justify-between px-2 py-1 flex-col md:flex-row border-y border-zinc-300">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">
                            {selectedSiswa.length} Data terpilih
                        </p>
                    </div>
                    <div className=" dropdown dropdown-hover dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="px-3 py-1 rounded bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center text-xs gap-2">
                            <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                            Export
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-fit">
                            <li>
                                <button type="button" className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-red-600" />
                                    PDF
                                </button>
                                <button type="button" className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    XLSX
                                </button>
                                <button type="button" className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    CSV
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-full md:w-fit flex items-center justify-center divide-x mt-2 md:mt-0">
                    <p className={`${mont.className} px-2 text-xs`}>
                        {(totalList * pagination) - totalList + 1} - {(totalList * pagination) > siswaList.length ? siswaList.length : totalList * pagination} dari {siswaList.length} data
                    </p>
                    <div className={`${mont.className} px-2 text-xs flex items-center justify-center gap-3`}>
                        <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                        </button>
                        <p className="font-medium text-zinc-600">
                            {pagination}
                        </p>
                        <button type="button" onClick={() => setPagination(state => state < Math.ceil(siswaList.length / totalList) ? state + 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>
                    <div className={`${mont.className} px-2 text-xs`}>
                        <select defaultValue={totalList} onChange={e => handleTotalList(e.target.value)} className="cursor-pointer px-2 py-1 hover:bg-zinc-100 rounded">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
            <hr className="my-3 opacity-0" />
            <div className="md:p-5 rounded-xl md:border border-zinc-400 flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faAngleDoubleUp} className="w-4 h-4 text-inherit" />
                        </div>
                        <h1 className={`${mont.className} font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-zinc-800`}>
                            Kenaikan Kelas
                        </h1>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <select defaultValue={kriteriaNaikKelas} value={kriteriaNaikKelas} onChange={e => setKriteriaNaiKelas(e.target.value)} className="w-full md:w-3/4 px-3 py-1 rounded-full border cursor-pointer">
                        <option value="" disabled>-- Pilih Data --</option>
                        <option value="semua">Naikkan Semua Kelas</option>
                        <option value="beberapa">Naikkan Semua Kelas, kecuali..</option>
                    </select>
                    <hr className="my-2 opacity-0" />
                    {kriteriaNaikKelas === 'beberapa' && (
                        <>
                            <div className="grid grid-cols-10 px-1 py-2 border-y border-zinc-300 bg-zinc-50 text-xs">
                                <p className="col-span-8 md:col-span-4 font-medium text-zinc-600">
                                    Nama
                                </p>
                                <div className="col-span-2 hidden md:block font-medium text-zinc-600">
                                    Kelas
                                </div>
                                <div className="col-span-2 hidden md:block font-medium text-zinc-600">
                                    NIS
                                </div>
                                <div className="col-span-2  flex items-center justify-center"></div>
                            </div>
                            <div className={`${mont.className} divide-y relative overflow-auto w-full h-fit max-h-48`}>
                                {siswaTidakNaikKelas.map(siswa => (
                                    <div className="grid grid-cols-10 px-1 py-2  text-xs group">
                                        <p className="col-span-8 md:col-span-4 font-medium text-zinc-600 flex items-center gap-2">
                                            {siswa.nama_siswa}
                                            
                                        </p>
                                        <div className="col-span-2 hidden md:block font-medium text-zinc-600">
                                            {siswa.kelas}
                                        </div>
                                        <div className="col-span-2 hidden md:block font-medium text-zinc-600">
                                            {siswa.nis}
                                        </div>
                                        <div className="col-span-2  flex items-center justify-center gap-1">
                                            <a href={`/data/siswa/nis/${siswa.nis}`} target="_blank" className="w-5 h-5 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center hover:bg-blue-200 hover:text-blue-800 opacity-0 group-hover:opacity-100" title="Lihat detail">
                                                <FontAwesomeIcon icon={faSearch} className="w-2 h-2 text-inherit" />
                                            </a>
                                            <button type="button" onClick={() => removeSiswaTidakNaikKelas(siswa.nis)} className="w-5 h-5 rounded-full bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-zinc-800">
                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <hr className="my-2 opacity-0" />
                    <div className="flex items-center gap-5">
                        {kriteriaNaikKelas === 'semua' && (
                            <button type="button" onClick={() => naikKelasSemua()} className="px-3 py-2 rounded-full bg-green-100 text-green-700 font-medium flex items-center justify-center gap-3 text-sm hover:bg-green-600 hover:text-white">
                                <FontAwesomeIcon icon={faAnglesUp} className="w-4 h-4 text-inherit" />
                                Naikkan Kelas
                            </button>
                        )}
                        {kriteriaNaikKelas === 'beberapa'  && siswaTidakNaikKelas.length > 0 && (
                            <button type="button" onClick={() => naikKelasSemua()} className="px-3 py-2 rounded-full bg-green-100 text-green-700 font-medium flex items-center justify-center gap-3 text-sm hover:bg-green-600 hover:text-white">
                                <FontAwesomeIcon icon={faAnglesUp} className="w-4 h-4 text-inherit" />
                                Naikkan Kelas
                            </button>
                        )}
                        {kriteriaNaikKelas !== "" && (
                            <button type="button" onClick={() => batalNaikKelas()} className="px-3 py-2 rounded-full bg-zinc-100 text-zinc-400 font-medium flex items-center justify-center gap-3 text-sm hover:bg-zinc-200 hover:text-zinc-700">
                                <FontAwesomeIcon icon={faXmarkCircle} className="w-4 h-4 text-inherit" />
                                Batal
                            </button>
                        )}
                    </div>

                </div>
                <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-inherit" />
                        </div>
                        <h1 className={`${mont.className} font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-zinc-800`}>
                            Ubah Data Bersamaan
                        </h1>
                    </div>
                    <hr className="my-2 opacity-0" />
                    
                </div>
            </div>

        </MainLayoutPage>
    )
}

function LoadingFetchSkeleton() {
    return (
        <div className="grid grid-cols-12 w-full  hover:bg-zinc-100 *:px-2 *:py-3 text-zinc-800 font-medium text-xs divide-x my-2">
            <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center bg-zinc-600 rounded animate-pulse"></div>
            <div className="hidden md:flex items-center col-span-2 bg-zinc-600 rounded animate-pulse"></div>
            <div className="hidden md:flex items-center col-span-2 gap-3 bg-zinc-600 rounded animate-pulse"></div>
            <div className="hidden md:flex items-center col-span-2 bg-zinc-600 rounded animate-pulse"></div>
            <div className="flex justify-center items-center  col-span-4 md:col-span-2 gap-1 md:gap-2 bg-zinc-600 rounded animate-pulse"></div>
        </div>
    )
}