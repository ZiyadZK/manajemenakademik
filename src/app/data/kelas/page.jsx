'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta, mont, nunito, rale } from "@/config/fonts"
import { ioServer } from "@/lib/io"
import { deleteGuruBK, deleteRoleKelas, deleteWaliKelas, getAllKelas, setGuruBK, setWaliKelas } from "@/lib/model/kelasModel"
import { getAllPegawai } from "@/lib/model/pegawaiModel"
import { getAllSiswa } from "@/lib/model/siswaModel"
import { faEdit, faFile, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { faCircleCheck, faCircleXmark, faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons"
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
    const [filterKelas, setFilterKelas] = useState({
        kelas: [], rombel: [], no_rombel: [], nama_walikelas: '', nama_guru_bk: ''
    })
    const [filterPegawai, setFilterPegawai] = useState('')

    const [statusSocket, setStatusSocket] = useState('')

    useEffect(() => {

        if(ioServer.connected) {
            setStatusSocket('online')
        }else{
            console.log('Socket Server is offline!')
            setStatusSocket('offline')
        }

        ioServer.on('SIMAK_KELAS', () => {
            getKelasList()
            getPegawaiList()
            getDataKelas()
        })
    }, [])

    const submitFilterPegawai = () => {
        let updatedData = pegawaiList

        if(filterPegawai !== '') {
            updatedData = updatedData.filter(pegawai => pegawai['nama_pegawai'].toLowerCase().includes(filterPegawai.toLowerCase()) ||
                pegawai['nik'].toLowerCase().includes(filterPegawai.toLowerCase()) ||
                pegawai['nip'].toLowerCase().includes(filterPegawai.toLowerCase())
            )
        }

        setFilteredPegawaiList(updatedData)
    }

    useEffect(() => {
        submitFilterPegawai()
    }, [filterPegawai])


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
        const formData = new FormData(event.target)
        const id = formData.get(radioname)

        if(id === null) {
            return toast.error('Anda harus memilih pegawai terlebih dahulu!')
        }

        Swal.fire({
            title: 'Sedang memproses data',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 15000,
            didOpen: async () => {

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
                    if(statusSocket !== 'online') {
                        getKelasList()
                        getPegawaiList()
                        getDataKelas()
                    }
                    return toast.success(`Berhasil menambahkan data ${role} ${kelas} ${rombel} ${no_rombel}`)
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

    const submitDeleteRoleKelas = async (kelas, rombel, no_rombel, role) => {
        Swal.fire({
            title: `Apakah anda yakin?`,
            text: `Anda akan mencabut status ${role} untuk kelas ${kelas} ${rombel} ${no_rombel}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 10000,
                    didOpen: async () => {
                        const responseData = await deleteRoleKelas({kelas, rombel, no_rombel}, role)

                        if(responseData.success) {
                            if(statusSocket !== 'online') {
                                getKelasList()
                                getPegawaiList()
                                getDataKelas()
                            }
                            Swal.fire({
                                title: 'Sukses',
                                text: `Berhasil menghapus data ${role} untuk kelas ${kelas} ${rombel} ${no_rombel}`,
                                icon: 'success'
                            })
                        }else{
                            Swal.fire({
                                title: 'Gagal',
                                text: 'Terdapat error disaat menghapus data, silahkan cek log server!',
                                icon: 'error'
                            })
                        }
                    }
                })
            }
        })
    }

    const getDataKelas = useCallback(async() => {
        const responseData = await getAllKelas()

        if(responseData.success) {
            setDataKelas(responseData.data)
        } 
    })

    const submitFilterKelas = (data) => {

        let updatedData
        if(!data || typeof(data) === 'undefined' || data === null || data.length < 1) {
            updatedData = kelasList
        }else{
            updatedData = data
        }

        // Filter kelas
        if(filterKelas['kelas'].length > 0) {
            updatedData = updatedData.filter(data => filterKelas['kelas'].includes(data['kelas']))
        }

        // Filter Jurusan
        if(filterKelas['rombel'].length > 0) {
            updatedData = updatedData.filter(data => filterKelas['rombel'].includes(data['rombel']))
        }

        // Filter Rombel
        if(filterKelas['no_rombel'].length > 0) {
            updatedData = updatedData.filter(data => filterKelas['no_rombel'].includes(data['no_rombel']))
        }

        // Filter walikelas
        if(filterKelas['nama_walikelas'] !== '') {
            updatedData = updatedData.filter(data => data['nama_walikelas'].toLowerCase().includes(filterKelas['nama_walikelas'].toLowerCase()))
        }

        if(filterKelas['nama_guru_bk'] !== '') {
            updatedData = updatedData.filter(data => data['nama_guru_bk'].toLowerCase().includes(filterKelas['nama_guru_bk'].toLowerCase()))
        }

        setFilteredKelasList(updatedData)
    }

    const changeFilterKelas = (field, value) => {
        // Create a shallow copy of the filterKelas object
        let updatedFilter = { ...filterKelas };
    
        if (Array.isArray(filterKelas[field])) {
            if (updatedFilter[field].includes(value)) {
                // Create a new array without the value
                updatedFilter[field] = updatedFilter[field].filter(item => item !== value);
            } else {
                // Create a new array with the value added
                updatedFilter[field].push(value);
            }
        } else {
            // Directly assign the value if it's not an array
            updatedFilter[field] = value;
        }
    
        setFilterKelas(updatedFilter)
    };

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
                return {
                    ...valueKelasList,
                    nama_walikelas: dataKelasList.nama_walikelas ? dataKelasList.nama_walikelas : '',
                    id_walikelas: dataKelasList.id_walikelas ? dataKelasList.id_walikelas : '',
                    nik_walikelas: dataKelasList.nik_walikelas ? dataKelasList.nik_walikelas : '',
                    nama_guru_bk: dataKelasList.nama_guru_bk ? dataKelasList.nama_guru_bk : '',
                    id_guru_bk: dataKelasList.id_guru_bk ? dataKelasList.id_guru_bk : '',
                    nik_guru_bk: dataKelasList.nik_guru_bk ? dataKelasList.nik_guru_bk : ''
                }
            }else{
                return {
                    ...valueKelasList,
                    nama_walikelas: '',
                    id_walikelas: '',
                    nik_walikelas: '',
                    nama_guru_bk: '',
                    id_guru_bk: '',
                    nik_guru_bk: ''
                }
            }
        })

        setKelasListLoading('fetched')

        setKelasList(newUpdatedKelasList)
        setFilteredKelasList(newUpdatedKelasList)
    })

    useEffect(() => {
        getKelasList()
        getPegawaiList()
        getDataKelas()
    }, [])

    useEffect(() => {
        submitFilterKelas()
    }, [filterKelas])

    return (
        <MainLayoutPage>
            <Toaster />
            <div className={`mt-3 ${jakarta.className}`}>
                <div className="md:space-y-5 space-y-3">
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="text-sm opacity-70 md:w-2/5">
                            Pilih Kelas
                        </p>
                        <div className="flex items-center gap-3 md:w-3/5">
                            <button type="button" onClick={() => changeFilterKelas('kelas', 'X')} className={` ${filterKelas['kelas'].includes('X') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                X
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('kelas', 'XI')} className={` ${filterKelas['kelas'].includes('XI') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                XI
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('kelas', 'XII')} className={` ${filterKelas['kelas'].includes('XII') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                XII
                            </button>
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="text-sm opacity-70 md:w-2/5">
                            Pilih Jurusan
                        </p>
                        <div className="flex items-center gap-3 md:w-3/5 relative overflow-auto">
                            <button type="button" onClick={() => changeFilterKelas('rombel', 'TKJ')} className={` ${filterKelas['rombel'].includes('TKJ') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                TKJ
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('rombel', 'TITL')} className={` ${filterKelas['rombel'].includes('TITL') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                TITL 
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('rombel', 'TPM')} className={` ${filterKelas['rombel'].includes('TPM') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                TPM
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('rombel', 'TKR')} className={` ${filterKelas['rombel'].includes('TKR') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                TKR
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('rombel', 'DPIB')} className={` ${filterKelas['rombel'].includes('DPIB') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                DPIB 
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('rombel', 'GEO')} className={` ${filterKelas['rombel'].includes('GEO') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                GEO
                            </button>
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="text-sm opacity-70 md:w-2/5">
                            Pilih Rombel
                        </p>
                        <div className="flex items-center gap-3 md:w-3/5">
                            <button type="button" onClick={() => changeFilterKelas('no_rombel', '1')} className={` ${filterKelas['no_rombel'].includes('1') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                1
                            </button>
                            <button type="button"  onClick={() => changeFilterKelas('no_rombel', '2')} className={` ${filterKelas['no_rombel'].includes('2') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                2
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('no_rombel', '3')} className={` ${filterKelas['no_rombel'].includes('3') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                3
                            </button>
                            <button type="button" onClick={() => changeFilterKelas('no_rombel', '4')} className={` ${filterKelas['no_rombel'].includes('4') ? 'bg-blue-50/50 border-blue-500 text-blue-700 hover:bg-blue-50' : 'hover:bg-zinc-100 hover:text-zinc-700 text-zinc-500'}  rounded  border flex items-center justify-center text-sm px-3 h-10 `}>
                                4
                            </button>
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="text-sm opacity-70 md:w-2/5">
                            Cari Walikelas
                        </p>
                        <div className="flex items-center gap-3 md:w-3/5">
                            <input type="text" onChange={e => changeFilterKelas('nama_walikelas', e.target.value)} className="text-sm w-full border h-10 px-3 rounded bg-white" placeholder="Masukkan Nama di sini" />
                        </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row w-full md:w-1/2">
                        <p className="text-sm opacity-70 md:w-2/5">
                            Cari Guru BK
                        </p>
                        <div className="flex items-center gap-3 md:w-3/5">
                            <input type="text" onChange={e => changeFilterKelas('nama_guru_bk', e.target.value)} className="text-sm w-full border h-10 px-3 rounded bg-white" placeholder="Masukkan Nama di sini" />
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3">
                            <p className="text-xs opacity-70">
                                Socket Server:
                            </p>
                            {statusSocket === '' && (
                                <div className="loading loading-spinner loading-sm text-zinc-500"></div>
                            )}
                            {statusSocket === 'online' && (
                                <div className="flex items-center gap-2 p-2 rounded-full bg-green-500/10 text-green-600 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Online
                                </div>
                            )}
                            {statusSocket === 'offline' && (
                                <div className="flex items-center gap-2 p-2 rounded-full bg-red-500/10 text-red-600 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    Offline
                                </div>
                            )}
                        </div>
                        <button type="button" onClick={() => document.getElementById('info_socket').showModal()}>
                            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-zinc-500" />
                        </button>
                    </div>
                    <dialog id="info_socket" className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">Hello!</h3>
                            <p className="py-4">Press ESC key or click on ✕ button to close</p>
                        </div>
                    </dialog>
                </div>
                <hr className="my-3" />
                {kelasListLoading !== 'fetched' && (
                    <div className="flex w-full h-screen  gap-5 items-center justify-center text-blue-400">
                        <div className="loading loading-spinner loading-lg text-inherit"></div>
                        Sedang mendapatkan data
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredKelasList.map((dataKelasList, index) => (
                        <div key={index} className="w-full p-5 rounded-lg border hover:shadow-lg transition-all duration-300 hover:border-white/0">                       
                            <div className="flex items-center justify-between">
                                <div className=" flex items-center gap-3">
                                    <h1 className={`font-medium text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-l from-zinc-600 to-zinc-700 `}>
                                        {dataKelasList.kelas} {dataKelasList.rombel} {dataKelasList.no_rombel}
                                    </h1>
                                    <p className={`px-2 py-1 rounded-full flex items-center w-fit gap-1 text-xs tracking-tighter bg-${warnaJurusan[dataKelasList.rombel]}-100 text-${warnaJurusan[dataKelasList.rombel]}-600`}>
                                        <FontAwesomeIcon icon={faUser} className="w-2 h-2 text-inherit " />
                                        {dataKelasList.length} Siswa
                                    </p>
                                </div>
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
                                        <button type="button" onClick={() => submitDeleteRoleKelas(dataKelasList.kelas, dataKelasList.rombel, dataKelasList.no_rombel, role)} className="hover:text-red-600 text-zinc-400 opacity-100 md:opacity-0 group-hover:opacity-100">
                                            <FontAwesomeIcon icon={faTrashCan} className="w-3 h-3 text-inherit" />
                                        </button>
                                        
                                        <button type="button" onClick={() => document.getElementById(`modal_ubah_${index}_${i}`).showModal()} className="hover:text-blue-600 text-zinc-400 opacity-100 md:opacity-0 group-hover:opacity-100">
                                            <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                        </button>
                                        <dialog id={`modal_ubah_${index}_${i}`} className="modal">
                                            <div className="modal-box bg-white">
                                                <form method="dialog">
                                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                </form>
                                                <h3 className="font-bold text-lg">Ubah {role} {dataKelasList.kelas} {dataKelasList.rombel} {dataKelasList.no_rombel}</h3>
                                                <hr className="my-2 opacity-0" />
                                                <input type="text" value={filterPegawai} onChange={e => setFilterPegawai(e.target.value)} className="px-3 py-2 bg-white rounded border w-full text-xs md:text-sm" placeholder="Cari data guru disini" />
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