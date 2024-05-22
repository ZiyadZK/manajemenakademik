'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta, playfair, radio } from "@/config/fonts";
import { getAllSiswa } from "@/lib/model/siswaModel";
import { faArrowLeft, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast"

const mmToPx = mm => mm * (96 / 25.4);
const inchToPx = inch => inch * 96;
const cmToPx = cm => cm * 37.795

const formatUkuranKertasCM = cm => cm * 28.3464567


const documentSizes = {
    'a0': { width: 841, height: 1189 },
    'a1': { width: 594, height: 841 },
    'a2': { width: 420, height: 594 },
    'a3': { width: 297, height: 420 },
    'a4': { width: 210, height: 297 },
    'a5': { width: 148, height: 210 },
    'a6': { width: 105, height: 148 },
    'a7': { width: 74, height: 105 },
    'a8': { width: 52, height: 74 },
    'a9': { width: 37, height: 52 },
    'a10': { width: 26, height: 37 },
    'b0': { width: 1000, height: 1414 },
    'b1': { width: 707, height: 1000 },
    'b2': { width: 500, height: 707 },
    'b3': { width: 353, height: 500 },
    'b4': { width: 250, height: 353 },
    'b5': { width: 176, height: 250 },
    'b6': { width: 125, height: 176 },
    'b7': { width: 88, height: 125 },
    'b8': { width: 62, height: 88 },
    'b9': { width: 44, height: 62 },
    'b10': { width: 31, height: 44 },
    'f4': { width: 210, height: 330 },
    'letter': { width: 8.5, height: 11 },
    'legal': { width: 8.5, height: 14 },
    'tabloid': { width: 11, height: 17 },
    'ledger': { width: 17, height: 11 },
    'letter': { width: '8.5in', height: '11in' },
    'legal': { width: '8.5in', height: '14in' },
    'tabloid': { width: '11in', height: '17in' },
    'ledger': { width: '17in', height: '11in' }, // Same dimensions as tabloid but different orientation
    'executive': { width: '7.25in', height: '10.5in' },
    'half_letter': { width: '5.5in', height: '8.5in' },
    'postcard': { width: '100', height: '148' },
    'business_card': { width: '90', height: '55' },
}


export default function PrintDataSiswaPage() {

    const router = useRouter()

    const [dataSiswa, setDataSiswa] = useState([])
    const [filteredDataSiswa, setFilteredDataSiswa] = useState([])
    const [selectedSiswa, setSelectedSiswa] = useState([])
    const [printedData, setPrintedData] = useState(null)
    const [loadingFetch, setLoadingFetch] = useState('')

    const [pageSettings, setPageSettings] = useState({
        kertas: 'a4', panjang: 0, lebar: 0, marginKiri: 0, marginKanan: 0, marginAtas: 0, marginBawah: 0, portrait: ''
    })

    const getDataSiswa = async () => {
        const responseData = await getAllSiswa()
        setDataSiswa(responseData)
        setFilteredDataSiswa(responseData)
        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getDataSiswa()
    }, [])

    const componentPDF = useRef(null)

    const handleExportPdf = () => {
        const content = componentPDF.current
        html2canvas(content, {scale: 3}).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 0.1);

            let pdf
            pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: [330, 210],
                compress: true,
                precision: 2
                
            });

            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = pdf.internal.pageSize.getHeight();
            const imgW = canvas.width;
            const imgH = canvas.height;

            
            // Calculate scaling factor to fit the image into the PDF page
            const ratio = Math.min(pdfW / imgW, pdfH / imgH);
            
            // Calculate the dimensions and position of the image to be centered on the PDF page
            const imgWidth = imgW * ratio;
            const imgHeight = imgH * ratio;
            const imgX = (pdfW - imgWidth) / 2;
            const imgY = (pdfH - imgHeight) / 2;
            // Add the image to the PDF without any additional padding
            pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            pdf.save(`DATA SISWA - ${printedData.nama_siswa} - ${printedData.kelas} ${printedData.rombel} ${printedData.no_rombel}`);
        })
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className={`mt-5 ${jakarta.className}`}>
                <div className={`flex md:items-center md:justify-between w-full md:flex-row flex-col gap-3`}>
                    <div className="flex items-center gap-2 md:gap-5">
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700/30 text-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-700/50 hover:bg-zinc-200">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                        </button>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faPrint} className="w-4 h-4 text-blue-600" />
                            <h1 className="md:text-xl text-transparent bg-gradient-to-r from-blue-600 to-zinc-800 bg-clip-text dark:to-white">
                                Export Data Siswa
                            </h1>
                        </div>
                    </div>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="flex md:flex-row flex-col gap-2">
                    {loadingFetch !== 'fetched' && (
                        <div className="w-full md:w-1/2 flex justify-center items-center gap-3">
                            <div className="loading loading-spinner loading-lg text-blue-500 dark:text-zinc-400"></div>
                        </div>
                    )}
                    {loadingFetch === 'fetched' && (
                        <div className="w-full md:w-1/2">
                            <input type="text" className="border px-3 py-2 rounded md:w-1/2 w-full dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="Cari data siswa di sini" />
                            <hr className="my-1 opacity-0" />
                            <div className="relative w-full overflow-auto max-h-[300px] space-y-1">
                                {filteredDataSiswa.slice(0, 40).map((siswa, index) => (
                                    <button key={index} onClick={() => setPrintedData(siswa)} type="button" className="w-full  rounded border p-3 flex items-center justify-between text-start hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800">
                                        <div className="space-y-1">
                                            <p>{siswa.nama_siswa}</p>
                                            <div className="flex items-center gap-2 text-xs">
                                                <p className="opacity-50">{siswa.nis}</p>
                                                -
                                                <p className="opacity-50">{siswa.nisn}</p>
                                            </div>
                                        </div>
                                        <p className="opacity-50">{siswa.kelas} {siswa.rombel} {siswa.no_rombel}</p>
                                    </button>
                                ))}
                            </div>
                            <hr className="my-1 opacity-0" />
                            {printedData !== null && (
                                <button type="button" onClick={() => handleExportPdf()} className="w-full md:w-fit px-3 py-2 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center gap-2">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                    Export menjadi PDF
                                </button>
                            )}
                        </div>
                    )}
                    <div className="w-full md:w-1/2">
                        a
                    </div>
                </div>
            </div>
            <hr className="my-5 dark:opacity-20" />
            {printedData !== null && (
                <div className="relative overflow-auto w-full border p-5 dark:border-zinc-500 flex justify-center">
                    <div ref={componentPDF} style={{ 
                        width: `${mmToPx(documentSizes['f4'].width * 1.5)}px`, 
                        height: `${mmToPx(documentSizes['f4'].height * 1.5)}px`,
                    }} className={`bg-white flex-shrink-0 ${jakarta.className} text-2xl`}
                    >
                        <div className="flex items-center w-full px-20 pt-10">
                            <div className="w-fit flex items-center justify-start">
                                <Image src={'/jabar.gif'} width={200} height={200} />
                            </div>
                            <div className={`w-full font-bold tracking-tighter text-center`}>
                                <h1 className="font-bold tracking-tighter text-center">
                                    PEMERINTAH DAERAH PROVINSI JAWA BARAT
                                </h1>
                                <h2 className="font-bold tracking-tighter text-center">
                                    DINAS PENDIDIKAN
                                </h2>
                                <h3 className="font-bold tracking-tighter text-center">
                                    CABANG DINAS PENDIDIKAN WILAYAH VII
                                </h3>
                                <p className="font-bold tracking-tighter text-center text-3xl">
                                    SMK PEKERJAAN UMUM NEGERI BANDUNG
                                </p>
                                <p className="text-lg tracking-tight">
                                    Jl. Garut No. 10 Telp./Fax (022) 7208317 BANDUNG 40271
                                </p>
                                <p className="text-lg tracking-tight">
                                    Website : <span className="italic text-blue-600 underline decoration-blue-600">http://www.smkpunegerijabar.sch.id</span>
                                </p>
                                <p className="text-lg tracking-tight">
                                    Email : <span className="italic text-blue-600 underline decoration-blue-600">info@smkpunegerijabar.sch.id</span>
                                </p>
                            </div>
                            <div className="w-fit flex items-center justify-end">
                                <Image src={'/logo-sekolah-2.png'} width={160} height={160} />
                            </div>
                        </div>
                        <div className="px-5 pt-5 mb-8">
                            <div className="w-full border-4 border-zinc-700"></div>
                        </div>
                        <h1 className="text-center font-extrabold">LEMBAR BUKU INDUK SMK</h1>
                        <h2 className="text-center font-extrabold">TAHUN PELAJARAN 2021/2022</h2>
                        <hr className="my-3 opacity-0" />
                        <div className="px-20">
                            <div className="flex w-1/2 items-center gap-2 text-lg">
                                <p className="w-2/3">Kelas</p>
                                <p className="w-1/3 font-medium">: {printedData.kelas} {printedData.rombel} {printedData.no_rombel}</p>
                            </div>
                            <div className="flex w-1/2 items-center gap-2 text-lg">
                                <p className="w-2/3">No Induk Sekolah</p>
                                <p className="w-1/3 font-medium">: {printedData.nis}</p>
                            </div>
                            <div className="flex w-1/2 items-center gap-2 text-lg">
                                <p className="w-2/3">No Induk Siswa Nasional</p>
                                <p className="w-1/3 font-medium">: {printedData.nisn}</p>
                            </div>
                            <hr className="my-3 opacity-0" />
                            <div className="px-10 text-lg">
                                <div className="font-bold flex items-center gap-5">
                                    <p>A.</p>
                                    <p>KETERANGAN PRIBADI SISWA</p>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>1.</p>
                                            <p>Nama</p>
                                        </div>
                                        <p className="font-medium w-2/3">: {printedData.nama_siswa}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>2.</p>
                                            <p>NIK</p>
                                        </div>
                                        <p className="font-medium w-2/3">: {printedData.nik}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>3.</p>
                                            <p>Jenis Kelamin</p>
                                        </div>
                                        <p className="font-medium w-2/3">: {printedData.jenis_kelamin}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>4.</p>
                                            <p>Tempat dan Tanggal Lahir</p>
                                        </div>
                                        <p className="font-medium w-2/3">: {printedData.tempat_lahir}, {printedData.tanggal_lahir}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>5.</p>
                                            <p>Agama</p>
                                        </div>
                                        <p className="font-medium w-2/3">: {printedData.agama}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>6.</p>
                                            <p>Anak ke</p>
                                        </div>
                                        <p className="font-medium w-2/3">: {printedData.anak_ke}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>7.</p>
                                            <p>Status dalam Keluarga</p>
                                        </div>
                                        <p className="font-medium w-2/3">: {printedData.status_dalam_keluarga}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>8.</p>
                                            <p className="">No Telp</p>
                                        </div>
                                        <p className="font-medium w-2/3">: {printedData.no_hp_siswa}</p>
                                    </div>
                                </div>
                                <hr className="my-3 opacity-0" />
                                <div className="font-bold flex items-center gap-5">
                                    <p>B.</p>
                                    <p>KETERANGAN TEMPAT TINGGAL</p>
                                </div>
                                <div className="flex  gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex  gap-5 w-full">
                                        <div className="flex gap-5 w-1/3">
                                            <p>9.</p>
                                            <p>Alamat</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.alamat}</p>
                                    </div>
                                </div>
                                <hr className="my-3 opacity-0" />
                                <div className="font-bold flex items-center gap-5">
                                    <p>C.</p>
                                    <p>KETERANGAN SEKOLAH SEBELUMNYA</p>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>10.</p>
                                            <p>Asal Sekolah</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.asal_sekolah}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>11.</p>
                                            <p>Tahun Masuk</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.tahun_masuk}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>12.</p>
                                            <p>Jalur Masuk</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.kategori}</p>
                                    </div>
                                </div>
                                <hr className="my-3 opacity-0" />
                                <div className="font-bold flex items-center gap-5">
                                    <p>D.</p>
                                    <p>KETERANGAN ORANG TUA KANDUNG</p>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>13.</p>
                                            <p>Nama Ayah</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.nama_ayah}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>14.</p>
                                            <p>Pekerjaan Ayah</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.pekerjaan_ayah}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>15.</p>
                                            <p>No Telp Ayah</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.telp_ortu}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>16.</p>
                                            <p>Nama Ibu</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.nama_ibu}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>17.</p>
                                            <p>Pekerjaan Ibu</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.pekerjaan_ibu}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>18.</p>
                                            <p>No Telp Ibu</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.telp_ortu}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 w-full">
                                    <p className="opacity-0">A.</p>
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="flex items-center gap-5 w-1/3">
                                            <p>19.</p>
                                            <p>No Kartu Keluarga</p>
                                        </div>
                                        <p className="font-medium w-2/3 text-wrap">: {printedData.no_kk}</p>
                                    </div>
                                </div>
                                <hr className="my-5 opacity-0" />
                                <div className="flex items-center w-full gap-5">
                                    <div className="w-1/2"></div>
                                    <div className="w-1/2 flex flex-col items-center">
                                        <div className="w-[226.7716px] h-[302.3622px] border-2 flex items-center justify-center bg-green-500/10 font-bold">
                                            <p className="text-zinc-500 text-3xl">3x4</p>
                                        </div>
                                        <p className="text-sm">tanda tangan siswa dan cap tiga jari</p>
                                        <hr className="my-12 opacity-0" />
                                        <p className="font-bold">{printedData.nama_siswa}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayoutPage>
    )
}