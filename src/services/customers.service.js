import { fetchWrapper } from "./auth.service";

const ENDPOINT = "http://localhost:8000/api/v1/profile";

export const getDebtorsBack = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/debtors`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo deudores.")
    }
}

export const updateDebtorsBack = async (customerId, orderId, {paymentDate, paidOut, subscriber}) => {
    const response = await fetchWrapper(`${ENDPOINT}/customer/${customerId}/purchase-order/${orderId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            paymentDate,
            paidOut,
            subscriber
        }),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error registrando el pago.")
    }
}

export const getCustomersBack = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/customer`);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error cargando los clientes.");
    }
}

export const postOrderBack = async ({customerId, saleDate, subscriber = null}) => {
    const response = await fetchWrapper(`${ENDPOINT}/customer/${customerId}/purchase-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: subscriber != null 
            ? JSON.stringify({
                saleDate,
                subscriber
            })
            : JSON.stringify({
                saleDate,
            }),
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error creando la orden de compra.")
    }
}

export const postOrderProductBack = async ({customerId, orderId, productId, weight}) => {
    const response = await fetchWrapper(`${ENDPOINT}/customer/${customerId}/purchase-order/${orderId}/product`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            productId,
            weight
        }),
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error creando el producto de la orden de compra.")
    }
}