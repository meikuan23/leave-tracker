import { useRef, useState, useEffect } from "react";
import uuid from "react-uuid";
import { CSVLink, CSVDownload } from "react-csv";
import "./App.css";

export default function App() {
  const employeeRef = useRef();
  const leaveRef = useRef();
  const dateFromRef = useRef();
  const dateToRef = useRef();
  const [approval, setApproval] = useState();
  const [formData, setFormData] = useState();
  const [submittedData, setSubmittedData] = useState([]);

  // To capitalize the name in the input
  const capitalizeFirstLetter = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      !employeeRef.current?.value ||
      !leaveRef.current?.value ||
      !dateFromRef.current?.value ||
      !dateToRef.current?.value
    ) {
      alert("Please insert valid information!");
      return;
    }

    const submitDataObj = {
      id: uuid(),
      employee: capitalizeFirstLetter(employeeRef.current?.value),
      leave: leaveRef.current?.value,
      dateFrom: dateFromRef.current?.value,
      dateTo: dateToRef.current?.value,
      approval: approval,
    };
    setSubmittedData((prevSubmittedData) => [
      ...prevSubmittedData,
      submitDataObj,
    ]);
    employeeRef.current.value = "";
    leaveRef.current.value = "";
    dateFromRef.current.value = null;
    dateToRef.current.value = null;
    setApproval(false);
  };

  const deleteRecord = (index) => {
    const newSubmitDataObj = [...submittedData];
    newSubmitDataObj.splice(index, 1);
    setSubmittedData(newSubmitDataObj);
  };

  const toggleApproval = (id) => {
    setSubmittedData((prevData) =>
      prevData.map((employeeObj) => {
        if (employeeObj.id === id) {
          return {
            ...employeeObj,
            approval: !employeeObj.approval,
          };
        } else {
          return employeeObj;
        }
      })
    );
  };

  useEffect(() => {
    console.log(submittedData);
  }, [submittedData]);

  const leaveType = ["", "Annual Leave", "Sick Leave", "No Pay Leave"];

  const data = submittedData.map((item) => ({
    employee: item.employee,
    leave: item.leave,
    dateFrom: item.dateFrom,
    dateTo: item.dateTo,
  }));

  return (
    <div className="App">
      <h1>Apply Your Leave Here!</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Employee Name:&nbsp;
          <input
            className="input"
            ref={employeeRef}
            onChange={(e) => {
              setFormData({
                employee: capitalizeFirstLetter(e.target.value),
                ...formData,
              });
            }}
          />
        </label>
        <br />
        <label>
          Leave Type:&nbsp;
          <select
            className="input"
            ref={leaveRef}
            onChange={(e) => setFormData({ ...formData })}
          >
            {leaveType.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <br />
        </label>
        <label>
          Leave From:&nbsp;
          <input
            className="input"
            type="date"
            ref={dateFromRef}
            onChange={(e) => setFormData({ ...formData })}
          />
        </label>
        <br />
        <label>
          Leave To:&nbsp;
          <input
            className="input"
            type="date"
            ref={dateToRef}
            onChange={(e) => setFormData({ ...formData })}
          />
        </label>
        <br />
        <input
          type="checkbox"
          checked={approval}
          value={approval}
          onChange={(e) => setApproval(e.currentTarget.checked)}
        />
        Approval
        <br />
        <button className="button" value="Save Record">
          Submit
        </button>
      </form>
      {submittedData && (
        <div>
          <h2>Records:</h2>
          {submittedData.map((data, index) => {
            return (
              <div
                className={
                  data.approval ? "record approved" : "record unapproved"
                }
                onDoubleClick={() => toggleApproval(data.id)}
              >
                <button
                  className="deleteBtn"
                  onClick={() => deleteRecord(index)}
                >
                  x
                </button>
                <br />
                {data.employee} applied {data.leave} from&nbsp;
                {data.dateFrom} to {data.dateTo}
              </div>
            );
          })}
        </div>
      )}
      <CSVLink data={data} filename="TakenLeaveReport.csv">
        <button className="export">Export to CSV File</button>
      </CSVLink>
    </div>
  );
}
