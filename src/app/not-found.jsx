'use client';

import MainLayoutPage from "@/components/mainLayout";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter()
    return (
        <MainLayoutPage>
            <div className="flex items-center justify-center w-full h-full">
                <div className="flex flex-col items-center ">
                    <img className="md:w-1/2" src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg?t=st=1714010038~exp=1714013638~hmac=2aa256736b284fb1e905b0ab44afc15538d25b80e762c506a0ecfe143d7b8b5d&w=826" alt="" />
                    <h1 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-zinc-800 to-red-600 text-5xl text-center">
                        Halaman Tidak Ditemukan
                    </h1>
                    <hr className="my-2 opacity-0" />
                    <p className="text-center">
                        Anda bisa kembali ke halaman sebelumnya dengan menekan <button type="button" onClick={() => router.back()} className="px-3 py-1 rounded-full bg-zinc-50 hover:bg-zinc-100">Tombol ini</button>
                    </p>
                    <hr className="my-12 opacity-0" />
                </div>
            </div>
        </MainLayoutPage>
    )
}