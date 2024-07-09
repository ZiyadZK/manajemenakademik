'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont } from "@/config/fonts"
import { date_getDay, date_getMonth, date_getYear } from "@/lib/dateConvertes"
import { createProfilSekolah, getKepalaSekolah, getProfilSekolah, updateProfilSekolah } from "@/lib/model/profilSekolahModel"
import { faEdit } from "@fortawesome/free-regular-svg-icons"
import { faBookBookmark, faDownload, faIdBadge, faSave, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

const formatDataArr = ['npsn', 'status', 'bentuk_pendidikan', 'status_kepemilikan', 'sk_pendirian_sekolah', 'tanggal_sk_pendirian', 'sk_izin_operasional', 'tanggal_sk_izin_operasional', 'operator', 'akreditasi', 'kurikulum', 'waktu']
const formatForm = {
    'npsn': '',
    'status': '',
    'bentuk_pendidikan': '',
    'status_kepemilikan': '',
    'sk_pendirian_sekolah': '',
    'tanggal_sk_pendirian': '',
    'sk_izin_operasional': '',
    'tanggal_sk_izin_operasional': '',
    'operator': '',
    'akreditasi': '',
    'kurikulum': '',
    'waktu': ''
}

export default function ProfilSekolahPage() {
    const router = useRouter()
    const [loadingFetch, setLoadingFetch] = useState('')
    const [data, setData] = useState({})

    const [formUbah, setFormUbah] = useState({})

    const getData = async () => {
        setLoadingFetch('loading')
        const result = await getProfilSekolah()
        if(result.success) {
            let updatedData;
            setFormUbah(result.data)
            const kepsek = await getKepalaSekolah()
            if(kepsek.success) {
                updatedData = { ['kepala_sekolah']: kepsek.data.nama_pegawai || '-', ['id_kepala_sekolah']: kepsek.data.id_pegawai || '-', ...result.data}
            }else{
                updatedData = { ['kepala_sekolah']: 'Tidak Ada', ['id_kepala_sekolah']: '0', ...result.data}
            }
            setData(updatedData)
        }
        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getData()
    }, [])

    const submitUbahForm = async (e, modal) => {
        e.preventDefault()

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
                let response

                if(data['npsn'] === '') {
                    response = await createProfilSekolah(formUbah)
                }else{
                    response = await updateProfilSekolah(data, formUbah)
                }

                if(response.success) {
                    await getData()
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil mengubah data profil sekolah',
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
                        <form onSubmit={e => submitUbahForm(e, 'ubah_profil')} className="grid md:grid-cols-2 grid-cols-1 gap-5">
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    NPSN
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" required value={formUbah['npsn']} onChange={e => setFormUbah(state => ({...state, npsn: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Status
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" required value={formUbah['status']} onChange={e => setFormUbah(state => ({...state, status: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Bentuk Pendidikan
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" required value={formUbah['bentuk_pendidikan']} onChange={e => setFormUbah(state => ({...state, bentuk_pendidikan: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Status Kepemilikan
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" required value={formUbah['status_kepemilikan']} onChange={e => setFormUbah(state => ({...state, status_kepemilikan: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    SK Pendirian Sekolah
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" required value={formUbah['sk_pendirian_sekolah']} onChange={e => setFormUbah(state => ({...state, sk_pendirian_sekolah: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Tanggal SK Pendirian Sekolah
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="date" required value={formUbah['tanggal_sk_pendirian']} onChange={e => setFormUbah(state => ({...state, tanggal_sk_pendirian: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    SK Izin Operasional
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text" required value={formUbah['sk_izin_operasional']} onChange={e => setFormUbah(state => ({...state, sk_izin_operasional: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Tanggal SK Izin Operasional
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="date"  required value={formUbah['tanggal_sk_izin_operasional']} onChange={e => setFormUbah(state => ({...state, tanggal_sk_izin_operasional: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Operator
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text"  required value={formUbah['operator']} onChange={e => setFormUbah(state => ({...state, operator: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Akreditasi
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text"  required value={formUbah['akreditasi']} onChange={e => setFormUbah(state => ({...state, akreditasi: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Kurikulum
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text"  required value={formUbah['kurikulum']} onChange={e => setFormUbah(state => ({...state, kurikulum: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                                <p className="w-full md:w-2/5 opacity-60">
                                    Waktu
                                </p>
                                <div className="w-full md:w-3/5">
                                    <input type="text"  required value={formUbah['waktu']} onChange={e => setFormUbah(state => ({...state, waktu: e.target.value}))} className="w-full px-2 py-1 rounded-md bg-transparent border dark:border-zinc-700 " />
                                </div>
                            </div>
                            <button type="submit" className="px-3 py-2 w-full md:w-fit rounded-md bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center justify-center gap-3 text-white">
                                <FontAwesomeIcon icon={faSave} className="w-3 h-3 text-inherit opacity-50" />
                                Simpan
                            </button> 
                        </form>
                    </div>
                </dialog>
                <hr className="my-5 dark:opacity-10" />
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Kepala Sekolah
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['kepala_sekolah'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            NPSN
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['npsn'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Status
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['status'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Bentuk Pendidikan
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['bentuk_pendidikan'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Status Kepemilikan
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['status_kepemilikan'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            SK Pendirian Sekolah
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['sk_pendirian_sekolah'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Tanggal SK Pendirian Sekolah
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {`${date_getDay(data['tanggal_sk_pendirian'])} ${date_getMonth('string', data['tanggal_sk_pendirian'])} ${date_getYear(data['tanggal_sk_pendirian'])}` || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            SK Izin Operasional
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['sk_izin_operasional'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Tanggal SK Izin Operasional
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {`${date_getDay(data['tanggal_sk_izin_operasional'])} ${date_getMonth('string', data['tanggal_sk_izin_operasional'])} ${date_getYear(data['tanggal_sk_izin_operasional'])}` || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Operator
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['operator'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Akreditasi
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['akreditasi'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Kurikulum
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['kurikulum'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:items-center gap-1">
                        <p className="w-full md:w-2/5 opacity-60">
                            Waktu
                        </p>
                        <div className="w-full md:w-3/5">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-sm loading-spinner opacity-50"></div>
                            )}
                            {loadingFetch === 'fetched' && (
                                <>
                                    {data['waktu'] || 'Tidak Ada'}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}