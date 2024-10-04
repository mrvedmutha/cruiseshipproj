"use client";
import * as react from "react";
import { userFormSchema } from "@/schema/userFormSchema";
import { IUser } from "@/types/userInterface";
import {
  Form,
  FormControl,
  FormDescription,
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
interface EditUserFormProps {
  userId: string;
}
interface IApiEditUserResponse<T> {
  data: T;
}

export function EditUserForm({ userId }: EditUserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = react.useState(false);
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
  react.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<IApiEditUserResponse<IUser>>(
          `/api/users/${userId}`
        );
        const userData = res.data.data;
        form.setValue("username", userData.username);
        form.setValue("fullName", userData.fullName);
        form.setValue("email", userData.email);
        form.setValue("password", userData.password);
        form.setValue("role", userData.role);
        form.setValue(
          "accountExpires",
          userData.accountExpires ? new Date(userData.accountExpires) : null
        );
      } catch (error: any) {
        console.error("Error fetching user: ", error.message);
      }
    };
    fetchUser();
  }, [userId, form]);
  const onUserFormSubmit: SubmitHandler<
    z.infer<typeof userFormSchema>
  > = async (data) => {
    setIsLoading(true);
    try {
      const resultData = await axios.put<IUser>(`/api/users/${userId}`, data);
      if (!resultData) {
        toast({
          variant: "destructive",
          title: "Error occured",
          description: "Error while updating user",
        });
      }
      console.log(resultData); //TODO remove
      await router.push("/admin/users");
      toast({
        variant: "default",
        title: "User updated",
        description: "User has baeen updated successfully",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
    } catch (error: any) {
      return toast({
        variant: "destructive",
        title: "Error occured while creating user",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetCalendar = () => {
    form.setValue("accountExpires", null);
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
            <div className="w-1/5">
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
                <Select onValueChange={field.onChange} value={field.value}>
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
          <div className="flex space-x-4 place-items-end">
            <div className="w-4/5">
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
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              new Date(field.value).toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
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
            </div>
            <div className="w-1/5">
              <Button
                className="w-full"
                type="button"
                onClick={handleResetCalendar}
              >
                Reset Calendar
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="w-full"
              type="submit"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
