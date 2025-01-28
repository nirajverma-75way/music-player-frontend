/**
 * Authentication Component that handles user login, registration, forgot password, and reset password functionality.
 * 
 * The component uses React Hook Form and Yup for form validation, Material UI for UI components, and Framer Motion for animations.
 * 
 * @component
 * @example
 * // Usage
 * <Authenticate />
 */

import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { useCreateUserMutation, useForgotPasswordMutation, useLoginUserMutation, useResetPasswordMutation } from "../../services/user.api";
import { toast } from "react-toastify";
import { setTokens } from "../../store/reducers/authReducer";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

// Validation schemas
/**
 * Login schema validation using Yup
 */
const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

/**
 * Registration schema validation using Yup
 */
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

/**
 * Forgot password schema validation using Yup
 */
const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

/**
 * Reset password schema validation using Yup
 */
const resetPasswordSchema = yup.object({
  code: yup.string().min(6, "code must be at least 6 characters"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

// Form Input Component
/**
 * Form Input Component for rendering input fields with validation
 * 
 * @param {Object} props - The component props
 * @param {string} props.name - The name of the input field
 * @param {string} props.label - The label of the input field
 * @param {string} [props.type="text"] - The input type (text, password, etc.)
 * @param {Object} props.control - The control object from react-hook-form
 * @param {Object} props.errors - Validation errors from react-hook-form
 * 
 * @returns {React.Element} The FormInput component
 */
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

// Animation Variants
/**
 * Animation variants for form transitions using Framer Motion
 */
const formVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

/**
 * Button animation variants for hover and tap effects using Framer Motion
 */
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Authentication component
/**
 * Main authentication component handling login, registration, password reset, and more.
 * 
 * @returns {React.Element} The Authenticate component
 */
const Authenticate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token: string = searchParams.get("token")?.toString() || "";
  const [formType, setFormType] = useState<"login" | "register" | "forgotPassword" | "resetPassword">(token !== "" ? "resetPassword" : "login");
  const [loginUser] = useLoginUserMutation();
  const [createUser] = useCreateUserMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const schema =
    formType === "login"
      ? loginSchema
      : formType === "register"
      ? registerSchema 
      : formType === "forgotPassword" 
      ? forgotPasswordSchema 
      : resetPasswordSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /**
   * Submit handler for forms. Depending on the form type, it triggers appropriate API actions.
   * 
   * @param {Object} data - The form data
   */
  const onSubmit = async (data: any) => {
    if (formType === "login") {
      try {
        const response: IResponse = await loginUser(data).unwrap();
        if (response.success) {
          toast.success(response.message);
          dispatch(setTokens(response.data));
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/songs");
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
        const response: IResponse = await forgotPassword(data).unwrap();
        if (response.success) {
          toast.success(response.message);
          setFormType("resetPassword");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Failed to reset password. Please try again.");
      }
    }
    if (formType === "resetPassword") {
      try {
        
        const response: IResponse = await resetPassword({...data, token}).unwrap();
        if (response.success) {
          toast.success(response.message);
          if(response.data)
            setFormType("login");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Failed to reset password. Please try again.");
      }
    }
  };

  const formContent = {
    login: {
      header: "Login",
      form: (
        <>
          <FormInput name="email" label="Email Address" control={control} errors={errors} />
          <FormInput name="password" label="Password" type="password" control={control} errors={errors} />
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            style={{
              marginTop: 16,
              marginBottom: 16,
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#1976d2",
              color: "white",
              cursor: "pointer",
            }}
          >
            Login
          </motion.button>
          <Button fullWidth variant="text" onClick={() => setFormType("forgotPassword")}>
            Forget Password?
          </Button>
          <Button fullWidth variant="text" onClick={() => setFormType("register")}>
            Don't have an account? Register
          </Button>
        </>
      ),
    },
    register: {
      header: "Register",
      form: (
        <>
          <FormInput name="name" label="Full Name" control={control} errors={errors} />
          <FormInput name="username" label="Username" control={control} errors={errors} />
          <FormInput name="email" label="Email Address" control={control} errors={errors} />
          <FormInput name="password" label="Password" type="password" control={control} errors={errors} />
          <FormInput name="confirmPassword" label="Confirm Password" type="password" control={control} errors={errors} />
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            style={{
              marginTop: 16,
              marginBottom: 16,
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#1976d2",
              color: "white",
              cursor: "pointer",
            }}
          >
            Register
          </motion.button>
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
          <FormInput name="email" label="Email Address" control={control} errors={errors} />
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            style={{
              marginTop: 16,
              marginBottom: 16,
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#1976d2",
              color: "white",
              cursor: "pointer",
            }}
          >
            Send Code
          </motion.button>
          <Button fullWidth variant="text" onClick={() => setFormType("login")}>
            Back to Login
          </Button>
        </>
      ),
    },
    resetPassword: {
      header: "Reset Password",
      form: (
        <>
          <FormInput name="code" label="Code" control={control} errors={errors} />
          <FormInput name="password" label="Password" type="password" control={control} errors={errors} />
          <FormInput name="confirmPassword" label="Confirm Password" type="password" control={control} errors={errors} />
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            style={{
              marginTop: 16,
              marginBottom: 16,
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#1976d2",
              color: "white",
              cursor: "pointer",
            }}
          >
            Reset Password
          </motion.button>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={formType}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{ width: "100%", maxWidth: "400px" }}
            >
            <Typography component="h1" variant="h5">
              {formContent[formType].header}
            </Typography>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                {formContent[formType].form}
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Authenticate;
