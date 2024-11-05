import { errorNotExists } from "./handleExceptions.js";

export const verifyIfIdExists = (data) => {
    if (data === 0 || data === null) {
        errorNotExists();
    }
}