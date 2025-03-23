
const FormDivider = () => {
  return (
    <div className="relative mt-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-secondary/30 px-2 text-foreground/70">
          Or continue with
        </span>
      </div>
    </div>
  );
};

export default FormDivider;
