import "./LoginForm.scss";
import { Formik, Form } from "formik";
import { CustomInput } from "components/shared/custom-input/CustomInput";
import loginSchema from "../validation-schema/validation";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { Status, Messages } from "../Login";
import axios from "axios";
import useAuth from "hooks/useAuth";

interface LoginFormProps {
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  setMessage: React.Dispatch<React.SetStateAction<Messages>>;
  message: Messages;
}

interface Values {
  username: string;
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
      const response = await axios.post("/users/login", values);
      console.log(response);

      setAuth({
        token: response.data.token,
        username: response.data.username,
        email: response.data.email,
      });

      setMessage({ ...message, resolved: "Logged in successfully!" });
      setStatus("resolved");
    } catch (error: any) {
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
          <CustomInput
            icon={LockIcon}
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
