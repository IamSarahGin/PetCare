import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './HappyFurParents.css';

const HappyFurparentsPage = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/happyFurparentsPage');
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <Container fluid>
        {records.map(record => (
          <Row key={record.id} className="mb-4">
            <Col xs={12}>
              <h2 className="mt-4">
                {record.title.split(' ').map((word, index, array) => (
                  <React.Fragment key={index}>
                    {index === 1 ? <span className="text-danger">{word}</span> : word}
                    {index !== array.length - 1 && ' '}
                  </React.Fragment>
                ))}
              </h2>
              <p className="mt-4">{record.paragraph}</p>
            </Col>
            <Col xs={12} className="mt-4">
              <img
                src={record.image}
                alt={record.title}
                className="img-fluid imgHeight"
                 // Adjust width here
              />
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  );
}

export default HappyFurparentsPage;
