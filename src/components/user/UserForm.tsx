"use client";
import * as react from "react";
import { userFormSchema } from "@/schema/userFormSchema";
import { IUser } from "@/types/userInterface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export function UserForm() {
  const router = useRouter();
  const [date, setDate] = react.useState<Date | null>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "",
      accountExpires: null,
    },
  });
  const onUserFormSubmit: SubmitHandler<
    z.infer<typeof userFormSchema>
  > = async (data) => {
    try {
      const checkExistingEmail = await axios.get(
        `/api/users/check-email?email=${data.email}`
      );
      console.log(checkExistingEmail.data.data); //TODO remove
      if (checkExistingEmail.data.data) {
        return toast({
          variant: "destructive",
          title: "Error occured while creating user",
          description: "Email already exists",
        });
      }
      await axios.post<IUser>("/api/users/create", data);
      await router.push("/admin/users");
      toast({
        variant: "default",
        title: "User created",
        description: "User has been created successfully",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
    } catch (error: any) {
      return toast({
        variant: "destructive",
        title: "Error occured while creating user",
        description: `Either username or email already exists or some error occured: ${error.message}`,
      });
    }
  };
  const passwordGenerator = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    form.setValue("password", password);
  };
  return (
    <div className="p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onUserFormSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4 place-items-end">
            <div className="w-4/5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Generate Password"
                        type="password"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/5 mb-0">
              <Button
                className="w-full"
                onClick={passwordGenerator}
                variant="default"
              >
                Generate
              </Button>
            </div>
          </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectGroup>
                    <SelectContent>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="MANAGER">MANAGER</SelectItem>
                      <SelectItem value="GUEST">GUEST</SelectItem>
                      <SelectItem value="CHEF">CHEF</SelectItem>
                      <SelectItem value="SUPERVISOR">SUPERVISOR</SelectItem>
                    </SelectContent>
                  </SelectGroup>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountExpires"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Expiry</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined} // Convert null to undefined
                        onSelect={(selectedDate) => {
                          field.onChange(selectedDate);
                          setDate(selectedDate as Date);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button className="w-full" type="submit" variant="default">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
