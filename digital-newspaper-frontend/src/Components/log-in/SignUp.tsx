import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './log-in.css';

const SignUp: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    image: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(2, 'השם קצר מדי').required('יש להזין שם'),
    email: Yup.string().email('אימייל לא תקין').required('יש להזין אימייל'),
    password: Yup.string()
      .min(8, 'סיסמה חייבת להיות לפחות 8 תווים')
      .matches(/[A-Z]/, 'סיסמה חייבת לכלול אות גדולה')
      .matches(/[a-z]/, 'סיסמה חייבת לכלול אות קטנה')
      .matches(/[0-9]/, 'סיסמה חייבת לכלול מספר')
      .matches(/[^A-Za-z0-9]/, 'סיסמה חייבת לכלול תו מיוחד') 
      .required('יש להזין סיסמה'),
    image: Yup.string().url('יש להזין כתובת תמונה תקינה').nullable(),
  });

  const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
    try {
      const res = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setFieldError('email', 'אימייל כבר קיים או שגיאה בשרת');
      }
    } catch {
      setFieldError('email', 'שגיאת שרת');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-right">
          <h2>ההרשמה הצליחה!</h2>
          <p>
            <span
              className="register-link"
              style={{ cursor: 'pointer', color: '#007bff' }}
              onClick={() => navigate('/log-in')}
            >
              לחץ כאן להתחברות
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-right">
        <h2 color='white'>הרשמה למשתמש חדש</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="login-form">
              <label>שם מלא</label>
              <Field type="text" name="name" placeholder="הכנס שם מלא" />
              <ErrorMessage name="name" component="div" className="error-message" />

              <label>אימייל</label>
              <Field type="text" name="email" placeholder="הכנס אימייל" />
              <ErrorMessage name="email" component="div" className="error-message" />

              <label>סיסמה</label>
              <Field type="password" name="password" placeholder="הכנס סיסמה חזקה" />
              <ErrorMessage name="password" component="div" className="error-message" />

              <label>תמונה (לא חובה)</label>
              <Field type="text" name="image" placeholder="קישור לתמונה (אופציונלי)" />
              <ErrorMessage name="image" component="div" className="error-message" />

              <button type="submit" disabled={isSubmitting}>הרשמה</button>
            </Form>
          )}
        </Formik>
        <p className="register-link">
          כבר רשום?{' '}
          <span style={{ cursor: 'pointer', color: '#007bff' }} onClick={() => navigate('/log-in')}>
            התחבר כאן
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
