// const ENDPOINT = "http://localhost:8000/api/v1/products";
const ENDPOINT = "http://localhost:8000/api/v1/profile/my-products";


export const postProductBack = async (userId, categoryId, { name, salePriceKilo, urls }) => {
    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            salePriceKilo,
            urls,
            userId,
            categoryId,
        }),
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error creando producto")
    }
}

export const postPurchaseBack = async (userId, productId, {purchaseDate, weight, purchasePriceKilo}) => {
    const response = await fetch(ENDPOINT+`/purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            purchaseDate,
            weight,
            purchasePriceKilo,
            productId,
            userId,
        }),
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error creando purchase")
    }
}

export const getProductsBack = async ({token}, categoryId) => {
    const response = await fetch(ENDPOINT+`/${categoryId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo productos")
    }
}

export const patchProductBack = async (productId, {salePriceKilo, urls}) => {
    const response = await fetch(ENDPOINT+`/${productId}`, {
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
        throw new Error("Error actualizando el producto")
    }
}

export const deleteProductBack = async (productId) => {
    const response = await fetch(ENDPOINT+`/${productId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error eliminando el producto")
    }
}