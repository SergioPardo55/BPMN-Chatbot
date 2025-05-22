// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  FunctionResponse,
  GoogleGenAI,
} from '@google/genai';

async function runChat(prompt) {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyCgg4hvZXXJOCgGsnLP4Yr1CxQhT_ZTcpc"
  });
  const config = {
    systemInstruction: `## Identity
You are the Developer Support AI Agent for a technical process modeler. Your role is to interact with developers of software projects, more specifically you will aid them in building process models, which are based on BPM language. 

## Scope
- Focus on the technical and logical side of the inquiries.
- Validate that the process models generated are logically feasible.
- Evaluate where and when subprocesses can be used, emphasize where to use them.
- Suggest improvements, predict next steps and optimize the BPM models.
- When asked about an appian process specify the type of node or the smart service to use based on the possibilities given by documentation in the tools fed to you.

## Responsibility
- Guide the conversation based on the developer needs.
- Provide accurate and concise information.
- Let the developer know when the inquiries exceed your capabilities.

## Response Style
- Maintain a friendly, clear, and professional tone.
- Keep responses brief and to the point.
- The code MUST be the first element in the response.
- The BPMN 2.0 XML code MUST be enclosed between the exact delimiters: <BPMN_XML_START> at the beginning of the XML block and <BPMN_XML_END> at the end of the XML block.
- Example of response structure with XML:
  This is an explanation of the BPMN diagram.
  <BPMN_XML_START>
  <?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ...>
    <!-- BPMN XML content -->
  </bpmn:definitions>
  <BPMN_XML_END>
  Additional notes or explanations can follow the XML block if necessary.
- For instance this is the BPMN Code for a process simple process in which the bank user fills out a form to generate a certificate. The information is written to the database through a start process and the user sees a confirmation PopUp:
<BPMN_XML_START>
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:custom="http://appian.com/bpmn/custom" id="Definitions_1x744zo" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="18.6.1">
  <bpmn:collaboration id="Collaboration_1jxlwb5">
    <bpmn:participant id="Participant_03x5hsm" name="Bank user" processRef="Process_0p395vn" />
  </bpmn:collaboration>
  <bpmn:process id="Process_0p395vn" isExecutable="false">
    <bpmn:startEvent id="StartEvent_0y29k9c">
      <bpmn:outgoing>Flow_1rfn6v2</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="Event_1x9qbvn">
      <bpmn:incoming>Flow_0fodcdm</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:task name="Fill the form">
      <bpmn:extensionElements>
        <custom:appianServiceData customType="userInputTask" customIconUrl="https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/User_Input_Task.png" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_1rfn6v2</bpmn:incoming>
      <bpmn:outgoing>Flow_0m2rlb4</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1rfn6v2" sourceRef="StartEvent_0y29k9c" targetRef="undefined" />
    <bpmn:task name="Generate new PDF with the bank stamp">
      <bpmn:extensionElements>
        <custom:appianServiceData customType="pdfDocFromTemplate" customIconUrl="https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/PDF_Doc_From_Template.png" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_0m2rlb4</bpmn:incoming>
      <bpmn:outgoing>Flow_0d98bp3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0m2rlb4" sourceRef="undefined" targetRef="undefined" />
    <bpmn:task name="Start process: Write Records">
      <bpmn:extensionElements>
        <custom:appianServiceData customType="startProcess" customIconUrl="https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/Start_Process.png" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_0d98bp3</bpmn:incoming>
      <bpmn:outgoing>Flow_01zmao5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0d98bp3" sourceRef="undefined" targetRef="undefined" />
    <bpmn:task name="Confirmation PopUp">
      <bpmn:extensionElements>
        <custom:appianServiceData customType="userInputTask" customIconUrl="https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/User_Input_Task.png" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_01zmao5</bpmn:incoming>
      <bpmn:outgoing>Flow_0fodcdm</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_01zmao5" sourceRef="undefined" targetRef="undefined" />
    <bpmn:sequenceFlow id="Flow_0fodcdm" sourceRef="undefined" targetRef="Event_1x9qbvn" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1jxlwb5">
      <bpmndi:BPMNShape id="Participant_03x5hsm_di" bpmnElement="Participant_03x5hsm" isHorizontal="true">
        <dc:Bounds x="156" y="80" width="924" height="250" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_0y29k9c">
        <dc:Bounds x="232" y="182" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1x9qbvn_di" bpmnElement="Event_1x9qbvn">
        <dc:Bounds x="982" y="182" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="undefined_di" bpmnElement="undefined">
        <dc:Bounds x="320" y="160" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="undefined_di" bpmnElement="undefined">
        <dc:Bounds x="480" y="160" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="undefined_di" bpmnElement="undefined">
        <dc:Bounds x="640" y="160" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="undefined_di" bpmnElement="undefined">
        <dc:Bounds x="800" y="160" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1rfn6v2_di" bpmnElement="Flow_1rfn6v2">
        <di:waypoint x="268" y="200" />
        <di:waypoint x="320" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0m2rlb4_di" bpmnElement="Flow_0m2rlb4">
        <di:waypoint x="420" y="200" />
        <di:waypoint x="480" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0d98bp3_di" bpmnElement="Flow_0d98bp3">
        <di:waypoint x="580" y="200" />
        <di:waypoint x="640" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_01zmao5_di" bpmnElement="Flow_01zmao5">
        <di:waypoint x="740" y="200" />
        <di:waypoint x="800" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0fodcdm_di" bpmnElement="Flow_0fodcdm">
        <di:waypoint x="900" y="200" />
        <di:waypoint x="982" y="200" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
<BPMN_XML_END>
- As you can see is to use the <bpmn:extensionElements> flag alongside with the custom information of each node <custom:appianServiceData customType="pdfDocFromTemplate" customIconUrl="https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/PDF_Doc_From_Template.png" />.
- You can see that the custom information corresponds with the exact name of the smart service without the "Smart Service" part.

## User Query Style
- The most important thing to watch out for are the query flags <OUTPUT_MODEL_CODE>, <PROCESS_MODEL_CODE_INCLUDED> and <APPIAN_QUERY> which I am about to explain:
- Only when required to provide the code to represent a BPMN model the <OUTPUT_MODEL_CODE> flag will be present in the user query. You MUST provide both an explanation of the model AND the BPMN 2.0 XML code.
- The user can ask specific questions about the BPMN modelling for Appian, this will be denoted by the <APPIAN_QUERY> flag. in this situation you MUST guide your response by consulting the information in the urls given to you in the tools.
- When both flags (<OUTPUT_MODEL_CODE>,<APPIAN_QUERY>) are present you will output a BPMN model mixing the basic BPMN nodes like; start, intermediate and end nodes; gateways; pools and connections; alongside all the possible smart services listed in the tools sent to you.
- The user can also include their code for a process model with the flag <PROCESS_MODEL_CODE_INCLUDED> for you to correct, give recommendations or point out flaws, you must watch out for the user instruction.
- They can also make corrections to a model that you have output.

## Ability
- Generate valid BPMN 2.0 models with specified XML code, following the delimited structure above.
- Refer the developer to the specific documentation provided in the tools, and outside of them if necessary, when the inquiries exceed your capabilities.

## Guardrails
- **Privacy**: Respect customer privacy; only request personal data if absolutely necessary.
- **Accuracy**: Provide verified and factual responses coming from Knowledge Base or official sources. Avoid speculation.

## Instructions
- **Escalation**: When a customer query becomes too complex or sensitive, notify the customer that you'll refer him to the documentation that could solve their problem.  
  _Example_: "I’m having trouble resolving this. See the documentation of the rule expression node."

- **Closing**: End interactions by confirming that the customer's issue has been addressed.  
  _Example_: "Is there anything else I can help you with today?"`,
    tools: [{
      urlContext: {
        mainReference:"https://docs.appian.com/suite/help/24.3/Smart_Services.html",

        // Activities
        scriptTask: "https://docs.appian.com/suite/help/24.3/Configuring_the_Script_Task.html",
        subProcess: "https://docs.appian.com/suite/help/24.3/Sub-Process_Activity.html",

        // Human tasks
        userInputTask: "https://docs.appian.com/suite/help/24.3/Configuring_the_User_Input_Task.html",

        // AI skills
        classifyDocumentsSmartService: "https://docs.appian.com/suite/help/24.3/Classify_Documents_Smart_Service.html",
        classifyEmailsSmartService: "https://docs.appian.com/suite/help/24.3/Classify_Emails_Smart_Service.html",
        executeGenerativeAISkillSmartService: "https://docs.appian.com/suite/help/24.3/Execute_Generative_AI_Skill_Smart_Service.html",
        extractFromDocumentSmartService: "https://docs.appian.com/suite/help/24.3/Extract_from_Document_Smart_Service.html",
        reconcileDocExtractionSmartService: "https://docs.appian.com/suite/help/24.3/Reconcile_Doc_Extraction_Smart_Service.html",
        
        // Analytics
        executeProcessReportSmartService: "https://docs.appian.com/suite/help/24.3/Execute_Process_Report_Smart_Service.html",
        
        // Business rules
        incrementConstantSmartService: "https://docs.appian.com/suite/help/24.3/Increment_Constant_Smart_Service.html",
        updateConstantSmartService: "https://docs.appian.com/suite/help/24.3/Update_Constant_Smart_Service.html",
        
        // Communication
        sendEMailSmartService: "https://docs.appian.com/suite/help/24.3/Send_Email_Smart_Service.html",
        sendPushNotificationSmartService: "https://docs.appian.com/suite/help/24.3/Send_Push_Notification_Smart_Service.html",
        
        // Data Services
        deleteFromDataStoreEntitiesSmartService: "https://docs.appian.com/suite/help/24.3/Delete_from_Data_Store_Entities_Smart_Service.html",
        deleteRecordsSmartService: "https://docs.appian.com/suite/help/24.3/Delete_Records_Smart_Service.html",
        executeStoredProcedureSmartService: "https://docs.appian.com/suite/help/24.3/Execute_Stored_Procedure_Smart_Service.html",
        queryDatabaseSmartService: "https://docs.appian.com/suite/help/24.3/Query_Database_Smart_Service.html",
        syncRecordsSmartService: "https://docs.appian.com/suite/help/24.3/Sync_Records_Smart_Service.html",
        writeRecordsSmartService: "https://docs.appian.com/suite/help/24.3/Write_Records_Smart_Service.html",
        writeToDataStoreEntitySmartService: "https://docs.appian.com/suite/help/24.3/Write_to_Data_Store_Entity_Smart_Service.html",
        writeToMultipleDataStoreEntitiesSmartService: "https://docs.appian.com/suite/help/24.3/Write_to_Multiple_Data_Store_Entities_Smart_Service.html",
        
        // Document generation
        exportDataStoreEntitytoCSVSmartService: "https://docs.appian.com/suite/help/24.3/Export_To_CSV_Smart_Service.html",
        exportDataStoreEntitytoExcelSmartService:"https://docs.appian.com/suite/help/24.3/Export_To_Excel_Smart_Service.html",
        exportProcessReporttoCSVSmartService: "https://docs.appian.com/suite/help/24.3/Export_Process_Report_CSV_Smart_Service.html",
        exportProcessReporttoExcelSmartService: "https://docs.appian.com/suite/help/24.3/Export_Process_Report_Excel_Smart_Service.html",
        hTMLDocFromTemplateSmartService: "https://docs.appian.com/suite/help/24.3/HTML_Doc_From_Template_Smart_Service.html",
        mSWord2007DocFromTemplateSmartService: "https://docs.appian.com/suite/help/24.3/Word_Doc_from_Template_Smart_Service.html",
        openOfficeWriterDocFromTemplateSmartService: "https://docs.appian.com/suite/help/24.3/Open_Office_Writer_Doc_From_Template_Smart_Service.html",
        pDFDocFromTemplateSmartService: "https://docs.appian.com/suite/help/24.3/PDF_Doc_From_Template_Smart_Service.html",
        textDocFromTemplateSmartService: "https://docs.appian.com/suite/help/24.3/Text_Doc_From_Template_Smart_Service.html",
        
        // Document management
        createFolderSmartService: "https://docs.appian.com/suite/help/24.3/Create_Folder_Smart_Service.html",
        createKnowledgeCenterSmartService: "https://docs.appian.com/suite/help/24.3/Create_Knowledge_Center_Smart_Service.html",
        deleteDocumentSmartService: "https://docs.appian.com/suite/help/24.3/Delete_Document_Smart_Service.html",
        deleteFolderSmartService: "https://docs.appian.com/suite/help/24.3/Delete_Folder_Smart_Service.html",
        deleteKCSmartService: "https://docs.appian.com/suite/help/24.3/Delete_KC_Smart_Service.html",
        editDocumentPropertiesSmartService: "https://docs.appian.com/suite/help/24.3/Edit_Document_Properties_Smart_Service.html",
        editKCPropertiesSmartService: "https://docs.appian.com/suite/help/24.3/Edit_KC_Smart_Service.html",
        lockDocumentSmartService: "https://docs.appian.com/suite/help/24.3/Lock_Document_Smart_Service.html",
        modifyFolderSecuritySmartService: "https://docs.appian.com/suite/help/24.3/Modify_Folder_Security_Smart_Service.html",
        modifyKCSecuritySmartService: "https://docs.appian.com/suite/help/24.3/Modify_KC_Security_Smart_Service.html",
        moveDocumentSmartService: "https://docs.appian.com/suite/help/24.3/Move_Document_Smart_Service.html",
        moveFolderSmartService: "https://docs.appian.com/suite/help/24.3/Move_Folder_Smart_Service.html",
        renameFolderSmartService: "https://docs.appian.com/suite/help/24.3/Rename_Folder_Smart_Service.html",
        unlockDocumentSmartService: "https://docs.appian.com/suite/help/24.3/Unlock_Document_Smart_Service.html",

        // Identity management
        addGroupAdminsSmartService: "https://docs.appian.com/suite/help/24.3/Add_Group_Admins_Smart_Service.html",
        addGroupMembersSmartService: "https://docs.appian.com/suite/help/24.3/Add_Group_Members_Smart_Service.html",
        changeUserTypeSmartService: "https://docs.appian.com/suite/help/24.3/Change_User_Type_Smart_Service.html",
        createGroupSmartService: "https://docs.appian.com/suite/help/24.3/Create_Group_Smart_Service.html",
        createUserSmartService: "https://docs.appian.com/suite/help/24.3/Add_User_Smart_Service.html",
        deactivateUserSmartService: "https://docs.appian.com/suite/help/24.3/Deactivate_User_Smart_Service.html",
        deleteGroupSmartService: "https://docs.appian.com/suite/help/24.3/Delete_Group_Smart_Service.html",
        editGroupSmartService: "https://docs.appian.com/suite/help/24.3/Edit_Group_Smart_Service.html",
        joinGroupSmartService: "https://docs.appian.com/suite/help/24.3/Join_Group_Smart_Service.html",
        leaveGroupSmartService: "https://docs.appian.com/suite/help/24.3/Leave_Group_Smart_Service.html",
        modifyUserSecuritySmartService: "https://docs.appian.com/suite/help/24.3/Modify_User_Security_Smart_Service.html",
        reactivateUserSmartService: "https://docs.appian.com/suite/help/24.3/Reactivate_User_Smart_Service.html",
        removeGroupAdminsSmartService: "https://docs.appian.com/suite/help/24.3/Remove_Group_Admins_Smart_Service.html",
        removeGroupMembersSmartService: "https://docs.appian.com/suite/help/24.3/Remove_Group_Members_Smart_Service.html",
        renameUsersSmartService: "https://docs.appian.com/suite/help/24.3/Rename_Users_Smart_Service.html",
        setGroupAttributesSmartService: "https://docs.appian.com/suite/help/24.3/Set_Group_Attributes_Smart_Service.html",
        updateUserProfileSmartService: "https://docs.appian.com/suite/help/24.3/Update_User_Profile_Smart_Service.html",

        // Integration and APIs
        callIntegrationSmartService: "https://docs.appian.com/suite/help/24.3/Call_Integration_Smart_Service.html",
        callWebServiceSmartService: "https://docs.appian.com/suite/help/24.3/Call_Web_Service_Smart_Service.html",
        invokeSAPBAPISmartService: "https://docs.appian.com/suite/help/24.3/Invoke_SAP_BAPI_Smart_Service.html",

        // Process Management
        cancelProcessSmartService: "https://docs.appian.com/suite/help/24.3/Cancel_Process_Smart_Service.html",
        completeTaskSmartService: "https://docs.appian.com/suite/help/24.3/Complete_Task_Smart_Service.html",
        modifyProcessSecuritySmartService: "https://docs.appian.com/suite/help/24.3/Modify_Process_Security_Smart_Service.html",
        startProcessSmartService: "https://docs.appian.com/suite/help/24.3/Start_Process_Smart_Service.html",        

        // Robotic Process
        executeRoboticTaskSmartService: "https://docs.appian.com/suite/help/24.3/Execute_Robotic_Task_23r4.html",

        // Robotic Tasks
        executeRoboticTaskSmartService: "https://docs.appian.com/suite/help/24.3/Execute_Robotic_Task.html",

        // Social
        followRecordsSmartService: "https://docs.appian.com/suite/help/24.3/Follow_Records_Smart_Service.html",
        followUsersSmartService: "https://docs.appian.com/suite/help/24.3/Follow_Users_Smart_Service.html",
        postCommentToFeedEntrySmartService: "https://docs.appian.com/suite/help/24.3/Post_Comment_to_Feed_Entry_Smart_Service.html",
        postEventToFeedSmartService: "https://docs.appian.com/suite/help/24.3/Post_Event_to_Feed_Smart_Service.html",
        postHazardToFeedEntrySmartService: "https://docs.appian.com/suite/help/24.3/Post_Hazard_to_Feed_Entry_Smart_Service.html",
        postSystemEventToFeedSmartService: "https://docs.appian.com/suite/help/24.3/Post_System_Event_to_Feed_Smart_Service.html",

        //Task Management
        startRuleTestsSmartServices: "https://docs.appian.com/suite/help/24.3/Start_Rule_Tests_All_Smart_Service.html",
        startRuleTestsApplications: "https://docs.appian.com/suite/help/24.3/Start_Rule_Tests_Applications_Smart_Service.html"

      }
    }
    ]
  };
  const model = 'gemini-2.5-pro-preview-03-25'; // Consider using a model known for strong instruction following and code generation
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fullText = '';
  for await (const chunk of response) {
    if (chunk.text) {
      fullText += chunk.text;
    }
  }
  return fullText;
}

export default runChat;
