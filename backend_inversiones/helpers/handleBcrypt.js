import bcrypt from 'bcrypt';


export const encrypt = async (text) => {
    const hash = await bcrypt.hash(text, 10);
    return hash;
}

export const compare = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}
