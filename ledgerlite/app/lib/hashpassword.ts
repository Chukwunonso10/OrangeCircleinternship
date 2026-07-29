import bcrypt from "bcryptjs";

export function HashPassword(password: string){
    return bcrypt.hash(password, 12)
}

export function Verifypassword(password: string, hashed: string) {
    return bcrypt.compare(password, hashed)
}