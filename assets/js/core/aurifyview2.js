// import { readSpreadValues } from '../core/spotrateDB.js';
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { app } from '../../../config/db.js';

// const { JSDOM } = require('jsdom');
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.2.0/socket.io.js';
document.head.appendChild(script);

// const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// global.window = dom.window;
// global.document = dom.window.document;


const socket = io('https://capital-server-9ebj.onrender.com/', {
    query: { secret: 'aurify@123' }, // Pass secret key as query parameter
});

const firestore = getFirestore(app)

socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    requestMarketData(["GOLD", "SILVER"]);
});

// Request market data based on symbols
function requestMarketData(symbols) {
    socket.emit("request-data", symbols);
}


setInterval(fetchData, 500);

setInterval(() => {
    fetchData2()
}, 1200)

showTable();


let askSpread, bidSpread, silverBidSpread, silverAskSpread, goldBuy, goldAskingPrice, goldBiddingPrice,
    goldSell, silverBuy, silverSell, silverValue, goldHigh, goldLow, silverLow, silverHigh, silverAskingPrice, silverBiddingPrice;

let goldData = {}
let silverData = {}

async function fetchData2() {
    socket.on('market-data', (data) => {
        // console.log('Received gold value:', data);

        if (data && data.symbol) {
            if (data.symbol === "Gold") {
                goldData = data;
                // updateGoldUI();
            } else if (data.symbol === "Silver") {
                silverData = data;
            }
        } else {
            console.warn("Received malformed market data:", data);
        }


        const value = goldData.bid;
        goldHigh = goldData.high;
        goldLow = goldData.low;
        goldBuy = (value + bidSpread).toFixed(2);
        goldSell = (value + bidSpread + askSpread + parseFloat(0.5)).toFixed(2);

        const value2 = silverData.bid;
        silverHigh = silverData.high;
        silverLow = silverData.low;
        silverBuy = (value2 + silverBidSpread).toFixed(2);
        silverSell = (value2 + silverBidSpread + silverAskSpread + parseFloat(0.5)).toFixed(2);



    });

    var goldBuyUSD = (goldBuy / 31.103).toFixed(4);
    goldBiddingPrice = (goldBuyUSD * 3.674).toFixed(4);

    var goldSellUSD = (goldSell / 31.103).toFixed(4);
    goldAskingPrice = (goldSellUSD * 3.674).toFixed(4);

    var silverBuyUSD = (silverBuy / 31.103).toFixed(4);
    silverBiddingPrice = (silverBuyUSD * 3.674).toFixed(4);

    var silverSellUSD = (silverSell / 31.103).toFixed(4);
    silverAskingPrice = (silverSellUSD * 3.674).toFixed(4);
}


// Gold API KEY
const API_KEY = 'goldapi-fbqpmirloto20zi-io'

// Function to Fetch Gold API Data
async function fetchData() {
    try {
        var currentGoldBuy = goldBuy;
        var currentGoldSell = goldSell;
        var currentSilverBuy = silverBuy;
        var currentSilverSell = silverSell;

        function updatePrice() {
            var newGoldBuy = goldBuy;
            var newGoldSell = goldSell;
            var newSilverBuy = silverBuy;
            var newSilverSell = silverSell;

            var element1 = document.getElementById("goldInputLow");
            var element2 = document.getElementById("goldInputHigh");
            var element3 = document.getElementById("silverInputLow");
            var element4 = document.getElementById("silverInputHigh");

            element1.innerHTML = newGoldBuy;
            element2.innerHTML = newGoldSell;
            element3.innerHTML = newSilverBuy;
            element4.innerHTML = newSilverSell;

            // Determine color for each element
            var color1;
            var fontColor1;
            if (newGoldBuy > currentGoldBuy) {
                color1 = "green";
                fontColor1 = "white"
            } else if (newGoldBuy < currentGoldBuy) {
                color1 = "red";
                fontColor1 = "white"
            } else {
                color1 = "white"; // Set to white if no change
                fontColor1 = "black"
            }

            var color2;
            var fontColor2;
            if (newGoldSell > currentGoldSell) {
                color2 = "green";
                fontColor2 = "white"
            } else if (newGoldSell < currentGoldSell) {
                color2 = "red";
                fontColor2 = "white"
            } else {
                color2 = "white"; // Set to white if no change
                fontColor2 = "black"
            }

            var color3;
            var fontColor3;
            if (newSilverBuy > currentSilverBuy) {
                color3 = "green";
                fontColor3 = "white"
            } else if (newSilverBuy < currentSilverBuy) {
                color3 = "red";
                fontColor3 = "white"
            } else {
                color3 = "white"; // Set to white if no change
                fontColor3 = "black"
            }

            var color4;
            var fontColor4;
            if (newSilverSell > currentSilverSell) {
                color4 = "green";
                fontColor4 = "white"
            } else if (newSilverSell < currentSilverSell) {
                color4 = "red";
                fontColor4 = "white"
            } else {
                color4 = "white"; // Set to white if no change
                fontColor4 = "black"
            }

            element1.style.backgroundColor = color1;
            element2.style.backgroundColor = color2;
            element3.style.backgroundColor = color3;
            element4.style.backgroundColor = color4;

            element1.style.color = fontColor1;
            element2.style.color = fontColor2;
            element3.style.color = fontColor3;
            element4.style.color = fontColor4;


            currentGoldBuy = newGoldBuy;
            currentGoldSell = newGoldSell;
            currentSilverBuy = newSilverBuy;
            currentSilverSell = newSilverSell;

            setTimeout(updatePrice, 300);
        }


        updatePrice();

        document.getElementById("lowLabelGold").innerHTML = goldLow;
        document.getElementById("highLabelGold").innerHTML = goldHigh;
        document.getElementById("lowLabelSilver").innerHTML = silverLow;
        document.getElementById("highLabelSilver").innerHTML = silverHigh;

        var element;

        // LowLabelGold
        element = document.getElementById("lowLabelGold");


        // HighLabelGold
        element = document.getElementById("highLabelGold");


        // LowLabelSilver
        element = document.getElementById("lowLabelSilver");


        // HighLabelSilver
        element = document.getElementById("highLabelSilver");

    } catch (error) {
        console.error('Error fetching gold and silver values:', error);
    }
}


async function readSpreadValues() {
    try {
        const uid = 'G46UZJNWfJhGAWytlVuUzFXzKf13';
        if (!uid) {
            console.error('User not authenticated');
            throw new Error('User not authenticated');
        }

        const spreadCollection = collection(firestore, `users/${uid}/spread`);
        const querySnapshot = await getDocs(spreadCollection);

        const spreadDataArray = [];
        querySnapshot.forEach((doc) => {
            const spreadData = doc.data();
            const spreadDocId = doc.id;
            spreadDataArray.push({ id: spreadDocId, data: spreadData });
        });

        console.log(spreadDataArray);

        return spreadDataArray;
    } catch (error) {
        console.error('Error reading data from Firestore: ', error);
        throw error;
    }
}

async function displaySpreadValues() {
    try {
        const spreadDataArray = await readSpreadValues();

        spreadDataArray.forEach((spreadData) => {
            askSpread = spreadData.data.editedAskSpreadValue || 0;
            bidSpread = spreadData.data.editedBidSpreadValue || 0;
            silverAskSpread = spreadData.data.editedAskSilverSpreadValue || 0;
            silverBidSpread = spreadData.data.editedBidSilverSpreadValue || 0;
        });
    } catch (error) {
        console.error('Error reading spread values: ', error);
        throw error;
    }
}


// Function to read data from the Firestore collection
async function readData() {
    // Get the UID of the authenticated user
    const uid = 'G46UZJNWfJhGAWytlVuUzFXzKf13';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    const querySnapshot = await getDocs(collection(firestore, `users/${uid}/commodities`));
    const result = [];
    querySnapshot.forEach((doc) => {
        result.push({
            id: doc.id,
            data: doc.data()
        });
    });
    return result;
}

// Show Table from Database
async function showTable() {
    try {
        const tableData = await readData();
        // console.log('Data read successfully:', tableData);

        console.log(tableData);

        let silverAskKG
        setInterval(() => {
            let silver = silverValue

            // Silver 1GM Table Value
            // Bid = parseFloat((parseFloat(silver) + parseFloat(silverBidSpread) || 0) * 1000).toFixed(3);
            // silverAskKG = parseFloat((parseFloat(silver) + 0.5 + parseFloat(silverAskSpread) || 0) * 1000).toFixed(0);
            // document.getElementById('data4').textContent = silverAskKG;
            // console.log(ask);
        }, 1000);

        // Loop through the tableData
        for (const data of tableData) {
            // Assign values from data to variables
            const metalInput = data.data.metal;
            const purityInput = data.data.purity;
            const unitInput = data.data.unit;
            const weightInput = data.data.weight;
            const sellAEDInput = data.data.sellAED;
            const buyAEDInput = data.data.buyAED;
            const sellPremiumInputAED = data.data.sellPremiumAED;
            const buyPremiumInputAED = data.data.buyPremiumAED;

            displaySpreadValues();

            setInterval(async () => {
                let weight = weightInput;
                let unitMultiplier = 1;

                // Adjust unit multiplier based on the selected unit



                let sellPremium = sellPremiumInputAED || 0;
                let buyPremium = buyPremiumInputAED || 0;
                let askSpreadValue = askSpread || 0;
                let bidSpreadValue = bidSpread || 0;




                if (tableData[0]) {
                    let purity = tableData[0].data.purity;
                    let metal = tableData[0].data.metal;
                    let unit = tableData[0].data.unit;
                    let weight = tableData[0].data.weight;

                    if (weight === "GM") {
                        unitMultiplier = 1;
                    } else if (weight === "KG") {
                        unitMultiplier = 1000;
                    } else if (weight === "TTB") {
                        unitMultiplier = 116.6400;
                    } else if (weight === "TOLA") {
                        unitMultiplier = 11.664;
                    } else if (weight === "OZ") {
                        unitMultiplier = 31.1034768;
                    }
                    if (weight === "GM") {
                        // Update the sellAED and buyAED values for the current 
                        const sellAEDValue = parseFloat((parseFloat(goldAskingPrice) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremium)).toFixed(2));
                        // const buyAEDValue = ((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremium)).toFixed(2);
                        // document.getElementById('head2').textContent = metal;
                        // document.getElementById('head22').textContent = purity;
                        // document.getElementById('head23').textContent = unit;
                        // document.getElementById('head24').textContent = weight;
                        document.getElementById('data1').textContent = sellAEDValue
                    } else {
                        // Update the sellAED and buyAED values for the current row
                        const sellAEDValue = parseFloat((parseFloat(goldAskingPrice) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremium)).toFixed(4));
                        // const buyAEDValue = parseInt((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremium)).toFixed(0);
                        // document.getElementById('head2').textContent = metal;
                        // document.getElementById('head22').textContent = purity;
                        // document.getElementById('head23').textContent = unit;
                        // document.getElementById('head24').textContent = weight;
                        document.getElementById('data1').textContent = sellAEDValue.toFixed(0)
                    }
                }

                if (tableData[1]) {
                    let purity = tableData[1].data.purity;
                    let metal = tableData[1].data.metal;
                    let unit = tableData[1].data.unit;
                    let weight = tableData[1].data.weight;

                    if (weight === "GM") {
                        unitMultiplier = 1;
                    } else if (weight === "KG") {
                        unitMultiplier = 1000;
                    } else if (weight === "TTB") {
                        unitMultiplier = 116.6400;
                    } else if (weight === "TOLA") {
                        unitMultiplier = 11.664;
                    } else if (weight === "OZ") {
                        unitMultiplier = 31.1034768;
                    }
                    if (weight === "GM") {
                        // Update the sellAED and buyAED values for the current 
                        const sellAEDValue = parseFloat((parseFloat(goldAskingPrice) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremium)).toFixed(2));
                        // const buyAEDValue = ((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremium)).toFixed(2);
                        // document.getElementById('head3').textContent = metal;
                        // document.getElementById('head32').textContent = purity;
                        // document.getElementById('head33').textContent = unit;
                        // document.getElementById('head34').textContent = weight;
                        document.getElementById('data3').textContent = sellAEDValue
                    } else {
                        // Update the sellAED and buyAED values for the current row
                        const sellAEDValue = parseFloat((parseFloat(goldAskingPrice) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremium)).toFixed(4));
                        // const buyAEDValue = parseInt((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremium)).toFixed(0);
                        // document.getElementById('head3').textContent = metal;
                        // document.getElementById('head32').textContent = purity;
                        // document.getElementById('head33').textContent = unit;
                        // document.getElementById('head34').textContent = weight;
                        document.getElementById('data3').textContent = sellAEDValue.toFixed(0)
                    }
                }

                if (tableData[2]) {
                    let purity = tableData[2].data.purity;
                    let metal = tableData[2].data.metal;
                    let unit = tableData[2].data.unit;
                    let weight = tableData[2].data.weight;

                    if (weight === "GM") {
                        unitMultiplier = 1;
                    } else if (weight === "KG") {
                        unitMultiplier = 1000;
                    } else if (weight === "TTB") {
                        unitMultiplier = 116.6400;
                    } else if (weight === "TOLA") {
                        unitMultiplier = 11.664;
                    } else if (weight === "OZ") {
                        unitMultiplier = 31.1034768;
                    }
                    if (weight === "GM") {
                        // Update the sellAED and buyAED values for the current 
                        const sellAEDValue = parseFloat((parseFloat(goldAskingPrice) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremium)).toFixed(2));
                        // const buyAEDValue = ((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremium)).toFixed(2);
                        // document.getElementById('head4').textContent = metal;
                        // document.getElementById('head42').textContent = purity;
                        // document.getElementById('head43').textContent = unit;
                        // document.getElementById('head44').textContent = weight;
                        document.getElementById('data2').textContent = sellAEDValue
                    } else {
                        // Update the sellAED and buyAED values for the current row
                        const sellAEDValue = parseFloat((parseFloat(goldAskingPrice) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremium)).toFixed(4));
                        // const buyAEDValue = parseInt((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremium)).toFixed(0);
                        // document.getElementById('head4').textContent = metal;
                        // document.getElementById('head42').textContent = purity;
                        // document.getElementById('head43').textContent = unit;
                        // document.getElementById('head44').textContent = weight;
                        document.getElementById('data2').textContent = sellAEDValue.toFixed(0)
                    }
                }

                if (tableData[3]) {
                    let purity = tableData[3].data.purity;
                    let metal = tableData[3].data.metal;
                    let unit = tableData[3].data.unit;
                    let weight = tableData[3].data.weight;

                    if (weight === "GM") {
                        unitMultiplier = 1;
                    } else if (weight === "KG") {
                        unitMultiplier = 1000;
                    } else if (weight === "TTB") {
                        unitMultiplier = 116.6400;
                    } else if (weight === "TOLA") {
                        unitMultiplier = 11.664;
                    } else if (weight === "OZ") {
                        unitMultiplier = 31.1034768;
                    }
                    if (weight === "GM") {
                        // Update the sellAED and buyAED values for the current 
                        const sellAEDValue = parseFloat((parseFloat(goldAskingPrice) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremium)).toFixed(2));
                        // const buyAEDValue = ((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremium)).toFixed(2);
                        // document.getElementById('head1').textContent = metal;
                        // document.getElementById('head12').textContent = purity;
                        // document.getElementById('head13').textContent = unit;
                        // document.getElementById('head14').textContent = weight;
                        document.getElementById('data4').textContent = sellAEDValue
                    } else {
                        // Update the sellAED and buyAED values for the current row
                        const sellAEDValue = parseFloat((parseFloat(goldAskingPrice) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremium)).toFixed(4));
                        // const buyAEDValue = parseInt((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unit * unitMultiplier * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremium)).toFixed(0);
                        // document.getElementById('head1').textContent = metal;
                        // document.getElementById('head12').textContent = purity;
                        // document.getElementById('head13').textContent = unit;
                        // document.getElementById('head14').textContent = weight;
                        document.getElementById('data4').textContent = sellAEDValue.toFixed(0)
                    }
                }
            }, 500)
        }
    } catch (error) {
        console.error('Error reading data:', error);
    }
}
