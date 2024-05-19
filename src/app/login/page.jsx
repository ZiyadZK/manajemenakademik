'use client'


import { jakarta } from "@/config/fonts";
import { loginAkun } from "@/lib/model/akunModel";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight, faEnvelope, faExclamationCircle, faExclamationTriangle, faKey, faSignIn, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function LoginPage() {
    const router = useRouter();
    const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false })
    const [showPass, setShowPass] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    const submitLogin = async (e) => {
        e.preventDefault();

        const {email, password} = loginForm;
        if(email === '' || password === '') {
            return toast.error('Silahkan isi terlebih dahulu!')
        }
        setLoginLoading(state => !state)
        try {
            const duration = loginForm.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000
            const result = await loginAkun(email, password, duration);
            if(result.success === false) {
                setLoginLoading(state => !state)
                return toast.error(result.message, {
                    position: 'top-right'
                });
            }

            setLoginLoading(state => !state);
            router.push('/');
            return toast.success(result.message)
        } catch (error) {
            setLoginLoading(state => !state);
            return toast.error('Terdapat Error!');
        }
        
    }

    return (
        <div className={`w-full h-screen bg-gradient-to-t from-amber-50 to-white flex items-center justify-center ${jakarta.className}`}>
            <Toaster />
            <form onSubmit={submitLogin} className="w-full md:w-1/3 bg-white px-5 md:px-5 h-full flex flex-col md:block justify-between md:h-fit py-10 md:py-5 text-zinc-800  md:rounded-2xl md:shadow-2xl">
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
                    <div className="relative w-full md:w-2/3 flex justify-center">
                        <input type="text" disabled={loginLoading} required onChange={e => setLoginForm(state => ({...state, email: e.target.value}))} className="w-full rounded-full border border-zinc-100/0 bg-zinc-50 shadow-lg pl-12 pr-3 h-12 placeholder-shown:border-zinc-100 placeholder-shown:shadow-none placeholder-shown:bg-zinc-50/0 transition-all duration-300 outline-none peer" placeholder="Masukkan Email anda" />
                        <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-inherit" />
                        </div>
                    </div>
                    <div className="relative w-full md:w-2/3 flex justify-center">
                        <input disabled={loginLoading} type={`${showPass ? 'text' : 'password'}`} required onChange={e => setLoginForm(state => ({...state, password: e.target.value}))} className="w-full rounded-full border border-zinc-100/0 bg-zinc-50 shadow-lg pl-12 pr-3 h-12 placeholder-shown:border-zinc-100 placeholder-shown:shadow-none placeholder-shown:bg-zinc-50/0 transition-all duration-300 outline-none peer" placeholder="Masukkan Password anda" />
                        <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faKey} className="w-4 h-4 text-inherit" />
                        </div>
                        <button type="button"  onClick={() => setShowPass(state => !state)} className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4 text-inherit" />
                        </button>
                    </div>
                    <div className="relative w-full md:w-2/3">
                        <div className="flex items-center gap-5 text-xs md:text-sm">
                            <input type="checkbox" checked={loginForm['rememberMe']} onChange={() => setLoginForm(state => ({...state, rememberMe: !state['rememberMe']}))} />
                            Ingat Login saya
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className={` flex justify-center ${jakarta.className}`}>
                        <button type="submit" disabled={loginLoading} className="w-full md:w-1/3 rounded-lg py-3 flex gap-3 items-center justify-center hover:bg-zinc-500 focus:bg-zinc-700 bg-zinc-600 text-white hover:shadow-lg focus:shadow-2xl ">
                            {loginLoading ? 'Loading' : 'Masuk'}
                            <FontAwesomeIcon icon={!loginLoading ? faArrowRight : faSpinner} className={`w-4 h-4 text-inherit ${loginLoading ? 'animate-spin' : ''} `} />
                        </button>
                    </div>
                    <div className={` flex justify-center ${jakarta.className}`}>
                        <button type="button" className="w-full md:w-1/3 rounded-lg py-3 flex gap-3 items-center justify-center border hover:border-blue-400 hover:bg-blue-50/50 focus:border-blue-400 focus:bg-blue-50 focus:text-blue-700 hover:text-blue-700 hover:shadow-lg focus:shadow-2xl ">
                            Lupa Password
                            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-inherit" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}