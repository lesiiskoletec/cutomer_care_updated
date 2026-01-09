// App.js
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch } from "react-redux";
import store from "./app/store";

import SplashScreen from "./pages/SplashScreen";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/Homepage";
import Rootlayout from "./Layouts/RootLayout";
import SecondLayout from "./Layouts/SecondLayout";
import AddComplain from "./pages/AddComplain";
import DailyReport from "./pages/DailyReport";
import FullReport from "./pages/FullReport";
import Verification from "./pages/Verification";
import { loadUserFromStorage } from "./app/features/authslice";

const Stack = createNativeStackNavigator();

const AppInner = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 🔹 Try to load stored user session on app start
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#EBEBEB" />
      <Rootlayout>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Screens WITHOUT bottom nav */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="SignIn" component={SignIn} />

          {/* Screens WITH bottom nav */}
          <Stack.Screen name="Home">
            {(props) => (
              <SecondLayout>
                <HomePage {...props} />
              </SecondLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="complain">
            {(props) => (
              <SecondLayout>
                {/* 🔥 pass navigation + route into AddComplain */}
                <AddComplain {...props} />
              </SecondLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="dailyreport">
            {(props) => (
              <SecondLayout>
                <DailyReport {...props} />
              </SecondLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="fullreport">
            {(props) => (
              <SecondLayout>
                <FullReport {...props} />
              </SecondLayout>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </Rootlayout>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
