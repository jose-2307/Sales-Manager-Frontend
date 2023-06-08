import { Button } from '@mui/material';
import { ChaoticOrbit } from '@uiball/loaders'

const styles = {
    containerAll: {
        position: "fixed", 
        top:"0", 
        left: "0", 
        width:"100%", 
        height: "100%", 
        backgroundColor: "rgba(0,0,0,0.5)", 
        zIndex: 9999,
    },
    container: {
        position: "fixed", 
        top:"50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        zIndex: 10000, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        flexDirection: "column", 
        border: "2px solid #000000bd", 
        backgroundColor: "rgb(243, 241, 241)",
        width: "210px",
        height: "120px",
        borderRadius: "8px",
    }, 
    loaderContainer: {
        marginTop: "14px",
    },
    errorContainer: {
        width: "100px",
        height: "320px",
        position: "fixed", 
        top:"50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
    },
    errorMessageContainer: {
        position: "fixed", 
        top:"50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        zIndex: 10000, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        flexDirection: "column", 
        border: "2px solid #000000bd", 
        backgroundColor: "rgb(243, 241, 241)",
        width: "360px",
        height: "220px",
        borderRadius: "8px",
    },
    errorMessage: {
        color: "rgb(64 64 64)",
        textAlign: "center"

    },
    errorImageContainer: {
        width: "100px",
        position: "relative",
        zIndex: 10002, 
    },
    errorImage: {
        width: "100%",
        height: "100%",
    },
    closeButton: {
        color: "#fff",
        width: "80%",
        backgroundColor: "#ff6f6f",
    },
    closeIcon: {
        cursor: "pointer",
        fontSize: "18px",
        position: "absolute",
        top: "1px",
        right: "10px",
        color: "#000",

    }
    
}


const Loader = ({ error="", closeErrorModal }) => {
    return (
        <div style={styles.containerAll}>
            {error === "" 
            ? (
                <div style={styles.container}>
                    <div style={styles.loaderContainer}>
                        <ChaoticOrbit size={35} speed={1.5} color="black"/>
                    </div>
                    <h5 style={{color: "black"}}>Cargando...</h5>
                </div>
            )
            : (
                <div style={styles.errorContainer}>
                    <section style={styles.errorImageContainer}> 
                        <img src="../../icons/error.png" style={styles.errorImage}></img>
                    </section>
                    <div style={styles.errorMessageContainer}>
                        <section>
                            <h2>¡Error!</h2>
                            <h5 style={styles.errorMessage}>{error}</h5>
                        </section>
                        <Button 
                        variant="contained" 
                        style={styles.closeButton}
                        onClick={closeErrorModal}
                        >
                            Cerrar
                        </Button>
                        <a style={styles.closeIcon} onClick={closeErrorModal}>x</a>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Loader;