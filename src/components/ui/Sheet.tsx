import {
  Modal,
  Pressable,
  View,
  type ModalProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type SheetProps = ModalProps & {
  visible: boolean;
  onClose: () => void;
  /** iOS: fired after dismiss animation; use to run native pickers blocked by Modal. */
  onDismissed?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Sheet({
  visible,
  onClose,
  onDismissed,
  title,
  children,
  footer,
  ...modalProps
}: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onDismiss={onDismissed}
      {...modalProps}
    >
      <Pressable
        className="flex-1 bg-overlay"
        accessibilityLabel="Close sheet"
        onPress={onClose}
      />
      <View
        className="max-h-[90%] rounded-t-2xl bg-surface shadow-sheet"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="items-center py-2">
          <View className="h-1 w-9 rounded-full bg-surface-muted" />
        </View>
        {title ? (
          <View className="px-5 pb-3">
            <Text variant="titleMd">{title}</Text>
          </View>
        ) : null}
        <View className="px-5">{children}</View>
        {footer ? <View className="gap-3 px-5 pt-4">{footer}</View> : null}
      </View>
    </Modal>
  );
}
