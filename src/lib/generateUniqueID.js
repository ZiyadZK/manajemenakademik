import { nanoid } from "nanoid"

export const genereteUniqueID = () => {
    return `${nanoid(6)}-${nanoid(4)}-${nanoid(4)}-${nanoid(6)}`
}