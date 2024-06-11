'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faAngleLeft, faAngleRight, faArrowLeft, faCheck, faCircleCheck, faDownload, faEllipsisH, faEllipsisV, faExclamation, faExclamationCircle, faEye, faFile, faFileCircleCheck, faHeadphonesSimple, faSave, faSpinner, faTrash, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import Papa from 'papaparse'
import { useRouter } from "next/navigation"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { createMultiSiswa } from "@/lib/model/siswaModel"
import { mont } from "@/config/fonts"
import { formatFileSize } from "@/lib/formatFileSize"
import * as XLSX from 'xlsx'
import { exportToXLSX } from "@/lib/xlsxLibs"
import { exportToCSV } from "@/lib/csvLibs"
import { createMultiPegawai } from "@/lib/model/pegawaiModel"

const formatInputFile = {
    nama_pegawai: '',
    email_pegawai: '',
    jabatan: '',
    status_kepegawaian: '',
    nik: '',
    nip: '',
    nuptk: '',
    tmpt_lahir: '',
    tgl_lahir: '',
    tmt: '',
    pendidikan_terakhir: '',
    sekolah_pendidikan: '',
    sarjana_universitas: '',
    sarjana_fakultas: '',
    sarjana_prodi: '',
    magister_universitas: '',
    magister_fakultas: '',
    magister_prodi: '',
    sertifikat_pendidik: '',
    sertifikat_teknik: '',
    sertifikat_magang: '',
    sertifikat_asesor: '',
    keterangan: '',
    pensiun: ''
  }


const formatDataPribadi = ['nama_pegawai', 'email_pegawai', 'jabatan', 'status_kepegawaian', 'nip', 'nik', 'nuptk', 'tmpt_lahir', 'tgl_lahir', 'pensiun']
const formatDataPendidikan = ['tmt', 'pendidikan_terakhir', 'sekolah_pendidikan', 'sarjana_universitas', 'sarjana_fakultas', 'sarjana_prodi', 'magister_universitas', 'magister_fakultas', 'magister_prodi']
const formatDataSertifikat = ['sertifikat_pendidik', 'sertifikat_teknik', 'sertifikat_magang', 'sertifikat_asesor', 'keterangan']

const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const formatDataPegawai = ['id_pegawai', 'nama_pegawai', 'email_pegawai', 'jabatan', 'status_kepegawaian', 'nip', 'nuptk', 'tmpt_lahir', 'tgl_lahir', 'tmt', 'pendidikan_terakhir', 'sekolah_pendidikan', 'sarjana_universitas', 'sarjana_fakultas', 'sarjana_prodi', 'magister_universitas', 'magister_fakultas', 'magister_prodi', 'sertifikat_pendidik', 'sertifikat_teknik', 'sertifikat_magang', 'sertifikat_asesor', 'keterangan', 'pensiun']

const formatInformasiFile = {status: '', ekstensi: '', size: '', jumlahData: ''}
const mySwal = withReactContent(Swal)

export default function DataPegawaiNewImportPage() {
    const router = useRouter()
    const [file, setFile] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [data, setData] = useState([])
    const [totalList, setTotalList] = useState(10)
    const [pagination, setPagination] = useState(1);
    const [selectedPegawai, setSelectedPegawai] = useState([])
    const [informasiFile, setInformasiFile] = useState(formatInformasiFile)
    const [informasiKolom, setInformasiKolom] = useState(formatInputFile)
    const [namaSheet, setNamaSheet] = useState('')
    const [loadingReadFormat, setLoadingReadFormat] = useState('')
    const [listSheet, setListSheet] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const submitFile = async e => {
        e.preventDefault();

        // Cek udah di isi atau belum
        if(!file) {
            return toast.error('Harap masukkan file CSV / Excel terlebih dahulu!')
        }

        // Ambil Informasi File
        const fileName = file.name
        const fileExtension = fileName.split('.').pop()
        const fileSize = formatFileSize(file.size)
        setInformasiFile(state => ({...state, size: fileSize, ekstensi: fileExtension}))
        setLoadingReadFormat('loading')

        if(fileExtension === 'xlsx') {
            try {
                let checkedKolomDataArr = ''
                const response = await readXLSXFile(file)
                
                setInformasiFile(state => ({...state, jumlahData: response.data.length}))
                let updatedInformasiKolom = {}
                let kolomInputDataArr = typeof(response.data[0]) === 'undefined' ? [] : Object.keys(response.data[0])

                // Cek kolom yang cocok
                formatDataPegawai.filter(format => kolomInputDataArr.includes(format)).map(format => {
                    updatedInformasiKolom = {...updatedInformasiKolom, [format]: 'cocok'}
                })

                // Cek kolom yang tidak cocok
                formatDataPegawai.filter(format => kolomInputDataArr.includes(format) === false).map(format => {
                    updatedInformasiKolom = {...updatedInformasiKolom, [format]: 'tidak cocok'}
                    checkedKolomDataArr = 'tidak cocok'
                })

                setInformasiKolom(updatedInformasiKolom)
    
                setUploadedFile(state => state = file)
                if(checkedKolomDataArr === 'tidak cocok') {
                    setData([])
                    setFilteredData([])
                    setLoadingReadFormat('fetched')
                    return toast.error('Terdapat kolom yang tidak sesuai!')
                }
            
                setData(response.data)
                setFilteredData(response.data)
                setLoadingReadFormat('fetched')
                return toast.success('Berhasil mengimport file excel')
            } catch (error) {
                console.log(error)
                setUploadedFile(null)
                setData([])
                setFilteredData([])
                
                setLoadingReadFormat('fetched')
                return toast.error(error.message)
            }
        }

        // Cek file kalau file pakai CSV
        if(fileExtension === 'csv') {
            Papa.parse(file, {
                worker: true,
                header: true,
                complete: result => {
                    setInformasiFile(state => ({...state, jumlahData: result.data.length}))
                    let checkedKolomDataArr;

                    let updatedInformasiKolom = {}
                    let kolomInputDataArr = typeof(result.data[0]) === 'undefined' ? result.meta.fields : Object.keys(result.data[0])

                    // Cek kolom yang cocok
                    formatDataPegawai.filter(format => kolomInputDataArr.includes(format)).map(format => {
                        updatedInformasiKolom = {...updatedInformasiKolom, [format]: 'cocok'}
                    })

                    // Cek kolom yang tidak cocok
                    formatDataPegawai.filter(format => kolomInputDataArr.includes(format) === false).map(format => {
                        updatedInformasiKolom = {...updatedInformasiKolom, [format]: 'tidak cocok'}
                        checkedKolomDataArr = 'tidak cocok'
                    })

                    setInformasiKolom(updatedInformasiKolom)

                    setUploadedFile(state => state = file)

                    if(checkedKolomDataArr === 'tidak cocok') {
                        setLoadingReadFormat('fetched')
                        setData([])
                        setFilteredData([])
                        return toast.error('Terdapat kolom yang tidak sesuai!')
                    }

                    let updatedData = result.data.map(obj => {
                        if(obj.pensiun == 1) {
                            obj.pensiun = true
                        }else{
                            obj.pensiun = false
                        }
                        return obj
                    })

                    setData(updatedData)
                    setFilteredData(updatedData)
                    setLoadingReadFormat('fetched')
                    return toast.success('Berhasil mengimport file excel')
                },
                error: (error, file) => {
                    console.log(error)
                    console.log(file)
                    setData([])
                    setFilteredData([])
                    setLoadingReadFormat('fetched')
                    return toast.error('Terdapat Error')

                }
            })   
        }


    }

    const downloadFormatExample = async type => {
        if(type === 'xlsx') {
            return await exportToXLSX([], 'Format Data Pegawai', {
                header: formatDataPegawai,
                sheetName: 'Format XSLX'
            })
        }

        if(type === 'csv') {
            return await exportToCSV([], 'Format Data Pegawai', {
                header: formatDataPegawai,
                sheetName: 'Format CSV'
            })
        }
    }

    const readXLSXFile = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[namaSheet];
                const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                if(typeof(worksheet) === 'undefined') {
                    reject({
                        success: false,
                        message: 'Sheet tidak ada'
                    })
                }
    
                if (records.length > 1) {
                    // Ambil nama kolom dari baris pertama
                    const columns = records[0];
                    // Buat array objek dari baris-baris selanjutnya
                    const dataObjects = records.slice(1).map(row => {
                        const obj = {};
                        columns.forEach((column, index) => {
                            if(column === 'pensiun') {
                                obj[column] = row[index] === 1 ? true : false
                            }else{
                                obj[column] = typeof(row[index]) !== 'undefined' ? String(row[index]) : ''
                            }
                        });
                        return obj;
                    });
                    resolve({
                        success: true,
                        message: 'Sheet ditemukan',
                        data: dataObjects
                    })
                } else {
                    resolve({
                        success: true,
                        message: 'Sheet ditemukan',
                        data: []
                    });
                }
            };
    
            reader.onerror = reject;
    
            reader.readAsArrayBuffer(file);
        });
    }

    const getXLSXSheets = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                resolve(workbook.Sheets)
            };
    
            reader.onerror = reject;
    
            reader.readAsArrayBuffer(file);
        })
    }

    const submitData = async () => {
        mySwal.fire({
            icon: 'question',
            title: 'Apakah anda sudah yakin?',
            text: 'Anda akan menyimpan data import ke dalam data pegawai',
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
                        const response = await createMultiPegawai(data);
                        if(response.success) {
                            mySwal.fire({
                                icon: 'success',
                                title: 'Berhasil memproses data!',
                                text: 'Berhasil mengupload data import ke data pegawai!',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => router.push('/data/pegawai'));
                        }else{
                            mySwal.fire({
                                icon: 'error',
                                title: 'Gagal memproses data..',
                                text: 'Terdapat kendala disaat anda mengimport data ke data pegawai!',
                                timer: 2000,
                                allowOutsideClick: false
                            })
                        }
                        
                    }
                })
            }
        })
    }

    const addSelectedPegawai = (id) => {
        if(selectedPegawai.includes(id)) {
            const updatedData = selectedPegawai.filter(pegawaiId => pegawaiId !== id);
            setSelectedPegawai(updatedData)
        }else{
            const updatedData = [...selectedPegawai, id]
            setSelectedPegawai(updatedData)
        }
    }

    const deleteSelectedPegawai = () => {
        const updatedData = data.filter(pegawai => !selectedPegawai.includes(pegawai.id));
        setSelectedPegawai([])
        setData(updatedData)
        setFilteredData(updatedData)
    }

    const cancelImport = () => {
        setData([])
        setFilteredData([])
        setFile(null)
        setUploadedFile(null)
        setPagination(1)
        setTotalList(10)
        setSelectedPegawai([])
    }

    const handleChangeFile = async (file) => {
        if(file) {
            setFile(file)
    
            const fileName = file.name
            const fileExtension = fileName.split('.').pop()
            if(fileExtension === 'xlsx') {
                const sheets = await getXLSXSheets(file)
                setNamaSheet('')
                setListSheet(Object.keys(sheets))
            }
        }else{
            setListSheet([])
        }
    }

    const handleSearchFilter = (value) => {
        if(value === '') {
            return setFilteredData(data)
        }

        const updatedData = data.filter((pegawai, index, array) => 
            pegawai['nama_pegawai'].toLowerCase().includes(value.toLowerCase()) ||
            pegawai['kelas'].toLowerCase().includes(value.toLowerCase()) ||
            String(pegawai['tahun_masuk']).toLowerCase().includes(value.toLowerCase()) ||
            String(pegawai['nis']).toLowerCase().includes(value.toLowerCase()) ||
            String(pegawai['nisn']).toLowerCase().includes(value.toLowerCase())
        )
        console.log(updatedData)
        setFilteredData(updatedData)

    }

    const deleteSinglePegawai = (id_pegawai) => {
        const updatedData = data.filter(pegawai => pegawai.id_pegawai !== id_pegawai)
        setFilteredData(updatedData)
        setData(updatedData)
    }

    useEffect(() => {
        handleSearchFilter(searchValue)
    }, [searchValue])

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
                            Import Data Pegawai
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
                        <button type="button" onClick={() => downloadFormatExample('xlsx')} className="px-3 py-2 rounded-full bg-zinc-200 flex items-center justify-center gap-2 text-sm text-zinc-600 hover:bg-blue-100 hover:text-blue-600">
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
                        <button type="button" onClick={() => downloadFormatExample('csv')} className="px-3 py-2 rounded-full bg-zinc-200 flex items-center justify-center gap-2 text-sm text-zinc-600 hover:bg-blue-100 hover:text-blue-600">
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

                <form onSubmit={submitFile} className="flex items-center gap-5 flex-col md:flex-row">
                    <input type="file"  required onChange={e => handleChangeFile(e.target.files[0])} className=" border" />
                    {file && file.name.split('.').pop() === 'xlsx' && (
                        <select className="border rounded px-3 py-1 w-full md:w-fit" value={namaSheet} onChange={e => setNamaSheet(e.target.value)}>
                            <option value={''} disabled>-- Pilih Sheets --</option>
                            {listSheet.map((sheet, index) => (
                                <option key={`${sheet} - ${index}`} value={`${sheet}`}>{sheet}</option>
                            ))}
                        </select>
                    )}
                    <button type="submit" disabled={loadingReadFormat === 'loading' ? true : false} className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-teal-100 w-full md:w-fit text-teal-600 hover:bg-teal-200 hover:text-teal-800">
                        <FontAwesomeIcon icon={loadingReadFormat === 'loading' ? faSpinner : faUpload} className={`${loadingReadFormat === 'loading' && 'animate-spin'} w-3 h-3 text-inherit`} />
                        Upload
                    </button>
                </form>
                <div className="flex items-center gap-5 w-full">
                    {uploadedFile && (
                        <button type="button" onClick={() => document.getElementById('informasi_file').showModal()} className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-zinc-100 w-full md:w-fit text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800">
                            <FontAwesomeIcon icon={faFileCircleCheck} className="w-3 h-3 text-inherit" />
                            Cek File
                        </button>
                    )}
                    <dialog id="informasi_file" className="modal">
                        <div className="modal-box bg-white">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg">Informasi File</h3>
                                <p className={`w-fit px-3 py-1 rounded-full text-xs bg-green-50 text-green-700`}>
                                    Sukses
                                </p>
                            </div>
                            <article className={`${mont.className}  mt-3 flex gap-3`}>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Ekstensi
                                    </p>
                                    <p className="font-medium">
                                        .{informasiFile.ekstensi}
                                    </p>
                                </div>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Ukuran
                                    </p>
                                    <p className="font-medium">
                                        {informasiFile.size}
                                    </p>
                                </div>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Jumlah data
                                    </p>
                                    <p className="font-medium">
                                        {informasiFile.jumlahData} baris
                                    </p>
                                </div>
                            </article>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                    {uploadedFile && (
                        <button type="button" onClick={() => document.getElementById('informasi_kolom').showModal()} className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-zinc-100 w-full md:w-fit text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800">
                            <FontAwesomeIcon icon={faFileCircleCheck} className="w-3 h-3 text-inherit" />
                            Cek Kolom
                        </button>
                    )}
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
                                {formatDataPegawai.map((format, index) => (
                                    <div key={`${format} - ${index}`} className=" grid grid-cols-7 py-1">
                                        <div className="col-span-4">
                                            <div className="flex items-center h-full">
                                                <p className="text-xs md:text-sm text-zinc-700 font-medium text-center w-full align-middle">
                                                    {format}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            {informasiKolom[format] === 'cocok' && (
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-between px-3 py-1 text-xs text-green-700 bg-green-50 gap-3 rounded-full">
                                                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-700" />
                                                        Cocok
                                                    </div>
                                                </div>
                                            )}
                                            {informasiKolom[format] === 'tidak cocok' && (
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-between px-3 py-1 text-xs text-red-700 bg-red-50 gap-3 rounded-full">
                                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-red-700" />
                                                        Tidak Cocok
                                                    </div>
                                                </div>
                                            )}
                                           {informasiKolom[format] === 'tidak ada' && (
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
            <div className="grid grid-cols-12 w-full  bg-blue-500 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                    <input type="checkbox" name="" id="" />
                    Nama
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Jabatan
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Status Kepegawaian
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    NIP / NUPTK
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="bg-white w-full h-full rounded py-2 px-3 text-zinc-800" placeholder="Cari" />
                </div>
            </div>
            <div className="relative w-full h-fit max-h-[300px] divide-y overflow-auto">
                {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((pegawai, index) => (
                    <div key={`${pegawai.jabatan} - ${index}`} className="grid grid-cols-12 w-full  hover:bg-zinc-100 *:px-2 *:py-3 text-zinc-800 font-medium text-xs divide-x">
                        <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                            <div className="flex-grow flex items-center gap-2">
                                <input type="checkbox" checked={selectedPegawai.includes(pegawai.id_pegawai)} onChange={() => addSelectedPegawai(pegawai.id_pegawai)} />
                                {pegawai.nama_pegawai}
                            </div>
                            <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 flex-shrink-0 text-green-600/50" />
                        </div>
                        <div className="hidden md:flex items-center col-span-2">
                            {pegawai.jabatan}
                        </div>
                        <div className="hidden md:flex items-center col-span-2 gap-3">
                            {pegawai.status_kepegawaian}
                        </div>
                        <div className={`${mont.className} hidden md:flex items-center col-span-2 gap-1`}>
                            <p className="px-2 py-1 rounded-full bg-zinc-100">
                                {pegawai.nip}
                            </p>
                        </div>
                        <div className="flex justify-center items-center  col-span-4 md:col-span-2 gap-1 md:gap-2">
                            <button type="button" onClick={() => document.getElementById(`informasi_siswa_${pegawai.nip}`).showModal()} className="w-6 h-6 flex items-center justify-center  text-white bg-blue-600 hover:bg-blue-800" title="Informasi lebih lanjut">
                                <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            </button>
                            <dialog id={`informasi_siswa_${pegawai.nip}`} className="modal">
                                <div className="modal-box bg-white max-w-[64rem]">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg">Informasi Pegawai</h3>
                                    </div>
                                    <article className={`${mont.className}  mt-3 flex gap-3 md:flex-row flex-col font-normal`}>
                                        <div className="md:w-1/2 w-full space-y-1">
                                            {formatDataPribadi.map((format, index) => (
                                                <div key={`${format} - ${index}`} className="w-full grid grid-cols-6 gap-2">
                                                    <div className="col-span-2 text-zinc-400 font-normal">
                                                        {format.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                                    </div>
                                                    <div className="col-span-4">
                                                        {typeof(pegawai[format]) !== 'undefined' ? pegawai[format] : '-'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="md:w-1/2 w-full space-y-1">
                                            {formatDataPendidikan.map((format, index) => (
                                                <div key={`${format} - ${index}`} className="w-full grid grid-cols-6 gap-2">
                                                    <div className="col-span-2 text-zinc-400 font-normal">
                                                        {format.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                                    </div>
                                                    <div className="col-span-4">
                                                        {typeof(pegawai[format]) !== 'undefined' ? pegawai[format] : '-'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="md:w-1/2 w-full space-y-1">
                                            {formatDataSertifikat.map((format, index) => (
                                                <div key={`${format} - ${index}`}className="w-full grid grid-cols-6 gap-2">
                                                    <div className="col-span-2 text-zinc-400 font-normal">
                                                        {format.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                                    </div>
                                                    <div className="col-span-4">
                                                        {typeof(pegawai[format]) !== 'undefined' ? pegawai[format] : '-'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>
                            <button type="button" onClick={() => deleteSinglePegawai(pegawai.id_pegawai)} className="w-6 h-6 flex items-center justify-center  text-white bg-red-600 hover:bg-red-800" title="Hapus data siswa ini?">
                                <FontAwesomeIcon icon={faTrash}  className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex md:items-center md:justify-between px-2 py-1 flex-col md:flex-row border-y border-zinc-300">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">
                            {selectedPegawai.length} Data terpilih
                        </p>
                        
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => deleteSelectedPegawai()} className={`w-7 h-7 ${selectedPegawai.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 focus:bg-red-200 focus:text-red-700`}>
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                        </button>
                        <button type="button"  className={`w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 bg-zinc-100 hover:bg-zinc-200 group transition-all duration-300`}>
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                        <button type="button" className={`w-7 h-7 ${selectedPegawai.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg  group transition-all duration-300 bg-zinc-100 hover:bg-zinc-200`}>
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-fit flex items-center justify-center divide-x mt-2 md:mt-0">
                    <p className={`${mont.className} px-2 text-xs`}>
                    {(totalList * pagination) - totalList + 1} - {(totalList * pagination) > filteredData.length ? filteredData.length : totalList * pagination} dari {data.length} data
                    </p>
                    <div className={`${mont.className} px-2 text-xs flex items-center justify-center gap-3`}>
                        <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)}  className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                        </button>
                        <p className="font-medium text-zinc-600">
                            {pagination}
                        </p>
                        <button type="button" onClick={() => setPagination(state => state < Math.ceil(filteredData.length / totalList) ? state + 1 : state)}  className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>
                    <div className={`${mont.className} px-2 text-xs`}>
                        <select value={totalList} onChange={e => setTotalList(e.target.value)} className="cursor-pointer px-2 py-1 hover:bg-zinc-100 rounded bg-transparent">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr className="my-1 opacity-0" />
            {data[0] && (
                <div className="flex md:justify-between md:flex-row flex-col gap-3">
                    <div className="flex items-center w-full md:w-1/3 gap-3">
                        <button type="button" onClick={() => submitData()} className="flex items-center justify-center gap-3 py-2 w-full md:w-1/2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:bg-green-600 shadow-xl">
                            <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                            Simpan
                        </button>
                        <button type="button" onClick={() => cancelImport()} className="flex items-center justify-center gap-3 py-2 w-full md:w-1/2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:bg-red-600 shadow-xl">
                            <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-inherit" />
                            Batal
                        </button>
                    </div>
                </div>
            )}
        </MainLayoutPage>
    )
}