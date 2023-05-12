import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
        id: 1,
        name: "Frutos Secos",
        url: "../../../categories/frutos-secos.jpg"
    },
    {
        id: 2,
        name: "Lácteos",
        url: "../../../categories/lacteos.jpg"
    },
    {
        id: 3,
        name: "Frutos Secos",
        url: "../../../categories/frutos-secos.jpg"
    },
    {
        id: 4,
        name: "Lácteos",
        url: "../../../categories/lacteos.jpg"
    },
    {
        id: 5,
        name: "Frutos Secos",
        url: "../../../categories/frutos-secos.jpg"
    },
    {
        id: 6,
        name: "Lácteos",
        url: "../../../categories/lacteos.jpg"
    },
    {
        id: 7,
        name: "Frutos Secos",
        url: "../../../categories/frutos-secos.jpg"
    },
    {
        id: 8,
        name: "Lácteos",
        url: "../../../categories/lacteos.jpg"
    },
    {
        id: 9,
        name: "Frutos Secos",
        url: "../../../categories/frutos-secos.jpg"
    },

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