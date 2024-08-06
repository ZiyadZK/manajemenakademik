'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta } from "@/config/fonts"
import { date_getDay, date_getMonth, date_getYear, date_integerToDate } from "@/lib/dateConvertes"
import { model_createAlumni, model_deleteAlumni, model_getAllAlumni, model_updateAlumni } from "@/lib/model/alumniModel"
import { createMutasiSiswa } from "@/lib/model/mutasiSiswaModel"
import { logRiwayat } from "@/lib/model/riwayatModel"
import { createMultiSiswa, createSingleSiswa } from "@/lib/model/siswaModel"
import { exportToXLSX,  xlsx_getData, xlsx_getSheets } from "@/lib/xlsxLibs"
import {  faAnglesLeft, faAnglesRight, faArrowDown,  faArrowUp, faArrowsUpDown, faCheckDouble, faCheckSquare,  faDownload, faEdit, faFile, faPlus, faPowerOff, faPrint, faSave, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import Image from "next/image"
import { createRef, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"

const mmToPx = mm => mm * (96 / 25.4)

const allowedMIMEType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
]

const formatKolom = {
    nama_siswa: 'Nama Siswa',
    nis: 'NIS',
    nisn: 'NISN',
    kelas: 'Kelas',
    jurusan: 'Jurusan',
    rombel: 'Rombel',
    nik: 'NIK',
    no_kk: 'No Kartu Keluarga',
    tempat_lahir: 'Tempat Lahir',
    tanggal_lahir: 'Tanggal Lahir',
    jenis_kelamin: 'Jenis Kelamin',
    agama: 'Agama',
    jumlah_saudara: 'Jumlah Saudara',
    anak_ke: 'Anak ke',
    alamat: 'Alamat',
    no_hp_siswa: 'No Telepon Siswa',
    asal_sekolah: 'Asal Sekolah',
    kategori: 'Kategori',
    tahun_masuk: 'Tahun Masuk',
    nama_ayah: 'Nama Ayah',
    nama_ibu: 'Nama Ibu',
    nama_wali: 'Nama Wali',
    telp_ayah: 'No Telepon Ayah',
    telp_ibu: 'No Telepon Ibu',
    telp_wali: 'No Telepon Wali',
    pekerjaan_ayah: 'Pekerjaan Ayah',
    pekerjaan_ibu: 'Pekerjaan Ibu',
    pekerjaan_wali: 'Pekerjaan Wali',
    tanggal_keluar: 'Tanggal Keluar',
    tahun_keluar: 'Tahun Keluar',
}

const showModal = (id) => {
    return {
        show: (type) => {
            if(type === 'show') {
                document.getElementById(id).showModal()
            }else{
                document.getElementById(id).close()
            }
        }
    }
}

const formatSort = {
    nama_siswa: '', nis: '', nisn: '', tahun_masuk: ''
}

export default function DataAlumniPage() {

    const [data, setData] = useState([])
    const [importFile, setImportFile] = useState(null)
    const [sheetsFile, setSheetsFile] = useState([])
    const [loadingFetch, setLoadingFetch] = useState({
        data: '', pegawai: ''
    })
    const [filteredData, setFilteredData] = useState([])
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [selectAll, setSelectAll] = useState(false)
    const [filterData, setFilterData] = useState({
        kelas: [], jurusan: [], rombel: []
    })

    const [sortData, setSortData] = useState(formatSort)

    const componentPDF = useRef([])
    const [printedData, setPrintedData] = useState([])

    const getData = async () => {
        setLoadingFetch(state => ({...state, data: 'loading'}))
        const response = await model_getAllAlumni()
        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)
        }
        setLoadingFetch(state => ({...state, data: 'fetched'}))
    }

    useEffect(() => {
        getData()
    }, [])

    const submitFormTambah = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        const payload = {
            nama_siswa: e.target[0].value,
            nis: e.target[1].value,
            nisn: e.target[5].value,
            kelas: e.target[2].value,
            jurusan: e.target[3].value,
            rombel: e.target[4].value,
            nik: e.target[6].value,
            no_kk: e.target[7].value,
            tempat_lahir: e.target[8].value,
            tanggal_lahir: e.target[9].value,
            jenis_kelamin: e.target[10].value,
            agama: e.target[11].value,
            jumlah_saudara: e.target[12].value,
            anak_ke: e.target[13].value,
            alamat: e.target[14].value,
            no_hp_siswa: e.target[15].value,
            asal_sekolah: e.target[16].value,
            kategori: e.target[17].value,
            tahun_masuk: e.target[18].value,
            nama_ayah: e.target[19].value,
            nama_ibu: e.target[20].value,
            nama_wali: e.target[21].value,
            telp_ayah: e.target[22].value,
            telp_ibu: e.target[23].value,
            telp_wali: e.target[24].value,
            pekerjaan_ayah: e.target[25].value,
            pekerjaan_ibu: e.target[26].value,
            pekerjaan_wali: e.target[27].value,
            tanggal_keluar: e.target[28].value,
            tahun_keluar: date_getYear(e.target[28].value)
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: async () => {
                const response = await model_createAlumni(payload)

                await logRiwayat({
                    aksi: 'Tambah',
                    kategori: 'Data Alumni',
                    keterangan: 'Mengubah 1 Data',
                    records: JSON.stringify({...payload})
                })

                if(response) {
                    for(let i = 0; i < 25; i++) {
                        e.target[i].value = ''
                    }

                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menambahkan data alumni ',
                        timer: 3000,
                        timerProgressBar: true
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan saat memproses data, hubungi Administrator!',
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const submitDeleteData = async (nis) => {
        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                let response

                if(nis) {
                    response = await model_deleteAlumni([nis])
                    await logRiwayat({
                        aksi: 'Hapus',
                        kategori: 'Data Alumni',
                        keterangan: 'Menghapus 1 Data',
                        records: JSON.stringify({nis})
                    })
                }else{
                    response = await model_deleteAlumni(selectedData)
                    await logRiwayat({
                        aksi: 'Hapus',
                        kategori: 'Data Alumni',
                        keterangan: `Menghapus ${selectedData.length} Data`,
                        records: JSON.stringify({nis: selectedData})
                    })
                }

                if(response.success) {
                    setSelectedData([])
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menghapus data alumni'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        icon: 'error',
                        text: 'Terjadi kesalahan saat memproses data, hubungi administrator!'
                    })
                }
            }
        })
    }

    const handleSelectData = (nis) => {
        setSelectedData(state => {
            if(state.includes(nis)) {
                return state.filter(value => value !== nis)
            }else{
                return [...state, nis]
            }
        })
    }

    const submitEditData = (e, modal, nis) => {
        e.preventDefault()

        showModal(modal).show('close')

        const payload = {
            nama_siswa: e.target[0].value,
            nis: e.target[1].value,
            nisn: e.target[5].value,
            kelas: e.target[2].value,
            jurusan: e.target[3].value,
            rombel: e.target[4].value,
            nik: e.target[6].value,
            no_kk: e.target[7].value,
            tempat_lahir: e.target[8].value,
            tanggal_lahir: e.target[9].value,
            jenis_kelamin: e.target[10].value,
            agama: e.target[11].value,
            jumlah_saudara: e.target[12].value,
            anak_ke: e.target[13].value,
            alamat: e.target[14].value,
            no_hp_siswa: e.target[15].value,
            asal_sekolah: e.target[16].value,
            kategori: e.target[17].value,
            tahun_masuk: e.target[18].value,
            nama_ayah: e.target[19].value,
            nama_ibu: e.target[20].value,
            nama_wali: e.target[21].value,
            telp_ayah: e.target[22].value,
            telp_ibu: e.target[23].value,
            telp_wali: e.target[24].value,
            pekerjaan_ayah: e.target[25].value,
            pekerjaan_ibu: e.target[26].value,
            pekerjaan_wali: e.target[27].value,
            tanggal_keluar: e.target[28].value,
            tahun_keluar: date_getYear(e.target[28].value)
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await model_updateAlumni([nis], payload)
                await logRiwayat({
                    aksi: 'Ubah',
                    kategori: 'Data Alumni',
                    keterangan: 'Mengubah 1 Data',
                    records: JSON.stringify({nis, payload})
                })

                if(response.success) {
                    setSelectedData([])
                    setSelectAll(false)
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah data alumni tersebut',
                        icon: 'success'
                    })
                }else{
                    showModal(modal).show('show')
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat error disaat memproses data, hubungi Administrator!',
                        icon: 'error'
                    })
                }
            }
        })
    }

    useEffect(() => {
        let updatedData = data

        if(searchFilter !== '') {
            updatedData = updatedData.filter(value =>
                value['nama_siswa'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nis'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nisn'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['no_kk'].toLowerCase().includes(searchFilter.toLowerCase()) ||
                value['nik'].toLowerCase().includes(searchFilter.toLowerCase())
            )
        }

        if(filterData['kelas'].length > 0) {
            updatedData = updatedData.filter(value => filterData['kelas'].includes(value['kelas']))
        }

        if(filterData['jurusan'].length > 0) {
            updatedData = updatedData.filter(value => filterData['jurusan'].includes(value['jurusan']))
        }

        if(filterData['rombel'].length > 0) {
            updatedData = updatedData.filter(value => filterData['rombel'].includes(value['rombel']))
        }

        let sortedData = []

        Object.keys(sortData).forEach(kolom => {
            if(sortData[kolom] !== '') {
                sortedData = updatedData.sort((a, b) => {
                    if(sortData[kolom] === 'asc') {
                        if(a[kolom] < b[kolom]) return -1;
                        if(a[kolom] > b[kolom]) return 1;
                        return 0
                    }

                    if(sortData[kolom] === 'dsc') {
                        if(a[kolom] < b[kolom]) return 1;
                        if(a[kolom] > b[kolom]) return -1;
                        return 0
                    }
                })
            }
        })

        setFilteredData(sortedData.length < 1 ? updatedData : sortedData)
    }, [searchFilter, filterData, sortData, data])

    const handleFilterData = (kolom, value) => {
        setFilterData(state => {
            let updatedState
            let updatedFilter

            if(state[kolom].includes(value)) {
                updatedFilter = state[kolom].filter(v => v !== value)
                updatedState = {...state, [kolom]: updatedFilter}
            }else{
                updatedState = {...state, [kolom]: [...state[kolom], value]}
            }

            return updatedState
        })
    }

    const submitImportFile = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()

        const namaSheet = e.target[1].value

        const response = await xlsx_getData(importFile, namaSheet)
        if(response.success) {
            const headersImportFile = Object.keys(response.data[0])
            const headersDatabase = Object.keys(formatKolom)

            if(headersDatabase.length > headersImportFile.length) {
                return Swal.fire({
                    title: 'Gagal',
                    text: 'Kolom data tidak sesuai dengan yang ada di database!',
                    icon: 'error'
                }).then(() => {
                    document.getElementById(modal).showModal()
                })
            }

            if(headersImportFile.map(value => headersDatabase.includes(value) ? true : false).includes(false)) {
                return Swal.fire({
                    title: 'Gagal',
                    text: 'Terdapat kolom data yang tidak sesuai dengan yang ada di database, silahkan cek kembali!',
                    icon: 'error'
                }).then(() => {
                    document.getElementById(modal).showModal()
                })
            }

            const dataImport = response.data.map(state => ({
                ...state
            }))

            Swal.fire({
                title: 'Sedang memproses data',
                timer: 60000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                didOpen: async () => {
                    const response = await createMutasiSiswa(dataImport)
                    await logRiwayat({
                        aksi: 'Import',
                        kategori: 'Data Alumni',
                        keterangan: `Mengimport ${dataImport.length} Data`,
                        records: JSON.stringify([...dataImport])
                    })

                    if(response.success) {
                        await getData()
                        Swal.fire({
                            title: 'Sukses',
                            text: `Berhasil mengimport data Alumni!`,
                            icon: 'success'
                        }).then(() => {
                            e.target[0].value = ''
                            e.target[1].value = ''
                            setImportFile(null)
                            setSheetsFile([])
                            document.getElementById(modal).showModal()
                        })
                    }else{
                        Swal.fire({
                            title: 'Gagal',
                            text: `Gagal mengimport data Alumni!`,
                            icon: 'error'
                        }).then(() => {
                            document.getElementById(modal).showModal()
                        })
                    }
                }
            })

        }

    }

    const handleImportFile = async () => {
        if(importFile !== null) {
            const file = importFile
            if(!allowedMIMEType.includes(file.type)) {
                console.log('salah file')
                return setImportFile(null)
            }
            
            // Get sheets
            if(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const sheets = await xlsx_getSheets(importFile)
                setSheetsFile(Object.keys(sheets))
            }
        }
    }

    useEffect(() => {
        handleImportFile()
    }, [importFile])


    const handleSortData = (key) => {
        setSortData(state => {
            if(state[key] === '') {
                return {...formatSort, [key]: 'dsc'}
            }else if(state[key] === 'asc') {
                return {...formatSort, [key]: ''}
            }else if(state[key] === 'dsc') {
                return {...formatSort, [key]: 'asc'}
            }
        })
    }



    const handlePrintData = async (modal, nis) => {
        document.getElementById(modal).close()

        const dataSiswa = data.filter(value => value['nis'] === nis)

        if(componentPDF.current.length !== dataSiswa.length) {
            componentPDF.current = dataSiswa.map((_, i) => componentPDF.current[i] || createRef())
        }
        setPrintedData(dataSiswa)

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                setTimeout(async () => {

                    const pdf = new jsPDF({
                        orientation: 'p',
                        unit: 'mm',
                        format: [330, 210],
                        precision: 2,
                        compress: true
                    })

                    pdf.addFont('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap')
                    pdf.setFont('Jakarta')

                    for (let i = 0; i < componentPDF.current.length; i++) {
                        const content = componentPDF.current[i].current;
                        if (!content) continue;
        
                        const canvas = await html2canvas(content, { scale: 3 });
                        const imgData = canvas.toDataURL('image/jpeg', 0.1);
        
                        const pdfW = pdf.internal.pageSize.getWidth();
                        const pdfH = pdf.internal.pageSize.getHeight();
        
                        const imgW = canvas.width;
                        const imgH = canvas.height;
        
                        // Calculate scaling factor to fit the image into the PDF page
                        const ratio = Math.min(pdfW / imgW, pdfH / imgH);
        
                        // Calculate the dimensions and position of the image to be centered on the PDF page
                        const imgWidth = imgW * ratio;
                        const imgHeight = imgH * ratio;
                        const imgX = (pdfW - imgWidth) / 2;
                        const imgY = (pdfH - imgHeight) / 2;
        
                        // Add the image to the PDF
                        pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
                        if (i < componentPDF.current.length - 1) {
                            pdf.addPage();
                        }
                    }

                    pdf.save(`LEMBAR BUKU INDUK SMK - ${dataSiswa[0]['nama_siswa']} - ${Number(dataSiswa[0]['tahun_masuk'])}/${Number(dataSiswa[0]['tahun_masuk']) + 1}`)
                    const pdfDataUri = pdf.output('datauristring');
                    setPrintedData([])
                    Swal.fire({
                        title: 'Sukses',
                        text: "Berhasil print data siswa tersebut!",
                        icon: 'success',
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: async () => {
                            await logRiwayat({
                                aksi: 'Export',
                                kategori: 'Data Alumni',
                                keterangan: `Mengexport 1 Data menjadi PDF`,
                                records: JSON.stringify({nis: dataSiswa[0]['nis']})
                            })
                            setPrintedData([])
                            const newTab = window.open();
                            newTab.document.write(`<iframe src="${pdfDataUri}" width="100%" height="100%"></iframe>`);
                        }
                    });
                }, 1000)
            }
        })
    }

    const handleSelectedPrintData = async () => {

        const dataSiswa = data.filter(value => selectedData.includes(value['nis']))


        if(componentPDF.current.length !== dataSiswa.length) {
            componentPDF.current = dataSiswa.map((_, i) => componentPDF.current[i] || createRef())
        }

        setPrintedData(dataSiswa)

        Swal.fire({
            title: 'Sedang memproses data',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                setTimeout(async () => {
                    const pdf = new jsPDF({
                        orientation: 'p',
                        unit: 'mm',
                        format: [330, 210],
                        precision: 2
                    })

                    for (let i = 0; i < componentPDF.current.length; i++) {
                        const content = componentPDF.current[i].current;
                        if (!content) continue;
        
                        const canvas = await html2canvas(content, { scale: 3 });
                        const imgData = canvas.toDataURL('image/jpeg', 0.1);
        
                        const pdfW = pdf.internal.pageSize.getWidth();
                        const pdfH = pdf.internal.pageSize.getHeight();
        
                        const imgW = canvas.width;
                        const imgH = canvas.height;
        
                        // Calculate scaling factor to fit the image into the PDF page
                        const ratio = Math.min(pdfW / imgW, pdfH / imgH);
        
                        // Calculate the dimensions and position of the image to be centered on the PDF page
                        const imgWidth = imgW * ratio;
                        const imgHeight = imgH * ratio;
                        const imgX = (pdfW - imgWidth) / 2;
                        const imgY = (pdfH - imgHeight) / 2;
        
                        // Add the image to the PDF
                        pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
                        if (i < componentPDF.current.length - 1) {
                            pdf.addPage();
                        }
                    }

                    pdf.save(`LEMBAR BUKU INDUK SMK - ${dataSiswa.length} Siswa`)
                    const pdfDataUri = pdf.output('datauristring');
                    Swal.fire({
                        title: 'Sukses',
                        text: "Berhasil print data siswa tersebut!",
                        icon: 'success',
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: async () => {
                            await logRiwayat({
                                aksi: 'Export',
                                kategori: 'Data Alumni',
                                keterangan: `Mengexport ${dataSiswa.length} Data menjadi PDF`,
                                records: JSON.stringify({nis: dataSiswa.map(value => value['nis'])})
                            })
                            setPrintedData([])
                            const newTab = window.open();
                            newTab.document.write(`<iframe src="${pdfDataUri}" width="100%" height="100%"></iframe>`);
                        }
                    });
                }, 1000)
            }
        })
    }

    const submitExportData = async (e, modal) => {
        e.preventDefault()

        const exportAll = e.target[0].checked

        const exportKolomChecked = Object.keys(data[0]).filter((value, index) => e.target[index + 1].checked).map((value, index) => value)

        if(!exportAll && exportKolomChecked.length < 1) {
            return
        }

        if(exportAll) {
            if(selectedData.length < 1) {
                await logRiwayat({
                    aksi: 'Export',
                    kategori: 'Data Alumni',
                    keterangan: `Mengexport ${data.length} Data menjadi EXCEL`,
                    records: JSON.stringify({nis: data.map(value => value['nis'])})
                })
                return await exportToXLSX(data, 'SIMAK - Data Alumni', {
                    header: Object.keys(data[0]),
                    sheetName: 'DATA ALUMNI'
                })
            }else{
                const dataImport = data.filter(value => selectedData.includes(value['nis']))
                await logRiwayat({
                    aksi: 'Export',
                    kategori: 'Data Alumni',
                    keterangan: `Mengexport ${dataImport.length} Data menjadi EXCEL`,
                    records: JSON.stringify({nis: dataImport.map(value => value['nis'])})
                })

                return await exportToXLSX(dataImport, 'SIMAK - Data Alumni', {
                    header: Object.keys(dataImport[0]),
                    sheetName: 'DATA ALUMNI'
                })
            }
        }else{
            let dataImport = data.map(value => {
                let obj = {}
                Object.keys(value).map(kolom => {
                    if(exportKolomChecked.includes(kolom)) {
                        obj[kolom] = value[kolom]
                    }
                })
                return obj
            })
            if(selectedData.length < 1) {
                await logRiwayat({
                    aksi: 'Export',
                    kategori: 'Data Alumni',
                    keterangan: `Mengexport ${dataImport.length} Data menjadi EXCEL`,
                    records: JSON.stringify(dataImport)
                })
                return await exportToXLSX(dataImport, 'SIMAK - Data Alumni', {
                    header: Object.keys(dataImport[0]),
                    sheetName: 'DATA ALUMNI'
                })
            }else{
                let dataImport = data.filter(value => selectedData.includes(value['nis'])).map(value => {
                    let obj = {}
                    Object.keys(value).map(kolom => {
                        if(exportKolomChecked.includes(kolom)) {
                            obj[kolom] = value[kolom]
                        }
                    })
                    return obj
                })

                await logRiwayat({
                    aksi: 'Export',
                    kategori: 'Data Alumni',
                    keterangan: `Mengexport ${dataImport.length} Data menjadi EXCEL`,
                    records: JSON.stringify(dataImport)
                })

                return await exportToXLSX(dataImport, 'SIMAK - Data Alumni', {
                    header: Object.keys(dataImport[0]),
                    sheetName: 'DATA ALUMNI'
                })
            }
        }
    }

    const submitAktifkanSiswa = (nis, modal) => {

        if(modal) {
            document.getElementById(modal).close()
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 50000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: async () => {
                let dataSiswa
                let responseSiswa
                let responseMutasiSiswa
                if(nis) {
                    const {tahun_keluar, tanggal_keluar,  ...updatedDataSiswa} = data.find(value => value['nis'] === nis)
                    dataSiswa = updatedDataSiswa
                    responseSiswa = await createSingleSiswa(dataSiswa)
                    responseMutasiSiswa = await model_deleteAlumni([dataSiswa['nis']])
                    await logRiwayat({
                        aksi: 'Mutasi',
                        kategori: 'Data Alumni',
                        keterangan: `Mengaktifkan 1 Data ke dalam Data Siswa`,
                        records: JSON.stringify({nis})
                    })
                }else{
                    const updatedDataSiswa = data.filter(value => selectedData.includes(value['nis'])).map(value => {
                        const {tahun_keluar, tanggal_keluar,  ...obj} = value
                        return obj
                    })
                    dataSiswa = updatedDataSiswa
                    responseSiswa = await createMultiSiswa(dataSiswa)
                    responseMutasiSiswa = await model_deleteAlumni(dataSiswa.map(value => value['nis']))
                    await logRiwayat({
                        aksi: 'Mutasi',
                        kategori: 'Data Alumni',
                        keterangan: `Mengaktifkan ${updatedDataSiswa.length} Data ke dalam Data Siswa`,
                        records: JSON.stringify([updatedDataSiswa])
                    })
                }

                if(responseMutasiSiswa.success && responseSiswa.success) {
                    setSelectAll(false)
                    setSelectedData([])
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Data Alumni tersebut berhasil di aktifkan kembali!',
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan disaat memproses data, hubungi administrator!',
                        icon: 'error',
                    })
                }
            }
        })
    }

    const handleSelectAll = () => {
        if(filteredData.length > 0) {
            setSelectAll(state => {
                if(state) {
                    setSelectedData([])
                }else{
                    setSelectedData(state => filteredData.map(value => value['nis']))
                }
                return !state
            })
        }
    }

    useEffect(() => {
        if(data.length > 0) {
            if(selectedData.length === filteredData.length || selectedData.length >= filteredData.length) {
                setSelectAll(true)
            }else{
                setSelectAll(false)
            }
        }
    }, [selectedData, filteredData, data])

    return (
        <MainLayoutPage>
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                <div className="text-xs md:text-sm no-scrollbar">
                    <div className="flex items-center gap-5 w-full md:w-fit text-xs md:text-sm">
                        <button type="button" onClick={() => document.getElementById('tambah_siswa').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit opacity-70" />
                            Tambah
                        </button>
                        <dialog id="tambah_siswa" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded md:max-w-[900px] border dark:border-zinc-800">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Tambah Siswa</h3>
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={e => submitFormTambah(e, 'tambah_siswa')} className="space-y-5 md:space-y-3">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Nama Siswa
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            NIS
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NIS" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Kelas
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Kelas --</option>
                                                <option value="X">X</option>
                                                <option value="XI">XI</option>
                                                <option value="XII">XII</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Jurusan
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Jurusan --</option>
                                                <option value="TKJ">TKJ</option>
                                                <option value="TPM">TPM</option>
                                                <option value="TKR">TKR</option>
                                                <option value="GEO">GEO</option>
                                                <option value="TITL">TITL</option>
                                                <option value="DPIB">DPIB</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Rombel
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Rombel" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Induk Siswa Nasional
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Induk Siswa Nasional" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Induk Kependudukan
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Induk Kependudukan" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Kartu Keluarga
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Kartu Keluarga" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tempat Lahir
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tempat Lahir" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tanggal Lahir
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Jenis Kelamin
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Agama
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <select required className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                <option value="" disabled>-- Pilih Agama --</option>
                                                <option value="Islam">Islam</option>
                                                <option value="Protestan">Protestan</option>
                                                <option value="Katolik">Katolik</option>
                                                <option value="Hindu">Hindu</option>
                                                <option value="Buddha">Buddha</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Jumlah Saudara
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Jumlah Saudara" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Anak ke Berapa
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Anak ke Berapa" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Alamat
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Alamat" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Telepon Siswa
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Siswa" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Asal Sekolah
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Asal Sekolah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Kategori
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Kategori" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tahun Masuk
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tahun Masuk" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Nama Ayah
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Nama Ibu
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Nama Wali
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Wali" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Telepon Ayah
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Telepon Ibu
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            No Telepon Wali
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Wali" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Pekerjaan Ayah
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Pekerjaan Ibu
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Pekerjaan Wali
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Wali" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <p className="opacity-60 w-full md:w-1/3">
                                            Tanggal Keluar
                                        </p>
                                        <div className="w-full md:w-2/3">
                                            <input required type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Wali" />
                                        </div>
                                    </div>
                                    <div className="flex md:justify-end">
                                        <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                            <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                            Simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </dialog>
                        <button type="button" onClick={() => document.getElementById('import_siswa').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit opacity-70" />
                            Import
                        </button>
                        <dialog id="import_siswa" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 rounded border dark:border-zinc-800">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Import Data</h3>
                                <hr className="my-2 opacity-0" />
                                
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={e => submitImportFile(e, 'import_siswa')} className="text-xs space-y-2">
                                    <p className="opacity-60">
                                        File harus berupa .xlsx atau .csv
                                    </p>
                                    <input type="file" id="input_import_file" onChange={e => setImportFile(e.target.files[0])} className="text-sm cursor-pointer w-full" />
                                    <p className="opacity-60">
                                        Pilih Sheet jika anda menggunakan .xlsx
                                    </p>
                                    <select id="select_sheet" className="px-3 py-2 w-full rounded-md border dark:border-zinc-800 dark:bg-zinc-900">
                                        <option value="" disabled>-- Pilih Sheet --</option>
                                        {sheetsFile.map((value, index) => (
                                            <option key={index} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                    <button type="submit" className="w-full md:w-fit px-3 py-2 text-sm rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3">
                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </dialog>
                    </div>
                    <hr className="my-5 dark:opacity-10" />
                    
                    {loadingFetch['data'] !== 'fetched' && (
                        <div className="loading loading-spinner loading-sm opacity-50"></div>
                    )}
                    {loadingFetch['data'] === 'fetched' && data.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="opacity-70 w-full md:w-1/6">
                                    Kelas
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['kelas']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('kelas', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['kelas'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="opacity-70 w-full md:w-1/6">
                                    Jurusan
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['jurusan']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('jurusan', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['jurusan'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                            <div className="flex md:items-center flex-col md:flex-row gap-1">
                                <p className="opacity-70 w-full md:w-1/6">
                                    Rombel
                                </p>
                                <div className="flex w-full md:w-5/6 items-center gap-2 relative overflow-auto *:flex-shrink-0">
                                    {Array.from(new Set(data.map(value => value['rombel']))).map((value, index) => (
                                        <button key={index} onClick={() => handleFilterData('rombel', value)} type="button" className={`px-3 py-2 rounded-md ${filterData['rombel'].includes(value) ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                                            {value}
                                        </button>
                                    ))}      
                                </div>
                            </div>
                        </div>
                    )}

                    <hr className="my-5 dark:opacity-10" />
                    <p>
                        Hasil pencarian ditemukan {filteredData.length} data
                    </p>
                    <hr className="my-1 opacity-0" />  
                    <div className="relative overflow-auto w-full max-h-[400px]">
                        <div className="grid grid-cols-12 p-3 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 sticky top-0 mb-2">
                            <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                <input type="checkbox" checked={selectAll} onChange={() => handleSelectAll()} className="cursor-pointer" />
                                Nama Siswa
                                <button type="button" onClick={() => handleSortData('nama_siswa')} className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={sortData['nama_siswa'] === '' ? faArrowsUpDown : (sortData['nama_siswa'] === 'asc' ? faArrowUp : faArrowDown)} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Kelas
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                NIS
                                <button type="button" onClick={() => handleSortData('nis')} className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={sortData['nis'] === '' ? faArrowsUpDown : (sortData['nis'] === 'asc' ? faArrowUp : faArrowDown)} className="w-3 h-3 text-inherit" />
                                </button> 
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Tanggal Keluar
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Tahun Masuk
                                <button type="button" onClick={() => handleSortData('tahun_masuk')} className="opacity-50 hover:opacity-100">
                                    <FontAwesomeIcon icon={sortData['tahun_masuk'] === '' ? faArrowsUpDown : (sortData['tahun_masuk'] === 'asc' ? faArrowUp : faArrowDown)} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center gap-3">
                                <input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="w-full dark:bg-zinc-900 bg-white px-2 py-1 rounded border dark:border-zinc-700" placeholder="Cari disini" />
                            </div>
                        </div>
                        {loadingFetch['data'] !== 'fetched' && (
                            <div className="w-full flex items-center justify-center">
                                <div className="loading loading-spinner loading-sm text-zinc-500"></div>
                            </div>
                        )}
                        {loadingFetch['data'] === 'fetched' && data.length < 1 && (
                            <div className="w-full flex items-center justify-center text-zinc-500">
                                Data Siswa tidak ada!
                            </div>
                        )}
                        {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                            <div key={`${value['nis']}`} className="grid grid-cols-12 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 ease-out duration-300 text-xs">
                                <div className="col-span-7 md:col-span-2 flex items-center gap-3">
                                    <input type="checkbox" checked={selectedData.includes(value['nis'])} onChange={() => handleSelectData(value['nis'])} className="cursor-pointer" />
                                    {value['nama_siswa']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['kelas']} {value['jurusan']} {value['rombel']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['nis']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {date_getDay(value['tanggal_keluar'])} {date_getMonth('string', value['tanggal_keluar'])} {date_getYear(value['tanggal_keluar'])}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    <div className="space-y-2">
                                        <p>
                                            {value['tahun_masuk']}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-5 md:col-span-2 flex items-center justify-center md:gap-3 gap-1">
                                    <button type="button" onClick={() => document.getElementById(`info_alumni_${value['nis']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`info_alumni_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Informasi Alumni</h3>
                                            <hr className="my-2 opacity-0" />
                                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                                
                                                <button type="button" onClick={() => handlePrintData(`info_alumni_${value['nis']}`, value['nis'])} className="w-full md:w-fit px-3 py-2 border rounded-md dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3">
                                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit opacity-60" />
                                                    Print
                                                </button>
                                                <button type="button" onClick={() => submitAktifkanSiswa(value['nis'], `info_alumni_${value['nis']}`)} className="w-full md:w-fit px-3 py-2 border rounded-md dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3">
                                                    <FontAwesomeIcon icon={faCheckDouble} className="w-3 h-3 text-green-500 opacity-60" />
                                                    Aktifkan 
                                                </button>
                                            </div>
                                            <hr className="my-2 opacity-0" />
                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3 border-b dark:border-white">
                                                        <p className="w-full md:w-1/3 text-sm font-bold">
                                                            Data Pribadi
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Lengkap
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_siswa']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Kelas
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['kelas']} {value['jurusan']} {value['rombel']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nomor Induk Siswa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nis']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Induk Siswa Nasional
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nisn']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Induk Kependudukan
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nik']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Kartu Keluarga
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['no_kk']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tempat, Tanggal Lahir
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tempat_lahir']}, {date_getDay(value['tanggal_lahir'])} {date_getMonth('string', value['tanggal_lahir'])} {date_getYear(value['tanggal_lahir'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Jenis Kelamin
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['jenis_kelamin']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Agama
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['agama']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Jumlah Saudara
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['jumlah_saudara']} Saudara
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Anak ke Berapa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            Anak ke {value['anak_ke']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Alamat
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['alamat']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Telepon Siswa
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['no_hp_siswa']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Asal Sekolah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['asal_sekolah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Kategori
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['kategori']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tahun Masuk
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tahun_masuk']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tanggal Keluar
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {date_getDay(value['tanggal_keluar'])} {date_getMonth('string', value['tanggal_keluar'])} {date_getYear(value['tanggal_keluar'])}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Tahun Keluar
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['tahun_keluar']}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3 border-b dark:border-white">
                                                        <p className="w-full md:w-1/3 text-sm font-bold">
                                                            Data Orang Tua / Wali
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Ayah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_ayah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Pekerjaan Ayah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['pekerjaan_ayah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Telepon Ayah
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['telp_ayah']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Ibu
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_ibu']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Pekerjaan Ibu
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['pekerjaan_ibu']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Telepon Ibu
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['telp_ibu']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Nama Wali
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['nama_wali']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            Pekerjaan Wali
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['pekerjaan_wali']}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-50">
                                                            No Telepon Wali
                                                        </p>
                                                        <p className="w-full md:w-2/3">
                                                            {value['telp_wali']}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => document.getElementById(`edit_alumni_${value['nis']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`edit_alumni_${value['nis']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 max-w-[800px]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ubah Data Alumni</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={(e) => submitEditData(e, `edit_alumni_${value['nis']}`, value['nis'])} className="space-y-6 md:space-y-3">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Siswa
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nama_siswa']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        NIS
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nis']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="NIS" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Kelas
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['kelas']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                            <option value="" disabled>-- Pilih Kelas --</option>
                                                            <option value="X">X</option>
                                                            <option value="XI">XI</option>
                                                            <option value="XII">XII</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Jurusan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['jurusan']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                            <option value="" disabled>-- Pilih Jurusan --</option>
                                                            <option value="TKJ">TKJ</option>
                                                            <option value="TPM">TPM</option>
                                                            <option value="TKR">TKR</option>
                                                            <option value="GEO">GEO</option>
                                                            <option value="TITL">TITL</option>
                                                            <option value="DPIB">DPIB</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Rombel
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['rombel']} type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Rombel" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Induk Siswa Nasional
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nisn']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Induk Siswa Nasional" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Induk Kependudukan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input defaultValue={value['nik']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Induk Kependudukan" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Kartu Keluarga
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input defaultValue={value['no_kk']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Kartu Keluarga" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tempat Lahir
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['tempat_lahir']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tempat Lahir" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tanggal Lahir
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['tanggal_lahir']} type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Jenis Kelamin
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['jurusan']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                            <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                                            <option value="Laki-laki">Laki-laki</option>
                                                            <option value="Perempuan">Perempuan</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Agama
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <select required defaultValue={value['jurusan']} className="px-3 py-2 rounded-md w-full dark:bg-zinc-900 border dark:border-zinc-800">
                                                            <option value="" disabled>-- Pilih Agama --</option>
                                                            <option value="Islam">Islam</option>
                                                            <option value="Protestan">Protestan</option>
                                                            <option value="Katolik">Katolik</option>
                                                            <option value="Hindu">Hindu</option>
                                                            <option value="Buddha">Buddha</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Jumlah Saudara
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['jumlah_saudara']} type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Jumlah Saudara" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Anak ke Berapa
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['anak_ke']} type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Anak ke Berapa" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Alamat
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['alamat']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Alamat" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Telepon Siswa
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['no_hp_siswa']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Siswa" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Asal Sekolah
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['asal_sekolah']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Asal Sekolah" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Kategori
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['kategori']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Kategori" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tahun Masuk
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['tahun_masuk']} type="number" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tahun Masuk" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Ayah
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nama_ayah']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ayah" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Ibu
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nama_ibu']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Ibu" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Wali
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['nama_wali']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Nama Wali" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Telepon Ayah
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['telp_ayah']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Ayah" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Telepon Ibu
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['telp_ibu']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Ibu" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        No Telepon Wali
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['telp_wali']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="No Telepon Wali" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Pekerjaan Ayah
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['pekerjaan_ayah']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Ayah" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Pekerjaan Ibu
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['pekerjaan_ibu']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Ibu" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Pekerjaan Wali
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['pekerjaan_wali']} type="text" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Pekerjaan Wali" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Tanggal Keluar
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input required defaultValue={value['tanggal_keluar']} type="date" className="px-3 py-2 rounded-md w-full bg-transparent border dark:border-zinc-800" placeholder="Tanggal Keluar" />
                                                    </div>
                                                </div>
                                                <div className="flex md:justify-end">
                                                    <button type="submit" className="w-full md:w-fit px-3 py-2 rounded-md flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                        Simpan
                                                    </button>
                                                </div>
                                            </form>
                                            <hr className="my-2 opacity-0" />
                                            
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => submitDeleteData(value['nis'])} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <button type="button" onClick={() => submitAktifkanSiswa(value['nis'])} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-green-500 dark:hover:border-green-500/50 hover:bg-green-100 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faCheckDouble} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            {selectedData.length > 0 && (
                                <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                    <FontAwesomeIcon icon={faCheckSquare} className="w-3 h-3 text-inherit" />
                                    {selectedData.length} Data
                                </div>
                            )}
                            <div className="flex items-center justify-center w-full md:w-fit gap-1 md:gap-3 px-3">
                                {loadingFetch['data'] !== 'fetched' && (
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <div className="loading loading-xs loading-spinner opacity-50"></div>
                                    </div>
                                )}
                                {loadingFetch['data'] === 'fetched' && data.length > 0 && (
                                    <button type="button" onClick={() => document.getElementById(`export`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-green-500 dark:hover:border-green-500/50 hover:bg-green-100 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faUpload} className="w-3 h-3 text-inherit" />
                                    </button>
                                )}
                                <dialog id={`export`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                    <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800 md:max-w-[800px]">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Export Data Siswa</h3>
                                        <hr className="my-2 opacity-0" />
                                        <form onSubmit={e => submitExportData(e, 'export')}>

                                            <label  htmlFor={`cb_export_allData`} className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ease-out duration-200 flex items-center gap-3 cursor-pointer w-fit">
                                                <input type="checkbox" defaultChecked id={`cb_export_allData`} />
                                                Export semua kolom
                                            </label>
                                            <hr className="my-2 opacity-0" />
                                            <p>
                                                Silahkan pilih kolom di bawah ini jika ingin export kolom tertentu
                                            </p>
                                            <hr className="my-2 opacity-0" />
                                            {loadingFetch['data'] !== 'fetched' && (
                                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                                            )}
                                            {loadingFetch['data'] === 'fetched' && data.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs w-full overflow-auto max-h-[200px]">
                                                    {Object.keys(data[0]).map((kolom, index) => (
                                                        <label key={index} htmlFor={`cb_export_${index}`} className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ease-out duration-200 flex items-center gap-3 cursor-pointer">
                                                            <input type="checkbox" value={kolom} id={`cb_export_${index}`} />
                                                            {formatKolom[kolom]}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                            <hr className="my-2 dark:opacity-10" />
                                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                <button type="submit" className="px-3 py-2 rounded-md w-full md:w-fit flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                    Export
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </dialog>
                                {selectedData.length > 0 && (
                                    <>
                                    <button type="button" onClick={() => submitAktifkanSiswa()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-cyan-500 dark:hover:border-cyan-500/50 hover:bg-cyan-100 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <button type="button" onClick={() => handleSelectedPrintData()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-green-500 dark:hover:border-green-500/50 hover:bg-green-100 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <button type="button" onClick={() => submitDeleteData()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                    </>
                                )}
                            </div>
                            <p className="pl-3  w-full md:w-fit">
                                Total {data.length} Data
                            </p>
                        </div>
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesLeft} className="w-3 h-3 text-inherit" />
                                </button>
                                {pagination}
                                <button type="button" onClick={() => setPagination(state => state < Math.ceil(data.length / totalList) ? state + 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesRight} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 pl-3  w-full md:w-fit">
                                <select value={totalList} onChange={e => setTotalList(e.target.value)} className="select select-bordered w-full select-sm dark:bg-zinc-800 bg-zinc-100">
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="my-3 opacity-0" />
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                <div className={` text-zinc-700`} id="content-print">
                    {printedData.map((value, index) => (
                        <div key={index} ref={componentPDF.current[index]} style={{ 
                            width: `${49.6 * 1.5}rem`, 
                            height: `${78 * 1.5}rem`,
                            fontFamily: jakarta.style.fontFamily
                        }} className={`bg-white flex-shrink-0 text-zinc-700 text-lg`}
                        >
                            <div className="flex items-center w-full px-20 pt-10">
                                <div className="w-fit flex items-center justify-start">
                                    <Image src={'/jabar.gif'} width={160} height={160} alt="Logo Jabar" />
                                </div>
                                <div className={`w-full font-bold tracking-tighter text-center space-y-1`}>
                                    <h1 className=" tracking-tighter text-center ">
                                        PEMERINTAH DAERAH PROVINSI JAWA BARAT
                                    </h1>
                                    <h2 className=" tracking-tighter text-center ">
                                        DINAS PENDIDIKAN
                                    </h2>
                                    <h3 className=" tracking-tighter text-center ">
                                        CABANG DINAS PENDIDIKAN WILAYAH VII
                                    </h3>
                                    <p className=" tracking-tighter text-center ">
                                        SMK PEKERJAAN UMUM NEGERI BANDUNG
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Jl. Garut No. 10 Telp./Fax (022) 7208317 BANDUNG 40271
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Website : <span className="italic text-blue-600 underline decoration-blue-600">http://www.smkpunegerijabar.sch.id</span>
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Email : <span className="italic text-blue-600 underline decoration-blue-600">info@smkpunegerijabar.sch.id</span>
                                    </p>
                                </div>
                                <div className="w-fit flex items-center justify-end">
                                    <Image src={'/logo-sekolah-2.png'} width={120} height={120} alt="logo sekolah" />
                                </div>
                            </div>
                            <div className="px-10 pt-5 mb-8">
                                <div className="w-full border-4 border-zinc-700"></div>
                            </div>
                            <h1 className="text-center font-extrabold text-lg">LEMBAR BUKU INDUK SMK</h1>
                            <h2 className="text-center font-extrabold text-lg">TAHUN PELAJARAN {value['tahun_masuk']}/{Number(value['tahun_masuk']) + 1}</h2>
                            <hr className="my-5 opacity-0" />
                            <div className="px-20 text-lg font-normal">
                                <div className="flex w-1/2 items-center gap-2 text-lg">
                                    <p className="w-2/3">Kompetensi Keahlian</p>
                                    <p className="w-1/3 font-medium">
                                        : {value['kelas']} {value['jurusan']} {value['rombel']}
                                    </p>
                                </div>
                                <div className="flex w-1/2 items-center gap-2 text-lg">
                                    <p className="w-2/3">No Induk Sekolah</p>
                                    <p className="w-1/3 font-medium">: {value.nis || '-'}</p>
                                </div>
                                <div className="flex w-1/2 items-center gap-2 text-lg">
                                    <p className="w-2/3">No Induk Siswa Nasional</p>
                                    <p className="w-1/3 font-medium">: {value.nisn || '-'}</p>
                                </div>
                                <hr className="my-3 opacity-0" />
                                <div className="px-10 text-lg">
                                    <div className="font-bold flex items-center gap-5">
                                        <p>A.</p>
                                        <p>KETERANGAN PRIBADI SISWA</p>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>1.</p>
                                                <p>Nama</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {value.nama_siswa || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>2.</p>
                                                <p>NIK</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {value.nik || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>3.</p>
                                                <p>Jenis Kelamin</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {value.jenis_kelamin || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>4.</p>
                                                <p>Tempat dan Tanggal Lahir</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {value.tempat_lahir || '-'}, {date_getDay(value['tanggal_lahir'])} {date_getMonth('string', value['tanggal_lahir'])} {date_getYear(value['tanggal_lahir'])}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>5.</p>
                                                <p>Agama</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {value.agama || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>6.</p>
                                                <p>Jumlah Saudara</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {value.jumlah_saudara || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>7.</p>
                                                <p>Anak ke</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {value.anak_ke || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>8.</p>
                                                <p className="">No Telp</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {value.no_hp_siswa || '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-0" />
                                    <div className="font-bold flex items-center gap-5">
                                        <p>B.</p>
                                        <p>KETERANGAN TEMPAT TINGGAL</p>
                                    </div>
                                    <div className="flex  gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex  gap-5 w-full">
                                            <div className="flex gap-5 w-1/3">
                                                <p>9.</p>
                                                <p>Alamat</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.alamat || '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-0" />
                                    <div className="font-bold flex items-center gap-5">
                                        <p>C.</p>
                                        <p>KETERANGAN SEKOLAH SEBELUMNYA</p>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>10.</p>
                                                <p>Asal Sekolah</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.asal_sekolah || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>11.</p>
                                                <p>Tahun Masuk</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.tahun_masuk || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>12.</p>
                                                <p>Jalur Masuk</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.kategori || '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-0" />
                                    <div className="font-bold flex items-center gap-5">
                                        <p>D.</p>
                                        <p>KETERANGAN ORANG TUA KANDUNG</p>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>13.</p>
                                                <p>Nama Ayah</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.nama_ayah || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>14.</p>
                                                <p>Pekerjaan Ayah</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.pekerjaan_ayah || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>15.</p>
                                                <p>No Telp Ayah</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.telp_ayah || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>16.</p>
                                                <p>Nama Ibu</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.nama_ibu || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>17.</p>
                                                <p>Pekerjaan Ibu</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.pekerjaan_ibu || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>18.</p>
                                                <p>No Telp Ibu</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.telp_ibu || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>19.</p>
                                                <p>No Kartu Keluarga</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.no_kk || '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-0" />
                                    <div className="font-bold flex items-center gap-5">
                                        <p>D.</p>
                                        <p>KETERANGAN WALI</p>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>20.</p>
                                                <p>Nama Wali</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.nama_wali || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>21.</p>
                                                <p>Pekerjaan Wali</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.pekerjaan_wali || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>22.</p>
                                                <p>No Telp Wali</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {value.telp_wali || '-'}</p>
                                        </div>
                                    </div>
                                    
                                    <hr className="my-3 opacity-0" />
                                    <div className="flex items-center w-full gap-5 h-full">
                                        <div className="w-1/2 h-full"></div>
                                        <div className="w-1/2 flex items-center justify-center gap-5 h-full">
                                            <div className="w-[113.39px] h-[151.18px] border-2 border-zinc-700 flex items-center justify-center  font-bold flex-shrink-0">
                                                <p className="text-zinc-500/0 text-3xl">3x4</p>
                                            </div>
                                            <div className="w-full flex flex-col justify-between h-60 ">
                                                <p className="text-center">
                                                    Bandung, ...................................
                                                </p>
                                                <p className="text-center font-bold">
                                                    {value['nama_siswa']}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>  
        </MainLayoutPage>
    )
}