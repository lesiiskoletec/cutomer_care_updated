import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { UserProvider } from "./context/UserContext";

import RootLayout from "./Layouts/RootLayout";
import SecondLayout from "./Layouts/SecondLayout";

import SplashScreen from "./pages/SplashScreen";
import MainSelectgrade from "./pages/MainSelectgrade";
import Sign from "./pages/Sign";
import OTP from "./pages/OTP";
import ViewLesson from "./pages/ViewLesson";
import Home from "./pages/Home";
import Live from "./pages/Live";
import LMS from "./pages/LMS";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import Lessons from "./pages/Lessions";
import IndexNumber from "./pages/IndexNumber";
import Subjects from "./pages/Subject";
import SubjectWithTeachers from "./pages/SubjectWithteacher";
import DailyQuiz from "./pages/DailyQuiz";
import TopicWisePaper from "./pages/TopicWisepaper";
import ModelPaper from "./pages/Modelpaper";
import PastPapers from "./pages/Pastpapers";
import EnrollSubjects from "./pages/EnrollSubjects";
import DailyQuizMenu from "./pages/DailyQuizzMenu";
import TopicWiseMenu from "./pages/TopicWisemenu";
import ModelPaperMenu from "./pages/ModelPaperMenu";
import PastpaperMenu from "./pages/PastpaperMenu";

// ✅ Paper Page (RootLayout only)
import PaperPage from "./pages/paper";

const Stack = createNativeStackNavigator();

const withSecondLayout = (ScreenComponent) => {
  return function WrappedScreen(props) {
    return (
      <SecondLayout>
        <ScreenComponent {...props} />
      </SecondLayout>
    );
  };
};

const DailyQuizMenuWithLayout = withSecondLayout(DailyQuizMenu);
const EnrollSubjectsWithLayout = withSecondLayout(EnrollSubjects);
const DailyQuizWithLayout = withSecondLayout(DailyQuiz);
const HomeWithLayout = withSecondLayout(Home);
const LiveWithLayout = withSecondLayout(Live);
const LMSWithLayout = withSecondLayout(LMS);
const ResultWithLayout = withSecondLayout(Result);
const ProfileWithLayout = withSecondLayout(Profile);
const SubjectsWithLayout = withSecondLayout(Subjects);
const SubjectWithTeachersWithLayout = withSecondLayout(SubjectWithTeachers);
const IndexNumberWithLayout = withSecondLayout(IndexNumber);
const LessonsWithLayout = withSecondLayout(Lessons);
const ViewLessonWithLayout = withSecondLayout(ViewLesson);
const TopicWisePaperWithLayout = withSecondLayout(TopicWisePaper);
const ModelPaperWithLayout = withSecondLayout(ModelPaper);
const PastPapersWithLayout = withSecondLayout(PastPapers);
const TopicWiseMenuWithLayout = withSecondLayout(TopicWiseMenu);
const ModelPaperMenuWithLayout = withSecondLayout(ModelPaperMenu);
const PastpaperMenuWithLayout = withSecondLayout(PastpaperMenu);

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <RootLayout>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} />

            {/* Select grade + auth */}
            <Stack.Screen name="MainSelectgrade" component={MainSelectgrade} />
            <Stack.Screen name="Sign" component={Sign} />
            <Stack.Screen name="OTP" component={OTP} />

            {/* Bottom bar pages */}
            <Stack.Screen name="Home" component={HomeWithLayout} />
            <Stack.Screen name="Live" component={LiveWithLayout} />
            <Stack.Screen name="LMS" component={LMSWithLayout} />
            <Stack.Screen name="Result" component={ResultWithLayout} />
            <Stack.Screen name="Profile" component={ProfileWithLayout} />

            {/* Other pages */}
            <Stack.Screen name="Subjects" component={SubjectsWithLayout} />
            <Stack.Screen name="SubjectWithTeachers" component={SubjectWithTeachersWithLayout} />
            <Stack.Screen name="IndexNumber" component={IndexNumberWithLayout} />
            <Stack.Screen name="Lessons" component={LessonsWithLayout} />
            <Stack.Screen name="ViewLesson" component={ViewLessonWithLayout} />
            <Stack.Screen name="EnrollSubjects" component={EnrollSubjectsWithLayout} />

            <Stack.Screen name="DailyQuiz" component={DailyQuizWithLayout} />
            <Stack.Screen name="TopicWisePaper" component={TopicWisePaperWithLayout} />
            <Stack.Screen name="ModelPaper" component={ModelPaperWithLayout} />
            <Stack.Screen name="PastPapers" component={PastPapersWithLayout} />

            <Stack.Screen name="DailyQuizMenu" component={DailyQuizMenuWithLayout} />
            <Stack.Screen name="TopicWiseMenu" component={TopicWiseMenuWithLayout} />
            <Stack.Screen name="ModelPaperMenu" component={ModelPaperMenuWithLayout} />
            <Stack.Screen name="PastpaperMenu" component={PastpaperMenuWithLayout} />

            {/* ✅ PaperPage uses ONLY RootLayout (NO SecondLayout wrapper) */}
            <Stack.Screen name="PaperPage" component={PaperPage} />
          </Stack.Navigator>
        </RootLayout>
      </NavigationContainer>
    </UserProvider>
  );
}
