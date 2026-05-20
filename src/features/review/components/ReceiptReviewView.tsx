import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Button,
  DividerList,
  ElevatedGroup,
  EmptyState,
  FadeInView,
  LoadingSkeleton,
  LoadingSkeletonGroup,
  PressableScale,
  ReceiptAttachmentPreview,
  SectionHeader,
  StatusChip,
  Text,
} from "@/components/ui";
import { listCategories } from "@/db/repositories/categoryRepository";
import { getReceiptWithImages } from "@/db/repositories/receiptRepository";
import { useIconColors, useTheme } from "@/theme";
import { isPdfUri } from "@/utils/receiptMedia";

import { saveReceiptReview, validateForSave } from "../services/saveReceiptReview";
import type { ReviewFormDraft, ReviewSource } from "../types";
import { buildReviewFormFromReceipt } from "../utils/formState";
import { CategoryPickerSheet } from "./CategoryPickerSheet";
import { ReviewFieldRow } from "./ReviewFieldRow";
import { ReviewLineItemRow } from "./ReviewLineItemRow";
import {
  receiptStatusI18nKey,
  receiptStatusVariant,
} from "@/features/receipts/utils/receiptDisplay";

type ReceiptReviewViewProps = {
  receiptId: string;
  source: ReviewSource;
};

type FieldErrors = Partial<Record<"merchant" | "date" | "total" | "lineItems", string>>;

export function ReceiptReviewView({ receiptId, source }: ReceiptReviewViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("ILS");
  const [receiptStatus, setReceiptStatus] = useState<string>("processing");
  const [images, setImages] = useState<{ id: string; localUri: string }[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof listCategories>>>([]);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [form, setForm] = useState<ReviewFormDraft | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isReedit = source === "detail";
  const isManualEntry = receiptStatus === "processing" || receiptStatus === "draft";
  const isFreshParse = source === "scan" && receiptStatus === "needs_review";

  const load = useCallback(async () => {
    const [receipt, categoryRows] = await Promise.all([
      getReceiptWithImages(receiptId),
      listCategories(),
    ]);
    setCategories(categoryRows);
    if (!receipt) {
      setForm(null);
      return;
    }
    setCurrencyCode(receipt.currencyCode);
    setReceiptStatus(receipt.status);
    setImages(receipt.images.map((img) => ({ id: img.id, localUri: img.localUri })));
    setSelectedImageIndex(0);
    setForm(buildReviewFormFromReceipt(receipt));
  }, [receiptId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setFieldErrors({});
      void load().finally(() => setLoading(false));
    }, [load]),
  );

  const selectedCategoryName = useMemo(() => {
    if (!form?.categoryId) return null;
    const cat = categories.find((c) => c.id === form.categoryId);
    if (!cat) return null;
    return cat.nameEn;
  }, [categories, form?.categoryId]);

  const updateForm = (patch: Partial<ReviewFormDraft>) => {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
    setFieldErrors({});
  };

  const mapValidationErrors = (errors: ReturnType<typeof validateForSave>["errors"]): FieldErrors => {
    const mapped: FieldErrors = {};
    if (errors.merchant) mapped.merchant = t("review.errorMerchant");
    if (errors.date) mapped.date = t("review.errorDate");
    if (errors.total) mapped.total = t("review.errorTotal");
    if (errors.lineItems) mapped.lineItems = t("review.errorLineItems");
    return mapped;
  };

  const persist = async (status: "ready" | "needs_review", skipMismatchCheck = false) => {
    if (!form || saving) return;

    const validation = validateForSave(form);
    if (!validation.ok) {
      setFieldErrors(mapValidationErrors(validation.errors));
      return;
    }

    const runSave = async () => {
      setSaving(true);
      try {
        const result = await saveReceiptReview(receiptId, currencyCode, form, status);
        if (!result.ok) {
          setFieldErrors(mapValidationErrors(result.errors));
          return;
        }
        if (status === "ready") {
          router.replace("/(tabs)");
        } else if (isReedit) {
          router.back();
        } else {
          router.replace("/(tabs)");
        }
      } catch {
        Alert.alert(t("review.saveFailedTitle"), t("review.saveFailedBody"));
      } finally {
        setSaving(false);
      }
    };

    if (!skipMismatchCheck && validation.lineItemsMismatch) {
      Alert.alert(t("review.lineItemsWarningTitle"), t("review.lineItemsWarningBody"), [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("review.confirmAnyway"), onPress: () => void runSave() },
      ]);
      return;
    }

    await runSave();
  };

  const handleLooksGood = () => void persist("ready");
  const handleFixLater = () => void persist("needs_review", true);
  const handleSaveChanges = () => void persist("ready");

  if (loading) {
    return (
      <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top + 8 }}>
        <LoadingSkeletonGroup busy label={t("common.loading")} className="gap-6 pt-2">
          <View className="gap-3">
            <LoadingSkeleton height={28} width="55%" rounded="md" />
            <LoadingSkeleton height={18} width="85%" rounded="md" />
          </View>
          <LoadingSkeleton height={300} rounded="xl" />
          <View className="gap-3">
            <LoadingSkeleton height={16} width="40%" rounded="md" />
            <LoadingSkeleton height={200} rounded="xl" />
          </View>
          <View className="gap-3">
            <LoadingSkeleton height={16} width="35%" rounded="md" />
            <LoadingSkeleton height={140} rounded="xl" />
          </View>
        </LoadingSkeletonGroup>
      </View>
    );
  }

  if (!form) {
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
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const heroUri = images[selectedImageIndex]?.localUri;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-5 py-3">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated"
          style={{ borderWidth: 0.5, borderColor: colors.borderSubtle }}
        >
          <Ionicons name="chevron-back" size={24} color={iconColors.primary} />
        </PressableScale>
        <StatusChip
          variant={receiptStatusVariant(receiptStatus as Parameters<typeof receiptStatusVariant>[0])}
          label={t(receiptStatusI18nKey(receiptStatus as Parameters<typeof receiptStatusI18nKey>[0]))}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 pb-40"
        keyboardShouldPersistTaps="handled"
      >
        <FadeInView className="px-5 gap-2.5" delay={0}>
          <Text variant="titleLg" align="start">
            {t(isReedit ? "review.titleEdit" : "review.title")}
          </Text>
          <Text variant="body" muted align="start" className="leading-6">
            {t(
              isManualEntry
                ? "review.subtitleManual"
                : isFreshParse
                  ? "review.subtitleParsed"
                  : "review.subtitle",
            )}
          </Text>
        </FadeInView>

        {heroUri ? (
          <FadeInView className="px-5 gap-3" delay={80}>
            <ReceiptAttachmentPreview
              uri={heroUri}
              accessibilityLabel={
                isPdfUri(heroUri) ? t("review.pdfAttachment") : t("review.heroImage")
              }
              maxHeight={320}
            />
            {images.length > 1 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((image, index) => (
                  <PressableScale
                    key={image.id}
                    onPress={() => setSelectedImageIndex(index)}
                    accessibilityRole="button"
                    accessibilityLabel={t("capture.pageThumbA11y", {
                      page: index + 1,
                      total: images.length,
                    })}
                    className={`me-2 overflow-hidden rounded-lg border-2 ${
                      index === selectedImageIndex ? "border-accent" : "border-border-subtle"
                    }`}
                  >
                    {isPdfUri(image.localUri) ? (
                      <View className="h-16 w-12 items-center justify-center bg-accent-soft">
                        <Ionicons name="document-text-outline" size={20} color={iconColors.accent} />
                      </View>
                    ) : (
                      <Image source={{ uri: image.localUri }} className="h-16 w-12" resizeMode="cover" />
                    )}
                  </PressableScale>
                ))}
              </ScrollView>
            ) : null}
          </FadeInView>
        ) : null}

        <FadeInView className="gap-3" delay={160}>
          <SectionHeader title={t("review.detailsSection")} />
          <ElevatedGroup>
            <DividerList insetStart={false}>
            <ReviewFieldRow
              label={t("review.merchant")}
              value={form.merchantName}
              onChangeText={(merchantName) => updateForm({ merchantName })}
              placeholder={t("review.merchantPlaceholder")}
              error={fieldErrors.merchant}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <ReviewFieldRow
              label={t("review.date")}
              value={form.dateValue}
              onChangeText={(dateValue) => updateForm({ dateValue })}
              placeholder="YYYY-MM-DD"
              error={fieldErrors.date}
              keyboardType="numbers-and-punctuation"
              {...{ style: [{ writingDirection: "ltr" as const }] }}
            />
            <Pressable
              className="min-h-[68px] justify-center gap-1.5 px-4 py-3.5"
              accessibilityRole="button"
              accessibilityLabel={t("review.categoryA11y", {
                name: selectedCategoryName ?? t("review.categoryPlaceholder"),
              })}
              onPress={() => setCategorySheetOpen(true)}
            >
              <Text variant="caption" muted align="start">
                {t("review.category")}
              </Text>
              <View className="flex-row items-center justify-between gap-3">
                <Text variant="bodyLg" align="start" className="flex-1">
                  {selectedCategoryName ?? t("review.categoryPlaceholder")}
                </Text>
                <Ionicons name="chevron-down" size={20} color={iconColors.tertiary} />
              </View>
            </Pressable>
            <ReviewFieldRow
              label={t("review.total")}
              value={form.totalInput}
              onChangeText={(totalInput) => updateForm({ totalInput })}
              placeholder="0.00"
              error={fieldErrors.total}
              money
              keyboardType="decimal-pad"
            />
            </DividerList>
          </ElevatedGroup>
        </FadeInView>

        <FadeInView className="gap-3 px-5" delay={240}>
          <SectionHeader title={t("review.lineItemsSection")} />
          <ElevatedGroup>
            <DividerList insetStart={false}>
            {form.lineItems.map((item, index) => (
              <ReviewLineItemRow
                key={item.id}
                name={item.name}
                amountInput={item.amountInput}
                onChangeName={(name) => {
                  const lineItems = [...form.lineItems];
                  lineItems[index] = { ...lineItems[index], name };
                  updateForm({ lineItems });
                }}
                onChangeAmount={(amountInput) => {
                  const lineItems = [...form.lineItems];
                  lineItems[index] = { ...lineItems[index], amountInput };
                  updateForm({ lineItems });
                }}
                onRemove={() => {
                  const lineItems = form.lineItems.filter((_, i) => i !== index);
                  updateForm({
                    lineItems:
                      lineItems.length > 0
                        ? lineItems
                        : [{ id: randomUUID(), name: "", amountInput: "" }],
                  });
                }}
                canRemove={form.lineItems.length > 1}
                error={index === 0 ? fieldErrors.lineItems : undefined}
              />
            ))}
            </DividerList>
          </ElevatedGroup>
          <Button
            variant="secondary"
            label={t("review.addLineItem")}
            onPress={() =>
              updateForm({
                lineItems: [...form.lineItems, { id: randomUUID(), name: "", amountInput: "" }],
              })
            }
            block={false}
            className="mt-3 self-start px-5"
          />
        </FadeInView>
      </ScrollView>

      <View
        className="gap-3 border-t border-border-subtle bg-surface px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        {isReedit ? (
          <Button
            label={t("review.saveChanges")}
            onPress={handleSaveChanges}
            loading={saving}
            disabled={saving}
          />
        ) : (
          <>
            <Button
              label={t("review.looksGood")}
              onPress={handleLooksGood}
              loading={saving}
              disabled={saving}
            />
            <Button
              variant="secondary"
              label={t("review.fixLater")}
              onPress={handleFixLater}
              disabled={saving}
            />
          </>
        )}
      </View>

      <CategoryPickerSheet
        visible={categorySheetOpen}
        categories={categories}
        selectedId={form.categoryId}
        onSelect={(categoryId) => updateForm({ categoryId })}
        onClose={() => setCategorySheetOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}
