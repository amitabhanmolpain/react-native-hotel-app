import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

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
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isDateDisabled = (day: number | null) => {
    if (!day || !minDate) return false;
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return checkDate < minDate;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Select Date</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <ChevronLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <ChevronRight size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              disabled={!day || isDateDisabled(day)}
              style={[
                styles.dayButton,
                !day && styles.emptyDay,
                isDateDisabled(day) && styles.disabledDay,
              ]}
              onPress={() => day && handleSelectDate(day)}
            >
              {day && (
                <Text
                  style={[
                    styles.dayText,
                    isDateDisabled(day) && styles.disabledDayText,
                  ]}
                >
                  {day}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  weekDays: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  dayButton: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyDay: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabledDay: {
    backgroundColor: '#f1f5f9',
    opacity: 0.5,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  disabledDayText: {
    color: '#cbd5e1',
  },
});
