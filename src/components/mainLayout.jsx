'use client'

import { mont, rale, open, quicksand, jakarta } from "@/config/fonts";
// import { nunito, quicksand } from "@/config/fonts";
import { getLoggedUserdata, logoutAkun } from "@/lib/model/akunModel";
import { faBars, faBook, faCertificate, faClipboard, faCog, faCogs, faDatabase, faFolderTree, faHouse, faLayerGroup, faMoon, faPrint, faQuidditchBroomBall, faSignOut, faSpinner, faSun, faTimeline, faUserGraduate, faUserLock, faUserShield, faUserTie, faUserXmark, faUsersBetweenLines, faUsersRectangle, faUsersViewfinder, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal)

const navLinkMasterData = [
    { title: 'Siswa', icon: faUsersViewfinder, url: '/data/siswa', page: 'Data Siswa', role: ['Operator', 'Admin']},
    { title: 'Mutasi Siswa', icon: faUserXmark, url: '/data/mutasisiswa', page: 'Data Mutasi Siswa', role: ['Operator', 'Admin']},
    { title: 'Alumni', icon: faUserGraduate, url: '/data/alumni', page: 'Data Alumni', role: ['Operator', 'Admin']},
    { title: 'Pegawai', icon: faUserTie, url: '/data/pegawai', page: 'Data Pegawai', role: ['Operator', 'Admin']},
    { title: 'Sertifikasi', icon: faCertificate, url: '/data/sertifikasi', page: 'Data Sertifikasi', role: ['Operator', 'Admin']},
    { title: 'Ijazah', icon: faCertificate, url: '/data/ijazah', page: 'Data Ijazah', role: ['Operator', 'Admin']},
    { title: 'Kelas', icon: faUsersRectangle, url: '/data/kelas', page: 'Data Kelas', role: ['Operator', 'Admin']},
    { title: 'Akun', icon: faUserShield, url: '/data/akun', page: 'Data Akun', role: ['Admin']},
    { title: 'Riwayat', icon: faTimeline, url: '/data/riwayat', page: 'Data Riwayat Perubahan Data', role: ['Admin']}
]

const navLinkKonfigurasi = [
    { title: 'Role Akun', icon: faCog, url: '/konfigurasi/role', page: 'Konfigurasi Role Akun', role: ['Admin']},
    { title: 'Jabatan Pegawai', icon: faCog, url: '/konfigurasi/jabatan', page: 'Konfigurasi Jabatan Pegawai', role: ['Admin']},
    { title: 'Pendidikan Terakhir Pegawai', icon: faCog, url: '/konfigurasi/pendidikanterakhir', page: 'Konfigurasi Jabatan Pegawai', role: ['Admin']},
    { title: 'Status Kepegawaian Pegawai', icon: faCog, url: '/konfigurasi/kepegawaian', page: 'Konfigurasi Status Kepegawaian Pegawai', role: ['Admin']},
]

const navLink = [
    ...navLinkMasterData, ...navLinkKonfigurasi,
    { title: 'Dashboard', icon: faHouse, url: '/', page: 'Dashboard Page', role: ['Operator', 'Admin']},
    { title: 'Profil Sekolah', icon: faBook, url: '/profilsekolah', page: 'Profil Sekolah', role: ['Operator', 'Admin']},
    { title: 'Export Data Siswa', icon: faPrint, url: '/print/data/siswa', page: 'Export Data Siswa', role: ['Operator', 'Admin']}
]

export default function MainLayoutPage({children}) {
    const router = useRouter()
    const path = usePathname();
    const [filteredPath, setFilteredPath] = useState(null)
    const [loggedAkun, setLoggedAkun] = useState(null)
    const [theme, setTheme] = useState('')

    const getLoggedAkun = async () => {
        const userdata = await getLoggedUserdata()
        setLoggedAkun(userdata)
    }

    const getFilteredPath = () => {
        const updatedPath = navLink.find(item => path === item.url || (path.startsWith(item.url) && item.url !== '/'))
        setFilteredPath(updatedPath)
    }

    const getTheme = () => {
        const themeData = localStorage.getItem('theme') || 'light'
        if(themeData === 'dark') {
            document.body.classList.add('dark')
        }else{
            document.body.classList.remove('dark')
        }

        setTheme(themeData)
    }

    const toggleTheme = () => {
        if(theme === 'dark') {
            localStorage.setItem('theme', 'light')
            document.body.classList.remove('dark')
            setTheme('light')
        }else{
            localStorage.setItem('theme', 'dark')
            document.body.classList.add('dark')
            setTheme('dark')
        }
    }

    useEffect(() => {
        getLoggedAkun()
        getFilteredPath()
        getTheme()
    }, [])

    const [hoveredPath, setHoveredPath] = useState(path)

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
        <div className={`drawer ${jakarta.className} dark:text-zinc-100 text-zinc-700`}>
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content w-full bg-zinc-100 dark:bg-zinc-950">
                <div className="px-5 bg-white sticky top-0 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 pt-5 space-y-2 z-10">
                    <div className="flex justify-between w-full items-center">
                        <div className="flex items-center divide-x divide-zinc-300 dark:divide-zinc-800">
                            <Link href={'/'} className="flex items-center gap-3 pr-3 md:pr-5">
                                <Image src={'/logo-sekolah-2.png'} width={15} height={15} alt="Logo Sekolah" />
                                <h1 className="font-bold tracking-tighter hidden md:block">
                                    SIM<span className="text-orange-500">AK</span>
                                </h1>
                            </Link>
                            {!filteredPath ? (
                                <div className="loading loading-spinner loading-sm text-zinc-400 pl-3 md:pl-5 py-3"></div>
                            ):(
                                <div className="pl-3 md:pl-5 flex items-center gap-3">
                                    <FontAwesomeIcon icon={filteredPath.icon} className="w-3 h-3 text-inherit" />
                                    {filteredPath.title}
                                </div>
                            )}
                        </div>
                        {!loggedAkun ? (
                            <div className="loading loading-spinner loading-sm text-zinc-400 py-2"></div>
                        ):(
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex items-center gap-3 ">
                                    <p className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500">
                                        Admin
                                    </p>
                                    <article className="text-end">
                                        <p className="text-xs">
                                            kakangtea74@gmail.com
                                        </p>
                                        <p className="text-xs opacity-50">
                                            Ziyad
                                        </p>
                                    </article>
                                </div>
                                <button type="button" onClick={() => toggleTheme()} className="rounded-full border w-8 h-8 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 hidden md:flex items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">
                                    <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4 text-inherit group-hover:-rotate-45 transition-all duration-300" />
                                </button>
                                <label htmlFor="my-drawer" className="rounded-full border w-8 h-8 dark:border-zinc-800 hover:bg-zinc-50 transition-all duration-300 dark:hover:bg-zinc-800 flex md:hidden items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 drawer-button">
                                    <FontAwesomeIcon icon={faCog} className="w-4 h-4 text-inherit group-hover:-rotate-45 transition-all duration-300" />
                                </label>
                                <button type="button" onClick={() => submitLogout()} className="rounded-full border w-8 h-8 dark:border-zinc-800 hover:bg-zinc-50 transition-all duration-300 dark:hover:bg-zinc-800 hidden md:flex items-center justify-center group text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">
                                    <FontAwesomeIcon icon={faSignOut} className="w-4 h-4 text-inherit transition-all duration-300" />
                                </button>
                            </div>
                        )}
                    </div>
                    {!filteredPath ? (
                        <div className="loading loading-spinner loading-sm text-zinc-400 py-4"></div>
                    ):(
                        <div className="flex items-center gap-2 overflow-auto relative w-full pb-2">
                            <Link
                                href={'/profilsekolah'}
                                className={`px-4 py-2 rounded-md text-xs font-medium ${filteredPath && filteredPath.url.startsWith('/profilsekolah') ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400'} hover:text-zinc-700 dark:hover:text-zinc-200 relative no-underline duration-300 ease-in z-[100]`}
                                onMouseOver={() => setHoveredPath('/profilsekolah')}
                                onMouseLeave={() => setHoveredPath(path)}
                            >
                                <span>
                                    Profil Sekolah
                                </span>
                                {hoveredPath.startsWith('/profilsekolah') && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 h-full bg-zinc-100 dark:bg-zinc-800 rounded-md -z-10 text-zinc-700 dark:text-zinc-200"
                                        layoutId="navbar"
                                        aria-hidden="true"
                                        style={{
                                            width: "100%",
                                        }}
                                        transition={{
                                            type: 'spring',
                                            bounce: 0,
                                            stiffness: 200,
                                            damping: 30,
                                            duration: 0.01,
                                        }}
                                    />
                                )}
                                
                            </Link>
                            {loggedAkun && navLinkMasterData.map((nav, index) => nav['role'].includes(loggedAkun.role_akun) && (
                                <Link
                                    key={index} 
                                    href={nav.url}
                                    className={`px-4 py-2 rounded-md text-xs font-medium ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400'} hover:text-zinc-700 dark:hover:text-zinc-200 relative no-underline duration-300 ease-in z-[100]`}
                                    onMouseOver={() => setHoveredPath(nav.url)}
                                    onMouseLeave={() => setHoveredPath(path)}
                                >
                                    <span>
                                        {nav.title}
                                    </span>
                                    {hoveredPath.startsWith(nav.url) && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-full bg-zinc-100 dark:bg-zinc-800 rounded-md -z-10 text-zinc-700 dark:text-zinc-200"
                                            layoutId="navbar"
                                            aria-hidden="true"
                                            style={{
                                                width: "100%",
                                            }}
                                            transition={{
                                                type: 'spring',
                                                bounce: 0,
                                                stiffness: 200,
                                                damping: 30,
                                                duration: 0.01,
                                            }}
                                        />
                                    )}
                                    
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <div className="px-5 md:px-10 pt-5 pb-10 relative overflow-auto w-full h-screen">
                    <div className="p-5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl">
                        {children}
                    </div>
                </div>
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                {/* Sidebar content here */}
                <li><a>Sidebar Item 1</a></li>
                <li><a>Sidebar Item 2</a></li>
                
                </ul>
            </div>
        </div>
    )
}

function SidebarSection() {
    const router = useRouter()
    const path = usePathname();
    const [filteredPath, setFilteredPath] = useState(null)
    const [loggedAkun, setLoggedAkun] = useState(null)

    const [theme, setTheme] = useState('')

    const getLoggedAkun = async () => {
        const userdata = await getLoggedUserdata()
        setLoggedAkun(userdata)
    }

    const getFilteredPath = () => {
        const updatedPath = navLink.find(item => path === item.url || (path.startsWith(item.url) && item.url !== '/'))
        setFilteredPath(updatedPath)
    }

    const getTheme = () => {
        const themeData = localStorage.getItem('theme') || 'light'
        if(themeData === 'dark') {
            document.body.classList.add('dark')
        }else{
            document.body.classList.remove('dark')
        }

        setTheme(themeData)
    }

    const toggleTheme = () => {
        if(theme === 'dark') {
            localStorage.setItem('theme', 'light')
            document.body.classList.remove('dark')
            setTheme('light')
        }else{
            localStorage.setItem('theme', 'dark')
            document.body.classList.add('dark')
            setTheme('dark')
        }
    }

    useEffect(() => {
        getLoggedAkun()
        getFilteredPath()
        getTheme()
    }, [])
    return (
        <div className="fixed top-0 left-0 w-full h-screen overflow-auto bg-white dark:bg-zinc-900 z-50 md:hidden block">
            <hr className="mt-20 opacity-0" />
            <div className={`px-5 ${jakarta.className}`}>
                <a href="/" className={`flex items-center justify-between tracking-tighter text-sm ${filteredPath && filteredPath.url === '/' ? 'bg-white dark:bg-zinc-800/50 shadow-lg dark:shadow-black/50 text-zinc-800 dark:text-white' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-500 group'}  font-medium rounded-lg px-3 py-2`}>
                    <span className="flex items-center gap-5">
                        <FontAwesomeIcon icon={faHouse} className={`w-4 h-4  ${filteredPath && filteredPath.url === '/' ? 'text-rose-600' : 'text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400'} `} />
                        Dashboard
                    </span>
                    <span className={`w-2 h-2 rounded-full bg-blue-600/50 animate-ping ${filteredPath && filteredPath.url === '/' ? 'block' : 'hidden'} `}></span>
                </a>
                <a href="/profilsekolah" className={`flex items-center justify-between tracking-tighter text-sm ${filteredPath && filteredPath.url === '/profilsekolah' ? 'bg-white dark:bg-zinc-800/50 shadow-lg dark:shadow-black/50 text-zinc-800 dark:text-white' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-500 group'}  font-medium rounded-lg px-3 py-2`}>
                    <span className="flex items-center gap-5">
                        <FontAwesomeIcon icon={faBook} className={`w-4 h-4  ${filteredPath && filteredPath.url === '/profilsekolah' ? 'text-rose-600' : 'text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400'} `} />
                        Profil Sekolah
                    </span>
                    <span className={`w-2 h-2 rounded-full bg-blue-600/50 ${filteredPath && filteredPath.url === '/profilsekolah' ? 'block' : 'hidden'} `}></span>
                </a>
                <div className="flex items-center gap-3 my-5 text-xs font-medium">
                    <hr className="flex-grow dark:opacity-50" />
                    <div className="flex items-center gap-3 w-fit dark:text-white">
                        <FontAwesomeIcon icon={faLayerGroup} className="w-3 h-3 text-inherit dark:text-blue-600" />
                        Master Data
                    </div>
                    <hr className="flex-grow dark:opacity-50" />
                </div>
                <div className="space-y-2">
                    {loggedAkun && navLinkMasterData.map((nav, index) => nav['role'].includes(loggedAkun.role_akun) && (
                        <a key={index} href={nav.url} className={`flex items-center text-sm justify-between tracking-tighter ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'bg-white dark:bg-zinc-800/50 shadow-lg text-zinc-800 dark:text-zinc-400' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 group'}  font-medium rounded-lg px-3 py-2`}>
                            <span className="flex items-center gap-6">
                                <FontAwesomeIcon icon={nav.icon} className={`w-4 h-4  ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'text-blue-600' : 'text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400'} `} />
                                {nav.title}
                            </span>
                            <span className={`w-2 h-2 rounded-full bg-blue-600/50 ${filteredPath && filteredPath.url.startsWith(nav.url) ? 'block' : 'hidden'} animate-ping`}></span>
                        </a>
                    ))}
                </div>
                <hr className="my-5" />
                <div className="flex justify-between items-center">
                    <p className="text-sm opacity-60">
                        Ubah Tema
                    </p>
                    <button type="button" onClick={() => toggleTheme()} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200 focus:bg-zinc-300">
                        {theme === 'dark' ? 'Terang' : 'Gelap'}
                        <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="w-3 h-3 text-inherit" />
                    </button>
                </div>
            </div>
        </div>
    )
}