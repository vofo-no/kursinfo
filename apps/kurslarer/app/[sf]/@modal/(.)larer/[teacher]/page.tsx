import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default async function TeacherModal({
  params,
}: {
  params: Promise<{ sf: string; teacher: string }>;
}) {
  const { sf, teacher } = await params;
  return (
    <Modal className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      {sf} / {teacher}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </Modal>
  );
}
