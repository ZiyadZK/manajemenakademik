'use client'

import MainLayoutPage from "@/components/mainLayout";
import { mont } from "@/config/fonts";
import { faList, faPieChart, faUserCheck, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {

  const [kelasList, setKelasList] = useState([
    'X', 'XI', 'XII'
  ])

  return (
    <MainLayoutPage>
      <Toaster />
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
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                  <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                    XII
                    <span className="md:hidden block">
                      TKJ
                    </span>
                    <span className="md:hidden block">
                      1
                    </span>
                  </div>
                  <div className="col-span-3 hidden md:flex items-center">
                    TKJ
                  </div>
                  <div className="col-span-3 hidden md:flex items-center">
                    1
                  </div>
                  <div className="col-span-6 md:col-span-3 flex items-center">
                    120 Siswa
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
                  120 Siswa
                </div>
              </div>
            </div>

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
            <p className="opacity-50">
              Di bawah ini adalah data-data Siswa yang telah di mutasi dari tahun ke tahun
            </p>
            <hr className="my-2 opacity-0" />
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm">2024</button>
              <button className="join-item btn btn-sm">»</button>
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
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                  <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                    XII
                    <span className="md:hidden block">
                      TKJ
                    </span>
                    <span className="md:hidden block">
                      1
                    </span>
                  </div>
                  <div className="col-span-3 hidden md:flex items-center">
                    TKJ
                  </div>
                  <div className="col-span-3 hidden md:flex items-center">
                    1
                  </div>
                  <div className="col-span-6 md:col-span-3 flex items-center">
                    120 Siswa
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
              <div className="col-span-6 md:col-span-9 text-end">
                Total Mutasi Siswa tahun 2024
              </div>
              <div className="col-span-6 md:col-span-3">
                <div className="font-bold">
                  120 Siswa
                </div>
              </div>
            </div>
            <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
              <div className="col-span-6 md:col-span-9 text-end">
                Total Mutasi Siswa keseluruhan
              </div>
              <div className="col-span-6 md:col-span-3">
                <div className="font-bold">
                  120 Siswa
                </div>
              </div>
            </div>
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
            <p className="opacity-50">
              Di bawah ini adalah data-data Siswa yang telah lulus dari tahun ke tahun
            </p>
            <hr className="my-2 opacity-0" />
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm">2024</button>
              <button className="join-item btn btn-sm">»</button>
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
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                  <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                    XII
                    <span className="md:hidden block">
                      TKJ
                    </span>
                    <span className="md:hidden block">
                      1
                    </span>
                  </div>
                  <div className="col-span-3 hidden md:flex items-center">
                    TKJ
                  </div>
                  <div className="col-span-3 hidden md:flex items-center">
                    1
                  </div>
                  <div className="col-span-6 md:col-span-3 flex items-center">
                    120 Siswa
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
              <div className="col-span-6 md:col-span-9 text-end">
                Total Alumni tahun 2024
              </div>
              <div className="col-span-6 md:col-span-3">
                <div className="font-bold">
                  120 Siswa
                </div>
              </div>
            </div>
            <div className="border-t dark:border-zinc-700 p-3 grid grid-cols-12 gap-2">
              <div className="col-span-6 md:col-span-9 text-end">
                Total Alumni keseluruhan
              </div>
              <div className="col-span-6 md:col-span-3">
                <div className="font-bold">
                  120 Siswa
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 border  dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs shadow-2xl">
            <div className="flex justify-between items-center">
              <h1 className="font-medium text-sm md:text-lg">
                Rekapan Data Pegawai
              </h1>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-full flex items-center gap-2 w-fit bg-green-500/10 text-green-500">
                  <FontAwesomeIcon icon={faUserCheck} className="w-3 h-3 text-inherit" />
                  120 <span className="hidden md:block">Aktif</span>
                </div>
                <div className="px-2 py-1 rounded-full flex items-center gap-2 w-fit bg-red-500/10 text-red-500">
                  <FontAwesomeIcon icon={faUserXmark} className="w-3 h-3 text-inherit" />
                  120 <span className="hidden md:block">Pensiun</span>
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
                  {Array.from({ length: 20 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                      <div className="col-span-6 flex items-center gap-2">
                        JABATAN PEGAWAI DISINI
                      </div>
                      <div className="col-span-6 flex items-center">
                        120 Pegawai
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
                      120 Pegawai
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
                  {Array.from({ length:5 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 px-3 py-4">
                      <div className="col-span-6 flex items-center gap-2">
                        STATUS KEPEGAWAIAN DISINI
                      </div>
                      <div className="col-span-6 flex items-center">
                        120 Pegawai
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
                      120 Pegawai
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayoutPage>
  );
}
