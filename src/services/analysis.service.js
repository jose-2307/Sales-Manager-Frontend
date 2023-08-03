import { fetchWrapper } from "./auth.service";


const ENDPOINT = "http://localhost:8000/api/v1/profile/analysis";

export const getSalesByProductBack = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/sales-product`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo las ventas por producto.")
    }
}

export const getInvestmentBack = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/investment`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo el total invertido.")
    }
}

export const getIncomeBack = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/income`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo el total ganado.")
    }
}

export const getAnnualBalanceBack = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/annual-balance`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo el balance anual.")
    }
}