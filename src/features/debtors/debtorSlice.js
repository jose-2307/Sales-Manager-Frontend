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


export const debtorSlice = createSlice({
    name: "debtors",
    initialState,
    reducers: { //almacena las funciones para poder actualizar el initialState
        addDebtors: (state, action) => {
            for (let element of action.payload) {
                element.name = nameTransform(element.name);
                element.purchaseOrders.sort((a,b) => a.id - b.id); //Ordena las órdenes de compra según su id
            }
            state.push(action.payload); 
        },
        deleteDebtors: (state, action) => {
            const { id } = action.payload;
            const debtor = state.find(x => id == x.id);
            state.splice(state.indexOf(debtor), 1);
        },
        updateDebtor: (state, action) => {
            const { id, orderId, subscriber } = action.payload;
            console.log(id,orderId,subscriber)

            const debtor = state[0].find(x => id == x.id);
            const order = debtor.purchaseOrders.find(x => orderId == x.id);
            if (subscriber) {
                console.log("Subscriber")
                const total = parseInt(order.subscriber) + parseInt(subscriber);
                order.subscriber = total;
                //guardarlo en el state

            } else {
                debtor.purchaseOrders.splice(debtor.purchaseOrders.indexOf(order), 1);
            }  
        } 
    }
});


export const { addDebtors,deleteDebtors, updateDebtor } = debtorSlice.actions; //exporta las acciones dentro del reducer para poder utilizarlas
export default debtorSlice.reducer;