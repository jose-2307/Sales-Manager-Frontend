// const ENDPOINT = "http://localhost:8000/api/v1/products";
const ENDPOINT = "http://localhost:8000/api/v1/profile";


export const postProductBack = async (token, categoryId, { name, salePriceKilo, urls }) => {
    const response = await fetch(`${ENDPOINT}/product`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
        throw new Error("Error creando producto")
    }
}

export const postPurchaseBack = async (token, productId, {purchaseDate, weight, purchasePriceKilo}) => {
    const response = await fetch(`${ENDPOINT}/product-purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
        throw new Error("Error creando purchase")
    }
}

export const getProductsBack = async (token, categoryId) => {
    const response = await fetch(`${ENDPOINT}/my-products/${categoryId}`, {
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

export const patchProductBack = async (token, productId, {salePriceKilo, urls}) => {
    const response = await fetch(`${ENDPOINT}/product/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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

export const deleteProductBack = async (token, productId) => {
    const response = await fetch(`${ENDPOINT}/product/${productId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error eliminando el producto")
    }
}