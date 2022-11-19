import "./LoginForm.scss";
import { Formik, Form } from "formik";
import { CustomInput } from "components/shared/custom-input/CustomInput";
import loginSchema from "../validation-schema/validation";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Status, Messages } from "../Login";
import useAuth from "hooks/useAuth";
import axios from "api/axios";

interface LoginFormProps {
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  setMessage: React.Dispatch<React.SetStateAction<Messages>>;
  message: Messages;
}

interface Values {
  email: string;
  password: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  setStatus,
  setMessage,
  message,
}) => {
  const { setAuth } = useAuth();

  const handleLogin = async (values: Values) => {
    setMessage({ ...message, pending: "Logging in..." });
    setStatus("pending");
    try {
      const response = await axios.post("/users/login", values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setMessage({ ...message, resolved: "Logged in successfully!" });
      setStatus("resolved");

      setTimeout(() => {
        //set auth with trigger rerender
        setAuth({
          token: response.data.token,
          ...response.data.userInfo,
        });
      }, 2000);
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 401) {
        setMessage({ ...message, rejected: "Invalid user data" });
        setStatus("rejected");
        return;
      }
      setMessage({ ...message, rejected: "Something went wrong..." });
      setStatus("rejected");
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values: Values) => {
        handleLogin(values);
      }}
      validationSchema={loginSchema}
    >
      {formik => (
        <Form className="form">
          <div className="inputs">
            <CustomInput
              icon={EmailIcon}
              type="text"
              name="email"
              placeholder="Enter Email"
            />
            <CustomInput
              icon={LockIcon}
              type="password"
              name="password"
              placeholder="Enter Password"
            />
          </div>
          <button
            disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            type="submit"
          >
            Login
          </button>
        </Form>
      )}
    </Formik>
  );
};
