import styles from "./Calculator.module.scss";
import Script from "next/script";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";


export default function Calculator({ resultRef, userData }) {
  /**
   *      Constants
   */
  const formKeys = useMemo(
    () => ({
      OWNER_STATUS: "rent_own",
      ZIP_CODE: "postal_code",
      HOUSEHOLD_INCOME: "household_income",
      TAX_FILING: "tax_filing",
      HOUSEHOLD_SIZE: "household_size",
    }),
    []
  );

  const emptyForm = useMemo(
    () => ({
      [formKeys.ZIP_CODE]: "",
      [formKeys.HOUSEHOLD_INCOME]: "",
      [formKeys.OWNER_STATUS]: "homeowner",
      [formKeys.TAX_FILING]: "single",
      [formKeys.HOUSEHOLD_SIZE]: "1",
    }),
    [formKeys]
  );

  const emptyValidForm = useMemo(
    () => ({
      [formKeys.ZIP_CODE]: true,
      [formKeys.HOUSEHOLD_INCOME]: true,
      [formKeys.OWNER_STATUS]: true,
      [formKeys.TAX_FILING]: true,
      [formKeys.HOUSEHOLD_SIZE]: true,
    }),
    [formKeys]
  );

  /**
   *      State
   */
  const [form, setForm] = useState(emptyForm);
  const [validForm, setValidForm] = useState(emptyValidForm);
  const calculationResultRef = useRef(null);

  /**
   *      Helpers
   */
  function validateKey(key, boolean) {
    setValidForm((prev) => ({ ...prev, [key]: boolean }));
    return boolean;
  }

  function isNumerical(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  function validateForm() {
    let isValid = true;

    /** Zip Code */
    isValid = validateKey(
      formKeys.ZIP_CODE,
      form[formKeys.ZIP_CODE]?.length === 5 &&
        isNumerical(form[formKeys.ZIP_CODE])
    );
    /** Owner Status */
    isValid = validateKey(
      formKeys.OWNER_STATUS,
      form[formKeys.OWNER_STATUS] &&
        ["homeowner", "renter"].includes(form[formKeys.OWNER_STATUS])
    );
    /** Household Income */
    isValid = validateKey(
      formKeys.HOUSEHOLD_INCOME,
      form[formKeys.HOUSEHOLD_INCOME]?.length <= 9 &&
        isNumerical(form[formKeys.HOUSEHOLD_INCOME])
    );
    /** Tax Filing */
    isValid = validateKey(
      formKeys.OWNER_STATUS,
      form[formKeys.TAX_FILING] &&
        ["single", "joint", "hoh", "married_filing_separately"].includes(
          form[formKeys.TAX_FILING]
        )
    );
    /** Household Size */
    isValid = validateKey(
      formKeys.HOUSEHOLD_SIZE,
      form[formKeys.HOUSEHOLD_SIZE] &&
        isNumerical(form[formKeys.HOUSEHOLD_SIZE]) &&
        parseInt(form[formKeys.HOUSEHOLD_SIZE]) <= 8 &&
        parseInt(form[formKeys.HOUSEHOLD_SIZE]) >= 1
    );

    return isValid;
  }

  /**
   *      Handlers
   */
  function changeHandler(evt) {
    setForm((prev) => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });
  }

  function clearFormHandler(evt) {
    evt.preventDefault();

    setValidForm(emptyValidForm);
    setForm(emptyForm);
    resultRef.current.innerHTML = "";
  }

  // prettier-ignore
  function submitHandler(evt) {
    evt.preventDefault();

    if (!validateForm()) return
    if (!resultRef?.current) return

    /** Instantiate embed elememnt and insert it into result ref */
    const el = document.createElement("rewiring-america-calculator");
    el.setAttribute("hide-form", "");
    el.setAttribute("api-key", process.env.NEXT_PUBLIC_CALCULATOR_API_KEY);
    el.setAttribute("zip", form[formKeys.ZIP_CODE]);
    el.setAttribute("household-income", form[formKeys.HOUSEHOLD_INCOME]);
    el.setAttribute("household-size", form[formKeys.HOUSEHOLD_SIZE]);
    el.setAttribute("tax-filing", form[formKeys.TAX_FILING]);
    el.setAttribute("homeowner-status", form[formKeys.RENT_OR_OWN]);
    if (resultRef?.current) {
      resultRef.current.innerHTML = "";
      resultRef.current.appendChild(el);
    }

    /** Propagate calculator data to parent scope to be sent with email signup. */
    userData.current = {...userData.current, ...form}
  }

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["calculator-wrapper"]}>
        <div className={styles["calculator"]}>
          <Script src="https://embed.rewiringamerica.org/calculator.js" />
          <a
            rel="stylesheet"
            type="text/css"
            href="https://embed.rewiringamerica.org/rewiring-fonts.css"
          />
          <form onSubmit={submitHandler}>
            <div className={styles.header}>
              <div>
                <h2>IRA Savings Calculator</h2>
                <p>
                  Enter your household information to calculate potential
                  savings.
                </p>
              </div>

              <div>
                <button
                  onClick={clearFormHandler}
                  className={`${styles["mobile-hide"]} ${styles["reset-btn"]}`}
                >
                  reset calculator
                </button>
              </div>
            </div>
            <div className={styles["row-container"]}>
              <div className={styles["row"]}>
                <div data-small="true" className={styles["row-item"]}>
                  <TextField
                    onChange={changeHandler}
                    name={formKeys.ZIP_CODE}
                    value={formKeys.value}
                    label="Zip Code"
                    sx={{ width: "100%" }}
                    className={styles.root}
                    error={!validForm[formKeys.ZIP_CODE]}
                  />
                </div>
                <div className={styles["row-item"]}>
                  <FormControl fullWidth>
                    <InputLabel>Rent or Own</InputLabel>
                    <Select
                      sx={{ height: "60px" }}
                      onChange={changeHandler}
                      name={formKeys.OWNER_STATUS}
                      value={form[formKeys.OWNER_STATUS]}
                      label="Rent Or Own"
                      error={!validForm[formKeys.OWNER_STATUS]}
                    >
                      <MenuItem value="homeowner">Homeowner</MenuItem>
                      <MenuItem value="renter">Renter</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={styles["row-item"]}>
                  <TextField
                    type="number"
                    onChange={changeHandler}
                    name={formKeys.HOUSEHOLD_INCOME}
                    value={form[formKeys.HOUSEHOLD_INCOME]}
                    className={styles.input}
                    label="Household Income"
                    sx={{ width: "100%" }}
                    error={!validForm[formKeys.HOUSEHOLD_INCOME]}
                  />
                </div>
              </div>
              <div className={`${styles["row"]} ${styles["second"]}`}>
                <div className={styles["row-item"]}>
                  <FormControl fullWidth>
                    <InputLabel>Tax Filing</InputLabel>
                    <Select
                      onChange={changeHandler}
                      name={formKeys.TAX_FILING}
                      value={form[formKeys.TAX_FILING]}
                      className={styles.select}
                      label="Tax Filing"
                      sx={{ height: "60px" }}
                      error={!validForm[formKeys.TAX_FILING]}
                    >
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="joint">Married filing jointly</MenuItem>
                      <MenuItem value="married_filing_separately">
                        Married filing separately
                      </MenuItem>
                      <MenuItem value="hoh">Head of household</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={styles["row-item"]}>
                  <FormControl fullWidth>
                    <InputLabel>Household Size</InputLabel>
                    <Select
                      onChange={changeHandler}
                      name={formKeys.HOUSEHOLD_SIZE}
                      value={form[formKeys.HOUSEHOLD_SIZE]}
                      className={styles.select}
                      label="Household Size"
                      sx={{ height: "60px" }}
                      error={!validForm[formKeys.HOUSEHOLD_SIZE]}
                    >
                      <MenuItem value="1">1 Person</MenuItem>
                      {Array.from({ length: 7 }).map((_, idx) => {
                        const val = idx + 2;
                        return (
                          <MenuItem value={val} key={`SIZE_${idx + 2}`}>
                            {val} People
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className={styles["row-item"]}>
                  <div className={`cta ${styles["cta"]}`}>
                    <a className="newbtn" href="#" onClick={submitHandler}>
                      CALCULATE
                    </a>
                  </div>
                </div>
              </div>
              <div className={`${styles.row} ${styles["mobile-show"]}`}>
                <div className={styles["row-item"]}>
                  <button
                    onClick={clearFormHandler}
                    className={` ${styles["reset-btn"]}`}
                  >
                    reset calculator
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div ref={calculationResultRef} />
        </div>
      </div>
    </div>
  );
}
