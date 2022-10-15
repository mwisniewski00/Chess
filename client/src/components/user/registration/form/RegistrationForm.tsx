import "./RegistrationForm.scss";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { CustomInput } from "components/shared/custom-input/CustomInput";
import registrationSchema from "../validation-schema/validation";

interface Values {
  username: string;
  email: string;
  password: string;
}

export const RegistrationForm: React.FC = () => {
  const handleRegistration = (values: Values) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
      }}
      onSubmit={(values: Values) => {
        handleRegistration(values);
      }}
      validationSchema={registrationSchema}
    >
      <Form>
        <div className="inputs">
          <CustomInput
            type="text"
            name="username"
            placeholder="Enter Username"
          />
          <CustomInput type="email" name="email" placeholder="Enter Email" />
          <CustomInput
            type="password"
            name="password"
            placeholder="Enter Password"
          />
        </div>
        <button type="submit">Register</button>
      </Form>
    </Formik>
  );
};
