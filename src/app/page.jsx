'use client'

import MainLayoutPage from "@/components/mainLayout";
import { mont } from "@/config/fonts";
import { faList, faPieChart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {

  const [tab, setTab] = useState({
    siswa: 'grafik',
    mutasi_siswa: 'grafik',
    alumni: 'grafik',
    pegawai: 'grafik',
    ijazah: 'grafik',
  })

  

  return (
    <MainLayoutPage>
      <Toaster />
      <div className="flex justify-center w-full text-zinc-600 dark:text-zinc-200">
        <div className="w-full max-w-[1280px]">
          <div className="p-5 border  dark:border-zinc-800 bg-white dark:bg-zinc-900 md:rounded-xl rounded-md text-xs">
            <div className="flex justify-between items-center">
              <h1 className="font-medium text-sm md:text-lg">
                Rekapan Data Siswa
              </h1>
              <div className="flex items-center gap-1">
                <button type="button" disabled={tab['siswa'] === 'tabel'} onClick={() => setTab(state => ({...state, siswa: 'tabel'}))} className={`px-3 py-2 rounded-md ${tab['siswa'] === 'tabel' ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                  Tabel
                </button>
                <button type="button" disabled={tab['siswa'] === 'grafik'} onClick={() => setTab(state => ({...state, siswa: 'grafik'}))} className={`px-3 py-2 rounded-md ${tab['siswa'] === 'grafik' ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'} ease-out duration-200`}>
                  Grafik
                </button>
              </div>
            </div>
            <div className="space-y-1 my-3">
              <hr className="dark:opacity-30" />
              <hr className="dark:opacity-10" />
            </div>
            {tab['siswa'] === 'tabel' && (
              <div className="">
                Ini Tampilan tabel
              </div>
            )}
            {tab['siswa'] === 'grafik' && (
              <div className="">
                Ini tampilan Grafik
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayoutPage>
  );
}
