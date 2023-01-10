import { useField } from "formik";
import "./TextareaInput.scss";

interface TextareaInputProps {
  name: string;
  placeholder: string;
  icon: any;
}

export const TextareaInput: React.FC<TextareaInputProps> = ({
  icon: Icon,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <div className="textarea-input">
      <div className="textarea-title">
        <Icon className="icon" />
        {props.name}
      </div>

      <div className="textarea-container">
        <textarea
          {...field}
          {...props}
          className={
            meta.touched && meta.error
              ? "textarea-error"
              : meta.touched
              ? "textarea-correct"
              : ""
          }
        />
      </div>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </div>
  );
};
