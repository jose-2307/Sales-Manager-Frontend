import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const userSlice = createSlice({ //obtiene el estado de las tareas
    name: "users",
    initialState,
    reducers: { //almacena las funciones para poder actualizar el initialState
        addUser: (state, action) => {
            state.push(action.payload); 
        },
    }
});

export const { addUser  } = userSlice.actions; //exporta las acciones dentro del reducer para poder utilizarlas
export default userSlice.reducer;