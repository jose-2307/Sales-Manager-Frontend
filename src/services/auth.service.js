import Cookies from "universal-cookie";

const cookies = new Cookies();

const ENDPOINT = "http://localhost:8000/api/v1/auth";
const endpointSignUp = "http://localhost:8000/api/v1/users";

export const loginBack = async ({email, password}) => {
    const response = await fetch(`${ENDPOINT}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error iniciando sesión")
    }
}


export const fetchWrapper = async (endpoint, options = {}) => { //Utilizado para ejecutar el refresh token a cada petición

    const accessToken = cookies.get("accessToken");
    if (accessToken) { //Agrega el access token
        if (!options.headers) {
            options.headers = {};
        }
        options.headers.Authorization = `Bearer ${accessToken}`;
    } 

    const response = await fetch(endpoint, options);
    if (response.status === 401) { //Verifica si la respuesta retorna un unauthorized (token inválido)
        const refreshToken = cookies.get("refreshToken");
        if (!refreshToken) {
            window.location.assign("/login");
        }

        if (refreshToken) {
            const refreshResponse = await fetch(`${ENDPOINT}/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "refresh": refreshToken,
                },
            });
            if (refreshResponse.status === 401) {
                window.location.assign("/login");
            }

            const refreshData = await refreshResponse.json();
            cookies.set("accessToken", refreshData.accessToken, { path: "/ "}); //se actualiza el access token en la cookie

            return fetchWrapper(endpoint, options); //Vuelve a intentar la petición inicial con el nuevo access token
        }
    } 

    return response;
}


export const singUpBack = async ({name, lastName, email, password}) => {
    const response = await fetch(endpointSignUp, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            lastName,
            email,
            password,
        }),
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.status === 409) {
            throw new Error("El correo electrónico ya se encuentra registrado.");
        }
        throw new Error("Error registrando usuario");
    }
}