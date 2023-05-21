const ENDPOINT = "http://localhost:8000/api/v1/products";

export const getProductsBack = async (userId, categoryId) => {
    const response = await fetch(ENDPOINT+`/${userId}/${categoryId}`);
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