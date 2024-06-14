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

const formatInputFile = {
    kelas: '',
    rombel: '',
    no_rombel: '',
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
    aktif: '',
  }


const formatDataPribadi = ['kelas', 'rombel', 'no_rombel', 'nama_siswa', 'nis', 'nisn', 'nik', 'no_kk', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'status_dalam_keluarga', 'anak_ke', 'alamat', 'no_hp_siswa', 'asal_sekolah', 'kategori', 'tahun_masuk', 'aktif']
const formatDataKeluarga = ['nama_ayah', 'nama_ibu', 'telp_ortu', 'pekerjaan_ayah', 'pekerjaan_ibu']

const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const formatDataSiswa = ['kelas', 'rombel', 'no_rombel', 'nama_siswa', 'nis', 'nisn', 'nik', 'no_kk', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'status_dalam_keluarga', 'anak_ke', 'alamat', 'no_hp_siswa', 'asal_sekolah', 'kategori', 'tahun_masuk', 'nama_ayah', 'nama_ibu', 'telp_ortu', 'pekerjaan_ayah', 'pekerjaan_ibu', 'aktif']
const formatInformasiFile = {status: '', ekstensi: '', size: '', jumlahData: ''}
const mySwal = withReactContent(Swal)

export default function DataSiswaNewImportPage() {
    const router = useRouter()
    const [file, setFile] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [data, setData] = useState([])
    const [totalList, setTotalList] = useState(10)
    const [pagination, setPagination] = useState(1);
    const [selectedSiswa, setSelectedSiswa] = useState([])
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
                formatDataSiswa.filter(format => kolomInputDataArr.includes(format)).map(format => {
                    updatedInformasiKolom = {...updatedInformasiKolom, [format]: 'cocok'}
                })

                // Cek kolom yang tidak cocok
                formatDataSiswa.filter(format => kolomInputDataArr.includes(format) === false).map(format => {
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
                    formatDataSiswa.filter(format => kolomInputDataArr.includes(format)).map(format => {
                        updatedInformasiKolom = {...updatedInformasiKolom, [format]: 'cocok'}
                    })

                    // Cek kolom yang tidak cocok
                    formatDataSiswa.filter(format => kolomInputDataArr.includes(format) === false).map(format => {
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
                    setData(result.data)
                    setFilteredData(result.data)
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
            return await exportToXLSX([], 'Format Data Siswa', {
                header: formatDataSiswa,
                sheetName: 'Format XSLX'
            })
        }

        if(type === 'csv') {
            return await exportToCSV([], 'Format Data Siswa', {
                header: formatDataSiswa,
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
                    const dataObjects = records.slice(1).map((row, index) => {
                        if(row.length > 0) {
                            let obj = {};
                            columns.forEach((column, index) => {
                                obj[column] = String(row[index])
                            });
                            return obj
                        } else{
                            return null
                        }
                    }).filter(obj => obj !== null);
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
                    timer: 20000,
                    didOpen: async () => {
                        let responseData = { success: false };

                        try {
                            if (data.length > 100) {
                                const numBatches = Math.ceil(data.length / 100);
                                const responseList = [];
                                for (let i = 0; i < numBatches; i++) {
                                    const start = i * 100;
                                    const end = Math.min(start + 100, data.length);
                                    const batch = data.slice(start, end);
                                    const response = await createMultiSiswa(batch);
                                    responseList.push(response.success ? 'success' : 'failed');
                                }
                                responseData.success = responseList.includes('success');
                            } else {
                                const response = await createMultiSiswa(data);
                                responseData.success = response.success;
                            }

                            const successMessage = responseData.success ? 'Berhasil memproses data!' : 'Gagal memproses data..';
                            const messageText = responseData.success ? 'Berhasil mengupload data import ke data siswa!' : 'Terdapat kendala disaat anda mengimport data ke data siswa!';

                            mySwal.fire({
                                icon: responseData.success ? 'success' : 'error',
                                title: successMessage,
                                text: messageText,
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                if (responseData.success) {
                                    router.push('/data/siswa');
                                }
                            });
                        } catch (error) {
                            console.error('Error processing data:', error);
                            mySwal.fire({
                                icon: 'error',
                                title: 'Gagal memproses data..',
                                text: 'Terdapat kendala disaat anda mengimport data ke data siswa!',
                                timer: 2000,
                                allowOutsideClick: false
                            });
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
        setFilteredData(updatedData)
    }

    const cancelImport = () => {
        setData([])
        setFilteredData([])
        setFile(null)
        setUploadedFile(null)
        setPagination(1)
        setTotalList(10)
        setSelectedSiswa([])
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

        const updatedData = data.filter((siswa, index, array) => 
            siswa['nama_siswa'].toLowerCase().includes(value.toLowerCase()) ||
            siswa['kelas'].toLowerCase().includes(value.toLowerCase()) ||
            siswa['rombel'].toLowerCase().includes(value.toLowerCase()) ||
            siswa['no_rombel'].toLowerCase().includes(value.toLowerCase()) ||
            String(siswa['tahun_masuk']).toLowerCase().includes(value.toLowerCase()) ||
            String(siswa['nis']).toLowerCase().includes(value.toLowerCase()) ||
            String(siswa['nisn']).toLowerCase().includes(value.toLowerCase())
        )
        console.log(updatedData)
        setFilteredData(updatedData)

    }

    const deleteSingleSiswa = (nis) => {
        const updatedData = data.filter(siswa => siswa.nis !== nis)
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
                    <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700/50 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                    </button>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-blue-600" />
                        <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text dark:to-white">
                            Import Data Siswa
                        </h1>
                    </div>
                </div>
            </div>
            <hr className="my-3 opacity-0" />
            <div className="flex md:items-center md:justify-between md:flex-row flex-col gap-5 md:gap-0">
                <p className="text-sm md:w-1/2 w-full dark:text-zinc-400">
                    Anda bisa melakukan <span className=" text-blue-600 dark:text-blue-400 font-medium">import data</span> menggunakan file <span className="font-medium">Excel (.xlsx)</span> ataupun menggunakan <span className="font-medium">CSV</span> yang berisi data-data sesuai dengan ketentuan yang sudah disiapkan. <br /> <br />
                    Sebelum melakukan Import, anda bisa terlebih dahulu mengecek apa saja kolom-kolom yang diperlukan sebelum melakukan import data di <span className=" inline md:hidden font-medium">bawah</span> <span className="md:inline hidden font-medium">pinggir</span> ini. <br /> <br />
                    Jika anda mengalami kesulitan untuk menyesuaikan data yang anda miliki, anda bisa menghubungi <span className="font-medium">Administrator</span> agar bisa disesuaikan oleh mereka.
                </p>
                <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-700/50 w-full md:w-1/3">
                    <p className="dark:text-zinc-500">
                        <span className="text-zinc-300 font-bold dark:text-zinc-700">#</span> Contoh File Excel
                    </p>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => downloadFormatExample('xlsx')} className="px-3 py-2 rounded-full bg-zinc-200 flex items-center justify-center gap-2 text-sm text-zinc-600 hover:bg-blue-100 hover:text-blue-600 dark:bg-zinc-700 dark:hover:bg-blue-500/10 dark:text-zinc-500 dark:hover:text-blue-600">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit" />
                            Unduh
                        </button>
                        <p className="italic text-xs">
                            Format: .xlsx
                        </p>
                    </div>
                    <hr className="my-2 opacity-0" />
                    <p className="dark:text-zinc-500">
                        <span className="text-zinc-300 font-bold dark:text-zinc-700">#</span> Contoh File CSV
                    </p>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => downloadFormatExample('csv')} className="px-3 py-2 rounded-full bg-zinc-200 flex items-center justify-center gap-2 text-sm text-zinc-600 hover:bg-blue-100 hover:text-blue-600 dark:bg-zinc-700 dark:hover:bg-blue-500/10 dark:text-zinc-500 dark:hover:text-blue-600">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit" />
                            Unduh
                        </button>
                        <p className="italic text-xs">
                            Format: .csv
                        </p>
                    </div>
                </div>
            </div>
            <hr className="my-3 w-full dark:opacity-20" />
            <div className="flex items-center gap-5 flex-col md:flex-row">

                <form onSubmit={submitFile} className="flex items-center gap-5 flex-col md:flex-row">
                    <input type="file"  required onChange={e => handleChangeFile(e.target.files[0])} className=" border dark:border-zinc-700 dark:text-zinc-500" />
                    {file && file.name.split('.').pop() === 'xlsx' && (
                        <select className="border rounded px-3 py-1 w-full md:w-fit" value={namaSheet} onChange={e => setNamaSheet(e.target.value)}>
                            <option value={''} disabled>-- Pilih Sheets --</option>
                            {listSheet.map(sheet => (
                                <option key={sheet} value={`${sheet}`}>{sheet}</option>
                            ))}
                        </select>
                    )}
                    <button type="submit" disabled={loadingReadFormat === 'loading' ? true : false} className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-teal-100 dark:bg-teal-500/10 w-full md:w-fit text-teal-600 hover:bg-teal-200 dark:hover:bg-teal-500/20 dark:hover:text-teal-500 hover:text-teal-800">
                        <FontAwesomeIcon icon={loadingReadFormat === 'loading' ? faSpinner : faUpload} className={`${loadingReadFormat === 'loading' && 'animate-spin'} w-3 h-3 text-inherit`} />
                        Upload
                    </button>
                </form>
                <div className="flex items-center gap-5 w-full">
                    {uploadedFile && (
                        <button type="button" onClick={() => document.getElementById('informasi_file').showModal()} className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-zinc-100  w-full md:w-fit text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-100/10 dark:text-zinc-100/50 dark:hover:bg-zinc-100/20 dark:hover:text-zinc-100/50">
                            <FontAwesomeIcon icon={faFileCircleCheck} className="w-3 h-3 text-inherit" />
                            Cek File
                        </button>
                    )}
                    <dialog id="informasi_file" className="modal">
                        <div className="modal-box bg-white dark:bg-zinc-800">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg dark:text-zinc-200">Informasi File</h3>
                                <p className={`w-fit px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 dark:bg-green-500/10`}>
                                    Sukses
                                </p>
                            </div>
                            <article className={`${mont.className}  mt-3 flex gap-3`}>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Ekstensi
                                    </p>
                                    <p className="font-medium dark:text-zinc-200">
                                        .{informasiFile.ekstensi}
                                    </p>
                                </div>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Ukuran
                                    </p>
                                    <p className="font-medium dark:text-zinc-200">
                                        {informasiFile.size}
                                    </p>
                                </div>
                                <div className="w-1/3">
                                    <p className="text-zinc-500 md:text-sm text-xs">
                                        Jumlah data
                                    </p>
                                    <p className="font-medium dark:text-zinc-200">
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
                        <button type="button" onClick={() => document.getElementById('informasi_kolom').showModal()} className="px-3 py-2 md:py-1 rounded-full flex items-center justify-center gap-3 bg-zinc-100 w-full md:w-fit text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-100/10 dark:text-zinc-100/50 dark:hover:bg-zinc-100/20 dark:hover:text-zinc-100/50">
                            <FontAwesomeIcon icon={faFileCircleCheck} className="w-3 h-3 text-inherit" />
                            Cek Kolom
                        </button>
                    )}
                    <dialog id="informasi_kolom" className="modal">
                        <div className="modal-box bg-white dark:bg-zinc-800">
                            <h3 className="font-bold text-lg dark:text-zinc-200">Informasi Kolom</h3>
                            <div className="divide-y mt-3 dark:divide-zinc-700">    
                                <div className=" grid grid-cols-7 divide-x dark:divide-zinc-700">
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
                                                <p className="text-xs md:text-sm text-zinc-700 font-medium text-center w-full align-middle dark:text-zinc-300">
                                                    {format}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            {informasiKolom[format] === 'cocok' && (
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-between px-3 py-1 text-xs text-green-700 bg-green-50 gap-3 rounded-full dark:bg-green-500/10 dark:text-green-500">
                                                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-700" />
                                                        Cocok
                                                    </div>
                                                </div>
                                            )}
                                            {informasiKolom[format] === 'tidak cocok' && (
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-between px-3 py-1 text-xs text-red-700 bg-red-50 gap-3 rounded-full dark:bg-red-500/10 dark:text-red-500">
                                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-red-700" />
                                                        Tidak Cocok
                                                    </div>
                                                </div>
                                            )}
                                           {informasiKolom[format] === 'tidak ada' && (
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-between px-3 py-1 text-xs text-red-700 bg-red-50 gap-3 rounded-full dark:bg-red-500/10 dark:text-red-500">
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
            <div className="grid grid-cols-12 w-full  bg-blue-500 dark:bg-blue-700/70 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                    <input type="checkbox" name="" id="" />
                    Nama
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Kelas
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Tahun Masuk
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    NIS/NISN
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-full h-full rounded py-2 px-3 text-zinc-800" placeholder="Cari" />
                </div>
            </div>
            <div className="relative w-full h-fit max-h-[300px] divide-y overflow-auto dark:divide-zinc-600">
                {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map(siswa => (
                    <div key={siswa.nis} className="grid grid-cols-12 w-full  dark:divide-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700/30 *:px-2 *:py-3 text-zinc-800 font-medium text-xs divide-x">
                        <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                            <div className="flex-grow flex items-center gap-2 dark:text-zinc-400">
                                <input type="checkbox" checked={selectedSiswa.includes(siswa.nis)} onChange={() => addSelectedSiswa(siswa.nis)} />
                                {siswa.nama_siswa}
                            </div>
                            <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 flex-shrink-0 text-green-600/50" />
                        </div>
                        <div className="hidden md:flex items-center col-span-2 dark:text-zinc-400">
                            {siswa.kelas} {siswa.rombel} {siswa.no_rombel}
                        </div>
                        <div className="hidden md:flex items-center col-span-2 gap-3 dark:text-zinc-400">
                            {siswa.tahun_masuk}
                        </div>
                        <div className={`${mont.className} hidden md:flex items-center col-span-2 gap-1 dark:text-zinc-400`}>
                            <p className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-100/10">
                                {siswa.nis}
                            </p>
                            <p className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-100/10">
                                {siswa.nisn}
                            </p>
                        </div>
                        <div className="flex justify-center items-center  col-span-4 md:col-span-2 gap-1 md:gap-2">
                            <button type="button" onClick={() => document.getElementById(`informasi_siswa_${siswa.nis}`).showModal()} className="w-6 h-6 flex items-center justify-center  text-white bg-blue-600 hover:bg-blue-800" title="Informasi lebih lanjut">
                                <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            </button>
                            <dialog id={`informasi_siswa_${siswa.nis}`} className="modal">
                                <div className="modal-box bg-white max-w-[64rem] dark:bg-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg dark:text-zinc-200">Informasi Siswa</h3>
                                    </div>
                                    <article className={`${mont.className}  mt-3 flex gap-3 md:flex-row flex-col font-normal`}>
                                        <div className="md:w-1/2 w-full space-y-1">
                                            {formatDataPribadi.map(format => (
                                                <div key={format} className="w-full grid grid-cols-6 gap-2">
                                                    <div className="col-span-2 text-zinc-400 font-normal">
                                                        {format.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                                    </div>
                                                    <div className="col-span-4 dark:text-zinc-200">
                                                        {siswa[format]}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="md:w-1/2 w-full space-y-1">
                                            {formatDataKeluarga.map(format => (
                                                <div key={format} className="w-full grid grid-cols-6 gap-2">
                                                    <div className="col-span-2 text-zinc-400 font-normal">
                                                        {format.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                                    </div>
                                                    <div className="col-span-4 dark:text-zinc-200">
                                                        {siswa[format]}
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
                            <button type="button" onClick={() => deleteSingleSiswa(siswa.nis)} className="w-6 h-6 flex items-center justify-center  text-white bg-red-600 hover:bg-red-800" title="Hapus data siswa ini?">
                                <FontAwesomeIcon icon={faTrash}  className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex md:items-center md:justify-between px-2 dark:border-zinc-600 dark:bg-zinc-700/30 py-1 flex-col md:flex-row border-y border-zinc-300">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium dark:text-zinc-500">
                            {selectedSiswa.length} Data terpilih
                        </p>
                        
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => deleteSelectedSiswa()} className={`w-7 h-7 ${selectedSiswa.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 focus:bg-red-200 focus:text-red-700 dark:bg-zinc-700/50 dark:hover:bg-zinc-700`}>
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                        </button>
                        <button type="button"  className={`w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 bg-zinc-100 hover:bg-zinc-200 group transition-all duration-300 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 `}>
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                        <button type="button" className={`w-7 h-7 ${selectedSiswa.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg  group transition-all duration-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:text-zinc-500`}>
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-fit flex items-center justify-center divide-x mt-2 md:mt-0">
                    <p className={`${mont.className} px-2 text-xs dark:text-zinc-500`}>
                        {(totalList * pagination) - totalList + 1} - {(totalList * pagination) > filteredData.length ? filteredData.length : totalList * pagination} dari {data.length} data
                    </p>
                    <div className={`${mont.className} px-2 text-xs flex items-center justify-center gap-3`}>
                        <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)}  className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:hover:text-amber-500">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                        </button>
                        <p className="font-medium text-zinc-600">
                            {pagination}
                        </p>
                        <button type="button" onClick={() => setPagination(state => state < Math.ceil(filteredData.length / totalList) ? state + 1 : state)}  className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:hover:text-amber-500">
                            <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>
                    <div className={`${mont.className} px-2 text-xs`}>
                        <select  value={totalList} onChange={e => handleTotalList(e.target.value)} className="cursor-pointer px-2 py-1 hover:bg-zinc-100 dark:bg-zinc-700/10 dark:hover:bg-zinc-700/50 dark:text-zinc-200 rounded bg-transparent">
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