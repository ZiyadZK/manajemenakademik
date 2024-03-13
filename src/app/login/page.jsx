'use client'


import { loginAkun } from "@/lib/model/akunModel";
import { faEnvelope, faExclamationCircle, faKey, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nunito, Quicksand } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const nunito = Nunito({subsets: ['latin']})
const quicksand = Quicksand({subsets: ['latin']})

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
        <div className={`${quicksand.className} grid grid-cols-2 bg-white w-full h-screen`}>
            <Toaster />
            <div className="w-full h-full relative overflow-hidden group hidden md:block ">
                <img className="w-full h-full object-center object-cover" src="https://majalahsora.com/wp-content/uploads/2016/06/smk-pu.jpg" alt="" />
                <div className="absolute top-0 left-0 w-full h-full flex items-center p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-md">
                    <div className="w-full">
                        <div className="flex w-full justify-center items-center gap-5">
                            <Image src={'/logo-sekolah.png'} width={40} height={40} alt="Logo sekolah" />
                            <h1 className={`${nunito.className} text-3xl font-bold text-white`}>
                                Sistem Manajemen <span className="text-orange-600">Akademik</span> <br />
                                <span className="font-light text-lg text-white">
                                    SMK Pekerjaan Umum Negeri Bandung
                                </span>
                            </h1>
                        </div>
                        <div className="w-full flex justify-center mt-5 text-white">
                            <p className="font-extralight text-center">
                                Sistem yang berfungsi untuk mengelola data-data <br />
                                yang ada disekolah secara Efisien dan Efektif.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full p-5 col-span-2 md:col-span-1">
                <div className="flex items-center gap-5 w-full">
                    <Image src={'/logo-sekolah.png'} width={25} height={25} alt="Logo sekolah" />
                    <article>
                        <h1 className="text-zinc-800 font-extrabold">
                            Siska<span className="text-orange-600">pun</span>
                        </h1>
                        <p className="text-sm text-zinc-800 font-extralight">
                            Sistem Manajemen Akademik
                        </p>
                    </article>
                </div>
                <div className="my-10">
                    <div className="flex w-full justify-center text-zinc-800">
                        <h1 className="text-xl md:text-4xl">
                            Hai, <b>Selamat Datang!</b>
                        </h1>
                    </div>
                </div>
                <div className="flex w-full justify-center text-zinc-800">
                    <p className="text-center text-sm md:text-lg">
                        Gunakan akun anda untuk masuk ke dalam <b>Dashboard</b>
                    </p>
                </div>
                <form onSubmit={submitLogin} className="flex justify-center w-full text-zinc-800 my-5">
                    <div className="md:w-2/3 w-full space-y-3">
                        <div className="w-full relative">
                            <input required value={loginForm.email} onChange={e => setLoginForm(state => state = {...state, email: e.target.value})} type="email" name="email" className="rounded px-4 py-2 w-full border border-zinc-600 placeholder-shown:border-zinc-400 outline-none hover:border-zinc-600 focus:border-zinc-600 bg-zinc-100 peer transition-all duration-300" autoComplete="off" placeholder="Email anda disini"/>
                            <div className="absolute top-0 right-0 w-10 h-full flex items-center justify-center z-50 peer-placeholder-shown:text-zinc-400 text-zinc-700 transition-all duration-300">
                                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-inherit" />
                            </div>
                        </div>
                        <hr className="w-full opacity-0" />
                        <div className="w-full relative">
                            <input required value={loginForm.password} onChange={e => setLoginForm(state => state = {...state, password: e.target.value})} type={showPass ? 'text' : 'password'} name="password" className="rounded px-4 py-2 w-full border border-zinc-600 placeholder-shown:border-zinc-400 outline-none hover:border-zinc-600 focus:border-zinc-600 bg-zinc-100 peer transition-all duration-300" autoComplete="off" placeholder="Password anda disini"/>
                            <div className="absolute top-0 right-0 w-10 h-full flex items-center justify-center z-50 peer-placeholder-shown:text-zinc-400 text-zinc-700 transition-all duration-300">
                                <FontAwesomeIcon icon={faKey} className="w-5 h-5 text-inherit" />
                            </div>
                        </div>
                        <div className="flex w-full justify-between items-center text-zinc-800">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="logged" id="logged" className="accent-black outline-none" />
                                <label htmlFor="logged" className="text-sm">Ingat <b>Login</b></label>
                            </div>
                            <button onClick={() => setShowPass(state => !state)} type="button" className="text-sm font-bold hover:text-orange-600">
                                {showPass ? 'Sembunyikan Password' : 'Tunjukan Password'}
                            </button>
                        </div>
                        <hr className="my-3 opacity-0" />
                        <div className="flex w-full justify-center">
                            {!loginLoading ? <button  type="submit" className="w-1/2 border py-2 rounded bg-zinc-800 text-white hover:bg-zinc-900 focus:bg-zinc-900">
                                Masuk
                            </button> : <button disabled type="submit" className="w-1/2 border py-2 rounded bg-zinc-800 text-white hover:bg-zinc-900 focus:bg-zinc-900">
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin w-5 h-5 text-white" />
                            </button>}
                        </div>
                        <hr className="my-3 opacity-0" />
                        <div className="grid grid-cols-2">
                            <a href="" className="px-3 tracking-tighter font-medium hover:text-orange-600 my-2 w-full flex justify-center text-center">
                                Lupa Password
                            </a>
                            <a href="" className="px-3 tracking-tighter font-medium hover:text-orange-600 my-2 w-full flex justify-center text-center">
                                Masuk sebagai Siswa
                            </a>
                        </div>
                    </div>
                </form>
                <div className="text-zinc-800 grid grid-cols-12 gap-5 md:hidden">
                    <div className="w-full flex justify-center col-span-2">
                        <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="w-full col-span-10 text-sm">
                        <p className="font-bold">Perhatian!</p>
                        <p>Dianjurkan untuk menggunakan <b>Laptop</b> atau <b>PC</b> untuk menghasilkan tampilan yang maksimal!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}