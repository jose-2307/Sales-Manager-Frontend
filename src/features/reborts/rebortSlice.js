import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const nameTransform = (name) => {
    let array = name.split(" ");
    let result = "";
    array.forEach(x => {
        result += " "
        result += x[0].toUpperCase().concat(x.slice(1));
    });
    return result;
}


export const rebortSlice = createSlice({ //obtiene el estado de las tareas
    name: "reborts",
    initialState,
    reducers: { //almacena las funciones para poder actualizar el initialState
        addReborts: (state, action) => {
            for (let element of action.payload) {
                element.name = nameTransform(element.name);
            }
            state.push(action.payload); 
        },
    }
});

export const { addReborts } = rebortSlice.actions; //exporta las acciones dentro del reducer para poder utilizarlas
export default rebortSlice.reducer;