import { Button, Card, CardContent, InputAdornment, InputLabel, NativeSelect, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { getProductsBack } from "../services/products.service";
import { getCustomersBack, postOrderBack, postOrderProductBack } from "../services/customers.service";
import { getCategories } from "../services/categories.service";
import { formatNumber, nameTransform, sortArray } from "../utils/functions";
import "./styles/NewPurchaseOrder.css";


const CreatePurchaseOrder = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productRows, setProductRows] = useState([{}]); //Estado para almacenar las filas de productos
  const [validationError, setValidationError] = useState({}); //Valida el contenido del input
  const [selectProducts, setSelectProducts] = useState([]);
  const [blockButton, setBlockButton] = useState({}); //Bloquea el botón en caso de haber algún error
  const [forceUpdate, setForceUpdate] = useState(false); //Estado axiliar utilizado para forzar el rederizado del componente luego de deseleccionar un producto

  useEffect(() => {
    setLoading(true);
    let errorOCurred = false;
    const fetchData = async () => {
      try {
        let customersData = await getCustomersBack();
        customersData.sort((a,b) => a["name"].localeCompare(b["name"]));
        let categoriesData = await getCategories();

        const newCategoriesData = [];
        let totalProducts = [];
        for (let category of categoriesData) {
          let productsData = await getProductsBack(category.id);
          if (productsData.length !== 0) {
            totalProducts.push(...productsData);
            newCategoriesData.push(category);
          }
        }
        totalProducts = sortArray(totalProducts);
        setProducts(totalProducts);
        categoriesData = sortArray(newCategoriesData);
        setCategories(categoriesData);
        setCustomers(customersData);
      } catch (error) {
        console.log(error.message);
        setErrorMessage(error.message);
        errorOCurred = true;
      } finally {
        if (!errorOCurred) {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  /**
   * Control de errores 
  */

  const handlePurchaseDateChange = (e) => {
    const [year, month, day] = e.target.value.split('-');//Para obtener la fecha correcta debido al GMT-4 o GMT-3
    const selectedDate = new Date(year, month - 1, day); 
    let hasError = false;
    if (selectedDate > new Date() || selectedDate <= new Date("1-1-2022")) {
      hasError = true;
      setValidationError((prevErrors) => ({
        ...prevErrors,
        ["purchaseDate"]: "Error: La fecha no debe ser mayor a la fecha actual.",
      }));
      setBlockButton((prevBlockButton) => ({
        ...prevBlockButton,
        ["purchaseDate"]: true,
      }));
    }
    if (hasError === false) {
      let copy = validationError;
      let blockButtonCopy = { ...blockButton };
      if ("purchaseDate" in validationError) {
        delete copy.purchaseDate;
        delete blockButtonCopy.purchaseDate;
      }
      setValidationError(copy);
      setBlockButton(blockButtonCopy);
    }
  }

  const handleSubscriberChange = (e) => {
    let hasError = false;

    if (parseInt(e.target.value) <= 0) {
      hasError = true;
      setValidationError((prevErrors) => ({
        ...prevErrors,
        ["subscriber"]: "Error: El valor debe ser mayor 0.",
      }));
      setBlockButton((prevBlockButton) => ({
        ...prevBlockButton,
        ["subscriber"]: true,
      }));
    }

    if (hasError === false) {
      let copy = validationError;
      let blockButtonCopy = { ...blockButton };
      if ("subscriber" in validationError) {
        delete copy.subscriber;
        delete blockButtonCopy.subscriber;
      }
      setValidationError(copy);
      setBlockButton(blockButtonCopy);
    }
  }

  const handleProductChange = (e, num) => {
    if (e.target.value == "") {
      let copy = selectProducts;
      if (`product-${num}` in selectProducts) {
        delete copy[`product-${num}`];
      }
      setSelectProducts(copy);
    } else {
      setSelectProducts((prevSelectProducts) => ({
        ...prevSelectProducts,
        [`product-${num}`]: e.target.value
      }));
    }
    setForceUpdate(true); //Fuerza la actualización del componente para que aparezca la opción seleccionable
  }

  useEffect(() => {
    //Resetea la variable de actualización forzada después de que el componente se haya vuelto a renderizar
    setForceUpdate(false);
  }, [selectProducts]);

  const handleWeightChange = (e, num) => {
    let hasError = false;

    if (parseInt(e.target.value) <= 0) {
      hasError = true;
      setValidationError((prevErrors) => ({
        ...prevErrors,
        [`weight-${num}`]: "Error: El valor debe ser mayor que 0.",
      }));
      setBlockButton((prevBlockButton) => ({
        ...prevBlockButton,
        [`weight-${num}`]: true,
      }));
    }

    if (hasError === false) {
      let copy = validationError;
      let blockButtonCopy = { ...blockButton };
      if (`weight-${num}` in validationError) {
        delete copy[`weight-${num}`];
        delete blockButtonCopy[`weight-${num}`];
      }
      setValidationError(copy);
      setBlockButton(blockButtonCopy);
    }
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    let errorOCurred = false;
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      //Obtengo los valores del formulario
      let values = {};
      for (let [name, value] of formData.entries()) {
        values[name] = value;
      }

      //Obtengo los productos seleccionados
      const arr = [];
      for (let key of Object.keys(selectProducts)) {
        let obj = {};
        const productSplited = key.split("-");
        obj[`productId`] = selectProducts[key];
        obj[`weight`] = values[`weights[${productSplited[1]}]`];
        arr.push(obj);
      }
      
      //*Validación previa
      let totalPrice = 0;
      for (let x of arr) {
        const product = products.find(p => p.id == x.productId);
        totalPrice += (product.salePriceKilo * parseInt(x.weight)) / 1000;
        if (product.weight < x.weight) {
          throw new Error(`El stock de ${product.name} (${formatNumber(product.weight)}g) es insuficiente para la venta.`)
        }
      }
      if (totalPrice <= values.purchasePriceKilo) {
        throw new Error("El abono debe menor que el total de la venta.");
      }
      
      //*Llamado api
      let order;
      if (values.purchasePriceKilo != "") {
        order = await postOrderBack({ customerId: parseInt(values.customers), saleDate: values.purchaseDate, subscriber: values.purchasePriceKilo});
      } else {
        order = await postOrderBack({ customerId: parseInt(values.customers), saleDate: values.purchaseDate });
      }

      for (let p of arr) {
        await postOrderProductBack({ customerId: parseInt(values.customers), orderId: order.id, productId: p.productId, weight: p.weight});
      }
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      errorOCurred = true;
    } finally {
        if (!errorOCurred) {
            setLoading(false);
        }
    }
  };

  const closeErrorModal = () => {
    //Cierra el modal en caso de dar click en el botón de cerrar
    setLoading(false);
    setErrorMessage("");
  };

  const handleAddProductRow = () => {
    setProductRows([...productRows, {}]); //Añade una nueva fila vacía al estado
  };

  const handleRemoveProductRow = () => { //Elimina la última fila
    const newProductRows = [...productRows];
    newProductRows.pop();
    setProductRows(newProductRows);
  }


  return (
    <div style={{display: "grid", placeItems: "center", height: "90vh"}}>
      {customers.length === 0 ? (
        <h2 style={{ display: "grid", placeItems: "center" }}>
          No hay clientes registrados
        </h2>
      ) : (
        <div style={{ display: "grid", placeItems: "center" }}>
          <Card sx={{ maxWidth: 420, maxHeight: 480, overflowY: "auto", scrollbarGutter: "stable" }}> {/** scrollbarGutter evita que se desplace el contenido al aparecer la barra */}
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Registrar venta
              </Typography>
                <form onSubmit={handleSubmit}>
                  <br/>
                  <section className="customer-date">
                    <div>
                      <InputLabel 
                      variant="standard"
                      htmlFor="uncontrolled-native"
                      sx={{ fontSize: "12px", width: "30ch" }}
                      >Cliente</InputLabel>
                      <NativeSelect 
                        name="customers" 
                        label="Cliente" 
                        sx={{ width: "16ch" }} 
                        required
                      >
                        <option value="" style={{ fontSize: "14px" }}></option>
                        {customers.map((customer) => (
                          <option
                            style={{ fontSize: "14px" }}
                            value={customer.id}
                            key={customer.id}
                          >
                            {nameTransform(customer.name)}
                          </option>
                        ))}
                      </NativeSelect>
                    </div>                    
                    <TextField
                      name="purchaseDate"
                      label="Fecha de venta"
                      type="date"
                      variant="standard"
                      onChange={e => handlePurchaseDateChange(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                      }}
                      required
                      error={validationError.purchaseDate ? true : false}
                      helperText={validationError.purchaseDate}
                    />
                  </section>
                  <br />
                  <TextField
                    name="purchasePriceKilo"
                    label="Abono"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    onChange={e => handleSubscriberChange(e)}
                    type="number"
                    variant="standard"
                    error={validationError.subscriber ? true : false}
                    helperText={validationError.subscriber}
                    fullWidth
                  />
                  <br />
                  <br />
                  {productRows.map((_, index) => (
                    <section
                      className="product-weight"
                      key={index}
                    >
                      <div className="products">
                        <InputLabel 
                        variant="standard"
                        htmlFor="uncontrolled-native"
                        style={{ fontSize: "12px" }}>Producto</InputLabel>
                        <NativeSelect name={`products[${index}]`} label="Producto" sx={{ width: "16ch" }} onChange={e => handleProductChange(e, index)} required>
                          <option value="" style={{ fontSize: "14px" }} />
                          {categories.map((category) => (
                            <optgroup
                              label={category.name}
                              key={category.id}
                              style={{ fontSize: "14px" }}
                              
                            >
                              {products.map((product) =>
                                product.categoryId === category.id ? (
                                  Object.values(selectProducts).includes(product.id.toString()) 
                                    ? (
                                      <option
                                        style={{ fontSize: "14px" }}
                                        value={product.id}
                                        key={product.id}
                                        disabled
                                      >
                                        {nameTransform(product.name)}
                                      </option>
                                    )
                                    : (
                                      <option
                                        style={{ fontSize: "14px" }}
                                        value={product.id}
                                        key={product.id}
                                      >
                                        {nameTransform(product.name)}
                                      </option>
                                    )
                                ) : null
                              )}
                            </optgroup>
                          ))}
                        </NativeSelect>
                      </div>
                      <TextField
                        name={`weights[${index}]`}
                        label="Cantidad"
                        type="number"
                        sx={{ m: 1, maxWidth: "12ch" }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">g</InputAdornment>,
                        }}
                        onChange={e => handleWeightChange(e, index)}
                        variant="standard"
                        required
                        error={validationError[`weight-${index}`] ? true : false}
                        helperText={validationError[`weight-${index}`]}
                      />
                      {index !== productRows.length - 1 && <div className="spaceDiv"></div>}
                      {index === productRows.length - 1 && ( //Permite visibilizar el botón en la última fila
                        <div className="buttons">
                          <button
                            className="add-product-button"
                            type="button"
                            onClick={handleAddProductRow}
                          >
                            <img src={"../../icons/boton-mas.png"} alt="Add" />
                          </button>
                          {productRows.length > 1 && (
                            <button
                              className="remove-product-button"
                              type="button"
                              onClick={handleRemoveProductRow}
                            >
                              <img src={"../../icons/boton-menos.png"} alt="Remove" />
                            </button>
                          )}
                        </div>
                      )}
                    </section>
                  ))}
                  <br />
                  <br />
                  {
                    Object.values(blockButton).includes(true) 
                    ? (
                      <Button type="submit" variant="outlined" disabled>
                        Guardar
                      </Button>
                    )
                    : (
                      <Button type="submit" variant="outlined" >
                        Guardar
                      </Button>
                    )
                  }
                  
                </form>
            </CardContent>
          </Card>
          {loading && (
            <Loader
              error={errorMessage}
              closeErrorModal={closeErrorModal}
            ></Loader>
          )}
        </div>
      )}
      {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
    </div>
  );
};

export default CreatePurchaseOrder;
