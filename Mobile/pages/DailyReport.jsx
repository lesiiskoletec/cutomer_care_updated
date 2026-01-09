// screens/DailyReport.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  useFonts as useSuez,
  SuezOne_400Regular,
} from "@expo-google-fonts/suez-one";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodayComplaintsByUser,
  fetchComplaintsByFilter,
} from "../app/features/complainSlice";

import ReportField from "../components/ReportFeilds";

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

const DailyReport = () => {
  const [statusFilter, setStatusFilter] = useState("All");

  const [timeFilter, setTimeFilter] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [suezLoaded] = useSuez({ SuezOne_400Regular });

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const { todayComplaints, todayStatus, todayError } = useSelector(
    (state) => state.complaints
  );

  useEffect(() => {
    if (!authUser) return;

    const uid =
      (authUser && typeof authUser._id === "string" && authUser._id) ||
      (authUser && typeof authUser.id === "string" && authUser.id);

    if (!uid) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    if (statusFilter === "All") {
      dispatch(fetchTodayComplaintsByUser(uid));
    } else {
      dispatch(
        fetchComplaintsByFilter({
          status: statusFilter,
          userId: uid,
          fromDate: dateStr,
          toDate: dateStr,
        })
      );
    }
  }, [authUser, statusFilter, dispatch]);

  if (!suezLoaded) return null;

  const statusCounts = STATUS_ORDER.map((name) => ({
    name,
    count: todayComplaints.filter((c) => (c.status || "Pending") === name).length,
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

  const onChangeTime = (event, selectedDate) => {
    if (Platform.OS !== "ios") setShowTimePicker(false);
    if (selectedDate) setTimeFilter(selectedDate);
  };

  const mappedComplaints = todayComplaints.map((c) => {
    const createdAtDate = c.createdAt ? new Date(c.createdAt) : null;

    return {
      id: c._id,
      invoiceNumber: c.InvoiceNumber,
      problem: c.mainProblem?.name || "N/A",
      customerName: c.CustomerName || "-",
      subProblem: c.subProblem?.name || "-",
      description: c.description,
      contactNumber: c.ContactNumber,
      time: c.createdTime || (createdAtDate ? formatTime(createdAtDate) : ""),
      department: c.ResponsibleDepartment?.name || "-",
      responsibleBy: c.responsiblePerson?.name || "-",
      status: c.status || "Pending",
      complaintNote: c.complaintNote || "",
      _id: c._id,
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: PRIMARY_BG }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Daily Report</Text>

          <View style={styles.chartWrapper}>
            <PieChart
              data={chartData}
              width={Math.min(screenWidth * 0.78, 340)}
              height={170}
              chartConfig={{
                backgroundColor: "transparent",
                backgroundGradientFrom: "transparent",
                backgroundGradientTo: "transparent",
                decimalPlaces: 0,
                color: () => "#000",
                labelColor: () => "#000",
                propsForBackgroundLines: {
                  stroke: "transparent",
                },
              }}
              accessor="population"
              backgroundColor="transparent"   // ✅ removes black box
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
                    <Picker.Item key={opt} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.filterBlock}>
              <Text style={styles.filterLabel}>Time</Text>
              <View style={styles.pickerWrapper}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => {
                    if (Platform.OS === "web")
                      console.log("Time picker not supported on web preview.");
                    else setShowTimePicker(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeText}>{formatTime(timeFilter)}</Text>
                  <Text style={styles.clockIcon}>🕒</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {showTimePicker && Platform.OS !== "web" && (
            <DateTimePicker
              value={timeFilter}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeTime}
            />
          )}
        </View>

        {todayStatus === "failed" && todayError ? (
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 12,
              color: "#FF3B30",
            }}
          >
            {todayError}
          </Text>
        ) : null}

        {todayStatus === "succeeded" && mappedComplaints.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 10, fontSize: 12 }}>
            No complaints found for today.
          </Text>
        ) : null}

        {mappedComplaints.map((c) => (
          <ReportField key={c.id} complaint={c} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: PRIMARY_BG,
  },
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
  filterBlock: {
    flex: 1,
    marginRight: 6,
    position: "relative",
    zIndex: 50,
    elevation: 5,
  },
  filterLabel: { fontSize: 10, fontWeight: "600", color: "#000", marginBottom: 3 },
  pickerWrapper: {
    backgroundColor: "transparent",
    borderRadius: 6,
    height: 38,
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
    height: 38,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeText: { color: "#000", fontSize: 10, fontWeight: "500" },
  clockIcon: { fontSize: 14 },
});

export default DailyReport;
