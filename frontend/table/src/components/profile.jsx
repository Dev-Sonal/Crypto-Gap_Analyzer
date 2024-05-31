import React from 'react';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import img from './dp.jpg'; // Importing the image
import './table.css'
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import CustomTable from './CustomTable1';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBack icon

const UserProfilePage = () => {
  const [userData, setUserData] = useState([]); // State to store user data
  const [sum, setSum] = useState([]);
  const [TotalProfit,setTotalProfit] = useState(0);
  const [DayProfit,setDayProfit] = useState(0);
  const navigate = useNavigate(); // Hook to handle navigation
  useEffect(() => {
    // Function to fetch user data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/combination'); // Replace 'API_ENDPOINT_HERE' with your actual API endpoint
        const modifiedData = response.data.map(item => ({
          base: item.base,
          intermediate: item.intermediate,
          ticker: item.ticker
        }));
        setUserData(modifiedData); // Store the modified data in state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount
  const navigateTohome = () => {
    navigate('/'); // Navigate to user profile page
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profitLossData');
        console.log(response);
        const modifiedData = response.data.map(item => ({
          profitLoss: item.profitLoss,
          date: item.date,
          arbitrageType: item.arbitrageType,
          scrip1: item.scrip1,
        }));
        setSum(modifiedData);

        // Calculate total profit
        const totalProfit = modifiedData.reduce((acc, curr) => acc + curr.profitLoss, 0);
        setTotalProfit(totalProfit);
        console.log(TotalProfit);
        const currentDate = new Date().toLocaleDateString(); // Get current date
        const dayProfit = modifiedData
          .filter(item => new Date(item.date).toLocaleDateString() === currentDate) // Filter data for today
          .reduce((acc, curr) => acc + curr.profitLoss, 0); // Sum up profit for today
        setDayProfit(dayProfit);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData(); 

    // Fetch data every 10 seconds
    const intervalId = setInterval(fetchData, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  },[]);
  useEffect(() => {
    console.log(TotalProfit);
  }, [TotalProfit]);
  return (
    <div className="profile-container">
      <div className="avatar-container">
        {/* Circular photo with grey border */}
        <Avatar alt="User Photo" src={img} sx={{ width: 130, height: 130, border: '5px solid #ccc' }} />
      </div>
      <div className='info'>
        {/* Info box on the right side */}
        <div className="info-box">
          <Typography variant="h6" gutterBottom>User Information</Typography>
          <Typography variant="body1">FULL NAME: NIKHIL ANAND</Typography>
          <Typography variant="body1">EMAIL: john@example.com</Typography>
          <Typography variant="body1">LOCATION: City, Country</Typography>
          {/* Add more user information as needed */}
        </div>
        {/* White box below user info */}
        <div className="white-box">
          <div className='smb'> {/* Adjusting the margin top */}
            <Typography variant="h2" gutterBottom>100</Typography>
            <Typography variant="h6" gutterBottom style={{ marginTop: '-10px' }}>INITIAL AMOUNT</Typography> {/* Adjusting the margin top */}
          </div>
          <div className='smb'> {/* Adjusting the margin top */}
            <Typography variant="h2" gutterBottom>{TotalProfit.toFixed(3)}</Typography>
            <Typography variant="h6" gutterBottom style={{ marginTop: '-10px' }}>TOTAL PROFIT</Typography> {/* Adjusting the margin top */}
          </div>
          <div className='smb'> {/* Adjusting the margin top */}
            <Typography variant="h2" gutterBottom>{DayProfit.toFixed(3)}</Typography>
            <Typography variant="h6" gutterBottom style={{ marginTop: '-10px' }}>DAY PROFIT</Typography> {/* Adjusting the margin top */}
          </div>
          {/* Add more additional information as needed */}
        </div>
        <div className='table3' style={{ color: 'white' }}>
          <div style={{ marginRight: '1330px', marginBottom: '14px' }}>
            <Typography variant="h5">COMBINATION</Typography>
          </div>
          <CustomTable data={userData} />
        </div>
      </div>
      <div style={{ color: 'white' , cursor:'pointer' }} onClick={navigateTohome}>
        <ArrowBackIcon style={{ cursor: 'pointer', marginRight: '35px' }} /> {/* Add ArrowBack icon */}
        <Typography variant="h5" style={{ display: 'inline-block', marginRight: '35px' }}>HOME</Typography>
      </div>
    </div>
  );
};

export default UserProfilePage;
