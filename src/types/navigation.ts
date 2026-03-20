export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  MainTabs: undefined;
  ChatDetail: { chatId: string };
  LawDocumentList: { categoryId: string; categoryName: string };
  LawDocumentViewer: { categoryId: string; documentId: string };
  PrivacySecurity: undefined;
  TermsConditions: undefined;
  HelpSupport: undefined;
};

export type MainTabParamList = {
  Chat: undefined;
  History: undefined;
  LawLibrary: undefined;
  Account: undefined;
};
