import "./RegistrationForm.scss";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { CustomInput } from "components/shared/custom-input/CustomInput";
import registrationSchema from "../validation-schema/validation";
import PersonIcon from '@mui/icons-material/Person';

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
      <Form className="form">
        <div className="inputs">
          <CustomInput
          icon={PersonIcon}
            type="text"
            name="username"
            placeholder="Enter Username"
          />
          <CustomInput icon={PersonIcon} type="email" name="email" placeholder="Enter Email" />
          <CustomInput icon={PersonIcon}
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
