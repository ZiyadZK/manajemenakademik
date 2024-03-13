'use server'

import csvParser from 'csv-parser';
import fs from 'fs';

export const importCsv = async filePath => {
    return new Promise((resolve, reject) => {
        const results = []
        fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', row => {
            results.push(row);
        })
        .on('end', () => {
            resolve(results)
        })
        .on('error', error => {
            reject(error);
        })
    })
}