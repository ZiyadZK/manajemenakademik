'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, rale } from "@/config/fonts";
import { downloadCSV } from "@/lib/csvDownload";
import { createAkun, deleteMultipleAkunById, deleteSingleAkunById, getAllAkun, updateSingleAkun } from "@/lib/model/akunModel";
import { faAlignLeft, faAngleLeft, faAngleRight, faArrowDown, faArrowUp, faArrowsUpDown, faCheck, faClockRotateLeft, faDownload, faEdit, faEllipsis, faEllipsisH, faEye, faFile, faInfo, faInfoCircle, faPlus, faPlusSquare, faPrint, faSave, faSpinner, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";
import { Nunito, Quicksand } from "next/font/google";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const nunito = Nunito({subsets: ['latin']})
const quicksand = Quicksand({subsets: ['latin']})
const formatUpdateFormData = {id_akun: '', email_akun: '', nama_akun: '', role_akun: ''}

const mySwal = withReactContent(Swal)
export default function DataAkunPage() {

    // let selectedAkun = []
    const [newFormData, setNewFormData] = useState([])
    const [akunList, setAkunList] = useState([])
    const [filteredAkunList, setFilteredAkunList] = useState([])
    const [filterRole, setFilterRole] = useState('')
    const [searchValue, setSearchValue] = useState('');
    const [selectedAkun, setSelectedAkun] = useState([])
    const [loadingFetch, setLoadingFetch] = useState(true);
    const [pagination, setPagination] = useState(1);
    const [selectAll, setSelectAll] = useState(false)
    const [totalList, setTotalList] = useState(9000)
    const [viewSelectedOnly, setViewSelectedOnly] = useState(false)
    const [sorting, setSorting] = useState({email_akun: '', nama_akun: ''})
    const [updateFormData, setUpdateFormData] = useState({
        id_akun: '', email_akun: '', nama_akun: '', role_akun: ''
    })

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

    const addNewFormData = () => {
        if(newFormData.length > 4) {
            return toast.error('Tidak bisa membuat data lebih dari 5 akun!');
        }
        const newForm = {
            id_akun: `${nanoid(8)}-${nanoid(4)}-${nanoid(4)}-${nanoid(12)}`,
            email_akun: '',
            password_akun: '',
            nama_akun: '',
            role_akun: ''
        }
        const updatedFormData = [...newFormData, newForm];
        setNewFormData(updatedFormData);
    }

    const handleSelectAkun = (id) => {
        // Check if there's an ID inside the selectedAkun
        
        if(selectedAkun.includes(id)) {
            // Hapus
            const updatedSelectedAkun = selectedAkun.filter(item_id => item_id !== id);
            setSelectedAkun(updatedSelectedAkun)
        }else{
            // Buat
            const newSelectedAkun = [...selectedAkun, id];
            setSelectedAkun(newSelectedAkun)
        }
    }

    const deleteFormData = (id) => {
        const updatedFormData = newFormData.filter(formData => formData.id_akun !== id);
        setNewFormData(updatedFormData);
    }

    const editFormData = (id, value) => {
        const updatedFormData = newFormData.map(formData => formData.id_akun === id ? {...formData, ...value} : formData);
        setNewFormData(updatedFormData);
    }
    

    const handleDeleteSingleAkun = async (id) => {
        return mySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menghapus akun ini',
            showCancelButton: true,
            icon: 'question',
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    allowOutsideClick: false,
                    timer: 10000,
                    showConfirmButton: false
                })
                
                const resultDelete = await deleteSingleAkunById(id);
                if(resultDelete) {
                    mySwal.close();
                    toast.success('Berhasil menghapus akun tersebut!');
                    return await getAkun()
                }else{
                    mySwal.close();
                    toast.error('Gagal menghapus akun tersebut!')
                    return;
                }
            }
        })
    }

    const submitFormData = async () => {
        document.getElementById('tambah_akun_modal').close()
        return mySwal.fire({
            title: 'Apakah anda yakin?',
            showCancelButton: true,
            confirmButtonColor: '#09090b',
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
            allowOutsideClick: false
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 10000
                })
                const createDone = await createAkun(newFormData);
                if(createDone) {
                    mySwal.close();

                    toast.success('Berhasil menambahkan data!');
                    setNewFormData([])
                    getAkun()
                }else{
                    mySwal.close();
                    toast.error('Gagal menambahkan data!');
                    setNewFormData([])
                    getAkun()
                }
                
            }
        })
    }

    const getAkun = async () => {
        setLoadingFetch(state => true);
        const result = await getAllAkun();
        setLoadingFetch(state => false)
        setAkunList(result);
        setFilteredAkunList(result)
    }

    useEffect(() => {
        getAkun()
    }, [])


    useEffect(() => {
        const filterAkunList = () => {
            let updatedData;
            
            // Check if searchValue is being inserted
            updatedData = akunList.filter(akun => 
                akun['email_akun'].toLowerCase().includes(searchValue.toLowerCase()) ||
                akun['nama_akun'].toLowerCase().includes(searchValue.toLowerCase()) ||
                akun['password_akun'].toLowerCase().includes(searchValue.toLowerCase())
            )

            // Check if filterRole is turned on
            if(filterRole !== 'All') {
                updatedData = updatedData.filter(akun => akun['role_akun'].includes(filterRole))
            }

            // Check if viewSelectedOnly is turned on
            if(viewSelectedOnly) {
                updatedData = updatedData.filter(akun => selectedAkun.includes(akun.id_akun))
                const maxPagination = Math.ceil(updatedData.length / totalList)
                setPagination(maxPagination > 0 ? maxPagination - maxPagination + 1 : 1)
            }
            
            let sortedData = []

            // Check if data is being sorted
            if(sorting.email_akun !== '') {
                sortedData = updatedData.sort((a, b) => {
                    if(sorting.email_akun === 'asc') {
                        if (a.email_akun < b.email_akun) return -1;
                        if (a.email_akun > b.email_akun) return 1;
                        return 0;
                    }
                    
                    if(sorting.email_akun === 'dsc') {
                        if (a.email_akun < b.email_akun) return 1;
                        if (a.email_akun > b.email_akun) return -1;
                        return 0;
                    }
                })
            }

            if(sorting.nama_akun !== '') {
                sortedData = updatedData.sort((a, b) => {
                    if(sorting.nama_akun === 'asc') {
                        if (a.nama_akun < b.nama_akun) return -1;
                        if (a.nama_akun > b.nama_akun) return 1;
                        return 0;
                    }
                    
                    if(sorting.nama_akun === 'dsc') {
                        if (a.nama_akun < b.nama_akun) return 1;
                        if (a.nama_akun > b.nama_akun) return -1;
                        return 0;
                    }
                })
            }

            updatedData = sortedData.length > 0 ? sortedData : updatedData

            setFilteredAkunList(updatedData)
        }
        filterAkunList()
    }, [searchValue, filterRole, viewSelectedOnly, sorting])

    const submitEditAkun = async (e) => {
        e.preventDefault()
        document.getElementById(`edit_akun_${updateFormData.id_akun}`).close()
        return mySwal.fire({
            icon: 'question',
            title: 'Apakah anda yakin?',
            text: 'Anda akan menyimpan perubahan data tersebut',
            showCancelButton: true,
            allowOutsideClick: false
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    timer: 10000,
                    allowOutsideClick: false,
                    showConfirmButton: false
                });
                const resultUpdate = await updateSingleAkun(updateFormData);
                if(resultUpdate) {
                    mySwal.close();
                    toast.success('Berhasil menyimpan data!');
                    setUpdateFormData(formatUpdateFormData)
                    return await getAkun();
                }else{
                    mySwal.close();
                    toast.error('Gagal menyimpan data!');
                }
            }else{
                document.getElementById(`edit_akun_${updateFormData.id_akun}`).showModal()
            }
        })        
    }

    const handleDeleteSelectedAkun = async () => {
        return mySwal.fire({
            icon: 'question',
            title: 'Apakah anda yakin?',
            text: 'Anda akan menghapus beberapa akun yang telah anda pilih',
            showCancelButton: true
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data...',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 10000
                })
                const resultDelete = await deleteMultipleAkunById(selectedAkun);
                if(resultDelete) {
                    mySwal.close()
                    setSelectedAkun([]);
                    setSelectAll(false);
                    toast.success('Berhasil menghapus beberapa akun!');
                    return await getAkun();
                }else{
                    mySwal.close();
                    toast.error('Gagal memproses data!')
                }
            }
        })
    }

    const toggleSelectAllAkun = () => {
        if(!selectAll) {
            setSelectAll(state => !state);
            const newData = akunList.map(({id_akun}) => id_akun)
            setSelectedAkun(newData)
        }else{
            setSelectAll(state => !state);
            setSelectedAkun([]);
        }
    }

    const ExportCSV = () => {
        downloadCSV(akunList);
    }

    const handleTotalList = (value) => {
        // Cek kalau totalList melebihi Math Ceil
        const maxPagination = Math.ceil(akunList.length / value)
        if(pagination > maxPagination) {
            setPagination(state => state = maxPagination)
        }
        setTotalList(value)
    }
    
    return (
        <MainLayoutPage>
            <Toaster toastOptions={{style: {zIndex: 1000}}} />
            <hr className="mt-2 md:mt-5 opacity-0" />
            <div className="flex items-center md:gap-5 w-full justify-center md:justify-start gap-2">
                <button type="button" onClick={() => document.getElementById('tambah_akun_modal').showModal()} className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-inherit" />
                    Tambah Data
                </button>
                <dialog id="tambah_akun_modal" className="modal">
                    <div className="modal-box bg-white w-full max-w-[75rem]">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Tambah Akun Baru</h3>
                        <hr className="w-full my-2" />
                        <div className="space-y-2">
                            {newFormData.map((formData, index) => (
                                <div key={`${formData.id_akun} - ${index}`} className="collapse collapse-arrow border">
                                    <input type="radio" name="accordionTambahAkun" /> 
                                    <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                        <div className="text-zinc-300">
                                            #{index + 1}
                                        </div>
                                        <article className="text-xs md:text-sm text-zinc-600">
                                            <p>
                                                {formData.nama_akun ? formData.nama_akun : '-'}
                                            </p>
                                            <p>
                                                {formData.email_akun ? formData.email_akun : '-'}
                                            </p>
                                        </article>
                                    </div>
                                    <div className="collapse-content flex md:flex-row flex-col gap-3"> 
                                        <div className="w-full md:w-1/4 space-y-1 text-sm">
                                            <p>Nama</p>
                                            <input type="text" value={formData.nama_akun} onChange={e => editFormData(formData.id_akun, {nama_akun: e.target.value})} placeholder="Masukkan Nama" className="w-full px-1 py-1 rounded bg-white outline-none border hover:outline-zinc-200" />
                                        </div>
                                        <div className="w-full md:w-1/4 space-y-1 text-sm">
                                            <p>Email</p>
                                            <input type="text" value={formData.email_akun} onChange={e => editFormData(formData.id_akun, {email_akun: e.target.value})}  placeholder="Masukkan Email" className="w-full px-1 py-1 rounded bg-white outline-none border hover:outline-zinc-200" />
                                        </div>
                                        <div className="w-full md:w-1/4 space-y-1 text-sm">
                                            <p>Password</p>
                                            <input type="text" value={formData.password_akun} onChange={e => editFormData(formData.id_akun, {password_akun: e.target.value})}  placeholder="Masukkan Password" className="w-full px-1 py-1 rounded bg-white outline-none border hover:outline-zinc-200" />
                                        </div>
                                        <div className="w-full md:w-1/4 space-y-1 text-sm flex md:flex-row flex-col gap-5 md:items-end items-start h-full">
                                            <div className="flex-grow w-full space-y-1">
                                                <p>Role</p>
                                                <select name="" id="" value={formData.role_akun} onChange={e => editFormData(formData.id_akun, {role_akun: e.target.value})} className="w-full px-1 py-1 rounded bg-white outline-none border hover:outline-zinc-200">
                                                    <option value="" disabled>-- Pilih Role --</option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="Operator">Operator</option>
                                                </select>
                                            </div>
                                            <button type="button" onClick={() => deleteFormData(formData.id_akun)} className="px-3 py-2 md:w-7 md:h-7 rounded-full bg-red-50 text-red-700 flex items-center justify-center w-fit gap-3 text-xs hover:bg-red-100">
                                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                                <span className="block md:hidden">Hapus</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <hr className="my-2 opacity-0" />
                        <div className="flex items-center gap-2 justify-end">
                            {newFormData.length < 5 && (
                                <button type="button" onClick={() => addNewFormData()} className="px-3 py-2 rounded-full bg-blue-50 flex items-center justify-center gap-2 text-blue-700 hover:bg-blue-100">
                                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-inherit" />
                                    Tambah
                                </button>
                            )}
                            {newFormData.length > 0 && (
                                <button type="button" onClick={() => submitFormData()} className="px-3 py-2 rounded-full bg-green-50 flex items-center justify-center gap-2 text-green-700 hover:bg-green-100">
                                    <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                    Simpan
                                </button>
                            )}
                        </div>
                    </div>
                </dialog>
                <button type="button" className={`${rale.className} rounded-full px-4 py-2 bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 md:text-xl flex items-center justify-center gap-2`}>
                    <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                    Import Data
                </button>
            </div>
            <hr className="my-2 md:my-3 opacity-0" />
            <div className="flex md:items-center md:justify-between gap-3 flex-col md:flex-row">
                <div className="relative w-full md:w-1/5 border rounded-lg bg-white">
                    <input type="text" onChange={e => setSearchValue(e.target.value)} className="px-2 h-8 outline-none bg-transparent w-full" placeholder="Cari di sini" />
                </div>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-2 h-8 outline-none bg-white border rounded-lg">
                    <option value="" disabled>-- Pilih Role --</option>
                    <option value="Admin">Admin</option>
                    <option value="Operator">Operator</option>
                    <option value="All">Semua</option>
                </select>
            </div>
            <hr className="my-1 opacity-0" />
            <div className="grid grid-cols-12 w-full  bg-blue-500 *:px-2 *:py-3 text-white text-sm shadow-xl">
                <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                    <input type="checkbox" name="" id="" />
                    Email
                    <button type="button" onClick={() => handleSorting('email_akun', 'nama_akun')} className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting.email_akun === '' ? faArrowsUpDown : (sorting.email_akun === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Password
                </div>
                <div className="hidden md:flex items-center col-span-2 gap-3">
                    Nama
                    <button type="button" onClick={() => handleSorting('nama_akun', 'email_akun')} className="text-blue-400 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 hover:text-white">
                        <FontAwesomeIcon icon={sorting.nama_akun === '' ? faArrowsUpDown : (sorting.nama_akun === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                    Role
                </div>
                <div className="flex justify-center items-center col-span-4 md:col-span-2">
                    <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3 text-inherit" />
                </div>
            </div>
            <div className={`${mont.className} divide-y relative w-full h-fit max-h-[300px] overflow-auto`}>
                {filteredAkunList.map((akun, index) => (
                    <div key={`${akun.id_akun} - ${index}`} className="grid grid-cols-12 w-full group hover:bg-zinc-50 divide-x *:px-2 *:py-3 text-sm">
                        <div className="flex items-center gap-3 col-span-8 md:col-span-4 place-items-center">
                            <input type="checkbox" checked={selectedAkun.includes(akun.id_akun)} onChange={() => handleSelectAkun(akun.id_akun)} />
                            {akun.email_akun}
                        </div>
                        <div className="hidden md:flex items-center col-span-2">
                            {akun.password_akun}
                        </div>
                        <div className="hidden md:flex items-center col-span-2 gap-3">
                            {akun.nama_akun}
                        </div>
                        <div className="hidden md:flex items-center col-span-2">
                            {akun.role_akun === 'Admin' && (
                                <p className="px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium text-xs">
                                    Admin
                                </p>
                            )}
                            {akun.role_akun === 'Operator' && (
                                <p className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-xs">
                                    Operator
                                </p>
                            )}
                        </div>
                        <div className="flex justify-center items-center col-span-4 md:col-span-2 md:gap-3 gap-2">
                            <button type="button" onClick={() => {document.getElementById(`informasi_akun_${akun.id_akun}`).showModal(); }} className="w-6 h-6 bg-blue-400 hover:bg-blue-500 text-white flex md:hidden items-center justify-center">
                                <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            </button>
                            <dialog id={`informasi_akun_${akun.id_akun}`} className="modal">
                                <div className="modal-box">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className="font-bold text-lg">Informasi Akun</h3>
                                    <hr className="my-3 w-full" />
                                    <div className="space-y-3">
                                        <div className="">
                                            <p className="text-xs text-zinc-400">Email</p>
                                            <p>
                                                {akun.email_akun}
                                            </p>
                                        </div>
                                        <div className="">
                                            <p className="text-xs text-zinc-400">Password</p>
                                            <p>
                                                {akun.password_akun}
                                            </p>
                                        </div>
                                        <div className="">
                                            <p className="text-xs text-zinc-400">Nama</p>
                                            <p>
                                                {akun.nama_akun}
                                            </p>
                                        </div>
                                        <div className="">
                                            <p className="text-xs text-zinc-400">Status</p>
                                            {akun.role_akun === 'Admin' && (
                                                <p className="px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium text-xs w-fit">
                                                    Admin
                                                </p>
                                            )}
                                            {akun.role_akun === 'Operator' && (
                                                <p className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-xs w-fit">
                                                    Operator
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </dialog>
                            <button type="button" onClick={() => handleDeleteSingleAkun(akun.id_akun)} className="w-6 h-6 bg-red-400 hover:bg-red-500 text-white flex items-center justify-center">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" onClick={() => {document.getElementById(`edit_akun_${akun.id_akun}`).showModal(); setUpdateFormData(akun)}} className="w-6 h-6 bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center">
                                <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                            </button>
                            <dialog id={`edit_akun_${akun.id_akun}`} className="modal">
                                <div className="modal-box bg-white">
                                    <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className="font-bold text-lg">Ubah Akun</h3>
                                    <hr className="my-2 opacity-0" />
                                    <form onSubmit={submitEditAkun} className="space-y-3">
                                        <div className="space-y-1">
                                            <p>Email</p>
                                            <input required type="text" value={updateFormData.email_akun} onChange={e => setUpdateFormData(state => ({...state, ['email_akun']: e.target.value}))} className="border rounded w-full px-2 py-1 bg-white" placeholder="Masukkan Email" />
                                        </div>
                                        <div className="space-y-1">
                                            <p>Password</p>
                                            <input required type="text" value={updateFormData.password_akun} onChange={e => setUpdateFormData(state => ({...state, ['password_akun']: e.target.value}))} className="border rounded w-full px-2 py-1 bg-white" placeholder="Masukkan Email" />
                                        </div>
                                        <div className="space-y-1">
                                            <p>Nama</p>
                                            <input required type="text" value={updateFormData.nama_akun} onChange={e => setUpdateFormData(state => ({...state, ['nama_akun']: e.target.value}))} className="border rounded w-full px-2 py-1 bg-white" placeholder="Masukkan Email" />
                                        </div>
                                        <div className="space-y-1">
                                            <p>Role</p>
                                            <select value={updateFormData.role_akun} onChange={e => setUpdateFormData(state => ({...state, ['role_akun']: e.target.value}))} className="border rounded w-full px-2 py-1 bg-white">
                                                <option value="" disabled>-- Pilih Role --</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Operator">Operator</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button type="submit" className="px-3 py-2 rounded-full bg-green-50 text-green-700 flex items-center justify-center gap-2 hover:bg-green-100 focus:bg-green-100">
                                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit" />
                                                Simpan
                                            </button>
                                            <button type="button" onClick={() => {document.getElementById(`edit_akun_${akun.id_akun}`).close(); setUpdateFormData(formatUpdateFormData)}} className="px-3 py-2 rounded-full bg-red-50 text-red-700 flex items-center justify-center gap-2 hover:bg-red-100 focus:bg-red-100">
                                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full flex md:items-center md:justify-between px-2 py-1 flex-col md:flex-row border-y border-zinc-300">
                <div className="flex-grow flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">
                            {selectedAkun.length} Data terpilih
                        </p>
                        <button type="button" onClick={() => handleDeleteSelectedAkun()} className={`w-7 h-7 ${selectedAkun && selectedAkun.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 focus:bg-red-200 focus:text-red-700`}>
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                        </button>
                        <button type="button" onClick={() => setViewSelectedOnly(state => !state)} className={`w-7 h-7 flex items-center justify-center rounded-lg   text-zinc-500 bg-zinc-100 hover:bg-zinc-200 group transition-all duration-300`}>
                            <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
                        <button type="button" onClick={() => setSelectedAkun([])} className={`w-7 h-7 ${selectedAkun && selectedAkun.length > 0 ? 'flex' : 'hidden'} items-center justify-center rounded-lg  group transition-all duration-300 bg-zinc-100 hover:bg-zinc-200`}>
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit group-hover:scale-125 transition-all duration-300" />
                        </button>
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
                        {(totalList * pagination) - totalList + 1} - {(totalList * pagination) > akunList.length ? akunList.length : totalList * pagination} dari {akunList.length} data
                    </p>
                    <div className={`${mont.className} px-2 text-xs flex items-center justify-center gap-3`}>
                        <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
                            <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                        </button>
                        <p className="font-medium text-zinc-600">
                            {pagination}
                        </p>
                        <button type="button" onClick={() => setPagination(state => state < Math.ceil(akunList.length / totalList) ? state + 1 : state)} className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 text-zinc-500 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 outline-none">
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
        </MainLayoutPage>
    )
}
