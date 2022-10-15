import { useField } from "formik";
import "./CustomInput.scss";

interface CustomInputProps {
  type: string;
  name: string;
  placeholder: string;
  icon: any;
}

export const CustomInput: React.FC<CustomInputProps> = ({ icon: Icon, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="custom-input">
      <div className="input-container">
        <input
          {...field}
          {...props}
          className={meta.touched && meta.error ? "input-error" : ""}
        />
        <Icon className="icon" />
      </div>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </div>
  );
};
