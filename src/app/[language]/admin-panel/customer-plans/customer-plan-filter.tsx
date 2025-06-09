"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
export default function CustomerPlanFilter() {
  // const { register, handleSubmit, control, reset } =
  //   useForm<CustomerPlanFilterType>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const [customers, setCustomers] = useState<User[]>([]);
  // const [paymentPlans, setPaymentPlans] = useState<PaymentPlanEntity[]>([]);
  // const fetchGetUsers = useGetUsersService();
  // const fetchGetPaymentPlans = useGetPaymentPlansService();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const usersResponse = await fetchGetUsers({
  //       page: 1,
  //       limit: 100,
  //       filters: { role: "CUSTOMER" }
  //     });
  //     if (usersResponse.status === HTTP_CODES_ENUM.OK) {
  //       setCustomers(usersResponse.data.data);
  //     }

  //     const plansResponse = await fetchGetPaymentPlans({
  //       page: 1,
  //       limit: 100,
  //     });
  //     if (plansResponse.status === HTTP_CODES_ENUM.OK) {
  //       setPaymentPlans(plansResponse.data.data);
  //     }
  //   };

  //   fetchData();
  // }, [fetchGetUsers, fetchGetPaymentPlans]);

  const handleReset = () => {
    // reset();
    const params = new URLSearchParams(searchParams);
    params.delete("filter");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Box component="form" onChange={() => {} /**handleSubmit()**/}>
      <Grid container spacing={2}>
        {/* <Grid sx={{ xs: 12, md: 3 }}>
          <FormAutocomplete<CustomerPlanFilterType>
            name="customerId"
            control={control}
            options={customers}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            label="Customer"
          />
        </Grid>
        <Grid sx={{ xs: 12, md: 3 }}>
          <FormAutocomplete<CustomerPlanFilterType>
            name="planId"
            control={control}
            options={paymentPlans}
            getOptionLabel={(option) => option.name}
            label="Payment Plan"
          />
        </Grid>
        <Grid sx={{ xs: 12, md: 2 }}>
          <FormSelectInput<CustomerPlanFilterType>
            name="status"
            control={control}
            label="Status"
            options={Object.values(PlanStatusEnum)}
            renderOption={(option) => String(option)}
          />
        </Grid> */}
        <Grid sx={{ xs: 12, md: 2 }}>
          {/* <FormDateTimePickerInput<CustomerPlanFilterType>
            name="startDateFrom"
            label="Start Date From"
          /> */}
        </Grid>
        <Grid sx={{ xs: 12, md: 2 }}>
          {/* <FormDateTimePickerInput<CustomerPlanFilterType>
            name="startDateTo"
            label="Start Date To"
          /> */}
          <Grid sx={{ xs: 12, md: 2 }}>
            <Button variant="outlined" onClick={handleReset} fullWidth>
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
