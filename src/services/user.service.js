import { fetchWrapper } from "./auth.service";


const ENDPOINT = "http://localhost:8000/api/v1/profile/personal-information";

export const getUserBack = async () => {
    const response = await fetchWrapper(ENDPOINT);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo la información del usuario.")
    }
}

export const updateUserBack = async ({ email = null, password = null }) => {
    const response = await fetchWrapper(ENDPOINT, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: email != null 
            ? (JSON.stringify({
            email,
            }))
            : (JSON.stringify({
            password,
            })),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error modificando usuario.")
    }
}