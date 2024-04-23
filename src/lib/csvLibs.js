import * as XLSX from 'xlsx'

export const exportToCSV = async (dataArr, fileName = 'Data', {header, sheetName = 'Data'}) => {
    const worksheet = XLSX.utils.json_to_sheet(dataArr)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.sheet_to_csv(worksheet)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    XLSX.utils.sheet_add_aoa(worksheet, [header], {origin: 'A1'})

    XLSX.writeFile(workbook, `${fileName}.csv`, { compression: true })
}