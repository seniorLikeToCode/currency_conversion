import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import exchangeLogo from '../../assets/arrow-left-right.svg';

import './App.css';

async function fetchCountries() {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.KEY}/codes`
  );
  const data = await response.json();
  return data.supported_codes;
}


async function convert(from: string, to: string) {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6//${process.env.KEY}/pair/${from}/${to}`
  );
  const data = await response.json();
  console.log(data);
  return data.connverion_rates;
}

function Home() {
  const [countries, setCountries] = useState([]);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(0);
  const [result, setResult] = useState(0);

  
const roundOff = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

  useEffect(() => {
    fetchCountries().then((data) => {
      setCountries(data);
    });
    convert(from, to).then((data) => {
      setRate(data);
      setResult(roundOff(amount * data));
    });

  }, []);

  const handleFromChange = (e: any) => {
    setFrom(e.target.value);
  };

  const handleToChange = (e: any) => {
    setTo(e.target.value);
  };

  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
    setResult(roundOff(e.target.value * rate));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    convert(from, to).then((data) => {
      setRate(data);
      setResult(roundOff(amount * data));
    });
  };

  const handleExchange = () => {
    setFrom(to);
    setTo(from);
    setResult(roundOff(amount * (1/rate)));
    setRate(1/rate);
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col justify-center items-center">
      <h1 className="text-2xl pb-8">Simple Currency Converter</h1>
      <div className="flex flex-col bg-white rounded drop-shadow h-[400px] w-[370px]">
        <div className='h-2 bg-sky-500 rounded-t'></div>
        <h1 className="text-center text-lg text-neutral-500 pt-8">Exchange Rate</h1>
        <p className="text-center text-5xl pb-6">{result}</p>

        <form onSubmit={handleSubmit} className='px-8'>
          <div className="flex flex-col pb-6">
            <label className='text-sm text-neutral-500'>Amount</label>
            <input className='border h-8 rounded px-2' 
            type="number" name="amount" onChange={handleAmountChange}></input>
          </div>
          <div className='flex justify-between pb-8'>
            <div className='flex flex-col'>
              <label className='text-sm text-neutral-500'>From</label>
              <select value='INR' name="from" onChange={handleFromChange} className='border w-32 h-8 rounded'>
                {countries.map((country: any) => (
                  <option value={country[0]}>{country[1]}</option>
                ))}
              </select>
            </div>

             <img src={exchangeLogo} onClick={handleExchange}  alt='exchnage' className='pt-4' />

            <div className='flex flex-col'>
              <label className='text-sm text-neutral-500'>To</label>
              <select value='INR' name="to" onClick={handleToChange} className='border w-32 h-8 rounded'>
                {countries.map((country: any) => (
                  <option value={country[0]}>{country[1]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex justify-center'>
          <button className='bg-sky-500 rounded shadow-md h-10 w-40' type="submit">Convert</button>
          </div>
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
