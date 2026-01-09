// screens/FullReport.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";

import {
  useFonts as useSuez,
  SuezOne_400Regular,
} from "@expo-google-fonts/suez-one";

import ReportField from "../components/ReportFeilds";
import {
  fetchAllComplaintsByUser,
  fetchComplaintsByFilterFull,
} from "../app/features/complainSlice";

const PRIMARY_BG = "#EBEBEB";
const screenWidth = Dimensions.get("window").width;

const STATUS_FILTER_OPTIONS = ["All", "Pending", "Processing", "Solved", "Informed"];
const STATUS_ORDER = ["Pending", "Processing", "Solved", "Informed"];
const STATUS_COLORS = {
  Pending: "#FFB020",
  Processing: "#34C759",
  Solved: "#FF3B30",
  Informed: "#0A84FF",
};

const formatTimeDisplay = (isoOrTime) => {
  if (!isoOrTime) return "";
  let date;
  if (isoOrTime instanceof Date) date = isoOrTime;
  else if (typeof isoOrTime === "string" && isoOrTime.includes("T")) date = new Date(isoOrTime);
  else {
    const [h = "0", m = "0"] = String(isoOrTime).split(":");
    date = new Date();
    date.setHours(Number(h) || 0, Number(m) || 0, 0, 0);
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  let displayHour = hours % 12;
  if (displayHour === 0) displayHour = 12;
  const minuteStr = minutes.toString().padStart(2, "0");
  const suffix = isPM ? "p.m." : "a.m.";
  return `${displayHour}.${minuteStr} ${suffix}`;
};

const mapComplaintToCardData = (c) => {
  const createdAtDate = c.createdAt ? new Date(c.createdAt) : null;

  return {
    id: c._id,
    invoiceNumber: c.InvoiceNumber,
    problem: c.mainProblem?.name || "N/A",
    customerName: c.CustomerName || "-",
    subProblem: c.subProblem?.name || "-",
    description: c.description,
    contactNumber: c.ContactNumber,
    time: c.createdTime || (createdAtDate ? formatTimeDisplay(createdAtDate) : ""),
    department: c.ResponsibleDepartment?.name || "-",
    responsibleBy: c.responsiblePerson?.name || "-",
    status: c.status || "Pending",
    complaintNote: c.complaintNote || "",
    _id: c._id,
  };
};

const FullReport = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const { allComplaints, allStatus, allError } = useSelector((state) => state.complaints);

  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(new Date());
  const [timeFilter, setTimeFilter] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [suezLoaded] = useSuez({ SuezOne_400Regular });

  useEffect(() => {
    if (!authUser) return;
    const uid = authUser?._id || authUser?.id;
    if (!uid) return;

    dispatch(fetchAllComplaintsByUser(uid));
  }, [authUser, dispatch]);

  if (!suezLoaded) return null;

  const statusCounts = STATUS_ORDER.map((name) => ({
    name,
    count: allComplaints.filter((c) => (c.status || "Pending") === name).length,
    color: STATUS_COLORS[name],
  }));

  const total = statusCounts.reduce((sum, s) => sum + s.count, 0);

  const chartData = statusCounts.map((s) => ({
    name: s.name,
    population: s.count,
    color: s.color,
    legendFontColor: "#000",
    legendFontSize: 8,
  }));

  const formatTime = (date) => {
    if (!date) return "";
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const isPM = hours >= 12;
    let displayHour = hours % 12;
    if (displayHour === 0) displayHour = 12;
    const minuteStr = minutes.toString().padStart(2, "0");
    const suffix = isPM ? "p.m" : "a.m";
    return `${displayHour}.${minuteStr} ${suffix}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const formatDateForQuery = (date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS !== "ios") setShowDatePicker(false);
    if (selectedDate) setDateFilter(selectedDate);
  };

  const onChangeTime = (event, selectedDate) => {
    if (Platform.OS !== "ios") setShowTimePicker(false);
    if (selectedDate) setTimeFilter(selectedDate);
  };

  const handleSearch = () => {
    if (!authUser) return;
    const uid = authUser?._id || authUser?.id;
    if (!uid) return;

    const params = { createdBy: uid };

    if (statusFilter && statusFilter !== "All") params.status = statusFilter;

    const dateStr = formatDateForQuery(dateFilter);
    if (dateStr) {
      params.fromDate = dateStr;
      params.toDate = dateStr;
    }

    if (invoiceNo.trim()) params.invoiceNo = invoiceNo.trim();
    if (mobileNumber.trim()) params.mobileNumber = mobileNumber.trim();

    dispatch(fetchComplaintsByFilterFull(params));
  };

  const handleReset = () => {
    setStatusFilter("All");
    setInvoiceNo("");
    setMobileNumber("");
    setDateFilter(new Date());

    if (!authUser) return;
    const uid = authUser?._id || authUser?.id;
    if (!uid) return;

    dispatch(fetchAllComplaintsByUser(uid));
  };

  const mappedComplaints = allComplaints.map(mapComplaintToCardData);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Full Report</Text>

        <View style={styles.chartWrapper}>
          <PieChart
            data={chartData}
            width={Math.min(screenWidth * 0.78, 340)}
            height={170}
            chartConfig={{
              color: () => "#000",
              labelColor: () => "#000",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="20"
            center={[65, 0]}
            hasLegend={false}
            absolute={false}
          />
        </View>

        <View style={styles.statusRow}>
          {statusCounts.map((s) => {
            const percent = total > 0 ? Math.round((s.count / total) * 100) : 0;
            return (
              <View key={s.name} style={styles.statusCol}>
                <Text style={[styles.statusLabel, { color: s.color }]}>{s.name}</Text>
                <Text style={[styles.percent, { color: s.color }]}>{percent}%</Text>
                <Text style={styles.count}>{s.count}</Text>
              </View>
            );
          })}

          <View style={styles.statusCol}>
            <Text style={styles.statusLabel}>Total</Text>
            <Text style={styles.count}>{total}</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Text style={styles.selectedStatusText}>{statusFilter}</Text>
              <Picker
                selectedValue={statusFilter}
                onValueChange={(val) => setStatusFilter(val)}
                style={styles.picker}
                dropdownIconColor="#000"
                mode="dropdown"
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <Picker.Item key={opt} label={opt} value={opt} color="#000" />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>Date</Text>
            <View style={styles.pickerWrapper}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  if (Platform.OS === "web") console.log("Date picker not supported on web preview.");
                  else setShowDatePicker(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.timeText}>{formatDate(dateFilter)}</Text>
                <Ionicons name="calendar-outline" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>Time</Text>
            <View style={styles.pickerWrapper}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  if (Platform.OS === "web") console.log("Time picker not supported on web preview.");
                  else setShowTimePicker(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.timeText}>{formatTime(timeFilter)}</Text>
                <Ionicons name="time-outline" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showDatePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={dateFilter}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
          />
        )}

        {showTimePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={timeFilter}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeTime}
          />
        )}

        <View style={styles.invoiceRow}>
          <View style={styles.invoiceBlock}>
            <Text style={styles.filterLabel}>Invoice Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={invoiceNo}
                onChangeText={setInvoiceNo}
                placeholder="LesiCC2025XXXX"
                placeholderTextColor="#555"
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.invoiceBlock}>
            <Text style={styles.filterLabel}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="07XXXXXXXX"
                placeholderTextColor="#555"
                keyboardType="phone-pad"
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.searchBlock}>
            <Text style={styles.filterLabel}>{""}</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.searchButton, { flex: 1, marginRight: 4 }]}
                activeOpacity={0.8}
                onPress={handleSearch}
              >
                <Ionicons name="search" size={14} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.searchButton, { flex: 1, backgroundColor: "#6B7280" }]}
                activeOpacity={0.8}
                onPress={handleReset}
              >
                <Ionicons name="refresh" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.reportWrapper}>
        {allStatus === "loading" && (
          <Text style={{ textAlign: "center", fontSize: 12 }}>
            Loading full report...
          </Text>
        )}

        {allStatus === "failed" && allError ? (
          <Text style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#FF3B30" }}>
            {allError}
          </Text>
        ) : null}

        {allStatus === "succeeded" && mappedComplaints.length === 0 && !allError && (
          <Text style={{ textAlign: "center", marginTop: 10, fontSize: 12 }}>
            No complaints found.
          </Text>
        )}

        {mappedComplaints.map((c) => (
          <ReportField key={c.id} complaint={c} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PRIMARY_BG },
  screenContent: { paddingBottom: 80 },
  container: { width: "100%", paddingTop: 30, backgroundColor: PRIMARY_BG },
  title: {
    fontSize: 20,
    color: "#3E28FF",
    fontFamily: "SuezOne_400Regular",
    marginBottom: 6,
    textAlign: "center",
  },
  chartWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 4,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  statusCol: {
    flexBasis: "22%",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    paddingVertical: 4,
    marginHorizontal: 2,
    marginBottom: 6,
  },
  statusLabel: { fontSize: 9, fontWeight: "600", color: "#000" },
  percent: { fontSize: 11, fontWeight: "700", marginTop: 1 },
  count: { fontSize: 10, fontWeight: "700", marginTop: 1 },

  filterRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  filterBlock: { flex: 1, marginRight: 6 },
  filterLabel: { fontSize: 10, fontWeight: "600", color: "#000", marginBottom: 3 },
  pickerWrapper: {
    backgroundColor: "transparent",
    borderRadius: 6,
    height: 40,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B0B0B0",
    paddingHorizontal: 6,
  },
  selectedStatusText: { fontSize: 10, color: "#000" },
  picker: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "transparent",
    backgroundColor: "transparent",
  },
  timeButton: {
    height: 40,
    width: "100%",
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeText: { color: "#000", fontSize: 10, fontWeight: "500" },

  invoiceRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 10,
    alignItems: "center",
  },
  invoiceBlock: { flex: 1, marginRight: 6 },
  inputWrapper: {
    backgroundColor: "transparent",
    borderRadius: 6,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#B0B0B0",
  },
  textInput: { fontSize: 10, color: "#000", paddingVertical: 0 },
  searchBlock: { width: 110, justifyContent: "flex-end" },
  searchButton: {
    height: 40,
    borderRadius: 6,
    backgroundColor: "#3E28FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginBottom: 0,
  },

  reportWrapper: { width: "100%", paddingHorizontal: 3, marginTop: 10, marginBottom: 16 },
});

export default FullReport;
