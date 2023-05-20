import { createSlice } from "@reduxjs/toolkit";

// const initialState = [{data: [], id: ""}];
// const localData = localStorage.getItem("products");
// const initialState = localData ? localData : [];
const initialState = [];
// console.log("initialState",initialState)

export const productSlice = createSlice({ //obtiene el estado de las tareas
    name: "products",
    initialState,
    reducers: { //almacena las funciones para poder actualizar el initialState
        addProduct: (state, action) => {
            state.push(action.payload); 
        },
        updateProduct: (state, action) => {
            const { id, salePriceKilo, images } = action.payload;
            const productFound = state.find(p => p.id === id);
            if (productFound) {
                productFound.salePriceKilo = salePriceKilo;
                productFound.images = images;
            }
        },
        deleteProduct: (state, action) => {
            const productFound = state.find(p => p.id === action.payload);
            if (productFound) {
                state.splice(state.indexOf(productFound), 1);
            }
        },
        deleteProducts: (state, action) => {
            state.length = 0;
            // state.push({data: [], id: ""})
        },
    }
});

export const { addProduct, updateProduct, deleteProduct, deleteProducts } = productSlice.actions; //exporta las acciones dentro del reducer para poder utilizarlas
export default productSlice.reducer;