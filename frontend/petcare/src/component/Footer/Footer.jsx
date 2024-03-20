import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Footer() {
    const [copyright, setCopyright] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/footer')
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setCopyright(response.data[0].copyright);
                } else {
                    console.error('No footer content found');
                }
            })
            .catch(error => {
                console.error('Error fetching footer:', error);
            });
    }, []);

    return (
        <footer style={{ backgroundColor: '#8c0000', color: '#fff', padding: '10px' }}>
             <p style={{ textAlign: 'center', margin: '0' }}>{copyright}</p>
        </footer>
    );
}

export default Footer;
