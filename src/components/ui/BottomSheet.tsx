import React, { useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS } from "../../constants/layout";
import { BlurView } from "expo-blur";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapHeight?: number;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  snapHeight = 400,
}: BottomSheetProps) {
  const translateY = useSharedValue(snapHeight);
  const opacity = useSharedValue(0);

  const open = useCallback(() => {
    opacity.value = withTiming(1, { duration: 100 });
    translateY.value = withSpring(0, {
      damping: 80,
      stiffness: 400,
    });
  }, [opacity, translateY]);

  const close = useCallback(() => {
    opacity.value = withTiming(0, { duration: 100 });
    translateY.value = withSpring(snapHeight, {
      damping: 80,
      stiffness: 400,
    });
  }, [opacity, translateY, snapHeight]);

  useEffect(() => {
    if (visible) {
      open();
    } else {
      close();
    }
  }, [visible, open, close]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > snapHeight * 0.4) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, { damping: 50, stiffness: 500 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
            <BlurView
              intensity={20}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={[StyleSheet.absoluteFill, styles.backdropOverlay]} />
          </Pressable>
        </Animated.View>

        <View style={styles.container}>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[styles.sheet, { height: snapHeight }, sheetStyle]}
            >
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdropOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.dark.surface,
    borderTopLeftRadius: BORDER_RADIUS["2xl"],
    borderTopRightRadius: BORDER_RADIUS["2xl"],
    borderWidth: 1,
    borderColor: COLORS.glass.border,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});
