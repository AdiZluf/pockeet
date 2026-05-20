import { useCallback, useRef, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  Button,
  EmptyState,
  LoadingSkeleton,
  LoadingSkeletonGroup,
  PressableScale,
  ReceiptAttachmentPreview,
  StatusChip,
  Surface,
  Text,
} from "@/components/ui";
import { useIconColors, useTheme } from "@/theme";
import { isPdfUri } from "@/utils/receiptMedia";
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
  const { colors } = useTheme();
  const { openReview } = useReceiptNavigation();
  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const hasLoaded = useRef(false);

  const load = useCallback(async () => {
    const data = await getReceiptWithImages(receiptId);
    setReceipt(data);
  }, [receiptId]);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded.current) setLoading(true);
      void load().finally(() => {
        hasLoaded.current = true;
        setLoading(false);
      });
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

  if (loading && !receipt) {
    return (
      <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top + 8 }}>
        <LoadingSkeletonGroup busy label={t("common.loading")}>
          <LoadingSkeleton height={44} width={44} rounded="full" />
          <LoadingSkeleton height={32} width="70%" rounded="md" className="mt-6" />
          <LoadingSkeleton height={220} rounded="xl" className="mt-4" />
          <LoadingSkeleton height={100} rounded="xl" className="mt-4" />
        </LoadingSkeletonGroup>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View
        className="flex-1 justify-center bg-background px-5"
        style={{ paddingTop: insets.top }}
      >
        <EmptyState
          title={t("receiptDetail.notFoundTitle")}
          body={t("receiptDetail.notFound")}
          icon="document-outline"
          actionLabel={t("common.back")}
          onAction={handleBack}
        />
      </View>
    );
  }

  const parsed = isParsedReceipt(receipt.status, receipt.totalMinor);
  const title =
    receipt.merchantName ?? t("receipts.unnamedReceipt", { count: receipt.images.length || 1 });
  const categoryName = receipt.defaultCategory?.nameEn ?? null;
  const heroUri = receipt.images[0]?.localUri;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={handleBack}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated"
          style={{ borderWidth: 0.5, borderColor: colors.borderSubtle }}
        >
          <Ionicons name="chevron-back" size={24} color={iconColors.primary} />
        </PressableScale>
        <Button
          variant="destructive"
          label={t("receiptDetail.delete")}
          onPress={handleDelete}
          block={false}
          loading={deleting}
          disabled={deleting}
          className="min-h-[44px] border border-status-failed/25 bg-status-failed-bg px-4"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 px-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          <StatusChip
            variant={receiptStatusVariant(receipt.status)}
            label={t(receiptStatusI18nKey(receipt.status))}
          />
          <Text variant="titleLg" align="start" className="leading-tight">
            {title}
          </Text>
          <Text variant="body" muted align="start">
            {formatReceiptDate(receipt.purchasedAt ?? receipt.createdAt)}
          </Text>
        </View>

        {heroUri ? (
          <ReceiptAttachmentPreview
            uri={heroUri}
            accessibilityLabel={
              isPdfUri(heroUri)
                ? t("receiptDetail.pdfAttachment")
                : t("receiptDetail.imagePage", { page: 1 })
            }
            maxHeight={280}
          />
        ) : null}

        {receipt.images.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {receipt.images.map((image, index) => (
              <Surface key={image.id} variant="elevated" className="me-3 overflow-hidden p-0">
                {isPdfUri(image.localUri) ? (
                  <View className="h-20 w-16 items-center justify-center bg-accent-soft">
                    <Ionicons name="document-text-outline" size={24} color={iconColors.accent} />
                  </View>
                ) : (
                  <Image
                    source={{ uri: image.localUri }}
                    className="h-20 w-16 bg-surface-muted"
                    resizeMode="cover"
                    accessibilityLabel={t("receiptDetail.imagePage", { page: index + 1 })}
                  />
                )}
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
            <Text variant="label" align="start">
              {t("receiptDetail.stillAnalyzingTitle")}
            </Text>
            <Text variant="body" muted align="start" className="leading-6">
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
          />
        ) : null}
      </ScrollView>
    </View>
  );
}
