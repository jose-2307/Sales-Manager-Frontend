import { createSlice } from "@reduxjs/toolkit";

// const initialState = [{data: [], id: ""}];
const initialState = [];

export const productSlice = createSlice({ //obtiene el estado de las tareas
    name: "products",
    initialState,
    reducers: { //almacena las funciones para poder actualizar el initialState
        addProduct: (state, action) => {
            state.push(action.payload); 
        },
        deleteProduct: (state, action) => {
            state.length = 0;
            // state.push({data: [], id: ""})
        },
    }
});

export const { addProduct, deleteProduct } = productSlice.actions; //exporta las acciones dentro del reducer para poder utilizarlas
export default productSlice.reducer;