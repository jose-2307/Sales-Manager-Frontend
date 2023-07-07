import { InputLabel, NativeSelect, Select } from "@mui/material";
import { useField } from "formik";

const SelectInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div style={{ paddingTop: "7px" }}>
        <InputLabel
            variant="standard"
            htmlFor="uncontrolled-native"
            style={{ fontSize: "12px" }}
            error={meta.touched && meta.error ? true : false}
        >
            {label}
        </InputLabel>
        <NativeSelect
            error={meta.touched && meta.error ? true : false}
            {...field}
            {...props}
            // helperText={meta.touched && meta.error ? `Error: ${meta.error}` : null}
        ></NativeSelect>
    </div>
  );
};

export default SelectInput;
