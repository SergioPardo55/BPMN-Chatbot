import { Context } from "./AppContext"; // Updated import
import { useState, useEffect, useRef, useCallback } from "react"; // Added useCallback
import runChat from "../config/gemini";

// Define the URL for the initial diagram
const INITIAL_DIAGRAM = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1x744zo" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="18.6.1">
  <bpmn:collaboration id="Collaboration_1jxlwb5">
    <bpmn:participant id="Participant_03x5hsm" processRef="Process_0p395vn" />
  </bpmn:collaboration>
  <bpmn:process id="Process_0p395vn" isExecutable="false">
    <bpmn:startEvent id="StartEvent_0y29k9c">
      <bpmn:outgoing>Flow_0nnej0l</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1lzn5jj" sourceRef="Activity_14d3am1" targetRef="Event_1x9qbvn" />
    <bpmn:sequenceFlow id="Flow_0nnej0l" sourceRef="StartEvent_0y29k9c" targetRef="Activity_14d3am1" />
    <bpmn:endEvent id="Event_1x9qbvn">
      <bpmn:incoming>Flow_1lzn5jj</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:task id="Activity_14d3am1" name="Task">
      <bpmn:incoming>Flow_0nnej0l</bpmn:incoming>
      <bpmn:outgoing>Flow_1lzn5jj</bpmn:outgoing>
    </bpmn:task>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1jxlwb5">
      <bpmndi:BPMNShape id="Participant_03x5hsm_di" bpmnElement="Participant_03x5hsm" isHorizontal="true">
        <dc:Bounds x="156" y="80" width="924" height="250" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_0y29k9c">
        <dc:Bounds x="232" y="182" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1x9qbvn_di" bpmnElement="Event_1x9qbvn">
        <dc:Bounds x="982" y="182" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_14d3am1_di" bpmnElement="Activity_14d3am1">
        <dc:Bounds x="570" y="160" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1lzn5jj_di" bpmnElement="Flow_1lzn5jj">
        <di:waypoint x="670" y="200" />
        <di:waypoint x="982" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0nnej0l_di" bpmnElement="Flow_0nnej0l">
        <di:waypoint x="268" y="200" />
        <di:waypoint x="570" y="200" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const XML_START_DELIMITER = "<BPMN_XML_START>";
const XML_END_DELIMITER = "<BPMN_XML_END>";
const MAX_RETRIES = 3;

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [prevResults, setPrevResults] = useState([]); // ADDED to store AI responses
    const [showResult, setShowResult] = useState(true); // Initialize to true
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("Hi, welcome to Process Modeler Support! How can I help you today?"); // Initialize with greeting
    const [diagramXML, setDiagramXML] = useState("");
    const [includeDiagramInPrompt, setIncludeDiagramInPrompt] = useState(false); // Added state
    const [renderDiagram, setRenderDiagram] = useState(false); // ADDED: State to control diagram rendering expectation
    
    // State for render attempt tracking
    const [renderAttempt, setRenderAttempt] = useState({ xml: null, status: 'idle', error: null });
    const currentRenderPromiseResolver = useRef(null);

    // Fetch initial diagram on mount
    useEffect(() => {
        setDiagramXML(INITIAL_DIAGRAM); // Set initial diagram XML
    }, []); // Empty dependency array ensures this runs once on mount

    useEffect(() => {
        if (currentRenderPromiseResolver.current && renderAttempt.xml === currentRenderPromiseResolver.current.xmlToWaitFor) {
            if (renderAttempt.status === 'success') {
                currentRenderPromiseResolver.current.resolve();
                currentRenderPromiseResolver.current = null;
            } else if (renderAttempt.status === 'failure') {
                currentRenderPromiseResolver.current.reject(renderAttempt.error);
                currentRenderPromiseResolver.current = null;
            }
        }
    }, [renderAttempt, currentRenderPromiseResolver]); // Corrected dependency array for the promise resolver effect

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index)
    }

    const newChat = () => {
        console.log("newChat function called"); // Added console.log for debugging
        setLoading(false)
        setResultData("Hi, welcome to Process Modeler Support! How can I help you today?");
        setRecentPrompt("");
        setInput("");
        setPrevPrompts([]);
        setPrevResults([]); // ADDED: Clear previous AI results
        setShowResult(true); 
        setIncludeDiagramInPrompt(false); 
        setRenderDiagram(false); // ADDED: Reset renderDiagram state
    }

    const prepareCreateTemplate = () => {
        setRecentPrompt("Create template for process model"); 
        setResultData("Please roughly specify what the process should do and the goal of the process. For example: The process should: Receive new client orders for an online clothing shop. The goal of the process is: Processing the order of the client: ordering, paying and shipping");
        setShowResult(true);
        setLoading(false);
        setInput(""); 
        setRenderDiagram(true); // ADDED: Expect diagram for this action
    };

    const prepareCreateFromDescription = () => {
        setRecentPrompt("Create process model from description"); 
        setResultData("Please describe the process you want to model, be as specific as possible with all the steps involved and the decisions taken in it.");
        setShowResult(true);
        setLoading(false);
        setInput("");
        setRenderDiagram(true); // ADDED: Expect diagram for this action
    };

    const  prepareStartModellingScratch = () => { // This seems to be "Start modelling session from scratch" in Main.jsx cards
        setRecentPrompt("Start modelling session from scratch"); 
        setResultData("Please describe the context of the process you want to model. Who are you modelling for? What is it that you want to prioritize in the process?");
        setShowResult(true);
        setLoading(false);
        setInput("");
        // setRenderDiagram(true); // User prompt did not list this card for auto-renderDiagram
    };

    const prepareGenerateModel = () => { 
        setRenderDiagram(prevRenderDiagram => !prevRenderDiagram);
        // Only toggle renderDiagram state. No other state changes here.
        // recentPrompt and resultData are not modified by this action directly.
    };

    const prepareRecommendUpload = () => { // ADDED function
        setRecentPrompt("Recommend next elements from file");
        setResultData("Please upload a .bpmn file to get element recommendations.");
        setShowResult(true);
        setLoading(false);
        setInput("");
        setRenderDiagram(true); // ADDED: Expect diagram for this action
    };

    const cancelPreparedAction = () => {
        setRecentPrompt(""); 
        setResultData("Hi, welcome to Process Modeler Support! How can I help you today?"); 
        setShowResult(true); 
        setInput(""); 
        setLoading(false); 
        setIncludeDiagramInPrompt(false); 
        setRenderDiagram(false); // Ensure renderDiagram is reset
    };

    const toggleIncludeDiagram = () => { // Added function
        setIncludeDiagramInPrompt(prev => {
            const newIncludeState = !prev;
            if (newIncludeState) { // Log only when activating (changing to true)
                console.log("Current Diagram XML:", diagramXML);
            }
            return newIncludeState;
        });
    };

    const onSent = async (payload) => { 
        setResultData("");
        setLoading(true);
        setShowResult(true); // Ensure chat view is active
        
        const isRenderExpectedThisTurn = renderDiagram; // Capture renderDiagram state at the beginning of the call
        let queryToSendToAI;
        let userFacingDisplayForRecentPrompt;
        let originalUserQueryForRetry;
        let wasDiagramIncludedInThisPrompt = false;

        if (typeof payload === 'string') {
            const userInput = payload;
            originalUserQueryForRetry = userInput;
            userFacingDisplayForRecentPrompt = userInput; 

            if (includeDiagramInPrompt) {
                queryToSendToAI = `Current BPMN Diagram XML:\\n<BPMN_XML_START>\\n${diagramXML}\\n</BPMN_XML_END>\\n\\nUser Query: ${userInput}`;
                userFacingDisplayForRecentPrompt = `${userInput} [Model included]`;
                wasDiagramIncludedInThisPrompt = true;
            } else {
                queryToSendToAI = userInput;
            }

            // Prepend special instruction if rendering is expected for this turn
            if (isRenderExpectedThisTurn) {
                queryToSendToAI = `You must output the BPMN 2.0 XML code for this query. ${queryToSendToAI}`;
            }
            
            if (recentPrompt === "Create template for process model") {
                queryToSendToAI = `You will be given a rough idea of what a process should do and the goal of it. 
                For example: The process should: Receive new client orders for an online clothing shop. The goal of the process is: Processing the order of the client: ordering, paying and shipping. 
                You will output the BPMN 2.0 XML code for this process, consider all the tasks and gateways that should be in said process and add as many details as necessary even if they are not mentioned in the initial description. ${includeDiagramInPrompt ? `\\n\\n(User also included their current diagram listed above.) User's specific request for this template: ` : ''}${userInput}`;
            } else if (recentPrompt === "Create process model from description") {
                queryToSendToAI = `You will be given a detailed description of a process, your job is to translate that into BPMN 2.0 XML code as closely as possible while maintaining the process logically feasible and optimized. Add an explanation on the improvements you would do or details you might add. ${includeDiagramInPrompt ? `\\n\\n(User also included their current diagram listed above.) User's description: ` : ''}${userInput}`;
            } else if (recentPrompt === "Start modelling session from scratch") {
                queryToSendToAI = `In this task you will NOT output code for the process model if not prompted by the user to do so. Your job is to guide the user through the whole creation of a process model. Make questions that you consider important like, what is the context? Who are you modelling for? What is it that you want to prioritize in the process? ${includeDiagramInPrompt ? `\\n\\n(User also included their current diagram listed above.) User's initial thoughts: ` : ''}${userInput}`;
            } else if (recentPrompt === "Generate process model") { // ADDED condition
                queryToSendToAI = `Generate a BPMN 2.0 XML process model based on the following description. Ensure the XML is complete and renderable. ${includeDiagramInPrompt ? `\\n\\n(User also included their current diagram listed above.) User's description: ` : ''}${userInput}`;
            }
            setPrevPrompts(prev => [...prev, userFacingDisplayForRecentPrompt]); 
            setInput(""); 
        } else if (typeof payload === 'object' && payload.queryForAI && payload.userFacingPrompt) {
            queryToSendToAI = payload.queryForAI;
            userFacingDisplayForRecentPrompt = payload.userFacingPrompt;
            originalUserQueryForRetry = payload.userFacingPrompt; 

            if (includeDiagramInPrompt) { 
                queryToSendToAI = `Current BPMN Diagram XML:\\n<BPMN_XML_START>\\n${diagramXML}\\n</BPMN_XML_END>\\n\\n${payload.queryForAI}`;
                userFacingDisplayForRecentPrompt = `${payload.userFacingPrompt} [Model included]`;
                wasDiagramIncludedInThisPrompt = true;
            }
            // Prepend special instruction if rendering is expected for this turn (for object payload too)
            if (isRenderExpectedThisTurn) {
                queryToSendToAI = `You must output the BPMN 2.0 XML code for this query. ${queryToSendToAI}`;
            }
            // ADDED: Logic for file upload actions that should generate XML
            if (awaitingFileUploadForAction === 'recommend') { 
                // queryToSendToAI is already set from processUploadedFile in Main.jsx
                // and it should already be a request for XML.
            }

            setPrevPrompts(prev => [...prev, userFacingDisplayForRecentPrompt]); 
        } else {
            console.error("Invalid payload for onSent:", payload);
            setLoading(false);
            setResultData("An error occurred while sending your request.");
            setShowResult(true);
            return;
        }

        setRecentPrompt(userFacingDisplayForRecentPrompt); 

        if (wasDiagramIncludedInThisPrompt) {
            console.log("Query sent to AI (with diagram):", queryToSendToAI);
        }

        let currentQueryForThisAttempt = queryToSendToAI; 
        let lastError = null;
        let successfulRender = false;
        let finalExplanation = "Processing your request..."; // Default message
        let xmlPart = ""; // Keep xmlPart accessible

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            // Update resultData for immediate feedback about the attempt
            let attemptMessage = `Attempt ${attempt + 1}/${MAX_RETRIES}: Generating response...`;
            if (lastError) {
                attemptMessage += `\nPrevious error: ${lastError.message}. Retrying...`;
            }
            setResultData(attemptMessage); // Show attempt status

            const responseText = await runChat(currentQueryForThisAttempt);
            lastError = null; 

            if (responseText) {
                const startIndex = responseText.indexOf(XML_START_DELIMITER);
                const endIndex = responseText.indexOf(XML_END_DELIMITER);
                let explanationPartFromAI = "";
                // xmlPart = ""; // Reset xmlPart for each attempt inside the loop

                if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) { // Delimiters found
                    xmlPart = responseText.substring(startIndex + XML_START_DELIMITER.length, endIndex).trim();
                    explanationPartFromAI = responseText.substring(0, startIndex).trim();
                    const postXmlText = responseText.substring(endIndex + XML_END_DELIMITER.length).trim();
                    if (postXmlText) explanationPartFromAI = (explanationPartFromAI + "\n" + postXmlText).trim();
                    
                    finalExplanation = explanationPartFromAI || "Diagram generated.";

                    // Conditional rendering logic based on isRenderExpectedThisTurn and if xmlPart has content
                    if (xmlPart || isRenderExpectedThisTurn) {
                        setResultData(prev => `${prev.split('\\n')[0]}\\nAttempt ${attempt + 1}/${MAX_RETRIES}: Rendering diagram...`);
                        
                        const renderPromise = new Promise((resolve, reject) => {
                            currentRenderPromiseResolver.current = { resolve, reject, xmlToWaitFor: xmlPart };
                        });

                        setDiagramXML(xmlPart); 

                        try {
                            await renderPromise;
                            successfulRender = true;
                            break; 
                        } catch (renderErr) {
                            lastError = renderErr instanceof Error ? renderErr : new Error(String(renderErr));
                            currentQueryForThisAttempt = `The previous BPMN XML attempt failed to render with the error: \\"${lastError.message}\\". The original query was: \\"${originalUserQueryForRetry}\\". Faulty XML was: \\n${xmlPart}\\nPlease provide a corrected BPMN XML and explanation, ensuring the XML is valid and complete.`;
                            finalExplanation = explanationPartFromAI; // Keep explanation from this attempt
                            successfulRender = false; // Ensure this is false if render fails
                        }
                    } else if (!xmlPart && isRenderExpectedThisTurn) { // XML expected, delimiters found, but no XML content
                        finalExplanation = explanationPartFromAI || "Received response with XML delimiters but no XML content.";
                        lastError = new Error("XML content was empty between delimiters.");
                        currentQueryForThisAttempt = `The response had XML delimiters but no XML content. Original query: \\"${originalUserQueryForRetry}\\". Please provide a valid BPMN XML with explanation.`;
                        successfulRender = false;
                    } else { // XML not expected OR XML present but not expected (treat as text response)
                        // If XML is present but not expected, finalExplanation already has it.
                        // If XML is not present and not expected, finalExplanation is the text.
                        successfulRender = true; // Treat as successful text response
                        break; // Exit loop as no rendering is attempted/needed or it's just text
                    }
                } else { // No XML delimiters
                    xmlPart = ""; // Ensure xmlPart is empty
                    finalExplanation = responseText; 
                    
                    if (isRenderExpectedThisTurn) { // XML was expected, but no delimiters found
                        lastError = new Error("AI response did not contain the expected BPMN XML delimiters for a diagram generation task.");
                        currentQueryForThisAttempt = `The AI response did not include BPMN XML between <BPMN_XML_START> and <BPMN_XML_END> for a task that requires it. Original query: \\"${originalUserQueryForRetry}\\". Please include the XML in the correct format.`;
                        successfulRender = false;
                    } else {
                        // No XML expected, and no XML found - successful text response
                        successfulRender = true; 
                        break; 
                    }
                }
            } else { // Empty response from AI
                xmlPart = ""; // Ensure xmlPart is empty
                finalExplanation = "Received an empty response from the AI.";
                lastError = new Error("Empty response from AI.");
                currentQueryForThisAttempt = `Received an empty response. Original query: \\"${originalUserQueryForRetry}\\". Please try again.`;
            }
             if (successfulRender) break; // Exit loop if diagram rendered successfully
        } 

        setLoading(false);
        setIncludeDiagramInPrompt(false); 
        setRenderDiagram(false); // ADDED: Reset renderDiagram state after onSent completes

        let displayMessage = finalExplanation;
        if (!successfulRender && lastError) { // If rendering failed or was expected but not provided properly
            displayMessage = `Failed to generate or render the diagram after ${MAX_RETRIES} attempts. Last error: ${lastError.message}`;
            if (finalExplanation && finalExplanation !== "Diagram generated." && finalExplanation !== "Processing your request..." && !finalExplanation.startsWith("Attempt ")) {
                 displayMessage += `\\n\\nLast explanation from AI:\\n${finalExplanation}`;
            }
        } else if (isRenderExpectedThisTurn && !xmlPart && !lastError) { // Expected XML, but loop finished without error and no XML (e.g. AI never provided tags)
             displayMessage = `The AI did not provide a diagram after ${MAX_RETRIES} attempts.`;
             if (finalExplanation && finalExplanation !== "Diagram generated." && finalExplanation !== "Processing your request..." && !finalExplanation.startsWith("Attempt ")) {
                 displayMessage += `\\n\\nLast response from AI:\\n${finalExplanation}`;
            }
        }
        // If successfulRender is true, displayMessage is already finalExplanation (either rendered XML's explanation or text response)

        setPrevResults(prev => [...prev, displayMessage]); // ADDED: Store final AI response for history

        setResultData(""); // Clear for streaming effect
        if (displayMessage) {
            let responseArray = displayMessage.split('**');
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("</br>").split("\n").join("</br>");
            let newResponseArray = newResponse2.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
        }
        setShowResult(true); 
    };

    const reportRenderAttempt = useCallback((result) => { // result: { xml, status, error }
        setRenderAttempt(result);
    }, [setRenderAttempt]); // setRenderAttempt is stable

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        prevResults, // ADDED
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        diagramXML,
        setDiagramXML, 
        reportRenderAttempt,
        prepareStartModellingScratch,
        prepareCreateFromDescription, 
        prepareCreateTemplate, 
        prepareGenerateModel, 
        prepareRecommendUpload, // ADDED
        cancelPreparedAction,
        includeDiagramInPrompt, 
        toggleIncludeDiagram, // Added
        renderDiagram // ADDED
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;