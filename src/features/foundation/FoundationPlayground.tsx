import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  Button,
  Card,
  EmptyState,
  GroupedList,
  Input,
  ListRow,
  LoadingSkeleton,
  LoadingSkeletonGroup,
  Section,
  Sheet,
  StatusChip,
  Text,
} from "@/components/ui";
import { formatMoney } from "@/utils/money";

type FoundationPlaygroundProps = {
  /** When true, content is rendered without an outer ScrollView (for embedding in Home). */
  nested?: boolean;
};

export function FoundationPlayground({ nested }: FoundationPlaygroundProps = {}) {
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sampleInput, setSampleInput] = useState("");

  const body = (
    <>
        <View className="px-5">
          <Text variant="titleLg">{t("foundation.title")}</Text>
          <Text variant="body" muted className="mt-1">
            {t("foundation.subtitle")}
          </Text>
        </View>

        <Section title="Typography & money" first className="px-5">
          <Text variant="displayXl" tabular>
            {formatMoney(428050, "ILS")}
          </Text>
          <Text variant="caption" muted>
            Tabular nums · LTR amounts
          </Text>
        </Section>

        <Section title="Buttons" className="px-5">
          <View className="gap-3">
            <Button label="Primary" onPress={() => undefined} />
            <Button variant="secondary" label="Secondary" onPress={() => undefined} />
            <Button variant="text" label="Text action" onPress={() => undefined} />
            <Button variant="destructive" label="Destructive" onPress={() => undefined} />
            <Button label="Loading" loading onPress={() => undefined} />
          </View>
        </Section>

        <Section title="Status chips" className="px-5">
          <View className="flex-row flex-wrap gap-2">
            <StatusChip variant="processing" label={t("status.processing")} />
            <StatusChip variant="review" label={t("status.needs_review")} />
            <StatusChip variant="ready" label={t("status.ready")} />
            <StatusChip variant="failed" label={t("status.failed")} />
          </View>
        </Section>

        <Section title="Input" className="px-5">
          <Input
            label="Merchant"
            value={sampleInput}
            onChangeText={setSampleInput}
            placeholder="Shufersal"
          />
          <Input label="Total" money keyboardType="decimal-pad" placeholder="0.00" />
        </Section>

        <Section title="Card" className="px-5">
          <Card>
            <Text variant="label">Flat card</Text>
            <Text variant="body" muted className="mt-1">
              surface · radius-lg · p-4
            </Text>
          </Card>
        </Section>

        <Section title="Grouped list" className="px-5">
          <GroupedList>
            <ListRow
              title={<Text variant="label">Shufersal</Text>}
              subtitle={
                <Text variant="caption" muted>
                  May 18 · {t("status.ready")}
                </Text>
              }
              trailing={
                <Text variant="label" tabular>
                  {formatMoney(34280, "ILS")}
                </Text>
              }
            />
            <ListRow
              compact
              title={<Text variant="label">Settings row</Text>}
              trailing={<Text variant="caption">56pt</Text>}
            />
          </GroupedList>
        </Section>

        <Section title="Skeleton" className="px-5">
          <LoadingSkeletonGroup busy label={t("common.loading")}>
            <LoadingSkeleton height={48} rounded="lg" />
            <LoadingSkeleton height={16} width="70%" />
            <LoadingSkeleton height={16} width="50%" />
          </LoadingSkeletonGroup>
        </Section>

        <Section title="Empty state" className="px-5">
          <Card>
            <EmptyState
              title="No receipts yet"
              body="Foundation placeholder — not product copy."
              actionLabel="Primary action"
              onAction={() => setSheetOpen(true)}
            />
          </Card>
        </Section>

        <Section title="Sheet" className="px-5">
          <Button label="Open sheet" onPress={() => setSheetOpen(true)} />
        </Section>

      <Sheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Bottom sheet"
        footer={<Button label="Close" onPress={() => setSheetOpen(false)} />}
      >
        <Text variant="body" muted>
          Grabber · rounded top · overlay scrim. Product pickers will use this primitive.
        </Text>
      </Sheet>
    </>
  );

  if (nested) {
    return body;
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-2 pb-32 pt-4"
      accessibilityLabel={t("a11y.foundationScreen")}
    >
      {body}
    </ScrollView>
  );
}
