'use client'

// import { nunito, quicksand } from "@/config/fonts";
import { logoutAkun } from "@/lib/model/akunModel";
import { faCertificate, faClipboard, faHouse, faSignOut, faUserShield, faUserTie, faUsersRectangle, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nunito, Quicksand } from "next/font/google";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const nunito = Nunito({subsets: ['latin']})
const quicksand = Quicksand({subsets: ['latin']})

const mySwal = withReactContent(Swal)
const menuLink = [
    { title: 'Dashboard', icon: faHouse, url: '/'},
    { title: 'Ambil Ijazah', icon: faClipboard, url: '/ambilijazah'}
]

const dataLink = [
    { title: 'Siswa', icon: faUsersViewfinder, url: '/data/siswa'},
    { title: 'Pegawai', icon: faUserTie, url: '/data/pegawai'},
    { title: 'Ijazah', icon: faCertificate, url: '/data/ijazah'},
    { title: 'Kelas', icon: faUsersRectangle, url: '/data/kelas'},
    { title: 'Akun', icon: faUserShield, url: '/data/akun'}
]

export default function MainLayoutPage({children}) {
    const router = useRouter()
    const path = usePathname();

    const submitLogout = async () => {
        return mySwal.fire({
            title: 'Apakah anda yakin?',
            confirmButtonColor: '#09090b',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(async result => {
            if(result.isConfirmed) {
                mySwal.fire({
                    title: 'Sedang memproses data..',
                    text: 'Harap menunggu..',
                    timer: 10000,
                    allowOutsideClick: false,
                    showConfirmButton: false
                })
                await logoutAkun();
                mySwal.close()
                return router.push('/login')
            }
        })
    }

    return (
        <div className={`${quicksand.className} text-zinc-800 bg-zinc-200 w-full h-screen grid grid-cols-12`}>
            <div className="col-span-2 p-5 w-full h-full">
                <div className="flex justify-center w-full gap-4 items-center">
                    <Image src={'/logo-sekolah.png'} width={20} height={20} />
                    <h1 className={`${nunito.className} font-bold text-3xl tracking-tighter`}>
                        Siska<span className="text-orange-600">pun</span>
                    </h1>
                </div>
                <hr className="my-1 opacity-0" />
                <div className="flex justify-center w-full">
                    <p className="text-sm text-center">
                        Sistem Manajemen Akademik
                    </p>
                </div>
                <hr className="my-2 w-full border border-zinc-300" />
                <div className="flex flex-col justify-between h-[495px] ">
                    <div className="w-full h-full relative overflow-auto">
                        <p className="text-sm tracking-tighter text-zinc-400 font-bold">Data - Data</p>
                        <hr className="my-1 opacity-0" />
                        {dataLink.map(({title, icon, url}, index) => (
                            <button key={index} type="button" onClick={() => router.push(url)} className={`w-full py-2 px-4 flex items-center gap-5 ${path !== url && 'hover:bg-zinc-300 hover:text-orange-600'} rounded-lg transition-all duration-300 ${path === url && 'bg-zinc-800 text-white'}`} disabled={path === url ? true : false}>
                                <FontAwesomeIcon icon={icon} className="w-4 h-4 text-inherit" />
                                {title}
                            </button>
                        ))}
                        <hr className="my-1 opacity-0" />
                        <p className="text-sm tracking-tighter text-zinc-400 font-bold">Menu</p>
                        <hr className="my-1 opacity-0" />
                        {menuLink.map(({title, icon, url}, index) => (
                            <button key={index} type="button" onClick={() => router.push(url)} className={`w-full py-2 px-4 flex items-center gap-5 ${path !== url && 'hover:bg-zinc-300 hover:text-orange-600'} rounded-lg transition-all duration-300 ${path === url && 'bg-zinc-800 text-white'}`} disabled={path === url ? true : false}>
                                <FontAwesomeIcon icon={icon} className="w-4 h-4 text-inherit" />
                                {title}
                            </button>
                        ))}
                    </div>
                    <button type="button" onClick={submitLogout} className="py-2 w-full rounded bg-zinc-800 text-white font-bold flex items-center gap-3 justify-center hover:bg-red-600 transition-all duration-300 focus:bg-red-800">
                        <FontAwesomeIcon icon={faSignOut} className="w-3 h-3 text-inherit" />
                        Keluar
                    </button>
                </div>
            </div>
            <div className="col-span-10 bg-white rounded-l-xl relative h-screen w-full overflow-auto">
                {children}
            </div>
        </div>
    )
}