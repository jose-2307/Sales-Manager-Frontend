import { useField } from "formik";
import "./styles/TextInput.css";
import { InputAdornment, TextField } from "@mui/material";

const TextInput = ({ label, adornment, id, dimesions, ...props }) => {
    const [field, meta] = useField(props); //Obtenemos los campos field (contiene todos los valores asociados al campo) y meta (contiene los errores)
    return (
        <div>
            <TextField
                error={meta.touched && meta.error ? true : false}
                label={label}
                id={id}
                sx={dimesions ? dimesions : { m: 1, width: "30ch" }}
                InputProps={{
                    startAdornment: adornment ? <InputAdornment position="start">{adornment}</InputAdornment> : null , ...field, ...props
                }}
                variant="standard"
                helperText={meta.touched && meta.error ? `Error: ${meta.error}` : null}
            />
        </div>
        
    )
}

export default TextInput;