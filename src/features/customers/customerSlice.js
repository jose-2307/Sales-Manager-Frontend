import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const customerSlice = createSlice({ //obtiene el estado de las tareas
    name: "customers",
    initialState,
    reducers: { //almacena las funciones para poder actualizar el initialState
        addCustomer: (state, action) => {
            state.push(action.payload); 
        },
        updateCustomer: (state, action) => {
            const { id, name, phone, location, email } = action.payload;
            const customerFound = state.find(p => p.id === id);
            if (customerFound) {
                customerFound.name = name;
                customerFound.phone = phone;
                customerFound.location = location;
                customerFound.email = email;
            }
        },
    }
});

export const { addCustomer, updateCustomer } = customerSlice.actions; //exporta las acciones dentro del reducer para poder utilizarlas
export default customerSlice.reducer;