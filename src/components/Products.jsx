import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProduct } from "../features/products/productSlice";
import { getProducts } from "../services/products.service";
import "./styles/Products.css"
import { useParams } from "react-router-dom";


const userId = 1;

// const validate = (values) => {
//     const errors = {};
// }

const Products = () => {
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();
    const [editProduct, setEditProduct] = useState(null);
    const { id = "" } = useParams();
    // const [messageVisible, setMessageVisible] = useState(false);

    //Se utiliza para eliminar la data asociada a un producto cuando se cambia de categoría
    useEffect(() => {
        // if (products[0] != undefined && id == products[0].id) {console.log("Repetido")}
        dispatch(deleteProduct());
    }, []);


    useEffect(() => {
        if (id === "") return
        const fetchProducts = async () => {
            try {
                const data = await getProducts(userId,id);
                // dispatch(addProduct({data, id}));
                data.forEach(x => {
                    dispatch(addProduct(x));
                });
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchProducts();
    }, [dispatch, id]);
    

    // if (products[0] != undefined && "id" in products[0]) {
    //     console.log(products[0].id)
    //     products = products[0].data
    // }
    

    const handleModal = (productId) => {
        setEditProduct(productId);
    }
    if (!products) return <></>
    return (
        <section>
            <h1>Mis productos</h1>
            <div className="container-all">
                <div className="container-products">
                    {products.length === 0 
                    ? <h3>No hay productos</h3>
                    :
                        products.map(p => 
                            <div className="container-product" key={p.id}>
                                <img className="img-product" alt={p.name} src={"../../categories/frutos-secos.jpg"} width="50%" height="32%" />
                                <section className="product-info">
                                    <h3 className="product-title">
                                        {p.name[0].toUpperCase().concat(p.name.slice(1))}
                                    </h3>
                                    {p.weight < 1000 
                                        ? <p>Stock: <b style={{color:"red"}}>{`${p.weight} g`}</b></p> 
                                        : <p>Stock: <b>{`${p.weight} g`}</b></p>
                                    } 
                                    <p>{`Precio por kilo: $ ${p.salePriceKilo}`}</p>
                                </section>    
                                <section className="manage-product">
                                    <div className="icons-center">
                                        <button className="edit-button" onClick={() => handleModal(p.id)}><img src={"../../icons/escribir.png"} /></button>
                                        {editProduct === p.id && (
                                            <div className="edit-modal">
                                                <div className="modal-content">
                                                    <span className="close" onClick={() => handleModal(null)}>
                                                    &times;
                                                    </span>
                                                    <form>
                                                        <input label={"Precio"} />
                                                        <input type="" label={"Precio"} />
                                                    </form>
                                                </div>
                                            </div>
                                        )}
                                        <button className="add-button" ><img src={"../../icons/agregar.png"} /></button>    
                                        <button className="delete-button" ><img src={"../../icons/borrar.png"} /></button>    
                                    </div>
                                </section> 
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    )
}

export default Products