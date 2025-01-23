import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useCreateUserMutation,
  useLoginUserMutation,
} from "../../services/user.api";
import { toast } from "react-toastify";
import { setTokens } from "../../store/reducers/authReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Validation schemas
const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const registerSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

// Form Input Component
const FormInput: React.FC<{
  name: string;
  label: string;
  type?: string;
  control: any;
  errors: any;
}> = ({ name, label, type = "text", control, errors }) => (
  <Controller
    name={name}
    control={control}
    defaultValue=""
    render={({ field }) => (
      <TextField
        {...field}
        margin="normal"
        fullWidth
        label={label}
        type={type}
        variant="outlined"
        error={!!errors[name]}
        helperText={errors[name]?.message}
      />
    )}
  />
);

// Authentication component
const Authenticate: React.FC = () => {
  const [formType, setFormType] = useState<
    "login" | "register" | "forgotPassword"
  >("login");
  const [loginUser] = useLoginUserMutation();
  const [createUser] = useCreateUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema =
    formType === "login"
      ? loginSchema
      : formType === "register"
      ? registerSchema
      : forgotPasswordSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (
    data: LoginFormInputs | RegisterFormInputs | ForgotPasswordFormInputs
  ) => {
    if (formType === "login") {
      try {
        const response: IResponse = await loginUser(data).unwrap();
        if (response.success) {
          toast.success(response.message);
          dispatch(setTokens(response.data));
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/post");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
      }
    }

    if (formType === "register") {
      try {
        const response: IResponse = await createUser(data).unwrap();
        if (response.success) {
          toast.success(response.message);
          setFormType("login");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Registration failed. Please try again.");
      }
    }
    if (formType === "forgotPassword") {
      try {
        const response: IResponse = await createUser(data).unwrap();
        if (response.success) {
          toast.success(response.message);
          setFormType("login");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const formContent = {
    login: {
      header: "Login",
      form: (
        <>
          <FormInput
            name="email"
            label="Email Address"
            control={control}
            errors={errors}
          />
          <FormInput
            name="password"
            label="Password"
            type="password"
            control={control}
            errors={errors}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          {/**<Link
            href="#"
            onClick={() => setFormType("forgotPassword")}
            variant="body2"
            sx={{ display: "block", textAlign: "center", mb: 2 }}
          >
            Forgot Password?
          </Link>*/}
          <Button
            fullWidth
            variant="text"
            onClick={() => setFormType("register")}
          >
            Don't have an account? Register
          </Button>
        </>
      ),
    },
    register: {
      header: "Register",
      form: (
        <>
          <FormInput
            name="name"
            label="Full Name"
            control={control}
            errors={errors}
          />
          <FormInput
            name="username"
            label="Username"
            control={control}
            errors={errors}
          />
          <FormInput
            name="email"
            label="Email Address"
            control={control}
            errors={errors}
          />
          <FormInput
            name="password"
            label="Password"
            type="password"
            control={control}
            errors={errors}
          />
          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            control={control}
            errors={errors}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Button fullWidth variant="text" onClick={() => setFormType("login")}>
            Already have an account? Login
          </Button>
        </>
      ),
    },
    forgotPassword: {
      header: "Forgot Password",
      form: (
        <>
          <FormInput
            name="email"
            label="Email Address"
            control={control}
            errors={errors}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>
          <Button fullWidth variant="text" onClick={() => setFormType("login")}>
            Back to Login
          </Button>
        </>
      ),
    },
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={12} md={6} sx={{ backgroundColor: "#f5f5f5" }}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "url(./poster.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {formContent[formType].header}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "100%", maxWidth: "400px" }}
          >
            {formContent[formType].form}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Authenticate;
