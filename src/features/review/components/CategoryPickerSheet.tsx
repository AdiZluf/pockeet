import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import { GroupedList, ListRow, Sheet, Text } from "@/components/ui";
import type { categories } from "@/db/schema";

type Category = typeof categories.$inferSelect;

type CategoryPickerSheetProps = {
  visible: boolean;
  categories: Category[];
  selectedId: string | null;
  onSelect: (categoryId: string) => void;
  onClose: () => void;
};

export function CategoryPickerSheet({
  visible,
  categories,
  selectedId,
  onSelect,
  onClose,
}: CategoryPickerSheetProps) {
  const { t, i18n } = useTranslation();
  const isHe = i18n.language.startsWith("he");

  return (
    <Sheet visible={visible} onClose={onClose} title={t("review.categorySheetTitle")}>
      <ScrollView className="max-h-80">
        <GroupedList>
          {categories.map((category) => (
            <ListRow
              key={category.id}
              title={
                <Text variant="bodyLg" className={selectedId === category.id ? "text-accent" : undefined}>
                  {isHe ? category.nameHe : category.nameEn}
                </Text>
              }
              trailing={
                selectedId === category.id ? (
                  <Text variant="label" className="text-accent">
                    ✓
                  </Text>
                ) : null
              }
              onPress={() => {
                onSelect(category.id);
                onClose();
              }}
            />
          ))}
        </GroupedList>
      </ScrollView>
    </Sheet>
  );
}
