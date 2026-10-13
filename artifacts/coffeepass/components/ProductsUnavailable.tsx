export function ProductsUnavailable({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-[24px] border border-clay/30 bg-paper px-5 py-4 text-sm leading-relaxed text-bean"
    >
      {message}
    </div>
  );
}
