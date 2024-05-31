import React, { useState, useEffect } from 'react';
import CustomTable from './CustomTable';
import CustomTable2 from './CustomTable2';
import './table.css';
import Typography from '@mui/material/Typography';
import img from './dp.jpg';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Table() {
  const [userData, setUserData] = useState([]);
  const [userData1, setUserData1] = useState([]);
  const [showAdditionalTable, setShowAdditionalTable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profitLossData');
        const modifiedData = response.data.map(item => ({
          profitLoss: item.profitLoss,
          date: item.date,
          arbitrageType: item.arbitrageType,
          scrip1: item.scrip1,
        }));
        setUserData(modifiedData);
        setUserData(modifiedData.reverse());
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData(); 

    // Fetch data every 10 seconds
    const intervalId = setInterval(fetchData, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const toggleAdditionalTable = () => {
    setShowAdditionalTable(!showAdditionalTable);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/processcombination');
        const modifiedData = response.data.map(item => ({
          action: item.action,
          ticker1: item.ticker1,
          ticker2: item.ticker2,
          ticker3: item.ticker3,
        }));
        setUserData1(modifiedData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData(); 

    // Fetch data every 10 seconds
    const intervalId = setInterval(fetchData, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(endpoint);
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const navigateToProfile = () => {
    navigate('/userprofile');
  };

  return (
    <div className='scrollable-container'>
      <div className='back'>
        <div className="header">
          <Typography variant="h5" className="name2">BOTFINDER</Typography>
          <div className="profile" onClick={navigateToProfile}>
            <img src={img} alt="Your Name" className="profile-img" />
            <Typography variant="h5" className="name">NIK2432</Typography>
          </div>
        </div>
        <div className='bg'>
          <div className='button-container'>
            <Button variant="contained" color="primary" style={{ marginRight: '1080px' }} onClick={() => fetchData('http://localhost:4000/load')}>LOAD</Button>
            <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => fetchData('http://localhost:4000/run')}>RUN</Button>
            <Button variant="contained" color="primary" onClick={() => fetchData('http://localhost:4000/stop')}>STOP</Button>
          </div>
          <div style={{marginRight:'1188px',marginBottom:'10px'}}>
            <Typography variant="h5" className="name3">PROFIT</Typography>
          </div>
          <div style={{marginLeft: '350px'}}>
            <CustomTable data={userData} />
          </div>
        </div>
        <div className='prog' onClick={toggleAdditionalTable}>
          <Typography variant="h5" className="name2">PROGRESS</Typography>
          <ArrowDropDownIcon fontSize="large" />
        </div>
        {showAdditionalTable && (
          <div className='additional-table'>
            <CustomTable2 data={userData1}/>
          </div>
        )}
      </div>
    </div>
  );
}
