export const dateToIso = date => {
    let dateComponents = date.split('/')
    let dateObject = new Date(dateComponents[2], dateComponents[1] - 1, dateComponents[0])
    let formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`
    return formattedDate
}

export const isoToDate = date => {
    let dateObject = new Date(date)
    let day = dateObject.getDate()
    let month = dateObject.getMonth() + 1
    let year = dateObject.getFullYear()

    let formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
    return formattedDate
}