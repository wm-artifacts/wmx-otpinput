import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface OTPInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: (index: number) => void;
  onBlur?: (index: number) => void;
  onKeyPress?: (key: string, index: number) => void;
  onDelete?: (index: number) => void;
  length?: number;
  style?: any;
  boxStyle?: any;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  onDelete,
  length = 6,
  style = {},
  boxStyle = {},
}) => {
  const inputs = useRef<Array<TextInput | null>>([]);
  const [internalValue, setInternalValue] = useState('');
  
  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue;
  const paddedValue = (typeof currentValue === 'string' ? currentValue : '').padEnd(length, '');

  const handleChange = (text: string, idx: number) => {
    if (!/^\d$/.test(text)) return;
    const otpArray = paddedValue.split('');
    otpArray[idx] = text;
    const newOtp = otpArray.join('').slice(0, length);
    
    if (value === undefined) {
      setInternalValue(newOtp);
    }
    onChange && onChange(newOtp);

    if (text && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    const key = e.nativeEvent.key;
    const otpArray = paddedValue.split('');
  
    // Call onKeyPress event
    onKeyPress && onKeyPress(key, idx);
  
    if (key === 'Backspace') {
      if (otpArray[idx]) {
        // Case 1: Current box has value → just clear this one
        otpArray[idx] = '';
        const newOtp = otpArray.join('').slice(0, length);
        if (value === undefined) {
          setInternalValue(newOtp);
        }
        onChange && onChange(newOtp);
      } else if (idx > 0) {
        // Case 2: Current box is empty → go back and clear previous
        inputs.current[idx - 1]?.focus();
        otpArray[idx - 1] = '';
        const newOtp = otpArray.join('').slice(0, length);
        if (value === undefined) {
          setInternalValue(newOtp);
        }
        onChange && onChange(newOtp);
      }
    } else if (key === 'Delete') {
      otpArray[idx] = '';
      const newOtp = otpArray.join('').slice(0, length);
      if (value === undefined) {
        setInternalValue(newOtp);
      }
      onChange && onChange(newOtp);
      onDelete && onDelete(idx);
    } else if (key === 'ArrowLeft' && idx > 0) {
      inputs.current[idx - 1]?.focus();
    } else if (key === 'ArrowRight' && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };
  
  const handleFocus = (idx: number) => {
    onFocus && onFocus(idx);
  };

  const handleBlur = (idx: number) => {
    onBlur && onBlur(idx);
  };
  
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }).map((_, idx) => (
        <TextInput
          key={idx}
          ref={(ref) => {
            inputs.current[idx] = ref;
          }}
          style={[styles.box, { textAlign: 'center' }, boxStyle]}
          keyboardType="number-pad"
          maxLength={1}
          value={paddedValue[idx]}
          onChangeText={text => handleChange(text, idx)}
          onKeyPress={e => handleKeyPress(e, idx)}
          onFocus={() => handleFocus(idx)}
          onBlur={() => handleBlur(idx)}
          autoFocus={idx === 0}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  box: {
    width: 44,
    height: 54,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    fontSize: 22,
    color: '#000',
    backgroundColor: '#fff',
  },
});

export default OTPInput;
