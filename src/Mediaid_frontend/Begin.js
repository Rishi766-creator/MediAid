import React from 'react';
import docImg from "./doc.png";
import donor from "./donor.png";
import phar from "./phar.png";
import profile from "./profile.png";
import sym from "./sym.png";
import about from "./about.png";

import { FaStethoscope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const Begin = () => {
    const nav=useNavigate();
function log(){
    nav('/login');
}

  return (
    <div className="w-full ">
        <nav className="flex justify-between items-center sticky top-0 p-3 bg-blue-200" >
            <div className="flex items-center text-3xl font-bold">
                <FaStethoscope className="text-blue-700 text-3xl ml-2 mr-1" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-900">
                MediAid
                </span>
            </div>
            <div>            
                <ul className="list-type-none flex gap-x-12 mr-32 text-blue-900 font-medium text-lg ">
                <li className='hover:text-blue-500  transition-all duration-100 '><a href="#home">Home</a></li>
                 <li className='hover:text-blue-500  transition-all duration-100'><a href="#features">Services</a></li>
                <li className='hover:text-blue-500  transition-all duration-100'><a href="#about">About</a></li>
                <li className='hover:text-blue-500  transition-all duration-100  ' onClick={log}><a href="#">Login</a></li>
                
            </ul>
            </div>

        </nav>

        <div className='h-screen bg-gradient-to-b from-blue-200 to-white' id="home">        
            
      <div className="flex  w-full h-screen ">
               
        <div className="flex flex-col justify-center text-blue-900 font-serif ml-10 max-w-lg">
          <h1 className="text-5xl md:text-7xl font-bold">MediAid</h1>
          <h2 className="mt-5 text-xl md:text-2xl">Diagnose, Decide, Deliver Care</h2>
          <p className="mt-10 font-sans text-base md:text-lg">
            Your one-stop platform to check Symptoms, find donors & medicines, 
            and track your health - all in one secure place.
          </p>
                  <button className='bg-blue-900 rounded-md mt-7 text-white text-xl p-2 font-sans w-[40%] font-medium hover:bg-blue-500 transition-all delay-50 '><a href="#features">Get Started</a></button>

        </div>

        
        <div className="flex-1 flex items-center justify-center">
          <img src={docImg} alt="Doctor Illustration" className="h-full object-contain" />
        </div>
        
        </div>
 

      </div>
      <div className=' mt-10  w-full flex flex-col items-center justify-center ' id="features">
        <h1 className="text-5xl font-semibold text-blue-900 font-serif  my-10">What we Offer</h1>
        <div className='grid grid-cols-2 gap-48 mt-20 mx-10'>
            <div onClick={()=>{nav('/dia')}} className="bg-gradient-to-b from-blue-200 to-white-100 p-5 rounded-xl shadow-xl flex flex-col justify-center items-center"><div><img src={sym} className='w-[300px] h-[300px]'></img></div><div><p className='text-3xl text-blue-900 font-bold mb-5'>eDiagnosis</p><p className="text-xl p-2">Quickly check your symptoms and get guidance on next steps.</p></div></div>
            <div onClick={()=>{nav('/find')}} className="bg-gradient-to-b from-blue-200 to-white-100 p-5 rounded-xl shadow-xl flex flex-col justify-center items-center"><div><img src={donor} className='w-[300px] h-[300px]'></img></div><div><p className='text-3xl text-red-900 font-bold mb-5'>DonorFinder</p><p className="text-xl p-2">Locate blood and organ donors easily with our database</p></div></div>
            <div onClick={()=>{nav('/pills')}} className="bg-gradient-to-b from-blue-200 to-white-100 p-5 rounded-xl  shadow-xl flex flex-col justify-center items-center"><div><img src={phar} className='w-[300px] h-[300px]'></img></div><div><p className='text-3xl text-yellow-900 font-bold mb-5'>ePharmacy</p><p className="text-xl p-2">Search for medicines and availability near you quickly</p></div></div>
            <div  onClick={()=>{nav('/profile')}} className="bg-gradient-to-b from-blue-200 to-white-100 p-5 rounded-xl  shadow-xl flex flex-col justify-center items-center"><div><img src={profile} className='w-[300px] h-[300px]'></img></div><div><p className='text-3xl text-purple-900 font-bold mb-5'>Profile</p><p className="text-xl p-2">Keep track of your health records and monitor your progress</p></div></div>

        </div>
      </div>
      <div className="flex flex-col justify-center items-center bg-gradient-to-b from-blue-200 to-white rounded-lg mt-48 ml-5 mb-10 shadow-xl  " id="about">
        <h1 className="text-5xl text-blue-900 font-serif pt-10 font-semibold">About</h1>
        <div className='flex justify-center items-center p-2'>
            <div><p className="px-4 text-lg">MediaID is a comprehensive healthcare application designed to simplify and enhance the way individuals manage their health. It allows users to receive accurate diagnoses, find suitable donors, access essential medicines, and monitor their health seamlessly—all in one platform. With user-friendly interfaces and secure data storage, MediaID ensures that critical health information is easily accessible while maintaining privacy and safety. The app combines automated detection with user inputs to provide personalized recommendations, timely alerts, and efficient connections with healthcare resources, making healthcare management faster, smarter, and more reliable for everyone.</p></div>
            <div><img src={about} className="w-[2500px] h-[500px]"></img></div>
        </div>
      </div>
     
</div>


    
    
    
  );
};

export default Begin;
