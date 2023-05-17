import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../features/products/productSlice";
import { getProducts } from "../services/products.service";
import "./styles/Products.css"


const userId = 2;
const categoryId = 1;

const Products = () => {
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();
    const [editProduct, setEditProduct] = useState(null);
    // const [messageVisible, setMessageVisible] = useState(false);

    useEffect(() => {
        if (products.length === 0) {
            const fetchProducts = async () => {
                try {
                    const data = await getProducts(userId,categoryId);
                    data.forEach(x => {
                        dispatch(addProduct(x));
                    });
                } catch (error) {
                    console.log(error.message);
                }
            }
            fetchProducts();
        }
    }, [dispatch, products]);
    console.log({products})
    
    const handleModal = (productId) => {
        setEditProduct(productId);
    }

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
                                                        <input label={"Precio"} />
                                                    </form>
                                                </div>
                                            </div>
                                        )}
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



// const Products = () => {
//     const [image, setImage] = useState("");

//     const submitImage = () => {
//         const data = new FormData();
//         data.append("file", image);
//         data.append("upload_preset","Sales_Manager");
//         data.append("cloud_name","dmevmh3ch");

//         fetch("https://api.cloudinary.com/v1_1/dmevmh3ch/image/upload", {
//             method: "post",
//             body: data
//         })
//         .then((res) => res.json())
//         .then((data) => {
//             console.log(data)
//         }).catch((err) => {
//             console.log(err)
//         })
//     }
//     return (
//         <div>
//             <input type="file" onChange={(e) => setImage(e.target.files[0])} />
//             <button onClick={submitImage}>upload</button>
//         </div>
//     )
// }

export default Products