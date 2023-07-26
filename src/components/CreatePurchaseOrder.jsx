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
  const [blockButton, setBlockButton] = useState(false); //Bloquea el botón en caso de no ser válido

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
    }
    if (hasError === false) {
      let copy = validationError;
      if ("purchaseDate" in validationError) {
        delete copy.purchaseDate;
      }
      setValidationError(copy);
    }
    setBlockButton(hasError);
  }

  const handleSubscriberChange = (e) => {
    let hasError = false;

    if (parseInt(e.target.value) <= 0) {
      hasError = true;
      setValidationError((prevErrors) => ({
        ...prevErrors,
        ["subscriber"]: "Error en el abono",
      }));
    }

    if (hasError === false) {
      let copy = validationError;
      if ("subscriber" in validationError) {
        delete copy.subscriber;
      }
      setValidationError(copy);
    }
    setBlockButton(hasError);
  }

  const handleProductChange = (e) => {
    console.log(e.target.value);
  }

  const handleWeightChange = (e) => {
    console.log(e.target.value);
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

  console.log(validationError)
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
                        <NativeSelect name={`products[${index}]`} label="Producto" sx={{ width: "16ch" }}>
                          <option value="" style={{ fontSize: "14px" }} />
                          {categories.map((category) => (
                            <optgroup
                              label={category.name}
                              key={category.id}
                              style={{ fontSize: "14px" }}
                            >
                              {products.map((product) =>
                                product.categoryId === category.id ? (
                                  <option
                                    style={{ fontSize: "14px" }}
                                    value={product.name}
                                    key={product.id}
                                  >
                                    {nameTransform(product.name)}
                                  </option>
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
                        variant="standard"
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
                  <Button type="submit" variant="outlined" >
                    Guardar
                  </Button>
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
