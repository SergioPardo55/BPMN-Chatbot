export const APPIAN_ICON_BASE_URL = 'https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/';

export const appianSmartServices = [
  // Workflow Tasks
  { name: 'User Input Task', icon: 'User_Input_Task.png', type: 'bpmn:Task', customType: 'userInputTask', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Configuring_the_User_Input_Task.html' },
  { name: 'Script Task', icon: 'Script_Task.png', type: 'bpmn:Task', customType: 'scriptTask', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Configuring_the_Script_Task.html' },
  // Workflow SubProcess
  { name: 'Subprocess', icon: 'Sub_Process.png', type: 'bpmn:SubProcess', customType: 'subprocess', isExpanded: true, documentationUrl: 'https://docs.appian.com/suite/help/24.3/Sub-Process_Activity.html' },
  // Automation - AI
  { name: 'Classify Documents', icon: 'Classify_Documents.png', type: 'bpmn:Task', customType: 'classifyDocuments', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Classify_Documents_Smart_Service.html' },
  { name: 'Execute Generative AI Skill', icon: 'Execute_Prompt.png', type: 'bpmn:Task', customType: 'executeGenerativeAiSkill', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Execute_Generative_AI_Skill_Smart_Service.html' },
  // Automation - Communication
  { name: 'Send E-Mail', icon: 'Send_Email.png', type: 'bpmn:Task', customType: 'sendEmail', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Send_Email_Smart_Service.html' },
  // Automation - Data Services
  { name: 'Write to Data Store Entity', icon: 'Write_To_Data_Store_Entity.png', type: 'bpmn:Task', customType: 'writeToDataStoreEntity', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Write_to_Data_Store_Entity_Smart_Service.html' },
  { name: 'Query Database', icon: 'Query_Database.png', type: 'bpmn:Task', customType: 'queryDatabase', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Query_Database_Smart_Service.html' },
  // Automation - Integrations & APIs
  { name: 'Call Integration', icon: 'Call_Integration.png', type: 'bpmn:Task', customType: 'callIntegration', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Call_Integration_Smart_Service.html' },
  { name: 'Call Web Service', icon: 'Call_Web_Service.png', type: 'bpmn:Task', customType: 'callWebService', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Call_Web_Service_Smart_Service.html' },
  { name: 'Invoke SAP BAPI', icon: 'Invoke_SAP_BAPI.png', type: 'bpmn:Task', customType: 'invokeSapBapi', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Invoke_SAP_BAPI_Smart_Service.html' },
  // Automation - AI Skills (continued)
  { name: 'Classify Emails', icon: 'Classify_Emails.png', type: 'bpmn:Task', customType: 'classifyEmails', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Classify_Emails_Smart_Service.html' },
  { name: 'Extract from Document', icon: 'Extract_From_Document.png', type: 'bpmn:Task', customType: 'extractFromDocument', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Extract_from_Document_Smart_Service.html' },
  { name: 'Reconcile Doc Extraction', icon: 'Reconcile_Doc_Extraction.png', type: 'bpmn:Task', customType: 'reconcileDocExtraction', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Reconcile_Doc_Extraction_Smart_Service.html' },
  // Automation - Analytics
  { name: 'Execute Process Report', icon: 'Execute_Process_Report.png', type: 'bpmn:Task', customType: 'executeProcessReport', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Execute_Process_Report_Smart_Service.html' },
  // Automation - Business Rules
  { name: 'Increment Constant', icon: 'Increment_Constant.png', type: 'bpmn:Task', customType: 'incrementConstant', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Increment_Constant_Smart_Service.html' },
  { name: 'Update Constant', icon: 'Update_Constant.png', type: 'bpmn:Task', customType: 'updateConstant', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Update_Constant_Smart_Service.html' },
  // Automation - Communication (continued)
  { name: 'Send Push Notification', icon: 'Send_Push_Notification.png', type: 'bpmn:Task', customType: 'sendPushNotification', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Send_Push_Notification_Smart_Service.html' },
  // Automation - Data Services (continued)
  { name: 'Delete Records', icon: 'Delete_Records.png', type: 'bpmn:Task', customType: 'deleteRecords', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Delete_Records_Smart_Service.html' },
  { name: 'Delete from Data Store Entities', icon: 'Delete_From_Data_Store_Entity.png', type: 'bpmn:Task', customType: 'deleteFromDataStoreEntities', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Delete_from_Data_Store_Entities_Smart_Service.html' },
  { name: 'Execute Stored Procedure', icon: 'Execute_Stored_Procedure.png', type: 'bpmn:Task', customType: 'executeStoredProcedure', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Execute_Stored_Procedure_Smart_Service.html' },
  { name: 'Sync Records', icon: 'Sync_Records_from_Source.png', type: 'bpmn:Task', customType: 'syncRecords', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Sync_Records_Smart_Service.html' },
  { name: 'Write Records', icon: 'Write_Records.png', type: 'bpmn:Task', customType: 'writeRecords', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Write_Records_Smart_Service.html' },
  { name: 'Write to Multiple Data Store Entities', icon: 'Write_To_Multiple_Data_Store_Entity.png', type: 'bpmn:Task', customType: 'writeToMultipleDataStoreEntities', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Write_to_Multiple_Data_Store_Entities_Smart_Service.html' },
  // Automation - Document Generation
  { name: 'Export Process Report to CSV', icon: 'Export_Process_Report_To_CSV.png', type: 'bpmn:Task', customType: 'exportProcessReportToCsv', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Export_Process_Report_CSV_Smart_Service.html' },
  { name: 'Export Process Report to Excel', icon: 'Export_Process_Report_to_Excel.png', type: 'bpmn:Task', customType: 'exportProcessReportToExcel', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Export_Process_Report_Excel_Smart_Service.html' },
  { name: 'Export Data Store Entity to CSV', icon: 'Export_Data_Store_Entity_to_CSV.png', type: 'bpmn:Task', customType: 'exportDataStoreEntityToCsv', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Export_To_CSV_Smart_Service.html' },
  { name: 'Export Data Store Entity to Excel', icon: 'Export_Data_Store_Entity_to_Excel.png', type: 'bpmn:Task', customType: 'exportDataStoreEntityToExcel', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Export_To_Excel_Smart_Service.html' },
  { name: 'HTML Doc From Template', icon: 'HTML_Doc_From_Template.png', type: 'bpmn:Task', customType: 'htmlDocFromTemplate', documentationUrl: 'https://docs.appian.com/suite/help/24.3/HTML_Doc_From_Template_Smart_Service.html' },
  { name: 'Open Office Writer Doc From Template', icon: 'Open_Office_Doc_From_Template.png', type: 'bpmn:Task', customType: 'openOfficeDocFromTemplate', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Open_Office_Writer_Doc_From_Template_Smart_Service.html' },
  { name: 'PDF Doc From Template', icon: 'PDF_Doc_From_Template.png', type: 'bpmn:Task', customType: 'pdfDocFromTemplate', documentationUrl: 'https://docs.appian.com/suite/help/24.3/PDF_Doc_From_Template_Smart_Service.html' },
  { name: 'Text Doc From Template', icon: 'Text_Doc_From_Template.png', type: 'bpmn:Task', customType: 'textDocFromTemplate', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Text_Doc_From_Template_Smart_Service.html' },
  { name: 'MS Word 2007 Doc from Template', icon: 'Word_Doc_From_Template.png', type: 'bpmn:Task', customType: 'wordDocFromTemplate', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Word_Doc_from_Template_Smart_Service.html' },
  // Automation - Document Management
  { name: 'Create Folder', icon: 'Create_Folder.png', type: 'bpmn:Task', customType: 'createFolder', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Create_Folder_Smart_Service.html' },
  { name: 'Create Knowledge Center', icon: 'Create_KC.png', type: 'bpmn:Task', customType: 'createKnowledgeCenter', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Create_Knowledge_Center_Smart_Service.html' },
  { name: 'Delete Document', icon: 'Delete_Document.png', type: 'bpmn:Task', customType: 'deleteDocument', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Delete_Document_Smart_Service.html' },
  { name: 'Delete Folder', icon: 'Delete_Folder.png', type: 'bpmn:Task', customType: 'deleteFolder', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Delete_Folder_Smart_Service.html' },
  { name: 'Delete KC', icon: 'Delete_kc.png', type: 'bpmn:Task', customType: 'deleteKc', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Delete_KC_Smart_Service.html' },
  { name: 'Edit Document Properties', icon: 'Edit_Document_Properties.png', type: 'bpmn:Task', customType: 'editDocumentProperties', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Edit_Document_Properties_Smart_Service.html' },
  { name: 'Edit KC Properties', icon: 'Edit_KC_Properties.png', type: 'bpmn:Task', customType: 'editKcProperties', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Edit_KC_Smart_Service.html' },
  { name: 'Lock Document', icon: 'Lock_Document.png', type: 'bpmn:Task', customType: 'lockDocument', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Lock_Document_Smart_Service.html' },
  { name: 'Modify Folder Security', icon: 'Modify_Folder_Security.png', type: 'bpmn:Task', customType: 'modifyFolderSecurity', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Modify_Folder_Security_Smart_Service.html' },
  { name: 'Modify KC Security', icon: 'Modify_KC_Security.png', type: 'bpmn:Task', customType: 'modifyKcSecurity', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Modify_KC_Security_Smart_Service.html' },
  { name: 'Move Document', icon: 'Move_Document.png', type: 'bpmn:Task', customType: 'moveDocument', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Move_Document_Smart_Service.html' },
  { name: 'Move Folder', icon: 'Move_Folder.png', type: 'bpmn:Task', customType: 'moveFolder', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Move_Folder_Smart_Service.html' },
  { name: 'Rename Folder', icon: 'Rename_Folder.png', type: 'bpmn:Task', customType: 'renameFolder', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Rename_Folder_Smart_Service.html' },
  { name: 'Unlock Document', icon: 'Unlock_Document.png', type: 'bpmn:Task', customType: 'unlockDocument', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Unlock_Document_Smart_Service.html' },
  // Automation - Identity Management
  { name: 'Add Group Admins', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'addGroupAdmins', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Add_Group_Admins_Smart_Service.html' },
  { name: 'Add Group Members', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'addGroupMembers', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Add_Group_Members_Smart_Service.html' },
  { name: 'Create User', icon: 'Add_User.png', type: 'bpmn:Task', customType: 'createUser', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Add_User_Smart_Service.html' },
  { name: 'Change User Type', icon: 'Change_User_Type.png', type: 'bpmn:Task', customType: 'changeUserType', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Change_User_Type_Smart_Service.html' },
  { name: 'Create Group', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'createGroup', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Create_Group_Smart_Service.html' },
  { name: 'Deactivate User', icon: 'Deactivate_User.png', type: 'bpmn:Task', customType: 'deactivateUser', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Deactivate_User_Smart_Service.html' },
  { name: 'Delete Group', icon: 'Delete_Group.png', type: 'bpmn:Task', customType: 'deleteGroup', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Delete_Group_Smart_Service.html' },
  { name: 'Edit Group', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'editGroup', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Edit_Group_Smart_Service.html' },
  { name: 'Join Group', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'joinGroup', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Join_Group_Smart_Service.html' },
  { name: 'Leave Group', icon: 'Leave_Group.png', type: 'bpmn:Task', customType: 'leaveGroup', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Leave_Group_Smart_Service.html' },
  { name: 'Modify User Security', icon: 'Modify_User_Security.png', type: 'bpmn:Task', customType: 'modifyUserSecurity', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Modify_User_Security_Smart_Service.html' },
  { name: 'Reactivate User', icon: 'Reactivate_User.png', type: 'bpmn:Task', customType: 'reactivateUser', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Reactivate_User_Smart_Service.html' },
  { name: 'Remove Group Admins', icon: 'Remove_Group_Members.png', type: 'bpmn:Task', customType: 'removeGroupAdmins', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Remove_Group_Admins_Smart_Service.html' },
  { name: 'Remove Group Members', icon: 'Remove_Group_Members.png', type: 'bpmn:Task', customType: 'removeGroupMembers', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Remove_Group_Members_Smart_Service.html' },
  { name: 'Rename Users', icon: 'Change_User_Type.png', type: 'bpmn:Task', customType: 'renameUsers', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Rename_Users_Smart_Service.html' },
  { name: 'Set Group Attributes', icon: 'Add_Group_Members.png', type: 'bpmn:Task', customType: 'setGroupAttributes', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Set_Group_Attributes_Smart_Service.html' },
  { name: 'Update User Profile', icon: 'Change_User_Type.png', type: 'bpmn:Task', customType: 'updateUserProfile', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Update_User_Profile_Smart_Service.html' },
  // Automation - Process Management
  { name: 'Cancel Process', icon: 'Cancel_Process.png', type: 'bpmn:Task', customType: 'cancelProcess', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Cancel_Process_Smart_Service.html' },
  { name: 'Complete Task', icon: 'Complete_Task.png', type: 'bpmn:Task', customType: 'completeTask', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Complete_Task_Smart_Service.html' },
  { name: 'Modify Process Security', icon: 'Modify_Process_Security.png', type: 'bpmn:Task', customType: 'modifyProcessSecurity', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Modify_Process_Security_Smart_Service.html' },
  { name: 'Start Process', icon: 'Start_Process.png', type: 'bpmn:Task', customType: 'startProcess', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Start_Process_Smart_Service.html' },
  // Automation - Robotic Processes/Tasks
  { name: 'Execute Robotic Task', icon: 'Execute_Robotic_Process.png', type: 'bpmn:Task', customType: 'executeRoboticTask', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Execute_Robotic_Task.html' },
  // Automation - Social
  { name: 'Follow Records', icon: 'Follow_Records.png', type: 'bpmn:Task', customType: 'followRecords', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Follow_Records_Smart_Service.html' },
  { name: 'Follow Users', icon: 'Follow_Users.png', type: 'bpmn:Task', customType: 'followUsers', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Follow_Users_Smart_Service.html' },
  { name: 'Post Comment to Feed Entry', icon: 'Post_Comment_To_Feed.png', type: 'bpmn:Task', customType: 'postCommentToFeed', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Post_Comment_to_Feed_Entry_Smart_Service.html' },
  { name: 'Post Event to Feed', icon: 'Post_Event_To_Feed.png', type: 'bpmn:Task', customType: 'postEventToFeed', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Post_Event_to_Feed_Smart_Service.html' },
  { name: 'Post Hazard to Feed Entry', icon: 'Post_Hazard_To_Feed.png', type: 'bpmn:Task', customType: 'postHazardToFeed', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Post_Hazard_to_Feed_Entry_Smart_Service.html' },
  { name: 'Post System Event to Feed', icon: 'Post_System_Event_To_Feed.png', type: 'bpmn:Task', customType: 'postSystemEventToFeed', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Post_System_Event_to_Feed_Smart_Service.html' },
  // Automation - Test Management
  { name: 'Start Rule Tests (All)', icon: 'Start_Rules_Test_All.png', type: 'bpmn:Task', customType: 'startRuleTestsAll', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Start_Rule_Tests_All_Smart_Service.html' },
  { name: 'Start Rule Tests (Applications)', icon: 'Start_Rules_Tests_Application.png', type: 'bpmn:Task', customType: 'startRuleTestsApplications', documentationUrl: 'https://docs.appian.com/suite/help/24.3/Start_Rule_Tests_Applications_Smart_Service.html' },
];
