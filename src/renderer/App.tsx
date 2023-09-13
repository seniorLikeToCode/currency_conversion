import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import './App.css';

async function fetchCountries() {
  const response = await fetch(
    'https://v6.exchangerate-api.com/v6/key-here/codes'
  );
  const data = await response.json();
  return data.supported_codes;
}

async function convert(from: string, to: string, amount: number) {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/key-here/pair/${from}/${to}/${amount}`
  );
  const data = await response.json();
  console.log(data);
  return data.conversion_result;
}

function Home() {
  const [countries, setCountries] = useState([]);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    // fetchCountries().then((data) => {
    //   setCountries(data);
    // });
    // convert(from, to, amount).then((data) => {
    //   setResult(data);
    // });
  }, []);

  const handleFromChange = (e: any) => {
    setFrom(e.target.value);
  };

  const handleToChange = (e: any) => {
    setTo(e.target.value);
  };

  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    convert(from, to, amount).then((data) => {
      setResult(data);
    });
  };

  return (
    <div className="h-screen bg-slate-100">
      <h1 className="text-center text-2xl">Simple Currency Converter</h1>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-lg">Exchange Rate</h1>
        <p className="text-5xl ">{result}</p>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label>Amount</label>
            <input type="number" name="amount"></input>
          </div>
          <div>
            <div>
              <label>From</label>
              <select name="from">
                {countries.map((country: any) => (
                  <option value={country[0]}>{country[1]}</option>
                ))}
              </select>
            </div>

            <div>
              <label>To</label>
              <select name="to">
                {countries.map((country: any) => (
                  <option value={country[0]}>{country[1]}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit">Convert</button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
