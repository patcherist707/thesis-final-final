import React from "react";
import Temperature from "./subdashComp/Temperature";
import Humidity from "./subdashComp/Humidity";
import TempHumidSummary from "./subdashComp/TempHumidSummary";
import StockCountIn from "./subdashComp/StockCountIn";
import StockCountOut from "./subdashComp/StockCountOut";
import StocksSummary from "./subdashComp/StocksSummary";
import DataTable from "./subdashComp/DataTable";
import TempHumidChart from "./subdashComp/TempHumidChart";
import StocksChart from "./subdashComp/StocksChart";
import { Paper } from "@mui/material";
import Alert from "./Alert";

export default function DashComponents() {
  return (
    <div>
      <Alert/>
      <div className="flex flex-col gap-20 p-11 mx-auto w-full">
        

        {/* DataTable, Temperature, Humidity, StockCountIn, StockCountOut, TempHumidSummary, StocksSummary */}
        <div>
          <div className="border-b-2 border-gray-300 mb-8">
            <span className="text-4xl text-gray-300 font-bold">Real-Time Stock & Environment Data</span>
          </div>
          <div className="flex flex-col gap-4 mx-auto w-full xl:flex-row">
            

            {/* Temperature, Humidity, TempHumidSummary, StockCountIn, StockCountOut, StocksSummary */}
            <div className="flex-1 flex-col mx-auto sm:flex-row">
              
              {/* Temperature, Humidity, TempHumidSummary */}
              <Paper className="flex p-2 flex-col gap-3 mb-10  bg-gray-200 shadow-2xl">

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



              </Paper>

              {/* StockCountIn, StockCountOut, StocksSummary */}
              <Paper className="flex p-2 flex-col gap-3 mb-5  bg-gray-200 shadow-2xl">
                
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

              </Paper>

            </div>
            
            {/* DataTable */}
            <Paper className="flex-1 w-full">
              <DataTable />
            </Paper>

          </div>
        </div>
        

        {/* TempChart, HumidChart, StocksChart */}
        <div className="flex flex-col gap-10 w-full">
          <div className="border-b-2 border-gray-300 ">
            <span className="text-4xl text-gray-300 font-bold">Storage Conditions Graph</span>
          </div>
          <div>
            <TempHumidChart/>
          </div>
          <div>
            <div className="border-b-2 border-gray-300 ">
              <span className="text-4xl text-gray-300 font-bold">Stock Flow Trends</span>
            </div>
            <StocksChart/>
          </div>
        </div>
        
      </div>
    </div>
  );
}
