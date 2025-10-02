import { APP_NAME, CLIENT_URL, type I18nService, PATHS } from "@/core";

import {
  Button,
  Heading,
  Link,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { TemplateWrapper } from "./components";

export interface IProps {
  token: string;
  i18n?: I18nService;
  language?: string;
}

export function VerificationEmailTemplate({
  token, i18n, language='en'
}: IProps) {
    const verifyUrl: string = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
    const t = i18n.t('mail.verification_email')

    return (
        <TemplateWrapper template='verification_email' language={language} i18n={i18n} >
            <Tailwind>
                <Section className="font-sans tracking-wide font-normal text-[#222222] mb-2 px-2">
                    <Heading as="h2" className="text-center">{t('title') || "Verify your email address"}</Heading>

                    <Text className="text-center">{t('intro', {app: APP_NAME}) || `Please confirm that you’d like to use this email address for your ${APP_NAME} account. Once confirmed, you’ll be able to start using ${APP_NAME}.`}</Text>
                </Section>

                <Button
                    className="box-border w-fit rounded-lg m-auto bg-[#2B7AFF] px-6 py-3 text-center font-normal font-sans traking-wider text-white"
                    href={verifyUrl}
                >
                    {t('cta') || "Verify email"}
                </Button>
                
                <Section className="text-center px-2 mt-4">
                    <Text className="text-center font-sans tracking-wide font-normal text-[#222222] m-0">{t('copyLinkHint') || "Or paste this link into your browser:"}</Text>
                    <Link href={verifyUrl} className="font-sans tracking-[0px] text-center text-sm w-full" >{verifyUrl}</Link>
                </Section>
            </Tailwind>
        </TemplateWrapper>
    );
}