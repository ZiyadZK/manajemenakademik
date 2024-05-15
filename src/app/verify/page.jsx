'use client'


import { jakarta } from "@/config/fonts";
import { setCookie } from "@/lib/cookieHandler";
import { getLoggedUserdata, hasCookieUserdata, loginAkun, logoutAkun } from "@/lib/model/akunModel";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight, faCheck, faEarthAmerica, faEnvelope, faExclamationCircle, faExclamationTriangle, faKey, faLock, faSignIn, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function VerifyPage() {
    const router = useRouter();
    const [loginForm, setLoginForm] = useState({ pin: '' })
    const [userdata, setUserdata] = useState({})
    const [loginLoading, setLoginLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0)

    const resendEmailPIN = async () => {
        setResendCooldown(30)
    }

    const getUserdata = async () => {
        const response = await hasCookieUserdata()
        if(response) {
            const data = await getLoggedUserdata()
            if(data) {
                setUserdata(data)
            }else{
                router.push('/login')
            }
        }else{
            router.push('/login')
        }
    }

    const submitVerify = async (e) => {
        e.preventDefault()

        if(loginForm.pin === userdata.userdataToken) {
            await setCookie('userdataToken', loginForm.pin)
            toast.success('Berhasil, PIN Anda cocok!')
            router.push('/')
        }else{
            toast.error('Gagal, PIN anda tidak sesuai!')
        }
    }

    useEffect(() => {
        getUserdata()
    }, [])

    const keluarAkun = async () => {
        await logoutAkun()

        router.push('/login')
    }

    useEffect(() => {
        if(resendCooldown > 0) {
            const timerId = setInterval(() => {
                setResendCooldown(state => state - 1)
            }, 1000)
            return () => clearInterval(timerId)
        }
    }, [resendCooldown])

    return (
        <div className={`w-full h-screen bg-gradient-to-t from-amber-50 to-white flex items-center justify-center ${jakarta.className}`}>
            <Toaster />
            <form onSubmit={submitVerify} className="w-full md:w-1/3 bg-white px-5 md:px-5 h-full flex flex-col md:block justify-between md:h-fit py-10 md:py-5 text-zinc-800  md:rounded-2xl md:shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Image src={'/logo-sekolah.png'} width={15} height={15} />
                        <h1 className={`${jakarta.className} font-bold text-zinc-500`}>
                            SIM<span className="text-orange-500">Ak</span>
                        </h1>
                    </div>
                    <div className={`${jakarta.className} text-xs text-end`}>
                        <p>Sistem Manajemen Akademik</p>
                        <p className="opacity-50">SMK PU Negeri Bandung</p>
                    </div>
                </div>
                <div className="flex flex-col items-center md:py-10 gap-4">
                    <p className="text-zinc-400 text-center">
                        <span className="text-zinc-700">PIN Verifikasi</span> sudah dikirimkan ke Email <span className="text-zinc-700">{userdata.email_akun}</span>.<br />
                        Silahkan masukkan kedalam kolom di bawah ini.
                    </p>
                    <div className="relative w-full md:w-2/3 flex justify-center">
                        <input type="text" disabled={loginLoading} required onChange={e => setLoginForm(state => ({...state, pin: e.target.value}))} className="w-full rounded-full border border-zinc-100/0 bg-zinc-50 shadow-lg pl-12 pr-3 h-12 placeholder-shown:border-zinc-100 placeholder-shown:shadow-none placeholder-shown:bg-zinc-50/0 transition-all duration-300 outline-none peer" placeholder="Masukkan PIN Anda" />
                        <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-inherit" />
                        </div>
                    </div>
                    <button type="button" onClick={() => resendEmailPIN()} disabled={resendCooldown > 0} className={`flex outline-none items-center gap-3 text-xs md:text-sm hover:text-blue-700 ${resendCooldown > 1 ? 'text-blue-700' : 'text-zinc-400'}`}>
                        <FontAwesomeIcon icon={resendCooldown < 1 ? faEnvelope : faSpinner} className={`w-3 h-3 text-inherit ${resendCooldown > 0 ? 'animate-spin' : ''} `} />
                        {resendCooldown < 1 ? `Kirim ulang PIN ke Email ${userdata.email_akun}` : `Tunggu ${resendCooldown} detik untuk mengirim ulang`} 
                    </button>
                </div>
                <div className="space-y-2">
                    <div className={` flex justify-center ${jakarta.className}`}>
                        <button type="submit" disabled={loginLoading} className="w-full md:w-1/3 rounded-lg py-3 flex gap-3 items-center justify-center hover:bg-green-500 focus:bg-green-700 bg-green-600 text-white hover:shadow-lg focus:shadow-2xl ">
                            {loginLoading ? 'Loading' : 'Konfirmasi'}
                            <FontAwesomeIcon icon={!loginLoading ? faCheck : faSpinner} className={`w-4 h-4 text-inherit ${loginLoading ? 'animate-spin' : ''} `} />
                        </button>
                    </div>
                    <div className={` flex justify-center ${jakarta.className}`}>
                        <button type="button" onClick={() => keluarAkun()} className="w-full md:w-1/3 rounded-lg py-3 flex gap-3 items-center justify-center border hover:border-red-400 hover:bg-red-50/50 focus:border-red-400 focus:bg-red-50 focus:text-red-700 hover:text-red-700 hover:shadow-lg focus:shadow-2xl ">
                            Keluar
                            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-inherit" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}