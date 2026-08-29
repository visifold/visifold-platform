import type { ComponentPropsWithoutRef } from "react";

export type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className, ...props }: ContainerProps) {
  const classes = ["mx-auto w-full max-w-[96rem] px-6 md:px-10", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
}
