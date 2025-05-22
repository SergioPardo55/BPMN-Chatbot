import React, { useContext, useState, useRef } from "react";  useRef
import './Main.css'
import { assets } from "../../assets/assets";
import { Context } from "../../context/AppContext"; // Updated import path

const Main =() =>{

        const {
            onSent,recentPrompt,showResult,loading,resultData,setInput,input,
            prevPrompts, 
            prevResults, 
            prepareStartModellingScratch, 
            prepareCreateFromDescription, 
            prepareCreateTemplate,
            prepareGenerateModel, 
            prepareRecommendUpload, 
            prepareAnalyzeProcessModel,
            cancelPreparedAction, 
            prepareAppianQuery,
            toggleIncludeDiagram,
            toggleAppianQuery, 
            includeDiagramInPrompt, 
            renderDiagram,
            appianQuery
        } = useContext(Context);
        
        const [awaitingFileUploadForAction, setAwaitingFileUploadForAction] = useState(null); // This is the correct local state
        const [selectedFile, setSelectedFile] = useState(null);
        const [selectedFileName, setSelectedFileName] = useState("");
        const fileInputRef = useRef(null); // Ref for file input

        const handleStartModellingClick = () => {
            prepareStartModellingScratch();
        };

        const handleCreateFromDescriptionClick = () => {
            prepareCreateFromDescription();
        };

        const handleCreateTemplateClick = () => {
            prepareCreateTemplate();
        };

        const handleGenerateModelClick = () => { 
            prepareGenerateModel();
        };

        const handleAppianQueryClick = () => {
            prepareAppianQuery();
        };

        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            if (file && file.name.endsWith('.bpmn')) {
                setSelectedFile(file);
                setSelectedFileName(file.name);
            } else {
                alert("Please select a valid .bpmn file.");
                setSelectedFile(null);
                setSelectedFileName("");
                event.target.value = null; // Clear the file input
            }
        };

        const processUploadedFile = async () => {
            if (!selectedFile || !awaitingFileUploadForAction) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileContent = e.target.result;
                let aiQueryText = "";
                let userFacingPromptText = "";

                if (awaitingFileUploadForAction === 'analyze') {
                    aiQueryText = `You are a process modelling advisor and will be given the BPMN 2.0 XML code of a Business Process. Your job is to analyze it and identify improvement opportunities like logic flaws, optimization of time and resources. You will output a concise explanation of the imrpovements and your proposed BPMN 2.0 XML code with the implementation. (file: ${selectedFileName}):\\n\\n${fileContent}`;
                    userFacingPromptText = `Analyze process model: ${selectedFileName}`;
                } else if (awaitingFileUploadForAction === 'recommend') {
                    aiQueryText = `You are a process modelling advisor and will be given an incomplete BPMN 2.0 XML code of a Business Process. You must analyze it and reccomend the next possible steps. Output the code for with the most probable next step.  (file: ${selectedFileName}), please recommend next elements:\\n\\n${fileContent}`;
                    userFacingPromptText = `Recommend next elements: ${selectedFileName}`;
                }
                
                if (aiQueryText && userFacingPromptText) {
                    onSent({
                        queryForAI: aiQueryText,
                        userFacingPrompt: userFacingPromptText
                    });
                }
                // Reset states after processing
                setAwaitingFileUploadForAction(null);
                setSelectedFile(null);
                setSelectedFileName("");
            };
            reader.onerror = (e) => {
                console.error("Error reading file:", e);
                setResultData("Error reading the BPMN file. Please try again.");
                // Reset states on error
                setAwaitingFileUploadForAction(null);
                setSelectedFile(null);
                setSelectedFileName("");
            }
            reader.readAsText(selectedFile);
        };

        const cancelFileUpload = () => {
            setAwaitingFileUploadForAction(null);
            setSelectedFile(null);
            setSelectedFileName("");
            cancelPreparedAction();
        }

        const handleInputKeyDown = (event) => {
            if (event.key === 'Enter' && input) {
                onSent(input);
            }
        };

    return(
        <div className="main">
            <div className="nav">
                <p>BPMN Chatbot</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {showResult ? (
                    <div className="result">
                        {/* Display previous prompts and results */}
                        {prevPrompts.map((prompt, index, arr) => (
                            <React.Fragment key={index}>
                                <div className="result-title">
                                    <img src={assets.user_icon} alt="" />
                                    <p>{prompt}</p>
                                </div>
                                <div className="result-data">
                                    {loading?(<img src={assets.gemini_icon} alt="" />): (index < arr.length - 1 && (
                                        <img src={assets.gemini_icon} alt="" />
                                    )) }
                                    <p dangerouslySetInnerHTML={{ __html: prevResults.slice(0, -1)[index] }}></p>
                                </div>
                            </React.Fragment>
                        ))}

                        {/* Display current prompt and result/loader */}
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? (
                                <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                        {/* Display option cards if not loading, no recent prompt, and not awaiting file upload */}
                        {!loading && !recentPrompt && !awaitingFileUploadForAction && prevPrompts.length === 0 && (
                            <div className="cards initial-options"> 
                                <div className="card" onClick={handleCreateTemplateClick}>
                                    <p>Create template for process model</p>
                                    <img src={assets.bulb_icon} alt="Start fresh" />
                                </div>
                                <div className="card" onClick={() => {
                                    setAwaitingFileUploadForAction('analyze');
                                    prepareAnalyzeProcessModel(); // UPDATED
                                }}>
                                    <p>Analyze process model</p>
                                    <img src={assets.compass_icon} alt="Analyze" />
                                </div>
                                <div className="card" onClick={() => { 
                                    setAwaitingFileUploadForAction('recommend'); 
                                    prepareRecommendUpload();
                                }}>
                                    <p>Recommend next elements</p>
                                    <img src={assets.plus_icon} alt="Recommend" />
                                </div>
                                <div className="card" onClick={handleCreateFromDescriptionClick}>
                                    <p>Create process model from description</p>
                                    <img src={assets.message_icon} alt="Create from description" />
                                </div>
                                <div className="card" onClick={handleStartModellingClick}> 
                                    <p>Start modelling session from scratch</p>
                                    <img src={assets.code_icon} alt="Start modelling session from scratch" />
                                </div>
                                <div className="card" onClick={handleAppianQueryClick}> 
                                    <p>Appian query</p>
                                    <img src={assets.appian_logo} alt="Appian Query" />
                                </div>
                            </div>
                        )}
                        {/* Display file upload UI if awaiting file for an action */}
                        {!loading && awaitingFileUploadForAction && (
                            <div className="file-upload-section">
                                <p>
                                    {awaitingFileUploadForAction === 'analyze' 
                                        ? "Please upload a .bpmn file to analyze:" 
                                        : "Please upload a .bpmn file to get element recommendations:"}
                                </p>
                                {!selectedFileName ? (
                                    <input type="file" accept=".bpmn" onChange={handleFileSelect} ref={fileInputRef} />
                                ) : (
                                    <div className="file-selected-info">
                                        <p>Selected file: {selectedFileName}</p>
                                        <button onClick={() => {setSelectedFile(null); setSelectedFileName(""); if(fileInputRef.current) fileInputRef.current.value = null;}} className="change-file-btn">Change file</button>
                                    </div>
                                )}
                                {selectedFile && (
                                    <button onClick={processUploadedFile} className="process-file-btn">Process File</button>
                                )}
                                <button onClick={cancelFileUpload} className="cancel-upload-btn">Cancel</button>
                            </div>
                        )}
                        {/* Cancel button for prepared actions (when recentPrompt is set and no input has been sent yet) */}
                        {!loading && !awaitingFileUploadForAction && prevPrompts.length === 0 && recentPrompt && (
                            <div className="prepared-action-cancel-section">
                                <button onClick={cancelPreparedAction} className="cancel-prepared-action-btn">Cancel</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="greet">
                            <p><span>Hello, dev</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        {!loading && !recentPrompt && !awaitingFileUploadForAction && (
                            <div className="cards initial-options"> 
                                <div className="card" onClick={handleCreateTemplateClick}>
                                    <p>Create template for process model</p>
                                    <img src={assets.bulb_icon} alt="Start fresh" />
                                </div>
                                <div className="card" onClick={() => {
                                    setAwaitingFileUploadForAction('analyze');
                                    prepareAnalyzeProcessModel(); // UPDATED
                                }}>
                                    <p>Analyze process model</p>
                                    <img src={assets.compass_icon} alt="Analyze" />
                                </div>
                                <div className="card" onClick={() => { 
                                    setAwaitingFileUploadForAction('recommend'); 
                                    prepareRecommendUpload();
                                }}>
                                    <p>Recommend next elements</p>
                                    <img src={assets.plus_icon} alt="Recommend" />
                                </div>
                                <div className="card" onClick={handleCreateFromDescriptionClick}>
                                    <p>Create process model from description</p>
                                    <img src={assets.message_icon} alt="Create from description" />
                                </div>
                                <div className="card" onClick={handleStartModellingClick}> 
                                    <p>Start modelling session from scratch</p>
                                    <img src={assets.code_icon} alt="Start modelling session from scratch" />
                                </div>
                                <div className="card" onClick={handleAppianQueryClick}> 
                                    <p>Appian query</p>
                                    <img src={assets.appian_logo} alt="Appian Query" />
                                </div>
                            </div>
                        )}
                    </>
                )}
                
                <div className="main-bottom">
                    <div className="search-box">
                        {/* Pass 'input' to onSent when user types and sends */}
                        <input 
                            onChange={(e)=>setInput(e.target.value)} 
                            onKeyDown={handleInputKeyDown} 
                            value={input} 
                            type="text" 
                            placeholder={(renderDiagram && (recentPrompt === "Generate process model" || recentPrompt === "Create template for process model" || recentPrompt === "Create process model from description" || recentPrompt === "Recommend next elements from file")) ? "Describe the diagram to generate..." : "Enter prompt here"} 
                        />
                        <div>
                            {/* Appian Icon for initiating "Appian Query" or indicating an active Appian query mode */}
                            <img 
                                src={(appianQuery) ? assets.check_icon : assets.appian_logo} 
                                alt="Appian Query / Appian Query active" 
                                title={(appianQuery) ? "Appian Query is active." : "Appian Query (click)"}
                                onClick={toggleAppianQuery} // This sets renderDiagram true and recentPrompt to "Generate process model"
                                className={(appianQuery) ? 'active' : ''} 
                            />
                            {/* Main Gear Icon for initiating "Generate process model" or indicating an active diagram generation mode */}
                            <img 
                                src={(renderDiagram) ? assets.check_gear_icon : assets.gear_icon} 
                                alt="Generate model / Diagram generation active" 
                                title={(renderDiagram) ? "Diagram generation is active. Describe the diagram." : "Generate process model (click, then describe)"}
                                onClick={handleGenerateModelClick} // This sets renderDiagram true and recentPrompt to "Generate process model"
                                className={(renderDiagram) ? 'active' : ''} 
                            />
                            {/* Icon for Include Diagram */} 
                            {includeDiagramInPrompt ? (
                                <img 
                                    src={assets.check_icon} 
                                    alt="Diagram included - Click to exclude" 
                                    title="Diagram included - Click to exclude"
                                    onClick={toggleIncludeDiagram} 
                                    className='active' 
                                />
                            ) : (
                                <img 
                                    src={assets.plus_icon} 
                                    alt="Include current diagram in prompt" 
                                    title="Include current diagram in prompt" 
                                    onClick={toggleIncludeDiagram} 
                                    className='' 
                                />
                            )}
                            {input?<img onClick={()=>onSent(input)} src={assets.send_icon} alt=""  />:null}
                        </div>
                    </div>
                    <p className="bottom-info">
                    Gemini may display inaccurate info, including about people, so double check its responses
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main