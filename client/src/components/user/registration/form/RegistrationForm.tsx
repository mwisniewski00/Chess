import "./RegistrationForm.scss";
import { Formik, Form } from "formik";
import { CustomInput } from "components/shared/custom-input/CustomInput";
import registrationSchema from "../validation-schema/validation";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Messages } from "../Registration";
import axios from "api/axios";
import useAuth from "hooks/useAuth";
import { Status } from "components/shared/status-info/StatusInfo";

interface RegistrationFormProps {
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  setMessage: React.Dispatch<React.SetStateAction<Messages>>;
  message: Messages;
}

interface Values {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  setStatus,
  message,
  setMessage,
}) => {
  const { setAuth } = useAuth();

  const handleRegistration = async (values: Values) => {
    setMessage({ ...message, pending: "Please wait..." });
    setStatus("pending");
    try {
      const response = await axios.post("/users/register", values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setMessage({ ...message, resolved: "Registration successful!" });
      setStatus("resolved");

      setTimeout(() => {
        //set auth with trigger rerender
        setAuth({
          token: response.data.token,
          ...response.data.userInfo,
        });
      }, 2000);
    } catch (error) {
      setMessage({ ...message, rejected: "Something went wrong..." });
      setStatus("rejected");
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={(values: Values) => {
        handleRegistration(values);
      }}
      validationSchema={registrationSchema}
    >
      {formik => (
        <Form className="form">
          <div className="inputs">
            <CustomInput
              icon={PersonIcon}
              type="text"
              name="username"
              placeholder="Enter Username"
            />
            <CustomInput
              icon={EmailIcon}
              type="email"
              name="email"
              placeholder="Enter Email"
            />
            <CustomInput
              icon={LockIcon}
              type="password"
              name="password"
              placeholder="Enter Password"
            />
            <CustomInput
              icon={LockIcon}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
            />
          </div>
          <button
            disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            type="submit"
          >
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
};
