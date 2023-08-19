import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
  } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Loader from "./Loader";
import { getAnnualBalanceBack, getIncomeBack, getInvestmentBack, getSalesByProductBack } from "../services/analysis.service";
import { formatNumber, nameTransform } from "../utils/functions";
import "./styles/Analysis.css";
import { getMonthsBack, getYearsBack } from "../services/customers.service";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);



const Analysis = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [investment, setInvestment] = useState([]);
    const [income, setIncome] = useState([]);
    const [salesProduct, setSalesProduct] = useState([]);
    const [annualBalance, setAnnualBalance] = useState([]);
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [year, setYear] = useState(""); //Controla el año seleccionado
    const [month, setMonth] = useState(""); //Controla el mes seleccionado


    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchData = async () => {
            try {
                const salesProductData = await getSalesByProductBack();
                salesProductData.sort((a,b) => a.name.localeCompare(b.name));
                setSalesProduct(salesProductData);
                const investmentData = await getInvestmentBack();
                setInvestment(investmentData);
                const incomeData = await getIncomeBack();
                setIncome(incomeData);
                const annualBalanceData = await getAnnualBalanceBack();
                setAnnualBalance(annualBalanceData);
                const yearsData = await getYearsBack();
                setYears(yearsData);
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
        fetchData();
    }, []);


    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }

    const handleYearChange = async (event) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const monthsData = await getMonthsBack(event.target.value);
            setMonths(monthsData);
            setYear(event.target.value);
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
    
    const handleMonthChange = async (event) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const salesData = await getSalesByProductBack(event.target.value,year);
            salesData.sort((a,b) => a.name.localeCompare(b.name));
            setSalesProduct(salesData);
            const investmentData = await getInvestmentBack(event.target.value,year);
            setInvestment(investmentData);
            const incomeData = await getIncomeBack(event.target.value,year);
            setIncome(incomeData);
            const annualBalanceData = await getAnnualBalanceBack(event.target.value,year);
            setAnnualBalance(annualBalanceData);
            setMonth(event.target.value);
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

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthsBalance = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];  

    const salesProductOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Cantidad Vendida por Producto (gramos)',
            font: {
                size: 14,
                color: "black"
            }
          },
        },
    };

    const annualBalanceOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Balance Anual',
            font: {
                size: 14,
                color: "black"
            }
          },
        },
    };
    const salesProductdata = {
        labels: salesProduct.map(x => nameTransform(x.name)),
        datasets: [
            {
                label: `${monthsBalance[month ? month - 1 : currentMonth]} ${year ? year : currentYear}`,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: salesProduct.map(x => x.weight),
            },
        ],
    };

    const annualBalancedata = {
        labels: annualBalance.map(x => x.name),
        datasets: [
            {
                label: `${year ? year : currentYear}`,
                backgroundColor: 'rgb(53, 162, 235)',
                borderColor: 'rgb(53, 162, 235)',
                data: annualBalance.map(x => x.balance),
            },
        ],
    };


    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "90vh" }}>
                <section style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", left: "40px" }}>
                        <FormControl style={{width: "90px", paddingRight: "6px"}} size="small">
                            <InputLabel id="demo-select-small-label" style={{display: "grid", placeItems: "center"}}>Año</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={year}
                                label="Año"
                                onChange={handleYearChange}
                            >
                                {years.map(y => (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {months.length > 0 && (
                            <>
                                <FormControl style={{width: "90px", paddingLeft: "6px"}} size="small">
                                    <InputLabel id="demo-select-small-label">Mes</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={month}
                                        label="Mes"
                                        onChange={handleMonthChange}
                                    >
                                        {months.map(m => (
                                            <MenuItem key={m} value={m}>{m}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </div>
                    <h2 className="analysis-title" style={{ fontSize: "24px", padding: 0}}>Análisis de Ventas y Finanzas</h2>
                </section>
                <section className="kpis" style={{ display: "flex", flexDirection: "row", backgroundColor: "#eee", width: "100%", justifyContent: "space-evenly" }}>
                    <div style={{ width: "220px",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "120px", margin: "20px 10px", backgroundColor: "#fff", borderRadius: "4px", boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <h5 style={{paddingTop: "20px", margin: 0}}>Inversión {monthsBalance[month ? month - 1 : currentMonth]} {year ? year : currentYear}</h5>
                        <h1>$ {formatNumber(investment)}</h1>
                    </div>
                    <div style={{ width: "220px",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "120px", margin: "20px 10px", backgroundColor: "#fff", borderRadius: "4px", boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <h5 style={{paddingTop: "20px", margin: 0}}>Ganancias {monthsBalance[month ? month - 1 : currentMonth]} {year ? year : currentYear}</h5>
                        <h1>$ {formatNumber(income)}</h1>
                    </div>
                    <div style={{ width: "220px",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "120px", margin: "20px 10px", backgroundColor: "#fff", borderRadius: "4px", boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <h5 style={{paddingTop: "20px", margin: 0}}>Balance {monthsBalance[month ? month - 1 : currentMonth]} {year ? year : currentYear}</h5>
                        <h1>$ {formatNumber(income - investment)}</h1>
                    </div>
                </section>
                <section className="graphs" style={{ display: "flex", flexDirection: "row", backgroundColor: "#eee", width: "100%", justifyContent: "space-evenly" }}>
                    <div style={{width: "620px", height: "310px", backgroundColor: "#fff", margin: "20px 10px",  borderRadius: "4px", transition: "box-shadow 0.2s ease", boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)"}}>
                        <Bar data={salesProductdata} options={salesProductOptions}/>
                    </div>
                    <div style={{width: "620px", height: "310px", backgroundColor: "#fff", margin: "20px 10px", borderRadius: "4px", transition: "box-shadow 0.2s ease", boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)"}}>
                        <Line data={annualBalancedata} options={annualBalanceOptions}/>
                    </div>
                </section>
                {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
            
            </div>
        </>
    )
}

export default Analysis;