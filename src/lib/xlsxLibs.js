

import * as XLSX from 'xlsx'

export const exportToXLSX = async (dataArr, fileName = 'Data', {header, sheetName = 'Data'}) => {
    const worksheet = XLSX.utils.json_to_sheet(dataArr)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    XLSX.utils.sheet_add_aoa(worksheet, [header], {origin: 'A1'})

    XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true })
}