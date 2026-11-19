interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">{children}</div>
  );
};

export default StudentLayout;
