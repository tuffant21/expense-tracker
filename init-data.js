const { MongoClient } = require('mongodb');
require('dotenv').config();

// Function to generate a random currency value as a string with commas
function getRandomCurrency() {
    const value = (Math.random() * 10000).toFixed(2); // Random value between 0 and 10,000
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas for thousands
}

// Function to generate a random date in the format YYYY-MM-DD
function getRandomDate() {
    const start = new Date(2022, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const bills = [
    { bill: 'Phone', dueDate: '1st day of month', autoPay: false, due: getRandomCurrency(), balance: getRandomCurrency(), website: '', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Amazon CC', dueDate: '15th day of month', autoPay: false, due: getRandomCurrency(), balance: getRandomCurrency(), website: 'amazon.syf.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Insurance', dueDate: '3rd day of month', autoPay: true, due: getRandomCurrency(), balance: '', website: 'safeco.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Car', dueDate: '5th day of month', autoPay: false, due: getRandomCurrency(), balance: getRandomCurrency(), website: 'canvas.org', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Priv loan', dueDate: '5th day of month', autoPay: false, due: getRandomCurrency(), balance: getRandomCurrency(), website: 'aspireservicingcenter.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Gas', dueDate: '5th day of month', autoPay: false, due: getRandomCurrency(), balance: '', website: 'my.xcelenergy.com/MyAccount', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Utilities', dueDate: '5th day of month', autoPay: false, due: getRandomCurrency(), balance: '', website: 'www.xpressbillpay.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Electric', dueDate: '5th day of month', autoPay: true, due: getRandomCurrency(), balance: '', website: 'pvrea.smarthub.coop', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Fed loan', dueDate: '5th day of month', autoPay: true, due: getRandomCurrency(), balance: getRandomCurrency(), website: 'nelnet.studentaid.gov', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'UC Health', dueDate: '5th day of month', autoPay: true, due: getRandomCurrency(), balance: getRandomCurrency(), website: 'uchealth app', lastPaymentDate: '', disabled: false },
    { bill: 'Mortgage', dueDate: '6th day of month', autoPay: true, due: getRandomCurrency(), balance: getRandomCurrency(), website: 'mylakeviewloan.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Prime', dueDate: '7th day of month', autoPay: true, due: getRandomCurrency(), balance: '', website: 'amazon.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Xbox Game P', dueDate: '7th day of month', autoPay: true, due: getRandomCurrency(), balance: '', website: 'xbox.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Apple Data', dueDate: '9th day of month', autoPay: true, due: getRandomCurrency(), balance: '', website: 'apple.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Internet', dueDate: '20th day of month', autoPay: true, due: getRandomCurrency(), balance: '', website: 'hellotds.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Life Ins.', dueDate: '25th day of month', autoPay: true, due: getRandomCurrency(), balance: '', website: 'newyorklife.com', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Mercy Iowa', dueDate: '25th day of month', autoPay: false, due: getRandomCurrency(), balance: '', website: 'call', lastPaymentDate: getRandomDate(), disabled: false },
    { bill: 'Best Buy', dueDate: '7th day of month', autoPay: true, due: '', balance: '', website: 'bestbuy.com', lastPaymentDate: getRandomDate(), disabled: true }
];

async function initializeData() {
    const client = new MongoClient(process.env.MONGO_URL);
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(process.env.MONGO_DB);

        // Insert bills into the collection
        const billsCollection = db.collection(process.env.MONGO_COLLECTION);

        // Clear existing data
        await billsCollection.deleteMany({});

        // Insert new data
        const result = await billsCollection.insertMany(bills);
        console.log(`${result.insertedCount} bills inserted`);
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        await client.close();
    }
}

initializeData();
