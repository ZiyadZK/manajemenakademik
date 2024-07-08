'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont } from "@/config/fonts"
import { getKepalaSekolah, getProfilSekolah } from "@/lib/model/profilSekolahModel"
import { faEdit } from "@fortawesome/free-regular-svg-icons"
import { faBookBookmark, faDownload, faIdBadge, faSave, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

const formatDataArr = ['npsn', 'status', 'bentuk_pendidikan', 'status_kepemilikan', 'sk_pendirian_sekolah', 'tanggal_sk_pendirian', 'sk_izin_operasional', 'tanggal_sk_izin_operasional', 'operator', 'akreditasi', 'kurikulum', 'waktu']
const formatData = {
    'npsn': 'NPSN',
    'status': 'Status',
    'bentuk_pendidikan': 'Bentuk Pendidikan',
    'status_kepemilikan': 'Status Kepemilikan',
    'sk_pendirian_sekolah': 'SK Pendirian Sekolah',
    'tanggal_sk_pendirian': 'Tanggal SK Pendirian',
    'sk_izin_operasional': 'SK Izin Operasional',
    'tanggal_sk_izin_operasional': 'Tanggal SK Izin Operasional',
    'operator': 'Operator',
    'akreditasi': 'Akreditasi',
    'kurikulum': 'Kurikulum',
    'waktu': 'Waktu'
}

export default function ProfilSekolahPage() {
    const router = useRouter()
    const [data, setData] = useState({})

    const getData = async () => {
        const result = await getProfilSekolah()
        if(result.success) {
            let updatedData;
            const kepsek = await getKepalaSekolah()
            if(kepsek.success) {
                updatedData = { ['kepala_sekolah']: kepsek.data.nama_pegawai || '-', ['id_kepala_sekolah']: kepsek.data.id_pegawai || '-', ...result.data}
            }else{
                updatedData = { ['kepala_sekolah']: 'Tidak Ada', ['id_kepala_sekolah']: '0', ...result.data}
            }
            setData(updatedData)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <MainLayoutPage>
            <Toaster />
            <div className="p-5 border  dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
                <button type="button" onClick={() => document.getElementById('ubah_profil').showModal()} className="px-3 rounded-md py-2 w-full md:w-fit flex items-center justify-center gap-3 border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 ease-out duration-200">
                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit opacity-50" />
                    Ubah
                </button>
                <dialog id="ubah_profil" className="modal backdrop-blur">
                    <div className="modal-box dark:bg-zinc-900 rounded-md border dark:border-zinc-700 md:max-w-[800px]">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Ubah Profil Sekolah</h3>
                        <hr className="my-3 dark:opacity-10" />
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    NPSN
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Status
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Bentuk Pendidikan
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Status Kepemilikan
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    SK Pendirian Sekolah
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Tanggal SK Pendirian Sekolah
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    SK Izin Operasional
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Tanggal SK Izin Operasional
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Operator
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Akreditasi
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Kurikulum
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Waktu
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <button type="submit" className="px-3 py-2 w-full md:w-fit rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3 text-white">
                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit opacity-50" />
                                Simpan
                            </button> 
                        </div>
                    </div>
                </dialog>
                <hr className="my-5 dark:opacity-10" />
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Kepala Sekolah
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            NPSN
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Status
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Bentuk Pendidikan
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Status Kepemilikan
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            SK Pendirian Sekolah
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Tanggal SK Pendirian Sekolah
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            SK Izin Operasional
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Tanggal SK Izin Operasional
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Operator
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Akreditasi
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Kurikulum
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Waktu
                        </p>
                        <div className="w-full md:w-3/5">
                            <div className="loading loading-sm loading-spinner opacity-50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}