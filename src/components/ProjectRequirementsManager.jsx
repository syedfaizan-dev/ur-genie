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
import Input from "../common/Input";
import Button from "../common/Button";

const ProjectRequirementsManager = () => {
  const { projectPrompt } = useProjectPromptContext();
  const [prompt, setPrompt] = useState([{ role: "system", content: SYSTEM_PROMPT }]);
  const [userPrompt, setUserPrompt] = useState(projectPrompt);
  const [document, setDocument] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canStop, setCanStop] = useState(false);
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
      const parsedResponse = JSON.parse(response)
      if (!canStop) {
        if (typeof parsedResponse.canStop === "string") {
          parsedResponse.canStop = parsedResponse.canStop.toLowerCase() === "true";
        }
        setCanStop(parsedResponse.canStop)
        if (parsedResponse.canStop) {
          setIsReminderModal(true)
        }
      }
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

  const handleChange = (e) => {
    setUserPrompt(e.target.value);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 p-10 flex flex-col">
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
            .map((msg, index) => {
              if (msg.role === "assistant") {
                const content = JSON.parse(msg.content)
                return <MessageBubble message={content.text} role={msg.role} key={index} />
              }
              return <MessageBubble message={msg.content} role={msg.role} key={index} />

            })}
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
            <div className="flex-1">
              <Input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                type="text"
                value={userPrompt}
                onChange={handleChange}
                placeholder="Type your message..."
              />
            </div>
            <Button
              onClick={handleSend}
              variant="royal"
            >
              <IoSend size={24} />
            </Button>
            {canStop && <Button
              onClick={handleGenerateDocument}
              variant="danger"
            >
              Stop
            </Button>}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
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
          <h2 className="text-lg font-bold mb-4">Proceed with Document Generation?</h2>
          <p className="text-gray-600 mb-6">
            Your requirements are now sufficient to proceed with generating the project document.
            You may stop chatting and generate the document at this point.
            However, if you wish to refine or add further details, feel free to continue the conversation
          </p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => { setIsReminderModal(false) }}
              variant="danger"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateDocument}
              variant="forest"
            >
              Generate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );

};

export default ProjectRequirementsManager;
