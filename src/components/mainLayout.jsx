'use client'

import { rale } from "@/config/fonts";
// import { nunito, quicksand } from "@/config/fonts";
import { getLoggedUserdata, logoutAkun } from "@/lib/model/akunModel";
import { navigator } from "@/lib/navigator";
import { faBars, faCertificate, faClipboard, faHouse, faSignOut, faUserShield, faUserTie, faUsersBetweenLines, faUsersRectangle, faUsersViewfinder, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nunito, Quicksand } from "next/font/google";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal)

const navLink = [
    { title: 'Dashboard', icon: faHouse, url: '/', page: 'Dashboard'},
    { title: 'Ambil Ijazah', icon: faClipboard, url: '/ambilijazah', page: 'Ambil Ijazah'},
    { title: 'Siswa', icon: faUsersViewfinder, url: '/data/siswa', page: 'Data Siswa'},
    { title: 'Alumni', icon: faUsersBetweenLines, url: '/data/alumni', page: 'Data Alumni'},
    { title: 'Pegawai', icon: faUserTie, url: '/data/pegawai', page: 'Data Pegawai'},
    { title: 'Ijazah', icon: faCertificate, url: '/data/ijazah', page: 'Data Ijazah'},
    { title: 'Kelas', icon: faUsersRectangle, url: '/data/kelas', page: 'Data Kelas'},
    { title: 'Akun', icon: faUserShield, url: '/data/akun', page: 'Data Akun'},
]

export default function MainLayoutPage({children}) {
    const router = useRouter()
    const path = usePathname();
    const filteredPath = navLink.find(item => path === item.url || (path.startsWith(item.url) && item.url !== '/'))
    const [loggedAkun, setLoggedAkun] = useState(null)

    const getLoggedAkun = async () => {
        const userdata = await getLoggedUserdata()
        setLoggedAkun(userdata)
    }

    useEffect(() => {
        getLoggedAkun()
    }, [])

    const [showSidebar, setShowSidebar] = useState(false)

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
        <div className="w-full h-screen bg-white">
            {showSidebar && <SidebarSection setShowSidebar={setShowSidebar} />}
            <nav className="fixed top-0 left-0 px-5 py-3 border-b border-zinc-300 shadow-lg w-full flex items-center z-50 bg-white">
                <div className="w-2/12">    
                    <div className="flex items-center gap-5">
                        <img className="w-5 hidden md:block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="" />
                        <h1 className={`${rale.className} font-bold text-gray-800 text-xs md:text-sm`}>SIM<span className="text-orange-600">AK.</span></h1>
                    </div>
                </div>
                <div className="w-10/12 flex justify-between items-center">
                    <div className="flex items-center gap-3">   
                        <button type="button" onClick={() => setShowSidebar(state => !state)} className="md:hidden flex items-center justify-center swap swap-rotate  text-blue-600 btn btn-sm bg-transparent border-0">
                            <FontAwesomeIcon icon={showSidebar ? faXmark : faBars} className="w-3 h-3 text-inherit" />
                        </button>
                        <h1 className={`${rale.className} text-blue-800 hidden md:flex font-medium text-xl tracking-wide w-fit  items-center gap-3`}>
                            <FontAwesomeIcon icon={filteredPath.icon} className="w-4 h-4 text-inherit" />
                            {filteredPath.page}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <article className="text-end">
                            <h1 className={`${rale.className} text-zinc-700 text-xs font-medium md:text-sm`}>
                                {loggedAkun !== null && loggedAkun.email_akun}
                            </h1>
                            <p className={`${rale.className} text-zinc-700 text-xs`}>
                                {loggedAkun !== null && loggedAkun.role_akun}
                            </p>
                        </article>
                        <button type="button" onClick={() => submitLogout()} className={`${rale.className} btn btn-error btn-sm flex items-center justify-center gap-3`}>
                            <FontAwesomeIcon icon={faSignOut} className="w-3 h-3 text-inherit" />
                            <span className="hidden md:block">Keluar</span>
                        </button>
                    </div>
                </div>
            </nav>
            <div className="flex h-full">
                <div className="hidden md:block relative overflow-auto w-2/12 border-r border-zinc-300 h-full text-zinc-800 pt-16">
                    <hr className="my-1 opacity-0" />
                    {navLink.map(item => (
                        <a key={item.title} href={`${item.url}`} className={`${rale.className} ${path === item.url || (path.startsWith(item.url) && item.url !== '/') ? 'text-zinc-600' : 'text-zinc-400'} font-medium text-sm flex items-center gap-3 hover:gap-4 hover:text-zinc-600 px-5 py-2 hover:bg-zinc-100 transition-all duration-300 ${path === item.url || (path.startsWith(item.url) && item.url !== '/') ? 'border-r-2 border-r-orange-600' : ''}`}>
                            <FontAwesomeIcon icon={item.icon} className="w-3 h-3 text-inherit" />
                            {item.title}
                        </a>
                    ))}
                </div>
                <div className={`${rale.className} w-full md:w-10/12 px-5 pt-16 h-full text-zinc-800 relative overflow-auto`}>
                    <hr className="block md:hidden my-1 opacity-0" />
                    <h1 className={`${rale.className} text-zinc-800 md:hidden flex font-medium text-xl tracking-wide w-fit  items-center gap-3`}>
                        <FontAwesomeIcon icon={filteredPath.icon} className="w-4 h-4 text-inherit" />
                        {filteredPath.page}
                    </h1>
                    {children}
                </div>
            </div>
        </div>
    )
}

function SidebarSection() {
    const path = usePathname();
    return (
        <div className="fixed top-0 left-0 w-full h-screen overflow-auto bg-white z-50">
            <hr className="mt-20 opacity-0" />
            <hr className="my-1 opacity-0" />
            {navLink.map(item => (
                <a key={item.title} href={`${item.url}`} className={`${rale.className} text-zinc-600 font-medium text-sm flex items-center gap-3 hover:gap-4 px-5 py-2 hover:bg-zinc-100 transition-all duration-300 ${path === item.url || (path.startsWith(item.url) && item.url !== '/') ? 'border-r-2 border-r-orange-600' : ''}`}>
                    <FontAwesomeIcon icon={item.icon} className="w-3 h-3 text-inherit" />
                    {item.title}
                </a>
            ))}
        </div>
    )
}