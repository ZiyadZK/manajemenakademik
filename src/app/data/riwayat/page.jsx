'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta } from "@/config/fonts"
import { faEllipsisH, faInfoCircle, faPlus, faTable, faTimeline } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { Toaster } from "react-hot-toast"

export default function DataRiwayatPage() {


    return (
        <MainLayoutPage>
            <Toaster />
            <div className={`mt-3 ${jakarta.className}`}>
                <hr className="my-3 opacity-0" />
                <div className="grid grid-cols-12 w-full  bg-blue-500 *:px-2 *:py-3 text-white text-sm">
                    <div className="hidden md:block items-center gap-3 col-span-1 place-items-center">
                        Tanggal, Waktu
                    </div>
                    <div className="hidden md:block items-center col-span-1">
                        Aksi
                    </div>
                    <div className="hidden md:flex items-center gap-3 col-span-1">
                        Kategori
                    </div>
                    <div className="hidden md:flex items-center col-span-4">
                        Keterangan
                    </div>
                    <div className="flex items-center md:col-span-2 col-span-8">
                        Username / Nama
                    </div>
                    <div className="col-span-2 hidden md:flex items-center">
                        Email
                    </div>
                    <div className="col-span-1 hidden md:flex items-center">
                        Records
                    </div>
                    <div className="md:col-span-1 md:hidden block col-span-4">Detail</div>
                </div>
                <div className="divide-y relative overflow-auto w-full max-h-[600px]">                    
                    <div className="grid grid-cols-12 w-full divide-x *:px-2 *:py-3 text-zinc-600 text-sm">
                        <div className="col-span-1 hidden md:block">
                                <p>20/20/2023</p>
                                <p className="text-xs">09.09</p>
                        </div>
                        <div className="col-span-1 hidden md:block">
                            <div className="flex items-center rounded-full px-2 py-1 text-xs w-fit bg-green-100 text-green-600 gap-2">
                                <FontAwesomeIcon icon={faPlus} className="w-2 h-2 text-inherit" />
                                Tambah
                            </div>
                        </div>
                        <div className="col-span-1 hidden md:block">
                            <div className="px-2 py-1 text-xs font-medium text-zinc-700 w-fit rounded-full">
                                Data Mutasi Siswa
                            </div>
                        </div>
                        <div className="col-span-4 text-zinc-700 text-sm hidden md:block">
                            Menambahkan <span className="font-bold">120 Data</span> ke dalam <span className="font-medium">Data Mutasi Siswa</span>
                        </div>
                        <div className="md:col-span-2 col-span-8 text-zinc-700 text-sm ">
                            <p>Ziyad Jahizh Kartiwa</p>
                            <p className="text-xs">ziyad</p>
                        </div>
                        <div className="col-span-2 text-zinc-700 text-sm hidden md:flex">
                            yad@gmail.com
                        </div>
                        <div className="col-span-1 hidden md:flex">
                            <button type="button"  className="px-2 py-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 flex items-center justify-center gap-3 text-xs rounded-full">
                                <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-inherit" />
                                Lihat Data
                            </button>
                            
                        </div>
                        <div className="md:col-span-1 md:hidden block col-span-4">
                            <button type="button" onClick={() => document.getElementById(`detail_modal_`).showModal()} className="px-2 py-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 flex items-center justify-center gap-3 text-xs rounded-full">
                                <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-inherit" />
                                Detail
                            </button>
                            <dialog id={`detail_modal_`} className="modal">
                                <div className="modal-box bg-white">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className="font-bold text-lg">Detail</h3>
                                    <hr className="my-2 opacity-0" />
                                    <div className="space-y-4">
                                        <div className="space-y-0">
                                            <p className="text-xs opacity-60">Tanggal, Waktu</p>
                                            <p className="font-medium">20/20/20, 09:09</p>
                                        </div>
                                        <div className="space-y-0">
                                            <p className="text-xs opacity-60">Aksi</p>
                                            <div className="flex items-center rounded-full px-2 py-1 text-xs w-fit bg-green-100 text-green-600 gap-2">
                                                <FontAwesomeIcon icon={faPlus} className="w-2 h-2 text-inherit" />
                                                Tambah
                                            </div>
                                        </div>
                                        <div className="space-y-0">
                                            <p className="text-xs opacity-60">Kategori</p>
                                            <div className=" text-xs font-medium text-zinc-700 w-fit rounded-full">
                                                Data Mutasi Siswa
                                            </div>
                                        </div>
                                        <div className="space-y-0">
                                            <p className="text-xs opacity-60">Keterangan</p>
                                            <div className=" text-xs text-zinc-700 w-fit rounded-full">
                                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa vitae aperiam aut autem perferendis culpa quae odio assumenda ullam consectetur ratione maiores corporis illo, facere quos molestiae facilis nemo impedit?
                                            </div>
                                        </div>
                                        <div className="space-y-0">
                                            <p className="text-xs opacity-60">Email</p>
                                            <div className=" text-xs font-medium text-zinc-700 w-fit rounded-full">
                                                yad@gmail.com
                                            </div>
                                        </div>
                                        <div className="space-y-0">
                                            <p className="text-xs opacity-60">Records</p>
                                            <button type="button"  className="px-2 py-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300 flex items-center justify-center gap-3 text-xs rounded-full">
                                                <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-inherit" />
                                                Lihat Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}