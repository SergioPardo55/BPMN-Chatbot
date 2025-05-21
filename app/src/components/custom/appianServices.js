export const APPIAN_ICON_BASE_URL = 'https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/';

export const appianSmartServices = [
  // Workflow Tasks
  { name: 'User Input Task', icon: 'User_Input_Task.png', type: 'bpmn:Task', customType: 'userInputTask' },
  { name: 'Script Task', icon: 'Script_Task.png', type: 'bpmn:Task', customType: 'scriptTask' },
  // Workflow SubProcess
  { name: 'Subprocess', icon: 'Sub_Process.png', type: 'bpmn:SubProcess', customType: 'subprocess', isExpanded: true },
  // Automation - AI
  { name: 'Classify Documents', icon: 'Classify_Documents.png', type: 'bpmn:Task', customType: 'classifyDocuments' },
  { name: 'Execute Generative AI Skill', icon: 'Execute_Prompt.png', type: 'bpmn:Task', customType: 'executeGenerativeAiSkill' },
  // Automation - Communication
  { name: 'Send E-Mail', icon: 'Send_Email.png', type: 'bpmn:Task', customType: 'sendEmail' },
  // Automation - Data Services
  { name: 'Write to Data Store Entity', icon: 'Write_To_Data_Store_Entity.png', type: 'bpmn:Task', customType: 'writeToDataStoreEntity' },
  { name: 'Query Database', icon: 'Query_Database.png', type: 'bpmn:Task', customType: 'queryDatabase' },
  // Automation - Integrations & APIs
  { name: 'Call Integration', icon: 'Call_Integration.png', type: 'bpmn:Task', customType: 'callIntegration' },
  { name: 'Call Web Service', icon: 'Call_Web_Service.png', type: 'bpmn:Task', customType: 'callWebService' },
  { name: 'Invoke SAP BAPI', icon: 'Invoke_SAP_BAPI.png', type: 'bpmn:Task', customType: 'invokeSapBapi' },
  // Automation - AI Skills (continued)
  { name: 'Classify Emails', icon: 'Classify_Emails.png', type: 'bpmn:Task', customType: 'classifyEmails' },
  { name: 'Extract from Document', icon: 'Extract_From_Document.png', type: 'bpmn:Task', customType: 'extractFromDocument' },
  { name: 'Reconcile Doc Extraction', icon: 'Reconcile_Doc_Extraction.png', type: 'bpmn:Task', customType: 'reconcileDocExtraction' },
  // Automation - Analytics
  { name: 'Execute Process Report', icon: 'Execute_Process_Report.png', type: 'bpmn:Task', customType: 'executeProcessReport' },
  // Automation - Business Rules
  { name: 'Increment Constant', icon: 'Increment_Constant.png', type: 'bpmn:Task', customType: 'incrementConstant' },
  { name: 'Update Constant', icon: 'Update_Constant.png', type: 'bpmn:Task', customType: 'updateConstant' },
  // Automation - Communication (continued)
  { name: 'Send Push Notification', icon: 'Send_Push_Notification.png', type: 'bpmn:Task', customType: 'sendPushNotification' },
  // Automation - Data Services (continued)
  { name: 'Delete Records', icon: 'Delete_Records.png', type: 'bpmn:Task', customType: 'deleteRecords' },
  { name: 'Delete from Data Store Entities', icon: 'Delete_From_Data_Store_Entity.png', type: 'bpmn:Task', customType: 'deleteFromDataStoreEntities' },
  { name: 'Execute Stored Procedure', icon: 'Execute_Stored_Procedure.png', type: 'bpmn:Task', customType: 'executeStoredProcedure' },
  { name: 'Sync Records', icon: 'Sync_Records_from_Source.png', type: 'bpmn:Task', customType: 'syncRecords' },
  { name: 'Write Records', icon: 'Write_Records.png', type: 'bpmn:Task', customType: 'writeRecords' },
  { name: 'Write to Multiple Data Store Entities', icon: 'Write_To_Multiple_Data_Store_Entity.png', type: 'bpmn:Task', customType: 'writeToMultipleDataStoreEntities' },
  // Automation - Document Generation
  { name: 'Export Process Report to CSV', icon: 'Export_Process_Report_To_CSV.png', type: 'bpmn:Task', customType: 'exportProcessReportToCsv' },
  { name: 'Export Process Report to Excel', icon: 'Export_Process_Report_to_Excel.png', type: 'bpmn:Task', customType: 'exportProcessReportToExcel' },
  { name: 'Export Data Store Entity to CSV', icon: 'Export_Data_Store_Entity_to_CSV.png', type: 'bpmn:Task', customType: 'exportDataStoreEntityToCsv' },
  { name: 'Export Data Store Entity to Excel', icon: 'Export_Data_Store_Entity_to_Excel.png', type: 'bpmn:Task', customType: 'exportDataStoreEntityToExcel' },
  { name: 'HTML Doc From Template', icon: 'HTML_Doc_From_Template.png', type: 'bpmn:Task', customType: 'htmlDocFromTemplate' },
  { name: 'Open Office Writer Doc From Template', icon: 'Open_Office_Doc_From_Template.png', type: 'bpmn:Task', customType: 'openOfficeDocFromTemplate' },
  { name: 'PDF Doc From Template', icon: 'PDF_Doc_From_Template.png', type: 'bpmn:Task', customType: 'pdfDocFromTemplate' },
  { name: 'Text Doc From Template', icon: 'Text_Doc_From_Template.png', type: 'bpmn:Task', customType: 'textDocFromTemplate' },
  { name: 'MS Word 2007 Doc from Template', icon: 'Word_Doc_From_Template.png', type: 'bpmn:Task', customType: 'wordDocFromTemplate' },
  // Automation - Document Management
  { name: 'Create Folder', icon: 'Create_Folder.png', type: 'bpmn:Task', customType: 'createFolder' },
  { name: 'Create Knowledge Center', icon: 'Create_KC.png', type: 'bpmn:Task', customType: 'createKnowledgeCenter' },
  { name: 'Delete Document', icon: 'Delete_Document.png', type: 'bpmn:Task', customType: 'deleteDocument' },
  { name: 'Delete Folder', icon: 'Delete_Folder.png', type: 'bpmn:Task', customType: 'deleteFolder' },
  { name: 'Delete KC', icon: 'Delete_kc.png', type: 'bpmn:Task', customType: 'deleteKc' },
  { name: 'Edit Document Properties', icon: 'Edit_Document_Properties.png', type: 'bpmn:Task', customType: 'editDocumentProperties' },
  { name: 'Edit KC Properties', icon: 'Edit_KC_Properties.png', type: 'bpmn:Task', customType: 'editKcProperties' },
  { name: 'Lock Document', icon: 'Lock_Document.png', type: 'bpmn:Task', customType: 'lockDocument' },
  { name: 'Modify Folder Security', icon: 'Modify_Folder_Security.png', type: 'bpmn:Task', customType: 'modifyFolderSecurity' },
  { name: 'Modify KC Security', icon: 'Modify_KC_Security.png', type: 'bpmn:Task', customType: 'modifyKcSecurity' },
  { name: 'Move Document', icon: 'Move_Document.png', type: 'bpmn:Task', customType: 'moveDocument' },
  { name: 'Move Folder', icon: 'Move_Folder.png', type: 'bpmn:Task', customType: 'moveFolder' },
  { name: 'Rename Folder', icon: 'Rename_Folder.png', type: 'bpmn:Task', customType: 'renameFolder' },
  { name: 'Unlock Document', icon: 'Unlock_Document.png', type: 'bpmn:Task', customType: 'unlockDocument' },
  // Automation - Identity Management
  { name: 'Add Group Admins', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'addGroupAdmins' },
  { name: 'Add Group Members', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'addGroupMembers' },
  { name: 'Create User', icon: 'Add_User.png', type: 'bpmn:Task', customType: 'createUser' },
  { name: 'Change User Type', icon: 'Change_User_Type.png', type: 'bpmn:Task', customType: 'changeUserType' },
  { name: 'Create Group', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'createGroup' },
  { name: 'Deactivate User', icon: 'Deactivate_User.png', type: 'bpmn:Task', customType: 'deactivateUser' },
  { name: 'Delete Group', icon: 'Delete_Group.png', type: 'bpmn:Task', customType: 'deleteGroup' },
  { name: 'Edit Group', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'editGroup' },
  { name: 'Join Group', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'joinGroup' },
  { name: 'Leave Group', icon: 'Leave_Group.png', type: 'bpmn:Task', customType: 'leaveGroup' },
  { name: 'Modify User Security', icon: 'Modify_User_Security.png', type: 'bpmn:Task', customType: 'modifyUserSecurity' },
  { name: 'Reactivate User', icon: 'Reactivate_User.png', type: 'bpmn:Task', customType: 'reactivateUser' },
  { name: 'Remove Group Admins', icon: 'Remove_Group_Members.png', type: 'bpmn:Task', customType: 'removeGroupAdmins' },
  { name: 'Remove Group Members', icon: 'Remove_Group_Members.png', type: 'bpmn:Task', customType: 'removeGroupMembers' },
  { name: 'Rename Users', icon: 'Change_User_Type.png', type: 'bpmn:Task', customType: 'renameUsers' },
  { name: 'Set Group Attributes', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'setGroupAttributes' },
  { name: 'Update User Profile', icon: 'Change_User_Type.png', type: 'bpmn:Task', customType: 'updateUserProfile' },
  // Automation - Process Management
  { name: 'Cancel Process', icon: 'Cancel_Process.png', type: 'bpmn:Task', customType: 'cancelProcess' },
  { name: 'Complete Task', icon: 'Complete_Task.png', type: 'bpmn:Task', customType: 'completeTask' },
  { name: 'Modify Process Security', icon: 'Modify_Process_Security.png', type: 'bpmn:Task', customType: 'modifyProcessSecurity' },
  { name: 'Start Process', icon: 'Start_Process.png', type: 'bpmn:Task', customType: 'startProcess' },
  // Automation - Robotic Processes/Tasks
  { name: 'Execute Robotic Task', icon: 'Execute_Robotic_Process.png', type: 'bpmn:Task', customType: 'executeRoboticTask' },
  // Automation - Social
  { name: 'Follow Records', icon: 'Follow_Records.png', type: 'bpmn:Task', customType: 'followRecords' },
  { name: 'Follow Users', icon: 'Follow_Users.png', type: 'bpmn:Task', customType: 'followUsers' },
  { name: 'Post Comment to Feed Entry', icon: 'Post_Comment_To_Feed.png', type: 'bpmn:Task', customType: 'postCommentToFeed' },
  { name: 'Post Event to Feed', icon: 'Post_Event_To_Feed.png', type: 'bpmn:Task', customType: 'postEventToFeed' },
  { name: 'Post Hazard to Feed Entry', icon: 'Post_Hazard_To_Feed.png', type: 'bpmn:Task', customType: 'postHazardToFeed' },
  { name: 'Post System Event to Feed', icon: 'Post_System_Event_To_Feed.png', type: 'bpmn:Task', customType: 'postSystemEventToFeed' },
  // Automation - Test Management
  { name: 'Start Rule Tests (All)', icon: 'Start_Rules_Test_All.png', type: 'bpmn:Task', customType: 'startRuleTestsAll' },
  { name: 'Start Rule Tests (Applications)', icon: 'Start_Rules_Tests_Application.png', type: 'bpmn:Task', customType: 'startRuleTestsApplications' },
];
