import { AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import "./ErrorMessage.scss";

export default function ErrorMessage({ message }) {
  return (
    <main id="error-message">
      <Alert severity="error" className="error-alert">
        <AlertTitle>Oh no, something went wrong!</AlertTitle>
        {message}
      </Alert>
    </main>
  );
}
