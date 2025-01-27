import React from "react";
import { useProjectPromptContext } from "../context/ProjectPromptContext";
import { TbLoader2 } from "react-icons/tb";
import { Link } from "react-router-dom";

const ProjectPrompt = () => {
    const { setProjectPrompt, projectPrompt } = useProjectPromptContext()
    const handleChange = (event) => {
        setProjectPrompt(event.target.value);
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-zinc-300 rounded-lg">
            <label className="block text-lg font-medium mb-2" htmlFor="projectPrompt">
                Enter Project Prompt:
            </label>
            <textarea
                id="projectPrompt"
                value={projectPrompt}
                onChange={handleChange}
                rows="5"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write your project prompt here..."
            />
            <Link to={'requirements-gathering'} className="text-blue-600 underline hover:text-blue-500 cursor-pointer">
                Not sure about the requirements?
            </Link>
            <p className="mt-4 text-sm text-gray-500">
                <strong>Saved Prompt:</strong> {projectPrompt || "No prompt entered yet"}
            </p>
        </div>
    );
};

export default ProjectPrompt;
