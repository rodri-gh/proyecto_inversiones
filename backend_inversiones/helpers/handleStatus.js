import { errorNotExists } from "./handleExceptions.js";

const validStatuses = ['open', 'in_transit', 'closed'];

export const verifyStatus = (status) => {
    if (status && !validStatuses.includes(status)) {
        errorNotExists("body");
    }
}
