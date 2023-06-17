import { fetchWrapper } from "./auth.service";

const ENDPOINT = "http://localhost:8000/api/v1/profile";

export const getRebtors = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/rebtors`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo deudores.")
    }
}