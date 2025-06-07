// components/Collapsible.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

type Props = {
    expanded: boolean;
    children: React.ReactNode;
};

export const Collapsible = ({ expanded, children }: Props) => {
    const [measured, setMeasured] = useState(false);
    const contentHeight = useRef(0);
    const height = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(height.value, { duration: 300 }),
        overflow: 'hidden',
    }));

    const handleLayout = (event: LayoutChangeEvent) => {
        if (!measured) {
            contentHeight.current = event.nativeEvent.layout.height;
            height.value = expanded ? contentHeight.current : 0;
            setMeasured(true);
        }
    };

    useEffect(() => {
        if (measured) {
            height.value = expanded ? contentHeight.current : 0;
        }
    }, [expanded]);

    return (
        <Animated.View style={animatedStyle}>
            <View onLayout={handleLayout}>{children}</View>
        </Animated.View>
    );
};
