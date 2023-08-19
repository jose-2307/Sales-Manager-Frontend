import { fetchWrapper } from "./auth.service";


const ENDPOINT = "http://localhost:8000/api/v1/profile/analysis";

export const getSalesByProductBack = async (month, year) => {
    let response;
    if (month && year) {
        response = await fetchWrapper(`${ENDPOINT}/sales-product?year=${year}&month=${month}`);
    } else {
        response = await fetchWrapper(`${ENDPOINT}/sales-product`);
    }

    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo las ventas por producto.")
    }
}

export const getInvestmentBack = async (month, year) => {
    let response;
    if (month && year) {
        response = await fetchWrapper(`${ENDPOINT}/investment?year=${year}&month=${month}`);
    } else {
        response = await fetchWrapper(`${ENDPOINT}/investment`);
    }
    
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo el total invertido.")
    }
}

export const getIncomeBack = async (month, year) => {
    let response;
    if (month && year) {
        response = await fetchWrapper(`${ENDPOINT}/income?year=${year}&month=${month}`);
    } else {
        response = await fetchWrapper(`${ENDPOINT}/income`);
    }

    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo el total ganado.")
    }
}

export const getAnnualBalanceBack = async (month, year) => {
    let response;
    if (month && year) {
        response = await fetchWrapper(`${ENDPOINT}/annual-balance?year=${year}`);
    } else {
        response = await fetchWrapper(`${ENDPOINT}/annual-balance`);
    }

    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo el balance anual.")
    }
}