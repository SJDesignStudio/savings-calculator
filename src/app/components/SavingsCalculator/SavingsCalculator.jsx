"use client";

import styles from "./SavingsCalculator.module.scss";
import Calculator from "./Calculator";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRef } from "react";

export default function SavingsCalculator() {
  const userData = useRef({});
  const resultRef = useRef(null);
  const theme = createTheme({ palette: { primary: { main: "#a50034" } } });

  function sendDataHandler() {
    const body = new FormData();

    /** Handraiser Fields */
    body.append("opt_in", userData.current?.["opt_in"]);
    body.append("email_addr", userData.current?.["email_addr"]);
    body.append("interested_in", userData.current?.["interested_in"]);
    /** Calculator Fields */
    body.append("postal_code", userData.current?.["postal_code"]);
    body.append("household_income", userData.current?.["household_income"]);
    body.append("rent_own", userData.current?.["rent_own"]);
    body.append("tax_filing", userData.current?.["tax_filing"]);
    body.append("household_size", userData.current?.["household_size"]);

    fetch("https://www.lg.com/us/mylg/api/handraiser", {
      method: "POST",
      body,
    }).catch((_) => null);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.wrapper}>
        <Calculator resultRef={resultRef} userData={userData} />
        <div className={styles["results"]} ref={resultRef} />
      </div>
    </ThemeProvider>
  );
}
