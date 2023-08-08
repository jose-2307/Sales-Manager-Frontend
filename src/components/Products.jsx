import { useEffect, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProducts, deleteProduct } from "../features/products/productSlice";
import { getProductsBack, deleteProductBack } from "../services/products.service";
import "./styles/Products.css"
import { useParams, Link } from "react-router-dom";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import Loader from "./Loader";
import Pagination from "./Pagination";
import { formatNumber } from "../utils/functions";


const Products = () => {
    const products = useSelector(state => state.products);
    const [open, setOpen] = useState(false); //Controla el abrir y cerrar del modal
    const [openProductModal, setOpenProductModal] = useState(null); //Controla que se abra el modal del producto asociado
    const [count, setCount] = useState(0); //Controla la cantidad de productos encontrados
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();
    const { id = "" } = useParams();
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(4);


    //Se utiliza para eliminar la data asociada a un producto cuando se cambia de categoría
    useEffect(() => {
        dispatch(deleteProducts());
    }, []);

    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        if (id === "") return 
        const fetchProducts = async () => {
            try {
                const data = await getProductsBack(id);
                data.sort((a,b) => a.name.localeCompare(b.name));
                data.forEach(x => {
                    dispatch(addProduct(x));
                });
                setCount(data.length);
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.message);
                errorOCurred = true;
            } finally {
                if (!errorOCurred) {
                    setLoading(false);
                }
            }
        }
        fetchProducts();       
        
    }, [dispatch, id]);
    
    //Elemina un producto
    const handleDelete = async id => {
        setLoading(true);
        let errorOCurred = false;
        try {
            await deleteProductBack(id);
            dispatch(deleteProduct(id));
            setCount(count - 1);
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
            errorOCurred = true;
        } finally {
            if (!errorOCurred) {
                setLoading(false);
            }
        }
        
    }

    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }

    //Pagination
    const lastProductIndex = currentPage * productsPerPage;
    const firstProductIndex = lastProductIndex - productsPerPage;
    const currentProducts = products.slice(firstProductIndex, lastProductIndex);


    if (!products) return <></>
    return (
        <section>
            <h1>Mis productos</h1>
            <div className="container-all">
                <div className="container-products">
                    <Link className="createProduct" to={`/categories/${id}/create-product`}>Crear producto<img src="../../icons/crear.png"/></Link>
                    <p className="countProducts"><b>{count}</b> productos</p>
                    {currentProducts.length === 0 
                    ? <h3>No hay productos</h3>
                    :
                    currentProducts.map(p => 
                            <div className="container-product" key={p.id}>
                                <img className="img-product" alt={p.name} 
                                src={p.images.length === 0 ? "http://res.cloudinary.com/dmevmh3ch/image/upload/v1685639993/m90r4s6zt6ooxb5jovpl.png" : p.images[0].url} 
                                width="50%" height="32%" />
                                <section className="product-info">
                                    <h3 className="product-title">
                                        {p.name[0].toUpperCase().concat(p.name.slice(1))}
                                    </h3>
                                    {p.weight < 1000 
                                        ? <p>Stock: <b style={{color:"red"}}>{`${formatNumber(p.weight)} g`}</b></p> 
                                        : <p>Stock: <b>{`${formatNumber(p.weight)} g`}</b></p>
                                    } 
                                    <p>{`Precio por kilo: $ ${formatNumber(p.salePriceKilo)}`}</p>
                                </section>    
                                <section className="manage-product">
                                    <div className="icons-center">

                                        <Link className="edit-button" to={`/categories/${id}/edit-product/${p.id}`}><img src={"../../icons/escribir.png"} /></Link>
                                        <Link className="add-button" to={`/categories/${id}/create-purchase/${p.id}`}><img src={"../../icons/agregar.png"} /></Link>    
                                        <button className="delete-button" onClick={() => {setOpenProductModal(p.id); setOpen(true)}}><img src={"../../icons/borrar.png"} /></button>
                                        {openProductModal === p.id && ( // Controla que el modal a abrir sea el del producto asociado según el botón cliqueado
                                            <Modal
                                                aria-labelledby="transition-modal-title"
                                                aria-describedby="transition-modal-description"
                                                open={open} 
                                                onClose={() => {setOpenProductModal(null); setOpen(false)}}
                                                closeAfterTransition
                                                slots={{ backdrop: Backdrop }}
                                                slotProps={{
                                                backdrop: {
                                                    timeout: 500,
                                                },
                                                }}
                                            >
                                                <Fade in={open}>
                                                    <Box sx={{
                                                        position: "absolute",
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: 400,
                                                        bgcolor: 'background.paper',
                                                        border: '2px solid #000',
                                                        boxShadow: 24,
                                                        p: 4,}}
                                                    >
                                                        <Typography id="transition-modal-title" variant="h6" component="h2">
                                                            ¿Estás seguro?
                                                        </Typography>
                                                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                                            El producto &quot;{p.name[0].toUpperCase().concat(p.name.slice(1))}&quot; será eliminado y <b>no podrá ser recuparado.</b>
                                                        </Typography>
                                                        <br></br>
                                                        <Button variant="contained" style={{marginRight: "12%", marginLeft: "16%", backgroundColor: "grey"}} onClick={() => setOpen(false)}>Cancelar</Button>
                                                        <Button variant="contained" color="error" style={{marginRight: "10%"}} onClick={() => handleDelete(p.id)}>Sí, eliminar</Button>
                                                    </Box>
                                                </Fade>
                                            </Modal>
                                        )}
                                        {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
                                    </div>
                                </section> 
                            </div>
                        )
                    }
                </div>
            </div>
            <Pagination totalElements={products.length} elementsPerPage={productsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
            <br></br>
        </section>
    )
}

export default Products