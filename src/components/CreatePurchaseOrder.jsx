import { Button, Card, CardContent, InputAdornment, InputLabel, NativeSelect, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { getProductsBack } from "../services/products.service";
import { getCustomersBack } from "../services/customers.service";
import { getCategories } from "../services/categories.service";
import { nameTransform } from "../utils/functions";
import "./styles/NewPurchaseOrder.css";

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Requerido";
  } else if (values.name.length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres";
  } else if (values.name.length > 30) {
    errors.name = "El nombre debe tener a lo más 30 caracteres";
  }

  if (!values.salePriceKilo) {
    errors.salePriceKilo = "Requerido";
  } else if (values.purchasePriceKilo <= 0) {
    errors.salePriceKilo = "El valor debe ser positivo";
  }

  return errors;
};

const CreatePurchaseOrder = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productRows, setProductRows] = useState([{}]); //Estado para almacenar las filas de productos

  useEffect(() => {
    setLoading(true);
    let errorOCurred = false;
    const fetchData = async () => {
      try {
        const customersData = await getCustomersBack();
        let categoriesData = await getCategories();

        const newCategoriesData = [];
        for (let category of categoriesData) {
          const productsData = await getProductsBack(category.id);
          if (productsData.length !== 0) {
            setProducts(productsData);
            newCategoriesData.push(category);
          }
        }
        categoriesData = newCategoriesData;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Obtener los valores del formulario
    const values = {};
    for (let [name, value] of formData.entries()) {
      values[name] = value;
    }

    console.log(values);
    navigate("/");
  };

  const closeErrorModal = () => {
    //Cierra el modal en caso de dar click en el botón de cerrar
    setLoading(false);
    setErrorMessage("");
  };

  const handleAddProductRow = () => {
    setProductRows([...productRows, {}]); //Añade una nueva fila vacía al estado
  };
  return (
    <div style={{display: "grid", placeItems: "center", height: "90vh"}}>
      {customers.length === 0 ? (
        <div style={{ display: "grid", placeItems: "center" }}>
          No hay clientes registrados.
        </div>
      ) : (
        <div style={{ display: "grid", placeItems: "center" }}>
          <Card sx={{ maxWidth: 400, maxHeight: 480, overflowY: "auto" }}>
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
                      sx={{ fontSize: "12px", width: "30ch" }}>Cliente</InputLabel>
                      <NativeSelect name="customers" label="Cliente" sx={{ width: "16ch" }}>
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
                      InputProps={{
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                      }}
                    />
                  </section>
                  <br />
                  <TextField
                    name="purchasePriceKilo"
                    label="Abono"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
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
                        sx={{ m: 1, width: "12ch" }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">g</InputAdornment>,
                        }}
                        variant="standard"
                      />
                      {index === productRows.length - 1 && ( //Permite visibilizar el botón en la última fila
                        <button
                          className="add-product-button"
                          type="button"
                          onClick={handleAddProductRow}
                        >
                          <img src={"../../icons/boton-mas.png"} alt="Add" />
                        </button>
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
    </div>
  );
};

export default CreatePurchaseOrder;
