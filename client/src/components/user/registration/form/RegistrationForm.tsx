import "./RegistrationForm.scss";
import { Formik, Form} from "formik";
import { CustomInput } from "components/shared/custom-input/CustomInput";
import registrationSchema from "../validation-schema/validation";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Status, Messages } from "../Registration";
import axios from "axios";

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

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ setStatus, message, setMessage }) => {
  const handleRegistration = async (values: Values) => {
    setMessage({...message, pending: "Please wait..."});
    setStatus("pending");
    console.log(values);
    try {
      const response = await axios.post("/users/register", values);
      console.log(response);
      setMessage({...message, resolved: "Registration successful!"});
      setStatus("resolved");
    }
    catch (error) {
      console.log(error);
      setMessage({...message, rejected: "Something went wrong..."});
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
      <Form className="form">
        <div className="inputs">
          <CustomInput
          icon={PersonIcon}
            type="text"
            name="username"
            placeholder="Enter Username"
          />
          <CustomInput icon={EmailIcon} type="email" name="email" placeholder="Enter Email" />
          <CustomInput icon={LockIcon}
            type="password"
            name="password"
            placeholder="Enter Password"
          />
          <CustomInput icon={LockIcon} type="password" name="confirmPassword" placeholder="Confirm Password" />
        </div>
        <button type="submit">Register</button>
      </Form>
    </Formik>
  );
};
