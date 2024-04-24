'use client'


import { mont, rale } from "@/config/fonts";
import { loginAkun } from "@/lib/model/akunModel";
import { faEnvelope, faExclamationCircle, faExclamationTriangle, faKey, faSignIn, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nunito, Quicksand } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

let imageLinks = [
    'https://wallpapers.com/images/featured/vector-art-6ttd2h971c0ivqyh.jpg',
    'https://wallpapercave.com/wp/wp4506069.jpg',
    'https://free4kwallpapers.com/uploads/originals/2020/11/15/sunset-vector-wallpaper.jpg'
]

export default function LoginPage() {
    const router = useRouter();
    const [loginForm, setLoginForm] = useState({ email: '', password: '' })
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
            const result = await loginAkun(email, password);
            if(result === null) {
                setLoginLoading(state => !state)
                return toast.error('Email / Password anda salah, Silahkan coba lagi!', {
                    position: 'top-right'
                });
            }

            setLoginLoading(state => !state);
            router.push('/');
            return toast.success('Berhasil login!')
        } catch (error) {
            setLoginLoading(state => !state);
            return toast.error('Terdapat Error!');
        }
        
    }

    return (
        <div className="relative overflow-hidden w-full h-screen">
            <Toaster />
            <img src={`${imageLinks[0]}`} className="w-full h-full object-cover" alt="" />
            <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center backdrop-blur">
                <div className="w-full md:w-1/3 p-5 md:p-8 md:rounded-2xl bg-white h-full md:h-fit flex flex-col md:block justify-center">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 p-2 md:p-3 ">
                            <img className="w-5" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="" />
                            <h1 className={`${rale.className} text-zinc-600 font-bold`}>SIM<span className="text-orange-600">AK</span></h1>
                        </div>
                        <h1 className={`${rale.className} text-zinc-700 text-xs md:text-md text-end`}>Sistem Manajemen <br /> Akademik SMK PUN Bandung</h1>
                    </div>
                    <hr className="my-5 md:my-2 opacity-0" />
                    <h1 className={`${rale.className} text-zinc-800 font-medium text-2xl`}>Selamat Datang,</h1>
                    <p className={`${rale.className} text-zinc-600 text-xs md:text-sm`}>Silahkan gunakan akun anda untuk masuk ke Dashboard SIMAK</p>
                    <hr className="my-5 md:my-2 opacity-0" />
                    <form onSubmit={submitLogin}>
                        <div className="relative h-10">
                            <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center">
                                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-zinc-500" />
                            </div>
                            <input required type="text" onChange={e => setLoginForm(state => ({...state, email: e.target.value}))} className="w-full h-full rounded-lg border outline outline-offset-2 outline-2 outline-zinc-300/0 focus:outline-zinc-300/100 bg-transparent pl-10 text-zinc-800" placeholder="Email / Username anda" />
                        </div>
                        <hr className="my-2 opacity-0" />
                        <div className="relative h-10">
                            <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center">
                                <FontAwesomeIcon icon={faKey} className="w-4 h-4 text-zinc-500" />
                            </div>
                            <input required type={`${showPass ? 'text' : 'password'}`} onChange={e => setLoginForm(state => ({...state, password: e.target.value}))} className="w-full h-full rounded-lg border outline outline-offset-2 outline-2 outline-zinc-300/0 focus:outline-zinc-300/100 bg-transparent pl-10 text-zinc-800" placeholder="Password anda" />
                        </div>
                        <hr className="my-1 opacity-0" />
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="rememberme" defaultChecked className="checkbox checkbox-sm checkbox-warning" />
                                <label htmlFor="rememberme" className={`${rale.className} text-zinc-500 text-sm`}>Ingat Login</label>
                            </div>
                            <button type="button" onClick={() => setShowPass(state => !state)} className={`${rale.className} text-zinc-500 text-xs md:text-sm hover:text-blue-600`}>
                                {showPass ? 'Sembunyikan' : 'Lihat'} Password
                            </button>
                        </div>
                        <hr className="my-2 opacity-0" />
                        <button type="submit" disabled={loginLoading ? true : false} className={`${rale.className} btn w-full text-white flex items-center justify-center gap-5 bg-zinc-800 disabled:bg-zinc-800 disabled:text-white hover:bg-zinc-500`}>
                            <FontAwesomeIcon icon={loginLoading ? faSpinner : faSignIn} className={`w-4 h-4 text-inherit ${loginLoading && 'animate-spin'}`} />
                            {!loginLoading && 'Masuk'}
                        </button>
                    </form>
                    <hr className="w-full my-3" />
                    <a href="#" className={`${rale.className} btn w-full bg-transparent border-zinc-300 flex items-center justify-center text-zinc-600 font-medium gap-2 hover:bg-zinc-100`}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-700" />
                        Lupa Password?
                    </a>
                </div>
            </div>
        </div>
    )
}