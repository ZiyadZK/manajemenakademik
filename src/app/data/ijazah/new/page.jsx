'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont } from "@/config/fonts"
import { dateToIso, isoToDate } from "@/lib/dateConvertes"
import { model_getAllAlumni } from "@/lib/model/alumniModel"
import { createMultiIjazah, getAllIjazah } from "@/lib/model/ijazahModel"
import { faArrowLeft, faCheckCircle, faCircleCheck, faDotCircle, faDownload, faExclamationCircle, faFileCirclePlus, faPlus, faSave, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

export default function DataIjazahNewPage() {
    const router = useRouter()
    const [formData, setFormData] = useState([])
    const [filteredFormData, setFilteredFormData] = useState([])
    const [ijazahList, setIjazahList] = useState([])
    const [siswaList, setSiswaList] = useState([])
    const [filteredSiswaList, setFilteredSiswaList] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [searchValueForm, setSearchValueForm] = useState('')
    const [kelasList, setKelasList] = useState([])
    const [filterRombel, setFilterRombel] = useState('')
    const [filterNoRombel, setFilterNoRombel] = useState('')
    const [filterRombelForm, setFilterRombelForm] = useState('')
    const [filterNoRombelForm, setFilterNoRombelForm] = useState('')
    const [loadingFetch, setLoadingFetch] = useState('')

    const getSiswaList = async () => {
        setLoadingFetch('loading')
        const responseSiswa = await model_getAllAlumni()
        const responseIjazah = await getAllIjazah()
        if(responseIjazah.success){
            setIjazahList(responseIjazah.data)
        }
        if(responseSiswa.success){
            setSiswaList(responseSiswa.data)
            setFilteredSiswaList(responseSiswa.data)

            let kelasCounts = {}
            
            
            responseSiswa.data.forEach(({nisn, kelas, rombel, no_rombel}) => {
                const key = `${kelas}-${rombel}-${no_rombel}`

                kelasCounts[key] = (kelasCounts[key] || 0) + 1

            })

            const kelasList = Object.keys(kelasCounts).map(key => {
                const [kelas, rombel, no_rombel] = key.split('-')
                return { kelas, rombel, no_rombel, length: kelasCounts[key]}
            })

            setKelasList(kelasList)
        }

        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getSiswaList()
    }, [])

    const toggleAddBulkFormData = (kelas, rombel, no_rombel) => {
        // Check if formData is already exist then delete it
        const maxFormDataLength = kelasList.find(kelasValue => kelasValue.kelas === kelas && kelasValue.rombel === rombel && kelasValue.no_rombel === no_rombel) 
        const ijazahSudahDiambilLength = ijazahList.filter(ijazah => ijazah.kelas === kelas && ijazah.rombel === rombel && ijazah.no_rombel === no_rombel)
        const formDataLength = formData.filter(siswa => siswa.kelas === kelas).filter(siswa => siswa.rombel === rombel).filter(siswa => siswa.no_rombel === no_rombel)
        
        if(formDataLength.length === (maxFormDataLength.length - ijazahSudahDiambilLength.length)) {
            let selectedFormData = formData.filter(siswa => siswa.rombel === rombel && siswa.no_rombel === no_rombel)
            
            let updatedFormData = formData.filter(obj1 => !selectedFormData.some(obj2 => Object.keys(obj1).every(key => obj1[key] === obj2[key]))).concat(selectedFormData.filter(obj2 => !formData.some(obj1 => Object.keys(obj2).every(key => obj2[key] === obj1[key]))))
            
            setFormData(updatedFormData);
            setFilteredFormData(updatedFormData);
            return
        }
        

        // Check if there's class exist
        let dataKelas = siswaList.filter(siswa => siswa.kelas === kelas).filter(siswa => siswa.rombel === rombel).filter(siswa => siswa.no_rombel === no_rombel)

        let newFormData = dataKelas.filter(siswa => {
            const isFormDataExist = formData.find(form => form.nama_lulusan === siswa.nama_siswa)
            if(isFormDataExist) {
                return false
            }

            return true
        }).filter(siswa => {
            const isIjazahExist = ijazahList.find(ijazah => ijazah.nisn === siswa.nisn)
            if(isIjazahExist) {
                return false
            }

            return true
        }).map(siswa => ({
            tgl_diambil: '',
            nama_lulusan: siswa.nama_siswa,
            nisn: siswa.nisn,
            kelas: siswa.kelas,
            rombel: siswa.rombel,
            no_rombel: siswa.no_rombel,
            tahun_lulus: siswa.tahun_keluar,
            status: 'belum diambil',
            nama_pengambil: null
        }))

        let updatedFormData = [...formData, ...newFormData]
        setFilteredFormData(updatedFormData)
        setFormData(updatedFormData)
    }

    const handleSearchSiswa = () => {
        let updatedData = siswaList

        updatedData = updatedData.filter(siswa => siswa['rombel'].includes(filterRombel))

        updatedData = updatedData.filter(siswa => siswa['no_rombel'].includes(filterNoRombel))

        updatedData = updatedData.filter(siswa => 
            siswa['nama_siswa'].toLowerCase().includes(searchValue.toLowerCase()) ||
            siswa['nis'].toLowerCase().includes(searchValue.toLowerCase()) ||
            siswa['nisn'].toLowerCase().includes(searchValue.toLowerCase()) ||
            siswa['kelas'].toLowerCase().includes(searchValue.toLowerCase())
        )
        setFilteredSiswaList(updatedData)
    }

    const handleFilterFormData = () => {
        let updatedData = formData

        updatedData = updatedData.filter(siswa => siswa['rombel'].includes(filterRombelForm))

        updatedData = updatedData.filter(siswa => siswa['no_rombel'].includes(filterNoRombelForm))

        updatedData = updatedData.filter(siswa => 
            siswa['nama_lulusan'].toLowerCase().includes(searchValueForm.toLowerCase()) ||
            siswa['nisn'].toLowerCase().includes(searchValueForm.toLowerCase())
        )

        setFilteredFormData(updatedData)
    }

    useEffect(() => {
        handleSearchSiswa()
    }, [searchValue, filterRombel, filterNoRombel])

    useEffect(() => {
        handleFilterFormData()
    }, [searchValueForm, filterRombelForm, filterNoRombelForm])

    const deleteFormData = (nisn) => {
        const isExist = formData.find(form => form.nisn === nisn)
        if(isExist) {
            let updatedData = formData.filter(form => form.nisn !== nisn)
            setFilteredFormData(updatedData)
            setFormData(updatedData)
        }
    }

    const addFormData = (nisn) => {
        // Check if there's an existing data in ijazahList
        const ijazahExist = ijazahList.find(ijazah => ijazah['nisn'] === nisn)
        if(ijazahExist) {
            return toast.error('Data Ijazah Siswa tersebut sudah ada!')
        }

        // Check if there's an existing data in formData
        const formDataExist = formData.find(form => form['nisn'] === nisn)
        if(formDataExist) {
            return toast.error('Anda sudah memilih Data Siswa tersebut!')
        }

        const dataSiswa = siswaList.find(siswa => siswa['nisn'] === nisn)
        const newFormData = {
            tgl_diambil: '',
            nama_lulusan: dataSiswa.nama_siswa,
            nisn: dataSiswa.nisn,
            kelas: dataSiswa.kelas,
            rombel: dataSiswa.rombel,
            no_rombel: dataSiswa.no_rombel,
            tahun_lulus: dataSiswa.tahun_keluar,
            status: 'belum diambil',
            nama_pengambil: ''
        }

        let updatedFormData = [...formData, newFormData]
        setFilteredFormData(updatedFormData)
        setFormData(updatedFormData)

    }

    const handleChangeFormData = (nisn, value, field) => {
        const newData = formData.map(form => form.nisn === nisn ? ({...form, [field]: value}) : form)
        setFilteredFormData(newData)
        setFormData(newData)
    }

    const submitFormData =  () => {
        let updatedData = formData;
        if(formData.length < 1) {
            return toast.error('Silahkan pilih siswa terlebih dahulu!')
        }

        updatedData = updatedData.map(form => {
            if(form['status'] === 'sudah diambil') {
                return {
                    ...form,
                    ['tgl_diambil']: form['tgl_diambil'] === '' ? `${isoToDate(new Date().toLocaleDateString('en-gb'))}` : form['tgl_diambil'],
                    ['nama_pengambil']: form['nama_pengambil'] === '' ? form['nama_lulusan'] : form['nama_pengambil']
                }
            }

            return form
        })


        Swal.fire({
            title: 'Apakah anda sudah yakin?',
            text: 'Anda akan menambahkan beberapa data ijazah',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed){
                Swal.fire({
                    title: 'Sedang memproses data',
                    text: 'Mohon tunggu sebentar',
                    timer: 15000,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: async () => {
                        const response = await createMultiIjazah(updatedData)
                        if(response.success) {
                            Swal.fire({
                                title: 'Sukses',
                                icon: 'success',
                                text: 'Berhasil menambahkan data ijazah yang baru!'
                            }).then(() => {
                                router.push('/data/ijazah')
                            })
                        }
                    }
                })
            }
        })
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="mt-3">
                <div className={`flex md:items-center md:justify-between w-full md:flex-row flex-col gap-3`}>
                    <div className="flex items-center gap-2 md:gap-5">
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                        </button>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faFileCirclePlus} className="w-4 h-4 text-blue-600" />
                            <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text dark:to-white">
                                Penambahan Data Ijazah
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <button type="button" onClick={() => router.push('/data/ijazah/new/import')} className="w-1/2 md:w-fit px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center gap-3 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200">
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                            Import 
                        </button>
                        <button type="button" onClick={() => submitFormData()} className="w-1/2 rounded-full py-2 px-4 bg-green-500 hover:bg-green-600 focus:bg-green-700 text-white flex items-center justify-center gap-4 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-500">
                            <FontAwesomeIcon icon={faSave} className="w-5 h-5 text-inherit" />
                            Simpan
                        </button>
                    </div>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="flex md:flex-row flex-col md:divide-x divide-y-2 md:divide-y-0 md:gap-0">
                    <div className="w-full md:w-2/6 md:pr-5 pb-5 ">
                        <div className="flex items-center gap-5">
                            <div className="relative flex-grow rounded border py-2 border-zinc-600 dark:text-zinc-200">
                                <div className="absolute top-0 left-0 w-10 h-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                </div>
                                <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="w-full bg-white dark:bg-transparent pl-10  text-sm outline-none peer" placeholder="Cari Data Siswa di sini" />
                            </div>
                            <div className="md:flex gap-1 items-center hidden">
                                <select value={filterRombel} onChange={e => setFilterRombel(e.target.value)} className="border bg-white rounded py-2.5 border-zinc-600 cursor-pointer text-sm dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                    <option disabled>-- Rombel --</option>
                                    <option value="TKJ">TKJ</option>
                                    <option value="DPIB">DPIB</option>
                                    <option value="TPM">TPM</option>
                                    <option value="TKR">TKR</option>
                                    <option value="TITL">TITL</option>
                                    <option value="GEO">GEO</option>
                                    <option value="">Semua</option>
                                </select>
                                <select value={filterNoRombel} onChange={e => setFilterNoRombel(e.target.value)} className="border bg-white rounded py-2.5 border-zinc-600 cursor-pointer text-sm dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                    <option disabled>-- No --</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="">Semua</option>
                                </select>
                            </div>
                        </div>
                        <hr className="my-1 md:my-0 opacity-0" />
                        <div className="flex gap-1 items-center md:hidden">
                            <select value={filterRombel} onChange={e => setFilterRombel(e.target.value)} className="border bg-white rounded py-2.5 border-zinc-600 cursor-pointer text-sm w-full md:w-fit dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                <option disabled>-- Rombel --</option>
                                <option value="TKJ">TKJ</option>
                                <option value="DPIB">DPIB</option>
                                <option value="TPM">TPM</option>
                                <option value="TKR">TKR</option>
                                <option value="TITL">TITL</option>
                                <option value="GEO">GEO</option>
                                <option value="">Semua</option>
                            </select>
                            <select value={filterNoRombel} onChange={e => setFilterNoRombel(e.target.value)} className="border bg-white rounded py-2.5 border-zinc-600 cursor-pointer text-sm w-full md:w-fit dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                <option disabled>-- No --</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="">Semua</option>
                            </select>
                        </div>
                        <div className="py-2 relative w-full max-h-[190px] md:max-h-[500px] overflow-auto space-y-2">
                        {loadingFetch !== 'fetched' && (
                            <div className="flex items-center justify-center gap-4 py-5 text-blue-600/50">
                                <div className="loading loading-spinner loading-md text-inherit"></div>
                                Sedang mendapatkan data
                            </div>
                        )}
                        {loadingFetch === 'fetched' && siswaList.length < 1 && (
                            <div className="flex items-center justify-center gap-4 py-5 text-blue-600/50">
                                <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-inherit" />
                                Data kosong
                            </div>
                        )}
                            {filteredSiswaList.slice(0, 100).map((siswa, index) => (
                                <button key={`${siswa.nis} - ${index}`} onClick={() => addFormData(siswa.nisn)} type="button" className={`w-full rounded-lg border p-2 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50/50 focus:border-blue-300 focus:bg-blue-50/50 group dark:border-zinc-800 dark:hover:bg-zinc-700/30 dark:focus:bg-zinc-700/50`}>
                                    <div className={`${mont.className} flex-grow text-start`}>
                                        <p className="text-sm font-medium tracking-tighter group-hover:text-blue-700 group-focus:text-blue-700 dark:text-zinc-500 dark:group-hover:text-zinc-200 dark:group-focus:text-zinc-200">
                                            {siswa.nama_siswa}
                                        </p>
                                        <p className="text-xs tracking-tighter text-zinc-400 dark:text-zinc-600">{siswa.kelas} {siswa.rombel} {siswa.no_rombel} - {siswa.nisn}</p>
                                    </div>
                                    <div className="space-y-2 flex flex-col items-end">
                                        {ijazahList.map((ijazah, index) => ijazah['nisn'] === siswa.nisn && ijazah['status'] === 'belum diambil' && (
                                            <p key={`${ijazah.no_ijazah} - ${index}`} className="text-xs w-fit px-2 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500">
                                                Belum Diambil
                                            </p>
                                        ))}
                                        {ijazahList.map((ijazah, index) => ijazah['nisn'] === siswa.nisn && ijazah['status'] === 'sudah diambil' && (
                                            <p key={`${ijazah.no_ijazah} - ${index}`} className="text-xs w-fit px-2 py-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500">
                                                Sudah Diambil
                                            </p>
                                        ))}
                                        {formData.map((form, index) => siswa['nisn'] === form['nisn'] && (
                                            <FontAwesomeIcon key={`form ${index}`} icon={faCircleCheck} className="w-3 h-3 text-blue-600" />
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <hr className="my-2 dark:opacity-20" />
                        {loadingFetch !== 'fetched' && (
                            <div className="flex items-center justify-center gap-4 py-5 text-blue-600/50">
                                <div className="loading loading-spinner loading-md text-inherit"></div>
                                Sedang mendapatkan data
                            </div>
                        )}
                        {loadingFetch === 'fetched' && kelasList.length < 1 && (
                            <div className="flex items-center justify-center gap-4 py-5 text-blue-600/50">
                                <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-inherit" />
                                Data kosong
                            </div>
                        )}
                        <div className="md:grid md:grid-cols-2 flex gap-2 relative overflow-auto max-h-40">
                            {kelasList.map((kelas, index) => (
                                <button key={`${index}`} type="button" onClick={() => toggleAddBulkFormData(kelas.kelas, kelas.rombel, kelas.no_rombel)} className={` ${mont.className} px-2 py-4 rounded-lg border flex items-center gap-5 hover:border-zinc-600 hover:shadow-lg flex-shrink-0 w-1/2 md:w-full dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-gradient-to-t dark:hover:from-zinc-700/10 dark:text-zinc-500 dark:hover:text-zinc-200`}>
                                    <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center font-medium text-violet-500 dark:bg-violet-500/10">
                                        {kelas.length}
                                    </div>
                                    <article className="text-start">
                                        <p className="text-xs opacity-40">Kelas:</p>
                                        <p className={`${mont.className} text-xs md:text-sm`}>
                                            {kelas.kelas} {kelas.rombel} {kelas.no_rombel}
                                        </p>
                                    </article>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-4/6 md:pl-5 pt-5 md:pt-0 space-y-2 h-fit relative overflow-auto max-h-[500px] md:max-h-[800px]">
                        <div className={`${formData.length > 0 ? 'flex' : 'hidden'} items-center gap-5`}>
                            <div className="relative flex-grow rounded border py-2 border-zinc-600 peer-has-[:placeholder-shown]:border-zinc-300">
                                <div className="absolute top-0 left-0 w-10 h-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit dark:text-zinc-200" />
                                </div>
                                <input type="text" value={searchValueForm} onChange={e => setSearchValueForm(e.target.value)} className="w-full bg-white dark:bg-transparent dark:text-zinc-200 pl-10  text-sm outline-none peer" placeholder="Cari Data Siswa di sini" />
                            </div>
                            <div className="md:flex gap-1 items-center hidden">
                                <select value={filterRombelForm} onChange={e => setFilterRombelForm(e.target.value)} className="border bg-white rounded py-2.5 border-zinc-600 cursor-pointer text-sm dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                    <option disabled>-- Rombel --</option>
                                    <option value="TKJ">TKJ</option>
                                    <option value="DPIB">DPIB</option>
                                    <option value="TPM">TPM</option>
                                    <option value="TKR">TKR</option>
                                    <option value="TITL">TITL</option>
                                    <option value="GEO">GEO</option>
                                    <option value="">Semua</option>
                                </select>
                                <select value={filterNoRombelForm} onChange={e => setFilterNoRombelForm(e.target.value)} className="border bg-white rounded py-2.5 border-zinc-600 cursor-pointer text-sm dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                    <option disabled>-- No --</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="">Semua</option>
                                </select>
                            </div>
                        </div>
                        <hr className="my-1 md:my-0 opacity-0" />
                        <div className={`${formData.length > 0 ? 'flex' : 'hidden'} gap-1 items-center md:hidden`}>
                            <select value={filterRombelForm} onChange={e => setFilterRombelForm(e.target.value)} className="border bg-white rounded py-2.5 border-zinc-600 cursor-pointer text-sm w-full md:w-fit dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                <option disabled>-- Rombel --</option>
                                <option value="TKJ">TKJ</option>
                                <option value="DPIB">DPIB</option>
                                <option value="TPM">TPM</option>
                                <option value="TKR">TKR</option>
                                <option value="TITL">TITL</option>
                                <option value="GEO">GEO</option>
                                <option value="">Semua</option>
                            </select>
                            <select value={filterNoRombelForm} onChange={e => setFilterNoRombelForm(e.target.value)} className="border bg-white rounded py-2.5 border-zinc-600 cursor-pointer text-sm w-full md:w-fit dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
                                <option disabled>-- No --</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="">Semua</option>
                            </select>
                        </div>
                        {filteredFormData.map((form, index) => (
                            <div key={`formData-${index}`} className="collapse collapse-arrow bg-zinc-50/50 hover:bg-zinc-50 dark:bg-zinc-800/30 dark:text-zinc-200 dark:hover:bg-gradient-to-t dark:hover:from-zinc-700/50 has-[:checked]:dark:from-zinc-700/50">
                                <input type="checkbox" /> 
                                <div className="collapse-title flex md:flex-row flex-col md:gap-5 md:items-center md:justify-start items-start font-medium">
                                    <p>
                                        {form.nama_lulusan}
                                    </p>
                                    <div className={`${mont.className} opacity-50 dark:opacity-100 text-xs flex items-center gap-1 md:gap-3`}>
                                        <p className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500">
                                            {form.kelas} {form.rombel} {form.no_rombel}
                                        </p>
                                        <p className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                            {form.nisn}
                                        </p>
                                        {form['status'] === 'sudah diambil' && (
                                            <p className="rounded-full bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-300">
                                                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-inherit" />
                                            </p>
                                        )}
                                    </div>
                                </div>
                            
                                <div className="collapse-content space-y-2"> 
                                    <div className="flex md:items-center md:flex-row flex-col gap-1">
                                        <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                            Tahun Lulus <span className="float-end hidden md:block">:</span>
                                        </div>
                                        <div className="w-full md:w-fit text-sm">
                                            {form['tahun_lulus']}
                                        </div>
                                    </div>
                                    <div className="flex md:items-center md:flex-row flex-col gap-1">
                                        <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                            Status <span className="float-end hidden md:block">:</span>
                                        </div>
                                        <select value={form['status']} onChange={e => handleChangeFormData(form.nisn, e.target.value, 'status')} className="bg-white w-full text-sm md:w-fit px-3 py-1 rounded border cursor-pointer dark:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
                                            <option value="" disabled>-- Pilih Status --</option>
                                            <option value="sudah diambil">Sudah di Ambil</option>
                                            <option value="belum diambil">Belum di Ambil</option>
                                        </select>
                                    </div>
                                    {form['status'] === 'sudah diambil' && (
                                        <div className="space-y-2">
                                            <div className="flex md:items-center md:flex-row flex-col gap-1">
                                                <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                                    Tanggal diambil <span className="float-end hidden md:block">:</span>
                                                </div>
                                                <input type="date" value={dateToIso(form['tgl_diambil']) || ''} onChange={e => handleChangeFormData(form.nisn, isoToDate(e.target.value), 'tgl_diambil')} className="bg-white w-full text-sm md:w-fit px-3 py-1 rounded border dark:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-200" />
                                            </div>
                                            <div className="flex md:items-center md:flex-row flex-col gap-1">
                                                <div className="w-full md:w-1/4 text-sm text-zinc-400">
                                                    Diambil Oleh <span className="float-end hidden md:block">:</span>
                                                </div>
                                                <input type="text" value={form['nama_pengambil']} onChange={e => handleChangeFormData(form.nisn, e.target.value, 'nama_pengambil')} className="bg-white w-full text-sm md:w-fit px-3 py-1 rounded border dark:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-200" placeholder="Masukkan Nama" />
                                            </div>
                                        </div>
                                    )}
                                    <button type="button" onClick={() => deleteFormData(form['nisn'])} className="flex items-center gap-3 px-3 py-1 rounded-lg bg-red-400 hover:bg-red-500 focus:bg-red-600 text-white text-sm">
                                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                        Batalkan?
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}