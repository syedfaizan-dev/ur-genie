import React, { useState, useEffect, useRef } from "react";
import useOpenApi from "../hooks/useOpenApi";
import { SYSTEM_PROMPT } from "../constants";
import { useProjectPromptContext } from "../context/ProjectPromptContext";
import tellingGenie from "../assets/tellingGenie.json";
import thinkingGenie from "../assets/thinkingGenie.json";
import Lottie from "lottie-react";
import Modal from "../common/Modal";
import { TbLoader2 } from "react-icons/tb";
import RequirementDocument from "./RequirementDocument";
import MessageBubble from "../common/MessageBubble";
import { IoSend } from "react-icons/io5";

const ProjectRequirementsManager = () => {
  const { projectPrompt } = useProjectPromptContext();
  const [prompt, setPrompt] = useState([{ role: "system", content: SYSTEM_PROMPT }]);
  const [userPrompt, setUserPrompt] = useState(projectPrompt);
  const [document, setDocument] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemainderModal, setIsReminderModal] = useState(false);
  const { isFetching, error, fetchResponse } = useOpenApi();
  const firstRender = useRef(true);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (firstRender.current) {
      handleSend();
      firstRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [prompt, isFetching]);

  const handleSend = async () => {
    if (!userPrompt.trim()) return;

    const updatedPrompt = [
      ...prompt,
      { role: "user", content: userPrompt }
    ];

    setPrompt(updatedPrompt); // Update state
    setUserPrompt(""); // Clear the input

    const response = await fetchResponse(updatedPrompt); // Use the updated prompt
    if (response) {
      setPrompt((prevPrompt) => [
        ...prevPrompt,
        { role: "assistant", content: response }
      ]);
    }
  };

  const handleGenerateDocument = async () => {
    setIsReminderModal(false);
    setIsModalOpen(true);

    setUserPrompt(""); // Clear the input

    const response = await fetchResponse([
      ...prompt,
      {
        role: "user", content: `Write a Requirements document for the requirements based on our conversation.
        you will check our previous conversation and based on user responses you will note down all the 
        requirements user want for the project. Only add those requirements that are from user interest. 
        If user have not shown interest to some questions or features then they must not add . 
        you must analyze the conversation that where user has the interest. If the user did'nt response to any requirement question then dont include it 
          
        Please respond strictly in the following format only no text just json in the below format. just start your response with curly brace and start generating json format response document:
        {
          "title": "Project Requirements",
          "projectTitle": "Project name",
          "sections": [
            {
              "sectionTitle": "Feature 1",
              "stories": [
                "Story 1 for feature 1",
                "Story 2 for feature 1"
              ]
            },
            {
              "sectionTitle": "Feature 2",
              "stories": [
                "Story 1 for feature 2"
              ]
            }
          ]
        }` 
      }
    ]); // Use the updated prompt
    if (response) {
      try {
        const formattedResponse = JSON.parse(response);
        setDocument(formattedResponse); // Store the structured response
      } catch (error) {
        console.error("Error parsing response:", error);
        setDocument("The response could not be formatted. Please try again.");
      }
    }
  }

  const handleStop = async () => {
    const weightageresponse = await fetchResponse([
      ...prompt,
      {
        role: "user", content: `you will check our previous conversation and based on user responses you will note down all the requirements user want for the project
          and then set the weightage based on how much specific requirements it has or it is more high level. the weightage will be zero if there is no requirement in 
          the coversation from user and just random talk. the weightage will be high if it is very detailed and specific and the weightage will be low if it is more high level. 
        and you will send that weightage only. your response will only a number between 0-100 nothing else not even full stop just a number. `}
    ])
    try {
      const weightage = Number(weightageresponse)
      if (weightage < 50) {
        setIsReminderModal(true)
      } else {
        handleGenerateDocument()
      }
    } catch (e) {
      console.error(e)
    }
  };

  const handleChange = (e) => {
    setUserPrompt(e.target.value);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className=" flex-1 p-10 w-1/2 flex flex-col">
        {/* header */}
        <div className="h-20 flex items-center bg-purple-800 text-white rounded-t-lg shadow-lg p-3">
          <img
            src="genie.svg"
            alt="Genie"
            className="h-12 w-12 mr-3 rounded-full bg-white"
          />
          <h1 className="text-lg font-bold tracking-wide">UR Genie✨</h1>
        </div>
        {/* chat box */}
        <div
          ref={chatContainerRef}
          className="flex-1 flex flex-col overflow-y-auto px-4 bg-white"
        >
          {prompt
            .filter((msg) => msg.role !== "system")
            .map((msg, index) => (
              <MessageBubble message={msg.content} role={msg.role} key={index}/>
            ))}
          {isFetching && (
            <div className="text-gray-500 text-sm self-start">Genie is thinking...</div>
          )}
          {error && (
            <div className="text-red-500 text-sm p-4">
              <p>
                {typeof error === "object"
                  ? error.message || JSON.stringify(error)
                  : error}
              </p>
            </div>
          )}
        </div>
        {/* input */}
        <div className="p-4 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              type="text"
              value={userPrompt}
              onChange={handleChange}
              placeholder="Type your message..."
              className="flex-1 border border-gray-600 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <button
              onClick={handleSend}
              className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900 cursor-pointer"
            >
              <IoSend size={20}/>
            </button>
            <button
              onClick={handleStop}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
            >
              Stop
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Lottie
          animationData={isFetching ? thinkingGenie : tellingGenie}
          loop={true}
          style={{
          }}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-w-md  p-6 rounded-xl">
          {isFetching ? (
            <TbLoader2 size={30} className="animate-spin" />
          ) : (
            <RequirementDocument document={document} />
          )}
        </div>
      </Modal>
      <Modal isOpen={isRemainderModal} onClose={() => setIsReminderModal(false)}>
        <div className="max-w-md  p-6 rounded-xl">
          <h2 className="text-lg font-bold mb-4">Proceed with High-Level Requirements?</h2>
          <p className="text-gray-600 mb-6">
            Your requirements seem to be more high-level and lack detailed specifics.
            Are you sure you want to proceed? Keep in mind that high-level requirements
            might result in a project that doesn’t fully meet your expectations.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setIsReminderModal(false) }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateDocument}
              className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900 cursor-pointer"
            >
              Proceed
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );

};

export default ProjectRequirementsManager;
