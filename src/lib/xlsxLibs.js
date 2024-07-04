

import * as XLSX from 'xlsx'

export const exportToXLSX = async (dataArr, fileName = 'Data', {header, sheetName = 'Data'}) => {
    const worksheet = XLSX.utils.json_to_sheet(dataArr)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    XLSX.utils.sheet_add_aoa(worksheet, [header], {origin: 'A1'})

    XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true })
}

export const xlsx_getData = async (file, namaSheet) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
            const datas = new Uint8Array(e.target.result)
            const workbook = XLSX.read(datas, { type: 'array' })
            const worksheet = workbook.Sheets[namaSheet]
            const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            if(typeof(worksheet) === 'undefined') {
                reject({
                    success: false,
                    message: 'Sheet tidak ada!'
                })
            }

            if(records.length > 1) {
                const columns = records[0]
                const dataObjects = records.slice(1).map((row, index) => {
                    if(row.length > 0) {
                        let obj = {}
                        columns.forEach((column, index) => {
                            obj[column] = typeof(row[index]) !== 'undefined' ? row[index] : ''
                        })
                        return obj
                    }else{
                        return null
                    }
                }).filter(obj => obj !== null)
                resolve({
                    success: true,
                    message: 'Sheet ditemukan',
                    data: dataObjects
                })
            }else{
                resolve({
                    success: true,
                    message: 'Sheet ditemukan',
                    data: []
                })
            }
        }

        reader.onerror = reject

        reader.readAsArrayBuffer(file)
    })
}

export const xlsx_getSheets = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, {type: 'array'})
            resolve(workbook.Sheets)
        }

        reader.onerror = reject;

        reader.readAsArrayBuffer(file)
    })
}

export const xlsx_export = async (type, dataArrs, fileName = 'Data', headers, sheetNames) => {
    if (type === 'xlsx') {
        const workbook = XLSX.utils.book_new();
        
        dataArrs.forEach((dataArr, index) => {
            const worksheet = XLSX.utils.json_to_sheet(dataArr);
            XLSX.utils.sheet_add_aoa(worksheet, [headers[index]], { origin: 'A1' });
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[index]);
        });

        return XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
    }

    if (type === 'csv') {
        // CSV export does not support multiple sheets, so handle it as per the original requirement
        let csvString = Papa.unparse({
            fields: headers[0], // Assume the first header set is used for CSV
            data: dataArrs[0].map(obj => Object.values(obj)) // Export only the first data array
        }, {
            quotes: true,
            delimiter: ",",
            header: true,
            quoteChar: `'`,
        });

        // Create a Blob from the CSV string
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};