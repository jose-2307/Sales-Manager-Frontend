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


    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchData = async () => {
            try {
                const salesProductData = await getSalesByProductBack();
                setSalesProduct(salesProductData);
                const investmentData = await getInvestmentBack();
                setInvestment(investmentData);
                const incomeData = await getIncomeBack();
                setIncome(incomeData);
                const annualBalanceData = await getAnnualBalanceBack();
                setAnnualBalance(annualBalanceData);

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
    

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const months = [
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
            text: 'Cantidad de Ventas por Producto',
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
                label: `${months[currentMonth]} ${currentYear}`,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: salesProduct.map(x => x.count),
            },
        ],
    };

    

    
    const annualBalancedata = {
        labels: annualBalance.map(x => x.name),
        datasets: [
            {
                label: `${currentYear}`,
                backgroundColor: 'rgb(53, 162, 235)',
                borderColor: 'rgb(53, 162, 235)',
                data: annualBalance.map(x => x.balance),
            },
        ],
    };


    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "90vh" }}>  
                <h2 className="analysis-title" style={{ fontSize: "26px", margin: 0}}>Análisis de Ventas</h2>
                <section className="kpis" style={{ display: "flex", flexDirection: "row"}}>
                    <div style={{ width: "220px",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "120px", margin: "20px 10px", backgroundColor: "#fff", borderRadius: "4px", boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <h5 style={{paddingTop: "20px", margin: 0}}>Inversión {months[currentMonth]} {currentYear}</h5>
                        <h1>$ {formatNumber(investment)}</h1>
                    </div>
                    <div style={{ width: "220px",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "120px", margin: "20px 10px", backgroundColor: "#fff", borderRadius: "4px", boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <h5 style={{paddingTop: "20px", margin: 0}}>Ganancias {months[currentMonth]} {currentYear}</h5>
                        <h1>$ {formatNumber(income)}</h1>
                    </div>
                    <div style={{ width: "220px",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "120px", margin: "20px 10px", backgroundColor: "#fff", borderRadius: "4px", boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <h5 style={{paddingTop: "20px", margin: 0}}>Balance {months[currentMonth]} {currentYear}</h5>
                        <h1>$ {formatNumber(income - investment)}</h1>
                    </div>
                </section>
                <section className="graphs" style={{ display: "flex", flexDirection: "row" }}>
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