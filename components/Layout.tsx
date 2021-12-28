import React from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  desc ?: string;
  withFooter ?: boolean;
}

function Layout(props: LayoutProps) {
  return (
    <>
      <Header title={props.title} desc={props.desc} />
      {props.children}
      <Footer />
    </>
  );
}

export default Layout;
