import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Footer from '../Footer/Footer';
import './Home.css'; 

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/homepage');
        setData(response.data);
      } catch (error) {
        setError('Error fetching data');
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <style>{`
        body {
          background-color: #f2f2f2; /* Adjust the color code as needed */
          margin-top: 80px;
          padding: 0;
        }
      `}</style>
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '40px' }}>
        <div className="container">
          <div className="row align-items-center">
            {data.map((item) => (
              <motion.div key={item.id} className="col-md-4 mb-3 mb-md-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <motion.img src={item.image} alt="Pet Care Logo" className="img-fluid" style={{ maxWidth: '100%', height: '400px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
              </motion.div>
            ))}
            <div className="col-md-8">
              {data.map((item) => (
                <div key={item.id} className="text-animation">
                  <motion.h5 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>{item.title}</motion.h5>
                  <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                    {item.title2.split(' ').map((word, index, array) => (
                      <React.Fragment key={index}>
                        <motion.span className={index === 1 ? "text-danger animated" : "animated"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>{word}</motion.span>
                        {index !== array.length - 1 && ' '}
                      </React.Fragment>
                    ))}
                  </motion.h3>
                  <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>{item.paragraph}</motion.p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  <Footer/>
    </>
  );
}

export default Home;
