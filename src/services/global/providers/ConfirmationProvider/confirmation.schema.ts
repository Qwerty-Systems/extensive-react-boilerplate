import { useTranslation } from "@/services/i18n/client";
import * as yup from "yup";
// eslint-disable-next-line react-hooks/rules-of-hooks
const { t } = useTranslation("global");
export const validationSchema = yup.object().shape({
  confirmationString: yup.string().label(t("confirmation")),
  confirmation: yup
    .string()
    .label(t("confirmation"))
    .when("confirmationString", {
      is: (confirmationString: string) => !!confirmationString,
      then: (schema) => {
        return schema
          .required()
          .oneOf(
            [yup.ref<string>("confirmationString")],
            t("confirmation_does_not_match")
          );
      },
    }),
});

export interface ConfirmationFormSchema {
  confirmationString: string;
  confirmation: string;
}
