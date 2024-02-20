'use client'

import MainLayoutPage from "@/components/mainLayout"
import { nunito, space } from "@/config/fonts";
import { debounce } from "@/lib/functions";
import { createAkun, getAllAkun } from "@/lib/model/akunModel";
import { faCheck, faClockRotateLeft, faEllipsis, faInfo, faInfoCircle, faPlusSquare, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal)
export default function DataAkunPage() {
    const [newFormData, setNewFormData] = useState([])
    const [akunList, setAkunList] = useState([])
    const [filteredAkunList, setFilteredAkunList] = useState([])
    const [filterRole, setFilterRole] = useState('All')
    const [searchValue, setSearchValue] = useState('');
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

    const deleteFormData = (id) => {
        const updatedFormData = newFormData.filter(formData => formData.id_akun !== id);
        setNewFormData(updatedFormData);
    }

    const editFormData = (id, value) => {
        const updatedFormData = newFormData.map(formData => formData.id_akun === id ? {...formData, ...value} : formData);
        setNewFormData(updatedFormData);
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
        const result = await getAllAkun();
        setAkunList(result);
        setFilteredAkunList(result)
    }

    useEffect(() => {
        getAkun()
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
                                <select onChange={e => editFormData(id_akun, {role_akun: e.target.value})} name="" className="w-full col-span-2 px-2 py-2 outline-none cursor-pointer">
                                    <option value="" disabled>-- Pilih Role --</option>
                                    <option value="Admin" selected={role_akun === 'Admin'}>Admin</option>
                                    <option value="Operator" selected={role_akun === 'Operator'}>Operator</option>
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
                <div  className="grid grid-cols-12 bg-zinc-800 text-white py-2 rounded mt-3">
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
                </div>
                <div className={"divide-y-2 " + nunito.className}>
                    <Suspense fallback={<p className="text-zinc-800">Loading..</p>}>
                        {filteredAkunList.map(({nama_akun, email_akun, password_akun, role_akun}, index) => (
                            <div className="grid grid-cols-12 text-sm">
                                <p className="py-2 w-full col-span-3 px-2">
                                    {nama_akun}
                                </p>
                                <p className="py-2 w-full col-span-3 px-2">
                                    {email_akun}
                                </p>
                                <p className="py-2 w-full col-span-3 px-2">
                                    {password_akun}
                                </p>
                                <p className="py-2 w-full col-span-2 px-2">
                                    {role_akun}
                                </p>
                                <div className="flex items-center justify-center gap-2"></div>
                            </div>
                        ))}
                    </Suspense>
                </div>
            </div>
        </MainLayoutPage>
    )
}
