import { TriangleAlert } from "lucide-react";

interface IProps {
  msg?: string;
}
const ErrorMessage = ({ msg }: IProps) => {
  return (
    msg && (
      <div className="flex gap-1 items-center text-red-500 ">
        <TriangleAlert size={20} />
        <span>{msg}</span>
      </div>
    )
  );
};

export default ErrorMessage;
