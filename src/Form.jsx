import React, { useState } from "react";
import { useGlobalContext } from "./context";

const types = ["eScale", "Sniffer"];

const Form = () => {
  const [category, setCategory] = useState("eScale");
  const [name, setName] = useState("");
  const { cart, vinItems } = useGlobalContext();

  const submitForm = (e) => {
    e.preventDefault();
    let random = Math.floor(Math.random() * 1000);
    let randomDate = Date.now();
    let dbName = `${name}${randomDate}${random}`;
    const formData = {
      category,
      name,
      dbName,
    };
    vinItems(formData);
    setCategory("eScale");
    setName("");
  };

  return (
    <div className="right">
      <h4>Register a Device</h4>
      <form onSubmit={submitForm} className="form">
        <label htmlFor="type">Device Category</label>
        <div className="select">
          <select
            name="category"
            onChange={(e) => setCategory(e.target.value)}
            disabled={cart.status}
          >
            {types.map((device, index) => (
              <option key={index} value={device}>
                {device}
              </option>
            ))}
          </select>
          <span className="focus"></span>
        </div>
        <label htmlFor="input">Name Device</label>
        <div className="form-group">
          <input
            className="form-field"
            type="text"
            placeholder="name"
            name="device"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={cart.status}
          />
          <span>{`${new Date().getMinutes()}${new Date().getSeconds()}`}</span>
        </div>
        <div className="btn-center">
          <button
            className={cart.status ? "" : "btn"}
            type="submit"
            disabled={cart.status}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
