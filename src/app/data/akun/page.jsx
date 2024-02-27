'use client'

import MainLayoutPage from "@/components/mainLayout"
import { downloadCSV } from "@/lib/csvDownload";
// import { nunito, space } from "@/config/fonts";
import { createAkun, deleteMultipleAkunById, deleteSingleAkunById, getAllAkun, updateSingleAkun } from "@/lib/model/akunModel";
import { faAlignLeft, faAngleLeft, faAngleRight, faCheck, faClockRotateLeft, faEdit, faEllipsis, faInfo, faInfoCircle, faPlusSquare, faPrint, faSpinner, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {EventEmitter} from "events";
import { nanoid } from "nanoid";
import { Nunito, Quicksand } from "next/font/google";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const nunito = Nunito({subsets: ['latin']})
const quicksand = Quicksand({subsets: ['latin']})

const emitter = new EventEmitter()

const mySwal = withReactContent(Swal)
export default function DataAkunPage() {
    const socket = io()
    emitter.on('create akun', async(data) => {
        await getAkun()
    })

    // let selectedAkun = []
    const [newFormData, setNewFormData] = useState([])
    const [akunList, setAkunList] = useState([])
    const [filteredAkunList, setFilteredAkunList] = useState([])
    const [filterRole, setFilterRole] = useState('All')
    const [searchValue, setSearchValue] = useState('');
    const [selectedAkun, setSelectedAkun] = useState([])
    const [editAkun, setEditAkun] = useState()
    const [loadingFetch, setLoadingFetch] = useState(true);
    const [pagination, setPagination] = useState(1);
    const [selectAll, setSelectAll] = useState(false)
    const [totalList, setTotalList] = useState(9000)
    // const [lastUpdate, setLastUpdate] = useState(new Date())

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
        const updaterConnection = () => {
            socket.on('connect', () => {
                console.log(socket.id)
            })
        }
        updaterConnection()
    }, [])

    useEffect(() => {
        const filterAkunList = () => {
            // Check if the search Value is unknown or ''
            if(filterRole === 'All') {
                const updatedFilterAkunList = akunList.filter(({email_akun}) => email_akun.toLowerCase().includes(searchValue.toLowerCase()));
                return setFilteredAkunList(updatedFilterAkunList);
            }

            const updatedFilterAkunList = akunList.filter(({email_akun, role_akun}) => email_akun.toLowerCase().includes(searchValue.toLowerCase()) && role_akun === filterRole);
            return setFilteredAkunList(updatedFilterAkunList)
        }
        filterAkunList()
    }, [searchValue, filterRole])

    const submitEditAkun = async () => {
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
                const resultUpdate = await updateSingleAkun(editAkun);
                if(resultUpdate) {
                    mySwal.close();
                    toast.success('Berhasil menyimpan data!');
                    setEditAkun();
                    return await getAkun();
                }else{
                    mySwal.close();
                    toast.error('Gagal menyimpan data!');
                }
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
    
    return (
        <MainLayoutPage>
            <Toaster />
            <div className="p-5">
                <div className="p-5 bg-zinc-100 rounded">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-5">    
                            <h1 className="font-bold text-white bg-zinc-700 px-2 py-1 w-fit rounded-full text-xs">
                                Bagan Data Baru
                            </h1>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-zinc-700" />
                                <p className="text-sm">
                                    Anda bisa menambah beberapa data secara sekaligus
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            {newFormData.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setNewFormData([])} className="px-2 py-1 rounded border border-red-600 text-red-600 font-bold flex items-center gap-2 text-sm hover:bg-red-600 hover:text-white focus:bg-red-700 focus:text-white">
                                        <FontAwesomeIcon icon={faXmark} className="text-inherit w-3 h-3" />
                                        Batal
                                    </button>
                                    <button onClick={() => submitFormData()} type="button" className=" px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 focus:bg-green-700 flex items-center gap-2 text-sm font-bold">
                                        <FontAwesomeIcon icon={faCheck} className="text-inherit w-3 h-3" />
                                        Simpan
                                    </button>
                                </div>
                            )}
                            <button type="button" onClick={() => addNewFormData()} className="bg-zinc-800 font-semibold focus:bg-green-700 text-white rounded text-sm py-1 px-2 hover:bg-green-600 flex items-center gap-2 tracking-tighter transition-all duration-300">
                                <FontAwesomeIcon icon={faPlusSquare} className="text-inherit w-3 h-3" />
                                Tambah Data Baru
                            </button>
                        </div>
                    </div>
                    {newFormData.length > 0 && <div  className="grid grid-cols-12 bg-zinc-800 text-white py-2 rounded mt-3">
                        <div className="col-span-3 px-2">
                            Nama
                        </div>
                        <div className="col-span-3 px-2">
                            Email
                        </div>
                        <div className="col-span-3 px-2">
                            Password
                        </div>
                        <div className="col-span-2 px-2">
                            Role
                        </div>
                        <div className="col-span-1 px-2 flex justify-center items-center">
                            <FontAwesomeIcon icon={faEllipsis} className="w-4 h-4 text-inherit" />
                        </div>
                    </div>}
                    {newFormData.length > 0 && newFormData.map(({id_akun, nama_akun, email_akun, password_akun, role_akun}, index) => (
                        <div key={index} className="divide-y-2 border-b border-zinc-800">
                            <div className={`grid grid-cols-12 bg-white text-zinc-800 text-sm ${nunito.className} divide-x divide-zinc-800`}>
                                <input value={nama_akun} onChange={e => editFormData(id_akun, {nama_akun: e.target.value})} type="text" className="w-full col-span-3 px-2 py-2 outline-none" placeholder="Masukkan Nama disini" />
                                <input value={email_akun} onChange={e => editFormData(id_akun, {email_akun: e.target.value})} type="text" className="w-full col-span-3 px-2 py-2 outline-none" placeholder="Masukkan Email disini" />
                                <input value={password_akun} onChange={e => editFormData(id_akun, {password_akun: e.target.value})} type="text" className="w-full col-span-3 px-2 py-2 outline-none" placeholder="Masukkan Password disini" />
                                <select value={role_akun} onChange={e => editFormData(id_akun, {role_akun: e.target.value})} name="" className="w-full col-span-2 px-2 py-2 outline-none cursor-pointer">
                                    <option value="" disabled>-- Pilih Role --</option>
                                    <option value="Admin" selected={role_akun === 'Admin' ? true : false}>Admin</option>
                                    <option value="Operator" selected={role_akun === 'Operator' ? true : false}>Operator</option>
                                </select>
                                <div className="col-span-1 flex items-center justify-center">
                                    <button onClick={() => deleteFormData(id_akun)}  type="button" className="flex items-center justify-center w-6 h-6 bg-red-500 rounded focus:bg-red-700 hover:bg-red-600" title="Hapus field ini">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <hr className="my-1 opacity-0" />
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
                    <div className="flex items-center gap-5">
                        <input type="text" onChange={e => setSearchValue(e.target.value)} className="px-2 py-1 border rounded-md bg-zinc-100 text-sm transition-all duration-300 outline-none border-zinc-700 focus:border-zinc-700 placeholder-shown:border-zinc-400" placeholder="Cari data di sini"/>
                        <select name="" onChange={e => setFilterRole(e.target.value)} value={filterRole} className="px-2 py-1 border rounded-md bg-zinc-100 text-sm transition-all duration-300 outline-none border-zinc-700 focus:border-zinc-700 placeholder-shown:border-zinc-400 cursor-pointer">
                            <option value="" disabled>-- Pilih Role --</option>
                            <option value="Admin">Admin</option>
                            <option value="Operator">Operator</option>
                            <option value="All">Semua</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-12 bg-zinc-800 text-white py-2 rounded mt-3 sticky top-0">
                    <div className="col-span-3 px-2 flex items-center gap-3">
                        <input type="checkbox" value={selectAll} onChange={() => toggleSelectAllAkun()} className="accent-orange-600 cursor-pointer outline-none" />
                        Nama
                    </div>
                    <div className="col-span-3 px-2">
                        Email
                    </div>
                    <div className="col-span-3 px-2">
                        Password
                    </div>
                    <div className="col-span-2 px-2">
                        Role
                    </div>
                    <div className="col-span-1 px-2 flex justify-center items-center">
                        <FontAwesomeIcon icon={faEllipsis} className="w-4 h-4 text-inherit" />
                    </div>
                </div>
                <div className={"divide-y-2 " + nunito.className}>
                    {loadingFetch === true && (
                        <div className="flex w-full justify-center gap-5 my-3">
                            <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 text-zinc-600 animate-spin" />
                            <p className="text-sm text-zinc-800">
                                Sedang loading..
                            </p>
                        </div>
                    )}
                    {akunList.length === 0 && loadingFetch === false && (
                        <div className="flex w-full justify-center gap-5 my-3">
                            <p className="text-sm text-zinc-800">
                                Data kosong
                            </p>
                        </div>
                    )}
                    <Suspense fallback={<p className="text-zinc-800">Loading..</p>}>
                        {filteredAkunList.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map(({id_akun, nama_akun, email_akun, password_akun, role_akun}, index) => (
                            <div key={index} className="grid grid-cols-12 text-sm transition-all duration-300 hover:bg-zinc-100">
                                <div className="py-2 w-full col-span-3 px-2 flex items-center gap-3">
                                    <input type="checkbox" name="" checked={selectedAkun.includes(id_akun) ? true : false} onChange={() => handleSelectAkun(id_akun)} id="" className="cursor-pointer" />
                                    {nama_akun}
                                </div>
                                <p className="py-2 w-full col-span-3 px-2">
                                    {email_akun}
                                </p>
                                <p className="py-2 w-full col-span-3 px-2">
                                    {password_akun}
                                </p>
                                <p className="py-2 w-full col-span-2 px-2">
                                    {role_akun}
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => handleDeleteSingleAkun(id_akun)} className="w-6 h-6 text-zinc-800 rounded bg-red-400 hover:bg-red-500 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <button type="button" onClick={() => setEditAkun(filteredAkunList[index])} className="w-6 h-6 text-zinc-800 rounded bg-orange-400 hover:bg-orange-500 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Suspense>
                    {!filteredAkunList.length > 0 && akunList.length > 0 && (
                        <div className="flex w-full justify-center gap-5 my-3">
                            <p className="text-sm text-zinc-800">
                                Data tidak ditemukan
                            </p>
                        </div>
                    )}
                </div>
                <div className="rounded w-full flex items-center justify-between bg-zinc-800 py-2 text-white px-2 text-sm sticky bottom-0">
                    <div className="flex items-center gap-5">
                        <p>
                            <b>{selectedAkun.length}</b> Item selected
                        </p>
                        {selectedAkun.length > 0 && <button type="button" onClick={() => handleDeleteSelectedAkun()} className="px-2 py-1 rounded bg-red-400 hover:bg-red-500 text-xs text-zinc-800 font-bold">
                            Hapus
                        </button>}
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-white">
                                Total <b>{akunList.length}</b> items
                            </p>
                            <button type="button" onClick={() => setPagination(state => state > 1 ? state - 1 : state)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-300">
                                <FontAwesomeIcon icon={faAngleLeft} className="w-3 h-3 text-inherit" />
                            </button>
                            <p>
                                {pagination}
                            </p>
                            <button type="button" onClick={() => setPagination(state => state + 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-300">
                                <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                        <select value={totalList} onChange={e => {setTotalList(state => state = e.target.value); setPagination(1)}} className="py-1 px-2 rounded outline-none border bg-zinc-700 cursor-pointer">
                            <option value={10}>10 Data</option>
                            <option value={30}>30 Data</option>
                            <option value={50}>50 Data</option>
                            <option value={100}>100 Data</option>
                            <option value={9000}>Semua Data</option>
                        </select>
                        <div className="relative">
                            <button type="button" onClick={() => ExportCSV()} className="px-2 py-1 rounded bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 font-bold peer flex items-center justify-center text-xs gap-3">
                                <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                Export as CSV
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-5">
                        <h1 className="bg-zinc-800 px-2 py-1 rounded-full font-bold text-white text-xs">
                            Bagan Ubah Data
                        </h1>
                        <div className="flex items-center gap-3 text-zinc-800 text-xs">
                            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-zinc-800" />
                            <p>
                                Silahkan pilih data yang ingin diubah dengan menekan tombol <b>Kuning</b> <br />
                                di <b>Daftar Data Tersedia</b>
                            </p>
                        </div>
                    </div>
                    {editAkun && <div className="flex items-center gap-2">
                        <button type="button" onClick={() => submitEditAkun()} className="py-1 px-2 rounded border border-green-600 text-green-600 font-bold flex items-center justify-center gap-2 text-xs hover:bg-green-600 hover:text-white">
                            Simpan Perubahan
                        </button>
                        <button type="button" onClick={() => setEditAkun()} className="w-7 h-7 rounded bg-zinc-800 text-white hover:bg-red-600 hover:text-zinc-800 focus:text-zinc-800 focus:bg-red-700 flex items-center justify-center">
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>}
                </div>
                {editAkun && <div className="grid grid-cols-12 gap-5 w-full mt-3">
                    <input type="text" onChange={e => setEditAkun(state => state = {...state, nama_akun: e.target.value})} value={editAkun.nama_akun} className="col-span-3 w-full px-2 py-1 rounded outline-none bg-zinc-100 border border-zinc-400 text-sm" placeholder="Masukkan Nama di sini" />
                    <input type="text" onChange={e => setEditAkun(state => state = {...state, email_akun: e.target.value})} value={editAkun.email_akun} className="col-span-3 w-full px-2 py-1 rounded outline-none bg-zinc-100 border border-zinc-400 text-sm" placeholder="Masukkan Email di sini" />
                    <input type="text" onChange={e => setEditAkun(state => state = {...state, password_akun: e.target.value})} value={editAkun.password_akun} className="col-span-3 w-full px-2 py-1 rounded outline-none bg-zinc-100 border border-zinc-400 text-sm" placeholder="Masukkan Password di sini" />
                    <select onChange={e => setEditAkun(state => state = {...state, role_akun: e.target.value})} value={editAkun.role_akun} className="col-span-3 w-full px-2 py-1 rounded outline-none bg-zinc-100 border border-zinc-400 text-sm">
                        <option value="" disabled> -- Pilih Role -- </option>
                        <option value="Admin">Admin</option>
                        <option value="Operator">Operator</option>
                    </select>

                </div>}
            </div>
        </MainLayoutPage>
    )
}
