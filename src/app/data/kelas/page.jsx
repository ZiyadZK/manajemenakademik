'use client'

import MainLayoutPage from "@/components/mainLayout"
import { mont, nunito } from "@/config/fonts"
import { getAllKelas, setGuruBK, setWaliKelas } from "@/lib/model/kelasModel"
import { getAllPegawai } from "@/lib/model/pegawaiModel"
import { getAllSiswa } from "@/lib/model/siswaModel"
import { faEdit, faFile, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { faCircleCheck, faCircleXmark, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"

const warnaJurusan = {
    TKJ: 'green',
    GEO: 'red',
    DPIB: 'amber',
    TPM: 'orange',
    TKR: 'blue',
    TITL: 'zinc'

}

export default function DataKelasPage() {
    const [kelasList, setKelasList] = useState([])
    const [filteredKelasList, setFilteredKelasList] = useState([])
    const [pegawaiList, setPegawaiList] = useState([])
    const [filteredPegawaiList, setFilteredPegawaiList] = useState([])
    const [dataKelas, setDataKelas] = useState([])
    const [kelasListLoading, setKelasListLoading] = useState('')

    const getPegawaiList = useCallback(async () => {
        const responseData = await getAllPegawai()
        if(responseData.success) {
            setPegawaiList(responseData.data)
            setFilteredPegawaiList(responseData.data)
        }
    })

    const submitSetRoleKelas = async (event, radioname, modal, kelas, rombel, no_rombel, role) => {
        event.preventDefault()

        document.getElementById(modal).close()

        Swal.fire({
            title: 'Sedang memproses data',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 15000,
            didOpen: async () => {
                const formData = new FormData(event.target)
                const id = formData.get(radioname)

                const dataPegawai = pegawaiList.find(pegawai => pegawai.id_pegawai.toString() === id.toString())
                
                let responseData
                if(role === 'Wali Kelas') {
                    responseData = await setWaliKelas(kelas, rombel, no_rombel, {
                        id_pegawai: String(dataPegawai.id_pegawai),
                        nama_pegawai: dataPegawai.nama_pegawai,
                        nik_pegawai: dataPegawai.nik
                    })
                }else{
                    responseData = await setGuruBK(kelas, rombel, no_rombel, {
                        id_pegawai: String(dataPegawai.id_pegawai),
                        nama_pegawai: dataPegawai.nama_pegawai,
                        nik_pegawai: dataPegawai.nik
                    })
                }

                if(responseData.success) {
                    Swal.close()
                    await getKelasList()
                    return toast.success(`Berhasil menambahkan data wali kelas ${kelas} ${rombel} ${no_rombel}`)
                }else{
                    Swal.fire({
                        title: 'Error',
                        text: 'Gagal memproses data, terdapat error di saat memproses data',
                        icon: 'error'
                    })
                }
            }
        }) 
    }

    const getDataKelas = useCallback(async() => {
        const responseData = await getAllKelas()

        if(responseData.success) {
            setDataKelas(responseData.data)
        } 
    })

    const getKelasList = useCallback(async () => {
        const responseSiswa = await getAllSiswa()
        const responseKelas = await getAllKelas()

        let kelasCounts = {}
        responseSiswa.forEach(({nisn, kelas, rombel, no_rombel}) => {
            const key = `${kelas}-${rombel}-${no_rombel}`

            kelasCounts[key] = (kelasCounts[key] || 0) + 1

        })

        let kelasOrder = []
        let rombelOrder = []
        let no_rombelOrder = []

        responseSiswa.forEach(siswa => {
            if(!kelasOrder.includes(siswa.kelas)) {
                kelasOrder.push(siswa.kelas)
            }

            if(!rombelOrder.includes(siswa.rombel)) {
                rombelOrder.push(siswa.rombel)
            }

            if(!no_rombelOrder.includes(siswa.no_rombel)) {
                no_rombelOrder.push(siswa.no_rombel)
            }
        })

        // Sort orders in descending order
        kelasOrder.sort((a, b) => a.localeCompare(b));
        rombelOrder.sort((a, b) => a.localeCompare(b));
        no_rombelOrder.sort((a, b) => a.localeCompare(b));

        const updatedKelasList = Object.keys(kelasCounts).map(key => {
            const [kelas, rombel, no_rombel] = key.split('-')
            return { kelas, rombel, no_rombel, length: kelasCounts[key]}
        })

        updatedKelasList.sort((a, b) => {
            const kelasComparison = kelasOrder.indexOf(a.kelas) - kelasOrder.indexOf(b.kelas);
            if (kelasComparison !== 0) return kelasComparison;
      
            const rombelComparison = rombelOrder.indexOf(a.rombel) - rombelOrder.indexOf(b.rombel);
            if (rombelComparison !== 0) return rombelComparison;
      
            return no_rombelOrder.indexOf(a.no_rombel) - no_rombelOrder.indexOf(b.no_rombel);
          });

        const newUpdatedKelasList = updatedKelasList.map(valueKelasList => {
            const dataKelasList = responseKelas.data.find(valueKelas => valueKelas.kelas === valueKelasList.kelas && valueKelas.rombel === valueKelasList.rombel && valueKelas.no_rombel === valueKelasList.no_rombel)
            
            if(dataKelasList) {
                console.log(dataKelasList)
                return {
                    ...valueKelasList,
                    nama_walikelas: dataKelasList.nama_walikelas ? dataKelasList.nama_walikelas : '-',
                    id_walikelas: dataKelasList.id_walikelas ? dataKelasList.id_walikelas : '-',
                    nik_walikelas: dataKelasList.nik_walikelas ? dataKelasList.nik_walikelas : '-',
                    nama_guru_bk: dataKelasList.nama_guru_bk ? dataKelasList.nama_guru_bk : '-',
                    id_guru_bk: dataKelasList.id_guru_bk ? dataKelasList.id_guru_bk : '-',
                    nik_guru_bk: dataKelasList.nik_guru_bk ? dataKelasList.nik_guru_bk : '-'
                }
            }else{
                return {
                    ...valueKelasList,
                    nama_walikelas: '-',
                    id_walikelas: '-',
                    nik_walikelas: '-',
                    nama_guru_bk: '-',
                    id_guru_bk: '-',
                    nik_guru_bk: '-'
                }
            }
        })

        console.log(newUpdatedKelasList)

        setKelasListLoading('fetched')

        setKelasList(newUpdatedKelasList)
        setFilteredKelasList(newUpdatedKelasList)
    })

    useEffect(() => {
        getKelasList()
        getPegawaiList()
        getDataKelas()
    }, [])

    return (
        <MainLayoutPage>
            <Toaster />
            <div className={`mt-3 ${nunito.className}`}>
                {kelasListLoading !== 'fetched' && (
                    <div className="flex w-full h-screen items-center justify-center">
                        Loading
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredKelasList.map((dataKelasList, index) => (
                        <div key={index} className="w-full p-5 rounded-lg border hover:shadow-lg transition-all duration-300 hover:border-white/0">                       
                            <div className="flex items-center justify-between">
                                <div className=" flex items-center gap-3">
                                    <h1 className={`font-medium text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-l from-${warnaJurusan[dataKelasList.rombel]}-600 to-zinc-700 `}>
                                        {dataKelasList.kelas} {dataKelasList.rombel} {dataKelasList.no_rombel}
                                    </h1>
                                    <p className={`px-2 py-1 rounded-full flex items-center w-fit gap-1 text-xs tracking-tighter bg-${warnaJurusan[dataKelasList.rombel]}-100 text-${warnaJurusan[dataKelasList.rombel]}-600`}>
                                        <FontAwesomeIcon icon={faUser} className="w-2 h-2 text-inherit " />
                                        {dataKelasList.length} Siswa
                                    </p>
                                </div>
                                <button type="button" className="hover:text-blue-700 text-zinc-400 flex items-center justify-center gap-2 text-xs">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                    Cek Detail
                                </button>
                            </div>
                            <hr className="my-1 opacity-0" />
                            <div className="bg-zinc-50 p-5 md:p-2 rounded-lg">
                            {['Wali Kelas', 'Guru BK'].map((role, i) => (
                                <div key={i} className="flex md:items-center md:flex-row flex-col gap-1">
                                <div className="text-xs opacity-60 w-full md:w-2/5 flex justify-between items-center">
                                    {role}
                                    <div className="hidden md:block">:</div>
                                </div>
                                <div className="flex justify-between items-center w-full md:w-3/5 group">
                                    <p className="font-medium text-sm">
                                        {role === 'Wali Kelas' ? (
                                            <span>{dataKelasList.nama_walikelas}</span>
                                        ):(
                                            <span>{dataKelasList.nama_guru_bk}</span>
                                        )}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button className="hover:text-red-600 text-zinc-400 opacity-100 md:opacity-0 group-hover:opacity-100">
                                            <FontAwesomeIcon icon={faTrashCan} className="w-3 h-3 text-inherit" />
                                        </button>
                                        
                                        <button type="button" onClick={() => document.getElementById(`modal_ubah_${index}_${i}`).showModal()} className="hover:text-blue-600 text-zinc-400 opacity-100 md:opacity-0 group-hover:opacity-100">
                                            <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                        </button>
                                        <dialog id={`modal_ubah_${index}_${i}`} className="modal">
                                            <div className="modal-box ">
                                                <form method="dialog">
                                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                </form>
                                                <h3 className="font-bold text-lg">Ubah {role} {dataKelasList.kelas} {dataKelasList.rombel} {dataKelasList.no_rombel}</h3>
                                                <hr className="my-2 opacity-0" />
                                                <input type="text" className="px-3 py-2 rounded border w-full text-xs md:text-sm" placeholder="Cari data guru disini" />
                                                <hr className="my-1 opacity-0" />
                                                <form onSubmit={e => submitSetRoleKelas(e, `ubah_${role}_${index}_${i}`, `modal_ubah_${index}_${i}`, dataKelasList.kelas, dataKelasList.rombel, dataKelasList.no_rombel, role)}>
                                                    <div className="relative w-full h-80 overflow-auto space-y-1">
                                                        {filteredPegawaiList.slice(0, 20).map((pegawai, indexPegawai) => (
                                                            <div key={indexPegawai} className="p-3 rounded border flex items-center justify-between has-[:checked]:border-blue-400 has-[:checked]:text-blue-600 has-[:checked]:bg-blue-50">
                                                                <div className="">
                                                                    <h1 className="font-medium md:text-lg">
                                                                        {pegawai.nama_pegawai}
                                                                    </h1>
                                                                    <div className="flex items-center gap-3">
                                                                        <p className="text-xs md:text-sm opacity-60">
                                                                            {pegawai.jabatan}
                                                                        </p>
                                                                        -
                                                                        <p className="text-xs md:text-sm opacity-60">
                                                                            {pegawai.nik}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <input type="radio" name={`ubah_${role}_${index}_${i}`} defaultChecked={role === 'Wali Kelas' ? (pegawai.id_pegawai === dataKelasList.id_walikelas) : (pegawai.id_pegawai === dataKelasList.id_guru_bk)} value={`${pegawai.id_pegawai}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <hr className="my-2 opacity-0" />
                                                    <div className="flex w-full md:w-fit gap-2 md:items-center md:justify-start">
                                                        <button type="submit"  className="p-2 rounded-full bg-green-700 hover:shadow-lg hover:bg-green-600 text-white flex items-center justify-center gap-2">
                                                            <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-inherit" />
                                                            Ya, Saya Yakin
                                                        </button>
                                                        <button type="button" onClick={() => document.getElementById(`modal_ubah_${index}_${i}`).close()} className="p-2 rounded-full bg-red-700 hover:shadow-lg hover:bg-red-600 text-white flex items-center justify-center gap-2">
                                                            <FontAwesomeIcon icon={faCircleXmark} className="w-3 h-3 text-inherit" />
                                                            Tidak
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </dialog>
                                    </div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayoutPage>
    )
}