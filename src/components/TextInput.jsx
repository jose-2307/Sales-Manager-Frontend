import { useField } from "formik";
import "./styles/TextInput.css";
import { Input, InputAdornment, InputLabel } from "@mui/material";

const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props); //Obtenemos los campos field (contiene todos los valores asociados al campo) y meta (contiene los errores)
    return (
        <div>
            <InputLabel htmlFor="standard-adornment-amount">{label}</InputLabel>
            {/* <label className="label">{label}</label> */}
            <Input
                id="standard-adornment-amount"
                {...field} {...props}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
            {/* <input className="input" {...field} {...props} /> */}
            {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
        </div>
        
    )
}

export default TextInput;