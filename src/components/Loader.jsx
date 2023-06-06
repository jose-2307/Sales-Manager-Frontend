import { Momentum } from "@uiball/loaders";
import { LeapFrog } from '@uiball/loaders'
import { ChaoticOrbit } from '@uiball/loaders'
import { DotPulse } from '@uiball/loaders'




const Loader = () => {
    return (
        <div style={{position: "fixed", top:"0", left: "0", width:"100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999}}>
            <div style={{position: "fixed", top:"50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10000, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                {/* <Momentum size={50} speed={1.1} color="white" /> */}
                {/* <LeapFrog size={50} speed={2.5} color="white" /> */}
                <ChaoticOrbit size={35} speed={1.5} color="white" />
                {/* <DotPulse size={50} speed={1.4} color="white" /> */}
                <p style={{color: "white"}}>Cargando...</p>
            </div>
        </div>
        
    )
}

export default Loader;