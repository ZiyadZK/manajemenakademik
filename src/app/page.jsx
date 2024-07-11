'use client'

import MainLayoutPage from "@/components/mainLayout";
import { mont } from "@/config/fonts";
import { getAllDashboard } from "@/lib/model/dashboardModel";
import { faExclamationTriangle, faList, faPieChart, faUserCheck, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [loadingFetch, setLoadingFetch] = useState('')
  const [data, setData] = useState(null)
  const [tahunList, setTahunList] = useState({
    data_mutasi_siswa: [], data_alumni: []
  })

  const [pagination, setPagination] = useState({
    data_mutasi_siswa: '', data_alumni: ''
  })

  const [kelasList, setKelasList] = useState([
    'X', 'XI', 'XII'
  ])

  const getData = async () => {
    setLoadingFetch('loading')
    const response = await getAllDashboard()
    if(response.success) {
      setData(response.data)
      if(response.data['data_mutasi_siswa']['exist']) {
        setTahunList(state => ({
          ...state,
          data_mutasi_siswa: Array.from(new Set(response.data['data_mutasi_siswa']['rekap'].map(value => value['tahun']))).map(tahun => tahun).sort(),
        }))
        setPagination(state => ({
          ...state,
          data_mutasi_siswa: Array.from(new Set(response.data['data_mutasi_siswa']['rekap'].map(value => value['tahun']))).map(tahun => tahun).length - 1
        }))
      }
      
      if(response.data['data_alumni']['exist']) {
        setTahunList(state => ({
          ...state,
          data_alumni: Array.from(new Set(response.data['data_alumni']['rekap'].map(value => value['tahun']))).map(tahun => tahun).sort()
        }))
        setPagination(state => ({
          ...state,
          data_alumni: Array.from(new Set(response.data['data_alumni']['rekap'].map(value => value['tahun']))).map(tahun => tahun).length - 1
        }))
      }
    }
    setLoadingFetch('fetched')
  }

  useEffect(() => {
    getData()
  }, [])

  const handlePagination = (type, job) => {
    if(job === 'prev') {
      if(pagination[type] > 0) {
        const newState = pagination[type] - 1
        console.log(typeof(tahunList[type][newState]))
        console.log(tahunList[type])
        if(typeof(tahunList[type][newState]) !== 'undefined') {
          console.log({...pagination, [type]: newState})
          return setPagination({...pagination, [type]: newState})
        }
      }
    }
    
    if(job === 'next') {
      if(pagination[type] < tahunList[type].length) {
        const newState = pagination[type] + 1
        if(typeof(tahunList[type][newState]) !== 'undefined') {
          console.log({...pagination, [type]: newState})
          return setPagination({...pagination, [type]: newState})
        }
      }
    }
  }

  const getRekapMutasiSiswa = (tahun) => {
    return data['data_mutasi_siswa']['rekap'].find(value => value['tahun'] === tahun)
  }

  const getRekapAlumni = tahun => {
    return data['data_alumni']['rekap'].find(value => value['tahun'] === tahun)
  }

  return (
    <MainLayoutPage>
      <Toaster />
      {loadingFetch !== 'fetched' && (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="loading loading-spinner loading-lg opacity-50"></div>
        </div>
      )}
      {loadingFetch === 'fetched' && data === null && (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="flex flex-col items-center gap-5">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-inherit" />
            <h1 className="opacity-50 md:text-2xl w-fit">
              Data tidak ditemukan
            </h1>
          </div>
        </div>
      )}
      {loadingFetch === 'fetched' && data !== null && (
        <div className="flex justify-center w-full text-zinc-600 dark:text-zinc-200">
          <div className="w-full max-w-[1280px] space-y-5">

            <div className="p-5 border  dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs shadow-2xl">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-sm md:text-lg">
                  Rekapan Data Siswa
                </h1>
              </div>
              <div className="space-y-1 my-3">
                <hr className="dark:opacity-30" />
                <hr className="dark:opacity-10" />
              </div>
              {data['data_siswa']['exist'] ? (
                <>
                  <p className="opacity-50">
                    Di bawah ini adalah data-data Siswa yang sedang aktif saat ini.
                  </p>
                  <hr className="my-2 opacity-0" />
                  <div className="grid grid-cols-12 gap-2 border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 rounded-md p-3">
                    <div className="col-span-6 md:col-span-3 flex items-center font-semibold dark:font-normal">
                      Kelas
                    </div>
                    <div className="col-span-3 hidden md:flex items-center font-semibold dark:font-normal">
                      Jurusan
                    </div>
                    <div className="col-span-3 hidden md:flex items-center font-semibold dark:font-normal">
                      Rombel
                    </div>
                    <div className="col-span-6 md:col-span-3 flex items-center font-semibold dark:font-normal">
                      Jumlah Siswa
                    </div>
                  </div>
                  <div className="relative w-full py-2 overflow-auto max-h-[400px]">
                    {data['data_siswa']['rekap'].map((value, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                        <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                          {value['kelas']}
                          <span className="md:hidden block">
                            {value['jurusan']}
                          </span>
                          <span className="md:hidden block">
                            {value['rombel']}
                          </span>
                        </div>
                        <div className="col-span-3 hidden md:flex items-center">
                          {value['jurusan']}
                        </div>
                        <div className="col-span-3 hidden md:flex items-center">
                          {value['rombel']}
                        </div>
                        <div className="col-span-6 md:col-span-3 flex items-center">
                          {value['jumlah']} Siswa
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
                    <div className="col-span-6 md:col-span-9 text-end">
                      Total Siswa saat ini
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="font-bold">
                        {data['data_siswa']['total']} Siswa
                      </div>
                    </div>
                  </div>
                </>
              ):(
                <div className="flex justify-center items-center w-full py-5 gap-5">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-inherit" />
                  Data kosong
                </div>
              )}

            </div>

            <div className="p-5 border  dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs shadow-2xl">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-sm md:text-lg">
                  Rekapan Data Mutasi Siswa
                </h1>
              </div>
              <div className="space-y-1 my-3">
                <hr className="dark:opacity-30" />
                <hr className="dark:opacity-10" />
              </div>
              {data['data_mutasi_siswa']['exist'] && (
                <>
                  <p className="opacity-50">
                    Di bawah ini adalah data-data Siswa yang telah di mutasi dari tahun ke tahun
                  </p>
                  <hr className="my-2 opacity-0" />
                  <div className="join">
                    <button className="join-item btn btn-sm" onClick={() => handlePagination('data_mutasi_siswa', 'prev')}>«</button>
                    <button className="join-item btn btn-sm">
                      {tahunList['data_mutasi_siswa'][pagination['data_mutasi_siswa']]}
                    </button>
                    <button className="join-item btn btn-sm" onClick={() => handlePagination('data_mutasi_siswa', 'next')}>»</button>
                  </div>
                  <hr className="my-2 opacity-0" />
                  <div className="grid grid-cols-12 gap-2 border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 rounded-md p-3">
                    <div className="col-span-6 md:col-span-3 flex items-center font-semibold dark:font-normal">
                      Kelas
                    </div>
                    <div className="col-span-3 hidden md:flex items-center font-semibold dark:font-normal">
                      Jurusan
                    </div>
                    <div className="col-span-3 hidden md:flex items-center font-semibold dark:font-normal">
                      Rombel
                    </div>
                    <div className="col-span-6 md:col-span-3 flex items-center font-semibold dark:font-normal">
                      Jumlah Siswa
                    </div>
                  </div>
                  <div className="relative w-full py-2 overflow-auto max-h-[400px]">
                    {getRekapMutasiSiswa(tahunList['data_mutasi_siswa'][pagination['data_mutasi_siswa']])['rekap'].map((value, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                        <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                          {value['kelas']}
                          <span className="md:hidden block">
                            {value['jurusan']}
                          </span>
                          <span className="md:hidden block">
                            {value['rombel']}
                          </span>
                        </div>
                        <div className="col-span-3 hidden md:flex items-center">
                          {value['jurusan']}
                        </div>
                        <div className="col-span-3 hidden md:flex items-center">
                          {value['rombel']}
                        </div>
                        <div className="col-span-6 md:col-span-3 flex items-center">
                          {value['jumlah']} Siswa
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
                    <div className="col-span-6 md:col-span-9 text-end">
                      Total Mutasi Siswa tahun {tahunList['data_mutasi_siswa'][pagination['data_mutasi_siswa']]}
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="font-bold">
                        {getRekapMutasiSiswa(tahunList['data_mutasi_siswa'][pagination['data_mutasi_siswa']])['total']} Siswa
                      </div>
                    </div>
                  </div>
                  <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
                    <div className="col-span-6 md:col-span-9 text-end">
                      Total Mutasi Siswa keseluruhan
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="font-bold">
                        {data['data_mutasi_siswa']['total']} Siswa
                      </div>
                    </div>
                  </div>
                </>
              )}
              {!data['data_mutasi_siswa']['exist'] && (
                <div className="flex justify-center items-center w-full py-5 gap-5">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-inherit" />
                  Data kosong
                </div>
              )}
            </div>

            <div className="p-5 border  dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs shadow-2xl">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-sm md:text-lg">
                  Rekapan Data Alumni
                </h1>
              </div>
              <div className="space-y-1 my-3">
                <hr className="dark:opacity-30" />
                <hr className="dark:opacity-10" />
              </div>
              {data['data_alumni']['exist'] && (
                <>
                  <p className="opacity-50">
                    Di bawah ini adalah data-data Siswa yang telah lulus dari tahun ke tahun
                  </p>
                  <hr className="my-2 opacity-0" />
                  <div className="join">
                    <button className="join-item btn btn-sm" onClick={() => handlePagination('data_alumni', 'prev')}>«</button>
                    <button className="join-item btn btn-sm">
                      {tahunList['data_alumni'][pagination['data_alumni']]}
                    </button>
                    <button className="join-item btn btn-sm" onClick={() => handlePagination('data_alumni', 'next')}>»</button>
                  </div>
                  <hr className="my-2 opacity-0" />
                  <div className="grid grid-cols-12 gap-2 border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 rounded-md p-3">
                    <div className="col-span-6 md:col-span-3 flex items-center font-semibold dark:font-normal">
                      Kelas
                    </div>
                    <div className="col-span-3 hidden md:flex items-center font-semibold dark:font-normal">
                      Jurusan
                    </div>
                    <div className="col-span-3 hidden md:flex items-center font-semibold dark:font-normal">
                      Rombel
                    </div>
                    <div className="col-span-6 md:col-span-3 flex items-center font-semibold dark:font-normal">
                      Jumlah Siswa
                    </div>
                  </div>
                  <div className="relative w-full py-2 overflow-auto max-h-[400px]">
                    {getRekapAlumni(tahunList['data_alumni'][pagination['data_alumni']])['rekap'].map((value, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                        <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                          {value['kelas']}
                          <span className="md:hidden block">
                            {value['jurusan']}
                          </span>
                          <span className="md:hidden block">
                            {value['rombel']}
                          </span>
                        </div>
                        <div className="col-span-3 hidden md:flex items-center">
                          {value['jurusan']}
                        </div>
                        <div className="col-span-3 hidden md:flex items-center">
                          {value['rombel']}
                        </div>
                        <div className="col-span-6 md:col-span-3 flex items-center">
                          {value['jumlah']} Siswa
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
                    <div className="col-span-6 md:col-span-9 text-end">
                      Total Alumni tahun {tahunList['data_alumni'][pagination['data_alumni']]}
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="font-bold">
                        {getRekapAlumni(tahunList['data_alumni'][pagination['data_alumni']])['total']} Siswa
                      </div>
                    </div>
                  </div>
                  <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
                    <div className="col-span-6 md:col-span-9 text-end">
                      Total Alumni keseluruhan
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="font-bold">
                        {data['data_alumni']['total']} Siswa
                      </div>
                    </div>
                  </div>
                </>
              )}
              {!data['data_alumni']['exist'] && (
                <div className="flex justify-center items-center w-full py-5 gap-5">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-inherit" />
                  Data kosong
                </div>
              )}
            </div>

            <div className="p-5 border  dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs shadow-2xl">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-sm md:text-lg">
                  Rekapan Data Pegawai
                </h1>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded-full flex items-center gap-2 w-fit bg-green-500/10 text-green-500">
                    <FontAwesomeIcon icon={faUserCheck} className="w-3 h-3 text-inherit" />
                    {data['data_pegawai']['aktif']} <span className="hidden md:block">Aktif</span>
                  </div>
                  <div className="px-2 py-1 rounded-full flex items-center gap-2 w-fit bg-red-500/10 text-red-500">
                    <FontAwesomeIcon icon={faUserXmark} className="w-3 h-3 text-inherit" />
                    {data['data_pegawai']['pensiun']} <span className="hidden md:block">Pensiun</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 my-3">
                <hr className="dark:opacity-30" />
                <hr className="dark:opacity-10" />
              </div>
              <p className="opacity-50">
                Di bawah ini adalah data-data Pegawai yang sedang aktif saat ini.
              </p>
              <hr className="my-2 opacity-0" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                <div className="w-full">
                  <div className="grid grid-cols-12 gap-2 border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 rounded-md p-3">
                    <div className="col-span-6  flex items-center font-semibold dark:font-normal">
                      Jabatan
                    </div>
                    <div className="col-span-6 flex items-center font-semibold dark:font-normal">
                      Jumlah Pegawai
                    </div>
                  </div>
                  <div className="relative w-full py-2 overflow-auto max-h-[400px]">
                    {data['data_pegawai']['rekap']['daftar_jabatan'].map((value, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                        <div className="col-span-6 flex items-center gap-2">
                          {value['jabatan']}
                        </div>
                        <div className="col-span-6 flex items-center">
                          {value['total']} Pegawai
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
                    <div className="col-span-6 text-end">
                      Total Pegawai saat ini
                    </div>
                    <div className="col-span-6 ">
                      <div className="font-bold">
                        {data['data_pegawai']['total']} Pegawai
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-12 gap-2 border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 rounded-md p-3">
                    <div className="col-span-6  flex items-center font-semibold dark:font-normal">
                      Status Kepegawaian
                    </div>
                    <div className="col-span-6 flex items-center font-semibold dark:font-normal">
                      Jumlah Pegawai
                    </div>
                  </div>
                  <div className="relative w-full py-2 overflow-auto max-h-[400px]">
                    {data['data_pegawai']['rekap']['daftar_status_kepegawaian'].map((value, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                        <div className="col-span-6 flex items-center gap-2">
                          {value['status_kepegawaian']}
                        </div>
                        <div className="col-span-6 flex items-center">
                          {value['total']} Pegawai
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
                    <div className="col-span-6 text-end">
                      Total Pegawai saat ini
                    </div>
                    <div className="col-span-6 ">
                      <div className="font-bold">
                        {data['data_pegawai']['total']} Pegawai
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayoutPage>
  );
}
