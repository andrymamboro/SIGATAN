import * as React from "react";

const badgeVariants = {
  default:
    "border-transparent bg-blue-600 text-white hover:bg-blue-700",
  secondary:
    "border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300",
  destructive:
    "border-transparent bg-red-600 text-white hover:bg-red-700",
  outline: "text-gray-800 border border-gray-400",
};

export function Badge({ className = '', variant = 'default', style, children, ...props }) {
  return (
    <View
      style={[
        {
          borderRadius: 999,
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingHorizontal: 10,
          paddingVertical: 4,
          backgroundColor:
            variant === 'default'
              ? '#2563eb'
              : variant === 'secondary'
              ? '#e5e7eb'
              : variant === 'destructive'
              ? '#dc2626'
              : 'transparent',
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={{
          color:
            variant === 'default'
              ? '#fff'
              : variant === 'secondary'
              ? '#1f2937'
              : variant === 'destructive'
              ? '#fff'
              : '#1f2937',
          fontWeight: 'bold',
          fontSize: 13,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

import { View, Text } from 'react-native';
