import { useField } from "formik";

const Select = ({ label, ...props }) => {
    const [field] = useField(props);
    return (
        <div>
            <label>{label}</label>
            <select {...field} {...props} />
        </div>
    )
}

export default Select