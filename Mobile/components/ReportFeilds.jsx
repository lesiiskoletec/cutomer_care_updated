// components/ReportFeilds.js
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
  Image,
  TextInput,
} from "react-native";

// Fonts
import {
  useFonts as useSuez,
  SuezOne_400Regular,
} from "@expo-google-fonts/suez-one";

// Icons
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  updateComplaintStatus,
  deleteComplaintById,
} from "../app/features/complainSlice";

const CARD_BG = "#CECECE";
const DESCRIPTION_BG = "#EEEEEE";
const PRIMARY = "#3E28FF";

// ✅ 4 statuses
const STATUS_OPTIONS = ["Pending", "Processing", "Solved", "Informed"];

// ✅ Step-by-step allowed transitions
const NEXT_STATUS = {
  Pending: "Processing",
  Processing: "Solved",
  Solved: "Informed",
  Informed: null,
};

// 🔹 View-model structure
const defaultComplaint = {
  _id: "",
  id: "",
  invoiceNumber: "",
  problem: "",
  customerName: "",
  subProblem: "",
  description: "",
  contactNumber: "",
  time: "",
  department: "",
  responsibleBy: "",
  status: "Pending",
  complaintNote: "",
};

/**
 * 🔹 Map raw Mongo complaint doc → clean cardData object with ONLY strings
 */
const mapComplaintToCardData = (c = {}) => {
  if (!c || typeof c !== "object") return { ...defaultComplaint };

  return {
    _id: c._id || c.id || "",
    id: c._id || c.id || "",
    invoiceNumber: c.InvoiceNumber || c.invoiceNumber || "",
    problem: (c.mainProblem && c.mainProblem.name) || c.problem || "",
    customerName: c.CustomerName || c.customerName || "",
    subProblem: (c.subProblem && c.subProblem.name) || c.subProblem || "",
    description: c.description || "",
    contactNumber: c.ContactNumber || c.contactNumber || "",
    time: c.createdTime || c.time || "",
    department:
      (c.ResponsibleDepartment && c.ResponsibleDepartment.name) ||
      c.department ||
      "",
    responsibleBy:
      (c.responsiblePerson && c.responsiblePerson.name) ||
      c.responsibleBy ||
      "",
    status: c.status || "Pending",
    complaintNote: c.complaintNote || "",
  };
};

const ReportField = ({
  visible, // optional controlled visible: for HomePage
  complaint, // raw complaint from API OR already mapped object
  onClose, // for controlled close
  onSave, // callback when saved or deleted – gets UPDATED RAW DOC or null
  showCard = true,
}) => {
  const dispatch = useDispatch();
  const [suezLoaded] = useSuez({ SuezOne_400Regular });

  /**
   * ✅ IMPORTANT
   * You MUST read logged-in user from redux to send changedBy
   * Adjust selector path if your auth slice is different.
   */
  const authUser =
    useSelector((state) => state.auth?.user) ||
    useSelector((state) => state.auth?.currentUser) ||
    useSelector((state) => state.user?.user) ||
    null;

  const changedBy =
    authUser?._id || authUser?.id || authUser?.userId || authUser?.uid || "";

  const [cardData, setCardData] = useState(
    complaint ? mapComplaintToCardData(complaint) : defaultComplaint
  );

  const [tempStatus, setTempStatus] = useState(cardData.status || "Pending");
  const [tempNote, setTempNote] = useState(cardData.complaintNote || "");

  const [editVisibleInternal, setEditVisibleInternal] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (complaint) {
      const mapped = mapComplaintToCardData(complaint);
      setCardData(mapped);
      setTempStatus(mapped.status || "Pending");
      setTempNote(mapped.complaintNote || "");
    }
  }, [complaint]);

  // ✅ Hooks must run always
  const nextAllowedStatus = useMemo(() => {
    const cur = (cardData && cardData.status) || "Pending";
    return NEXT_STATUS[cur] || null;
  }, [cardData?.status]);

  const isControlled = typeof visible === "boolean";
  const modalVisible = isControlled ? visible : editVisibleInternal;

  if (!suezLoaded) return null;
  if (!cardData || deleted) return null;

  const openEditModal = () => {
    setTempStatus(cardData.status || "Pending");
    setTempNote(cardData.complaintNote || "");
    if (!isControlled) setEditVisibleInternal(true);
  };

  const closeModal = () => {
    if (isControlled) onClose && onClose();
    else setEditVisibleInternal(false);
  };

  const handleSaveEdit = () => {
    const complaintId = cardData._id || cardData.id;

    if (!complaintId) {
      Alert.alert("Error", "Cannot update status. Complaint ID is missing.");
      return;
    }

    // ✅ REQUIRED by backend
    if (!changedBy) {
      Alert.alert(
        "Error",
        "changedBy (logged userId) is missing. Please login again."
      );
      return;
    }

    const current = cardData.status || "Pending";
    const mustBeNext = NEXT_STATUS[current];

    if (!mustBeNext) {
      Alert.alert(
        "Done",
        "This complaint is already Informed. No further steps."
      );
      return;
    }

    if (tempStatus !== mustBeNext) {
      Alert.alert(
        "Invalid Step",
        `You can only change status step-by-step.\n\nCurrent: ${current}\nNext: ${mustBeNext}`
      );
      return;
    }

    if (tempStatus === "Informed") {
      const noteStr = String(tempNote || "").trim();
      if (!noteStr) {
        Alert.alert(
          "Required",
          "Informed note is required when status is Informed."
        );
        return;
      }
    }

    if (updating) return;

    Alert.alert("Confirm", "Are you sure you want to update the status?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            setUpdating(true);

            const payload = {
              complaintId,
              status: tempStatus,
              changedBy, // ✅ FIXED: send userId
              complaintNote:
                tempStatus === "Informed" ? String(tempNote || "").trim() : undefined,
            };

            const resultAction = await dispatch(updateComplaintStatus(payload));

            if (updateComplaintStatus.rejected.match(resultAction)) {
              const errMsg = resultAction.payload || "Failed to update status";
              console.log("updateComplaintStatus failed:", errMsg);
              Alert.alert("Error", errMsg);
              return;
            }

            const updatedComplaint = resultAction.payload || {};
            const mapped = mapComplaintToCardData(updatedComplaint);
            setCardData(mapped);

            onSave && onSave(updatedComplaint);
            closeModal();
          } catch (err) {
            console.log("updateComplaintStatus error:", err);
            Alert.alert("Error", "Something went wrong while updating status.");
          } finally {
            setUpdating(false);
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    const complaintId = cardData._id || cardData.id;

    if (!complaintId) {
      Alert.alert("Error", "Cannot delete complaint. Complaint ID is missing.");
      return;
    }

    if (deleting) return;

    Alert.alert(
      "Delete complaint",
      "Are you sure you want to delete this complaint?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);

              const resultAction = await dispatch(deleteComplaintById(complaintId));

              if (deleteComplaintById.rejected.match(resultAction)) {
                const errMsg = resultAction.payload || "Failed to delete complaint";
                console.log("deleteComplaintById failed:", errMsg);
                Alert.alert("Error", errMsg);
                return;
              }

              setDeleted(true);
              onSave && onSave(null);
            } catch (err) {
              console.log("deleteComplaintById error:", err);
              Alert.alert("Error", "Something went wrong while deleting the complaint.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      {/* ===== CARD ===== */}
      {showCard && (
        <View style={styles.wrapper}>
          <View style={styles.card}>
            {/* Row 1 */}
            <View style={styles.row}>
              <View style={styles.leftPair}>
                <Text style={styles.label}>Invoice Number :</Text>
                <Text style={styles.value}>{cardData.invoiceNumber || "-"}</Text>
              </View>

              <View style={styles.rightPair}>
                <Text style={styles.label}>Problem :</Text>
                <Text style={styles.value}>{cardData.problem || "-"}</Text>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <View style={styles.leftPair}>
                <Text style={styles.label}>Customer Name :</Text>
                <Text style={styles.value}>{cardData.customerName || "-"}</Text>
              </View>

              <View style={styles.rightPair}>
                <Text style={styles.label}>Sub Problem :</Text>
                <Text style={styles.value}>{cardData.subProblem || "-"}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.singleRow}>
              <Text style={styles.label}>Description :</Text>
            </View>

            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{cardData.description || "-"}</Text>
            </View>

            {/* Status row */}
            <View style={styles.singleRow}>
              <View style={styles.inlinePair}>
                <Text style={styles.label}>Status :</Text>

                <View style={styles.statusRow}>
                  {STATUS_OPTIONS.map((s) => (
                    <Pressable key={s} style={styles.statusOption} onPress={openEditModal}>
                      <View
                        style={[
                          styles.radioOuter,
                          cardData.status === s && styles.radioOuterActive,
                        ]}
                      >
                        {cardData.status === s && <View style={styles.radioInner} />}
                      </View>
                      <Text
                        style={[
                          styles.statusText,
                          cardData.status === s && styles.statusTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Contact / Time */}
            <View style={styles.row}>
              <View style={styles.leftPair}>
                <Text style={styles.label}>Contact Number :</Text>
                <Text style={styles.value}>{cardData.contactNumber || "-"}</Text>
              </View>

              <View style={styles.rightPair}>
                <Text style={styles.label}>Time :</Text>
                <Text style={styles.value}>{cardData.time || "-"}</Text>
              </View>
            </View>

            {/* Department */}
            <View style={styles.singleRow}>
              <View style={styles.inlinePair}>
                <Text style={styles.label}>Responsible Department :</Text>
                <Text style={styles.value}>{cardData.department || "-"}</Text>
              </View>
            </View>

            {/* Responsible By */}
            <View style={styles.singleRow}>
              <View style={styles.inlinePair}>
                <Text style={styles.label}>Responsible By :</Text>
                <Text style={styles.value}>{cardData.responsibleBy || "-"}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <Pressable style={styles.iconBtn} onPress={openEditModal}>
                <Image source={editIcon} style={styles.icon} />
              </Pressable>

              <Pressable
                style={[styles.iconBtn, styles.iconBtnRight]}
                onPress={handleDelete}
                disabled={deleting}
              >
                <Image source={deleteIcon} style={styles.icon} />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ===== STATUS-ONLY EDIT MODAL ===== */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Status</Text>

            {/* Current */}
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.modalLabel}>Current Status</Text>
              <View style={styles.readonlyBox}>
                <Text style={styles.readonlyText}>{cardData.status || "Pending"}</Text>
              </View>
            </View>

            <Text style={styles.stepHint}>
              Step-by-step only: Pending → Processing → Solved → Informed
            </Text>

            {/* New status */}
            <Text style={styles.modalLabel}>Select New Status</Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((s) => {
                const isCurrent = (cardData.status || "Pending") === s;
                const isNextAllowed = nextAllowedStatus === s;
                const canPress = isNextAllowed;

                return (
                  <Pressable
                    key={s}
                    style={[
                      styles.statusOption,
                      !canPress && !isCurrent ? styles.disabledOption : null,
                    ]}
                    onPress={() => {
                      if (!canPress) return;
                      setTempStatus(s);
                    }}
                    disabled={!canPress}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        tempStatus === s && styles.radioOuterActive,
                        !canPress && !isCurrent ? styles.radioDisabled : null,
                      ]}
                    >
                      {tempStatus === s && <View style={styles.radioInner} />}
                    </View>

                    <Text
                      style={[
                        styles.statusText,
                        tempStatus === s && styles.statusTextActive,
                        !canPress && !isCurrent ? styles.textDisabled : null,
                      ]}
                    >
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {tempStatus === "Informed" && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.modalLabel}>Informed Note (Required)</Text>
                <TextInput
                  value={tempNote}
                  onChangeText={setTempNote}
                  placeholder="Type informed note..."
                  multiline
                  style={styles.noteInput}
                />
              </View>
            )}

            <View style={styles.modalButtonsRow}>
              <Pressable
                style={[styles.modalButton, styles.modalCancel]}
                onPress={closeModal}
                disabled={updating}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.modalSave]}
                onPress={handleSaveEdit}
                disabled={updating || !nextAllowedStatus}
              >
                <Text style={[styles.modalButtonText, { color: "#FFF" }]}>
                  {updating ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>

            {/* ✅ Debug only (remove later) */}
            {/* <Text style={{ marginTop: 10, fontSize: 10, color: "#666" }}>
              complaintId: {String(cardData._id || cardData.id)} | changedBy: {String(changedBy)}
            </Text> */}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, paddingTop: 12 },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  leftPair: { flex: 1, flexDirection: "row", alignItems: "center", flexShrink: 1 },
  rightPair: { flex: 1, flexDirection: "row", justifyContent: "flex-end", flexShrink: 1 },
  inlinePair: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  singleRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 10,
    color: "#000",
    marginRight: 4,
  },
  value: { fontSize: 10, color: "#111", flexShrink: 1 },
  descriptionBox: {
    backgroundColor: DESCRIPTION_BG,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  descriptionText: { fontSize: 10, color: "#000" },

  statusRow: { flexDirection: "row", flexWrap: "wrap", marginLeft: 4 },
  statusOption: { flexDirection: "row", alignItems: "center", marginRight: 8, marginTop: 2 },

  radioOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  radioOuterActive: { borderColor: PRIMARY },
  radioInner: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: PRIMARY },

  statusText: { fontSize: 10, color: "#333" },
  statusTextActive: { color: PRIMARY, fontWeight: "600" },

  actionsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  iconBtn: { paddingHorizontal: 4 },
  iconBtnRight: { marginLeft: 12 },
  icon: { width: 18, height: 18, resizeMode: "contain" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "88%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalTitle: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 18,
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 10,
  },
  modalLabel: { fontSize: 11, fontWeight: "600", color: "#000", marginTop: 4, marginBottom: 3 },
  readonlyBox: {
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
  },
  readonlyText: { fontSize: 11, color: "#444" },

  stepHint: { fontSize: 11, color: "#444", marginBottom: 8 },

  noteInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: "#111",
    backgroundColor: "#FFF",
    textAlignVertical: "top",
  },

  modalButtonsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 14 },
  modalButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginLeft: 8, borderWidth: 1 },
  modalCancel: { borderColor: "#999", backgroundColor: "#FFF" },
  modalSave: { borderColor: PRIMARY, backgroundColor: PRIMARY },
  modalButtonText: { fontSize: 12, fontWeight: "600", color: "#333" },

  disabledOption: { opacity: 0.45 },
  radioDisabled: { borderColor: "#999" },
  textDisabled: { color: "#777" },
});

export default ReportField;
