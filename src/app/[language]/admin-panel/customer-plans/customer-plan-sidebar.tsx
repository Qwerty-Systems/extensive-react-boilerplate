"use client";

import { useState } from "react";
import { User } from "@/services/api/types/user";
import { useTranslation } from "@/services/i18n/client";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface CustomerPlanSidebarProps {
  CustomerPlan?: User | null;
  onClose?: () => void;
}

export default function CustomerPlanSidebar({
  CustomerPlan = null,
  onClose,
}: CustomerPlanSidebarProps) {
  const { t } = useTranslation("admin-panel-CustomerPlans");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: CustomerPlan?.firstName || "",
    lastName: CustomerPlan?.lastName || "",
    email: CustomerPlan?.email || "",
    phone: CustomerPlan?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {CustomerPlan
            ? t("sidebar.CustomerPlan")
            : t("sidebar.newCustomerPlan")}
        </Typography>

        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {isEditing ? (
        <>
          <TextField
            fullWidth
            label={t("form.firstName")}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label={t("form.lastName")}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label={t("form.email")}
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            type="email"
          />

          <TextField
            fullWidth
            label={t("form.phone")}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />

          <Box mt={3} display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={20} /> : undefined}
            >
              {t("actions.save")}
            </Button>

            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              {t("actions.cancel")}
            </Button>
          </Box>
        </>
      ) : CustomerPlan ? (
        <>
          <Typography variant="subtitle1" gutterBottom>
            {CustomerPlan.firstName} {CustomerPlan.lastName}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {CustomerPlan.email}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {CustomerPlan.phone}
          </Typography>

          <Box mt={3}>
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              {t("actions.edit")}
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t("sidebar.selectCustomerPlan")}
        </Typography>
      )}
    </Box>
  );
}
