import { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import { userAgent } from 'next/server'
import axios from 'axios'
import { ChatOpenAI } from "langchain/chat_models";

import TypingAnimation from './components/TypingAnimation'
import { HumanChatMessage } from 'langchain/schema';
import { CallbackManager } from 'langchain/callbacks';





export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [answer, setAnswer] = useState("")
  const [chatlog, setChatlog] = useState([])
  const [isloading, setIsloading] = useState(false)
  const resultRef = useRef()



  const KEY = "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"




  async function sendMessagesLang(message) {


  const response = await axios.post('/api/agentServerSide', {input: message})
  
  console.log(response)

  setChatlog((prevChatlog) => [...prevChatlog, {type:"bot", message: response.data.output}])
  


 
  
  
  setIsloading(false)


  }

  async function handleSubmit(e) {
    e.preventDefault()
    


    

    setChatlog((prevChatlog) => [...prevChatlog, {type:"user", message: inputValue}])
    setIsloading(true)
    sendMessagesLang(inputValue)

    setInputValue('')
  }
 
/* 
  const sendMessages = (message) => {
    const axios = require('axios')

    const client = axios.create({
      headers: {
        Authorization: "Bearer " + KEY,
      },
    });


    const params = {
      messages: [{"role": "user", "content": message}],
      model: "gpt-3.5-turbo",

    };

    client.post("https://api.openai.com/v1/chat/completions", params).then((response) => {

      setChatlog((prevChatlog) => [...prevChatlog, {type:"bot", message: response.data.choices[0].message.content}])
      setIsloading(false)
    }).catch((error) => {
      setIsloading(false)
      console.log(error)
    })
    
  }
*/
  return (
    <>
    <div className='bg-gray-800 h-screen'>
    <div className='container mx-auto h-full w-5/6 py-3'>
    <h1 className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center font-bold text-5xl pb-4'>V2.1</h1>
      <div className='flex flex-col h-4/6 bg-gray-900 my rounded-lg h-1/ overflow-y-scroll'>
        
          <div className='flex-grow p-6'>
            <div className='flex flex-col space-y-4'>

      {
  chatlog.map((message, index) => {
    if (message.type === 'bot') {
      return (
        <div key={index} className='flex justify-start'>
          <div className='bg-gray-800 rounded-lg p-4 text-white max-w-2xl break-words'>
            {message.message}
          </div>
        </div>
      );
    } else if (message.type === 'user') {
      return (
        <div key={index} className='flex justify-end'>
          <div className='bg-purple-500 rounded-lg p-4 text-white max-w-2xl break-words'>
            {message.message}
          </div>
        </div>
      );
    }
    return null; // Ignore messages with unknown type
  })
}

      {
        isloading && 
        <div key={chatlog.length} className='flex justify-start'>
          <div className='bg-gray-800 rounded-lg p-4 text-white max-w-2xl'>
            <TypingAnimation />
          </div>
        </div>
      }
            
            </div> 
          </div> 

          </div>
      <form onSubmit={handleSubmit} className='flex-none p-1 '>
        <div className='flex rounded-lg border border-gray-700 bg gray-800'>
        <input type="text" className='flex-grow px-4 py-2 bg-transparent text-white focus:outline-none' placeholder='Ask something' value={inputValue} onChange={(e)=> setInputValue(e.target.value)} />
        <button type='submit' className='bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300'>Send</button>
        </div>
      </form>

      
    </div>
    </div>
    </>
  )
}

