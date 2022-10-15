import * as yup from 'yup';

const registrationSchema = yup.object().shape({
    username: yup.string().min(3, 'Username must contain at least 3 characters').required('Username is required'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Password must contain at least 8 characters, one uppercase, one lowercase and one number').required('Password is required'),
});

export default registrationSchema;