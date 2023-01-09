import "./MessageInput.scss";
import { Field, Form, Formik } from "formik";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import SendIcon from "@mui/icons-material/Send";
import { useGameContext } from "components/game/GameProvider";

const MessageInput: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    game: { id },
  } = useGameContext();

  const handleSendMessage = async (
    values: { message: string },
    resetForm,
    setSubmitting,
  ) => {
    const message = values.message;
    if (message) {
      try {
        resetForm();
        await axiosPrivate.post(`/games/${id}/message`, { message });
        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setSubmitting(false);
    }
  };

  return (
    <div className="message-input-container">
      <Formik
        initialValues={{ message: "" }}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          handleSendMessage(values, resetForm, setSubmitting);
        }}
        enableReinitialize={true}
      >
        {formik => (
          <Form className="message-input-form">
            <Field
              placeholder="Enter your message..."
              className="message-input"
              type="text"
              name="message"
            />
            <button disabled={formik.isSubmitting} type="submit">
              <SendIcon className="message-icon" />
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MessageInput;
