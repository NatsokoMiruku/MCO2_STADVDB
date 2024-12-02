import axios from 'axios';

(async () => {
    try {
        const response = await axios.post('http://localhost:3000/transactions/perform', {
            node: 'central',
            action: 'update',
            data: { AppID: 101, Name: 'Updated Game Name' },
        });
        console.log('Replication Test:', response.data);
    } catch (error) {
        console.error('Replication Test Failed:', error.message);
    }
})();
