'use client'

import MainLayoutPage from "@/components/mainLayout";
import { mont } from "@/config/fonts";
import { ioServer } from "@/lib/io";
import { faList, faPieChart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {

  const [display, setDisplay] = useState('simple')

  const [socketConnected, setSocketConnected] = useState(false)

  useEffect(() => {
    if(ioServer.connected) {
      setSocketConnected(true)
      console.log('Server Socket is Connected!')
    }

    ioServer.on('connect', () => {
      setSocketConnected(true)
      console.log('Server Socket is Connected!')
    })
    
    ioServer.on('disconnect', () => {
      setSocketConnected(false)
      console.log('Server Socket is Disconnected!')
    })

    return () => {
      ioServer.off('connect', () => {
        setSocketConnected(true)
        console.log('Server Socket is Connected!')
      })

      ioServer.off('disconnect', () => {
        setSocketConnected(false)
        console.log('Server Socket is Disconnected!')
      })
    }
  }, [])

  return (
    <MainLayoutPage>
      <Toaster />
      <div className="mt-5">
        <div className="flex items-center gap-5 w-full md:w-fit">
          <button type="button" onClick={() => setDisplay('simple')} disabled={display === 'simple'} className={`px-4 py-2 w-full md:w-fit rounded-full ${display === 'simple' ? 'bg-zinc-200' : 'bg-zinc-50 hover:bg-zinc-100 focus:bg-zinc-200'} text-zinc-700 flex items-center justify-center gap-3 text-xl md:text-2xl`}>
            <FontAwesomeIcon icon={faList} className="w-4 h-4 text-inherit" />
            Simple
          </button>
          <button type="button" onClick={() => setDisplay('chart')} disabled={display === 'chart'} className={`px-4 py-2 w-full md:w-fit rounded-full ${display === 'chart' ? 'bg-zinc-200' : 'bg-zinc-50 hover:bg-zinc-100 focus:bg-zinc-200'} text-zinc-700 flex items-center justify-center gap-3 text-xl md:text-2xl`}>
            <FontAwesomeIcon icon={faPieChart} className="w-4 h-4 text-inherit" />
            Chart
          </button>
        </div>
        <hr className="my-3 opacity-0" />
        {display === 'simple' && (
          <div className="">This is Display Simple</div>
        )}
        {display === 'chart' && (
          <div className={`${mont.className}`}>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="p-5 rounded-lg border w-full md:w-1/3">
                <div className="flex items-center">
                  <div className="radial-progress text-primary" style={{"--value":70}} role="progressbar">70%</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </MainLayoutPage>
  );
}
