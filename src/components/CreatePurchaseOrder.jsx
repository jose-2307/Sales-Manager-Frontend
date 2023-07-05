import { Button, Card, CardContent, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import Loader from "./Loader";
import { getProductsBack } from "../services/products.service";
import { getCustomersBack } from "../services/customers.service";
import { getCategories } from "../services/categories.service";
import SelectInput from "./SelectInput";

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

  useEffect(() => {
    setLoading(true);
    let errorOCurred = false;
    const fetchDebtors = async () => {
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
    fetchDebtors();
  }, []);

  const handleSubmit = async (values) => {
    console.log(values);
    navigate("/");
  };

  const closeErrorModal = () => {
    //Cierra el modal en caso de dar click en el botón de cerrar
    setLoading(false);
    setErrorMessage("");
  };
  return (
    <>
      {customers.length === 0
        ? <div style={{display: "grid", placeItems: "center" }}>No hay clientes registrados.</div>
        : (
          <div style={{ display: "grid", placeItems: "center" }}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Registrar venta
                </Typography>
                <Formik
                  initialValues={{ customers: "", salePriceKilo: "" }}
                  validate={validate}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <SelectInput
                      name="customers"
                      label="Cliente"
                    >
                      <option value="">Seleccione cliente</option>
                      {customers.map(customer => (
                        <option value={customer.name} key={customer.id}>{customer.name}</option>
                      ))}
                    </SelectInput>
                    
                    <br></br>
                    <br />
                    <Button type="submit" variant="outlined">
                      Guardar
                    </Button>
                  </Form>
                </Formik>
              </CardContent>
            </Card>
            {loading && (
              <Loader
                error={errorMessage}
                closeErrorModal={closeErrorModal}
              ></Loader>
            )}
          </div>
        )
      }
    </>
  );
};

export default CreatePurchaseOrder;
