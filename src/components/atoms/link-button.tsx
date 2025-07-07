import type { TWComponentProps } from "@/utils/cx";
import { Link } from "./link";
import { Button, OutlinedButton } from "./button";

export const LinkButton = (props: TWComponentProps<typeof Link>) => {
  return (
    <Button title={props.title} asChild>
      <Link {...props} />
    </Button>
  );
};

export const OutlinedLinkButton = (props: TWComponentProps<typeof Link>) => {
  return (
    <OutlinedButton title={props.title} asChild>
      <Button title={props.title} asChild>
        <Link {...props} />
      </Button>
    </OutlinedButton>
  );
};
