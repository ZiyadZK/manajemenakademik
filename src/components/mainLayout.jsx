'use client'

import { mont, open, quicksand, rale } from "@/config/fonts";
// import { nunito, quicksand } from "@/config/fonts";
import { getLoggedUserdata, logoutAkun } from "@/lib/model/akunModel";
import { navigator } from "@/lib/navigator";
import { faBars, faBook, faCertificate, faClipboard, faCog, faCogs, faFolderTree, faHouse, faLayerGroup, faSignOut, faSpinner, faUserGraduate, faUserLock, faUserShield, faUserTie, faUserXmark, faUsersBetweenLines, faUsersRectangle, faUsersViewfinder, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nunito, Quicksand } from "next/font/google";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal)

const navLinkMasterData = [
    { title: 'Siswa', icon: faUsersViewfinder, url: '/data/siswa', page: 'Data Siswa'},
    { title: 'Mutasi Siswa', icon: faUserXmark, url: '/data/mutasisiswa', page: 'Data Mutasi Siswa'},
    { title: 'Alumni', icon: faUserGraduate, url: '/data/alumni', page: 'Data Alumni'},
    { title: 'Pegawai', icon: faUserTie, url: '/data/pegawai', page: 'Data Pegawai'},
    { title: 'Sertifikasi', icon: faCertificate, url: '/data/sertifikasi', page: 'Data Sertifikasi'},
    { title: 'Ijazah', icon: faCertificate, url: '/data/ijazah', page: 'Data Ijazah'},
    { title: 'Kelas', icon: faUsersRectangle, url: '/data/kelas', page: 'Data Kelas'},
    { title: 'Jurusan', icon: faUsersRectangle, url: '/data/jurusan', page: 'Data Kelas'},
    { title: 'Akun', icon: faUserShield, url: '/data/akun', page: 'Data Akun'}
]

const navLinkKonfigurasi = [
    { title: 'Role Akun', icon: faCog, url: '/konfigurasi/role', page: 'Konfigurasi Role Akun'},
    { title: 'Jabatan Pegawai', icon: faCog, url: '/konfigurasi/jabatan', page: 'Konfigurasi Jabatan Pegawai'},
    { title: 'Pendidikan Terakhir Pegawai', icon: faCog, url: '/konfigurasi/jabatan', page: 'Konfigurasi Jabatan Pegawai'},
    { title: 'Status Kepegawaian Pegawai', icon: faCog, url: '/konfigurasi/kepegawaian', page: 'Konfigurasi Status Kepegawaian Pegawai'},
]

const navLink = [
    ...navLinkMasterData, ...navLinkKonfigurasi,
    { title: 'Dashboard', icon: faHouse, url: '/', page: 'Dashboard Page'},
    { title: 'Profil Sekolah', icon: faBook, url: '/profilsekolah', page: 'Profil Sekolah'},
]

export default function MainLayoutPage({children}) {
    const router = useRouter()
    const path = usePathname();
    const [filteredPath, setFilteredPath] = useState(null)
    const [loggedAkun, setLoggedAkun] = useState(null)

    const getLoggedAkun = async () => {
        const userdata = await getLoggedUserdata()
        setLoggedAkun(userdata)
    }

    const getFilteredPath = () => {
        const updatedPath = navLink.find(item => path === item.url || (path.startsWith(item.url) && item.url !== '/'))
        setFilteredPath(updatedPath)
    }

    useEffect(() => {
        getLoggedAkun()
        getFilteredPath()
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
                            <FontAwesomeIcon icon={filteredPath ? filteredPath.icon : faSpinner} className="w-4 h-4 text-inherit" />
                            {filteredPath ? filteredPath.page : ''}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <article className="text-end">
                            <h1 className={`${rale.className} text-zinc-700 text-xs font-medium md:text-sm`}>
                                {loggedAkun !== null ? loggedAkun.email_akun : <div className="w-16 h-4 bg-zinc-300 animate-pulse rounded"></div>}
                            </h1>
                            <p className={`${rale.className} text-zinc-700 text-xs`}>
                                {loggedAkun !== null ? loggedAkun.role_akun : <span className="w-16 h-4 bg-zinc-300 animate-pulse rounded"></span>}
                            </p>
                        </article>
                        <button type="button" onClick={() => submitLogout()} className={`${rale.className} btn btn-error btn-sm flex items-center justify-center gap-3`}>
                            <FontAwesomeIcon icon={faSignOut} className="w-3 h-3 text-inherit" />
                            <span className="hidden md:block">Keluar</span>
                        </button>
                    </div>
                </div>
            </nav>
            <div className={`flex h-full ${mont.className}`}>
                <div className="hidden md:block relative overflow-auto w-2/12 border-r border-zinc-300 h-full text-zinc-800 pt-16">
                    <hr className="my-1 opacity-0" />
                    <a href="/" className="flex items-center gap-3 py-3 px-4 hover:bg-zinc-300 text-zinc-600 rounded-xl text-xs">
                        <FontAwesomeIcon icon={faHouse} className="w-3 h-3 text-zinc-500" />
                        Dashboard
                    </a>
                    <a href="/profilsekolah" className="flex items-center gap-3 py-3 px-4 hover:bg-zinc-200 text-zinc-600 rounded-xl text-xs">
                        <FontAwesomeIcon icon={faBook} className="w-3 h-3 text-zinc-500" />
                        Profil Sekolah
                    </a>
                    <div className="collapse collapse-arrow bg-white hover:bg-zinc-50">
                        <input type="checkbox" /> 
                        <div className="collapse-title text-sm">
                            <div className="flex items-center gap-3 text-zinc-500">
                                <FontAwesomeIcon icon={faFolderTree} className="w-3 h-3 text-inherit" />
                                <p>Master Data</p>
                            </div>
                        </div>
                        <div className={"collapse-content -translate-y-2 " + mont.className}>
                            {navLinkMasterData.map((link, index) => (
                                <a key={`${link.title} - ${index}`} href={`${link.url}`} className="flex items-center gap-3 text-xs font-medium hover:bg-zinc-200 rounded-xl py-1.5 px-3">
                                    <FontAwesomeIcon icon={link.icon} className="w-3 h-3 text-zinc-500" />
                                    {link.title}
                                </a>
                            ))}
                            
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-white hover:bg-zinc-50">
                        <input type="checkbox" /> 
                        <div className="collapse-title text-sm">
                            <div className="flex items-center gap-3 text-zinc-500">
                                <FontAwesomeIcon icon={faCogs} className="w-3 h-3 text-inherit" />
                                <p>Konfigurasi</p>
                            </div>
                        </div>
                        <div className={"collapse-content -translate-y-2 " + mont.className}>
                            {navLinkKonfigurasi.map((link, index) => (
                                <a key={`${link.title} - ${index}`} href={`${link.url}`} className="flex items-center gap-3 text-xs font-medium hover:bg-zinc-200 rounded-xl py-1.5 px-3">
                                    <FontAwesomeIcon icon={link.icon} className="w-3 h-3 text-zinc-500" />
                                    {link.title}
                                </a>
                            ))}
                            
                        </div>
                    </div>
                </div>
                <div className={`${rale.className} w-full md:w-10/12 px-5 pt-16 h-full text-zinc-800 relative overflow-auto`}>
                    <hr className="block md:hidden my-1 opacity-0" />
                    <h1 className={`${rale.className} text-zinc-800 md:hidden flex font-medium text-xl tracking-wide w-fit  items-center gap-3`}>
                        <FontAwesomeIcon icon={ filteredPath ? filteredPath.icon : faSpinner} className="w-4 h-4 text-inherit" />
                        { filteredPath ? filteredPath.page : '' }
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
            <hr className="my-1 opacity-0" />
            <a href="/" className="flex items-center gap-3 py-3 px-4 hover:bg-zinc-300 text-zinc-600 rounded-xl text-xs">
                <FontAwesomeIcon icon={faHouse} className="w-3 h-3 text-zinc-500" />
                Dashboard
            </a>
            <a href="/profilsekolah" className="flex items-center gap-3 py-3 px-4 hover:bg-zinc-200 text-zinc-600 rounded-xl text-xs">
                <FontAwesomeIcon icon={faBook} className="w-3 h-3 text-zinc-500" />
                Profil Sekolah
            </a>
            <div className="collapse collapse-arrow bg-white hover:bg-zinc-50">
                <input type="checkbox" /> 
                <div className="collapse-title text-sm">
                    <div className="flex items-center gap-3 text-zinc-500">
                        <FontAwesomeIcon icon={faFolderTree} className="w-3 h-3 text-inherit" />
                        <p>Master Data</p>
                    </div>
                </div>
                <div className={"collapse-content -translate-y-2 " + mont.className}>
                    {navLinkMasterData.map((link, index) => (
                        <a key={`${link.title} - ${index}`} href={`${link.url}`} className="flex items-center gap-3 text-xs font-medium hover:bg-zinc-200 rounded-xl py-1.5 px-3">
                            <FontAwesomeIcon icon={link.icon} className="w-3 h-3 text-zinc-500" />
                            {link.title}
                        </a>
                    ))}
                    
                </div>
            </div>
            <div className="collapse collapse-arrow bg-white hover:bg-zinc-50">
                <input type="checkbox" /> 
                <div className="collapse-title text-sm">
                    <div className="flex items-center gap-3 text-zinc-500">
                        <FontAwesomeIcon icon={faCogs} className="w-3 h-3 text-inherit" />
                        <p>Konfigurasi</p>
                    </div>
                </div>
                <div className={"collapse-content -translate-y-2 " + mont.className}>
                    {navLinkKonfigurasi.map((link, index) => (
                        <a key={`${link.title} - ${index}`} href={`${link.url}`} className="flex items-center gap-3 text-xs font-medium hover:bg-zinc-200 rounded-xl py-1.5 px-3">
                            <FontAwesomeIcon icon={link.icon} className="w-3 h-3 text-zinc-500" />
                            {link.title}
                        </a>
                    ))}
                    
                </div>
            </div>
            
        </div>
    )
}