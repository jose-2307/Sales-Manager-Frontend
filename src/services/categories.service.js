import { fetchWrapper } from "./auth.service";


const ENDPOINT = "http://localhost:8000/api/v1/categories";

export const getCategories = async () => {
    const response = await fetchWrapper(ENDPOINT);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo categorías")
    }
}

