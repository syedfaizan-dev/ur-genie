import React, { useState } from "react";
import { useProjectPromptContext } from "../context/ProjectPromptContext";
import { TbLoader2 } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import useOpenApi from "../hooks/useOpenApi";
import Button from "../common/Button";
import Input from "../common/Input";

const ProjectPrompt = () => {
    const { setProjectPrompt, projectPrompt } = useProjectPromptContext()
    const { isFetching, error, fetchResponse } = useOpenApi();
    const navigate = useNavigate()
    const handleChange = (event) => {
        setProjectPrompt(event.target.value);
    };
    const handleGenerate = async () => {
        if (projectPrompt.trim() === "") return;
        const weightageresponse = await fetchResponse([
            {
                role: "user", content: `you will check this user prompt "${projectPrompt}" based on user responses you will note all the requirements user want for the project
              and then set the weightage based on how much specific requirements it has or it is more high level. the weightage will be zero if there is no requirement in 
              the prompt from user and just random talk. the weightage will be high if it is very detailed and specific and the weightage will be low if it is more high level. 
            and you will send that weightage only. your response will only a number between 0-100 nothing else not even full stop just a number.`}
        ])
        try {
            const weightage = Number(weightageresponse)
            if (weightage < 50) {
                navigate('requirements-gathering')
            }
        } catch (e) {
            console.error(e)
        }
    };
    return (
        <div className="flex flex-col max-w-xl mx-auto p-4 bg-zinc-300 rounded-lg mt-20">
            <label className="block text-lg font-medium mb-2" htmlFor="projectPrompt">
                Enter Project Prompt:
            </label>
            <Input
                id="projectPrompt"
                value={projectPrompt}
                onChange={handleChange}
                placeholder="Write your project prompt here..."
            />
            <Link to={'requirements-gathering'} className="text-blue-600 underline hover:text-blue-500 cursor-pointer w-fit">
                Not sure about the requirements?
            </Link>
            <Button onClick={handleGenerate} isLoading={isFetching} className="mt-4">Generate</Button>
        </div>
    );
};

export default ProjectPrompt;
