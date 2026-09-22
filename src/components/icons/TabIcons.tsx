import Svg, { Path, Circle } from 'react-native-svg';

export type TabIconProps = {
  focused: boolean;
  size?: number;
  color?: string;
};

const STROKE_WIDTH = 1.7;

export function HomeIcon({ focused, size = 22, color = '#23241f' }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12,3.5 L20.5,11 L20.5,20.5 L14.5,20.5 L14.5,14 L9.5,14 L9.5,20.5 L3.5,20.5 L3.5,11 Z"
        fill={focused ? color : 'none'}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PersonIcon({ focused, size = 22, color = '#23241f' }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={8.3}
        r={3.3}
        fill={focused ? color : 'none'}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
      />
      <Path
        d="M4.5,21 V18.5 A6.5,5 0 0 1 12,13.2 A6.5,5 0 0 1 19.5,18.5 V21 Z"
        fill={focused ? color : 'none'}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function HeartIcon({ focused, size = 22, color = '#23241f' }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12,20.2 C12,20.2 3.5,15 3.5,9.4 C3.5,6.4 5.8,4.2 8.6,4.2 C10.2,4.2 11.3,5 12,5.9 C12.7,5 13.8,4.2 15.4,4.2 C18.2,4.2 20.5,6.4 20.5,9.4 C20.5,15 12,20.2 12,20.2 Z"
        fill={focused ? color : 'none'}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function GearIcon({ focused, size = 22, color = '#23241f' }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M19.07,10.63 L21.42,10.17 L21.42,13.83 L19.07,13.37 A7.2,7.2 0 0 1 17.97,16.03 L19.96,17.37 L17.37,19.96 L16.03,17.97 A7.2,7.2 0 0 1 13.37,19.07 L13.83,21.42 L10.17,21.42 L10.63,19.07 A7.2,7.2 0 0 1 7.97,17.97 L6.63,19.96 L4.04,17.37 L6.03,16.03 A7.2,7.2 0 0 1 4.93,13.37 L2.58,13.83 L2.58,10.17 L4.93,10.63 A7.2,7.2 0 0 1 6.03,7.97 L4.04,6.63 L6.63,4.04 L7.97,6.03 A7.2,7.2 0 0 1 10.63,4.93 L10.17,2.58 L13.83,2.58 L13.37,4.93 A7.2,7.2 0 0 1 16.03,6.03 L17.37,4.04 L19.96,6.63 L17.97,7.97 A7.2,7.2 0 0 1 19.07,10.63 Z M9,12 A3,3 0 1 0 15,12 A3,3 0 1 0 9,12 Z"
        fill={focused ? color : 'none'}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
        fillRule="evenodd"
      />
    </Svg>
  );
}
