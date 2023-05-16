const ENDPOINT = "http://localhost:8000/api/v1/products";

export const getProducts= async (userId, categoryId) => {
    const response = await fetch(ENDPOINT+`/${userId}/${categoryId}`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo productos")
    }
}