import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import Residences from "./page-content";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(
    params.language,
    "admin-panel-residences"
  );

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <Residences />;
}
