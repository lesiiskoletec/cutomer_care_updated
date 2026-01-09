// pages/AddComplain.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Fonts
import {
  useFonts as useSuez,
  SuezOne_400Regular,
} from "@expo-google-fonts/suez-one";
import { useFonts as useItim, Itim_400Regular } from "@expo-google-fonts/itim";
import {
  useFonts as useRavi,
  RaviPrakash_400Regular,
} from "@expo-google-fonts/ravi-prakash";
import {
  useFonts as useKavoon,
  Kavoon_400Regular,
} from "@expo-google-fonts/kavoon";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchMainProblems,
  fetchSubProblemsByMain,
  fetchDepartments,
  fetchResponsiblePeopleByDepartment,
  createComplaint,
  resetCreateStatus,
} from "../app/features/complainSlice";

const PRIMARY = "#3E28FF";
const BG = "#EBEBEB";

const AddComplain = ({ route }) => {
  // Fonts
  const [suezLoaded] = useSuez({ SuezOne_400Regular });
  const [itimLoaded] = useItim({ Itim_400Regular });
  const [raviLoaded] = useRavi({ RaviPrakash_400Regular });
  const [kavoonLoaded] = useKavoon({ Kavoon_400Regular });

  const dispatch = useDispatch();

  // Redux data
  const {
    mainProblems,
    subProblems,
    departments,
    responsiblePeople,
    listStatus,
    listError,
    createStatus,
    createError,
  } = useSelector((state) => state.complaints);

  const authUser = useSelector((state) => state.auth.user);

  // 🔹 userId from route (if navigated from somewhere else)
  const userIdFromRoute = route?.params?.userId;

  // ✅ EFFECTIVE USER ID (used both for UI + createComplaint.createdBy)
  const effectiveUserId =
    userIdFromRoute ||
    (authUser && typeof authUser._id === "string"
      ? authUser._id
      : authUser && typeof authUser.id === "string"
      ? authUser.id
      : null);

  const userIdShort =
    effectiveUserId && typeof effectiveUserId === "string"
      ? effectiveUserId.slice(-6)
      : null;

  // Local form state
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  // Use "" instead of null for select values
  const [selectedMainProblemId, setSelectedMainProblemId] = useState("");
  const [selectedSubProblemId, setSelectedSubProblemId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedResponsibleId, setSelectedResponsibleId] = useState("");

  // 🔄 Load dropdown master data
  useEffect(() => {
    dispatch(fetchMainProblems());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const fontsReady = suezLoaded && itimLoaded && raviLoaded && kavoonLoaded;

  // Phone input: digits only, max 10
  const onPhoneChange = (t) => {
    const digits = t.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
  };

  const onMainProblemChange = (val) => {
    const value = val || "";
    setSelectedMainProblemId(value);
    setSelectedSubProblemId("");

    const selected = mainProblems.find((p) => p._id === value);
    console.log("🟣 Selected mainProblem:", selected);

    if (value) {
      dispatch(fetchSubProblemsByMain(value));
    }
  };

  const onDepartmentPress = (deptId) => {
    const value = deptId || "";
    setSelectedDepartmentId(value);
    setSelectedResponsibleId("");

    const selected = departments.find((d) => d._id === value);
    console.log("🟡 Selected department:", selected);

    if (value) {
      dispatch(fetchResponsiblePeopleByDepartment(value));
    }
  };

  const onResponsibleChange = (val) => {
    const value = val || "";
    setSelectedResponsibleId(value);
    const selected = responsiblePeople.find((p) => p._id === value);
    console.log("🟢 Selected responsible person:", selected);
  };

  const onSubProblemChange = (val) => {
    const value = val || "";
    setSelectedSubProblemId(value);
    const selected = subProblems.find((sp) => sp._id === value);
    console.log("🔵 Selected subProblem:", selected);
  };

  const onSubmit = async () => {
    if (!effectiveUserId) {
      console.log("No user found", { userIdFromRoute, authUser });
      Alert.alert("Error", "User is not logged in. Please sign in again.");
      return;
    }

    if (!phone || !description) {
      Alert.alert("Error", "Please fill required fields (mobile & description).");
      return;
    }

    const slPhoneRegex = /^0\d{9}$/;
    if (!slPhoneRegex.test(phone)) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid Sri Lankan mobile number (10 digits, starting with 0)."
      );
      return;
    }

    if (!selectedMainProblemId) {
      Alert.alert("Error", "Please select a main problem.");
      return;
    }
    if (!selectedSubProblemId) {
      Alert.alert("Error", "Please select a sub problem.");
      return;
    }
    if (!selectedDepartmentId) {
      Alert.alert("Error", "Please select a responsible department.");
      return;
    }
    if (!selectedResponsibleId) {
      Alert.alert("Error", "Please select a responsible person.");
      return;
    }

    const payload = {
      CustomerName: customerName || undefined,
      ContactNumber: phone,
      mainProblem: selectedMainProblemId,
      subProblem: selectedSubProblemId,
      ResponsibleDepartment: selectedDepartmentId,
      responsiblePerson: selectedResponsibleId,
      description,
      createdBy: effectiveUserId,
    };

    console.log("📤 createComplaint payload (frontend):", payload);

    try {
      const savedComplaint = await dispatch(createComplaint(payload)).unwrap();

      console.log("✅ Complaint created successfully (from backend):", {
        _id: savedComplaint._id,
        InvoiceNumber: savedComplaint.InvoiceNumber,
        CustomerName: savedComplaint.CustomerName,
        ContactNumber: savedComplaint.ContactNumber,
        mainProblem: savedComplaint.mainProblem,
        subProblem: savedComplaint.subProblem,
        ResponsibleDepartment: savedComplaint.ResponsibleDepartment,
        responsiblePerson: savedComplaint.responsiblePerson,
        description: savedComplaint.description,
        createdBy: savedComplaint.createdBy,
        status: savedComplaint.status,
        createdAt: savedComplaint.createdAt,
      });

      Alert.alert("Success", "Complaint created successfully.");

      setCustomerName("");
      setPhone("");
      setDescription("");
      setSelectedMainProblemId("");
      setSelectedSubProblemId("");
      setSelectedDepartmentId("");
      setSelectedResponsibleId("");

      dispatch(resetCreateStatus());
    } catch (err) {
      console.log("❌ createComplaint failed:", err);
      Alert.alert("Failed", err || "Failed to create complaint");
    }
  };

  if (!fontsReady) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: BG }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: BG,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading...</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Add Complain</Text>

          {listStatus === "loading" && (
            <Text style={styles.infoText}>Loading dropdown data...</Text>
          )}
          {listError && (
            <Text style={styles.errorText}>
              Failed to load dropdown data: {listError}
            </Text>
          )}

          {/* Customer Name */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Customer name</Text>
            <TextInput
              value={customerName}
              onChangeText={setCustomerName}
              style={styles.input}
              placeholder="Enter customer name"
              placeholderTextColor="#777"
            />
          </View>

          {/* Mobile number */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Mobile number *</Text>
            <TextInput
              value={phone}
              onChangeText={onPhoneChange}
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
              placeholder="07XXXXXXXX"
              placeholderTextColor="#777"
            />
          </View>

          {/* Main Problem */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Problem *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                mode="dropdown"
                selectedValue={selectedMainProblemId}
                onValueChange={onMainProblemChange}
                dropdownIconColor={PRIMARY}
                style={styles.pickerNoBorder}
              >
                <Picker.Item
                  label="Select main problem"
                  value=""
                  color="#999"
                />
                {mainProblems.map((p) => (
                  <Picker.Item
                    key={p._id}
                    label={p.name}
                    value={p._id}
                    color="#000"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Sub Problem */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Sub Problem *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                mode="dropdown"
                selectedValue={selectedSubProblemId}
                onValueChange={onSubProblemChange}
                dropdownIconColor={PRIMARY}
                style={styles.pickerNoBorder}
              >
                <Picker.Item
                  label="Select sub problem"
                  value=""
                  color="#999"
                />
                {subProblems.map((sp) => (
                  <Picker.Item
                    key={sp._id}
                    label={sp.name}
                    value={sp._id}
                    color="#000"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Departments (chips) */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Responsible Department *</Text>
            <View style={styles.deptRow}>
              {departments.map((d) => {
                const selected = selectedDepartmentId === d._id;
                return (
                  <Pressable
                    key={d._id}
                    style={[
                      styles.checkbox,
                      selected && styles.checkboxSelected,
                    ]}
                    onPress={() => onDepartmentPress(d._id)}
                  >
                    <View
                      style={[
                        styles.checkboxSquare,
                        selected && styles.checkboxSquareSelected,
                      ]}
                    />
                    <Text style={styles.checkboxLabel}>{d.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Responsible People */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Responsible people *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                mode="dropdown"
                selectedValue={selectedResponsibleId}
                onValueChange={onResponsibleChange}
                dropdownIconColor={PRIMARY}
                style={styles.pickerNoBorder}
              >
                <Picker.Item
                  label="Select responsible person"
                  value=""
                  color="#999"
                />
                {responsiblePeople.map((person) => (
                  <Picker.Item
                    key={person._id}
                    label={person.name}
                    value={person._id}
                    color="#000"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Description */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textarea]}
              multiline
              placeholder="Describe the issue..."
              placeholderTextColor="#777"
            />
          </View>

          <Pressable
            style={styles.button}
            onPress={onSubmit}
            disabled={createStatus === "loading"}
          >
            <Text style={styles.buttonText}>
              {createStatus === "loading" ? "Submitting..." : "Submit"}
            </Text>
          </Pressable>

          {createError && (
            <Text style={styles.errorText}>
              Failed to create complaint: {createError}
            </Text>
          )}

          {/* ⬇️ more space under submit button */}
          <View style={{ height: 90 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: BG,
    paddingVertical: 10,
  },
  container: {
    width: "90%",
    backgroundColor: BG,
    alignItems: "center",
    paddingTop: 20, // ⬅️ extra space above "Add Complain"
  },
  heading: {
    fontFamily: "Kavoon_400Regular",
    fontSize: 34,
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 10,
  },

  // Wrapper for each field to guarantee spacing
  fieldBlock: {
    width: "100%",
    marginBottom: 16,
  },

  label: {
    fontFamily: "Itim_400Regular",
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    width: "100%",
    fontFamily: "Itim_400Regular",
    color: "#000",
  },
  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    width: "100%",
    overflow: Platform.OS === "ios" ? "hidden" : "visible",
  },
  pickerNoBorder: {
    width: "100%",
    height: 54, // comfortable touch
    paddingLeft: 10,
    paddingRight: 32,
    justifyContent: "center",
  },
  deptRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    marginBottom: 6,
    marginRight: 6,
  },
  checkboxSelected: {
    borderColor: PRIMARY,
    backgroundColor: "#F1F0FF",
  },
  checkboxSquare: {
    width: 11,
    height: 11,
    borderRadius: 2,
    borderWidth: 1.3,
    borderColor: "#AAA",
    marginRight: 6,
  },
  checkboxSquareSelected: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY,
  },
  checkboxLabel: {
    fontFamily: "Itim_400Regular",
    fontSize: 14,
    color: "#000",
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    fontFamily: "RaviPrakash_400Regular",
    color: "#FFFFFF",
    fontSize: 18,
    letterSpacing: 0.3,
  },
  infoText: {
    fontFamily: "Itim_400Regular",
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  errorText: {
    fontFamily: "Itim_400Regular",
    fontSize: 12,
    color: "#ff3333",
    marginBottom: 4,
  },
});

export default AddComplain;
