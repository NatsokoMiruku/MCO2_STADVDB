import axios from 'axios';

(async () => {
    try {
        const response = await axios.post('http://localhost:3000/recovery', {
            node: 'node2',
        });
        console.log('Recovery Test:', response.data);
    } catch (error) {
        console.error('Recovery Test Failed:', error.message);
    }
})();
