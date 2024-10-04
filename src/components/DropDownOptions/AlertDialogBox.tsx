import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useState } from "react";

export const AlertDialogBox = ({
  id,
  open,
  pageName,
}: {
  id: string;
  open: boolean;
  pageName: string;
}) => {
  const handleDelete = async () => {
    try {
      const deleteUser = await axios.delete(`/api/${pageName}/${id}`);
      console.log({ deleteUser }); //TODO Remove
      if (deleteUser.status === 200) {
        location.reload();
      } else {
        console.error("Failed to delete user: ", deleteUser.status);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCancel = () => {
    location.reload();
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
