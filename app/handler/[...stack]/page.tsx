import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default async function Handler(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  return <StackHandler app={stackServerApp} {...props} params={params} searchParams={searchParams} />;
}
