

export const date_getDay = (date) => {
    let delimiter = null;
    let day;

    if (date) {
        if (date.includes('-')) {
            delimiter = '-';
        } else if (date.includes('/')) {
            delimiter = '/';
        }

        if (delimiter) {
            // Regex to match yyyy-mm-dd or yyyy/mm/dd
            const datePattern = new RegExp(`^(\\d{4})${delimiter}(\\d{2})${delimiter}(\\d{2})$`);
            const match = date.match(datePattern);

            if (match) {
                day = match[3];
            } else {
                return 'Invalid date format';
            }
        } else {
            return 'Invalid date format';
        }
    } else {
        const currentDate = new Date();
        day = String(currentDate.getDate()).padStart(2, '0');
    }

    return day;
}

export const date_getMonth = (format = 'number', date) => {
    let delimiter = null;
    let month;

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    if (date) {
        if (date.includes('-')) {
            delimiter = '-';
        } else if (date.includes('/')) {
            delimiter = '/';
        }

        if (delimiter) {
            // Regex to match yyyy-mm-dd or yyyy/mm/dd
            const datePattern = new RegExp(`^(\\d{4})${delimiter}(\\d{2})${delimiter}(\\d{2})$`);
            const match = date.match(datePattern);

            if (match) {
                month = parseInt(match[2]);
            } else {
                return 'Invalid date format';
            }
        } else {
            return 'Invalid date format';
        }
    } else {
        const currentDate = new Date();
        month = currentDate.getMonth() + 1; // Months are zero-indexed in JS
    }

    if (format === 'string') {
        return monthNames[month - 1];
    } else {
        return String(month).padStart(2, '0'); // Return month as a zero-padded number
    }
}

export const date_getYear = (date) => {
    let delimiter = null;
    let year;

    if (date) {
        if (date.includes('-')) {
            delimiter = '-';
        } else if (date.includes('/')) {
            delimiter = '/';
        }

        if (delimiter) {
            // Regex to match yyyy-mm-dd or yyyy/mm/dd
            const datePattern = new RegExp(`^(\\d{4})${delimiter}(\\d{2})${delimiter}(\\d{2})$`);
            const match = date.match(datePattern);

            if (match) {
                year = match[1];
            } else {
                return 'Invalid date format';
            }
        } else {
            return 'Invalid date format';
        }
    } else {
        const currentDate = new Date();
        year = String(currentDate.getFullYear());
    }

    return year;
}


export const date_getTime = (type) => {
    const currentDate = new Date();
    const options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(currentDate);

    let time;
    if (type === 'hour') {
        time = parts.find(part => part.type === 'hour').value;
    } else if (type === 'minutes') {
        time = parts.find(part => part.type === 'minute').value;
    } else {
        const hour = parts.find(part => part.type === 'hour').value;
        const minute = parts.find(part => part.type === 'minute').value;
        time = `${hour}:${minute}`;
    }

    return time;
}

export const date_toFormat = (date) => {
    const [year, day, month] = date.split('-')

    return `${day}/${month}/${year}`
}

export const date_toInputHtml = (date) => {
    const [day, month, year] = date.split('/')

    return `${year}-${day}-${month}`
}