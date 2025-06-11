"use client";

import { User } from "@/services/api/types/user";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";
import useAuth from "@/services/auth/use-auth";

interface CustomerActionsProps {
  user: User;
  onSelect: (user: User) => void;
}

export default function CustomerActions({
  user,
  onSelect,
}: CustomerActionsProps) {
  const { t } = useTranslation("admin-panel-customers");
  const { user: authUser } = useAuth();
  const canDelete = user?.id !== authUser?.id;

  const handleEdit = () => {
    onSelect(user);
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={t("actions.edit")}>
        <IconButton size="small" onClick={handleEdit} color="primary">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {canDelete && (
        <Tooltip title={t("actions.delete")}>
          <IconButton size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
