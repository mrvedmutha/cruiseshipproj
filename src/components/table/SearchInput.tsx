"use client";
import { Input } from "@/components/ui/input";

interface IFilterInput {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ value, onChange }: IFilterInput) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
    />
  );
};

export default SearchInput;
