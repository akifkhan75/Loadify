import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  type?: 'feather' | 'material' | 'ionicons' | 'ant';
  style?: any;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', type = 'feather', style }) => {
  switch (type) {
    case 'material':
      return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
    case 'ionicons':
        return <Ionicons name={name} size={size} color={color} style={style} />;
    case 'ant':
        return <AntDesign name={name} size={size} color={color} style={style} />;
    case 'feather':
    default:
      return <Feather name={name} size={size} color={color} style={style} />;
  }
};

export default Icon;
