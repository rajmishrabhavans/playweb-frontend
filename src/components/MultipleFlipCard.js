import React,{useState} from 'react';

const cardsData = [
  {
    title: 'ESP32 Nodemcu',
    imageUrl: 'https://th.bing.com/th/id/OIP.ATjBP0vDu-IEhh-8Y1XFUAHaFj?pid=ImgDet&rs=1',
        title1: "Operating Voltage: 3.3v",
        title2: "Operating Current: 80mA (average)",
        title3: "Integrated Connectivity Protocols: Wifi, Bluetooth, BLE",
        title4: "ROM: 448KB (for booting and core functions)",
  },
  {
    title: 'HC-SR04- Ultrasonic sensor',
    imageUrl: 'https://th.bing.com/th/id/OIP.IrvTC5TpLQrppGsZGFzleQHaHa?pid=ImgDet&rs=1',

        title1: "Power Supply: +5V",
        title2: "Operating current: 15mA",
        title3: "Distance range: 2cm to 400cm",
        title4: "Measuring angle: 30 degrees",
  },
  {
    title: 'Solenoid valve 18v',
    imageUrl: 'https://th.bing.com/th/id/OIP.LLbtMqMmpSGmn_c9BEsbNQHaHa?pid=ImgDet&rs=1',
   
        title1: "Supply Voltage: 24v",
        title2: "Valve Type: 2 Way Normally Closed ",
        title3: "Coil Power: 20W",
        title4: "Used to control the hydraulic action",
  },
  {
    title: 'DC Water Pump',
    imageUrl: 'https://th.bing.com/th/id/OIP.1B-2Sa0HcSSgDTwAP3D7ygHaHa?pid=ImgDet&rs=1',

        title1: "Voltage: 3v-6v",
        title2: "Maximum lift: 40cm-110cm / 15.75\"-43.4\"",
        title3: "Flow rate: 80-120L/H",
        title4: "Height: Approx. 30mm / 1.2\"",
  },
  {
    title: 'YF-S401- Flow sensor',
    imageUrl: 'https://th.bing.com/th/id/OIP.fJpguE7TKM1xxbI07hWWSQHaHa?pid=ImgDet&rs=1',

        title1: "Working Voltage: 5 to 12VDC",
        title2: "Max current draw: 15mA @ 5V",
        title3: "Working Flow Rate: 0.3 to 6 Liters/Minute",
        title4: "Pulses per Liter: 5880",

  },
  {
    title: '5V Single-Channel Relay Module',
    imageUrl: 'https://th.bing.com/th/id/OIP.HoLb9aOnAo_3W1V1mI1GNQHaHa?pid=ImgDet&rs=1',

        title1: "Supply voltage: 3.75V to 6V",
        title2: "Trigger current: 5mA",
        title3: "Current when relay is active: ~70mA(single), ~140mA(double)",
        title4: "Relay maximum current: 10A",

  },
];


const Cards = ({ title, imageUrl, title1, title2, title3, title4 }) => {
    const [isFlipped, setIsFlipped] = useState(false);
  
    const flipCard = () => {
      setIsFlipped(!isFlipped);
    };

  return (
    // <div className="card">
    <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
      <div className="flip-card-inner">
        <div className='flip-card-front'>
            <i onClick={flipCard} className="fas fa-info"></i>
            <img src={imageUrl} height={"300px"} className="card-img-top" alt={title} />
            <h5 className="card-title text-center m-1">{title}</h5>
        </div>
        <div className='flip-card-back'>
        <i onClick={flipCard} className="far fa-window-close"></i>
            <h2 className='mt-2 ms-2'>Specification</h2>
            <div className="card-text ms-2">
                <ol type='1'>
                    {/* <div>{spec}</div> */}
                    <li className='mt-2 mb-2'>{title1}</li>
                    <li className='mt-1 mb-2'>{title2}</li>
                    <li className='mt-1 mb-2'>{title3}</li>
                    <li className='mt-1 mb-2'>{title4}</li>
                </ol>
            </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

const MultipleFlipCard = () => {
  return (
    <div className="container">
      <div className='row'>
        {
            cardsData.map(card => (
                <div className='col-md-6 col-lg-4' key={card.title}>
                    <Cards {...card} />
                </div>
            ))
        }
      </div>
    </div>
  );
};

export default MultipleFlipCard
