import { errorNotExists } from "../helpers/handleExceptions.js";

export const validateData = (data) => {
    for (const element of data) {
        if (element === undefined) {
            throw errorNotExists("body");
        }
    }
    return true;
};