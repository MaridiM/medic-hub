import {
  Button,
  Link,
  Text
} from "@react-email/components";
import { TemplateWrapper } from "./components";
import { CLIENT_URL, PATHS } from "@/core";
import { TVerificationContent } from "./template";


export interface IProps {
  token: string;
  content: TVerificationContent;
}

export function VerificationEmailTemplate({ token, content }: IProps) {
    const verifyUrl: string = PATHS.VERIFY_EMAIL(CLIENT_URL, token)

    return (
        <TemplateWrapper content={content}>
            <Text className="m-0 text-2xl font-bold leading-snug text-slate-900">{content.title ?? "Confirm your email"}</Text>
            <Text className="mt-2 mb-5 text-[15px] leading-6 text-slate-600">
                {content.intro ?? "Hello! To finish signing up, please confirm your email address. The button below will remain active for 24 hours."}
            </Text>

            {/* CTA */}
            <Button 
                href={verifyUrl}
                className="flex items-center m-auto justify-center max-w-fit rounded-lg bg-[#2B7AFF] px-6 py-3"
            >
                <span className="leading-4 text-sm font-normal text-white tracking-wide w-full">{content.cta ?? "Confirm email"}</span>
            </Button>

            <Text className="mt-4 mb-1 text-xs text-slate-500">
                {content.copyLinkHint ?? "If the button doesn’t work, copy and paste this link into your browser’s address bar:"}
            </Text>
            <Link
                href={verifyUrl}
                className="break-all text-xs text-[#2B7AFF]"
            >
                {verifyUrl}
            </Link>

            <Text className="m-0 text-xs text-slate-500">
                {content.legalNote ?? "If you didn’t sign up, you can safely ignore this email — your address will remain unchanged."}
            </Text>
        </TemplateWrapper>

    );
}