'use client'

import { faAnglesLeft, faAnglesRight, faArrowDown, faArrowRight, faArrowUp, faBook, faCheck, faCheckCircle, faCheckSquare, faClock, faCogs, faDownload, faEdit, faFile, faFilter, faInfoCircle, faLayerGroup, faLink, faPlus, faPowerOff, faSave, faSearch, faSpinner, faTrash, faUpload, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import { M_MataPelajaran_create, M_MataPelajaran_delete, M_MataPelajaran_getAll, M_MataPelajaran_update } from "@/lib/model/mataPelajaranModel"
import { xlsx_getData, xlsx_getSheets } from "@/lib/xlsxLibs"
import MainLayoutPage from "@/components/mainLayout"
import ReactDOM from 'react-dom'
import { M_Kategori_MataPelajaran_create, M_Kategori_MataPelajaran_delete, M_Kategori_MataPelajaran_getAll, M_Kategori_MataPelajaran_update } from "@/lib/model/kategoriMataPelajaranModel"
import { date_getDay, date_getMonth, date_getYear } from "@/lib/dateConvertes"
import { M_Template_Kategori_Mapel_ascend_mapel, M_Template_Kategori_Mapel_assign_mapel, M_Template_Kategori_Mapel_create, M_Template_Kategori_Mapel_delete, M_Template_Kategori_Mapel_delete_mapel, M_Template_Kategori_Mapel_descend_mapel, M_Template_Kategori_Mapel_edit, M_Template_Kategori_Mapel_edit_mapel, M_Template_Kategori_Mapel_getAll } from "@/lib/model/templateKategoriMataPelajaranModel"
import AdvanceSelect from "@/components/advanceSelect"

const formatForm = {
    nama_mapel: '',
    is_parent: true,
    parent_from_id_mapel: '',
    is_mapel: false,
    aktif: false    
}

const allowedMimeType = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]



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

export default function MataPelajaranPage() {
    const router = useRouter()

    // DATA KATEGORI MAPEL
    const [dataKategoriMapel, setDataKategoriMapel] = useState([])
    const [filteredDataKategoriMapel, setFilteredDataKategoriMapel] = useState([])
    const [loadingFetchKategoriMapel, setLoadingFetchKategoriMapel] = useState('')
    const [filterDataKategoriMapel, setFilterDataKategoriMapel] = useState({
        aktif: []
    })
    const [selectedDataKategoriMapel, setSelectedDataKategoriMapel] = useState([])
    const [selectAllKategoriMapel, setSelectAllKategoriMapel] = useState(false)
    const [totalListKategoriMapel, setTotalListKategoriMapel] = useState(10)
    const [paginationKategoriMapel, setPaginationKategoriMapel] = useState(1)
    const [searchDataKategoriMapel, setSearchDataKategoriMapel] = useState('')

    // DATA MAPEL
    const [dataMapel, setDataMapel] = useState([])
    const [formTambah, setFormTambah] = useState(formatForm)
    const [loadingFetch, setLoadingFetch] = useState('')
    const [filteredDataMapel, setFilteredDataMapel] = useState([])
    const [searchDataMapel, setSearchDataMapel] = useState('')
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedDataMapel, setSelectedDataMapel] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [filterDataMapel, setFilterDataMapel] = useState({
        jurusan_mapel: [], kategori_mapel: [], parent_from_id_mapel: [], aktif: []
    })
    const [namaSheet, setNamaSheet] = useState('')
    const [listSheet, setListSheet] = useState([])
    const [fileData, setFileData] = useState(null)

    // DATA TEMPLATE KATEGORI
    const [dataTemplate, setDataTemplate] = useState([])
    const [loadingFetchDataTemplate, setLoadingFetchDataTemplate] = useState('')
    const [searchTemplate, setSearchTemplate] = useState({
        tahun_angkatan: date_getYear(),
        jurusan: '',
        kelas: ''
    })
    const [submittedTemplate, setSubmittedTemplate] = useState({
        submit: false,
        tahun_angkatan: '',
        jurusan: '',
        kelas: ''
    })

    const getDataMapel = async () => {
        setLoadingFetch('loading')
        const response = await M_MataPelajaran_getAll()

        if(response.success) {
            setDataMapel(response.data)
            setFilteredDataMapel(response.data)
        }
        setLoadingFetch('fetched')
    }
    const getKategori = async () => {
        setLoadingFetchKategoriMapel(state => 'loading')
        const response = await M_Kategori_MataPelajaran_getAll()
        if(response.success) {
            setDataKategoriMapel(response.data)
            setFilteredDataKategoriMapel(response.data)
        }
        setLoadingFetchKategoriMapel(state => 'fetched')
    }

    const submitTemplate = async (e) => {
        e.preventDefault()

        
        const tahun_angkatan = e.target[0].value
        const jurusan = e.target[1].value
        const kelas = e.target[2].value

        setSubmittedTemplate({
            submit: true, tahun_angkatan, jurusan, kelas
        })
        
        if(tahun_angkatan === '') {
            return
        }

        const response = await M_Template_Kategori_Mapel_getAll(tahun_angkatan, jurusan, kelas)

        setLoadingFetchDataTemplate(state => 'loading')
        

        console.log(response)
        
        if(response.success) {
            setDataTemplate(response.data)
        }

        setLoadingFetchDataTemplate(state => 'fetched')
    }

    const getTemplate = async () => {
    
        const tahun_angkatan = submittedTemplate['tahun_angkatan']
        const jurusan = submittedTemplate['jurusan']
        const kelas = submittedTemplate['kelas']
        
        if(tahun_angkatan === '') {
            return
        }

        const response = await M_Template_Kategori_Mapel_getAll(tahun_angkatan, jurusan, kelas)

        setLoadingFetchDataTemplate(state => 'loading')

        console.log(response)
        
        if(response.success) {
            setDataTemplate(response.data)
        }

        setLoadingFetchDataTemplate(state => 'fetched')
    }

    useEffect(() => {
        getKategori()
        getDataMapel()
    }, [])

    const submitTambah = async (e, modal) => {
        e.preventDefault()

        if(Object.values(formTambah).includes(undefined)) {
            return
        }

        showModal(modal).show('hide')

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await M_MataPelajaran_create(formTambah)
                if(response.success) {
                    setSelectedDataMapel([])
                    setSelectAll(false)
                    setFormTambah(formatForm)
                    await getDataMapel()
                    Swal.fire({
                        title: 'Sukses',
                        text: response.message,
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: response.message,
                        icon: 'error'
                    })
                }
            }
        })
    }

    const handleFilterDataMapel = (kolom, value) => {
        setFilterDataMapel(state => {
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

    const handleFilterKategoriDataMapel = async (kolom, value) => {
        setFilterDataKategoriMapel(state => {
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

    const submitDeleteMapel = async (id_mapel) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Jika terdapat Nilai yang berhubungan dengan Mata Pelajaran tersebut, Nilai tersebut akan ikut dihapus!',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(answer => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 60000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: async () => {
                        const response = await M_MataPelajaran_delete(id_mapel ? id_mapel : selectedDataMapel)

                        if(response.success) {
                            setSelectedDataMapel([])
                            setSelectAll(false)
                            await getDataMapel()
                            Swal.fire({
                                title: 'Sukses',
                                text: response.message,
                                icon: 'success'
                            })
                        }else{
                            Swal.fire({
                                title: 'Gagal',
                                text: response.message,
                                icon: 'error'
                            })
                        }
                    }
                })
            }
        })
    }

    const handleSelectDataMapel = (id_mapel) => {
        setSelectedDataMapel(state => {
            if(state.includes(id_mapel)) {
                return state.filter(value => value !== id_mapel)
            }else{
                return [...state, id_mapel]
            }
        })
    }

    useEffect(() => {
        if(selectAll) {
            setSelectedDataMapel(filteredDataMapel.map(value => value['id_mapel']))
        }else{
            setSelectedDataMapel([])
        }
    }, [selectAll])

    const submitEditDataMapel = (e, modal, id_mapel) => {
        e.preventDefault()

        const payload = {
            nama_mapel: e.target[0].value,
            is_parent: e.target[1].checked,
            parent_from_id_mapel: e.target[1].checked === false ? e.target[2].value : '',
            is_mapel: e.target[3].checked,
            aktif: e.target[4].checked
        }

        if(payload['is_parent'] === false && payload['parent_from_id_mapel'] === '') {
            return
        }

        showModal(modal).show('hide')

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await M_MataPelajaran_update(id_mapel, payload)

                if(response.success) {
                    setSelectedDataMapel([])
                    setSelectAll(false)
                    await getDataMapel()
                    Swal.fire({
                        title: 'Sukses',
                        text: response.message,
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: response.message,
                        icon: 'error'
                    }).then(() => {
                        showModal(modal).show('show')
                    })
                }
            }
        })
    }

    useEffect(() => {
        let updatedData = dataMapel

        if(filterDataMapel['jurusan_mapel'].length > 0) {
            updatedData = updatedData.filter(v => filterDataMapel['jurusan_mapel'].includes(v['jurusan_mapel']))
        }

        if(filterDataMapel['kategori_mapel'].length > 0) {
            updatedData = updatedData.filter(v => filterDataMapel['kategori_mapel'].includes(v['kategori_mapel']))
        }

        if(filterDataMapel['parent_from_id_mapel'].length > 0) {
            updatedData = updatedData.filter(v => filterDataMapel['parent_from_id_mapel'].includes(v['parent_from_id_mapel']))
        }

        if(filterDataMapel['aktif'].length > 0) {
            updatedData = updatedData.filter(v => filterDataMapel['aktif'].includes(v['aktif']))
        }

        if(searchDataMapel !== '') {
            updatedData = updatedData.filter(v => 
                v['nama_mapel'].toLowerCase().includes(searchDataMapel.toLowerCase())
            )
        }

        setFilteredDataMapel(updatedData)


    }, [filterDataMapel, searchDataMapel])

    const handleChangeFile = async (file) => {
        if(file) {
            setFileData(file)

            const fileName = file.name
            const fileExtension = fileName.split('.').pop()
            if(fileExtension === 'xlsx'){
                const sheets = await xlsx_getSheets(file)
                setNamaSheet('')
                setListSheet(Object.keys(sheets))
            }else{
                setNamaSheet('')
                setListSheet([])
            }
        }else{
            setListSheet([])
        }
    }

    const tambah_kategori_button_ref = useRef(null)

    const submitImportFile = async (e, modal) => {
        e.preventDefault()

        const fileData = e.target[0].files[0]
        if(!allowedMimeType.includes(fileData.type)) {
            return
        }

        if(namaSheet === '') {
            return
        }

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const responseImport = await xlsx_getData(fileData, namaSheet)
                if(responseImport.success) {
                    const data = responseImport.data
                    const formattedData = data.map(value => ({
                        ...value,
                        is_mapel: value['is_mapel'] === 1 ? true : false,
                        is_parent: value['is_parent'] === 1 ? true : false,
                        aktif: value['aktif'] === 1 ? true : false,
                    }))
                    
                    const response = await M_MataPelajaran_create(formattedData)
                    if(response.success) {
                        await getDataMapel()
                        Swal.fire({
                            title: 'Sukses',
                            text: 'Berhasil mengimport data mata pelajaran',
                            icon: 'success',
                            timer: 6000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        })
                    }else{
                        Swal.fire({
                            title: 'Gagal',
                            text: 'Terdapat kesalahan disaat memproses data, hubungi Administrator',
                            icon: 'error'
                        }).then(() => {
                            document.getElementById(modal).showModal()
                        })
                    }
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat kesalahan disaat memproses data, hubungi Administrator',
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const submitTambahKategori = async (e, modalParent = '') => {
        e.preventDefault()

        document.getElementById('tambah_kategori').close()

        const jsonBody = {
            nama_kategori: e.target[0].value
        }

        console.log(jsonBody)

        Swal.fire({
            title: 'Sedang memproses data',
            showConfirmButton: false,
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await M_Kategori_MataPelajaran_create(jsonBody)

                if(!response.success) {
                    console.log(response.message)
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Gagal memproses data, hubungi administrator'
                    }).then(() => {

                        document.getElementById('tambah_kategori').showModal()
                    })
                }else{
                    await getKategori()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menambahkan kategori baru'
                    }).then(() => {
                        e.target[0].value = ''
                        document.getElementById('tambah_kategori').showModal()
                    })
                }
            }
        })
    }

    const submitEditKategori = async (e, modal, id_kategori_mapel) => {
        e.preventDefault()

        document.getElementById(modal).close()

        const payload = {
            nama_kategori: e.target[0].value
        }

        Swal.fire({
            title: 'Sedang memproses data',
            showConfirmButton: false,
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await M_Kategori_MataPelajaran_update(Number(id_kategori_mapel), payload)

                if(!response.success) {
                    console.log(response.message)
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Gagal memproses data, hubungi administrator'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }else{
                    await getKategori()
                    await getDataMapel()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil mengubah kategori'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const submitDeleteKategori = async (id_kategori_mapel) => {
        Swal.fire({
            title: 'Sedang memproses data',
            showConfirmButton: false,
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await M_Kategori_MataPelajaran_delete( id_kategori_mapel ? Number(id_kategori_mapel) : selectedDataKategoriMapel)

                if(!response.success) {
                    console.log(response.message)
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Gagal memproses data, hubungi administrator'
                    })
                }else{
                    await getKategori()
                    setSelectAllKategoriMapel(false)
                    setSelectedDataKategoriMapel([])
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil menghapus kategori'
                    })
                }
            }
        })
    }

    const submitToggleKategori = async (id_kategori_mapel, status) => {
        let payload
        if(status) {
            payload = {
                aktif: 0
            }
        }else{
            payload = {
                aktif: 1
            }
        }

        Swal.fire({
            title: 'Sedang memproses data',
            showConfirmButton: false,
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await M_Kategori_MataPelajaran_update(Number(id_kategori_mapel), payload)

                if(!response.success) {
                    console.log(response.message)
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Gagal memproses data, hubungi administrator'
                    })
                }else{
                    await getKategori()
                    Swal.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: 'Berhasil mengubah status kategori'
                    })
                }
            }
        })
    }

    const handleSelectedDataKategoriMapel = async (id_kategori_mapel) => {
        setSelectedDataKategoriMapel(state => {
            if(state.includes(id_kategori_mapel)) {
                return state.filter(value => value !== id_kategori_mapel)
            }else{
                return [...state, id_kategori_mapel]
            }
        })
    }

    useEffect(() => {
        if(filteredDataKategoriMapel.length > 0) {
            if(selectedDataKategoriMapel.length >= filteredDataKategoriMapel.length) {
                setSelectAllKategoriMapel(true)
            }else{
                setSelectAllKategoriMapel(false)
            }
        }
    }, [selectedDataKategoriMapel])

    useEffect(() => {
        if(!selectAllKategoriMapel) {
            setSelectedDataKategoriMapel([])
        }else{
            setSelectedDataKategoriMapel(filteredDataKategoriMapel.map(value => value['id_kategori_mapel']))
        }
    }, [selectAllKategoriMapel])

    useEffect(() => {
        let updatedData = dataKategoriMapel

        if(filterDataKategoriMapel.aktif.length > 0) {
            updatedData = updatedData.filter(value => filterDataKategoriMapel.aktif.includes(value['aktif']))
        }

        if(searchDataKategoriMapel !== '') {
            updatedData = updatedData.filter(value => value['nama_kategori'].toLowerCase().includes(searchDataKategoriMapel.toLowerCase()))
        }

        setFilteredDataKategoriMapel(updatedData)

    }, [searchDataKategoriMapel, filterDataKategoriMapel])

    // TEMPLATE KATEGORI
    const submitTambahTemplate = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()
        const payload = {
            no_urut: e.target[1].value,
            fk_kategori_id_kategori_mapel: e.target[0].value,
            tahun_angkatan: submittedTemplate['tahun_angkatan'],
            jurusan: submittedTemplate['jurusan'],
            kelas: submittedTemplate['kelas']
        }

        Swal.fire({
            title: "Sedang memproses data",
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            showConfirmButton: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                const response = await M_Template_Kategori_Mapel_create(payload)

                if(response.success) {
                    await getDataMapel()
                    await getTemplate()

                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil menambahkan template kategori baru',
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: "Error",
                        text: 'Terdapat error saat memproses data, hubungi Administrator',
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const editKategoriTemplate = async (e, modal, no) => {
        e.preventDefault()
        document.getElementById(modal).close()

        const payload = {
            fk_kategori_id_kategori_mapel: e.target[1].value,
            no_urut: e.target[2].value
        }

        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                try {
                    const response = await M_Template_Kategori_Mapel_edit(no, payload)

                    await getTemplate()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah template kategori tersebut',
                        icon: 'success'
                    })
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: 'Terdapat error saat memproses data, hubungi Administrator',
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const deleteKategoriTemplate = async (no) => {
        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                try {
                    const response = await M_Template_Kategori_Mapel_delete(no)

                    await getTemplate()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil menghapus template kategori tersebut',
                        icon: 'success'
                    })
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: 'Terdapat error saat memproses data, hubungi Administrator',
                        icon: 'error'
                    })
                }
            }
        })
    }


    // TEMPLATE MAPEL
    const submitAssignMapelTemplate = async (e, modal, no) => {
        e.preventDefault()

        const payload = {
            fk_mapel_id_mapel: Number(e.target[1].value),
            no_urut: Number(e.target[2].value),
            fk_no_template_kategori: Number(no)
        }

        document.getElementById(modal).close()

        Swal.fire({
            title: "Sedang memproses data",
            timer: 60000,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await M_Template_Kategori_Mapel_assign_mapel(payload)

                if(response.success) {
                    await getTemplate()
                    e.target[1].value = ''
                    e.target[2].value = ''
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil assign Mata Pelajaran ke dalam template kategori tersebut',
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat error disaat memproses data, hubungi Administrator',
                        icon: 'error'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })
    }

    const deleteMapelTemplate = async (no_template_mapel) => {
        Swal.fire({
            title: 'Sedang memproses data',
            timer: 60000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await M_Template_Kategori_Mapel_delete_mapel(Number(no_template_mapel))

                if(response.success) {
                    await getTemplate()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil menghapus mata pelajaran dari Template tersebut',
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat Error disaat memproses data, hubungi Administrator',
                        icon: 'error'
                    })
                }
            }
        })
    }

    const editMapelTemplate = async (e, modal, no) => {
        e.preventDefault()

        const payload = {
            fk_mapel_id_mapel: Number(e.target[1].value),
            no_urut: Number(e.target[2].value)
        }

        document.getElementById(modal).close()

        Swal.fire({
            title: "Sedang memproses data",
            timer: 60000,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            didOpen: async () => {
                const response = await M_Template_Kategori_Mapel_edit_mapel(Number(no), payload)

                if(response.success) {
                    await getTemplate()
                    e.target[1].value = ''
                    e.target[2].value = ''
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil ubah Mata Pelajaran di dalam template kategori tersebut',
                        icon: 'success'
                    })
                }else{
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terdapat error disaat memproses data, hubungi Administrator'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }
            }
        })

        

    }

    return (
        <MainLayoutPage>
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md">
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 text-inherit opacity-50" />
                    <h1 className="font-medium">
                        Daftar Kategori Mata Pelajaran
                    </h1>
                </div>
                <hr className="my-5 dark:opacity-10" />
                <div className="text-xs">
                    <button type="button" onClick={() => document.getElementById('tambah_kategori').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                        <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit opacity-70" />
                        Tambah
                    </button>
                    <dialog id="tambah_kategori" className="modal backdrop-blur">
                        <div className="modal-box rounded-md border dark:border-zinc-700 dark:bg-zinc-900 md:max-w-[50rem]">
                            <h3 className="font-bold text-lg">Tambah Kategori Baru</h3>
                            <hr className="my-2 opacity-0" />
                            <form onSubmit={e => submitTambahKategori(e)} className="space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                    <p className="opacity-60 w-full md:w-1/3">
                                        Nama Kategori Mata Pelajaran
                                    </p>
                                    <div className="w-full md:w-2/3">
                                        <input type="text" required className="input input-bordered input-sm w-full dark:bg-zinc-800" placeholder="Masukkan nama kategori" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" ref={tambah_kategori_button_ref}>
                                    <button type="submit" className="px-3 py-2 rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center w-1/2 md:w-fit gap-3">
                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit opacity-60" />
                                        Simpan
                                    </button>
                                    <button type="button" onClick={() => document.getElementById('tambah_kategori').close()} className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center w-1/2 md:w-fit gap-3">
                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit opacity-60" />
                                        Batal
                                    </button>
                                </div>
                            </form>

                        </div>
                    </dialog>
                    <hr className="my-5 dark:opacity-10" />
                    {dataKategoriMapel.length > 0 && (
                        <>
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faFilter} className="w-3 h-3 text-inherit" />
                                Filter Data
                            </div>
                            <hr className="my-1 opacity-0" />
                            <div className="flex md:flex-row flex-col gap-3">
                                <FontAwesomeIcon icon={faFilter} className="w-3 h-3 text-inherit opacity-0 hidden md:block" />
                                <div className="space-y-3 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                        <div className="w-full md:w-1/6 opacity-60">
                                            Status
                                        </div>
                                        <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                            {Array.from(new Set(dataKategoriMapel.map(value => value['aktif']))).map((value, index) => (
                                                <button key={index} type="button" onClick={() => handleFilterKategoriDataMapel('aktif', value)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataKategoriMapel.aktif.includes(value) ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                                    {value ? 'Aktif' : 'Tidak Aktif'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <hr className="my-5 dark:opacity-10" />
                    <div className="grid grid-cols-12 gap-2 p-3 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                        <div className="flex items-center gap-3 col-span-7 md:col-span-3">
                            <input type="checkbox" checked={selectAllKategoriMapel} onChange={() => setSelectAllKategoriMapel(state => !state)} />
                            Nama Kategori
                        </div>
                        <div className="hidden md:flex items-center col-span-1">
                            ID
                        </div>
                        <div className="hidden md:flex items-center col-span-2">
                            Status
                        </div>
                        <div className="hidden md:flex items-center col-span-3">
                            Tanggal Mutasi
                        </div>
                        <div className="flex items-center justify-center col-span-5 md:col-span-3">
                            <input type="text" value={searchDataKategoriMapel} onChange={e => setSearchDataKategoriMapel(e.target.value)} className="px-2 py-1 rounded border dark:border-zinc-700 w-full bg-white dark:bg-zinc-900" placeholder="Cari disini" />
                        </div>
                    </div>
                    {loadingFetchKategoriMapel !== 'fetched' && (
                        <div className="py-2 flex justify-center items-center gap-3">
                            <div className="loading loading-spinner loading-sm opacity-50"></div>
                        </div>
                    )}
                    {loadingFetchKategoriMapel === 'fetched' && dataKategoriMapel.length < 1 && (
                        <div className="py-2 flex justify-center items-center gap-3 italic opacity-50">
                            Data Kategori Mata Pelajaran kosong
                        </div>
                    )}
                    <div className="py-2 relative overflow-auto max-h-[300px]">
                        {filteredDataKategoriMapel.map((value, index) => (
                            <div key={`kategori_${value['id_kategori_mapel']}`} className="grid grid-cols-12 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="col-span-7 md:col-span-3 flex items-center gap-3">
                                    <input type="checkbox" checked={selectedDataKategoriMapel.includes(value['id_kategori_mapel'])} onChange={() => handleSelectedDataKategoriMapel(value['id_kategori_mapel'])} />
                                    {value['nama_kategori']}
                                </div>
                                <div className="hidden md:flex items-center gap-3">
                                    {value['id_kategori_mapel']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['aktif'] ? (
                                        <div className="flex items-center gap-2 text-green-500">
                                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit" />
                                            Aktif
                                        </div>
                                    ):(
                                        <div className="flex items-center gap-2 text-red-500">
                                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                            Tidak Aktif
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3 hidden md:flex items-center gap-3">
                                    <div className="w-1/2">
                                        <p className="opacity-60">
                                            Dibuat pada tanggal
                                        </p>
                                        <p>
                                            {date_getDay(value['createdAt'].split('T')[0])} {date_getMonth('string', value['createdAt'].split('T')[0])} {date_getYear(value['createdAt'].split('T')[0])}
                                        </p>
                                    </div>
                                    <div className="w-1/2">
                                        <p className="opacity-60">
                                            Diupdate pada tanggal
                                        </p>
                                        <p>
                                            {date_getDay(value['updatedAt'].split('T')[0])} {date_getMonth('string', value['updatedAt'].split('T')[0])} {date_getYear(value['updatedAt'].split('T')[0])}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-5 md:col-span-3 flex items-center gap-1 md:gap-3 justify-center">
                                    <button type="button" onClick={() => document.getElementById(`info_kategori_${value['id_kategori_mapel']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 md:hidden flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`info_kategori_${value['id_kategori_mapel']}`} className="modal backdrop-blur">
                                        <div className="modal-box rounded-md border dark:border-zinc-700 dark:bg-zinc-900 md:max-w-[50rem]">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Info Kategori</h3>
                                            <hr className="my-2 opacity-0" />
                                            <div className="space-y-3">
                                                <div className="flex flex-col md:flex-row md:items-center">
                                                    <p className="w-full md:w-1/4 opacity-60">
                                                        Nama Kategori
                                                    </p>
                                                    <p className="w-full md:w-3/4">
                                                        {value['nama_kategori']}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center">
                                                    <p className="w-full md:w-1/4 opacity-60">
                                                        Status
                                                    </p>
                                                    <div className="w-full md:w-3/4">
                                                        {value['aktif'] ? (
                                                            <div className="flex items-center gap-2 text-green-500">
                                                                <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit" />
                                                                Aktif
                                                            </div>
                                                        ):(
                                                            <div className="flex items-center gap-2 text-red-500">
                                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                                                Tidak Aktif
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center">
                                                    <p className="w-full md:w-1/4 opacity-60">
                                                        Dibuat pada tanggal
                                                    </p>
                                                    <p className="w-full md:w-3/4">
                                                        {date_getDay(value['createdAt'].split('T')[0])} {date_getMonth('string', value['createdAt'].split('T')[0])} {date_getYear(value['createdAt'].split('T')[0])}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center">
                                                    <p className="w-full md:w-1/4 opacity-60">
                                                        Diubah pada tanggal
                                                    </p>
                                                    <p className="w-full md:w-3/4">
                                                        {date_getDay(value['updatedAt'].split('T')[0])} {date_getMonth('string', value['updatedAt'].split('T')[0])} {date_getYear(value['updatedAt'].split('T')[0])}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => document.getElementById(`ubah_kategori_${value['id_kategori_mapel']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`ubah_kategori_${value['id_kategori_mapel']}`} className="modal backdrop-blur">
                                        <div className="modal-box rounded-md border dark:border-zinc-700 dark:bg-zinc-900 md:max-w-[50rem]">
                                            <h3 className="font-bold text-lg">Ubah Kategori</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={e => submitEditKategori(e, `ubah_kategori_${value['id_kategori_mapel']}`, value['id_kategori_mapel'])} className="space-y-2">
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="opacity-60 w-full md:w-1/3">
                                                        Nama Kategori Mata Pelajaran
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input type="text" defaultValue={value['nama_kategori']} required className="input input-bordered input-sm w-full dark:bg-zinc-800" placeholder="Masukkan nama kategori" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2" ref={tambah_kategori_button_ref}>
                                                    <button type="submit" className="px-3 py-2 rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center w-1/2 md:w-fit gap-3">
                                                        <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit opacity-60" />
                                                        Simpan
                                                    </button>
                                                    <button type="button" onClick={() => document.getElementById(`ubah_kategori_${value['id_kategori_mapel']}`).close()} className="px-3 py-2 rounded-md border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center w-1/2 md:w-fit gap-3">
                                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit opacity-60" />
                                                        Batal
                                                    </button>
                                                </div>
                                            </form>

                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => submitDeleteKategori(value['id_kategori_mapel'])} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <button type="button" onClick={() => submitToggleKategori(value['id_kategori_mapel'], value['aktif'])} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-xs">
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                <FontAwesomeIcon icon={faCheckSquare} className="w-3 h-3 text-inherit" />
                                {selectedDataKategoriMapel.length} Data
                            </div>
                            {selectedDataKategoriMapel.length > 0 && (
                                <div className="flex items-center justify-center w-full md:w-fit gap-3 px-3">
                                    <button type="button" onClick={() => submitDeleteKategori()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            )}
                            <p className="pl-3  w-full md:w-fit">
                                Total {dataKategoriMapel.length} Data
                            </p>
                        </div>
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                <button type="button" onClick={() => setPaginationKategoriMapel(state => state > 1 ? state - 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesLeft} className="w-3 h-3 text-inherit" />
                                </button>
                                {pagination}
                                <button type="button" onClick={() => setPaginationKategoriMapel(state => state < Math.ceil(dataKategoriMapel.length / totalListKategoriMapel) ? state + 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesRight} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 pl-3  w-full md:w-fit">
                                <select value={totalListKategoriMapel} onChange={e => setTotalListKategoriMapel(e.target.value)} className="select select-bordered w-full select-sm dark:bg-zinc-800 bg-zinc-100">
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
            <hr className="my-2 opacity-0" />
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md">
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faBook} className="w-4 h-4 text-inherit opacity-50" />
                    <h1 className="font-medium">
                        Daftar Mata Pelajaran
                    </h1>
                </div>
                <hr className="my-5 dark:opacity-10" />
                <div className="text-xs">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => document.getElementById('tambah_mapel').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit opacity-70" />
                            Tambah
                        </button>
                        <dialog id="tambah_mapel" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 md:max-w-[700px] rounded border dark:border-zinc-800">
                                <form method="dialog">
                                    <button onClick={() => setFormTambah(formatForm)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Tambah Mata Pelajaran</h3>
                                <hr className="my-2 opacity-0" />
                                <form onSubmit={e => submitTambah(e, 'tambah_mapel')} className="flex flex-col md:flex-row gap-2">
                                    <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                        
                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                            <p className="w-full md:w-1/3 opacity-70">
                                                Nama
                                            </p>
                                            <div className="w-full md:w-2/3">
                                                <input type="text"  required value={formTambah['nama_mapel']} onChange={e => setFormTambah(state => ({...state, nama_mapel: e.target.value}))} placeholder="Nama Mata Pelajaran" className="input input-bordered w-full input-sm dark:bg-zinc-800 bg-zinc-100" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                            <p className="w-full md:w-1/3 opacity-70">
                                                Apakah Induk?
                                            </p>
                                            <div className="w-full md:w-2/3 flex items-center gap-3">
                                            Tidak
                                                <input type="checkbox" checked={formTambah['is_parent']} onChange={e => setFormTambah(state => ({...state, is_parent: !state.is_parent}))}  className="toggle toggle-success toggle-sm" />
                                                Ya
                                            </div>
                                        </div>
                                        {!formTambah['is_parent'] && (
                                            <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                <p className="w-full md:w-1/3 opacity-70">
                                                    Induk dari
                                                </p>
                                                <div className="w-full md:w-2/3">
                                                    <select required value={formTambah['parent_from_id_mapel']} onChange={e => setFormTambah(state => ({...state, parent_from_id_mapel: e.target.value}))}  className="select select-bordered w-full select-sm dark:bg-zinc-800 bg-zinc-100">
                                                        <option value={''} disabled >-- Pilih Mata Pelajaran --</option>
                                                        {dataMapel.map((value, index) => (
                                                            <option key={index} value={value['id_mapel']}>{value['nama_mapel']}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                            <p className="w-full md:w-1/3 opacity-70">
                                                Memiliki Daftar Nilai?
                                            </p>
                                            <div className="w-full md:w-2/3 flex items-center gap-3">
                                                Tidak
                                                <input type="checkbox" checked={formTambah['is_mapel']} onChange={e => setFormTambah(state => ({...state, is_mapel: !state.is_mapel}))}  className="toggle toggle-success toggle-sm" />
                                                Ya
                                            </div>
                                        </div>
                                        {formTambah['is_mapel'] && (
                                            <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                <p className="w-full md:w-1/3 opacity-70">
                                                    Aktif
                                                </p>
                                                <div className="w-full md:w-2/3 flex items-center gap-3">
                                                    Tidak
                                                    <input type="checkbox"  checked={formTambah['is_mapel'] ? formTambah['aktif'] : true} onChange={e => setFormTambah(state => ({...state, aktif: !state.aktif}))}  className="toggle toggle-success toggle-sm" />
                                                    Ya
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="py-3 px-2">
                                            <button type="submit" className="px-3 py-2 rounded bg-green-600 hover:bg-green-400 focus:bg-green-700 flex items-center justify-center w-fit gap-3 text-white">
                                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                Simpan
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </dialog>
                        
                        <button type="button" onClick={() => document.getElementById('import_mapel').showModal()} className="w-full md:w-fit px-3 py-2 rounded border dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-center items-center gap-3 font-medium ease-out duration-300">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit opacity-70" />
                            Import
                        </button>
                        <dialog id="import_mapel" className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                            <div className="modal-box bg-white dark:bg-zinc-900 md:max-w-[700px] rounded border dark:border-zinc-800">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Import Mata Pelajaran</h3>
                                <hr className="my-2 opacity-0" />
                                <p className="opacity-60">
                                    File harus <span className="opacity-100">.xlsx</span> atau .csv
                                </p>
                                <hr className="my-1 opacity-0" />
                                <form onSubmit={e => submitImportFile(e, 'import_mapel')}>
                                    <input type="file" required onChange={e => handleChangeFile(e.target.files[0])} className="file-input file-input-ghost file-input-bordered file-input-sm w-full" />
                                    <hr className="my-2 opacity-0" />
                                    <select value={namaSheet} onChange={e => setNamaSheet(e.target.value)} className="px-3 py-2 rounded-md border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                        <option value="" disabled>-- Pilih Sheet --</option>
                                        {listSheet.map((value, index) => (
                                            <option key={index} value={value}>{value}</option>
                                        ))}
                                    </select>
                                    <hr className="my-2 opacity-0" />
                                    <div className="flex items-center gap-2">
                                        <button type="submit" className="px-3 py-2 flex items-center justify-center w-full md:w-fit gap-3 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3 text-inherit" />
                                            Import
                                        </button>
                                        <button type="button" className="px-3 py-2 flex items-center justify-center w-full md:w-fit gap-3 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </dialog>
                    </div>
                    {dataMapel.length > 0 && (
                        <>
                            <hr className="my-5 dark:opacity-10" />
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faFilter} className="w-3 h-3 text-inherit" />
                                Filter Data
                            </div>
                            <hr className="my-1 opacity-0" />
                            <div className="flex md:flex-row flex-col gap-3">
                                <FontAwesomeIcon icon={faFilter} className="w-3 h-3 text-inherit opacity-0 hidden md:block" />
                                <div className="space-y-3 w-full">
                                    
                                    {Array.from(new Set(dataMapel.filter(value => !value['is_parent']).map(value => value['parent_from_id_mapel']))).length > 0 && (
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                            <div className="w-full md:w-1/6 opacity-60">
                                                Induk dari
                                            </div>
                                            <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                                {Array.from(new Set(dataMapel.filter(value => !value['is_parent']).map(value => value['parent_from_id_mapel']))).map((value, index) => (
                                                    <button key={index} type="button" onClick={() => handleFilterDataMapel('parent_from_id_mapel', value)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataMapel.parent_from_id_mapel.includes(value) ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                                        {dataMapel.find(v => v['id_mapel'] == value)['nama_mapel']}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                        <div className="w-full md:w-1/6 opacity-60">
                                            Status
                                        </div>
                                        <div className="w-full md:w-5/6 flex items-center gap-2 relative overflow-auto">
                                            {Array.from(new Set(dataMapel.map(value => value['aktif']))).map((value, index) => (
                                                <button key={index} type="button" onClick={() => handleFilterDataMapel('aktif', value)} className={`flex flex-shrink-0 items-center w-fit gap-3 px-3 py-2 rounded-md ${filterDataMapel.aktif.includes(value) ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                                    {value === 1 ? 'Aktif' : 'Tidak Aktif'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                            </div>
                        </>
                    )}
                    <hr className="my-5 dark:opacity-10" />
                    <div className="relative overflow-auto w-full max-h-[400px] text-xs">
                        <div className="grid grid-cols-12 p-3 rounded-lg border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 sticky top-0 mb-2">
                            <div className="col-span-7 md:col-span-4 flex items-center gap-3">
                                <input type="checkbox" checked={selectAll} onChange={() => setSelectAll(state => !state)} className="cursor-pointer" />
                                Nama
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Induk
                            </div>
                            <div className="col-span-1 hidden md:flex items-center gap-3">
                                Memiliki Nilai
                            </div>
                            <div className="col-span-1 hidden md:flex items-center gap-3">
                                ID
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-3">
                                Status
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center gap-3">
                                <input type="text" value={searchDataMapel} onChange={e => setSearchDataMapel(e.target.value)} className="w-full dark:bg-zinc-900 bg-white px-2 py-1 rounded border dark:border-zinc-700" placeholder="Cari disini" />
                            </div>
                        </div>
                        {loadingFetch !== 'fetched' && (
                            <div className="w-full flex justify-center">
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            </div>
                        )}
                        {loadingFetch === 'fetched' && dataMapel.length < 1 && (
                            <div className="w-full flex justify-center opacity-50">
                                Data Mata Pelajaran Kosong!
                            </div>
                        )}
                        {filteredDataMapel.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                            <div key={`mapel_${value['id_mapel']}`} className="grid grid-cols-12 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 ease-out duration-300">
                                <div className="col-span-7 md:col-span-4 flex items-center gap-3">
                                    <input type="checkbox" checked={selectedDataMapel.includes(value['id_mapel'])} onChange={() => handleSelectDataMapel(value['id_mapel'])} className="cursor-pointer" />
                                    {value['nama_mapel']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['is_parent']  ? 'Sendiri' : dataMapel.find(v => v['id_mapel'] == value['parent_from_id_mapel'])['nama_mapel']}
                                </div>
                                <div className="col-span-1 hidden md:flex items-center gap-1">
                                    {value['is_mapel'] ? (
                                        <div className="px-2 py-1 rounded-full bg-green-500 dark:bg-green-500/10 text-white dark:text-green-400 flex items-center justify-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit" />
                                            Ya
                                        </div>
                                    ):(
                                        <div className="px-2 py-1 rounded-full bg-red-500 dark:bg-red-500/10 text-white dark:text-red-400 flex items-center justify-center gap-2">
                                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                            Tidak
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-1 hidden md:flex items-center gap-1">
                                    {value['id_mapel']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-3">
                                    {value['aktif'] ? (
                                        <div className="px-2 py-1 rounded-full bg-green-500 dark:bg-green-500/10 text-white dark:text-green-400 flex items-center justify-center gap-2">
                                            <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3 text-inherit" />
                                            Aktif
                                        </div>
                                    ):(
                                        <div className="px-2 py-1 rounded-full bg-red-500 dark:bg-red-500/10 text-white dark:text-red-400 flex items-center justify-center gap-2">
                                            <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3 text-inherit" />
                                            Tidak Aktif
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-5 md:col-span-2 flex items-center justify-center md:gap-3 gap-1">
                                    <button type="button" onClick={() => document.getElementById(`info_mapel_${value['id_mapel']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 md:hidden flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`info_mapel_${value['id_mapel']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Informasi Mata Pelajaran</h3>
                                            <hr className="my-2 opacity-0" />
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Nama
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                        {value['nama_mapel']}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Apakah Induk?
                                                        </p>
                                                        <div className="w-full md:w-2/3 flex items-center gap-3">
                                                            {value['is_parent'] ? (
                                                                <button type="button" className="px-2 py-1 rounded-full bg-green-500 dark:bg-green-500/10 text-white dark:text-green-400 flex items-center justify-center gap-2">
                                                                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit" />
                                                                    Ya
                                                                </button>
                                                            ):(
                                                                <button type="button" className="px-2 py-1 rounded-full bg-red-500 dark:bg-red-500/10 text-white dark:text-red-400 flex items-center justify-center gap-2">
                                                                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                                                    Tidak
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!value['is_parent'] && (
                                                        <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                            <p className="w-full md:w-1/3 opacity-70">
                                                                Induk dari
                                                            </p>
                                                            <div className="w-full md:w-2/3">
                                                                {value['is_parent'] ? 'Sendiri' : dataMapel.find(v => v['id_mapel'] == value['parent_from_id_mapel'])['nama_mapel']}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Memiliki Daftar Nilai?
                                                        </p>
                                                        <div className="w-full md:w-2/3 flex items-center gap-3">
                                                            {value['is_mapel'] ? (
                                                                <button type="button" className="px-2 py-1 rounded-full bg-green-500 dark:bg-green-500/10 text-white dark:text-green-400 flex items-center justify-center gap-2">
                                                                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit" />
                                                                    Ya
                                                                </button>
                                                            ):(
                                                                <button type="button" className="px-2 py-1 rounded-full bg-red-500 dark:bg-red-500/10 text-white dark:text-red-400 flex items-center justify-center gap-2">
                                                                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                                                    Tidak
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Aktif
                                                        </p>
                                                        <div className="w-full md:w-2/3 flex items-center gap-3">
                                                            {value['aktif'] ? (
                                                                <button type="button" className="px-2 py-1 rounded-full bg-green-500 dark:bg-green-500/10 text-white dark:text-green-400 flex items-center justify-center gap-2">
                                                                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-inherit" />
                                                                    Ya
                                                                </button>
                                                            ):(
                                                                <button type="button" className="px-2 py-1 rounded-full bg-red-500 dark:bg-red-500/10 text-white dark:text-red-400 flex items-center justify-center gap-2">
                                                                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                                                    Tidak
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => document.getElementById(`edit_mapel_${value['id_mapel']}`).showModal()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-amber-500 dark:hover:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`edit_mapel_${value['id_mapel']}`} className="modal bg-gradient-to-t dark:from-zinc-950 from-zinc-50">
                                        <div className="modal-box bg-white dark:bg-zinc-900 rounded  border dark:border-zinc-800">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ubah Mata Pelajaran</h3>
                                            <hr className="my-2 opacity-0" />
                                            <form onSubmit={e => submitEditDataMapel(e, `edit_mapel_${value['id_mapel']}`, value['id_mapel'])} className="flex flex-col md:flex-row gap-2">
                                                <div className="w-full divide-y h-fit dark:divide-zinc-800 ">
                                                    
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Nama
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <input type="text"  required defaultValue={value['nama_mapel']} name="ubah_nama_mapel" placeholder="Nama Mata Pelajaran" className="input input-bordered w-full input-sm dark:bg-zinc-800 bg-zinc-100" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Apakah Induk?
                                                        </p>
                                                        <div className="w-full md:w-2/3 flex items-center gap-3">
                                                        Tidak
                                                            <input type="checkbox" defaultChecked={value['is_parent']} name="ubah_is_parent"  className="toggle toggle-success toggle-sm" />
                                                            Ya
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Induk dari
                                                        </p>
                                                        <div className="w-full md:w-2/3">
                                                            <select defaultValue={value['parent_from_id_mapel']} name="ubah_parent_from_mapel"  className="select select-bordered w-full select-sm dark:bg-zinc-800 bg-zinc-100">
                                                                <option value={'' || null} disabled >-- Pilih Mata Pelajaran --</option>
                                                                {dataMapel.map((v, index) => (
                                                                    <option key={index} value={v['id_mapel']}>{v['nama_mapel']}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Memiliki Daftar Nilai?
                                                        </p>
                                                        <div className="w-full md:w-2/3 flex items-center gap-3">
                                                            Tidak
                                                            <input type="checkbox" defaultChecked={value['is_mapel']}  name="ubah_is_mapel"  className="toggle toggle-success toggle-sm" />
                                                            Ya
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-col md:flex-row px-2 py-3">
                                                        <p className="w-full md:w-1/3 opacity-70">
                                                            Aktif
                                                        </p>
                                                        <div className="w-full md:w-2/3 flex items-center gap-3">
                                                            Tidak
                                                            <input type="checkbox"  defaultChecked={value['is_mapel'] ? value['aktif'] : true} name="ubah_aktif"  className="toggle toggle-success toggle-sm" />
                                                            Ya
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="py-3 px-2">
                                                        <button type="submit" className="px-3 py-2 rounded bg-green-600 hover:bg-green-400 focus:bg-green-700 flex items-center justify-center w-fit gap-3 text-white">
                                                            <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                            Simpan
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => submitDeleteMapel(value['id_mapel'])} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="my-2 opacity-0" />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-xs">
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                <FontAwesomeIcon icon={faCheckSquare} className="w-3 h-3 text-inherit" />
                                {selectedDataMapel.length} Data
                            </div>
                            {selectedDataMapel.length > 0 && (
                                <div className="flex items-center justify-center w-full md:w-fit gap-3 px-3">
                                    <button type="button" onClick={() => submitDeleteMapel()} className="w-6 h-6 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:border-red-500 dark:hover:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 ease-out duration-200">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            )}
                            <p className="pl-3  w-full md:w-fit">
                                Total {dataMapel.length} Data
                            </p>
                        </div>
                        <div className="flex p-3 rounded-md border dark:border-zinc-700 items-center w-full md:w-fit divide-x dark:divide-zinc-700 justify-between md:justify-start">
                            <div className="flex items-center gap-2 pr-3  w-full md:w-fit">
                                <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faAnglesLeft} className="w-3 h-3 text-inherit" />
                                </button>
                                {pagination}
                                <button type="button" onClick={() => setPagination(state => state < Math.ceil(dataMapel.length / totalList) ? state + 1 : state)} className="w-5 h-5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
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
            <hr className="my-2 opacity-0" />
            <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md">
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faCogs} className="w-4 h-4 text-inherit opacity-50" />
                    <h1 className="font-medium">
                        Konfigurasi Template
                    </h1>
                </div>
                <hr className="my-5 dark:opacity-10" />
                <form onSubmit={e => submitTemplate(e)} className="p-5 w-full md:w-1/3 rounded-md border dark:border-zinc-700 text-xs space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-1/3">
                            Tahun Angkatan
                        </p>
                        <div className="w-full md:w-1/2">
                            <input type="number" value={searchTemplate['tahun_angkatan']} onChange={e => setSearchTemplate(state => ({...state, tahun_angkatan: e.target.value}))} required className="px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 w-full" placeholder="Masukkan tahun angkatan" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-1/3">
                            Jurusan
                        </p>
                        <div className="w-full md:w-1/2">
                            <select  value={searchTemplate['jurusan']} onChange={e => setSearchTemplate(state => ({...state, jurusan: e.target.value}))} required className="px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 w-full">
                                <option value="" disabled>-- Pilih Jurusan --</option>
                                <option value="TKJ">TKJ</option>
                                <option value="TITL">TITL</option>
                                <option value="DPIB">DPIB</option>
                                <option value="TPM">TPM</option>
                                <option value="TKR">TKR</option>
                                <option value="GEO">GEO</option>
                                <option value="Semua">Semua</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-1/3">
                            Kelas
                        </p>
                        <div className="w-full md:w-1/2">
                            <select value={searchTemplate['kelas']} onChange={e => setSearchTemplate(state => ({...state, kelas: e.target.value}))} required className="px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 w-full">
                                <option value="" disabled>-- Pilih Kelas --</option>
                                <option value="X">X</option>
                                <option value="XI">XI</option>
                                <option value="XII">XII</option>
                                <option value="Semua">Semua</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                        <div className="md:w-1/3 hidden md:block"></div>
                        <div className="w-full md:w-1/2">
                            {loadingFetchDataTemplate !== 'loading' ? (
                                <button type="submit" className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 active:bg-blue-600 active:scale-90 hover:scale-95 text-white flex items-center justify-center gap-3 w-fit ease-out duration-200">
                                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                    Cari Template
                                </button>
                            ):(
                                <div className="loading loading-spinner loading-sm opacity-50"></div>
                            )}
                        </div>
                    </div>
                </form>
                <hr className="my-5 dark:opacity-10" />
                <div className="text-sm divide-y dark:divide-zinc-800">
                    {dataTemplate.map((value, index) => (
                        <div key={`template_${value['no']}_${index}`} className="py-3 flex flex-col md:flex-row md:divide-x dark:divide-zinc-700 *:md:px-3 gap-2 md:gap-0">
                            <div className="w-full md:w-1/3 flex justify-between">
                                <div className="space-y-2 flex-grow">
                                    <p className="opacity-50">
                                        Kategori
                                    </p>
                                    <p className="font-medium">
                                        {value['nama_kategori']}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <p className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-medium">
                                            {value['tahun_angkatan']}
                                        </p>
                                        <p className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-medium">
                                            {value['jurusan']}
                                        </p>
                                        <p className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-medium">
                                            Kelas {value['kelas']}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 justify-center flex-shrink-0 w-fit h-fit">
                                    
                                    <button type="button" onClick={() => document.getElementById(`edit_template_${value['no']}`).showModal()} className="opacity-60 hover:opacity-100">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <dialog id={`edit_template_${value['no']}`} className="modal">
                                        <div className="modal-box rounded-md dark:bg-zinc-900 border dark:border-zinc-700">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Ubah Mata Pelajaran dari Template</h3>
                                            <hr className="my-3 opacity-0" />
                                            <form onSubmit={e => editKategoriTemplate(e, `edit_template_${value['no']}`, Number(value['no']))} className="space-y-3">
                                                
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Tahun Angkatan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        {submittedTemplate['tahun_angkatan']}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Jurusan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        {value['jurusan']}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Kelas
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        {value['kelas']}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Kategori
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <AdvanceSelect 
                                                            listData={dataKategoriMapel.map(i => ({
                                                                value: Number(i['id_kategori_mapel']),
                                                                label: i['nama_kategori']
                                                            }))}
                                                            placeholder="Cari dan pilih Mata Pelajaran"
                                                            inputName={`edit_template_kategori_${value['no']}`}
                                                            defaultValue={dataKategoriMapel.map(i => ({
                                                                value: Number(i['id_kategori_mapel']),
                                                                label: i['nama_kategori']
                                                            }))[dataKategoriMapel.map(i => ({
                                                                value: Number(i['id_kategori_mapel']),
                                                                label: i['nama_kategori']
                                                            })).findIndex(i => i['value'] == Number(value['fk_kategori_id_kategori_mapel']))]}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Nomor Urut
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input defaultValue={value['no_urut']} type="number" required inputMode="numeric" className="px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800" placeholder="Masukkan no urut" />
                                                    </div>
                                                </div>
                                                <button type="submit" className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-400 active:bg-green-600 text-white flex items-center justify-center gap-3 w-fit ease-out duration-200 hover:scale-95 active:scale-90">
                                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                    Simpan
                                                </button>
                                            </form>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => deleteKategoriTemplate(value['no'])} className="opacity-60 hover:opacity-100">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 space-y-2">
                                <p className="opacity-50">
                                    Daftar Mata Pelajaran
                                </p>
                                <div className="space-y-2 transition-all duration-300">
                                    {value['template_mapel'].map((mapel, index2) => (
                                        <div key={`template_mapel_${mapel['no']}_${mapel['fk_mapel_id_mapel']}`} className="flex flex-row md:items-center md:justify-between md:gap-3 gap-1 px-3 py-2 rounded-md border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                                            <p className="flex-grow">
                                                {mapel['no_urut']}. {mapel['nama_mapel']}
                                            </p>
                                            <div className="flex items-center gap-2 justify-center flex-shrink-0 w-fit">
                                                
                                                <button type="button" onClick={() => document.getElementById(`edit_template_mapel_template_${value['no']}_${mapel['no']}`).showModal()} className="opacity-60 hover:opacity-100">
                                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                                </button>
                                                <dialog id={`edit_template_mapel_template_${value['no']}_${mapel['no']}`} className="modal">
                                                    <div className="modal-box rounded-md dark:bg-zinc-900 border dark:border-zinc-700">
                                                        <form method="dialog">
                                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                        </form>
                                                        <h3 className="font-bold text-lg">Ubah Mata Pelajaran dari Template</h3>
                                                        <hr className="my-3 opacity-0" />
                                                        <form onSubmit={e => editMapelTemplate(e, `edit_template_mapel_template_${value['no']}_${mapel['no']}`, Number(mapel['no']))} className="space-y-3">
                                                            
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                                <p className="w-full md:w-1/3">
                                                                    Tahun Angkatan
                                                                </p>
                                                                <div className="w-full md:w-2/3">
                                                                    {submittedTemplate['tahun_angkatan']}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                                <p className="w-full md:w-1/3">
                                                                    Jurusan
                                                                </p>
                                                                <div className="w-full md:w-2/3">
                                                                    {value['jurusan']}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                                <p className="w-full md:w-1/3">
                                                                    Kelas
                                                                </p>
                                                                <div className="w-full md:w-2/3">
                                                                    {value['kelas']}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                                <p className="w-full md:w-1/3">
                                                                    Kategori 
                                                                </p>
                                                                <div className="w-full md:w-2/3">
                                                                    {value['nama_kategori']}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                                <p className="w-full md:w-1/3">
                                                                    Mata Pelajaran
                                                                </p>
                                                                <div className="w-full md:w-2/3">
                                                                    <AdvanceSelect 
                                                                        listData={dataMapel.map(i => ({
                                                                            value: Number(i['id_mapel']),
                                                                            label: i['nama_mapel']
                                                                        }))}
                                                                        placeholder="Cari dan pilih Mata Pelajaran"
                                                                        inputName={`edit_template_mapel_template_${value['no']}_mapel_${mapel['no']}`}
                                                                        defaultValue={dataMapel.map(i => ({
                                                                            value: Number(i['id_mapel']),
                                                                            label: i['nama_mapel']
                                                                        }))[dataMapel.map(i => ({
                                                                            value: Number(i['id_mapel']),
                                                                            label: i['nama_mapel']
                                                                        })).findIndex(i => i['value'] == Number(mapel['fk_mapel_id_mapel']))]}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                                <p className="w-full md:w-1/3">
                                                                    Nomor Urut
                                                                </p>
                                                                <div className="w-full md:w-2/3">
                                                                    <input defaultValue={mapel['no_urut']} type="number" required inputMode="numeric" className="px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800" placeholder="Masukkan no urut" />
                                                                </div>
                                                            </div>
                                                            <button type="submit" className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-400 active:bg-green-600 text-white flex items-center justify-center gap-3 w-fit ease-out duration-200 hover:scale-95 active:scale-90">
                                                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                                Simpan
                                                            </button>
                                                        </form>
                                                    </div>
                                                </dialog>
                                                <button type="button" onClick={() => deleteMapelTemplate(mapel['no'])} className="opacity-60 hover:opacity-100">
                                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => document.getElementById(`assign_template_mapel_template_${value['no']}`).showModal()} className="border-2 px-3 py-2 rounded-md border-green-500 bg-green-500/10 text-green-500 flex items-center justify-center gap-3 hover:bg-green-500 hover:text-white hover:scale-95 active:scale-90 active:bg-green-600 ease-out duration-200">
                                        <FontAwesomeIcon icon={faLink} className="w-4 h-4 text-inherit" />
                                        Assign Mata Pelajaran
                                    </button>
                                    <dialog id={`assign_template_mapel_template_${value['no']}`} className="modal">
                                        <div className="modal-box rounded-md dark:bg-zinc-900 border dark:border-zinc-700">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">Tambah Mata Pelajaran ke Template</h3>
                                            <hr className="my-3 opacity-0" />
                                            <form onSubmit={e => submitAssignMapelTemplate(e, `assign_template_mapel_template_${value['no']}`, Number(value['no']))} className="space-y-3">
                                                
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Tahun Angkatan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        {submittedTemplate['tahun_angkatan']}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Jurusan
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        {value['jurusan']}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Kelas
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        {value['kelas']}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Kategori 
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        {value['nama_kategori']}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Mata Pelajaran
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <AdvanceSelect 
                                                            listData={dataMapel.map(i => ({
                                                                value: Number(i['id_mapel']),
                                                                label: i['nama_mapel']
                                                            }))}
                                                            placeholder="Cari dan pilih Mata Pelajaran"
                                                            inputName={`assign_template_mapel_template_${value['no']}_mapel`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                    <p className="w-full md:w-1/3">
                                                        Nomor Urut
                                                    </p>
                                                    <div className="w-full md:w-2/3">
                                                        <input type="number" required inputMode="numeric" className="px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800" placeholder="Masukkan no urut" />
                                                    </div>
                                                </div>
                                                <button type="submit" className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-400 active:bg-green-600 text-white flex items-center justify-center gap-3 w-fit ease-out duration-200 hover:scale-95 active:scale-90">
                                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                    Simpan
                                                </button>
                                            </form>
                                        </div>
                                    </dialog>
                                </div>
                            </div>
                        </div>
                    ))}
                    <hr className="my-5 dark:opacity-10" />
                    {loadingFetchDataTemplate === 'fetched' && submittedTemplate['submit'] && submittedTemplate['jurusan'] !== 'Semua' && submittedTemplate['kelas'] !== 'Semua' && (
                        <button type="button" onClick={() => document.getElementById('assign_template_kategori').showModal()} className="border-2 px-3 py-2 rounded-md border-blue-500 dark:border-blue-500 bg-blue-500/10 text-blue-500 flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white hover:scale-95 active:scale-90 active:bg-blue-600 ease-out duration-200">
                            <FontAwesomeIcon icon={faLink} className="w-4 h-4 text-inherit" />
                            Assign Kategori
                        </button>
                    )}
                    <dialog id="assign_template_kategori" className="modal">
                        <div className="modal-box rounded-md dark:bg-zinc-900 border dark:border-zinc-700">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">Tambah Kategori ke Template</h3>
                            <hr className="my-3 opacity-0" />
                            <form onSubmit={e => submitTambahTemplate(e, 'assign_template_kategori')} className="space-y-3">
                                
                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                    <p className="w-full md:w-1/3">
                                        Tahun Angkatan
                                    </p>
                                    <div className="w-full md:w-2/3">
                                        {submittedTemplate['tahun_angkatan']}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                    <p className="w-full md:w-1/3">
                                        Jurusan
                                    </p>
                                    <div className="w-full md:w-2/3">
                                        {submittedTemplate['jurusan']}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                    <p className="w-full md:w-1/3">
                                        Kelas
                                    </p>
                                    <div className="w-full md:w-2/3">
                                        {submittedTemplate['kelas']}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                    <p className="w-full md:w-1/3">
                                        Kategori
                                    </p>
                                    <div className="w-full md:w-2/3">
                                        <select  required className="px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 w-full">
                                            <option value="" disabled>-- Pilih Kategori --</option>
                                            {dataKategoriMapel.map((value, index) => (
                                                <option key={index} value={value['id_kategori_mapel']}>
                                                    {value['nama_kategori']}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-1">
                                    <p className="w-full md:w-1/3">
                                        Nomor Urut
                                    </p>
                                    <div className="w-full md:w-2/3">
                                        <input type="number" required inputMode="numeric" className="px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800" placeholder="Masukkan no urut" />
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-400 active:bg-green-600 text-white flex items-center justify-center gap-3 w-fit ease-out duration-200 hover:scale-95 active:scale-90">
                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                    Simpan
                                </button>
                            </form>
                        </div>
                    </dialog>
                </div>
            </div>
            
        </MainLayoutPage>
    )
}