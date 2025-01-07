import React, { useState } from "react";
import "./App.css";
import { IoCodeSlash, IoSend } from "react-icons/io5";
import { BiPlanet } from "react-icons/bi";
import { FaPython } from "react-icons/fa";
import { TbMessageChatbot } from "react-icons/tb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [message, setMessage] = useState("");
  const [isResponseScreen, setIsResponseScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false); // New state to track loading

  const hitRequest = () => {
    if (message) {
      generateResponse(message);
    } else {
      alert("You must write something... !");
    }
  };

  const generateResponse = async (msg) => {
    if (!msg) return;

    setIsGenerating(true); // Start loading
    const genAI = new GoogleGenerativeAI("AIzaSyBMsipETuFtEbykNNRxRD_zSX-cIi2r0g4");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const newMessages = [...messages, { type: "userMsg", text: msg }];
    setMessages(newMessages); // Add user message immediately
    setMessage(""); // Clear input field

    try {
      const result = await model.generateContent(msg);

      setMessages([
        ...newMessages,
        { type: "responseMsg", text: result.response.text() },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { type: "responseMsg", text: "Failed to generate a response. Please try again." },
      ]);
    } finally {
      setIsGenerating(false); // Stop loading
      setIsResponseScreen(true);
    }
  };

  const newChat = () => {
    setIsResponseScreen(false);
    setMessages([]);
  };

  return (
    <>
      <div className="w-screen h-screen overflow-hidden bg-[#0E0E0E] text-white flex flex-col">
        {isResponseScreen ? (
          <>
            <div className="header pt-[25px] flex items-center justify-between w-full px-[300px]">
              <h2 className="text-2xl">AssistMe</h2>
              <button
                id="newChatBtn"
                className="bg-[#181818] p-[10px] rounded-[30px] cursor-pointer text-[14px] px-[20px]"
                onClick={newChat}
              >
                New Chat
              </button>
            </div>

            <div className="messages flex-grow overflow-y-auto">
              {messages?.map((msg, index) => (
                <div key={index} className={msg.type}>
                  {msg.text}
                </div>
              ))}

              {/* Generating response placeholder */}
              {isGenerating && (
                <div className="responseMsg">
                  <i>Generating response...</i>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="middle h-[80vh] flex items-center flex-col justify-center">
            <h1 className="text-4xl">AssistMe</h1>
            <div className="boxes mt-[30px] flex items-center gap-2">
              <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
                <p className="text-[18px]">
                  What is coding? <br />
                  How we can learn it.
                </p>
                <i className="absolute right-3 bottom-3 text-[18px]">
                  <IoCodeSlash />
                </i>
              </div>
              <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
                <p className="text-[18px]">
                  Which is the red <br />
                  planet of solar <br />
                  system
                </p>
                <i className="absolute right-3 bottom-3 text-[18px]">
                  <BiPlanet />
                </i>
              </div>
              <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
                <p className="text-[18px]">
                  In which year python <br />
                  was invented?
                </p>
                <i className="absolute right-3 bottom-3 text-[18px]">
                  <FaPython />
                </i>
              </div>
              <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
                <p className="text-[18px]">
                  How we can use <br />
                  the AI for adopt?
                </p>
                <i className="absolute right-3 bottom-3 text-[18px]">
                  <TbMessageChatbot />
                </i>
              </div>
            </div>
          </div>
        )}

        <div className="inputBox w-[60%] text-[15px] py-[7px] flex items-center bg-[#181818] rounded-[30px] mx-auto mb-5 fixed bottom-5 left-1/2 transform -translate-x-1/2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="p-[10px] pl-[15px] bg-transparent flex-1 outline-none border-none"
            placeholder="Write your message here..."
            id="messageBox"
          />
          {message === "" ? null : (
            <i
              className="text-green-500 text-[20px] mr-5 cursor-pointer"
              onClick={hitRequest}
            >
              <IoSend />
            </i>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
