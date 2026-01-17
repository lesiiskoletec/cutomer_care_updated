import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
import Subjects from "./pages/Subject"; // ✅ your file is Subject.js
import SubjectWithTeachers from "./pages/SubjectWithteacher";

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

const HomeWithLayout = withSecondLayout(Home);
const LiveWithLayout = withSecondLayout(Live);
const LMSWithLayout = withSecondLayout(LMS);
const ResultWithLayout = withSecondLayout(Result);
const ProfileWithLayout = withSecondLayout(Profile);
const SubjectsWithLayout = withSecondLayout(Subjects);
const SubjectWithTeachersWithLayout = withSecondLayout(SubjectWithTeachers); // ✅ ADD
const IndexNumberWithLayout = withSecondLayout(IndexNumber);
const LessonsWithLayout = withSecondLayout(Lessons);
const ViewLessonWithLayout = withSecondLayout(ViewLesson);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <RootLayout>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
          {/* NO bottom bar */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainSelectgrade" component={MainSelectgrade} />
          <Stack.Screen name="Sign" component={Sign} />
          <Stack.Screen name="OTP" component={OTP} />

          {/* ✅ Bottom bar pages */}
          <Stack.Screen name="Home" component={HomeWithLayout} />
          <Stack.Screen name="Live" component={LiveWithLayout} />
          <Stack.Screen name="LMS" component={LMSWithLayout} />
          <Stack.Screen name="Result" component={ResultWithLayout} />
          <Stack.Screen name="Profile" component={ProfileWithLayout} />

          {/* ✅ Subjects flow */}
          <Stack.Screen name="Subjects" component={SubjectsWithLayout} />
          <Stack.Screen
            name="SubjectWithTeachers"
            component={SubjectWithTeachersWithLayout}
          />
          <Stack.Screen name="IndexNumber" component={IndexNumberWithLayout} />
          <Stack.Screen name="Lessons" component={LessonsWithLayout} />
          <Stack.Screen name="ViewLesson" component={ViewLessonWithLayout} />
        </Stack.Navigator>
      </RootLayout>
    </NavigationContainer>
  );
}
