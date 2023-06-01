const ENDPOINT = "http://localhost:8000/api/v1/auth/login";

export const loginBack = async ({email, password}) => {
    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error iniciando sesión")
    }
}