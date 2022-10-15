import { useField } from "formik";
import "./CustomInput.scss";

interface CustomInputProps {
  type: string;
  name: string;
  placeholder: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="custom-input">
      <input
        {...field}
        {...props}
        className={meta.touched && meta.error ? "input-error" : ""}
      />
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </div>
  );
};
