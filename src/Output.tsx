import React, { useEffect, useState } from "react";

interface OutputProps {
  apiLogs: {
    method: string;
    url: string;
    payload?: any;
    response?: any;
    error?: any;
    statusCode?: number;
  }[];
  clearLogs: () => void;
}

const Output: React.FC<OutputProps> = ({ apiLogs, clearLogs }) => {
  const [logs, setLogs] = useState<
    {
      method: string;
      url: string;
      payload?: any;
      response?: any;
      error?: any;
      statusCode?: number;
    }[]
  >([]);

  useEffect(() => {
    setLogs(apiLogs);
  }, [apiLogs]);

  return (
    <div className="col-md-12 output-box">
      <section className="header">
        <h3 className="head">Output</h3>

        <div className="outputActions">
          <a id="output-clear" href="javascript:void(0)" onClick={clearLogs}>
            Clear
          </a>
        </div>
      </section>

      <div
        id="output-output-wrapper"
        style={{
          maxHeight: 300,
          overflowY: "auto", // Vertical scroll
          overflowX: "hidden", // Hide horizontal scroll
        }}
      >
        <ul id="output-logs" className="list-unstyled">
          {logs.map((log, index) => (
            <li
              key={index}
              className={log.error ? "error" : log.response ? "info" : "warn"}
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <div className="log-item">
                <span className="arrow"></span>
                <div className="log-content">
                  {log.error && <div>{log.error}</div>}
                  {log.method && (
                    <>
                      <span className="cm-string">Method: {log.method}</span>
                    </>
                  )}
                  {log.url && (
                    <>
                      <br />
                      <span className="cm-string">URL: {log.url}</span>
                    </>
                  )}
                  {log.payload && (
                    <>
                      <br />
                      <span className="cm-string">
                        Payload: {JSON.stringify(log.payload)}
                      </span>
                    </>
                  )}
                  {log.statusCode !== undefined && (
                    <>
                      <br />
                      <span className="cm-string">
                        Status Code: {log.statusCode}
                      </span>
                    </>
                  )}
                  {log.response !== undefined && (
                    <>
                      <br />
                      <span className="cm-string">
                        Response: {JSON.stringify(log.response)}
                      </span>
                    </>
                  )}
                  {log.error !== undefined && (
                    <>
                      <br />
                      <span className="cm-string">
                        Error: {log.error}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Output;
