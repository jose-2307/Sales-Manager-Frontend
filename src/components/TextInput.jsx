import { useField } from "formik";
import "./styles/TextInput.css";

const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props); //Obtenemos los campos field (contiene todos los valores asociados al campo) y meta (contiene los errores)
    return (
        <div>
            <label className="label">{label}</label>
            <input className="input" {...field} {...props} />
            {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
        </div>
        
    )
}

export default TextInput;