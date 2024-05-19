'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta, mont, open, rale } from "@/config/fonts"
import { exportToCSV } from "@/lib/csvLibs"
import { createMutasiSiswa } from "@/lib/model/mutasiSiswaModel"
import { deleteMultiSiswaByNis, deleteSingleSiswaByNis, getAllSiswa, naikkanKelasSiswa, updateBulkSiswa } from "@/lib/model/siswaModel"
import { exportToXLSX } from "@/lib/xlsxLibs"
import { faAngleDoubleUp, faAngleLeft, faAngleRight, faAngleUp, faAnglesUp, faArrowDown, faArrowUp, faArrowsUpDown, faCircle, faCircleArrowDown, faCircleArrowUp, faCircleCheck, faCircleXmark, faClockRotateLeft, faDownload, faEdit, faEllipsis, faEllipsisH, faExclamationCircle, faEye, faFile, faFilter, faInfoCircle, faMale, faPlus, faPlusSquare, faPrint, faSave, faSearch, faSpinner, faTrash, faUpload, faWandMagicSparkles, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

let listNoRombel = [];
let listKelas = []
let listRombel = []

const exportKolom = {
    kelas: 'Kelas',
    rombel: 'Jurusan',
    no_rombel: 'Rombel',
    nama_siswa: 'Nama Siswa',
    nis: 'NIS',
    nisn: 'NISN',
    nik: 'NIK',
    no_kk: 'No KK',
    tempat_lahir: 'Tempat Lahir',
    tanggal_lahir: 'Tanggal Lahir',
    jenis_kelamin: 'Jenis Kelamin',
    agama: 'Agama',
    status_dalam_keluarga: 'Status Dalam Keluarga',
    anak_ke: 'Anak Ke',
    alamat: 'Alamat',
    no_hp_siswa: 'No HP Siswa',
    asal_sekolah: 'Asal Sekolah',
    kategori: 'Kategori',
    tahun_masuk: 'Tahun Masuk',
    nama_ayah: 'Nama Ayah',
    nama_ibu: 'Nama Ibu',
    telp_ortu: 'Telp Ortu',
    pekerjaan_ayah: 'Pekerjaan Ayah',
    pekerjaan_ibu: 'Pekerjaan Ibu'
  }

const mySwal = withReactContent(Swal)
export default function DataSiswaMainPage() {
    const router = useRouter();
    const [siswaList, setSiswaList] = useState([])
    const [filteredSiswaList, setFilteredSiswaList] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')
    const [kelas, setKelas] = useState('')
    const [rombel, setRombel] = useState('')
    const [noRombel, setNoRombel] = useState('')
    const [status, setStatus] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [searchCriteria, setSearchCriteria] = useState('nama_siswa')
    const [selectedSiswa, setSelectedSiswa] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [kriteriaNaikKelas, setKriteriaNaiKelas] = useState('');
    const [siswaTidakNaikKelas, setSiswaTidakNaikKelas] = useState([])
    const [showSelected, setShowSelected] = useState(false)
    const [sorting, setSorting] = useState({nama_siswa: '', tahun_masuk: ''})
    const [exportExcel, setExportExcel] = useState({
        allKolom: true, kolomDataArr: []
    })

    const getSiswa = async () => {
        setLoadingFetch('loading');
        const data = await getAllSiswa()
        setSiswaList(data)
        setFilteredSiswaList(data)
        
        // Get all No Rombel
        data.filter(({no_rombel}) => {
            if(!listNoRombel.includes(no_rombel)) {
                listNoRombel.push(no_rombel)
            }
        })

        // Get all Kelas
        data.filter(({kelas}) => {
            if(!listKelas.includes(kelas)) {
                listKelas.push(kelas)
            }
        })

        // Get all rombel
        data.filter(({rombel}) => {
            if(!listRombel.includes(rombel)) {
                listRombel.push(rombel)
            }
        })

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
        let updatedFilter = siswaList
        
        // Search Kelas
        if(kelas !== '') {
            updatedFilter = updatedFilter.filter(siswa => siswa.kelas == kelas)
        }

        // Search Rombel
        updatedFilter = updatedFilter.filter(siswa => siswa.rombel.toLowerCase().includes(rombel.toLowerCase()))

        // Search NO Rombel
        updatedFilter = updatedFilter.filter(siswa => siswa.no_rombel.toLowerCase().includes(noRombel.toLowerCase()))
        
        // Search Status
        updatedFilter = updatedFilter.filter(siswa => siswa['aktif'].includes(status))
        
        // Search Value and Kriteria
        updatedFilter = updatedFilter.filter(siswa => siswa[searchCriteria].toLowerCase().includes(searchValue.toLowerCase()))

        // Search Only Selected
        if(showSelected) {
            updatedFilter = updatedFilter.filter(siswa => selectedSiswa.includes(siswa.nis))
            const maxPagination = Math.ceil(updatedFilter.length / totalList)
            setPagination(maxPagination > 0 ? maxPagination - maxPagination + 1 : 1)
        }
        
        let sortedFilter = [];
        // Sorting
        if(sorting.nama_siswa !== '') {
            sortedFilter = updatedFilter.sort((a, b) => {
                if(sorting.nama_siswa === 'asc') {
                    if (a.nama_siswa < b.nama_siswa) return -1;
                    if (a.nama_siswa > b.nama_siswa) return 1;
                    return 0;
                }
                
                if(sorting.nama_siswa === 'dsc') {
                    if (a.nama_siswa < b.nama_siswa) return 1;
                    if (a.nama_siswa > b.nama_siswa) return -1;
                    return 0;
                }
            })
        }

        if(sorting.tahun_masuk !== '') {
            sortedFilter = updatedFilter.sort((a, b) => {
                if(sorting.tahun_masuk === 'asc') {
                    if (a.tahun_masuk < b.tahun_masuk) return -1;
                    if (a.tahun_masuk > b.tahun_masuk) return 1;
                    return 0;
                }
                
                if(sorting.tahun_masuk === 'dsc') {
                    if (a.tahun_masuk < b.tahun_masuk) return 1;
                    if (a.tahun_masuk > b.tahun_masuk) return -1;
                    return 0;
                }
            })
        }

        updatedFilter = sortedFilter.length > 0 ? sortedFilter : updatedFilter

        setFilteredSiswaList(updatedFilter)
    }

    const handleSubmitMutasi = async (event, modal, payload) => {
        event.preventDefault()

        document.getElementById(modal).close()
        console.log(event.target[0].value)
        console.log(new Date(event.target[0].value).toLocaleDateString('en-GB'))

        Swal.fire({
            title: "Sedang memproses data",
            text: 'Harap tunggu sebentar',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const {aktif, ...newObj} = payload
                const newData = {
                    ...newObj,
                    tanggal_keluar: event.target[0].value !== '' ? `${new Date(event.target[0].value).toLocaleDateString('en-GB')}` : `${new Date().toLocaleDateString('en-GB')}`,
                    tahun_keluar: event.target[0].value !== '' ? `${new Date(event.target[0].value).toLocaleDateString('en-GB').split('/')[2]}` : `${new Date().toLocaleDateString('en-GB').split('/')[2]}`,
                    keterangan: event.target[1].value
                }

                const responseSiswa = await deleteSingleSiswaByNis(payload.nis)
                const responseMutasiSiswa = await createMutasiSiswa(newData)

                if(responseSiswa.success && responseMutasiSiswa.success) {
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Mutasi data siswa berhasil!',
                        icon: 'success'
                    }).then( async () => {
                        await getSiswa()
                    })
                }
            }
        })
        console.log(event.target[0].value)
        console.log(event.target[1].value)
    }

    const handleSelectAll = () => {
        if(selectAll) {
            setSelectAll(false)
            return setSelectedSiswa([])
        }else{
            setSelectAll(true)
            const filteredSiswa = filteredSiswaList.map(({nis}) => nis)
            return setSelectedSiswa(filteredSiswa)
        }
    }

    

    useEffect(() => {
        handleSubmitFilter()
    }, [kelas, rombel, noRombel, searchValue, searchCriteria, status, showSelected, sorting])

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

    const addSiswaTidakNaikKelas = (nama_siswa, kelas, rombel, no_rombel, nis) => {
        // Cari udah ada atau belum
        const isExist = siswaTidakNaikKelas.find(siswa => siswa.nis === nis);
        if(typeof(isExist) === 'undefined') {
            const newData = { nama_siswa, kelas, rombel, no_rombel, nis}
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

    const submitUpdateBersama = (e) => {
        e.preventDefault()

        const data = {
            kelas: e.target[0].value,
            no_rombel: e.target[1].value,
            tahun_masuk: e.target[2].value,
            rombel: e.target[3].value,
            status: e.target[4].value
        }
        
        const dataKeys = Object.keys(data)
        const newData = {}
        dataKeys.map(key => {
            if(data[key] !== '') {
                newData[key] = data[key]
            }
        })
        console.log(newData)

        mySwal.fire({
            title: 'Apakah anda yakin?',
            text: `Anda akan mengubah data sebanyak ${selectedSiswa.length} dengan data yang sama`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    text: 'Mohon tunggu sebentar lagi',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 15000,
                    didOpen: async () => {
                        const response = await updateBulkSiswa(selectedSiswa, newData)
                        if(response.success) {
                            mySwal.fire({
                                icon: 'success',
                                text: 'Berhasil mengubah data tersebut!',
                                title: 'Sukses'
                            }).then(() => {
                                setSelectedSiswa([])
                                getSiswa()
                            })
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                text: 'Gagal mengubah data tersebut, terdapat error!',
                                title: 'Error'
                            })
                        }
                    }
                })
            }
        })
        
    }

    const handleSorting = (key, otherKey) => {
        if(sorting[key] === '') {  
            return setSorting(state => ({...state, [key]: 'asc', [otherKey]: ''}))
        }
        if(sorting[key] === 'asc') {
            return setSorting(state => ({...state, [key]: 'dsc', [otherKey]: ''}))
        }
        if(sorting[key] === 'dsc') {
            return setSorting(state => ({...state, [key]: '', [otherKey]: ''}))
        }
    }

    const handleChangeExportExcel = (field, value) => {
        setExportExcel(prevState => {
            let updatedData = { ...prevState };

            if (Array.isArray(prevState[field])) {
                if (updatedData[field].some(kolom => kolom.key === value)) {
                    updatedData[field] = updatedData[field].filter(kolom => kolom.key !== value);
                } else {
                    updatedData[field] = [...updatedData[field], { key: value, keyName: exportKolom[value] }];
                }
            } else {
                updatedData[field] = value;
            }

            return updatedData;
        });
    }

    const submitExportExcel = async (type, modal) => {
        console.log(selectedSiswa)
        if(!exportExcel['allKolom'] && exportExcel['kolomDataArr'].length < 1 === true) {
            return toast.error('Anda harus memilih kolom data terlebih dahulu!')
        }
        
        document.getElementById(modal).close()
        
        let updatedData
        if(exportExcel['allKolom']) {
            if(type === 'xlsx') {
                if(selectedSiswa.length < 1) {
                    return await exportToXLSX(siswaList, 'Data Siswa', {
                        header: Object.keys(siswaList[0]),
                        sheetName: 'Sheet 1'
                    })
                }

                updatedData = siswaList.filter(siswa => selectedSiswa.includes(siswa.nis))
                return await exportToXLSX(updatedData, 'Data Siswa', {
                    header: Object.keys(updatedData[0]),
                    sheetName: 'Sheet 1'
                })
            }else{
                if(selectedSiswa.length < 1) {
                    return await exportToCSV(siswaList, 'Data Siswa', {
                        header: Object.keys(siswaList[0]),
                        sheetName: 'Sheet 1'
                    })
                }

                updatedData = siswaList.filter(siswa => selectedSiswa.includes(siswa.nis))
                return await exportToCSV(updatedData, 'Data Siswa', {
                    header: Object.keys(updatedData[0]),
                    sheetName: 'Sheet 1'
                })
            }
        }else{
            if(type === 'xlsx') {
                console.log(selectedSiswa.length)
                if(selectedSiswa.length < 1) {
                    updatedData = siswaList.map(obj => {
                        let newObj = {}
                        exportExcel['kolomDataArr'].forEach(({key}) => {
                            if(obj.hasOwnProperty(key)) {
                                newObj[key] = obj[key]
                            }
                        })
                        return newObj
                    })

                    return await exportToXLSX(updatedData, 'Data Siswa', {
                        header: Object.keys(updatedData[0]),
                        sheetName: 'Sheet 1'
                    })
                }else{
                    updatedData = siswaList.filter(siswa => selectedSiswa.includes(siswa.nis))
    
                    updatedData = updatedData.map(obj => {
                        let newObj = {}
                        exportExcel['kolomDataArr'].forEach(({key}) => {
                            if(obj.hasOwnProperty(key)) {
                                newObj[key] = obj[key]
                            }
                        })
                        return newObj
                    }) 
    
                    return await exportToXLSX(updatedData, 'Data Siswa', {
                        header: Object.keys(updatedData[0]),
                        sheetName: 'Sheet 1'
                    })
                }

            }else{
                if(selectedSiswa.length < 1) {
                    updatedData = siswaList.map(obj => {
                        let newObj = {}
                        exportExcel['kolomDataArr'].forEach(({key}) => {
                            if(obj.hasOwnProperty(key)) {
                                newObj[key] = obj[key]
                            }
                        })
                        return newObj
                    })

                    return await exportToCSV(updatedData, 'Data Siswa', {
                        header: Object.keys(updatedData[0]),
                        sheetName: 'Sheet 1'
                    })
                }

                updatedData = siswaList.filter(siswa => selectedSiswa.includes(siswa.nis))
                console.log(updatedData)

                updatedData = updatedData.map(obj => {
                    let newObj = {}
                    exportExcel['kolomDataArr'].forEach(({key}) => {
                        if(obj.hasOwnProperty(key)) {
                            newObj[key] = obj[key]
                        }
                    })
                    return newObj
                }) 

                return await exportToCSV(updatedData, 'Data Siswa', {
                    header: Object.keys(updatedData[0]),
                    sheetName: 'Sheet 1'
                })
            }
        }
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <hr className="my-1 md:my-2 opacity-0" />
            <div className="flex items-center md:gap-5 w-full justify-center md:justify-start gap-2">
                <a href="/data/siswa/new" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 dark:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 md:text-xl flex items-center justify-center gap-2`}>
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-inherit" />
                    Tambah Data
                </a>
                <a href="/data/siswa/new/import" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 dark:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 md:text-xl flex items-center justify-center gap-2`}>
                    <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                    Import Data
                </a>
            </div>
            <hr className="my-1 md:my-2 opacity-0" />
            <div className="p-5 rounded-2xl bg-zinc-50 md:bg-zinc-100 dark:bg-zinc-700/30 text-zinc-800">
                <div className="flex items-center gap-2 md:gap-5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-100/20 flex items-center justify-center text-orange-600">
                        <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-inherit" />
                    </div>
                    <h1 className="font-medium text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-900 to-zinc-800 dark:from-orange-600 dark:to-white">Filterisasi Data</h1>
                </div>
                <hr className="my-1 opacity-0" />
                <div className="flex md:flex-row flex-col gap-5">
                    <div className="w-full md:w-1/2 flex gap-2">
                        <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white dark:bg-zinc-700/50 dark:text-zinc-200 dark:border-zinc-500 text-xs md:text-sm cursor-pointer">
                            {listKelas.map((kelasItem, index) => (
                                <option key={index} value={kelasItem}>{kelasItem}</option>
                            ))}
                            <option value="">Semua Kelas</option>
                        </select>
                        <select value={rombel} onChange={e => setRombel(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white dark:bg-zinc-700/50 dark:text-zinc-200 dark:border-zinc-500 text-xs md:text-sm cursor-pointer">
                            {listRombel.map((namaRombel, index) => (
                                <option key={index} value={namaRombel}>{namaRombel}</option>
                            ))}
                            <option value="">Semua Jurusan</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/2 flex gap-2">
                        <select value={noRombel} onChange={e => setNoRombel(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white dark:bg-zinc-700/50 dark:text-zinc-200 dark:border-zinc-500 text-xs md:text-sm cursor-pointer">
                            {listNoRombel.map((no_rombel, index) => (
                                <option key={index} value={no_rombel}>{no_rombel}</option>
                            ))}
                            <option value="">Semua Rombel</option>
                        </select>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="w-1/2 px-2 py-1 rounded-xl border bg-white dark:bg-zinc-700/50 dark:text-zinc-200 dark:border-zinc-500 text-xs md:text-sm cursor-pointer">
                            <option value="aktif">Aktif</option>
                            <option value="tidak">Tidak Aktif</option>
                            <option value="">Semua Status</option>
                        </select>
                    </div>
                </div>
            </div>
            <hr className="my-2 opacity-0" />
            <div className="flex items-center gap-5 w-full">
                <input type="text" onChange={e => setSearchValue(e.target.value)} className=" bg-zinc-100 dark:bg-zinc-700/50 dark:text-zinc-200 dark:border-zinc-500 flex-grow md:flex-grow-0 md:w-80 px-3 py-2 text-xs md:text-lg rounded-xl border bg-transparent" placeholder="Cari data anda disini" />
                <select value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)}  className=" px-3 py-2 rounded-xl border text-xs md:text-lg bg-white dark:bg-zinc-700/50 dark:text-zinc-200 dark:border-zinc-500  cursor-pointer">
                    <option disabled>-- Kriteria --</option>
                    <option value="nama_siswa">Nama</option>
                    <option value="nisn">NISN</option>
                    <option value="nis">NIS</option>
                </select>
            </div>
            <hr className="my-2 opacity-0" />

            <div className="grid grid-cols-12 w-full  bg-blue-500 dark:bg-blue-900 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                    <input type="checkbox" checked={selectAll} onChange={() => handleSelectAll()} />
                    Nama
                    <button type="button" onClick={() => handleSorting('nama_siswa', 'tahun_masuk')} className="text-blue-400 w-5 h-5 flex items-center justify-center rounded  hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting.nama_siswa === '' ? faArrowsUpDown : (sorting.nama_siswa === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Kelas
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Tahun Masuk
                    <button type="button" onClick={() => handleSorting('tahun_masuk', 'nama_siswa')} className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting.tahun_masuk === '' ? faArrowsUpDown : (sorting.tahun_masuk === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
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
                    <div className="divide-y dark:divide-zinc-600">
                        {filteredSiswaList.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((siswa) => (
                            <div key={siswa.nis} className="grid grid-cols-12 w-full  hover:bg-zinc-100 dark:hover:bg-zinc-700/20 dark:divide-zinc-600 *:px-2 *:py-3 text-zinc-800 dark:text-zinc-200 font-medium text-xs divide-x">
                                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                                    <div className="flex-grow flex items-center gap-2">
                                        <input type="checkbox" checked={selectedSiswa.includes(siswa.nis) ? true : false} onChange={() => handleSelectedSiswa(siswa.nis)} />
                                        <button type="button" onClick={() => addSiswaTidakNaikKelas(siswa.nama_siswa, siswa.kelas, siswa.rombel, siswa.no_rombel, siswa.nis)} className="opacity-40 hover:opacity-100 w-4 h-4 flex-shrink-0 bg-zinc-800 dark:bg-zinc-700 text-white rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faArrowDown} className="w-2 h-2 text-inherit" />
                                        </button>
                                        {siswa.nama_siswa}
                                    </div>
                                    <button type="button" title="Mutasikan Siswa" onClick={() => document.getElementById(`${siswa.nama_siswa} - mutasi ${siswa.nis}`).showModal()} className="swap hover:swap-active focus:swap-active">
                                        <div className={`md:px-2 md:py-1 rounded-full ${siswa.status === 'aktif' ? 'swap-on' : 'swap-off'} bg-green-50 dark:bg-green-500/10 text-green-500 text-xs flex justify-center items-center`}>
                                            <span className="md:block hidden">Aktif</span>
                                            <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5 text-inherit block md:hidden opacity-50" />
                                        </div>
                                        <div className={`md:px-2 md:py-1 rounded-full ${siswa.status !== 'aktif' ? 'swap-on' : 'swap-off'} bg-red-50 dark:bg-red-500/10 text-red-500 text-xs flex justify-center items-center`}>
                                            <span className="md:block hidden">Nonaktif</span>
                                            <FontAwesomeIcon icon={faCircleXmark} className="w-5 h-5 text-inherit block md:hidden opacity-50" />
                                        </div>
                                    </button>
                                    <dialog id={`${siswa.nama_siswa} - mutasi ${siswa.nis}`} className="modal">
                                        <div className="modal-box bg-white dark:bg-zinc-800">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <form onSubmit={e => handleSubmitMutasi(e, `${siswa.nama_siswa} - mutasi ${siswa.nis}`, siswa)}>
                                                <h3 className="font-bold md:text-lg">Mutasikan <span className="bg-zinc-100 dark:bg-zinc-700 rounded-full font-normal tracking-tighter px-2 py-1">{siswa.nama_siswa}</span> </h3>
                                                <hr className="mt-3 opacity-0" />
                                                <div className="space-y-2">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                        <p className="w-full md:w-2/5 md:text-sm opacity-50">
                                                            Tanggal Keluar
                                                        </p>
                                                        <input type="date" className="w-full md:w-3/5 border rounded-lg px-2 py-1 md:text-sm bg-white dark:bg-zinc-700/50 dark:border-zinc-500" />
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                        <p className="w-full md:w-2/5 md:text-sm opacity-50">
                                                            Keterangan
                                                        </p>
                                                        <input type="text" className="w-full md:w-3/5 border rounded-lg px-2 py-1 md:text-sm bg-white dark:bg-zinc-700/50 dark:border-zinc-500" />
                                                    </div>
                                                </div>
                                                <p className="py-4 md:text-sm">Apakah anda yakin?</p>
                                                <div className="flex w-full md:w-fit gap-2 md:items-center md:justify-start">
                                                    <button type="submit" className="p-2 rounded-full bg-green-700 hover:shadow-lg hover:bg-green-600 text-white flex items-center justify-center gap-2">
                                                        <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                                        Ya, Saya Yakin
                                                    </button>
                                                    <button type="button" onClick={() => document.getElementById(`${siswa.nama_siswa} - mutasi ${siswa.nis}`).close()} className="p-2 rounded-full bg-red-700 hover:shadow-lg hover:bg-red-600 text-white flex items-center justify-center gap-2">
                                                        <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                                        Tidak
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </dialog>
                                </div>
                                <div className="hidden md:flex items-center col-span-2">
                                    {siswa.kelas} {siswa.rombel} {siswa.no_rombel}
                                </div>
                                <div className="hidden md:flex items-center col-span-2 gap-3">
                                    {siswa.tahun_masuk}
                                </div>
                                <div className={`${mont.className} hidden md:flex items-center col-span-2 gap-1`}>
                                    <p className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700/50">
                                        {siswa.nis}
                                    </p>
                                    <p className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700/50">
                                        {siswa.nisn}
                                    </p>
                                </div>
                                <div className="flex justify-center items-center  col-span-4 md:col-span-2 gap-1 md:gap-2">
                                    <a href={`/data/siswa/nis/${siswa.nis}`} className="w-6 h-6 flex items-center justify-center  text-white bg-blue-600 hover:bg-blue-800" title="Informasi lebih lanjut">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </a>
                                    <button type="button" onClick={() => deleteSingle(siswa.nis)} className="w-6 h-6 flex items-center justify-center  text-white bg-red-600 hover:bg-red-800" title="Hapus data siswa ini?">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <a href={`/data/siswa/update/${siswa.nis}`} className="w-6 h-6 flex items-center justify-center  text-white bg-amber-600 hover:bg-amber-800" title="Ubah data siswa ini">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full flex justify-center items-center gap-2 my-3">
                    <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-zinc-400 dark:text-zinc-200" />
                    <h1 className="text-zinc-400">Data kosong</h1>
                </div>
            ))}

            <div className="w-full flex md:items-center md:justify-between px-2 py-1 flex-col md:flex-row border-y border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700/10">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium dark:text-zinc-400">
                            {selectedSiswa.length} Data terpilih
                        </p>
                        <button type="button" onClick={() => deleteSelectedSiswa()} className={`w-7 h-7 ${selectedSiswa && selectedSiswa.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 hover:bg-zinc-200 text-zinc-500 focus:bg-red-200 dark:focus:bg-red-500/10 focus:text-red-700`}>
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                        </button>
                        <button type="button" onClick={() => setShowSelected(state => !state)} className={`w-7 h-7 flex items-center justify-center rounded-lg   ${showSelected ? 'bg-blue-200 dark:bg-blue-500/10 text-blue-700 hover:bg-blue-300 dark:hover:bg-blue-500/30' : 'text-zinc-500 bg-zinc-100 dark:bg-zinc-700/50 hover:bg-zinc-200 dark:hover:bg-zinc-700'} group transition-all duration-300`}>
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                        <button type="button" onClick={() => setSelectedSiswa([])} className={`w-7 h-7 ${selectedSiswa && selectedSiswa.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg  group transition-all duration-300 bg-zinc-100 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:text-zinc-400 hover:bg-zinc-200`}>
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                    </div>
                    <div className=" dropdown dropdown-hover dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 hover:bg-zinc-300 flex items-center justify-center text-xs gap-2 dark:text-zinc-300 dark:hover:text-zinc-100">
                            <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                            Export
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white dark:bg-zinc-800 rounded-box w-fit">
                            <li>
                                <button type="button" onClick={() => document.getElementById('export_xlsx').showModal()} className="flex items-center justify-start gap-2 dark:text-zinc-200 dark:hover:bg-zinc-700/50">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    XLSX
                                </button>
                                <button type="button" onClick={() => document.getElementById('export_csv').showModal()} className="flex items-center justify-start gap-2 dark:text-zinc-200 dark:hover:bg-zinc-700/50">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-green-600" />
                                    CSV
                                </button>
                            </li>
                        </ul>
                        <dialog id="export_csv" className="modal">
                            <div className="modal-box dark:bg-zinc-800">
                                <form method="dialog">
                                    <button onClick={() => setExportExcel({allKolom: true, kolomDataArr: []})} className="btn btn-sm btn-circle btn-ghost absolute dark:text-white right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg dark:text-zinc-200">Export Data Excel CSV</h3>
                                <hr className="my-2 opacity-0" />
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <p className="w-full text-sm opacity-70 md:w-2/5 dark:text-zinc-200">
                                        Semua Kolom Data?
                                    </p>
                                    <div className="flex w-full items-center gap-5 md:w-3/5">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={exportExcel['allKolom']} onChange={() => setExportExcel(state => ({...state, ['allKolom']: !state['allKolom']}))} className="cursor-pointer" id="export_csv_semua_kolom" />
                                             <label htmlFor="export_csv_semua_kolom" className="text-sm cursor-pointer dark:text-zinc-200">Ya</label>
                                        </div>
                                    </div>
                                </div>
                                {exportExcel.allKolom === false && (
                                    <div className="">
                                        <hr className="my-1 opacity-0" />
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <p className="w-full text-sm opacity-70 md:w-2/5 dark:text-zinc-200">
                                                Kolom
                                            </p>
                                            <select onChange={e => handleChangeExportExcel('kolomDataArr', e.target.value)} className="w-full text-sm md:w-3/5 py-2 px-3 border rounded-lg cursor-pointer focus:border-zinc-500 dark:focus:border-zinc-600 hover:border-zinc-500 dark:hover:border-zinc-600 max-h-[100px]">
                                                {Object.keys(exportKolom).map((kolom, index) => (
                                                    <option key={index} value={kolom}>{exportKolom[kolom]}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <hr className="my-1 opacity-0" />
                                        <p className="text-sm opacity-70">
                                            Daftar Kolom Data
                                        </p>
                                        <div className="p-3 rounded-lg border w-full flex flex-wrap gap-1">
                                            {exportExcel.kolomDataArr.map((kolomData, index) => (
                                                <div key={`${index} - ${index}`} className="p-2 rounded bg-zinc-100 text-xs flex items-center justify-center gap-2 font-medium">
                                                    {kolomData['keyName']}
                                                    <button type="button" onClick={() => handleChangeExportExcel('kolomDataArr', kolomData.key)} className="flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-zinc-500 hover:text-zinc-700 focus:text-zinc-700" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <hr className="my-2 opacity-0" />
                                <p className={`${jakarta.className} text-sm`}>Apakah anda sudah yakin?</p>
                                <hr className="my-1 opacity-0" />
                                <div className="flex w-full md:w-fit gap-2 md:items-center md:justify-start">
                                    <button type="button" onClick={() => submitExportExcel('csv', 'export_csv')} className="p-2 rounded-full bg-green-700 hover:shadow-lg hover:bg-green-600 text-white flex items-center justify-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                        Ya, Saya Yakin
                                    </button>
                                    <button type="button" onClick={() => {document.getElementById(`export_csv`).close(); setExportExcel({allKolom: true, kolomDataArr: []})}} className="p-2 rounded-full bg-red-700 hover:shadow-lg hover:bg-red-600 text-white flex items-center justify-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                        Tidak
                                    </button>
                                </div>
                            </div>
                        </dialog>
                        <dialog id="export_xlsx" className="modal">
                            <div className="modal-box">
                                <form method="dialog">
                                    <button onClick={() => setExportExcel({allKolom: true, kolomDataArr: []})} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Export Data Excel</h3>
                                <hr className="my-2 opacity-0" />
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <p className="w-full text-sm opacity-70 md:w-2/5">
                                        Semua Kolom Data?
                                    </p>
                                    <div className="flex w-full items-center gap-5 md:w-3/5">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={exportExcel['allKolom']} onChange={() => setExportExcel(state => ({...state, ['allKolom']: !state['allKolom']}))} className="cursor-pointer" id="export_xlsx_semua_kolom" />
                                             <label htmlFor="export_xlsx_semua_kolom" className="text-sm cursor-pointer">Ya</label>
                                        </div>
                                    </div>
                                </div>
                                {exportExcel.allKolom === false && (
                                    <div className="">
                                        <hr className="my-1 opacity-0" />
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <p className="w-full text-sm opacity-70 md:w-2/5">
                                                Kolom
                                            </p>
                                            <select onChange={e => handleChangeExportExcel('kolomDataArr', e.target.value)} className="w-full text-sm md:w-3/5 py-2 px-3 border rounded-lg cursor-pointer focus:border-zinc-500 hover:border-zinc-500 max-h-[100px]">
                                                {Object.keys(exportKolom).map((kolom, index) => (
                                                    <option key={index} value={kolom}>{exportKolom[kolom]}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <hr className="my-1 opacity-0" />
                                        <p className="text-sm opacity-70">
                                            Daftar Kolom Data
                                        </p>
                                        <div className="p-3 rounded-lg border w-full flex flex-wrap gap-1">
                                            {exportExcel.kolomDataArr.map((kolomData, index) => (
                                                <div key={`${index} - ${index}`} className="p-2 rounded bg-zinc-100 text-xs flex items-center justify-center gap-2 font-medium">
                                                    {kolomData['keyName']}
                                                    <button type="button" onClick={() => handleChangeExportExcel('kolomDataArr', kolomData.key)} className="flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-zinc-500 hover:text-zinc-700 focus:text-zinc-700" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <hr className="my-2 opacity-0" />
                                <p className={`${jakarta.className} text-sm`}>Apakah anda sudah yakin?</p>
                                <hr className="my-1 opacity-0" />
                                <div className="flex w-full md:w-fit gap-2 md:items-center md:justify-start">
                                    <button type="button" onClick={() => submitExportExcel('xlsx', 'export_xlsx')} className="p-2 rounded-full bg-green-700 hover:shadow-lg hover:bg-green-600 text-white flex items-center justify-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                        Ya, Saya Yakin
                                    </button>
                                    <button type="button" onClick={() => {document.getElementById(`export_xlsx`).close(); setExportExcel({allKolom: true, kolomDataArr: []})}} className="p-2 rounded-full bg-red-700 hover:shadow-lg hover:bg-red-600 text-white flex items-center justify-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                        Tidak
                                    </button>
                                </div>
                            </div>
                        </dialog>
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
                        <select  value={totalList} onChange={e => handleTotalList(e.target.value)} className="cursor-pointer px-2 py-1 hover:bg-zinc-100 rounded bg-transparent">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
            <hr className="my-3 opacity-0" />
            <div className="md:p-5 mb-10 rounded-xl md:border border-zinc-400 flex flex-col md:flex-row gap-5 transition-all duration-300">
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
                    <select  value={kriteriaNaikKelas} onChange={e => setKriteriaNaiKelas(e.target.value)} className="w-full md:w-3/4 px-3 py-1 rounded-full border cursor-pointer bg-transparent">
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
                                    <div key={siswa} className="grid grid-cols-10 px-1 py-2  text-xs group">
                                        <p className="col-span-8 md:col-span-4 font-medium text-zinc-600 flex items-center gap-2">
                                            {siswa.nama_siswa}
                                            
                                        </p>
                                        <div className="col-span-2 hidden md:block font-medium text-zinc-600">
                                            {siswa.kelas} {siswa.rombel} {siswa.no_rombel}
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
                <form onSubmit={submitUpdateBersama} className="w-full md:w-1/2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-inherit" />
                        </div>
                        <h1 className={`${mont.className} font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-zinc-800`}>
                            Ubah Data Bersamaan
                        </h1>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className={`${selectedSiswa && selectedSiswa.length < 1 ? 'flex' : 'hidden'} items-center gap-3`}>
                        <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-zinc-300" />
                        <h1 className="text-zinc-500">Silahkan pilih data diatas terlebih dahulu.</h1>
                    </div>
                    <div className={`${selectedSiswa && selectedSiswa.length > 0 ? 'flex' : 'hidden'} gap-3 flex-col md:flex-row w-full`}>
                        <div className="w-full md:w-1/2 space-y-3">
                            <select defaultValue={''} name="kelas" className="w-full border px-3 py-1 rounded-full cursor-pointer bg-transparent">
                                <option value="" disabled>-- Pilih Kelas --</option>
                                <option value="X">X</option>
                                <option value="XI">XI</option>
                                <option value="XII">XII</option>
                            </select>
                            <select defaultValue={''} name="no_rombel" className="w-full border px-3 py-1 rounded-full cursor-pointer bg-transparent">
                                <option value="" disabled>-- Pilih No Rombel --</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                            <input type="number" name="tahun_masuk" className="w-full border px-3 py-1 rounded-full bg-transparent" placeholder="Tahun Masuk" />
                            <div className="flex w-full items-center gap-2">
                                <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-zinc-300" />
                                <h1 className="text-zinc-500 text-xs">Jangan di isi jika tidak ingin mengubah tahun masuk</h1>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-3">
                            <select defaultValue={''} name="rombel" className="w-full border px-3 py-1 rounded-full cursor-pointer bg-transparent">
                                <option value="" disabled>-- Pilih Rombel --</option>
                                <option value="TKJ">TKJ</option>
                                <option value="TITL">TITL</option>
                                <option value="GEO">GEO</option>
                                <option value="DPIB">DPIB</option>
                                <option value="TKR">TKR</option>
                                <option value="TPM">TPM</option>
                            </select>
                            <select defaultValue={''} name="status" className="w-full border px-3 py-1 rounded-full cursor-pointer bg-transparent">
                                <option value="" disabled>-- Pilih Status --</option>
                                <option value="aktif">Aktif</option>
                                <option value="tidak">Tidak Aktif</option>
                            </select>
                        </div>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className={`${selectedSiswa && selectedSiswa.length > 0 ? 'flex' : 'hidden'} items-center gap-3`}>
                        <button type="submit"  className="px-3 py-2 rounded-full bg-green-100 text-green-700 font-medium flex items-center justify-center gap-3 text-sm hover:bg-green-600 hover:text-white">
                            <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                            Simpan Perubahan
                        </button>
                        <button type="button" onClick={() => setSelectedSiswa([])}  className="px-3 py-2 rounded-full bg-zinc-100 text-zinc-700 font-medium md:hidden flex items-center justify-center gap-3 text-sm hover:bg-zinc-200 hover:text-zinc-800">
                            <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-inherit" />
                            Batalkan
                        </button>
                    </div>
                </form>
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