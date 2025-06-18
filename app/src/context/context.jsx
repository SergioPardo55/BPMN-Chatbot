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

// Helper function to escape HTML special characters for literal display
const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') return String(unsafe); // Ensure string
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};

const formatAIResponseForHTML = (rawText) => {
    if (typeof rawText !== 'string') return String(rawText);
    let newResponse = "";
    const responseArray = rawText.split('**');
    for (let i = 0; i < responseArray.length; i++) {
        const segmentContent = escapeHtml(responseArray[i]);
        if (i === 0 || i % 2 !== 1) { // Even index or first segment (not bold)
            newResponse += segmentContent;
        } else { // Odd index (text to be bolded)
            newResponse += "<b>" + segmentContent + "</b>";
        }
    }
    let newResponse2 = newResponse.split("*").join("<br/>").split("\n").join("<br/>");

    return newResponse2;
};

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [prevResults, setPrevResults] = useState([]); // Stores formatted HTML responses
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [diagramXML, setDiagramXML] = useState(INITIAL_DIAGRAM); // Initialize with default diagram
    const [includeDiagramInPrompt, setIncludeDiagramInPrompt] = useState(false);
    const [selectedBPMNElements, setSelectedBPMNElements] = useState([]); // New state for selected elements
    const [includeSelectedElementsInPrompt, setIncludeSelectedElementsInPrompt] = useState(false); // New state for toggling inclusion
    const [renderDiagram, setRenderDiagram] = useState(false);
    const [appianQuery, setAppianQuery] = useState(""); 
    const [totalClicks, setTotalClicks] = useState(0);
    const [bpmnPanelClicks, setBpmnPanelClicks] = useState(0);
    const [promptLogs, setPromptLogs] = useState([]);
    const [promptCount, setPromptCount] = useState(0);
    const [docLinkClicks, setDocLinkClicks] = useState(0);

    const [isModelerInitialized, setIsModelerInitialized] = useState(false); 
    const [renderAttempt, setRenderAttempt] = useState({ xml: null, status: null, error: null }); 
    const currentRenderPromiseResolver = useRef(null); 


    // Fetch initial diagram XML into state
    useEffect(() => {
        setDiagramXML(INITIAL_DIAGRAM); 
    }, []);  
        useEffect(() => {
            if (currentRenderPromiseResolver.current && renderAttempt.xml === currentRenderPromiseResolver.current.xmlToWaitFor) {
                if (renderAttempt.status === 'success') {
                    currentRenderPromiseResolver.current.resolve(renderAttempt);
                } else if (renderAttempt.status === 'error') {
                    currentRenderPromiseResolver.current.reject(renderAttempt); // Reject with the attempt object
                }
                currentRenderPromiseResolver.current = null; // Clear the resolver
            }
        }, [renderAttempt]); // Corrected dependency array for the promise resolver effect
    
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setRecentPrompt("");
        setInput("");
        setPrevPrompts([]);
        setPrevResults([]);
        setShowResult(true); 
        setIncludeDiagramInPrompt(false); 
        setSelectedBPMNElements([]); // Reset selected elements
        setIncludeSelectedElementsInPrompt(false); // Reset toggle
        setRenderDiagram(false);
        setTotalClicks(0);
        setBpmnPanelClicks(0);
        setPromptLogs([]);
        setPromptCount(0);
        setDocLinkClicks(0);
    }

    const incrementTotalClicks = useCallback(() => {
        setTotalClicks(prev => prev + 1);
    }, []);

    const incrementBpmnPanelClicks = useCallback(() => {
        setBpmnPanelClicks(prev => prev + 1);
    }, []);

    const incrementDocLinkClicks = useCallback(() => {
        setDocLinkClicks(prev => prev + 1);
    }, []);

    const prepareCreateTemplate = () => {
        setRecentPrompt("Create template for process model"); 
        setResultData("Please roughly specify what the process should do and the goal of the process. For example: The process should: Receive new client orders for an online clothing shop. The goal of the process is: Processing the order of the client: ordering, paying and shipping");
        setShowResult(true);
        setLoading(false);
        setInput(""); 
        setRenderDiagram(true);
    };

    const prepareCreateFromDescription = () => {
        setRecentPrompt("Create process model from description"); 
        setResultData("Please describe the process you want to model, be as specific as possible with all the steps involved and the decisions taken in it.");
        setShowResult(true);
        setLoading(false);
        setInput("");
        setRenderDiagram(true);
    };

    const  prepareStartModellingScratch = () => { // This seems to be "Start modelling session from scratch" in Main.jsx cards
        setRecentPrompt("Start modelling session from scratch"); 
        setResultData("Please describe the context of the process you want to model. Who are you modelling for? What is it that you want to prioritize in the process? Do you have existing structures that you want to use?");
        setShowResult(true);
        setLoading(false);
        setInput("");
        // setRenderDiagram(true); // User prompt did not list this card for auto-renderDiagram
    };

    const prepareAnalyzeProcessModel = () => {
        setRecentPrompt("Analyze process model");
        setResultData("Please upload a .bpmn file to analyze its content and get improvement suggestions.");
        setShowResult(true);
        setLoading(false);
        setInput("");
    };

    const prepareGenerateModel = () => { 
        setRenderDiagram(prevRenderDiagram => !prevRenderDiagram);
        // Only toggle renderDiagram state. No other state changes here.
        // recentPrompt and resultData are not modified by this action directly.
    };

    const prepareRecommendUpload = () => {
        setRecentPrompt("Recommend next elements from file");
        setResultData("Please upload a .bpmn file to get element recommendations.");
        setShowResult(true);
        setLoading(false);
        setInput("");
        setRenderDiagram(true);
    };

    const prepareAppianQuery = () => { 
        setRecentPrompt("Appian Query");
        setResultData("Please describe the Appian query you want to execute.");
        setShowResult(true);
        setLoading(false);
        setInput("");
        setAppianQuery(true); 
    };

    const cancelPreparedAction = () => {
        setRecentPrompt(""); 
        setResultData("Hi, welcome to Process Modeler Support! How can I help you today?"); 
        setShowResult(true); 
        setInput(""); 
        setLoading(false); 
        setIncludeDiagramInPrompt(false); 
        setSelectedBPMNElements([]); // Reset selected elements
        setIncludeSelectedElementsInPrompt(false); // Reset toggle
        setRenderDiagram(false); 
        setAppianQuery(false);
    };

    // Including the diagram and the selected elements in the prompt is incompatible
    const toggleIncludeDiagram = () => {
        setIncludeDiagramInPrompt(prev => {
            const newIncludeState = !prev;
            return newIncludeState;
        });
        setIncludeSelectedElementsInPrompt(false);
    };

    const toggleIncludeSelectedElements = () => { // New function to toggle selected elements inclusion
        setIncludeSelectedElementsInPrompt(prev => !prev);
        setIncludeDiagramInPrompt(true);
    };

    const toggleAppianQuery = () => {
        setAppianQuery(prev => {
            const newIncludeState = !prev;
            return newIncludeState;
        });
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let userFacingPrompt;
        let queryForAI;

        if (typeof prompt === 'object' && prompt !== null && prompt.queryForAI) {
            userFacingPrompt = prompt.userFacingPrompt;
            queryForAI = prompt.queryForAI;
        } else {
            userFacingPrompt = prompt;
            queryForAI = prompt;
        }

        // Log the prompt
        const wordCount = String(userFacingPrompt || '').split(/\s+/).filter(Boolean).length;
        setPromptLogs(prev => [...prev, { text: userFacingPrompt, wordCount }]);
        setPromptCount(prev => prev + 1);
        
        let queryToSendToAI = queryForAI;

        // Compose the prompt based on recentPrompt and state
        if (recentPrompt === "Create template for process model") {
            queryToSendToAI = `<OUTPUT_MODEL_CODE> You will be given a rough idea of what a process should do and the goal of it.
                                For example: The process should: Receive new client orders for an online clothing shop. The goal of the process is: Processing the order of the client: ordering, paying and shipping.
                                You will output the BPMN 2.0 XML code for this process, consider all the tasks and gateways that should be in said process and add as many details as necessary even if they are not mentioned in the initial description. ${queryForAI}`;
        } else if (recentPrompt === "Create process model from description") {
            queryToSendToAI = `<OUTPUT_MODEL_CODE> You will be given a detailed description of a process, your job is to translate that into BPMN 2.0 XML code as closely as possible while maintaining the process logically feasible and optimized. Add an explanation on the improvements you would do or details you might add. ${queryForAI}`;
        } else if (recentPrompt === "Start modelling session from scratch") {
            queryToSendToAI = `In this task you will NOT output code for the process model if not prompted by the user to do so. Your job is to guide the user through the whole creation of a process model. Make questions that you consider important like, what is the context? Who are you modelling for? What is it that you want to prioritize in the process? ${queryForAI}`;
        } else if (recentPrompt === "Recommend next elements from file") {
            queryToSendToAI = `<OUTPUT_MODEL_CODE> Given the following BPMN XML, recommend the next elements to add and explain why. ${diagramXML ? `\n\nCurrent BPMN XML:\n${diagramXML}` : ''}\n\nUser's request: ${queryForAI}`;
        } else if (includeDiagramInPrompt){
            // If included diagram, append it to the prompt
            queryToSendToAI = `<PROCESS_MODEL_CODE_INCLUDED> ${queryForAI}\\n ${diagramXML ? `\\n\\nCurrent BPMN XML:\\n${diagramXML}` : ''}`;
        } else {
            // If no recent prompt, just use the user input
            queryToSendToAI = queryForAI;
        }

        // If renderDiagram is true, instruct the AI to output BPMN 2.0 XML code
        if (renderDiagram) {
            queryToSendToAI += `\n\nYou must output the BPMN 2.0 XML code for this query. Delimit the XML with <BPMN_XML_START> and <BPMN_XML_END>. Also provide an explanation of the model.`;
        }
        // Append selected BPMN elements if toggled on and elements are selected
        if (includeSelectedElementsInPrompt && selectedBPMNElements.length > 0) {
            const elementsData = selectedBPMNElements.map(element => ({
                id: element.id,
                type: element.$type,
                name: element.name
            }));
            queryToSendToAI = `\n\ <SELECTED_BPMN_ELEMENTS> \n${JSON.stringify(elementsData, null, 2)} </SELECTED_BPMN_ELEMENTS>`+queryToSendToAI;
        }
        if (appianQuery) {
            queryToSendToAI = `<APPIAN_QUERY> `+ queryToSendToAI;
        }
        let aiResponse = "";
        let retries = 0;
        let xmlValid = false;
        let lastXmlError = "";

        while (retries < MAX_RETRIES && !xmlValid) {
            try {
            aiResponse = await runChat(queryToSendToAI);
            // If renderDiagram is true, expect XML in response
            if (renderDiagram) {
                const xml = extractBpmnXml(aiResponse);
                if (xml) {
                // Try to import XML into modeler (simulate validation)
                try {
                    // If you have a modeler instance, validate here. For now, just check if it's non-empty.
                    if (xml.trim().length > 0) {
                    setDiagramXML(xml);
                    xmlValid = true;
                    setPrevPrompts(prev => [...prev, userFacingPrompt]);
                    const cleanResponse = formatAIResponseForHTML(extractNonBpmnXml(aiResponse));
                    setPrevResults(prev => [...prev, cleanResponse]);
                    setLoading(false);
                    setShowResult(true);

                    // Update the resultData with the cleaned response
                    setResultData(cleanResponse);
                    break;
                    } else {
                    throw new Error("XML is empty.");
                    }
                } catch (err) {
                    lastXmlError = err.message || String(err);
                    // Ask AI to correct the XML
                    queryToSendToAI = `The model is incorrect: ${lastXmlError}. Please correct the model and don't forget to add the explanation, don't apologize, just answer as if nothing had happened.\n\n${queryToSendToAI}`;
                    retries++;
                }
                } else {
                // No XML found, ask AI to add it
                queryToSendToAI = `The model is missing or is not output with the requested format. Please add the model and don't forget to add the explanation, don't apologize, just answer as if nothing had happened.\n\n${queryToSendToAI}`;
                retries++;
                }
            } else {
                // Not rendering diagram, but check if XML is present
                const xml = extractBpmnXml(aiResponse);
                if (xml) {
                setDiagramXML(xml);
                setPrevPrompts(prev => [...prev, userFacingPrompt]);
                const cleanResponse = formatAIResponseForHTML(extractNonBpmnXml(aiResponse));
                setPrevResults(prev => [...prev, cleanResponse]);
                setLoading(false);
                setShowResult(true);

                // Update the resultData with the cleaned response
                setResultData(cleanResponse);
                break;
                } else {
                // Just a text response
                setPrevPrompts(prev => [...prev, userFacingPrompt]);
                setPrevResults(prev => [...prev, aiResponse]);
                setLoading(false);
                setShowResult(true);
                setResultData(formatAIResponseForHTML(aiResponse));
                break;
                }
            }
            } catch (err) {
            lastXmlError = err.message || String(err);
            setLoading(false);
            setShowResult(true);
            setResultData(`An error occurred: ${lastXmlError}`);
            break;
            }
        }

        if (!xmlValid && renderDiagram && retries >= MAX_RETRIES) {
            setLoading(false);
            setShowResult(true);
            setResultData("Failed to generate a valid BPMN XML after several attempts. Please try again or refine your prompt.");
        }
        setRecentPrompt(userFacingPrompt);
        setInput("");
        // setIncludeDiagramInPrompt(false); // Do not reset here, allow user to keep it toggled
        // setIncludeSelectedElementsInPrompt(false); // Do not reset here
        setRenderDiagram(false);
        setIncludeSelectedElementsInPrompt(false);
    }

    const delayPara = async (fullStr) => {
        let newResultDataAccumulator = "";
        if (typeof fullStr !== 'string') {
            console.warn("delayPara received non-string input:", fullStr);
            setResultData(String(fullStr)); 
            return;
        }
        for (let i = 0; i < fullStr.length; i++) {
            newResultDataAccumulator += fullStr[i];
            setResultData(newResultDataAccumulator);
            await new Promise(resolve => setTimeout(resolve, 1)); 
        }
    };

    const extractBpmnXml = (aiResponse) => {
        const start = aiResponse.indexOf(XML_START_DELIMITER);
        const end = aiResponse.indexOf(XML_END_DELIMITER);

        if (start !== -1 && end !== -1 && start < end) {
            return aiResponse.substring(start + XML_START_DELIMITER.length, end).trim();
        }
        return null;
    };

    const extractNonBpmnXml = (aiResponse) => {
        const start = aiResponse.indexOf(XML_START_DELIMITER);
        const end = aiResponse.indexOf(XML_END_DELIMITER);

        if (start !== -1 && end !== -1 && start < end) {
            // Everything before the start delimiter + everything after the end delimiter
            const before = aiResponse.substring(0, start);
            const after = aiResponse.substring(end + XML_END_DELIMITER.length);
            return (before + after).trim();
        }
        return aiResponse;
    };
    

    const reportRenderAttempt = useCallback((result) => { // result: { xml, status, error }
        setRenderAttempt(result);
    }, [setRenderAttempt]); // setRenderAttempt is stable

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        prevResults, 
        setPrevResults, 
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
        includeDiagramInPrompt,
        setIncludeDiagramInPrompt,
        selectedBPMNElements, // Export new state
        setSelectedBPMNElements, // Export new setter
        includeSelectedElementsInPrompt, // Export new state
        toggleIncludeSelectedElements, // Export new toggle function
        renderDiagram, 
        setRenderDiagram, 
        appianQuery,
        setAppianQuery, // Added setter for appianQuery
        isModelerInitialized, 
        setIsModelerInitialized, 
        reportRenderAttempt,
        totalClicks,
        bpmnPanelClicks,
        incrementTotalClicks,
        incrementBpmnPanelClicks,
        promptLogs,
        promptCount,
        docLinkClicks,
        incrementDocLinkClicks,
        // Add the prepare functions and others
        prepareCreateTemplate,
        prepareCreateFromDescription,
        prepareStartModellingScratch,
        prepareAnalyzeProcessModel, // ADDED
        prepareGenerateModel,
        prepareRecommendUpload,
        prepareAppianQuery,
        cancelPreparedAction,
        toggleIncludeDiagram,
        toggleAppianQuery
    };

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;