'use client'

import MainLayoutPage from "@/components/mainLayout"
import { jakarta } from "@/config/fonts";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import { Toaster } from "react-hot-toast"

const mmToPx = mm => mm * 3.7795;
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


export default function PrintDataSiswaSingleNisPage({params: {nis}}) {

    const [pageSettings, setPageSettings] = useState({
        kertas: 'a4', panjang: 0, lebar: 0, marginKiri: 0, marginKanan: 0, marginAtas: 0, marginBawah: 0, portrait: ''
    })

    const componentPDF = useRef(null)

    const handleExportPdf = () => {
        const content = componentPDF.current
        html2canvas(content).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            let pdf;

            if(pageSettings === 'custom') {
                pdf = new jsPDF({
                    orientation: pageSettings.kertas,
                    unit: 'px',
                    format: [formatUkuranKertasCM(pageSettings.panjang), formatUkuranKertasCM(pageSettings.panjang)]
                });
            }else{
                pdf = new jsPDF(pageSettings.portrait, 'px', pageSettings.kertas, true)
            }

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
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);
            pdf.save('test.pdf');
        })
    }

    return (
        <MainLayoutPage>
            <Toaster />
            <div className={`mt-5 ${jakarta.className}`}>
                <div className="w-full md:w-1/2 space-y-2">
                    <div className="flex flex-col md:items-center md:flex-row gap-1">
                        <div className="w-full md:w-2/5">
                            <p className="dark:text-zinc-500 text-zinc-700">
                                Kertas
                            </p>
                        </div>
                        <select value={pageSettings['kertas']} onChange={e => setPageSettings(state => ({...state, 'kertas': e.target.value}))} className="w-full md:w-3/5 border px-3 py-2 rounded dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                            <option value="a3">A3 ({documentSizes.a3.width / 10} cm x {documentSizes.a3.height / 10}cm)</option>
                            <option value="a4">A4 ({documentSizes.a4.width / 10} cm x {documentSizes.a4.height / 10}cm)</option>
                            <option value="a5">A5 ({documentSizes.a5.width / 10} cm x {documentSizes.a5.height / 10}cm)</option>
                            <option value="a6">A6 ({documentSizes.a6.width / 10} cm x {documentSizes.a6.height / 10}cm)</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    {pageSettings.kertas == 'custom' && (
                        <div className="space-y-2">
                            <div className="flex flex-col md:items-center md:flex-row gap-1">
                                <div className="w-full md:w-2/5">
                                    <p className="dark:text-zinc-500 text-zinc-700">
                                        Panjang (cm)
                                    </p>
                                </div>
                                <input type="number" value={pageSettings['panjang']} onChange={e => setPageSettings(state => ({...state, panjang: Number(e.target.value)}))} className="w-full md:w-3/5 border px-3 py-2 rounded dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" placeholder="Satuan cm" />
                            </div>
                            <div className="flex flex-col md:items-center md:flex-row gap-1">
                                <div className="w-full md:w-2/5">
                                    <p className="dark:text-zinc-500 text-zinc-700">
                                        Lebar (cm)
                                    </p>
                                </div>
                                <input type="number" value={pageSettings['lebar']} onChange={e => setPageSettings(state => ({...state, lebar: Number(e.target.value)}))} className="w-full md:w-3/5 border px-3 py-2 rounded dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" placeholder="Satuan cm" />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col md:items-center md:flex-row gap-1">
                        <div className="w-full md:w-2/5">
                            <p className="dark:text-zinc-500 text-zinc-700">
                                Margin (cm)
                            </p>
                        </div>
                        <div className="flex w-full md:w-3/5 gap-2">
                            <div className="w-1/4">
                                <input type="number" value={pageSettings.marginKiri} onChange={e => setPageSettings(state => ({...state, marginKiri: Number(e.target.value)}))} className="w-full border px-3 py-2 rounded dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" placeholder="Kiri" />
                                <p className="text-sm text-zinc-700 dark:text-zinc-500">Kiri</p>
                            </div>
                            <div className="w-1/4">
                                <input type="number" value={pageSettings.marginKanan} onChange={e => setPageSettings(state => ({...state, marginKanan: Number(e.target.value)}))} className="w-full border px-3 py-2 rounded dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" placeholder="Kanan" />
                                <p className="text-sm text-zinc-700 dark:text-zinc-500">Kanan</p>
                            </div>
                            <div className="w-1/4">
                                <input type="number" value={pageSettings.marginAtas} onChange={e => setPageSettings(state => ({...state, marginAtas: Number(e.target.value)}))} className="w-full border px-3 py-2 rounded dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" placeholder="Atas" />
                                <p className="text-sm text-zinc-700 dark:text-zinc-500">Atas</p>
                            </div>
                            <div className="w-1/4">
                                <input type="number" value={pageSettings.marginBawah} onChange={e => setPageSettings(state => ({...state, marginBawah: Number(e.target.value)}))} className="w-full border px-3 py-2 rounded dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" placeholder="Bawah" />
                                <p className="text-sm text-zinc-700 dark:text-zinc-500">Bawah</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-center md:flex-row gap-1">
                        <div className="w-full md:w-2/5">
                            <p className="dark:text-zinc-500 text-zinc-700">
                                Portrait
                            </p>
                        </div>
                        <select value={pageSettings['portrait']} onChange={e => setPageSettings(state => ({...state, portrait: e.target.value}))} className="w-full md:w-3/5 border px-3 py-2 rounded dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                            <option value="p">Portrait</option>
                            <option value="l">Landscape</option>
                        </select>
                    </div>
                    <div className="flex flex-col md:items-center md:flex-row gap-1">
                        <div className="w-full md:w-2/5 hidden md:block"></div>
                        <div className="w-full md:w-3/5">
                            <button type="button" onClick={() => handleExportPdf()} className="px-3 py-2 rounded border border-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 flex justify-center items-center gap-2 w-fit">
                                <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="my-5 dark:opacity-20" />
            <div className="relative overflow-auto w-full border p-5 dark:border-zinc-500 flex justify-center">
                <div ref={componentPDF} style={{ 
                    width: pageSettings.kertas !== 'custom' ? `${mmToPx(documentSizes[pageSettings.kertas].width)}px` : `${cmToPx(pageSettings.panjang)}px`, 
                    height: pageSettings.kertas !== 'custom' ? `${mmToPx(documentSizes[pageSettings.kertas].height)}px` : `${cmToPx(pageSettings.lebar)}px`,
                    paddingRight: `${cmToPx(pageSettings.marginKanan)}px`,
                    paddingLeft: `${cmToPx(pageSettings.marginKiri)}px`,
                    paddingTop: `${cmToPx(pageSettings.marginAtas)}px`,
                    paddingBottom: `${cmToPx(pageSettings.marginBawah)}px`
                }} className={`bg-white flex-shrink-0 object-contain`}
                >
                    {nis}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quis ratione quia, animi perspiciatis sunt aut saepe illo autem tempore ea. Fuga, nulla. Veniam culpa error unde fuga ea numquam!
                </div>
            </div>
        </MainLayoutPage>
    )
}