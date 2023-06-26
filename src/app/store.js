import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "../features/products/productSlice"
import categoriesReducer from "../features/categories/categorySlice"
import usersReducer from "../features/users/userSlice"
import debtorReducer from "../features/debtors/debtorSlice";


export const store = configureStore({ //Permite dividir el estado de múltiples archivos
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    users: usersReducer,
    debtors: debtorReducer,
  },
})