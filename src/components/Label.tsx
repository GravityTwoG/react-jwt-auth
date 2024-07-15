export const Label = (props: { children: React.ReactNode; label: string }) => {
  return (
    <label className="block mb-1">
      <p className="mb-2 cursor-pointer">{props.label}</p>
      {props.children}
    </label>
  );
};
