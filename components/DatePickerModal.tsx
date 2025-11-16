import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  minDate?: Date;
}

export function DatePickerModal({
  visible,
  onClose,
  onSelectDate,
  minDate,
}: DatePickerModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const SCREEN_WIDTH = Dimensions.get('window').width;

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDate = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const handleSelectDate = (day: number) => {
    const selectedDate = formatDate(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onSelectDate(selectedDate);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isDateDisabled = (day: number | null) => {
    if (!day || !minDate) return false;
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return checkDate < minDate;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <SafeAreaView style={styles.overlay}>
        <View style={[styles.modalContent, { width: SCREEN_WIDTH - 32 }]}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButtonContainer}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Select Date</Text>

            <View style={{ width: 60 }} />
          </View>

          {/* MONTH HEADER */}
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowButton}>
              <ChevronLeft size={24} color="#93c5fd" />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>

            <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
              <ChevronRight size={24} color="#93c5fd" />
            </TouchableOpacity>
          </View>

          {/* WEEK DAYS */}
          <View style={styles.weekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          {/* DAY GRID */}
          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              const disabled = isDateDisabled(day);

              return (
                <TouchableOpacity
                  key={index}
                  disabled={!day || disabled}
                  style={[
                    styles.dayButton,
                    !day && styles.emptyDay,
                    disabled && styles.disabledDay,
                  ]}
                  onPress={() => day && handleSelectDate(day)}
                >
                  {day && (
                    <Text
                      style={[
                        styles.dayText,
                        disabled && styles.disabledDayText,
                      ]}
                    >
                      {day}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /* DARK OVERLAY BACKGROUND */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3,6,23,0.75)', // dark neon overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  /* MAIN MODAL */
  modalContent: {
    backgroundColor: 'rgba(11,18,32,0.92)', 
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButtonContainer: {
    width: 60,
  },
  cancelButton: {
    fontSize: 15,
    fontWeight: '700',
    color: '#60a5fa',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e2e8f0',
  },

  /* MONTH HEADER */
  monthHeader: {
    marginTop: 20,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#e2e8f0',
  },

  /* WEEK DAYS */
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },

  /* CALENDAR GRID */
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  dayButton: {
    width: '13.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 10,
  },

  emptyDay: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  disabledDay: {
    opacity: 0.4,
  },

  dayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
  },

  disabledDayText: {
    color: '#64748b',
  },
});
