import { createContext, useState, useEffect, useRef, useCallback } from "react"; // Added useCallback
import runChat from "../config/gemini";

export const Context = createContext();

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
    const [showResult, setShowResult] = useState(true); // Initialize to true
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("Hi, welcome to Process Modeler Support! How can I help you today?"); // Initialize with greeting
    const [diagramXML, setDiagramXML] = useState("");
    
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
        setLoading(false)
        // setShowResult(false) // Keep previous chat visible until new one starts or greeting shows
        // For a true "new chat", we might want to reset to the initial greeting + cards.
        // For now, let's ensure the initial greeting appears if we clear results.
        // Or, if newChat is meant to clear the modeler and chat, more state resets would be needed.
        // Current behavior: hides result, shows greet if showResult becomes false.
        // Let's make newChat reset to the initial greeting state.
        setResultData("Hi, welcome to Process Modeler Support! How can I help you today?");
        setRecentPrompt("");
        setInput("");
        setPrevPrompts([]);
        setShowResult(true); // Ensure the greeting and cards show up
        // setDiagramXML(initialDiagramXML); // Optionally reset diagram to initial starter
    }

    const prepareStartModellingScratch = () => {
        setRecentPrompt("Create template for process model"); // This sets the context for the next user input
        setResultData("Please roughly specify what the process should do and the goal of the process. For example: The process should: Receive new client orders for an online clothing shop. The goal of the process is: Processing the order of the client: ordering, paying and shipping");
        setShowResult(true);
        setLoading(false);
        setInput(""); 
    };

    const prepareCreateFromDescription = () => {
        setRecentPrompt("Create process model from description"); // Context for next input
        setResultData("Please describe the process you want to model, be as specific as possible with all the steps involved and the decisions taken in it.");
        setShowResult(true);
        setLoading(false);
        setInput("");
    };

    const prepareCreateTemplate = () => {
        setRecentPrompt("Start modelling session from scratch"); // Context for next input
        setResultData("Please describe the context of the process you want to model. Who are you modelling for? What is it that you want to prioritize in the process?");
        setShowResult(true);
        setLoading(false);
        setInput("");
    };

    const cancelPreparedAction = () => {
        setRecentPrompt(""); // Clear the prepared action context
        setResultData("Hi, welcome to Process Modeler Support! How can I help you today?"); // Reset to initial greeting
        setShowResult(true); // Ensure the greeting/cards are visible
        setInput(""); // Clear any text the user might have started typing
        setLoading(false); // Ensure loading indicator is off
    };

    const onSent = async (payload) => { 
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        let queryToSendToAI;
        let userFacingDisplayForRecentPrompt;
        let originalUserQueryForRetry;

        if (typeof payload === 'string') { // User typed in the main input field
            const userInput = payload;
            originalUserQueryForRetry = userInput;
            userFacingDisplayForRecentPrompt = userInput; 

            // Construct the query for the AI based on pending card action (stored in recentPrompt state)
            // Note: 'recentPrompt' here refers to the state variable, reflecting the last card action that prepared for input.
            if (recentPrompt === "Create template for process model") {
                queryToSendToAI = `You will be given a rough idea of what a process should do and the goal of it. 
                For example: The process should: Receive new client orders for an online clothing shop. The goal of the process is: Processing the order of the client: ordering, paying and shipping. 
                You will output the BPMN 2.0 XML code for this process, consider all the tasks and gateways that should be in said process and add as many details as necessary even if they are not mentioned in the initial description. ${userInput}`;
            } else if (recentPrompt === "Create process model from description") {
                queryToSendToAI = `You will be given a detailed description of a process, your job is to translate that into BPMN 2.0 XML code as closely as possible while maintaining the process logically feasible and optimized. Add an explanation on the improvements you would do or details you might add.: ${userInput}`;
            } else if (recentPrompt === "Start modelling session from scratch") {
                queryToSendToAI = `In this task you will NOT output code for the process model if not prompted by the user to do so. Your job is to guide the user through the whole creation of a process model. Make questions that you consider important like, what is the context? Who are you modelling for? What is it that you want to prioritize in the process? ${userInput}`;
            } else {
                // Default case: No specific card action was pending, or recentPrompt was a previous user input.
                queryToSendToAI = userInput;
            }
            setPrevPrompts(prev => [...prev, userInput]); 
            setInput(""); 
        } else if (typeof payload === 'object' && payload.queryForAI && payload.userFacingPrompt) { // Action with specific AI query and user display (e.g., file upload)
            queryToSendToAI = payload.queryForAI;
            userFacingDisplayForRecentPrompt = payload.userFacingPrompt;
            originalUserQueryForRetry = payload.userFacingPrompt; // The user-facing part is the "original query" for retries

            setPrevPrompts(prev => [...prev, userFacingDisplayForRecentPrompt]); 
            // Input field was not used for this path, so no need to clear setInput
        } else {
            console.error("Invalid payload for onSent:", payload);
            setLoading(false);
            setResultData("An error occurred while sending your request.");
            setShowResult(true);
            return;
        }

        setRecentPrompt(userFacingDisplayForRecentPrompt); // Update the displayed title for the current chat turn

        let currentQueryForThisAttempt = queryToSendToAI; 
        let lastError = null;
        let successfulRender = false;
        let finalExplanation = "Processing your request...";

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            setResultData(`Attempt ${attempt + 1}/${MAX_RETRIES}: Generating diagram...`);
            if (lastError) {
                 setResultData(prev => `${prev.split('\n')[0]}\nPrevious error: ${lastError.message}. Retrying...`);
            }

            const responseText = await runChat(currentQueryForThisAttempt);
            lastError = null; 

            if (responseText) {
                const startIndex = responseText.indexOf(XML_START_DELIMITER);
                const endIndex = responseText.indexOf(XML_END_DELIMITER);
                let explanationPart = "";
                let xmlPart = "";

                if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                    xmlPart = responseText.substring(startIndex + XML_START_DELIMITER.length, endIndex).trim();
                    explanationPart = responseText.substring(0, startIndex).trim();
                    const postXmlText = responseText.substring(endIndex + XML_END_DELIMITER.length).trim();
                    if (postXmlText) explanationPart = (explanationPart + "\n" + postXmlText).trim();
                    
                    finalExplanation = explanationPart || "Diagram generated.";

                    if (xmlPart) {
                        setResultData(prev => `${prev.split('\n')[0]}\nAttempt ${attempt + 1}/${MAX_RETRIES}: Rendering diagram...`);
                        
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
                        }
                    } else {
                        finalExplanation = explanationPart || "Received response with XML delimiters but no XML content.";
                        lastError = new Error("XML content was empty between delimiters.");
                        currentQueryForThisAttempt = `The response had XML delimiters but no XML content. Original query: \\"${originalUserQueryForRetry}\\". Please provide a valid BPMN XML with explanation.`;
                    }
                } else {
                    finalExplanation = responseText; 
                    lastError = new Error("AI response did not contain the expected BPMN XML delimiters.");
                    currentQueryForThisAttempt = `The AI response did not include BPMN XML between <BPMN_XML_START> and <BPMN_XML_END>. Original query: \\"${originalUserQueryForRetry}\\". Please include the XML in the correct format.`;
                }
            } else {
                finalExplanation = "Received an empty response from the AI.";
                lastError = new Error("Empty response from AI.");
                currentQueryForThisAttempt = `Received an empty response. Original query: \\"${originalUserQueryForRetry}\\". Please try again.`;
            }
        } 

        setLoading(false);
        // setInput(""); // Moved clearing of input to be conditional based on 'prompt' argument

        setResultData(""); 
        let displayMessage = finalExplanation;
        if (!successfulRender && lastError) {
            displayMessage = `Failed to render the diagram after ${MAX_RETRIES} attempts. Last error: ${lastError.message}\n\nLast explanation received:\n${finalExplanation}`;
        } else if (!successfulRender) { 
            displayMessage = `Failed to render the diagram after ${MAX_RETRIES} attempts.\n\nLast explanation received:\n${finalExplanation}`;
        }

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
    };

    const reportRenderAttempt = useCallback((result) => { // result: { xml, status, error }
        setRenderAttempt(result);
    }, [setRenderAttempt]); // setRenderAttempt is stable

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
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
        cancelPreparedAction, // Add cancelPreparedAction to context
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;