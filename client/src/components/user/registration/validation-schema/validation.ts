import * as yup from "yup";
import axios from "api/axios";

interface IPreviousUsername {
  username: string | undefined;
  isValid: boolean;
}

const previousUsername: IPreviousUsername = {
  username: "",
  isValid: true,
};

interface IPreviousEmail {
  email: string | undefined;
  isValid: boolean;
}

const previousEmail: IPreviousEmail = {
  email: "",
  isValid: true,
};

const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must contain at least 3 characters")
    .required("Username is required")
    .test("unique-username", "Username is already taken", async username => {
      if (username && username !== previousUsername.username) {
        try {
          await axios.get(`/users/username-taken`, {
            params: { username },
          });

          previousUsername.username = username;
          previousUsername.isValid = true;
          return true;
        } catch (error) {
          previousUsername.username = username;
          previousUsername.isValid = false;
          return false;
        }
      }
      if (previousUsername.isValid) {
        return true;
      } else {
        return false;
      }
    }),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required")
    .test("unique-email", "Email is already taken", async email => {
      if (email && email !== previousEmail.email) {
        try {
          await axios.get(`/users/email-taken`, {
            params: { email },
          });

          previousEmail.email = email;
          previousEmail.isValid = true;
          return true;
        } catch (error) {
          previousEmail.email = email;
          previousEmail.isValid = false;
          return false;
        }
      }
      if (previousEmail.isValid) {
        return true;
      } else {
        return false;
      }
    }),
  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase and one number",
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default registrationSchema;
