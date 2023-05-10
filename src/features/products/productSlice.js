import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
        name: "almendras",
        price: "2000"
    },
    {
        name: "nueces",
        price: "1000"
    }
]

export const productSlice = createSlice({ //obtiene el estado de las tareas
    name: "products",
    initialState,
    reducers: { //almacena las funciones para poder actualizar el initialState
        addProduct: (state, action) => {
            state.push(action.payload); 
        },
    }
});

export const { addProduct } = productSlice.actions; //exporta las acciones dentro del reducer para poder utilizarlas
export default productSlice.reducer;