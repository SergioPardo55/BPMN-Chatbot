import React, { useContext, useState, useRef } from "react"; // Added useRef
import './Main.css'
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";

const Main =() =>{

        const {
            onSent,recentPrompt,showResult,loading,resultData,setInput,input,
            prepareStartModellingScratch, 
            prepareCreateFromDescription, 
            prepareCreateTemplate,
            cancelPreparedAction // Destructure cancelPreparedAction from context
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
        }

    return(
        <div className="main">
            <div className="nav">
                <p>BPMN Chatbot</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {showResult ? (
                    <div className="result">
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt ? recentPrompt : "Welcome"}</p>
                        </div>
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
                        {!loading && !recentPrompt && !awaitingFileUploadForAction && (
                            <div className="cards initial-options"> 
                                <div className="card" onClick={handleStartModellingClick}> {/* MODIFIED HERE */}
                                    <p>Create template for process model</p>
                                    <img src={assets.bulb_icon} alt="Start fresh" />
                                </div>
                                <div className="card" onClick={() => setAwaitingFileUploadForAction('analyze')}>
                                    <p>Analyze process model</p>
                                    <img src={assets.compass_icon} alt="Analyze" />
                                </div>
                                <div className="card" onClick={() => setAwaitingFileUploadForAction('recommend')}>
                                    <p>Recommend next elements</p>
                                    <img src={assets.plus_icon} alt="Recommend" />
                                </div>
                                <div className="card" onClick={handleCreateFromDescriptionClick}> {/* MODIFIED HERE */}
                                    <p>Create process model from description</p>
                                    <img src={assets.message_icon} alt="Create from description" />
                                </div>
                                <div className="card" onClick={handleCreateTemplateClick}> {/* MODIFIED HERE */}
                                    <p>Start modelling session from scratch</p>
                                    <img src={assets.code_icon} alt="Create template" />
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
                        {/* Cancel button for prepared actions (when recentPrompt is set and not loading/not file uploading) */}
                        {!loading && recentPrompt && !awaitingFileUploadForAction && (
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
                        <div className="cards">
                            <div className="card">
                                <p>Suggest beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Briefly summarize this concept: </p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Improve the readibility of the following code</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                )}
                
                <div className="main-bottom">
                    <div className="search-box">
                        {/* Pass 'input' to onSent when user types and sends */}
                        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder="Enter prompt here" />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input?<img onClick={()=>onSent(input)} src={assets.send_icon} alt="" />:null}
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