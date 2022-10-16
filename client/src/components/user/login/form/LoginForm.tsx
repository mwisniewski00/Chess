import './LoginForm.scss';
import { Formik, Form } from "formik";
import { CustomInput } from "components/shared/custom-input/CustomInput";
import loginSchema from "../validation-schema/validation";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

interface Values {
  username: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const handleLogin = (values: Values) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      onSubmit={(values: Values) => {
        handleLogin(values);
      }}
      validationSchema={loginSchema}
    >
      <Form className="form">
        <div className="inputs">
          <CustomInput
          icon={PersonIcon}
            type="text"
            name="username"
            placeholder="Enter Username"
          />
          <CustomInput icon={LockIcon}
            type="password"
            name="password"
            placeholder="Enter Password"
          />
        </div>
        <button type="submit">Login</button>
      </Form>
    </Formik>
  );
};