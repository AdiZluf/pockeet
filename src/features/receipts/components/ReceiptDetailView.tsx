import { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Button, StatusChip, Surface, Text } from "@/components/ui";
import { useIconColors } from "@/theme";
import { formatMoney, moneyWritingProps } from "@/utils/money";
import {
  getReceiptWithImages,
  softDeleteReceipt,
} from "@/db/repositories/receiptRepository";

import { useReceiptNavigation } from "../hooks/useReceiptNavigation";
import {
  formatReceiptDate,
  isParsedReceipt,
  receiptStatusI18nKey,
  receiptStatusVariant,
} from "../utils/receiptDisplay";

type ReceiptDetailViewProps = {
  receiptId: string;
};

type ReceiptDetail = NonNullable<Awaited<ReturnType<typeof getReceiptWithImages>>>;

export function ReceiptDetailView({ receiptId }: ReceiptDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const { openReview } = useReceiptNavigation();
  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const data = await getReceiptWithImages(receiptId);
    setReceipt(data);
  }, [receiptId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void load().finally(() => setLoading(false));
    }, [load]),
  );

  const handleBack = () => router.back();

  const handleDelete = () => {
    Alert.alert(t("receiptDetail.deleteTitle"), t("receiptDetail.deleteBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("receiptDetail.deleteConfirm"),
        style: "destructive",
        onPress: () => {
          void (async () => {
            try {
              setDeleting(true);
              await softDeleteReceipt(receiptId);
              router.back();
            } finally {
              setDeleting(false);
            }
          })();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text variant="body" muted>
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-5">
        <Text variant="body" muted>
          {t("receiptDetail.notFound")}
        </Text>
        <Button className="mt-4" label={t("capture.back")} onPress={handleBack} />
      </View>
    );
  }

  const parsed = isParsedReceipt(receipt.status, receipt.totalMinor);
  const title =
    receipt.merchantName ?? t("receipts.unnamedReceipt", { count: receipt.images.length || 1 });
  const categoryName = receipt.defaultCategory?.nameEn ?? null;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("capture.back")}
          onPress={handleBack}
          hitSlop={12}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface-muted"
        >
          <Ionicons name="chevron-back" size={24} color={iconColors.primary} />
        </Pressable>
        <Button
          variant="text"
          label={t("receiptDetail.delete")}
          onPress={handleDelete}
          block={false}
          loading={deleting}
          disabled={deleting}
          className="min-h-[44px]"
        />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-5 pb-32">
        <View className="gap-3">
          <StatusChip
            variant={receiptStatusVariant(receipt.status)}
            label={t(receiptStatusI18nKey(receipt.status))}
          />
          <Text variant="displayLg" align="start" className="leading-tight">
            {title}
          </Text>
          <Text variant="body" muted align="start">
            {formatReceiptDate(receipt.purchasedAt ?? receipt.createdAt)}
          </Text>
        </View>

        {receipt.images.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            {receipt.images.map((image, index) => (
              <Surface key={image.id} variant="elevated" className="me-3 overflow-hidden p-0">
                <Image
                  source={{ uri: image.localUri }}
                  className="h-52 w-40 bg-surface-muted"
                  resizeMode="cover"
                  accessibilityLabel={t("receiptDetail.imagePage", { page: index + 1 })}
                />
              </Surface>
            ))}
          </ScrollView>
        ) : null}

        {parsed && receipt.totalMinor != null ? (
          <Surface variant="hero" className="overflow-hidden">
            <View className="h-1 bg-accent" accessibilityElementsHidden />
            <View className="gap-2 bg-accent-soft px-6 py-5">
              <Text variant="micro" muted align="start" className="uppercase tracking-wide">
                {t("receiptDetail.total")}
              </Text>
              <Text variant="displayLg" tabular align="start" {...moneyWritingProps}>
                {formatMoney(receipt.totalMinor, receipt.currencyCode)}
              </Text>
              {categoryName ? (
                <Text variant="bodySm" muted align="start">
                  {t("receiptDetail.category", { name: categoryName })}
                </Text>
              ) : null}
            </View>
          </Surface>
        ) : (
          <Surface variant="inset" className="gap-3 p-5">
            <Text variant="label">{t("receiptDetail.stillAnalyzingTitle")}</Text>
            <Text variant="body" muted>
              {t("receiptDetail.stillAnalyzingBody")}
            </Text>
            <Button
              variant="secondary"
              label={t("receiptDetail.addDetails")}
              onPress={() => openReview(receiptId, "detail")}
              block={false}
              className="self-start px-5"
            />
          </Surface>
        )}

        {receipt.status === "ready" || receipt.status === "needs_review" ? (
          <Button
            label={t("receiptDetail.edit")}
            variant="secondary"
            onPress={() => openReview(receiptId, "detail")}
            className="mt-2"
          />
        ) : null}
      </ScrollView>
    </View>
  );
}
