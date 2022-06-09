import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { CommonStyles } from "../style/CommonStyles";
import * as CommonColors from '../style/CommonColors';
import { formatDate } from "../util/db";

export default function DatePicker({ prompt, onChange = () => {} }) {
  const [date, setDate] = useState(null);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onDateChange = (event, selectedDate) => {
    console.log(event);

    setShow(false);

    if(event.type !== 'dismissed') {
      setDate(selectedDate);
      onChange(selectedDate);

      console.log(selectedDate);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    if(!date) setDate(new Date());

    showMode('date');
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatepicker} style={CommonStyles.textInput}>
        <Text style={{ color: date ? CommonColors.text : CommonColors.prompt }}>
          {date ? formatDate(date) : (prompt ? prompt : 'Datum wählen...')}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}