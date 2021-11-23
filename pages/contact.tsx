import Header from "@components/Header";
import Separator from "@components/UI/Separator";
import React from "react";
import styled from "styled-components";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";

function Contact() {
    const { t, i18n } = useTranslation();
  return (
    <div>
      <Header title="Contact" desc="Contact page "></Header>
      <Layout>
        <Separator></Separator>
        <h1>{t("contact.title")}</h1>
        <p>{t("contact.description")}</p>
        <Separator></Separator>
        <Formik
          initialValues={{ name: "", email: "", message: "" }}
          validate={(values) => {
            const errors: any = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = "Invalid email address";
            } else if (!values.message) {
              errors.email = "Required";
            } else if (!values.name) {
              errors.name = "Required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <InputLabel>{t("contact.values.name")} </InputLabel>
              <InputField type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
              <InputWarning>{errors.name && touched.name && errors.name}</InputWarning>
              <InputLabel>{t("contact.values.email")}</InputLabel>
              <InputField type="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
              <InputWarning>{errors.email && touched.email && errors.email}</InputWarning>
              <InputLabel>{t("contact.values.message")} </InputLabel>
              <TextField name="message" onChange={handleChange} onBlur={handleBlur} value={values.message} />
              <InputWarning>{errors.message && touched.message && errors.message}</InputWarning>

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
          )}
        </Formik>
      </Layout>
    </div>
  );
}

export default Contact;

/**
 * Styling
 * CSS with Styled Components
 * https://styled-components.com/docs
 */

const Layout = styled.div`
  padding-left: 40px;
  padding-right: 40px;
`;

const InputField = styled.input`
  padding: 10px;
  background-color: #e1e9ed;
  border: none;
  width: 100%;
  display: block;
  border-radius: 3px;
`;

const TextField = styled.textarea`
  padding: 10px;
  background-color: #e1e9ed;
  border: none;
  width: 100%;
  display: block;
  border-radius: 3px;
  margin-bottom: 3px;
`;

const InputLabel = styled.h3`
  padding-top: 4px;
  padding-bottom: 2px;
`;

const InputWarning = styled.p`
  color: #ff000086 ;
  border-radius: 3px;
  padding: 2px;
  display: block;
  padding-top: 5px;
  margin: inherit;
`;
