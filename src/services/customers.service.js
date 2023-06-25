import { fetchWrapper } from "./auth.service";

const ENDPOINT = "http://localhost:8000/api/v1/profile";

export const getRebtors = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/rebtors`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo deudores.")
    }
}


export const updateRebtors = async (customerId, orderId, {paymentDate, paidOut, subscriber}) => {
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