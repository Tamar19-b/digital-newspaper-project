import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './log-in.css';
import logo from '../../assets/logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Redux
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userSlice';

const LoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, 'שם המשתמש חייב להכיל לפחות 2 תווים')
      .required('יש להזין שם משתמש'),
    email: Yup.string()
      .email('פורמט אימייל לא תקין')
      .required('יש להזין אימייל'),
    password: Yup.string()
      .required('יש להזין סיסמה'),
  });

  const handleLogin = async (values: any, { setSubmitting, setFieldError }: any) => {
    try {
      const { username, email, password } = values;
      const encodedEmail = encodeURIComponent(email);

      // בדיקת משתמש רגיל
      const userRes = await fetch(`http://localhost:8080/users/getByEmail/${encodedEmail}`);
      if (userRes.ok) {
        const user = await userRes.json();

        if (user) {
          if (user.password !== password) {
            setFieldError('password', 'סיסמה שגויה');
            return;
          }
          if (user.name !== username) {
            setFieldError('username', 'שם המשתמש אינו תואם לרשום במערכת');
            return;
          }

          const currentUser = { id: user.id, name: user.name, email: user.email, image: user.image , token: user.token };
          dispatch(login(currentUser));

          navigate(`/newspaper/${user.token}`);
          return;
        }
      }

      // בדיקת כתב
      const reporterRes = await fetch(`http://localhost:8080/Reporters/getByEmail/${encodedEmail}`);
      if (reporterRes.ok) {
        const reporter = await reporterRes.json();
        if (reporter.password !== password) {
          setFieldError('password', 'סיסמה שגויה');
          return;
        }
        if (reporter.name !== username) {
          setFieldError('username', 'שם המשתמש אינו תואם לרשום במערכת');
          return;
        }


        localStorage.setItem('reporterId', String(reporter.id));
        localStorage.setItem('reporterName', reporter.name);
        localStorage.setItem('reporterEmail', reporter.email);
        localStorage.setItem('propilReporter', reporter.propil || '');

  const currentUser = { id: reporter.id, name: reporter.name, email: reporter.email, image: reporter.image, token: reporter.token };
  dispatch(login(currentUser));

  navigate(`/reporterHome/${reporter.email}`);
  return;
      }

      // בדיקת עורך
      const editorRes = await fetch(`http://localhost:8080/Editors/getByEmail/${encodedEmail}`);
      if (editorRes.ok) {
        const editor = await editorRes.json();
        if (editor.password !== password) {
          setFieldError('password', 'סיסמה שגויה');
          return;
        }
        if (editor.name !== username) {
          setFieldError('username', 'שם המשתמש אינו תואם לרשום במערכת');
          return;
        }

  const currentUser = { id: editor.id, name: editor.name, email: editor.email, image: editor.image, token: editor.token };
  dispatch(login(currentUser));

  navigate(`/editorHome/${editor.email}`);
  return;
      }

      setFieldError('email', 'המשתמש לא נמצא');
    } catch (error) {
      setFieldError('email', 'שגיאת שרת');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="sparkle-layer">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <div className="contact-info">
          <div className="contact-item">
            <i className="bi bi-telephone-fill icon"></i> +123-456-7890
          </div>
          <div className="contact-item">
            <i className="bi bi-globe icon"></i> digitalmegazin.com
          </div>
        </div>
      </div>

      <div className="login-right">
        <h2 className="welcome-text">WELCOME BACK</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <label>שם משתמש</label>
              <Field type="text" name="username" placeholder="הכנס שם משתמש" />
              <ErrorMessage name="username" component="div" className="error-message" />

              <label>אימייל</label>
              <Field type="text" name="email" placeholder="הכנס אימייל" />
              <ErrorMessage name="email" component="div" className="error-message" />

              <label>סיסמא</label>
              <Field type="password" name="password" placeholder="הכנס סיסמא" />
              <ErrorMessage name="password" component="div" className="error-message" />

              <div className="options">
                <span>שכחת סיסמה?</span>
                <span>זכור אותי</span>
              </div>

              <button type="submit" disabled={isSubmitting}>התחברות</button>

              <p className="register-link">
                משתמש חדש? <span style={{ cursor: 'pointer', color: '#007bff' }} onClick={() => navigate('/signup')}>להרשמה</span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginComponent;
