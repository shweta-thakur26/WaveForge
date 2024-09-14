import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios, { AxiosError } from "axios";
import Output from "./Output";
import ButtonImg from "./button_img.png";

const App: React.FC = () => {
  const [progress1, setProgress1] = useState(0); // For first circular progress bar
  const [progress2, setProgress2] = useState(0); // For second circular progress bar
  const [imageOpacity1, setImageOpacity1] = useState(1.0);
  const [imageOpacity2, setImageOpacity2] = useState(1.0);
  const [inputText, setInputText] = useState<string>("ABCD123XYZ");
  const clickInterval = useRef<number | null>(null);
  const [apiLogs, setApiLogs] = useState<
    {
      method: string;
      url: string;
      statusCode?: number;
      payload?: any;
      response?: any;
      error?: any;
    }[]
  >([]);
  const pressInterval = useRef<number | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = "https://dummyapi.online/api/users/1";

  const handleFocus = () => {
    if (inputRef.current) {
      const input = inputRef.current;
      const length = input.value.length;
      const middle = Math.floor(length / 2);

      input.setSelectionRange(middle, middle);
    }
  };

  useEffect(() => {
    if (progress1 === 100) {
      callAPIbyTesting();
    }
  }, [progress1]);

  useEffect(() => {
    if (progress2 === 100) {
      callAPIbyProgressBar();
    }
  }, [progress2]);

  const logApiCall = (
    method: string,
    url: string,
    statusCode?: number,
    payload?: any,
    response?: any,
    error?: any
  ) => {
    const newLog = { method, url, statusCode, payload, response, error };
    setApiLogs((prevLogs) => [...prevLogs, newLog]);
  };

  const handleMouseDownClick = () => {
    if (!inputText) {
      let errorLog = {
        method: "",
        url: "",
        error: "Invalid serial number provided",
      };
      setApiLogs([errorLog]);
    } else {
      setProgress1(100);
      setImageOpacity1(0.5);
    }
  };

  const handleMouseUpClick = () => {
    if (inputText) {
      setProgress1(0);
      setImageOpacity1(1.0);
    }
  };

  const handleMouseDown = () => {
    if (!inputText) {
      let errorLog = {
        method: "",
        url: "",
        error: "Invalid serial number provided",
      };
      setApiLogs([errorLog]);
    } else {
      setProgress2(100);
      setImageOpacity2(0.5);
    }
  };

  const handleMouseUp = () => {
    if (inputText) {
      setProgress2(0);
      setImageOpacity2(1.0);
    }
  };

  const callAPIbyTesting = async () => {
    try {
      const formattedDateTime = getFormattedDateTime();
      const requestData = {
        identifier: inputText,
        event: "EB",
        status: "test",
        date_time: formattedDateTime,
        gps_coordinates: null,
      };

      logApiCall("POST", API_URL, 0, requestData, "Waiting for response...");
      const response = await axios.post(API_URL, requestData, {
        headers: {},
      });
      console.log(response);
      logApiCall("POST", API_URL, response.status, requestData, response.data);
    } catch (error: any) {
      const axiosError = error as AxiosError; // Cast error to AxiosError
      logApiCall(
        "POST",
        API_URL,
        axiosError.response?.status,
        axiosError.config?.data,
        axiosError.response?.data,
        axiosError.message
      );
    }
  };

  const callAPIbyProgressBar = async () => {
    try {
      const formattedDateTime = getFormattedDateTime();
      const requestData = {
        identifier: inputText,
        event: "EB",
        status: "active",
        date_time: formattedDateTime,
        gps_coordinates: null,
      };

      logApiCall("POST", API_URL, 0, requestData, "Waiting for response...");
      const response = await axios.post(API_URL, requestData, {
        headers: {},
      });
      console.log(response);
      logApiCall("POST", API_URL, response.status, requestData, response.data);
    } catch (error: any) {
      const axiosError = error as AxiosError; // Cast error to AxiosError
      logApiCall(
        "POST",
        API_URL,
        axiosError.response?.status,
        axiosError.config?.data,
        axiosError.response?.data,
        axiosError.message
      );
    }
  };

  const getFormattedDateTime = () => {
    const currentDate = new Date();
    const formattedDateTime = `${currentDate.getUTCFullYear()}-${padNumber(
      currentDate.getUTCMonth() + 1
    )}-${padNumber(currentDate.getUTCDate())}T${padNumber(
      currentDate.getUTCHours()
    )}:${padNumber(currentDate.getUTCMinutes())}:${padNumber(
      currentDate.getUTCSeconds()
    )}.0000000+00:00`;
    return formattedDateTime;
  };

  // Function to pad numbers with leading zeros
  const padNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9]*$/;
    const value = e.target.value;

    if (value.length <= 10 && regex.test(value)) {
      setInputText(value);
    }
  };

  const clearLogs = () => {
    setApiLogs([]);
  };

  return (
    <div className="EmergencyCall">
      <h1 className="text-center">Wearable Simulator</h1>
      <div className="row mb-4 justify-content-center" >
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Button Serial Number"
            value={inputText}
            onChange={handleInputChange}
            className="input-text form-control text-center"
            onFocus={handleFocus}
          
            maxLength={10}
            disabled={true}
          />
        </div>
      </div>
      <div className="row justify-content-center  mb-5">
        <div className="col-md-6 d-flex justify-content-between">
          <div className="button-wrapper">
            <div
              className="image-wrapper-div"
              onMouseDown={handleMouseDownClick}
              onMouseUp={handleMouseUpClick}
              onMouseLeave={handleMouseUpClick}
            >
              <CircularProgressbarWithChildren
                value={progress1}
                strokeWidth={50}
                styles={buildStyles({
                  pathTransition: "none",
                  pathColor: "#4caf50",
                  textColor: "#000",
                  trailColor: "#1075bc",
                  textSize: "1.5rem",
                  strokeLinecap: "round",
                })}
              >
                <div className="image-wrapper">
                  <img
                    src={ButtonImg}
                    alt="Button Image"
                    className="image-button"
                    style={{ opacity: imageOpacity1 }}
                  />
                </div>
              </CircularProgressbarWithChildren>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  display: "inline-block",
                  color: "#000",
                  paddingTop: "1.2rem",
                  
                }}
              >
                Blue Button <br />
              </span>
            </div>
            <div
              className="image-wrapper-div"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <CircularProgressbarWithChildren
                value={progress2}
                strokeWidth={50}
                styles={buildStyles({
                  pathTransition: "none",
                  pathColor: `rgba(76, 175, 80)`,
                  textColor: "#000",
                  trailColor: "#E02020",
                  textSize: "1.5rem",
                  strokeLinecap: "butt",
                })}
              >
                <div className="image-wrapper">
                  <img
                    src={ButtonImg}
                    sizes="20"
                    alt="Button Image"
                    className="image-button"
                    style={{ opacity: imageOpacity2 }}
                  />
                </div>
              </CircularProgressbarWithChildren>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  display: "inline-block",
                  color: "#000",
                  paddingTop: "1.2rem",
                }}
              >
                Red Button <br />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
      <div className="col-md-6">
          <Output apiLogs={apiLogs} clearLogs={clearLogs} />
        </div>
      </div>
    </div>
  );
};

export default App;
