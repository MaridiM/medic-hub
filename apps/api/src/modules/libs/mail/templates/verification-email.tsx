
import {
  Button,
  Heading,
  Link,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { TemplateWrapper } from "./components";
import { type I18nService } from "@/core/i18n";
import { APP_NAME } from "@/core/config";

export interface IProps {
  url: string;
  i18n?: I18nService;
  lng?: string;
}

export function VerificationEmailTemplate({
  url, i18n, lng='en'
}: IProps) {
    
    const t = i18n.t('mail.verification_email', { lng })
    const tTemp = i18n.t('mail.template', { lng })

    return (
        <TemplateWrapper template='verification_email' lng={lng} i18n={i18n} >
            <Tailwind>
                <Section className="font-sans tracking-wide font-normal text-[#222222] mb-2 px-2">
                    <Heading as="h2" className="text-center">{t('title') || "Verify your email address"}</Heading>

                    <Text className="text-center">{t('intro', {app: APP_NAME}) || `Please confirm that you’d like to use this email address for your ${APP_NAME} account. Once confirmed, you’ll be able to start using ${APP_NAME}.`}</Text>
                </Section>

                <Button
                    className="box-border w-fit rounded-lg m-auto bg-[#2B7AFF] px-6 py-3 text-center font-normal font-sans traking-wider text-white"
                    href={url}
                >
                    {t('cta') || "Verify email"}
                </Button>
                
                <Section className="text-center px-2 mt-4">
                    <Text className="text-center font-sans tracking-wide font-normal text-[#222222] m-0">{tTemp('copyLinkHint') || "Or paste this link into your browser:"}</Text>
                    <Link href={url} className="font-sans tracking-[0px] text-center text-sm w-full" >{url}</Link>
                </Section>
            </Tailwind>
        </TemplateWrapper>
    );
}