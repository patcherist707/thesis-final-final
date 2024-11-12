import React from "react";

export default function About() {
  return (
   <section className="container mx-auto md:pl-56 mt-40 mb-40"> 
    <div className="flex flex-col md:flex-row items-center gap-10 p-4 md:p-0">
          <div className="mb-4 md:mb-0 border border-dashed border-[#4f3e2d] p-2">
            <img src="/Rice About.png" className="h-[400px] w-[400px]" alt="About"/>
          </div>
            <div className="md:w-1/2 md:ml-4 text-justify">
              <h2 className="text-4xl font-bold mb-4 text-[#4f3e2d]" >About Website</h2>
              <p className="mb-4 leading-8">Warehouse Management System is an essential monitoring system in reaching standardized production levels for good supply chain and a requirement needed for highly efficient and effective warehouse management. The website dashboard enables the user to monitor the data provided by the installed sensors and specific components.</p>
              <p className="mb-4 leading-8">Our research study about this system aims to improve rice quality provided by the system which guarantees that the stored rice grain is highly maintained.</p>
            </div>    
    </div>
    
    <div className="flex flex-col md:flex-row items-center gap-10 p-4 md:p-0 mt-24">
          <div className="md:w-1/2 md:ml-4 text-justify">
            <h2 className="text-4xl font-bold mb-4 text-[#4f3e2d]" >About Us</h2>
            <p className="mb-4 leading-8">We are the researchers of this thesis entitled IoT-Based Monitoring System for Storage Warehouse. We are composed of two students namely: Ruhayna Adje and Patricia Madeth Buna. We, the researchers, are currently studying from Bachelor of Science in Computer Engineering program of the College of Engineering Education at University of Mindanao. </p>
            <p className="mb-4 leading-8">We aim to develop a monitoring system for rice storage warehouse with the application of IoT, which automates the process of monitoring grain storage conditions that reduces the risk of grain loss due to changes in temperature and humidity.</p>
          </div>
            <div className="mt-24 mb-4 border border-dashed border-[#4f3e2d] p-2">
              <img src="/About Us.jpg" className="h-[400px] w-[400px]" alt="About"/>
            </div>    
    </div>

   </section>
  );
}
