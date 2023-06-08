import { fetchWrapper } from "./auth.service";

// const ENDPOINT = "http://localhost:8000/api/v1/products";
const ENDPOINT = "http://localhost:8000/api/v1/profile";


export const postProductBack = async (categoryId, { name, salePriceKilo, urls }) => {
    const response = await fetchWrapper(`${ENDPOINT}/product`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            salePriceKilo,
            urls,
            categoryId,
        }),
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("El producto ingresado ya se encuentra creado.")
    }
}

export const postPurchaseBack = async (productId, {purchaseDate, weight, purchasePriceKilo}) => {
    const response = await fetchWrapper(`${ENDPOINT}/product-purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            purchaseDate,
            weight,
            purchasePriceKilo,
            productId,
        }),
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error agregando producto.")
    }
}


export const getProductsBack = async (categoryId) => {
    const response = await fetchWrapper(`${ENDPOINT}/my-products/${categoryId}`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo productos.s")
    }
}

export const patchProductBack = async (productId, {salePriceKilo, urls}) => {
    const response = await fetchWrapper(`${ENDPOINT}/product/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            salePriceKilo,
            urls,
        }),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error actualizando el producto.")
    }
}

export const deleteProductBack = async (productId) => {
    const response = await fetchWrapper(`${ENDPOINT}/product/${productId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error eliminando el producto.")
    }
}