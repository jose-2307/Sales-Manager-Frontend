import { Button, Card, CardContent, InputAdornment, InputLabel, NativeSelect, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { getProductsBack } from "../services/products.service";
import { getCustomersBack } from "../services/customers.service";
import { getCategories } from "../services/categories.service";
import { nameTransform, sortArray } from "../utils/functions";
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
        customersData = sortArray(customersData);
        let categoriesData = await getCategories();

        const newCategoriesData = [];
        for (let category of categoriesData) {
          let productsData = await getProductsBack(category.id);
          productsData = sortArray(productsData);
          if (productsData.length !== 0) {
            setProducts(productsData);
            newCategoriesData.push(category);
          }
        }
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
    e.preventDefault();
    const formData = new FormData(e.target);

    // Obtener los valores del formulario
    const values = {};
    for (let [name, value] of formData.entries()) {
      values[name] = value;
    }

    console.log(values);
    // navigate("/");
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
        <div style={{ display: "grid", placeItems: "center" }}>
          No hay clientes registrados.
        </div>
      ) : (
        <div style={{ display: "grid", placeItems: "center" }}>
          <Card sx={{ maxWidth: 420, maxHeight: 480, overflowY: "auto" }}>
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
                      <NativeSelect name="customers" label="Cliente" sx={{ width: "16ch" }} required>
                        <option value="" style={{ fontSize: "14px" }}></option>
                        {customers.map((customer) => (
                          <option
                            style={{ fontSize: "14px" }}
                            value={customer.name}
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
                  {productRows.map((row, index) => (
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
                                  Object.values(selectProducts).includes(product.name) 
                                    ? (
                                      <option
                                        style={{ fontSize: "14px" }}
                                        value={product.name}
                                        key={product.id}
                                        disabled
                                      >
                                        {nameTransform(product.name)}
                                      </option>
                                    )
                                    : (
                                      <option
                                        style={{ fontSize: "14px" }}
                                        value={product.name}
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
