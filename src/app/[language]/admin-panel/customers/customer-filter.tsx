"use client";

import { useTranslation } from "@/services/i18n/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/dist/client/components/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Role, RoleEnum } from "@/services/api/types/role";
import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
import { CustomerFilterType } from "./customer-filter-types";
type CustomerFilterFormData = CustomerFilterType;
export default function CustomerFilter() {
  // const { t } = useTranslation("admin-panel-customers");
  // const [filters, setFilters] = useState({
  //   search: "",
  //   status: "all",
  // });

  const { t } = useTranslation("admin-panel-users");
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<CustomerFilterFormData>({
    defaultValues: {
      roles: [],
    },
  });

  const { handleSubmit, reset } = methods;

  const handleClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line no-alert
    alert("clicked");
  };

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) {
      const filterParsed = JSON.parse(filter);
      reset(filterParsed);
    }
  }, [searchParams, reset]);
  return (
    <Box mb={2}>
      <FormProvider {...methods}>
        <Grid container spacing={2} alignItems="center">
          <form
            onSubmit={handleSubmit((data) => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("filter", JSON.stringify(data));
              router.push(
                window.location.pathname + "?" + searchParams.toString()
              );
            })}
          >
            <Grid sx={{ xs: 12, md: 3 }}>
              <FormMultipleSelectInput<CustomerFilterFormData, Pick<Role, "id">>
                name="roles"
                testId="roles"
                label={t("admin-panel-users:filter.inputs.role.label")}
                options={[
                  {
                    id: Number(RoleEnum.ADMIN),
                  },
                  {
                    id: Number(RoleEnum.USER),
                  },
                ]}
                keyValue="id"
                renderOption={(option: any) =>
                  t(`admin-panel-users:filter.inputs.role.options.${option.id}`)
                }
                renderValue={(values: any[]) =>
                  values
                    .map((value) =>
                      t(
                        `admin-panel-users:filter.inputs.role.options.${value.id}`
                      )
                    )
                    .join(", ")
                }
              />
            </Grid>
          </form>
          <Grid sx={{ xs: 12, md: 3 }} textAlign="right">
            <Button variant="contained" onClick={handleClick}>
              {t("filter.apply")}
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
}
