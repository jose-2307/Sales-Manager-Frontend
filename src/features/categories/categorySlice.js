import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
        name: "Frutos Secos",
        url: ""
    },
    {
        name: "Lácteos",
        url: ""
    }
]

export const categorySlice = createSlice({ //obtiene el estado de las tareas
    name: "categories",
    initialState,
    reducers: { //almacena las funciones para poder actualizar el initialState
        addCategory: (state, action) => {
            state.push(action.payload); 
        },
    }
});

export const { addProduct } = categorySlice.actions; //exporta las acciones dentro del reducer para poder utilizarlas
export default categorySlice.reducer;