import React from "react";
import Temperature from "./subdashComp/Temperature";
import Humidity from "./subdashComp/Humidity";
import TempHumidSummary from "./subdashComp/TempHumidSummary";
import StockCountIn from "./subdashComp/StockCountIn";
import StockCountOut from "./subdashComp/StockCountOut";
import StocksSummary from "./subdashComp/StocksSummary";
import DataTable from "./subdashComp/DataTable";
import TempChart from "./subdashComp/TempChart";
import HumidChart from "./subdashComp/HumidChart";

export default function DashComponents() {
  return (
    // main container
    <div className="flex flex-col gap-20 p-8 mx-auto w-full">

      {/* DataTable, Temperature, Humidity, StockCountIn, StockCountOut, TempHumidSummary, StocksSummary */}
      <div className="flex flex-col gap-4 mx-auto w-full xl:flex-row">

        {/* Temperature, Humidity, TempHumidSummary, StockCountIn, StockCountOut, StocksSummary */}
        <div className="flex-1 flex-col mx-auto sm:flex-row">
          
          {/* Temperature, Humidity, TempHumidSummary */}
          <div className="flex p-2 flex-col gap-3 mb-2  bg-gray-200 shadow-2xl">

            {/* Temperature, Humidity */}
            <div className="flex flex-col gap-2 sm:flex-row mx-auto w-full">

              {/* Temperature */}
              <div className="flex-1">
                <h3 className="text-left text-teal-900 font-semibold border-b-2 border-gray-500 mb-7 pb-2">
                  Current Temperature
                </h3>
                <Temperature/>
              </div>

              {/* Humidity */}
              <div className="flex-1">
                <h3 className="text-left text-teal-900 font-semibold border-b-2 border-gray-500 mb-7 pb-2">
                  Current Humidity
                </h3>
                <Humidity/>
              </div>

            </div>

            {/* TempHumidSummary */}
            <div className="pl-4 pr-4">
              <TempHumidSummary/>
            </div>

          </div>

          {/* StockCountIn, StockCountOut, StocksSummary */}
          <div className="flex p-2 flex-col gap-3 mb-2  bg-gray-200 shadow-2xl">
            
            {/* StockCountIn, StockCountOut */}
            <div className="flex flex-col gap-2 sm:flex-row mx-auto w-full">

              {/* StockCountIn */}
              <div className="flex-1">
                <h3 className="text-left text-teal-900 font-semibold border-b-2 border-gray-500 mb-7 pb-2">
                  Available Stocks
                </h3>
                <div className="flex items-center justify-center">
                  <StockCountIn/>
                </div>
                
              </div>

              {/* StockCountOut */}
              <div className="flex-1">
                <h3 className="text-left text-teal-900 font-semibold border-b-2 border-gray-500 mb-7 pb-2">
                  Unloaded Stocks
                </h3>
                <div className="flex items-center justify-center">
                  <StockCountOut/>
                </div>
              </div>

            </div>

            {/* StocksSummary */}
            <div className="pl-4 pr-4">
              <StocksSummary/>
            </div>

          </div>

        </div>
        
        {/* DataTable */}
        <div className="flex-1 w-full">
          <DataTable />
        </div>

      </div>

      <div className="border-b-2 border-gray-300 ">
        <span className="text-4xl text-gray-300 font-bold">Analytics</span>
      </div>

      {/* TempChart, HumidChart, StocksChart */}
      <div className="flex flex-col gap-10 w-full">
        <div>
          <h1 className="text-xl text-slate-700 text-center font-semibold">Temperature</h1>
          <TempChart/>
        </div>
        <div>
          <h1 className="text-xl text-slate-700 text-center font-semibold">Relative Humidity</h1>
          <HumidChart/>
        </div>
        <div></div>
      </div>
      
    </div>
  );
}
