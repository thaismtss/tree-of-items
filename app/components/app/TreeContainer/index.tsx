export interface TreeContainerProps {
  children: React.ReactNode;
}

export default function TreeContainer({ children }: TreeContainerProps) {
  return <div className="flex flex-col gap-1">{children}</div>;
}
